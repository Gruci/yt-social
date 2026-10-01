// 인사이트 「범위」: 어떤 영상들을 모아 볼지 고르고(주소의 ids=), 같은 범위를 엑셀로 받는다
import * as api from "../api.js?v=1790835772";
import { downloadXlsx } from "../export_xlsx.js?v=1790835772";
import { bindPicker, pickerHtml } from "../picker.js?v=1790835772";
import { esc } from "../ui.js?v=1790835772";

/** 주소의 ids= → 영상 ID 목록. 없으면 null (분석한 영상 전체) */
export const scopeIds = (params) => params?.get("ids")?.split(",").filter(Boolean) ?? null;

/** 지금 주소에서 일부만 바꾼 인사이트 주소. 값이 null 이면 그 항목을 뺀다 (범위는 탭을 옮겨도 따라간다) */
export function insightsHash(params, changes = {}) {
  const q = new URLSearchParams(params ?? "");
  for (const [k, v] of Object.entries(changes)) (v ? q.set(k, v) : q.delete(k));
  return `#/insights?${q}`;
}

async function download(button, msg, ids) {
  button.disabled = true;
  msg.innerHTML = `<p class="muted">엑셀 파일 만드는 중…</p>`;
  try {
    const n = await downloadXlsx(ids);
    msg.innerHTML = `<p class="ok">받았어요: 영상 ${n.videos}편 · 장면 ${n.scenes}개</p>`;
  } catch (err) {
    msg.innerHTML = `<div class="alert">엑셀 받기 실패: ${esc(err.message)}</div>`;
  } finally {
    button.disabled = false;
  }
}

async function openPicker(panel, msg, params, ids) {
  const videos = (await api.listVideos()).filter((v) => v.analysis_id);
  panel.innerHTML = `<h2>모아 볼 영상 고르기</h2>
    <p class="muted">고른 영상만으로 인사이트를 다시 계산해요. 범위를 바꾼 뒤 받는 엑셀도 그 영상들만 담겨요.</p>
    ${pickerHtml(videos, { checked: (v) => !ids || ids.includes(v.video_id) })}
    <div class="row" style="margin-top:12px">
      <button id="scope-apply">이 영상들로 보기</button>
      <button class="btn ghost" id="scope-xlsx-picked">고른 영상 엑셀로 받기</button>
      <button class="btn ghost" id="scope-close">닫기</button></div>`;
  panel.classList.remove("hidden");
  const apply = panel.querySelector("#scope-apply");
  const xlsx = panel.querySelector("#scope-xlsx-picked");
  const checked = bindPicker(panel, (picked) => {
    apply.disabled = xlsx.disabled = !picked.length;
    apply.textContent = picked.length ? `고른 ${picked.length}편으로 보기` : "영상을 골라 주세요";
  });
  // 전부 고르면 주소에 목록을 싣지 않는다 — 새로 분석한 영상도 「전체」에 계속 들어오게
  const scope = () => (checked().length === videos.length ? null : checked());
  apply.addEventListener("click", () => { location.hash = insightsHash(params, { ids: scope()?.join(","), hl: null }); });
  xlsx.addEventListener("click", () => download(xlsx, msg, scope()));
  panel.querySelector("#scope-close").addEventListener("click", () => panel.classList.add("hidden"));
}

/** 탭 위 범위 줄: 지금 범위, 범위 고르기, 엑셀로 받기 */
export function renderScope(box, params) {
  const ids = scopeIds(params);
  box.innerHTML = `<div class="row" style="margin-bottom:12px">
      <span>범위 <strong>${ids ? `고른 영상 ${ids.length}편` : "분석한 영상 전체"}</strong></span>
      ${ids ? `<a href="${insightsHash(params, { ids: null, hl: null })}">전체로 보기</a>` : ""}
      <span class="row" style="margin-left:auto">
        <button class="btn ghost" id="scope-pick">범위 고르기</button>
        <button class="btn ghost" id="scope-xlsx">엑셀로 받기</button></span></div>
    <div id="scope-msg"></div>
    <div class="card hidden" id="scope-panel"></div>`;
  const msg = box.querySelector("#scope-msg");
  const panel = box.querySelector("#scope-panel");
  const xlsx = box.querySelector("#scope-xlsx");
  xlsx.addEventListener("click", () => download(xlsx, msg, ids));
  box.querySelector("#scope-pick").addEventListener("click", () => {
    if (!panel.classList.contains("hidden")) return panel.classList.add("hidden");
    openPicker(panel, msg, params, ids).catch((err) => { msg.innerHTML = `<div class="alert">${esc(err.message)}</div>`; });
  });
}
