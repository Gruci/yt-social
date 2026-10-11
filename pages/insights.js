// 인사이트. 탭: 한눈에 보기(항목마다 한 줄 요약) · 영상·이야기 · 촬영 · 편집·소리·글자 · 장면 흐름.
// 장면 흐름만 insights_data.js 가 받은 영상별 장면으로 그리고, 나머지는 insights() RPC 한 번으로 그린다.
// 모든 탭은 「범위」(insights_scope.js)로 고른 영상만 본다. 홈 화면에는 「한눈에 보기」를 그대로 끼워 넣는다(embedded).
// 선택지는 2단(대분류 → 세분류, shorts/hook_labels.py GROUPS): 카드는 대분류 누적 막대, 「세분류로 보기」를 열면 세분류 막대.
import * as api from "../api.js?v=1791704676";
import { stackBar, timeline } from "../charts.js?v=1791704676";
import { load } from "../insights_data.js?v=1791704676";
import { bars, esc, groupNames, groupOf, label, num, pct } from "../ui.js?v=1791704676";
import { renderFlow } from "./insights_flow.js?v=1791704676";
import { insightsHash, renderScope, resolveIds } from "./insights_scope.js?v=1791704676";

const TABS = [
  ["overview", "한눈에 보기"],
  ["video", "영상·이야기"],
  ["camera", "촬영"],
  ["edit", "편집·소리·글자"],
  ["flow", "장면 흐름"],
];

const sec = (v) => (v === null || v === undefined ? "—" : `${Number(v).toFixed(1)}초`);

// 대분류에 순서가 있는 항목 — 파랑 단계로 칠한다 (특수는 회색)
const ORDINAL = new Set(["shot_size", "camera_angle", "move_speed"]);

/**
 * 항목 목록 — 한눈에 보기 요약 줄과 탭별 카드가 같이 쓴다.
 * rows(d) = [{code, n}], multi = 한 장면(편)에 값이 여러 개일 수 있음, base(d, c) = multi 항목의 비율 분모
 */
const ITEMS = [
  { key: "genre", tab: "video", title: "장르", ask: "무슨 이야기인가요", unit: "편", multi: true,
    rows: (d) => d.extra?.genre, base: (d, c) => c.videosWithType },
  { key: "payoff_type", tab: "video", title: "결말 보상", ask: "결말이 주는 보상", unit: "편", rows: (d) => d.extra?.payoff_type },
  { key: "content_form", tab: "video", title: "콘텐츠 형태", ask: "단편인가요, 연재인가요", unit: "편", rows: (d) => d.extra?.content_form },
  { key: "hook_type", tab: "video", title: "도입부 유형", ask: "첫 3초는 어떻게 시작하나요", unit: "편",
    rows: (d) => d.hook_types?.map((r) => ({ code: r.hook_type, n: r.n })), href: (r) => `#/videos?hook_type=${r.code}` },
  { key: "scene_role", tab: "video", title: "이야기 단계", ask: "장면 수로 본 이야기 단계", unit: "장면", rows: (d) => d.extra?.scene_role },
  { key: "device", tab: "video", title: "재미 요소", ask: "재미 요소", unit: "편", multi: true,
    rows: (d) => d.devices?.map((r) => ({ code: r.device, n: r.n })), base: (d) => d.summary.with_scenes },
  { key: "shot_size", tab: "camera", title: "샷 크기", ask: "인물을 얼마나 크게 잡나요", unit: "장면", rows: (d) => d.camera?.shot_size },
  { key: "camera_move", tab: "camera", title: "카메라 움직임", ask: "카메라는 얼마나 움직이나요", unit: "장면", rows: (d) => d.camera?.camera_move },
  { key: "camera_angle", tab: "camera", title: "앵글", ask: "카메라 높이", unit: "장면", rows: (d) => d.camera?.camera_angle },
  { key: "move_speed", tab: "camera", title: "무브 속도", ask: "움직임 빠르기", unit: "장면", rows: (d) => d.extra?.move_speed,
    note: "고정 장면은 「없음」" },
  { key: "framing", tab: "camera", title: "구도", ask: "구도", unit: "장면", rows: (d) => d.extra?.framing },
  { key: "camera_direction", tab: "camera", title: "카메라 방향", ask: "인물을 어느 방향에서 보나요", unit: "장면", rows: (d) => d.extra?.camera_direction },
  { key: "bgm_mood", tab: "edit", title: "BGM 분위기", ask: "배경음악 분위기", unit: "장면", rows: (d) => d.extra?.bgm_mood },
  { key: "sfx", tab: "edit", title: "효과음", ask: "효과음", unit: "장면", multi: true, rows: (d) => d.extra?.sfx, base: (d, c) => c.withExtra },
  { key: "caption_type", tab: "edit", title: "화면 글자 종류", ask: "화면 글자 종류", unit: "장면", multi: true,
    rows: (d) => d.extra?.caption_type, base: (d, c) => c.withExtra },
  { key: "caption_pos", tab: "edit", title: "화면 글자 위치", ask: "화면 글자 위치", unit: "장면", multi: true,
    rows: (d) => d.extra?.caption_pos, base: (d, c) => c.withExtra },
  { key: "screen_source", tab: "edit", title: "화면 출처", ask: "화면은 무엇으로 채웠나요", unit: "장면", rows: (d) => d.extra?.screen_source },
  { key: "transition", tab: "edit", title: "장면 전환", ask: "장면이 바뀔 때", unit: "장면", rows: (d) => d.extra?.transition },
];
const ITEM = Object.fromEntries(ITEMS.map((it) => [it.key, it]));
const SECTIONS = [["video", "영상·이야기"], ["camera", "촬영"], ["edit", "편집·소리·글자"]];

