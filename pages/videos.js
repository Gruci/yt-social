// 영상 목록 (필터: 키워드, 도입부 유형)
import * as api from "../api.js?v=1790835772";
import { esc, label, labels, num } from "../ui.js?v=1790835772";

function card(v) {
  const thumb = v.thumbnail_url || `https://i.ytimg.com/vi/${v.video_id}/hqdefault.jpg`;
  let status = "";
  if (v.hook_type) {
    status = `<div><span class="badge">${esc(label("hook_type", v.hook_type))}</span></div>
      <div class="chips">${(v.keywords ?? []).slice(0, 5).map((k) => `<span class="chip">#${esc(k)}</span>`).join("")}</div>`;
  } else if (v.job_status === "queued" || v.job_status === "running") {
    status = `<div class="state">${v.job_status === "queued" ? "대기 중" : "분석 중…"}</div>`;
  } else if (v.job_status === "failed") {
    status = `<div class="state failed">분석 실패</div>`;
  } else {
    status = `<div class="state">분석 없음</div>`;
  }
  return `<a class="vcard" href="#/video/${esc(v.video_id)}">
    <div class="thumb" style="background-image:url('${esc(thumb)}')"></div>
    <div class="body">
      <div class="title">${esc(v.title || v.video_id)}</div>
      <div class="muted">${esc(v.channel_title || "")}${v.view_count !== null ? ` · 조회수 ${num(v.view_count)}` : ""}${v.duration_sec ? ` · ${v.duration_sec}초` : ""}</div>
      ${status}
    </div></a>`;
}

export async function render(el, params) {
  const keyword = params.get("keyword") || "";
  const hookType = params.get("hook_type") || "";
  const videos = await api.listVideos({ keyword, hookType });
  const busy = videos.some((v) => v.job_status === "queued" || v.job_status === "running");

  el.innerHTML = `
    <h1>영상</h1>
    <p class="sub">분석한 영상 전체 (전원 공유). 새로 분석하려면 <a href="#/">분석</a> 화면에서 링크를 넣으세요.</p><br>
    <form class="row" id="filter" style="margin-bottom:16px">
      <input type="text" name="keyword" value="${esc(keyword)}" placeholder="키워드 (예: 막장)">
      <select name="hook_type"><option value="">Hook 유형 전체</option>
        ${Object.entries(labels.hook_type).map(([c, n]) => `<option value="${c}" ${c === hookType ? "selected" : ""}>${esc(n)}</option>`).join("")}
      </select>
      <button type="submit" class="btn ghost">거르기</button>
      ${keyword || hookType ? `<a href="#/videos" class="muted">필터 해제</a>` : ""}
      <span class="muted" style="margin-left:auto">${videos.length}편</span>
    </form>
    ${videos.length ? `<div class="videos">${videos.map(card).join("")}</div>`
      : `<p class="muted">${keyword || hookType ? "조건에 맞는 영상이 없습니다." : "아직 분석한 영상이 없습니다. 분석 화면에서 링크를 넣어 보세요."}</p>`}`;

  el.querySelector("#filter").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const q = new URLSearchParams([...f].filter(([, v]) => v));
    location.hash = `#/videos?${q}`;
  });
  return busy ? 6000 : 0;   // 분석 중이면 6초 뒤 다시 그림
}
