// 인사이트 탭 「장면 흐름」: 항목(이야기 단계·재미 요소·샷 크기…)과 값을 고르면
//   ① 영상마다 장면 띠에서 그 값이 든 장면만 칠하고 ② 그 항목의 값들이 영상의 어디쯤 나오는지 10구간 히트맵으로 본다.
// 주소: hl=<항목>:<값> (insights_scope.js 의 insightsHash 로 범위와 같이 따라간다)
import { heatTable, sceneStrips } from "../charts.js?v=1791704676";
import { shortTitle } from "../insights_data.js?v=1791704676";
import { insightsHash } from "./insights_scope.js?v=1791704676";
import { esc, groupNames, groupOf, heat, label, labels, num } from "../ui.js?v=1791704676";

const BUCKETS = 10;
const cols = () => Array.from({ length: BUCKETS }, (_, i) => ({
  label: `${i * 10}~${(i + 1) * 10}%`, tip: `영상 전체 길이 중 ${i * 10}~${(i + 1) * 10}% 지점`,
}));
const overlaps = (s, dur, b) => s.start_sec < ((b + 1) / BUCKETS) * dur && s.end_sec > (b / BUCKETS) * dur;
const t1 = (v) => `${Number(v).toFixed(1)}초`;

// 고를 수 있는 항목. pick(장면) → 그 장면의 값 목록, name(값) → 표시 이름, order = 값 순서(없으면 많은 순)
const one = (v) => (v ? [v] : []);
const DIMS = {
  role: { title: "이야기 단계", pick: (s) => one(s.role), name: (c) => label("scene_role", c), order: Object.keys(labels.scene_role) },
  devgroup: { title: "재미 요소 (대분류)", pick: (s) => [...new Set((s.devices ?? []).map((d) => groupOf("device", d)).filter(Boolean))],
              name: (g) => g, order: groupNames("device") },
  device: { title: "재미 요소", pick: (s) => s.devices ?? [], name: (c) => label("device", c) },
  shot: { title: "샷 크기", pick: (s) => one(s.shot_size), name: (c) => label("shot_size", c), order: Object.keys(labels.shot_size) },
  move: { title: "카메라 움직임", pick: (s) => one(s.camera_move), name: (c) => label("camera_move", c) },
  framing: { title: "구도", pick: (s) => one(s.framing), name: (c) => label("framing", c) },
  bgm: { title: "BGM 분위기", pick: (s) => one(s.bgm_mood), name: (c) => label("bgm_mood", c) },
  sfx: { title: "효과음", pick: (s) => s.sfx ?? [], name: (c) => label("sfx", c) },
  caption: { title: "화면 글자", pick: (s) => s.caption_types ?? [], name: (c) => label("caption_type", c) },
  source: { title: "화면 출처", pick: (s) => one(s.screen_source), name: (c) => label("screen_source", c) },
  transition: { title: "장면 전환", pick: (s) => one(s.transition), name: (c) => label("transition", c) },
};

/** 값마다 10칸: 그 구간에 그 값이 든 장면이 걸친 영상 수 */
function positionHeat(videos, dim, keys) {
  const n = videos.length;
  return heatTable(dim.title, cols(), keys.map((k) => ({
    label: dim.name(k),
    cells: Array.from({ length: BUCKETS }, (_, b) => {
      const hit = videos.filter((v) => v.scenes.some((s) => dim.pick(s).includes(k) && overlaps(s, v.duration, b))).length;
      return { v: hit ? hit / n : null, text: hit ? String(hit) : "",
               tip: `${dim.name(k)}\n영상의 ${b * 10}~${(b + 1) * 10}% 지점에 나온 영상: ${n}편 중 ${hit}편` };
    }),
  })), heat);
}