// ---------------------------------------------------------------- 묶기·색

/** 대분류 이름 (대분류가 없는 항목은 세분류 이름 그대로) */
const groupKey = (table, code) => groupOf(table, code) || label(table, code);

/** 대분류별 합계 → [{label, n, cls}] (한 장면에 값이 하나인 항목만). 순서 있는 항목은 파랑 단계, 아니면 많은 순 4색 + 기타 */
function groupSegments(rows, table) {
  const total = {};
  rows.forEach((r) => { const g = groupKey(table, r.code); total[g] = (total[g] ?? 0) + r.n; });
  if (ORDINAL.has(table)) {
    let i = 0;
    return groupNames(table).filter((g) => total[g])
      .map((g) => ({ label: g, n: total[g], cls: g === "특수" ? "other" : `ord${Math.min(++i, 4)}` }));
  }
  const ranked = Object.keys(total).filter((g) => g !== "기타").sort((a, b) => total[b] - total[a]);
  const rest = ranked.slice(4).reduce((s, g) => s + total[g], 0) + (total["기타"] ?? 0);
  return [...ranked.slice(0, 4).map((g, i) => ({ label: g, n: total[g], cls: `c${i + 1}` })),
    ...(rest ? [{ label: "기타", n: rest, cls: "other" }] : [])];
}

