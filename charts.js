// 인사이트 도식 (SVG). 색은 dataviz 기본 팔레트 — style.css 의 --c1..--c4·--ord1..--ord4·--other 를 쓴다.
// 규칙: 단일 계열은 파랑 하나, 순서 있는 분류(샷 크기)는 파랑 단계, 이름뿐인 분류(무브)는 4개 + 기타, 글자는 잉크색.
import { esc } from "./ui.js?v=1790835772";

const W = 1000;   // viewBox 너비 — 화면 너비에 맞춰 늘어난다

/** 글자 폭 대충 (한글 13px, 그 외 7px) — 라벨 겹침 피하기용 */
const textWidth = (s) => [...s].reduce((w, ch) => w + (/[ㄱ-힝]/.test(ch) ? 13 : 7), 0);

/** 라벨을 층(lane)에 나눠 겹치지 않게. items: [{x, label}] → 같은 배열에 lane 추가 */
function assignLanes(items, gap = 10) {
  const laneEnds = [];
  for (const it of [...items].sort((a, b) => a.x - b.x)) {
    const half = textWidth(it.label) / 2;
    let lane = laneEnds.findIndex((end) => it.x - half > end + gap);
    if (lane === -1) { lane = laneEnds.length; laneEnds.push(0); }
    laneEnds[lane] = it.x + half;
    it.lane = lane;
  }
  return items;
}

function axis(y, ticks) {
  return `<line class="axis" x1="20" x2="${W - 20}" y1="${y}" y2="${y}"></line>` +
    ticks.map(([x, text]) => `<line class="tick" x1="${x}" x2="${x}" y1="${y}" y2="${y + 5}"></line>
      <text class="tick-label" x="${x}" y="${y + 20}" text-anchor="middle">${esc(text)}</text>`).join("");
}

/**
 * 타임라인: 점(크기 = 몇 편)을 가로축에 찍고 이름을 위로 층층이.
 * points: [{pos 0~1, label, sub, n, tip}]
 */
export function timeline(points, tickLabels) {
  if (!points.length) return "";
  const x = (p) => 20 + p * (W - 40);
  const items = assignLanes(points.map((p) => ({ ...p, x: x(p.pos) })));
  const lanes = Math.max(...items.map((i) => i.lane)) + 1;
  const axisY = 34 + lanes * 34;
  const maxN = Math.max(...items.map((i) => i.n ?? 1));
  const ticks = tickLabels.map(([pos, text]) => [x(pos), text]);
  const body = items.map((it) => {
    const ly = axisY - 24 - it.lane * 34;
    const r = 5 + 5 * ((it.n ?? 1) / maxN);
    return `<g class="pt" data-tip="${esc(it.tip)}">
      <line class="leader" x1="${it.x}" x2="${it.x}" y1="${ly + 6}" y2="${axisY - r}"></line>
      <text class="pt-label" x="${it.x}" y="${ly}" text-anchor="middle">${esc(it.label)}</text>
      ${it.sub ? `<text class="pt-sub" x="${it.x}" y="${ly - 14}" text-anchor="middle">${esc(it.sub)}</text>` : ""}
      <circle class="pt-dot" cx="${it.x}" cy="${axisY}" r="${r}"></circle>
      <circle class="hit" cx="${it.x}" cy="${axisY}" r="${r + 8}"></circle></g>`;
  }).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${axisY + 32}" width="100%" role="img">${axis(axisY, ticks)}${body}</svg>`;
}

/**
 * 100% 가로 누적 막대 한 줄 + 범례. segments: [{label, n, cls}] (cls = 색 클래스, 순서 고정)
 */
export function stackBar(segments, unit = "장면") {
  const total = segments.reduce((s, x) => s + x.n, 0);
  if (!total) return "";
  let acc = 0;
  const bars = segments.filter((s) => s.n).map((s) => {
    const w = (s.n / total) * 100;
    const left = acc;
    acc += w;
    const pctText = `${Math.round(w)}%`;
    return `<div class="stack-seg ${s.cls}" style="left:${left}%;width:${w}%" data-tip="${esc(s.label)}  ${s.n}${unit} (${pctText})">
      ${w >= 12 ? `<span>${esc(pctText)}</span>` : ""}</div>`;
  }).join("");
  const legend = segments.filter((s) => s.n).map((s) =>
    `<span class="key"><i class="${s.cls}"></i>${esc(s.label)} <b>${Math.round((s.n / total) * 100)}%</b></span>`).join("");
  return `<div class="stack">${bars}</div><div class="legend">${legend}</div>`;
}

// ---------------------------------------------------------------- 인사이트 「장면 흐름」 탭

/**
 * 히트맵 표. cols: [{label, tip?}], rows: [{label, href?, cells: [{v 0~1|null, text, tip}]}].
 * 칸 색 = v (파랑 단계, heat). 표 자체가 표 보기라 따로 없다
 */
export function heatTable(corner, cols, rows, heat) {
  return `<div class="scroll-x"><table class="heat wide"><thead><tr><th>${esc(corner)}</th>
    ${cols.map((c) => `<th class="col" ${c.tip ? `data-tip="${esc(c.tip)}"` : ""}>${esc(c.label)}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr><th class="rowname">${r.href ? `<a href="${esc(r.href)}">${esc(r.label)}</a>` : esc(r.label)}</th>
      ${r.cells.map((c) => `<td class="cell" style="${heat(c.v)}" data-tip="${esc(c.tip)}">${esc(c.text)}</td>`).join("")}</tr>`).join("")}
    </tbody></table></div>`;
}

/** 영상마다 장면 띠 한 줄. 고른 조건(match)에 맞는 장면만 파랑, 나머지는 회색 */
export function sceneStrips(videos, match, tipOf, nameOf = (v) => v.title) {
  return `<div class="strips">${videos.map((v) => `<div class="strips-row">
    <a class="name" href="#/video/${esc(v.videoId)}" data-tip="${esc(v.title)}">${esc(nameOf(v))}</a>
    <div class="strip mini">${v.scenes.map((s) => `<span class="strip-cell${match(s) ? "" : " off"}"
      style="flex-grow:${Math.max(s.end_sec - s.start_sec, 0.2)}" data-tip="${esc(tipOf(s, v))}"></span>`).join("")}</div>
    <span class="muted">${Math.round(v.duration)}초</span></div>`).join("")}</div>`;
}
