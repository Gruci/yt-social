// 관리자 페이지: 가입 승인·취소·거절, 잘못 넣은 영상 삭제.
// 메뉴는 관리자에게만 보이지만, 실제로 막는 것은 DB 규칙이다 (RLS: app_users 는 관리자만 읽고 쓴다,
// delete_video 는 함수 안에서 관리자인지 확인한다).
import * as api from "../api.js?v=1790835772";
import { bindPicker, pickerHtml } from "../picker.js?v=1790835772";
import { dateTime, esc } from "../ui.js?v=1790835772";

function memberRow(u) {
  const actions = u.is_admin ? `<span class="badge">관리자</span>`
    : u.approved ? `<button class="btn ghost" data-approve="${esc(u.email)}" data-to="false">승인 취소</button>`
    : `<button data-approve="${esc(u.email)}" data-to="true">승인</button>
       <button class="btn ghost" data-remove="${esc(u.email)}">거절</button>`;
  return `<tr><td>${esc(u.email)}</td><td class="muted">${dateTime(u.invited_at)}</td><td>${actions}</td></tr>`;
}

async function adminCard() {
  const users = await api.members();
  const pending = users.filter((u) => !u.approved);
  const approved = users.filter((u) => u.approved);
  return `<div class="card"><h2>가입 승인</h2>
    <p class="muted">가입 신청한 사람이 여기 뜹니다. 승인하면 바로 쓸 수 있습니다. Supabase 대시보드 Table Editor → app_users 의 approved 를 체크해도 같습니다.</p>
    <h2 style="margin-top:16px">승인 대기 ${pending.length}명</h2>
    ${pending.length ? `<table><tbody>${pending.map(memberRow).join("")}</tbody></table>` : `<p class="muted">없음</p>`}
    <h2 style="margin-top:16px">사용 중 ${approved.length}명</h2>
    <table><tbody>${approved.map(memberRow).join("")}</tbody></table></div>`;
}

const busy = (v) => v.job_status === "queued" || v.job_status === "running";
const state = (v) => (busy(v) ? `<span class="badge">분석 중</span>`
  : v.analysis_id ? dateTime(v.analyzed_at) : v.job_status === "failed" ? "분석 실패" : "분석 없음");

// 목록에서 골라 지운다. 지운 뒤에는 이 카드만 다시 그린다
async function renderVideos(box, note = "") {
  const videos = await api.listVideos();
  box.innerHTML = `<h2>영상 삭제</h2>
    <p class="muted">잘못 넣은 영상을 골라 지웁니다. 분석 결과·장면·키워드·YouTube 정보·조회수 이력이 같이 지워지고 되돌릴 수 없습니다. 분석 중인 영상은 끝난 뒤 지울 수 있습니다.</p>
    ${note}
    ${videos.length ? `${pickerHtml(videos, { locked: (v) => (busy(v) ? "분석이 끝난 뒤 지울 수 있습니다" : ""), note: state })}
      <div class="row" style="margin-top:12px"><button id="delete-videos" style="background:var(--critical)">선택한 영상 삭제</button></div>`
      : `<p class="muted">저장된 영상이 없습니다.</p>`}`;
  if (!videos.length) return;
  const button = box.querySelector("#delete-videos");
  const checked = bindPicker(box, (ids) => {
    button.disabled = !ids.length;
    button.textContent = ids.length ? `선택한 ${ids.length}개 삭제` : "선택한 영상 삭제";
  });
  button.addEventListener("click", async () => {
    const ids = checked();
    const picked = videos.filter((v) => ids.includes(v.video_id));
    const names = picked.slice(0, 10).map((v) => `- ${v.title || v.video_id}`).join("\n");
    const more = picked.length > 10 ? `\n외 ${picked.length - 10}개` : "";
    if (!confirm(`${picked.length}개 영상을 지울까요? 되돌릴 수 없습니다.\n\n${names}${more}`)) return;
    button.disabled = true;
    const failed = [];
    for (const v of picked) {
      try { await api.deleteVideo(v.video_id); } catch (err) { failed.push(`${v.title || v.video_id}: ${err.message}`); }
    }
    const done = picked.length - failed.length;
    await renderVideos(box, (done ? `<p class="ok">${done}개 지웠습니다.</p>` : "")
      + (failed.length ? `<div class="alert">${failed.map(esc).join("<br>")}</div>` : ""));
  });
}

export async function render(el, _params, _arg, me) {
  if (!me.isAdmin) {
    el.innerHTML = `<p class="muted">관리자만 볼 수 있는 페이지입니다.</p>`;
    return 0;
  }
  el.innerHTML = `<h1>관리</h1><p class="sub">가입 신청을 승인하고, 잘못 넣은 영상을 지웁니다.</p><br><div id="msg"></div>
    ${await adminCard()}<div class="card" id="videos-card"></div>`;
  const msg = el.querySelector("#msg");
  const rerender = () => render(el, _params, _arg, me);
  const fail = (err) => { msg.innerHTML = `<div class="alert">${esc(err.message)}</div>`; };
  el.querySelectorAll("[data-approve]").forEach((b) => b.addEventListener("click", async () => {
    try { await api.setApproved(b.dataset.approve, b.dataset.to === "true"); rerender(); } catch (err) { fail(err); }
  }));
  el.querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", async () => {
    if (!confirm(`${b.dataset.remove} 의 가입 신청을 거절할까요?`)) return;
    try { await api.removeMember(b.dataset.remove); rerender(); } catch (err) { fail(err); }
  }));
  await renderVideos(el.querySelector("#videos-card"));
  return 0;
}