/** 세분류 막대: 대분류마다 작은 제목을 달고 그 안에서 많은 순. 막대 길이는 카드 전체 최댓값 기준 (ui.bars 와 같은 모양) */
function fineBars(rows, table, unit, href = null, columns = false) {
  const top = Math.max(1, ...rows.map((r) => r.n));
  const row = (r) => {
    const name = esc(label(table, r.code));
    const nameEl = href ? `<a class="name" href="${href(r)}" title="${name}">${name}</a>` : `<span class="name" title="${name}">${name}</span>`;
    return `<div class="bar-row">${nameEl}<span class="bar-track">
      <span class="bar" style="width:${(r.n / top * 85).toFixed(1)}%" data-tip="${name}  ${r.n}${unit}"></span>
      <span class="bar-value">${r.n}</span></span></div>`;
  };
  const groups = groupNames(table).map((g) => [g, rows.filter((r) => groupOf(table, r.code) === g).sort((a, b) => b.n - a.n)])
    .filter(([, list]) => list.length);
  const loose = rows.filter((r) => !groupOf(table, r.code)).sort((a, b) => b.n - a.n);
  // 대분류 이름이 세분류 이름과 같기만 하면(위치·속도) 제목을 달지 않는다
  const heads = groups.some(([g, list]) => list.some((r) => label(table, r.code) !== g));
  const block = ([g, list]) => (heads ? `<div class="bar-group">${esc(g)}</div>` : "") + list.map(row).join("");
  // columns: 대분류 묶음을 두 칸으로 나란히 (값이 많은 재미 요소용)
  if (columns) return `<div class="bar-cols">${groups.map((gl) => `<div class="bars">${block(gl)}</div>`).join("")}</div>`;
  return `<div class="bars">${groups.map(block).join("")}${loose.map(row).join("")}</div>`;
}

// ---------------------------------------------------------------- 카드 (탭)

/** 항목 카드. 한 값 항목 = 대분류 누적 막대 + 「세분류로 보기」, 여러 값 항목 = 세분류 막대만 (대분류 합은 겹쳐 세므로) */
function itemCard(d, ctx, key, { open = false, title = null, columns = false } = {}) {
  const it = ITEM[key];
  const rows = it.rows(d) ?? [];
  const head = `<h2>${esc(title ?? it.ask)}</h2>`;
  if (!rows.length) return `<div class="card">${head}<p class="muted">아직 이 항목까지 분석한 영상이 없어요.</p></div>`;
  const base = it.multi && it.base ? it.base(d, ctx) : null;
  const notes = [it.note, it.multi ? `한 ${it.unit === "편" ? "영상" : "장면"}에 여러 개일 수 있어요${base ? ` (전체 ${num(base)}${it.unit} 기준)` : ""}` : ""]
    .filter(Boolean).join(" · ");
  const body = it.multi ? fineBars(rows, key, it.unit, it.href, columns)
    : groupNames(key).length ? `${stackBar(groupSegments(rows, key), it.unit)}
        <details class="as-table" ${open ? "open" : ""}><summary>세분류로 보기</summary>${fineBars(rows, key, it.unit, it.href)}</details>`
      : fineBars(rows, key, it.unit, it.href);
  return `<div class="card" id="item-${key}">${head}${notes ? `<p class="muted chart-note">${notes}</p>` : ""}${body}</div>`;
}

const pair = (a, b = "<div></div>") => `<div class="grid2">${a}${b}</div>`;

function table(head, rows) {
  return `<details class="as-table"><summary>숫자로 보기</summary><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></details>`;
}

function storyArc(roles) {
  const points = roles.map((r) => ({
    pos: Math.min(Math.max(r.avg_position ?? 0, 0), 1), label: label("scene_role", r.role), sub: sec(r.avg_first_sec), n: r.n,
    tip: `${label("scene_role", r.role)} (${groupOf("scene_role", r.role)})
처음 나오는 시각 ${sec(r.avg_first_sec)} (영상 전체의 ${Math.round((r.avg_position ?? 0) * 100)}% 지점) · ${r.n}편에 들어감`,
  }));
  return timeline(points, [[0, "시작"], [0.25, "25%"], [0.5, "50%"], [0.75, "75%"], [1, "끝"]]);
}

const TIMELINE_TOP = 12;   // 재미 요소 타임라인에 점으로 찍는 개수 (많이 쓴 순). 전체는 표로

