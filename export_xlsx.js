// 엑셀 받기: 고른 영상(없으면 전체)의 분석 결과를 시트 두 개로 — 「영상」 한 편 = 한 행, 「장면」 장면 하나 = 한 행.
// python run.py export 와 같은 구성이고, 머리글·분류 값은 화면과 같은 한국어 이름으로 바꾼다. 조회만 한다 (RLS).
// SheetJS 는 1MB 라 받기를 누를 때만 불러온다.
import { sb } from "./api.js?v=1790835772";
import { all, inChunks } from "./insights_data.js?v=1790835772";
import { label } from "./ui.js?v=1790835772";

const XLSX_URL = "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";

const when = (v) => (v ? new Date(v).toLocaleString("sv-SE").slice(0, 16) : null);   // 2026-10-01 14:05
const byKey = (rows, key) => Object.fromEntries(rows.map((r) => [r[key], r]));
const groupBy = (rows, key) => rows.reduce((m, r) => ((m[r[key]] ??= []).push(r), m), {});

async function fetchAll(ids) {
  const base = () => sb.from("latest_analyses")
    .select("id, video_id, model, analyzed_at, hook_type, hook_summary, video_summary, story_structure, why_catchy,"
      + " recreate_checklist, first_dialogue_sec, first_cut_sec, uncertain_notes").order("id");
  const analyses = ids ? await inChunks(ids, (c) => all(() => base().in("video_id", c))) : await all(base);
  analyses.sort((a, b) => String(b.analyzed_at).localeCompare(String(a.analyzed_at)));
  const aIds = analyses.map((a) => a.id);
  const [scenes, keywords, yts] = await Promise.all([
    inChunks(aIds, (c) => all(() => sb.from("hook_scenes").select("*").in("analysis_id", c).order("analysis_id").order("scene_no"))),
    inChunks(aIds, (c) => all(() => sb.from("hook_keywords").select("analysis_id, keyword").in("analysis_id", c)
      .order("analysis_id").order("keyword"))),
    inChunks(analyses.map((a) => a.video_id), (c) => all(() => sb.from("yt_videos")
      .select("video_id, title, channel_id, channel_title, published_at, duration_sec, view_count, like_count, comment_count")
      .in("video_id", c).order("video_id"))),
  ]);
  const channelIds = [...new Set(yts.map((y) => y.channel_id).filter(Boolean))];
  const channels = await inChunks(channelIds, (c) => all(() => sb.from("yt_channels")
    .select("channel_id, subscriber_count").in("channel_id", c).order("channel_id")));
  return { analyses, scenes: groupBy(scenes, "analysis_id"), keywords: groupBy(keywords, "analysis_id"),
           yt: byKey(yts, "video_id"), channels: byKey(channels, "channel_id") };
}

function rows({ analyses, scenes, keywords, yt, channels }) {
  const videos = analyses.map((a) => {
    const y = yt[a.video_id] ?? {};
    return {
      "영상 ID": a.video_id, "링크": `https://www.youtube.com/watch?v=${a.video_id}`,
      "제목": y.title ?? null, "채널": y.channel_title ?? null, "업로드": when(y.published_at),
      "길이(초)": y.duration_sec ?? null, "조회수": y.view_count ?? null, "좋아요": y.like_count ?? null,
      "댓글": y.comment_count ?? null, "구독자": channels[y.channel_id]?.subscriber_count ?? null,
      "도입부 유형": label("hook_type", a.hook_type), "도입부 요약": a.hook_summary, "영상 요약": a.video_summary,
      "이야기 구조": a.story_structure, "왜 먹히나": a.why_catchy,
      "따라 만들 때 체크할 것": (a.recreate_checklist ?? []).join("\n"),
      "키워드": (keywords[a.id] ?? []).map((k) => k.keyword).join(", "),
      "첫 대사(초)": a.first_dialogue_sec, "첫 컷 전환(초)": a.first_cut_sec, "장면 수": (scenes[a.id] ?? []).length,
      "애매한 점": a.uncertain_notes, "분석 모델": a.model, "분석 시각": when(a.analyzed_at),
    };
  });
  const sceneRows = analyses.flatMap((a) => (scenes[a.id] ?? []).map((s) => ({
    "영상 ID": a.video_id, "제목": yt[a.video_id]?.title ?? null, "장면 번호": s.scene_no,
    "시작(초)": s.start_sec, "끝(초)": s.end_sec, "이야기 단계": label("scene_role", s.role), "장면 설명": s.description,
    "샷 크기": label("shot_size", s.shot_size), "앵글": label("camera_angle", s.camera_angle),
    "카메라 움직임": label("camera_move", s.camera_move), "구도": label("framing", s.framing), "연출": s.directing,
    "인물": s.characters, "배경": s.setting, "대사": s.dialogue, "화면 글자": s.on_screen_text, "소리": s.sound,
    "재미 요소": (s.devices ?? []).map((d) => label("device", d)).join(", "),
    "생성 프롬프트": s.generation_prompt, "왜 먹히나": s.why_it_works,
  })));
  return { videos, scenes: sceneRows };
}

// 열 너비: 머리글과 앞쪽 200행 중 가장 긴 값 기준, 60자에서 자른다 (한글은 두 칸으로 셈)
function sheet(XLSX, data) {
  const ws = XLSX.utils.json_to_sheet(data);
  const width = (v) => [...String(v ?? "").split("\n")[0]].reduce((n, c) => n + (c.charCodeAt(0) > 0x2e80 ? 2 : 1), 0);
  ws["!cols"] = Object.keys(data[0] ?? {}).map((k) => ({
    wch: Math.min(60, Math.max(width(k), ...data.slice(0, 200).map((r) => width(r[k])))) + 2,
  }));
  return ws;
}

/** ids 가 없으면 분석한 영상 전체. 파일을 내려받게 하고 {videos, scenes} 개수를 돌려준다 */
export async function downloadXlsx(ids = null) {
  const { videos, scenes } = rows(await fetchAll(ids));
  if (!videos.length) throw new Error("받을 분석 결과가 없어요.");
  const XLSX = await import(XLSX_URL);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet(XLSX, videos), "영상");
  XLSX.utils.book_append_sheet(wb, sheet(XLSX, scenes), "장면");
  const day = new Date().toLocaleDateString("sv-SE");
  XLSX.writeFile(wb, `yt-social_${ids ? "고른영상" : "전체"}_${videos.length}편_${day}.xlsx`);
  return { videos: videos.length, scenes: scenes.length };
}
