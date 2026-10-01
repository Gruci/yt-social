// 라우터 + 로그인 흐름. 주소는 해시(#/...)로 나눠 GitHub Pages 에서 새로고침해도 깨지지 않게 한다.
import * as api from "./api.js?v=1790835772";
import { esc, initTooltip } from "./ui.js?v=1790835772";
import * as admin from "./pages/admin.js?v=1790835772";
import * as guide from "./pages/guide.js?v=1790835772";
import * as home from "./pages/home.js?v=1790835772";
import * as insights from "./pages/insights.js?v=1790835772";
import * as settings from "./pages/settings.js?v=1790835772";
import * as video from "./pages/video.js?v=1790835772";
import * as videos from "./pages/videos.js?v=1790835772";

const app = document.getElementById("app");
const nav = document.getElementById("nav");
const who = document.getElementById("who");
let timer = null;
let me = null;

function loginPage(mode = "login") {
  nav.classList.add("hidden");
  who.innerHTML = "";
  const signup = mode === "signup";
  app.innerHTML = `<div class="login-wrap"><div class="center card login">
    <img class="login-logo" src="logo.svg" alt="" width="64" height="64">
    <h1>yt-social</h1>
    <p class="tagline">쇼츠 장면별 분석 · AI 생성 프롬프트 가이드</p>
    <ul class="features">
      <li>🎬 장면마다 연출·카메라 무브 정리</li>
      <li>✍️ 그대로 쓰는 영상 생성 프롬프트</li>
      <li>🔥 왜 먹혔는지, 내 영상에 쓰는 법</li>
    </ul>
    <p class="muted" style="margin:0 0 4px">가입 신청 후 관리자가 승인하면 쓸 수 있습니다. <a href="#/guide">이용 안내 보기</a></p>
    <form id="auth">
      <input type="email" name="email" placeholder="이메일" autocomplete="email" required>
      <input type="password" name="password" placeholder="비밀번호 (6자 이상)" minlength="6"
             autocomplete="${signup ? "new-password" : "current-password"}" required>
      <div class="row">
        <button type="submit">${signup ? "가입 신청" : "로그인"}</button>
        <button type="button" class="btn ghost" id="switch">${signup ? "로그인으로" : "회원가입"}</button>
      </div>
    </form>
    <p id="auth-msg" class="muted"></p></div></div>`;
  app.querySelector("#switch").onclick = (e) => { e.preventDefault(); loginPage(signup ? "login" : "signup"); };
  app.querySelector("#auth").addEventListener("submit", async (e) => {
    e.preventDefault();
    const out = app.querySelector("#auth-msg");
    const { email, password } = e.target;
    try {
      await (signup ? api.signUp(email.value, password.value) : api.login(email.value, password.value));
    } catch (err) {
      out.textContent = /Invalid login/.test(err.message) ? "이메일 또는 비밀번호가 맞지 않습니다."
        : /already registered/.test(err.message) ? "이미 가입된 이메일입니다. 로그인하세요." : `실패: ${err.message}`;
    }
  });
}

function pendingPage(email) {
  nav.classList.add("hidden");
  app.innerHTML = `<div class="center card"><h1>승인 대기 중</h1>
    <p>${esc(email)} 로 가입 신청이 접수됐습니다. 관리자가 승인하면 바로 쓸 수 있습니다.</p>
    <p class="muted">승인된 뒤 이 화면을 새로고침하세요.</p>
    <button id="out" class="btn ghost">로그아웃</button></div>`;
  app.querySelector("#out").addEventListener("click", async () => { await api.logout(); me = null; route(); });
}

// 오른쪽 위 내 계정: 누르면 설정·(관리자면) 관리·로그아웃. 관리 메뉴는 관리자에게만 그린다
function accountMenu(email) {
  who.innerHTML = `<div class="account">
    <button class="btn ghost" id="account-btn" aria-haspopup="true" aria-expanded="false">${esc(email)} ▾</button>
    <div class="account-menu hidden" id="account-menu" role="menu">
      <a href="#/settings" role="menuitem">설정 · 내 분석 키</a>
      <a href="#/guide" role="menuitem">이용 안내</a>
      ${me.isAdmin ? `<a href="#/admin" role="menuitem">관리 · 가입 승인</a>` : ""}
      <a href="#" id="logout" role="menuitem">로그아웃</a>
    </div></div>`;
  const btn = who.querySelector("#account-btn");
  const menu = who.querySelector("#account-menu");
  const toggle = (open) => { menu.classList.toggle("hidden", !open); btn.setAttribute("aria-expanded", String(open)); };
  btn.onclick = (e) => { e.stopPropagation(); toggle(menu.classList.contains("hidden")); };
  menu.onclick = () => toggle(false);
  document.addEventListener("click", () => toggle(false), { once: true });
  who.querySelector("#logout").onclick = async (e) => { e.preventDefault(); await api.logout(); me = null; route(); };
}

const ROUTES = [
  [/^#\/video\/([A-Za-z0-9_-]{11})/, video, "videos"],
  [/^#\/insights/, insights, "insights"],
  [/^#\/settings/, settings, "settings"],
  [/^#\/admin/, admin, "admin"],
  [/^#\/guide/, guide, "guide"],
  [/^#\/videos/, videos, "videos"],
  [/^#\/?/, home, "home"],
];

async function route() {
  clearTimeout(timer);
  const session = await api.session();
  if (!session) {
    // 이용 안내는 가입 전에도 볼 수 있다
    if ((location.hash || "").startsWith("#/guide")) {
      nav.classList.add("hidden");
      who.innerHTML = `<a class="btn ghost" href="#/">로그인 · 회원가입</a>`;
      return guide.render(app);
    }
    return loginPage();
  }
  me ??= await api.membership();
  if (!me.isUser) { me = null; return pendingPage(session.user.email); }
  me.hasKey ??= (await api.myKeys()).length > 0;

  nav.classList.remove("hidden");
  accountMenu(session.user.email);

  // 분석 키가 없으면 무엇을 누르든 키 등록부터 (가입 직후 첫 로그인)
  const wanted = location.hash || "#/";
  const hash = me.hasKey || wanted.startsWith("#/guide") ? wanted : "#/settings";
  const [path, query = ""] = hash.split("?");
  const [pattern, page, navKey] = ROUTES.find(([re]) => re.test(path));
  nav.querySelectorAll("a").forEach((a) => a.classList.toggle("on", a.dataset.nav === navKey));
  try {
    const again = await page.render(app, new URLSearchParams(query), path.match(pattern)?.[1], me);
    if (again) timer = setTimeout(route, again);   // 분석 중이면 주기적으로 다시 그림
  } catch (err) {
    app.innerHTML = `<div class="alert">${esc(err.message)}</div>`;
  }
}

initTooltip();
window.addEventListener("hashchange", route);
api.sb.auth.onAuthStateChange((event) => { if (event === "SIGNED_IN" || event === "SIGNED_OUT") { me = null; route(); } });
route();