function deviceTimeline(devices) {
  const shown = devices.slice(0, TIMELINE_TOP);
  const maxSec = Math.max(10, ...shown.map((d) => d.avg_first_sec ?? 0));
  const end = Math.ceil(maxSec / 10) * 10;
  const points = shown.map((d) => ({
    pos: (d.avg_first_sec ?? 0) / end, label: label("device", d.device), n: d.n,
    tip: `${label("device", d.device)} (${groupOf("device", d.device)})
처음 나오는 시각 평균 ${sec(d.avg_first_sec)} · ${d.n}편에서 씀`,
  }));
  return timeline(points, [0, 0.25, 0.5, 0.75, 1].map((p) => [p, `${Math.round(p * end)}초`]));
}

function keywordCard(keywords) {
  return `<div class="card"><h2>자주 나온 키워드 <span class="muted">· 누르면 그 키워드 영상만 봐요</span></h2>
    <div class="chips big">${keywords.map((k) => `<a class="chip" href="#/videos?keyword=${encodeURIComponent(k.keyword)}">#${esc(k.keyword)} <b>${k.n}</b></a>`).join("")}</div></div>`;
}

function tiles(list) {
  return `<div class="tiles" style="margin-bottom:20px">${list.map(([name, value]) =>
    `<div class="tile"><div class="label">${name}</div><div class="value">${value}</div></div>`).join("")}</div>`;
}

function videoTab(d, ctx) {
  const deviceOrder = groupNames("device");
  return `
    <h2 class="section-title">어떤 영상들인가 <span class="muted">· 분류가 있는 영상 ${num(ctx.videosWithType)}편</span></h2>
    ${pair(itemCard(d, ctx, "genre"), itemCard(d, ctx, "payoff_type", { open: true }))}
    ${pair(itemCard(d, ctx, "content_form"), itemCard(d, ctx, "hook_type"))}

    <h2 class="section-title">이야기는 어떻게 흘러가나</h2>
    <div class="card"><h2>이야기 단계가 처음 나오는 자리</h2>
      <p class="muted chart-note">각 이야기 단계가 영상에서 처음 나오는 평균 위치예요. 점이 클수록 그 단계가 들어간 영상이 많아요</p>
      ${storyArc(d.roles)}
      ${table(["대분류", "이야기 단계", "들어간 영상", "처음 나오는 시각 (평균)", "영상 전체 중 위치"], d.roles.map((r) =>
        [esc(groupOf("scene_role", r.role)), esc(label("scene_role", r.role)), `${r.n}편`, sec(r.avg_first_sec), `${Math.round((r.avg_position ?? 0) * 100)}%`]))}</div>
    ${itemCard(d, ctx, "scene_role")}

    <h2 class="section-title">재미 요소</h2>
    <div class="card"><h2>재미 요소는 몇 초쯤 처음 나올까요</h2>
      <p class="muted chart-note">많이 쓴 ${TIMELINE_TOP}개만 점으로 찍었어요 (전체는 아래 「숫자로 보기」). 점 위치는 처음 나오는 평균 시각, 점 크기는 쓴 영상 수예요</p>
      ${deviceTimeline(d.devices)}
      ${table(["대분류", "재미 요소", "쓴 영상", "처음 나오는 시각 (평균)"], [...d.devices]
        .sort((a, b) => deviceOrder.indexOf(groupOf("device", a.device)) - deviceOrder.indexOf(groupOf("device", b.device)) || b.n - a.n)
        .map((r) => [esc(groupOf("device", r.device)), esc(label("device", r.device)), `${r.n}편`, sec(r.avg_first_sec)]))}</div>
    ${itemCard(d, ctx, "device", { title: "재미 요소를 쓴 영상 수", columns: true })}
    ${keywordCard(d.keywords)}`;
}

function cameraTab(d, ctx) {
  return `<p class="muted" style="margin:0 0 16px">장면 ${num(d.summary.scenes ?? 0)}개 기준이에요</p>
    ${pair(itemCard(d, ctx, "shot_size"), itemCard(d, ctx, "camera_move"))}
    ${pair(itemCard(d, ctx, "camera_angle"), itemCard(d, ctx, "move_speed"))}
    ${pair(itemCard(d, ctx, "framing"), itemCard(d, ctx, "camera_direction"))}`;
}

