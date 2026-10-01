// 인사이트 탭 「장면 흐름」: 영상마다 장면 띠(고른 단계·재미 요소만 칠함), 영상을 10구간으로 나눠 무엇이 어디 나오는지
import { heatTable, sceneStrips } from "../charts.js?v=1790835772";
import { shortTitle } from "../insights_data.js?v=1790835772";
import { insightsHash } from "./insights_scope.js?v=1790835772";
import { esc, heat, label, labels } from "../ui.js?v=1790835772";

const BUCKETS = 10;
const cols = () => Array.from({ length: BUCKETS }, (_, i) => ({
  label: `${i * 10}~${(i + 1) * 10}%`, tip: `영상 전체 길이 중 ${i * 10}~${(i + 1) * 10}% 지점`,
}));
const overlaps = (s, dur, b) => s.start_sec < ((b + 1) / BUCKETS) * dur && s.end_sec > (b / BUCKETS) * dur;
const t1 = (v) => `${Number(v).toFixed(1)}초`;

/** 행(단계·재미 요소)마다 10칸: 그 구간에 해당 장면이 걸친 영상 수 */
function positionHeat(videos, keys, has, corner, name) {
  const n = videos.length;
  return heatTable(corner, cols(), keys.map((k) => ({
    label: name(k),
    cells: Array.from({ length: BUCKETS }, (_, b) => {
      const hit = videos.filter((v) => v.scenes.some((s) => has(s, k) && overlaps(s, v.duration, b))).length;
      return { v: hit ? hit / n : null, text: hit ? String(hit) : "",
               tip: `${name(k)}\n영상의 ${b * 10}~${(b + 1) * 10}% 지점에 나온 영상: ${n}편 중 ${hit}편` };
    }),
  })), heat);
}

const used = (videos, pick) => {
  const n = {};
  videos.forEach((v) => v.scenes.forEach((s) => pick(s).forEach((k) => { n[k] = (n[k] ?? 0) + 1; })));
  return Object.keys(n).sort((a, b) => n[b] - n[a]);
};
const ROLE_ORDER = Object.keys(labels.scene_role);

export function renderFlow(el, videos, params) {
  const roles = used(videos, (s) => [s.role]).sort((a, b) => ROLE_ORDER.indexOf(a) - ROLE_ORDER.indexOf(b));
  const devices = used(videos, (s) => s.devices ?? []);
  const [kind, code] = (params.get("hl") || `role:${roles[0]}`).split(":");
  const match = kind === "device" ? (s) => (s.devices ?? []).includes(code) : (s) => s.role === code;
  const ordered = [...videos].sort((a, b) => a.duration - b.duration);
  const tipOf = (s) => `${s.scene_no}번째 장면 · ${t1(s.start_sec)}~${t1(s.end_sec)} · ${label("scene_role", s.role)}`
    + ((s.devices ?? []).length ? `\n재미 요소: ${s.devices.map((d) => label("device", d)).join(", ")}` : "");
  const option = (k, c, name) => `<option value="${k}:${c}" ${kind === k && code === c ? "selected" : ""}>${esc(name)}</option>`;

  el.innerHTML = `
    <div class="card"><h2>영상마다 이 부분이 어디에 있나요</h2>
      <div class="controls">보고 싶은 것 <select id="hl">
        <optgroup label="이야기 단계">${roles.map((r) => option("role", r, label("scene_role", r))).join("")}</optgroup>
        <optgroup label="재미 요소">${devices.map((d) => option("device", d, label("device", d))).join("")}</optgroup>
      </select></div>
      <p class="muted chart-note">한 줄이 영상 한 편, 칸 하나가 장면 하나예요 (칸이 넓을수록 긴 장면).
        고른 항목이 들어간 장면만 파랗게 칠했어요. 짧은 영상이 위에 있고, 제목을 누르면 그 영상으로 가요.</p>
      ${sceneStrips(ordered, match, tipOf, (v) => shortTitle(v.title, 26))}</div>
    <div class="card"><h2>이야기 단계는 영상의 어디쯤 나오나요</h2>
      <p class="muted chart-note">영상을 처음부터 끝까지 10구간으로 나눠, 각 구간에 그 단계가 나온 영상이 몇 편인지 적었어요 (전체 ${videos.length}편).
        색이 진할수록 많은 영상이 그 자리에 그 단계를 뒀다는 뜻이에요.</p>
      ${positionHeat(videos, roles, (s, r) => s.role === r, "이야기 단계", (r) => label("scene_role", r))}</div>
    <div class="card"><h2>재미 요소는 영상의 어디쯤 쓰이나요</h2>
      <p class="muted chart-note">보는 법은 위와 같아요. 앞쪽에 몰린 요소는 시청자를 붙잡는 데, 뒤쪽에 몰린 요소는 마무리에 쓰인다는 뜻이에요.</p>
      ${positionHeat(videos, devices, (s, d) => (s.devices ?? []).includes(d), "재미 요소", (d) => label("device", d))}</div>`;

  el.querySelector("#hl").addEventListener("change", (e) => { location.hash = insightsHash(params, { hl: e.target.value }); });
}
