// 첫 화면 (분석): 링크 넣기 + 인사이트. 키를 등록한 사람만 여기로 온다 (없으면 app.js 가 설정으로 보냄)
import * as api from "../api.js?v=1790835772";
import { dateTime, esc } from "../ui.js?v=1790835772";
import * as insights from "./insights.js?v=1790835772";

export async function render(el) {
  const recent = (await api.listVideos()).filter((v) => v.job_status === "queued" || v.job_status === "running");
  el.innerHTML = `
    <h1>분석</h1>
    <p class="sub">쇼츠 링크를 넣으면 장면마다 연출·카메라·생성 프롬프트·먹히는 이유를 뽑아 줍니다.</p><br>
    <div id="msg"></div>
    <form class="card analyze" id="analyze-form">
      <h2>링크 넣기</h2>
      <textarea name="links" placeholder="https://www.youtube.com/shorts/... (여러 개는 줄바꿈, 한 번에 5개까지)" required></textarea>
      <div class="row" style="margin-top:10px">
        <button type="submit">분석</button>
        <span class="muted">내 키로 분석합니다 · 40초 영상 한 편에 factchat 약 50크레딧 · 1분쯤 걸립니다 · <a href="#/guide">처음이면 이용 안내</a></span>
      </div>
    </form>
    ${recent.length ? `<div class="notice">분석 중 ${recent.length}편: ${recent.map((v) => `<a href="#/video/${esc(v.video_id)}">${esc(v.title || v.video_id)}</a>`).join(", ")}</div>` : ""}
    <div id="insights"></div>`;

  el.querySelector("#analyze-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const links = e.target.links.value.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
    const msg = el.querySelector("#msg");
    const send = async (targets, reanalyze) => {
      try {
        const { jobs } = await api.analyze(targets, reanalyze);
        location.hash = jobs.length === 1 ? `#/video/${jobs[0].video_id}` : "#/videos";
      } catch (err) {
        msg.innerHTML = `<div class="alert">${esc(err.message)}${/키가 없습니다/.test(err.message) ? ` — <a href="#/settings">설정으로</a>` : ""}</div>`;
      }
    };
    // 이미 분석된 영상이 있으면 바로 보내지 않고 물어본다 (다시 분석은 내 키로 비용이 다시 들고 결과를 덮어쓴다)
    const ids = [...new Set(links.map(api.parseVideoId).filter(Boolean))];
    let done;
    try {
      done = await api.analyzedAmong(ids);
    } catch (err) {
      msg.innerHTML = `<div class="alert">${esc(err.message)}</div>`;
      return;
    }
    if (!done.length) return send(links, false);
    const doneIds = new Set(done.map((v) => v.video_id));
    const fresh = ids.filter((id) => !doneIds.has(id));
    msg.innerHTML = `
      <div class="notice">
        <p><b>이미 분석한 영상이 ${done.length}편 있습니다.</b> 다시 분석하면 내 키로 비용이 다시 들고, 기존 결과를 새 결과로 덮어씁니다.</p>
        <ul>${done.map((v) => `<li><a href="#/video/${esc(v.video_id)}">${esc(v.title || v.video_id)}</a> <span class="muted">· ${dateTime(v.analyzed_at)} 분석</span></li>`).join("")}</ul>
        <div class="row">
          <button type="button" data-act="all">그래도 다시 분석</button>
          ${fresh.length ? `<button type="button" class="btn ghost" data-act="fresh">새 영상 ${fresh.length}편만 분석</button>` : ""}
          <button type="button" class="btn ghost" data-act="cancel">취소</button>
        </div>
      </div>`;
    msg.querySelector("[data-act=all]").addEventListener("click", () => send(links, true));
    msg.querySelector("[data-act=fresh]")?.addEventListener("click", () => send(fresh, false));
    msg.querySelector("[data-act=cancel]").addEventListener("click", () => { msg.innerHTML = ""; });
  });
  await insights.render(el.querySelector("#insights"), null, null, { embedded: true });
  return recent.length ? 8000 : 0;
}