function editTab(d, ctx) {
  const x = d.extra ?? {};
  const w = ctx.withExtra;
  const share = (n) => (w ? pct((n ?? 0) / w) : "—");
  return `<p class="muted" style="margin:0 0 16px">이 항목까지 분석한 장면 ${num(w)}개 기준이에요 (2026-10 이전 분석은 빠져요)</p>
    ${tiles([["내레이션이 나오는 장면", ctx.narrTotal ? pct(ctx.narrTrue / ctx.narrTotal) : "—"],
             ["효과음이 들리는 장면", share(x.scenes_with_sfx)], ["화면 글자가 있는 장면", share(x.scenes_with_caption)],
             ["BGM이 깔린 장면", share(x.scenes_with_bgm)]])}
    ${pair(itemCard(d, ctx, "bgm_mood", { open: true }), itemCard(d, ctx, "sfx"))}
    ${pair(itemCard(d, ctx, "caption_type"), itemCard(d, ctx, "caption_pos"))}
    ${pair(itemCard(d, ctx, "screen_source"), itemCard(d, ctx, "transition"))}`;
}

// ---------------------------------------------------------------- 한눈에 보기: 항목마다 한 줄

/** 얇은 100% 막대. 넓은 칸에는 이름·비율을 바로 적는다 */
function miniStack(segs, unit) {
  const total = segs.reduce((s, x) => s + x.n, 0);
  let acc = 0;
  return `<div class="stack mini">${segs.filter((x) => x.n).map((x) => {
    const w = (x.n / total) * 100;
    const left = acc;
    acc += w;
    const text = `${x.label} ${Math.round(w)}%`;
    return `<div class="stack-seg ${x.cls}" style="left:${left}%;width:${w}%" data-tip="${esc(x.label)}  ${x.n}${unit} (${Math.round(w)}%)">
      ${w >= 22 ? `<span>${esc(text)}</span>` : ""}</div>`;
  }).join("")}</div>`;
}

function summaryRow(d, ctx, it, params) {
  const rows = it.rows(d) ?? [];
  const link = `${insightsHash(params, { tab: it.tab, hl: null })}`;
  const name = `<a class="sum-name" href="${link}">${esc(it.title)}</a>`;
  if (!rows.length) return `<div class="sum-row">${name}<span class="muted">아직 분석한 영상이 없어요</span><span></span></div>`;
  const sorted = [...rows].sort((a, b) => b.n - a.n);
  if (it.multi) {
    const base = (it.base ? it.base(d, ctx) : 0) || 1;
    const top = sorted.slice(0, 3).map((r) => `${esc(label(it.key, r.code))} <b>${pct(r.n / base)}</b>`).join(" · ");
    return `<div class="sum-row">${name}<span class="sum-multi">${top}</span><span class="muted sum-top">${it.unit === "편" ? "영상" : "장면"} 중 비율</span></div>`;
  }
  const total = rows.reduce((s, r) => s + r.n, 0);
  const grouped = groupNames(it.key).length > 0;
  const bar = miniStack(grouped ? groupSegments(rows, it.key)
    : sorted.slice(0, 4).map((r, i) => ({ label: label(it.key, r.code), n: r.n, cls: `c${i + 1}` }))
      .concat(sorted.length > 4 ? [{ label: "기타", n: sorted.slice(4).reduce((s, r) => s + r.n, 0), cls: "other" }] : []), it.unit);
  const topFine = sorted[0];
  return `<div class="sum-row">${name}${bar}<span class="sum-top" title="가장 많은 세분류">1위 ${esc(label(it.key, topFine.code))} <b>${pct(topFine.n / total)}</b></span></div>`;
}

