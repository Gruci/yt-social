// 인사이트 「장면 흐름」 탭용 데이터: 장면 분석이 있는 영상마다 제목·길이·장면 목록.
// 조회만 한다 (RLS). 편수가 적어 브라우저에서 모아 그린다.
import { sb } from "./api.js?v=1790835772";

const PAGE = 1000;   // Supabase 한 번 조회 최대 행 수

export async function all(build) {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build().range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...data);
    if (data.length < PAGE) return rows;
  }
}

export async function inChunks(ids, fetch) {
  const out = [];
  for (let i = 0; i < ids.length; i += 100) out.push(...await fetch(ids.slice(i, i + 100)));
  return out;
}

let cache = null;   // { at, data } — 선택을 바꿀 때마다 다시 받지 않게 1분 보관

/** [{videoId, title, duration, scenes}] — 장면 분석이 없는 영상은 뺀다 */
export async function load() {
  if (cache && Date.now() - cache.at < 60_000) return cache.data;
  const analyses = await all(() => sb.from("latest_analyses").select("id, video_id, clip_sec").order("id"));
  const [scenes, yts] = await Promise.all([
    inChunks(analyses.map((a) => a.id), (chunk) => all(() => sb.from("hook_scenes")
      .select("analysis_id, scene_no, start_sec, end_sec, role, devices")
      .in("analysis_id", chunk).order("analysis_id").order("scene_no"))),
    inChunks(analyses.map((a) => a.video_id), (chunk) => all(() => sb.from("yt_videos")
      .select("video_id, title, duration_sec").in("video_id", chunk).order("video_id"))),
  ]);
  const ytBy = Object.fromEntries(yts.map((y) => [y.video_id, y]));
  const scenesBy = {};
  for (const s of scenes) (scenesBy[s.analysis_id] ??= []).push(s);

  const data = analyses.filter((a) => scenesBy[a.id]?.length).map((a) => {
    const list = scenesBy[a.id];
    const yt = ytBy[a.video_id];
    return {
      videoId: a.video_id, title: yt?.title || a.video_id, scenes: list,
      duration: a.clip_sec || yt?.duration_sec || Math.max(...list.map((s) => s.end_sec)),
    };
  });
  cache = { at: Date.now(), data };
  return data;
}

/** 긴 제목 줄이기: 앞과 끝을 남긴다 (시리즈물은 끝의 "1화·2화" 로 갈린다) */
export function shortTitle(title, n = 24) {
  const ch = [...String(title)];
  if (ch.length <= n) return title;
  const tail = Math.floor(n / 3);
  return `${ch.slice(0, n - tail - 1).join("").trim()}…${ch.slice(-tail).join("").trim()}`;
}
