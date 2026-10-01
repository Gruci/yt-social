// 인사이트: 탭 2개. 「한눈에 보기」(이야기 흐름·재미 요소 시점·카메라 분포)는 분석 화면에도 끼워 넣는다.
// 「장면 흐름」은 insights_data.js 가 받은 영상별 장면으로 그린다. 두 탭 모두 「범위」(insights_scope.js)로 고른 영상만 본다
import * as api from "../api.js?v=1790835772";
import { stackBar, timeline } from "../charts.js?v=1790835772";
import { load } from "../insights_data.js?v=1790835772";
import { bars, esc, label, num } from "../ui.js?v=1790835772";
import { renderFlow } from "./insights_flow.js?v=1790835772";
import { insightsHash, renderScope, scopeIds } from "./insights_scope.js?v=1790835772";

const TABS = [
  ["overview", "한눈에 보기", null],
  ["flow", "장면 흐름", renderFlow],
];

const sec = (v) => (v === null || v === undefined ? "—" : `${Number(v).toFixed(1)}초`);

// 샷 크기 → 순서 있는 4단계 (파랑 단계). 정확한 7단계는 표로 보기에
const SIZE_BANDS = [
  ["와이드", ["extreme_wide", "wide"]],
  ["미디엄", ["medium_wide", "medium"]],
  ["클로즈업", ["medium_close", "close_up"]],
  ["익스트림 클로즈업", ["extreme_close_up"]],
];

function storyArc(roles) {
  const points = roles.map((r) => ({
    pos: Math.min(Math.max(r.avg_position ?? 0, 0), 1), label: label("scene_role", r.role), sub: sec(r.avg_first_sec), n: r.n,
    tip: `${label("scene_role", r.role)} 
처음 나오는 시각 ${sec(r.avg_first_sec)} (영상 전체의 ${Math.round((r.avg_position ?? 0) * 100)}% 지점) · ${r.n}편에 들어감`,
  }));
  return timeline(points, [[0, "시작"], [0.25, "25%"], [0.5, "50%"], [0.75, "75%"], [1, "끝"]]);
}

function deviceTimeline(devices) {
  const maxSec = Math.max(10, ...devices.map((d) => d.avg_first_sec ?? 0));
  const end = Math.ceil(maxSec / 10) * 10;
  const points = devices.map((d) => ({
    pos: (d.avg_first_sec ?? 0) / end, label: label("device", d.device), n: d.n,
    tip: `${label("device", d.device)} 
처음 나오는 시각 평균 ${sec(d.avg_first_sec)} · ${d.n}편에서 씀`,
  }));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((p) => [p, `${Math.round(p * end)}초`]);
  return timeline(points, ticks);
}

function shotSizeStack(rows) {
  const count = Object.fromEntries(rows.map((r) => [r.code, r.n]));
  return stackBar(SIZE_BANDS.map(([name, codes], i) => ({
    label: name, n: codes.reduce((s, c) => s + (count[c] ?? 0), 0), cls: `ord${i + 1}`,
  })));
}

function moveStack(rows) {
  const top = rows.slice(0, 4).map((r, i) => ({ label: label("camera_move", r.code), n: r.n, cls: `c${i + 1}` }));
  const rest = rows.slice(4).reduce((s, r) => s + r.n, 0);
  return stackBar(rest ? [...top, { label: "기타", n: rest, cls: "other" }] : top);
}

function table(head, rows) {
  return `<details class="as-table"><summary>숫자로 보기</summary><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></details>`;
}

export async function render(el, params = null, _arg = null, opts = {}) {
  if (opts.embedded) return overview(el, true);
  const tab = TABS.find(([key]) => key === params?.get("tab")) ?? TABS[0];
  const ids = scopeIds(params);
  el.innerHTML = `<h1>인사이트</h1>
    <nav class="tabs">${TABS.map(([key, name]) => `<a href="${insightsHash(params, { tab: key, hl: null })}" class="${key === tab[0] ? "on" : ""}">${name}</a>`).join("")}</nav>
    <div id="scope"></div><div id="tab"></div>`;
  renderScope(el.querySelector("#scope"), params);
  const box = el.querySelector("#tab");
  if (!tab[2]) return overview(box, false, ids);
  const videos = (await load()).filter((v) => !ids || ids.includes(v.videoId));
  if (videos.length < 2) {
    box.innerHTML = `<p class="muted">장면까지 분석한 영상이 2편 이상 있어야 볼 수 있어요.</p>`;
    return 0;
  }
  tab[2](box, videos, params);
  return 0;
}

