// Supabase 연결: 로그인, 조회(RLS 로 초대된 사람만), Edge Function 호출
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_KEY, SUPABASE_URL } from "./config.js?v=1790835772";

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

function check({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

// ---------------------------------------------------------------- 로그인

export async function session() {
  return (await sb.auth.getSession()).data.session;
}

export async function login(email, password) {
  check(await sb.auth.signInWithPassword({ email: email.trim(), password }));
}

/** 가입 신청. 메일 인증 없이 바로 계정이 생기고, 관리자 승인 전까지 데이터는 안 보인다 */
export async function signUp(email, password) {
  check(await sb.auth.signUp({ email: email.trim(), password }));
}

export async function changePassword(password) {
  check(await sb.auth.updateUser({ password }));
}

export async function logout() {
  await sb.auth.signOut();
}

export async function membership() {
  const isUser = check(await sb.rpc("is_app_user"));
  const isAdmin = isUser && check(await sb.rpc("is_app_admin"));
  return { isUser, isAdmin };
}

// ---------------------------------------------------------------- 조회

export async function listVideos({ keyword, hookType } = {}) {
  let q = sb.from("video_list").select("*").order("added_at", { ascending: false });
  if (hookType) q = q.eq("hook_type", hookType);
  if (keyword) q = q.contains("keywords", [keyword]);
  return check(await q);
}

// 링크에서 영상 ID. Edge Function analyze 의 parseVideoId 와 같은 규칙
const VIDEO_ID = /(?:v=|\/shorts\/|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{11})/;
export function parseVideoId(link) {
  const s = String(link).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  return s.match(VIDEO_ID)?.[1] ?? null;
}

// 이 중 이미 분석 결과가 있는 영상 (다시 분석 경고용)
export async function analyzedAmong(videoIds) {
  if (!videoIds.length) return [];
  return check(await sb.from("video_list").select("video_id, title, analyzed_at")
    .in("video_id", videoIds).not("analysis_id", "is", null));
}

export async function videoDetail(videoId) {
  return check(await sb.rpc("video_detail", { p_video_id: videoId }));
}

/** ids 를 주면 그 영상들만 모아 본다 (인사이트 「범위」). 없으면 전체 */
export async function insights(ids = null) {
  return check(await sb.rpc("insights", ids?.length ? { p_video_ids: ids } : {}));
}

export async function myKeys() {
  return check(await sb.from("user_api_keys").select("provider, key_hint, updated_at"));
}

export async function members() {
  return check(await sb.from("app_users").select("*").order("invited_at", { ascending: false }));
}

export async function setApproved(email, approved) {
  check(await sb.from("app_users").update({ approved }).eq("email", email));
}

export async function removeMember(email) {
  check(await sb.from("app_users").delete().eq("email", email));
}

/** 관리자만: 영상과 분석·YouTube 정보·작업 기록을 지운다. 지웠으면 true (SQL 함수 delete_video) */
export async function deleteVideo(videoId) {
  return check(await sb.rpc("delete_video", { p_video_id: videoId }));
}

// ---------------------------------------------------------------- Edge Function (키는 서버에만)

async function callFunction(name, method, body) {
  const { data, error } = await sb.functions.invoke(name, { method, body });
  if (error) {
    const detail = await error.context?.json?.().catch(() => null);
    throw new Error(detail?.error ?? error.message);
  }
  return data;
}

// reanalyze: 이미 분석된 영상도 다시 분석해 덮어쓴다 (사용자가 경고를 보고 고른 경우만)
export const analyze = (links, reanalyze = false) => callFunction("analyze", "POST", { links, reanalyze });
export const saveKey = (provider, key) => callFunction("save-key", "POST", { provider, key });
export const deleteKey = (provider) => callFunction("save-key", "DELETE", { provider });