/** 이 범위 장면에 실제로 나온 값과 장면 수 */
function counts(videos, dim) {
  const n = {};
  videos.forEach((v) => v.scenes.forEach((s) => dim.pick(s).forEach((k) => { n[k] = (n[k] ?? 0) + 1; })));
  const keys = Object.keys(n).sort((a, b) => n[b] - n[a]);
  if (dim.order) keys.sort((a, b) => dim.order.indexOf(a) - dim.order.indexOf(b));
  return { keys, n };
}

export function renderFlow(el, videos, params) {
  const found = Object.fromEntries(Object.entries(DIMS).map(([k, dim]) => [k, counts(videos, dim)]));
  const [rawKind, ...rest] = (params.get("hl") || "").split(":");
  const kind = DIMS[rawKind] && found[rawKind].keys.length ? rawKind : "role";
  const dim = DIMS[kind];
  const { keys, n } = found[kind];
  const code = keys.includes(rest.join(":")) ? rest.join(":") : keys[0];
  const match = (s) => dim.pick(s).includes(code);
  const ordered = [...videos].sort((a, b) => a.duration - b.duration);
  const withIt = videos.filter((v) => v.scenes.some(match)).length;
  const scenes = videos.reduce((s, v) => s + v.scenes.length, 0);
  const tipOf = (s) => [`${s.scene_no}번째 장면 · ${t1(s.start_sec)}~${t1(s.end_sec)} · ${label("scene_role", s.role)}`,
    (s.devices ?? []).length ? `재미 요소: ${s.devices.map((d) => label("device", d)).join(", ")}` : "",
    s.shot_size ? `${label("shot_size", s.shot_size)} · ${label("camera_move", s.camera_move)}` : "",
    s.bgm_mood ? `BGM ${label("bgm_mood", s.bgm_mood)}` : ""].filter(Boolean).join("\n");

  el.innerHTML = `
    <div class="card">
      <div class="controls">
        <label class="row">항목 <select id="dim">${Object.entries(DIMS).filter(([k]) => found[k].keys.length)
          .map(([k, d]) => `<option value="${k}" ${k === kind ? "selected" : ""}>${esc(d.title)}</option>`).join("")}</select></label>
        <label class="row">값 <select id="val">${keys.map((k) =>
          `<option value="${esc(k)}" ${k === code ? "selected" : ""}>${esc(dim.name(k))} (${num(n[k])}장면)</option>`).join("")}</select></label>
      </div>
      <h2>영상마다 「${esc(dim.name(code))}」 장면의 위치</h2>
      <p class="muted chart-note">「${esc(dim.name(code))}」 장면이 있는 영상 ${withIt}편 / 전체 ${videos.length}편 (장면 ${num(n[code])}개 / ${num(scenes)}개).
        한 줄이 영상 한 편, 칸 하나가 장면 하나예요 (칸이 넓을수록 긴 장면). 고른 값이 든 장면만 파랗게 칠했고, 짧은 영상이 위에 있어요.</p>
      ${sceneStrips(ordered, match, tipOf, (v) => shortTitle(v.title, 26))}</div>
    <div class="card"><h2>「${esc(dim.title)}」 값들은 영상의 어디쯤 나오나요</h2>
      <p class="muted chart-note">영상을 처음부터 끝까지 10구간으로 나눠, 각 구간에 그 값이 나온 영상이 몇 편인지 적었어요 (전체 ${videos.length}편).
        색이 진할수록 많은 영상이 그 자리에 썼다는 뜻이에요. 앞쪽에 몰리면 시청자를 붙잡는 데, 뒤쪽에 몰리면 마무리에 쓰인다는 뜻이에요.</p>
      ${positionHeat(videos, dim, keys)}</div>`;

  const go = (hl) => { location.hash = insightsHash(params, { hl }); };
  el.querySelector("#dim").addEventListener("change", (e) => go(`${e.target.value}:${found[e.target.value].keys[0]}`));
  el.querySelector("#val").addEventListener("change", (e) => go(`${kind}:${e.target.value}`));
}
