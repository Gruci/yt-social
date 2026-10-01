// 영상 상세: 플레이어, 왜 먹히나, 장면 타임라인(누르면 그 장면으로 이동, 연출·생성 프롬프트), YouTube 정보, 조회수 추이
// 2026-09-29 이전 분석은 1초 단위 표로 보여준다
import * as api from "../api.js?v=1790835772";
import { date, dateTime, esc, label, num, secText, trendSvg } from "../ui.js?v=1790835772";

const yesNo = (v) => (v ? `<span class="dot-yes" title="있음"></span>` : "");

function secondsTable(segments) {
  return `<div class="scroll-x"><table class="seconds">
    <thead><tr><th>초</th><th>화면 텍스트</th><th>대사</th><th>인물</th><th>컷</th>
      <th>클로즈업</th><th>비현실</th><th>효과음</th><th>BGM</th></tr></thead>
    <tbody>${segments.map((s) => `<tr data-sec="${s.start_sec}">
      <td class="sec">${s.start_sec}~${s.start_sec + 1}초</td>
      <td>${s.on_screen_text ? `“${esc(s.on_screen_text_content)}”<br><span class="muted">${esc(label("text_type", s.text_type))}</span>` : `<span class="no">—</span>`}</td>
      <td>${s.dialogue ? `“${esc(s.dialogue_text)}”<br><span class="muted">${esc(label("dialogue_type", s.dialogue_type))}</span>` : `<span class="no">—</span>`}</td>
      <td>${s.num_characters}</td><td>${s.cut_count || ""}</td>
      <td>${yesNo(s.close_up)}</td><td>${yesNo(s.surreal_element)}</td><td>${yesNo(s.sound_effect)}</td><td>${yesNo(s.bgm)}</td>
    </tr>`).join("")}</tbody></table></div>`;
}

const t = (sec) => `${Number(sec).toFixed(1)}초`;

function catchyCard(a) {
  if (!a.why_catchy) return "";
  return `<div class="card"><h2>왜 먹히나 (가설)</h2>
    <p>${esc(a.why_catchy)}</p>
    ${a.story_structure ? `<p class="muted" style="margin-top:8px">구조 · ${esc(a.story_structure)}</p>` : ""}
    ${(a.recreate_checklist ?? []).length ? `<h2 style="margin-top:16px">내 영상에 쓰려면</h2>
      <ol class="checklist">${a.recreate_checklist.map((c) => `<li>${esc(c)}</li>`).join("")}</ol>` : ""}</div>`;
}

/** 장면 띠: 길이에 비례한 칸 (단일 색, 칸 사이 2px 틈). 누르면 그 장면으로 */
function sceneStrip(scenes, duration) {
  return `<div class="strip">${scenes.map((s) => `<button class="strip-cell" data-seek="${s.start_sec}" data-scene="${s.scene_no}"
      style="flex-grow:${Math.max(s.end_sec - s.start_sec, 0.2)}"
      data-tip="#${s.scene_no} ${t(s.start_sec)}~${t(s.end_sec)} · ${esc(label("scene_role", s.role))}"></button>`).join("")}</div>
    <div class="strip-axis"><span>0초</span><span>${duration}초</span></div>`;
}

function sceneCard(s) {
  const cam = [label("shot_size", s.shot_size), label("camera_angle", s.camera_angle),
               label("camera_move", s.camera_move), label("framing", s.framing)].map(esc).join(" · ");
  return `<div class="scene" id="scene-${s.scene_no}">
    <div class="scene-head">
      <button class="btn ghost seek" data-seek="${s.start_sec}">▶ ${t(s.start_sec)}~${t(s.end_sec)}</button>
      <strong>#${s.scene_no}</strong> <span class="badge">${esc(label("scene_role", s.role))}</span>
      <span class="chips">${(s.devices ?? []).map((d) => `<span class="chip">${esc(label("device", d))}</span>`).join("")}</span>
    </div>
    <p>${esc(s.description)}</p>
    ${s.dialogue || s.on_screen_text ? `<p class="muted">${s.dialogue ? `대사 “${esc(s.dialogue)}”` : ""}${s.dialogue && s.on_screen_text ? " · " : ""}${s.on_screen_text && s.on_screen_text !== s.dialogue ? `자막 “${esc(s.on_screen_text)}”` : ""}</p>` : ""}
    <dl class="facts">
      <dt>카메라</dt><dd>${cam}</dd>
      <dt>연출</dt><dd>${esc(s.directing)}</dd>
      <dt>왜 먹히나</dt><dd>${esc(s.why_it_works)}</dd>
      ${s.characters ? `<dt>인물</dt><dd>${esc(s.characters)}</dd>` : ""}
      <dt>배경</dt><dd>${esc(s.setting)}${s.sound ? ` · 소리: ${esc(s.sound)}` : ""}</dd>
    </dl>
    <div class="prompt"><code>${esc(s.generation_prompt)}</code>
      <button class="btn ghost copy" data-copy="${esc(s.generation_prompt)}">프롬프트 복사</button></div>
  </div>`;
}

