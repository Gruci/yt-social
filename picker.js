// 영상 고르기 표: 검색칸, 보이는 영상 전체 선택, 행마다 체크박스. 관리(영상 삭제)와 인사이트(범위)가 같이 쓴다
import { dateTime, esc, label } from "./ui.js?v=1790835772";

/** videos 는 video_list 행. checked(v) 처음에 체크할지, locked(v) 고를 수 없는 이유(빈 문자열이면 고를 수 있음),
 *  note(v) 오른쪽 칸 HTML (기본: 분석 시각) */
export function pickerHtml(videos, { checked = () => false, locked = () => "", note = (v) => dateTime(v.analyzed_at) } = {}) {
  const row = (v) => {
    const why = locked(v);
    const search = [v.title, v.channel_title, v.video_id, label("hook_type", v.hook_type), ...(v.keywords ?? [])]
      .join(" ").toLowerCase();
    return `<tr data-search="${esc(search)}">
      <td><input type="checkbox" value="${esc(v.video_id)}" ${checked(v) && !why ? "checked" : ""} ${why ? `disabled title="${esc(why)}"` : ""}></td>
      <td>${v.thumbnail_url ? `<img src="${esc(v.thumbnail_url)}" alt="" width="72" style="display:block;border-radius:4px">` : ""}</td>
      <td><a href="#/video/${esc(v.video_id)}">${esc(v.title || v.video_id)}</a><div class="muted">${esc(v.channel_title ?? "")}</div></td>
      <td class="muted">${note(v)}</td></tr>`;
  };
  return `<input type="text" class="picker-filter" placeholder="제목·채널·키워드로 찾기" style="width:100%;margin:12px 0">
    <div style="max-height:480px;overflow:auto">
    <table><thead><tr><th><input type="checkbox" class="picker-all" aria-label="보이는 영상 모두 선택"></th><th></th><th>영상</th><th>분석</th></tr></thead>
      <tbody>${videos.map(row).join("")}</tbody></table></div>`;
}

/** 검색·전체 선택을 붙인다. onChange(ids) 는 처음 한 번과 고를 때마다. 돌려주는 함수는 지금 고른 ID 목록 */
export function bindPicker(box, onChange = () => {}) {
  const checked = () => [...box.querySelectorAll("tbody input:checked")].map((c) => c.value);
  const changed = () => onChange(checked());
  box.querySelector("tbody").addEventListener("change", changed);
  box.querySelector(".picker-filter").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    box.querySelectorAll("tbody tr").forEach((tr) => { tr.hidden = Boolean(q) && !tr.dataset.search.includes(q); });
  });
  box.querySelector(".picker-all").addEventListener("change", (e) => {
    box.querySelectorAll("tbody tr:not([hidden]) input:not(:disabled)").forEach((c) => { c.checked = e.target.checked; });
    changed();
  });
  changed();
  return checked;
}