function overviewTab(d, ctx, params) {
  const s = d.summary;
  return `
    ${tiles([["분석한 영상", `${s.n}편`], ["한 편에 든 장면 (평균)", s.avg_scenes ? `${Number(s.avg_scenes).toFixed(0)}개` : "—"],
             ["장면 하나 길이 (평균)", sec(s.avg_scene_sec)], ["첫 대사가 나오기까지 (평균)", sec(s.avg_first_dialogue)]])}
    <p class="muted chart-note">항목마다 한 줄이에요. 막대는 대분류 비율, 오른쪽은 가장 많은 세분류예요. 항목 이름을 누르면 자세히 봐요.</p>
    ${SECTIONS.map(([tab, title]) => `<div class="card summary">
      <h2>${title} <a class="muted" style="font-size:13px;font-weight:400" href="${insightsHash(params, { tab, hl: null })}">자세히 →</a></h2>
      ${ITEMS.filter((it) => it.tab === tab).map((it) => summaryRow(d, ctx, it, params)).join("")}</div>`).join("")}
    ${s.avg_tokens ? `<p class="muted" style="text-align:right">영상 한 편 분석에 쓴 AI 토큰 (평균, 토큰 기록이 있는 분석만) ${num(Math.round(s.avg_tokens))}</p>` : ""}`;
}

// ---------------------------------------------------------------- 그리기

function context(d) {
  const x = d.extra ?? {};
  const narr = Object.fromEntries((x.narration ?? []).map((r) => [r.code, r.n]));
  return {
    withExtra: x.scenes_with_extra ?? 0,
    videosWithType: (x.content_form ?? []).reduce((a, r) => a + r.n, 0),   // 2026-10 영상 항목이 있는 영상 수
    narrTrue: narr.true ?? 0, narrTotal: (narr.true ?? 0) + (narr.false ?? 0),
  };
}

const DRAW = { overview: overviewTab, video: videoTab, camera: cameraTab, edit: editTab };

export async function render(el, params = null, _arg = null, opts = {}) {
  if (opts.embedded) return drawStats(el, "overview", null, new URLSearchParams(), true);
  const tab = TABS.find(([key]) => key === params?.get("tab")) ?? TABS[0];
  el.innerHTML = `<h1>인사이트</h1>
    <nav class="tabs">${TABS.map(([key, name]) => `<a href="${insightsHash(params, { tab: key, hl: null })}" class="${key === tab[0] ? "on" : ""}">${name}</a>`).join("")}</nav>
    <div id="scope"></div><div id="tab"></div>`;
  renderScope(el.querySelector("#scope"), params);
  const box = el.querySelector("#tab");
  const ids = await resolveIds(params);
  if (ids && !ids.length) {
    box.innerHTML = `<p class="muted">이 범위에 들어가는 분석 영상이 없어요.</p>`;
    return 0;
  }
  if (tab[0] !== "flow") return drawStats(box, tab[0], ids, params ?? new URLSearchParams(), false);
  const videos = (await load()).filter((v) => !ids || ids.includes(v.videoId));
  if (videos.length < 2) {
    box.innerHTML = `<p class="muted">장면까지 분석한 영상이 2편 이상 있어야 볼 수 있어요.</p>`;
    return 0;
  }
  renderFlow(box, videos, params);
  return 0;
}

async function drawStats(el, tab, ids, params, embedded) {
  const d = await api.insights(ids);
  if (!d.summary.n) {
    el.innerHTML = `<p class="muted">${ids ? "고른 영상 중 분석 결과가 있는 영상이 없어요." : "아직 분석한 영상이 없습니다."}</p>`;
    return 0;
  }
  const body = DRAW[tab](d, context(d), params);
  el.innerHTML = embedded
    ? `<h2 class="section-title">인사이트 <span class="muted">· 분석한 영상 ${d.summary.n}편을 모아 본 결과 · <a href="#/insights?tab=video">자세히 보기 →</a></span></h2>${body}`
    : `${tab === "overview" ? `<p class="muted" style="margin:0 0 16px">${ids ? "고른" : "분석한"} 영상 ${d.summary.n}편을 모아 본 결과예요</p>` : ""}${body}`;
  return 0;
}
