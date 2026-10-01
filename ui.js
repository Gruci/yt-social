// 화면 도우미: 이스케이프, 숫자 표시, 표시 이름, 차트(파랑 단일 계열), 툴팁
import spec from "./analysis_spec.js?v=1790835772";

export const labels = spec.labels;
export const label = (table, code) => labels[table]?.[code] ?? code ?? "";

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

export const num = (v) => (v === null || v === undefined ? "—" : Number(v).toLocaleString("ko-KR"));
export const pct = (v) => (v === null || v === undefined ? "—" : `${Math.round(v * 100)}%`);
export const secText = (v) => (v === null || v === undefined ? "없음" : `${Number(v).toFixed(1)}초`);
export const date = (v) => (v ? new Date(v).toLocaleDateString("ko-KR") : "—");
export const dateTime = (v) => (v ? new Date(v).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" }) : "—");

// 순차 램프 (dataviz 기본 팔레트 blue 100→700). 진할수록 많이 나옴
const RAMP = ["#cde2fb", "#b7d3f6", "#9ec5f4", "#86b6ef", "#6da7ec", "#5598e7", "#3987e5",
              "#2a78d6", "#256abf", "#1c5cab", "#184f95", "#104281", "#0d366b"];
export function heat(rate) {
  if (rate === null || rate === undefined) return "";
  const i = Math.min(RAMP.length - 1, Math.max(0, Math.round(rate * (RAMP.length - 1))));
  return `background:${RAMP[i]};color:${i >= 7 ? "#ffffff" : "#0b0b0b"}`;
}

/** 가로 막대 (단일 계열: 범례 없음, 값은 막대 끝) */
export function bars(rows, nameOf, hrefOf = null, unit = "편") {
  const top = Math.max(1, ...rows.map((r) => r.n));
  return `<div class="bars">${rows.map((r) => {
    const name = esc(nameOf(r));
    const nameEl = hrefOf ? `<a class="name" href="${hrefOf(r)}">${name}</a>` : `<span class="name">${name}</span>`;
    return `<div class="bar-row">${nameEl}<span class="bar-track">
      <span class="bar" style="width:${(r.n / top * 85).toFixed(1)}%" data-tip="${name}  ${r.n}${unit}"></span>
      <span class="bar-value">${r.n}</span></span></div>`;
  }).join("")}</div>`;
}

/** 시간순 값 → SVG 선 (점 2개 미만이면 빈 문자열) */
export function trendSvg(points, width = 560, height = 160) {
  const pts = points.filter((p) => p.value !== null && p.value !== undefined);
  if (pts.length < 2) return "";
  const t = pts.map((p) => new Date(p.at).getTime());
  const v = pts.map((p) => Number(p.value));
  const [t0, t1, lo, hi] = [Math.min(...t), Math.max(...t), Math.min(...v), Math.max(...v)];
  const x = (i) => 8 + ((t[i] - t0) / ((t1 - t0) || 1)) * (width - 16);
  const y = (i) => 16 + (1 - (v[i] - lo) / ((hi - lo) || 1)) * (height - 40);
  const path = "M" + pts.map((_, i) => `${x(i).toFixed(1)},${y(i).toFixed(1)}`).join(" L");
  const dots = pts.map((p, i) => `<circle class="dot" cx="${x(i)}" cy="${y(i)}" r="4"></circle>
    <circle class="hit" cx="${x(i)}" cy="${y(i)}" r="12" data-tip="${date(p.at)}  ${num(p.value)}"></circle>`).join("");
  const last = pts.length - 1;
  return `<svg class="trend" viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="추이">
    <line class="grid" x1="0" x2="${width}" y1="${height - 24}" y2="${height - 24}"></line>
    <path class="line" d="${path}"></path>${dots}
    <text x="${x(last)}" y="${y(last) - 8}" text-anchor="end">${num(v[last])}</text></svg>`;
}

// data-tip 이 있는 요소에 마우스를 올리면 툴팁
export function initTooltip() {
  const tip = document.createElement("div");
  tip.id = "tip";
  document.body.appendChild(tip);
  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest?.("[data-tip]");
    if (!el) return;
    tip.textContent = el.dataset.tip;
    tip.style.display = "block";
  });
  document.addEventListener("mousemove", (e) => {
    if (tip.style.display !== "block") return;
    tip.style.left = `${e.clientX + 12}px`;
    tip.style.top = `${e.clientY + 12}px`;
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest?.("[data-tip]")) tip.style.display = "none";
  });
}