function scenesCard(scenes, duration) {
  return `<div class="card"><h2>장면 ${scenes.length}개 — 누르면 그 장면으로 이동</h2>
    ${sceneStrip(scenes, duration)}
    <div class="scenes">${scenes.map(sceneCard).join("")}</div></div>`;
}

function youtubeCard(yt, channel) {
  const topics = (yt.topic_categories ?? []).map((t) => t.replace("https://en.wikipedia.org/wiki/", "")).join(", ");
  return `<div class="card"><h2>YouTube 정보</h2><dl class="facts">
    <dt>길이</dt><dd>${yt.duration_sec}초 · ${esc((yt.definition || "").toUpperCase())}</dd>
    <dt>업로드</dt><dd>${dateTime(yt.published_at)}</dd>
    <dt>카테고리</dt><dd>${esc(yt.category_id)}</dd>
    <dt>언어</dt><dd>${esc(yt.default_audio_language || yt.default_language || "—")}</dd>
    <dt>업로더 태그</dt><dd>${(yt.tags ?? []).length ? esc(yt.tags.join(", ")) : "없음"}</dd>
    <dt>주제</dt><dd>${esc(topics || "—")}</dd>
    <dt>공개 상태</dt><dd>${esc(yt.privacy_status)} · ${yt.made_for_kids ? "아동용" : "아동용 아님"}${yt.has_paid_product_placement ? " · 유료 PPL" : ""}</dd>
    ${channel ? `<dt>채널</dt><dd>${esc(channel.title)} ${esc(channel.custom_url || "")} · 구독자 ${num(channel.subscriber_count)} · 영상 ${num(channel.video_count)}개</dd>` : ""}
    <dt>받은 시각</dt><dd class="muted">${dateTime(yt.fetched_at)} (30일마다 갱신)</dd></dl>
    ${yt.description ? `<details style="margin-top:12px"><summary>설명</summary><p style="white-space:pre-wrap">${esc(yt.description)}</p></details>` : ""}</div>`;
}

function statsCard(stats) {
  const svg = trendSvg(stats.map((s) => ({ at: s.fetched_at, value: s.view_count })));
  return `<div class="card"><h2>조회수 추이</h2>${svg}
    <table style="margin-top:8px"><thead><tr><th>받은 날</th><th class="num">조회수</th><th class="num">좋아요</th><th class="num">댓글</th></tr></thead>
    <tbody>${stats.map((s) => `<tr><td>${date(s.fetched_at)}</td><td class="num">${num(s.view_count)}</td><td class="num">${num(s.like_count)}</td><td class="num">${num(s.comment_count)}</td></tr>`).join("")}</tbody></table>
    ${svg ? "" : `<p class="muted">30일마다 한 번씩 쌓입니다. 두 번째 기록부터 선으로 보입니다.</p>`}</div>`;
}