async function overview(el, embedded, ids = null) {
  const d = await api.insights(ids);
  const s = d.summary;
  if (!s.n) {
    el.innerHTML = `<p class="muted">${ids ? "고른 영상 중 분석 결과가 있는 영상이 없어요." : "아직 분석한 영상이 없습니다."}</p>`;
    return 0;
  }
  const cam = d.camera ?? {};
  el.innerHTML = `
    ${embedded ? `<h2 class="section-title">인사이트 <span class="muted">· 분석한 영상 ${s.n}편을 모아 본 결과 · <a href="#/insights?tab=flow">장면 흐름 자세히 보기 →</a></span></h2>` : `<p class="muted" style="margin:0 0 16px">${ids ? "고른" : "분석한"} 영상 ${s.n}편을 모아 본 결과예요</p>`}
    <div class="tiles" style="margin-bottom:20px">
      <div class="tile"><div class="label">분석한 영상</div><div class="value">${s.n}편</div></div>
      <div class="tile"><div class="label">한 편에 든 장면 (평균)</div><div class="value">${s.avg_scenes ? Number(s.avg_scenes).toFixed(0) + "개" : "—"}</div></div>
      <div class="tile"><div class="label">장면 하나 길이 (평균)</div><div class="value">${sec(s.avg_scene_sec)}</div></div>
      <div class="tile"><div class="label">첫 대사가 나오기까지 (평균)</div><div class="value">${sec(s.avg_first_dialogue)}</div></div>
    </div>

    <div class="card"><h2>이야기는 보통 이런 순서로 흘러가요</h2>
      <p class="muted chart-note">각 이야기 단계가 영상에서 처음 나오는 평균 위치예요. 점이 클수록 그 단계가 들어간 영상이 많아요</p>
      ${storyArc(d.roles)}
      ${table(["이야기 단계", "들어간 영상", "처음 나오는 시각 (평균)", "영상 전체 중 위치"], d.roles.map((r) =>
        [esc(label("scene_role", r.role)), `${r.n}편`, sec(r.avg_first_sec), `${Math.round((r.avg_position ?? 0) * 100)}%`]))}</div>

    <div class="card"><h2>재미 요소는 몇 초쯤 처음 나올까요</h2>
      <p class="muted chart-note">점 위치는 처음 나오는 평균 시각, 점 크기는 그 요소를 쓴 영상 수예요</p>
      ${deviceTimeline(d.devices)}
      ${table(["재미 요소", "쓴 영상", "처음 나오는 시각 (평균)"], d.devices.map((r) => [esc(label("device", r.device)), `${r.n}편`, sec(r.avg_first_sec)]))}</div>

    <div class="grid2">
      <div class="card"><h2>인물을 얼마나 크게 잡나요 (샷 크기)</h2>${shotSizeStack(cam.shot_size ?? [])}
        ${table(["샷 크기", "장면 수"], (cam.shot_size ?? []).map((r) => [esc(label("shot_size", r.code)), r.n]))}</div>
      <div class="card"><h2>카메라는 얼마나 움직이나요</h2>${moveStack(cam.camera_move ?? [])}
        ${table(["카메라 움직임", "장면 수"], (cam.camera_move ?? []).map((r) => [esc(label("camera_move", r.code)), r.n]))}</div>
    </div>

    <div class="grid2">
      <div class="card"><h2>첫 3초는 어떻게 시작하나요</h2>${bars(d.hook_types, (r) => label("hook_type", r.hook_type), (r) => `#/videos?hook_type=${r.hook_type}`)}</div>
      <div class="card"><h2>자주 나온 키워드 <span class="muted">· 누르면 그 키워드 영상만 봐요</span></h2>
        <div class="chips big">${d.keywords.map((k) => `<a class="chip" href="#/videos?keyword=${encodeURIComponent(k.keyword)}">#${esc(k.keyword)} <b>${k.n}</b></a>`).join("")}</div></div>
    </div>
    <p class="muted" style="text-align:right">영상 한 편 분석에 쓴 AI 토큰 (평균) ${num(Math.round(s.avg_tokens ?? 0))}</p>`;
  return 0;
}
