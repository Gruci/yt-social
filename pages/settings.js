// 설정: 내 분석 키 등록 (서버에서 암호화, 끝 4자리만 보임), 비밀번호 변경
import * as api from "../api.js?v=1790835772";
import { dateTime, esc } from "../ui.js?v=1790835772";

const PROVIDERS = [
  { id: "factchat", name: "고려대 factchat (추천)", href: "https://llm.korea.ac.kr/",
    how: "고려대 계정으로 로그인 → 좌측 하단 API Gateway → API 키 생성. 크레딧은 내 계정에서 빠집니다 (40초 영상 약 50크레딧)." },
  { id: "google", name: "Google Gemini (AI Studio)", href: "https://aistudio.google.com/apikey",
    how: "Google 계정으로 로그인 → Create API key. 무료 티어는 하루 요청 수가 적어 몇 편 못 합니다 (한 편에 호출 2~4번)." },
];

function keyRow(p, saved) {
  return `<dt><strong>${esc(p.name)}</strong></dt>
    <dd>${saved ? `<span class="ok">등록됨 (끝 ****${esc(saved.key_hint)}, ${dateTime(saved.updated_at)})</span>` : `<span class="muted">미등록</span>`}</dd>
    <dt></dt><dd class="muted">${esc(p.how)} <a href="${p.href}" target="_blank" rel="noopener">키 발급받기 ↗</a></dd>
    <dt></dt><dd><form class="row" data-provider="${p.id}" style="width:100%">
      <input type="password" name="key" placeholder="${saved ? "새 키로 바꾸려면 붙여넣기" : "키 붙여넣기"}" autocomplete="off" required>
      <button type="submit">${saved ? "바꾸기" : "등록"}</button>
      ${saved ? `<button type="button" class="btn ghost" data-delete="${p.id}">삭제</button>` : ""}
    </form></dd>`;
}

function passwordCard() {
  return `<div class="card pw"><h2>비밀번호 바꾸기</h2>
    <form class="row" id="password"><input type="password" name="password" placeholder="새 비밀번호 (6자 이상)" minlength="6" autocomplete="new-password" required>
    <button type="submit">바꾸기</button></form></div>`;
}

export async function render(el, _params, _arg, me = {}) {
  const keys = await api.myKeys();
  const byProvider = Object.fromEntries(keys.map((k) => [k.provider, k]));
  el.innerHTML = `
    ${keys.length ? `<h1>설정</h1>` : `<h1>시작하기 — 내 분석 키 등록</h1>
      <div class="notice">분석은 <strong>내 키</strong>로 합니다. 먼저 아래에서 키를 하나 등록하면 바로 분석 화면으로 넘어갑니다. 비용·보안이 궁금하면 <a href="#/guide">이용 안내</a>.</div>`}
    <p class="sub">키는 서버에서 암호화해 보관하고, 이 화면에도 다시 보여주지 않습니다.</p><br>
    <div id="msg"></div>
    <div class="card keys"><h2>내 분석 키</h2><dl class="facts">${PROVIDERS.map((p) => keyRow(p, byProvider[p.id])).join("")}</dl>
      <p class="muted" style="margin-top:12px">둘 다 있으면 factchat 을 씁니다. 모델은 gemini-3.8-flash 고정.</p></div>
    ${passwordCard()}`;

  const msg = el.querySelector("#msg");
  const rerender = () => render(el, _params, _arg, me);
  const afterSave = () => {
    if (!keys.length) { me.hasKey = true; location.hash = "#/"; } else rerender();   // 첫 등록이면 분석 화면으로
  };
  const fail = (err) => { msg.innerHTML = `<div class="alert">${esc(err.message)}</div>`; };
  el.querySelectorAll("form[data-provider]").forEach((f) => f.addEventListener("submit", async (e) => {
    e.preventDefault();
    try { await api.saveKey(f.dataset.provider, f.key.value); afterSave(); } catch (err) { fail(err); }
  }));
  el.querySelectorAll("[data-delete]").forEach((b) => b.addEventListener("click", async () => {
    if (!confirm("키를 삭제할까요?")) return;
    try { await api.deleteKey(b.dataset.delete); me.hasKey = keys.length > 1; rerender(); } catch (err) { fail(err); }
  }));
  el.querySelector("#password").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await api.changePassword(e.target.password.value);
      msg.innerHTML = `<div class="notice ok">비밀번호를 바꿨습니다.</div>`;
      e.target.reset();
    } catch (err) { fail(err); }
  });
  return 0;
}