export async function render(el, _params, videoId) {
  const d = await api.videoDetail(videoId);
  if (!d) {
    el.innerHTML = `<p class="muted"><a href="#/">← 영상 목록</a></p><p>분석한 적 없는 영상입니다.</p>`;
    return 0;
  }
  const { analysis: a, yt, channel, job } = d;
  const running = job && (job.status === "queued" || job.status === "running");
  el.innerHTML = `
    <p class="muted"><a href="#/videos">← 영상 목록</a></p>
    <h1>${esc(yt?.title || videoId)}</h1>
    <p class="sub">${yt ? `${esc(yt.channel_title)} · ` : ""}<a href="https://www.youtube.com/watch?v=${esc(videoId)}" target="_blank" rel="noopener">YouTube 에서 보기 ↗</a></p><br>
    ${running ? `<div class="notice">${job.status === "queued" ? "분석 대기 중" : "Gemini 가 영상을 보는 중"}… 자동으로 새로고침됩니다.</div>` : ""}
    ${job?.status === "failed" && !a ? `<div class="alert">분석 실패: ${esc(job.error)}</div>` : ""}
    <div class="grid2">
      <div class="sticky-player"><iframe id="player" class="embed" src="https://www.youtube.com/embed/${esc(videoId)}?enablejsapi=1"
        title="YouTube 영상" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
      <div>
        ${a ? `<div class="card">
          <span class="badge">${esc(label("hook_type", a.hook_type))}</span>
          <p class="summary">${esc(a.hook_summary)}</p>
          ${a.video_summary ? `<p>${esc(a.video_summary)}</p>` : ""}
          <div class="chips" style="margin:12px 0">${d.keywords.map((k) => `<a class="chip" href="#/videos?keyword=${encodeURIComponent(k)}">#${esc(k)}</a>`).join("")}</div>
          <dl class="facts"><dt>첫 대사</dt><dd>${secText(a.first_dialogue_sec)}</dd><dt>첫 컷 전환</dt><dd>${secText(a.first_cut_sec)}</dd>
            ${a.uncertain_notes ? `<dt>애매한 점</dt><dd>${esc(a.uncertain_notes)}</dd>` : ""}
            <dt>분석</dt><dd class="muted">${esc(a.model)} · ${esc(a.provider || "")} · ${a.clip_sec}초 · ${dateTime(a.analyzed_at)}${a.input_tokens ? ` · 토큰 ${num(a.input_tokens)}+${num(a.output_tokens)}` : ""}</dd></dl>
        </div>` : running ? "" : `<div class="card"><p>아직 분석 결과가 없습니다.</p><button id="reanalyze">지금 분석</button></div>`}
        ${yt ? `<div class="tiles" style="margin-bottom:20px">
          <div class="tile"><div class="label">조회수</div><div class="value">${num(yt.view_count)}</div></div>
          <div class="tile"><div class="label">좋아요</div><div class="value">${num(yt.like_count)}</div></div>
          <div class="tile"><div class="label">댓글</div><div class="value">${num(yt.comment_count)}</div></div>
          <div class="tile"><div class="label">채널 구독자</div><div class="value">${num(channel?.subscriber_count)}</div></div></div>` : ""}
      </div>
    </div>
    ${a ? catchyCard(a) : ""}
    ${d.scenes?.length ? scenesCard(d.scenes, a.clip_sec)
      : d.segments.length ? `<div class="card"><h2>1초씩 (${d.segments.length}초, 예전 분석) — 행을 누르면 그 초로 이동</h2>${secondsTable(d.segments)}</div>` : ""}
    ${yt ? `<div class="grid2">${youtubeCard(yt, channel)}${statsCard(d.stats)}</div>` : ""}`;

  const player = el.querySelector("#player");
  const seek = (sec) => {
    player.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "seekTo", args: [Number(sec), true] }), "*");
    player.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
  };
  el.querySelectorAll("tr[data-sec]").forEach((row) => row.addEventListener("click", () => seek(row.dataset.sec)));
  el.querySelectorAll("[data-seek]").forEach((b) => b.addEventListener("click", () => {
    seek(b.dataset.seek);
    if (b.dataset.scene) el.querySelector(`#scene-${b.dataset.scene}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }));
  el.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    await navigator.clipboard.writeText(b.dataset.copy);
    b.textContent = "복사됨";
    setTimeout(() => { b.textContent = "프롬프트 복사"; }, 1500);
  }));
  el.querySelector("#reanalyze")?.addEventListener("click", async () => {
    try {
      await api.analyze([videoId]);
      render(el, _params, videoId);
    } catch (err) {
      alert(err.message);
    }
  });
  return running ? 5000 : 0;
}
