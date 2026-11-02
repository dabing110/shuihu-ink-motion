// 《水浒传》宋元版画线描 + 焦墨 — 共用笔法库。
// 与三国水墨的五处分野（每一笔都要能一眼分辨，这是本系列存在的理由）：
//   ① 纸   ：冷灰白（苦白 #e8e6de），不是三国的暖米黄 #efe6d0 —— 水浒不该是暖的。
//   ② 线   ：铁线描（线宽恒定、起收极短、带刻刀微颤与偶发断线），不用毛笔飞白。
//   ③ 明暗 ：排线（hatch）平行细线，不用墨渐渐染出体积 —— 这是版画与水墨的根本区别。
//   ④ 墨块 ：焦墨（干、枯、边缘毛糙、像墨干在版上），不用湿墨洇。
//   ⑤ 色   ：只留一味朱砂 #b7332e（血 / 印 / 酒旗），其余全是黑白灰。三国是赭石+青+朱多色并用。
// 规矩同引擎：一切随机走种子（同帧两次一样）；每幕一个主动作 + 至少两个母题循环。
(() => {
const W = 1920, H = 1080;
const { clamp, lerp, ss, rng, ease } = U, P = PAINT;
const Z = window.Z = {};

// ---------- 色：苦白纸 / 焦墨 / 朱砂 ----------
const INK = [26, 26, 28];            // 焦墨（近黑，微微偏冷）
const PAPER_BASE = '#e8e6de';        // 冷灰白
const CINNABAR = [183, 51, 46];      // 朱砂（本系列唯一的彩）
const ink = (t = 1, a = 1) => `rgba(${INK[0]},${INK[1]},${INK[2]},${a * t})`;
const cin = (a = 1) => `rgba(${CINNABAR[0]},${CINNABAR[1]},${CINNABAR[2]},${a})`;
Z.INK = INK; Z.CINNABAR = CINNABAR; Z.PAPER_BASE = PAPER_BASE;

// ---------- 纸：冷白版印纸（纤维 + 刻版残墨屑 + 压痕） ----------
Z.paper = (key = 'sh_paper', base = PAPER_BASE) => P.cached(key, W, H, (g) => {
  g.drawImage(P.texture('sh_tex_' + key, base, { scale: 0.0022, amt: 11, grain: 6, seed: 7 }), 0, 0);
  const r = rng(23);
  // 纸纤维：比三国少一半，版画纸要"净"
  for (let i = 0; i < 1100; i++) {
    const x = r() * W, y = r() * H, a = r() * Math.PI * 2, l = 5 + r() * 20;
    g.strokeStyle = r() < 0.5 ? `rgba(140,132,116,${0.04 + r() * 0.06})` : `rgba(255,254,248,${0.14 + r() * 0.16})`;
    g.lineWidth = 0.5 + r() * 0.7; g.beginPath(); g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  // 版印纸特有的细小墨屑（刻版残墨甩在纸上）
  for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(26,26,28,${0.02 + r() * 0.05})`; g.beginPath(); g.arc(r() * W, r() * H, 0.4 + r() * 1.1, 0, 7); g.fill(); }
  // 四边压暗一点点（像书页边缘），但没有三国的暖 vignette
  const vg = g.createRadialGradient(W / 2, H / 2, 520, W / 2, H / 2, 1320);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(90,86,78,.13)');
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
});

// ---------- 铁线描：本系列的签字笔法 ----------
// 要点：① 线宽几乎恒定（taper 极小，毛笔是 0.4 量级、这里是 0.1 量级）
//      ② 走笔带 seeded 微颤（刻刀吃木头，不是手抖）
//      ③ 偶发断线（breaks）：版坏了/纸不平，缺一小口——这条最出"版味"，但密度必须低（≥0.9），
//         否则每张脸都缺一块，读成画面崩坏。
Z.wire = (c, pts, { w = 4, tone = 0.9, seed = 1, taper = 0.12, breaks = 1, amp = 0.9, step = 5, rev = 1, col = null } = {}) => {
  if (!pts || pts.length < 2) return;
  const n = pts.length, r = rng(seed);
  const built = [];
  for (let i = 0; i < n - 1; i++) {                                   // 每段 mid-point 插值，折线转圆势
    const a = pts[i], b = pts[i + 1];
    const px = pts[i - 1] || a, nx = pts[i + 2] || b;
    built.push(...P.bez(a, [a[0] + (b[0] - px[0]) / 6, a[1] + (b[1] - px[1]) / 6], [b[0] - (nx[0] - a[0]) / 6, b[1] - (nx[1] - a[1]) / 6], b, 7));
  }
  const N = built.length;
  if (N < 2) return;
  const visible = Math.max(2, Math.round(N * (rev < 1 ? ease.out(rev) * 1.02 : 1)));   // rev：写出进度
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  for (let i = 0; i < visible - 1; i++) {
    if (breaks < 1 && r() > breaks) continue;                          // 偶发断口
    const q = i / (N - 1);
    const prof = 1 - taper * 2 * Math.abs(q - 0.5) * 2;                // 中段满宽，两端微收
    const [x0, y0] = built[i], [x1, y1] = built[i + 1];
    c.strokeStyle = col ? `rgba(${col[0]},${col[1]},${col[2]},${tone})` : ink(tone);
    c.lineWidth = Math.max(0.6, w * prof * (0.94 + 0.12 * P.noise(i * 0.5, seed)));   // 沿线线宽 ±6%
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 + (r() - .5) * amp, y1 + (r() - .5) * amp); c.stroke();
  }
  c.restore();
};

// 铁线勾出的闭合形 + 可选排线填充：画绝大部分实体（衣、械、屋、山石）
Z.lined = (c, pts, { w = 3.4, tone = 0.9, seed = 1, hatch = 0, hatchAng = -0.9, gap = 7 } = {}) => {
  if (hatch) {
    c.save();
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.clip();
    Z.hatchBox(c, pts, { ang: hatchAng, gap, tone: hatch, seed });
    c.restore();
  }
  Z.wire(c, pts, { w, tone, seed });
};

// ---------- 排线：版画的明暗语言（代替渲染） ----------
// 在一个多边形区域里铺平行细线。同一母题必须固定 ang，才能读成"一个版"，角度乱了就成涂鸦。
Z.hatchBox = (c, pts, { ang = -0.9, gap = 7, tone = 0.5, seed = 1, w = 1.6, bow = 0 } = {}) => {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs) - gap, x1 = Math.max(...xs) + gap, y0 = Math.min(...ys) - gap, y1 = Math.max(...ys) + gap;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2 + gap;
  c.save(); c.translate(cx, cy); c.rotate(ang);
  c.strokeStyle = ink(tone); c.lineWidth = w; c.lineCap = 'round';
  for (let v = -R; v <= R; v += gap) {
    const k = Math.round(v / gap);
    if ((k * 7919) % 11 === 0) continue;                              // 稀疏散跳：避免摩尔纹
    c.beginPath();
    for (let u = -R; u <= R; u += 9) {
      const wob = bow ? Math.sin((u + k * 13) * 0.02) * bow : 0;
      const xx = u, yy = v + wob + (P.noise(u * 0.02, k * 3.1 + seed) - .5) * 1.2;
      u === -R ? c.moveTo(xx, yy) : c.lineTo(xx, yy);
    }
    c.stroke();
  }
  c.restore();
};

// ---------- 焦墨块：干、枯、边缘毛糙 ----------
// 不用 inkWash（那是湿墨洇）。做法：多层同形错位叠加 + roughPath 毛边。
Z.scorch = (c, pts, { tone = 0.5, seed = 1, layers = 4, amp = 4, spread = 2.2 } = {}) => {
  const r = rng(seed);
  c.save();
  for (let k = 0; k < layers; k++) {
    const dx = (r() - .5) * spread * k, dy = (r() - .5) * spread * k;
    const pts2 = pts.map(p => [p[0] + dx, p[1] + dy]);
    P.roughPath(c, pts2, { amp: amp * (0.4 + k * 0.3), seed: seed + k * 17, closed: true, step: 7 });
    c.fillStyle = ink(tone / layers * 1.35); c.fill();
  }
  c.restore();
};

// ---------- 远山（签名兼容 h_common，内部换成「轮廓 + 排线」） ----------
// 三国：渐变填 + 一笔浓墨皴；水浒：纯轮廓线 + 山体排线。
Z.mountains = (c, g, x0, x1, layers) => {
  layers.forEach((L, li) => {
    const pts = [];
    for (let x = x0 - 40; x <= x1 + 40; x += 14) {
      const n = P.fbm(x * 0.0042 + L.seed * 7, L.seed * 3.1, 4);
      pts.push([x, L.y0 - L.amp * (0.55 + 0.45 * n)]);
    }
    const poly = [...pts, [x1 + 40, L.y0 + 40], [x0 - 40, L.y0 + 40]];
    c.save();
    c.beginPath(); poly.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.clip();
    // 排线必须稀：gap 大 + tone 低，山体主要靠留白——线密了就成了灰块（探针第一版踩过）
    Z.hatchBox(c, poly, { ang: lerp(-1.15, -0.75, li / Math.max(1, layers.length - 1)), gap: 24 + li * 8, tone: L.tone * 0.3, seed: 300 + li, w: 1.2 });
    c.restore();
    Z.wire(c, pts, { w: 3.2 - li * 0.5, tone: 0.55 + L.tone * 0.4, seed: 210 + li, taper: 0.06 });   // 山脊一勾
  });
};

// 焦墨层（签名兼容 wash，仍在需要湿笔时用）
Z.wash = (c, key, grow, fn, o) => P.inkWash(c, key, grow, fn, o);

// ---------- 云：版画里的云是"卷云线"（一组平行弧），不是墨晕 ----------
Z.cloud = (c, t, { x, y, s = 1, seed = 3, tone = 0.5, drift = 26 } = {}) => {
  const r = rng(seed), px = x + Math.sin(t * 0.25 + seed) * drift;
  c.save(); c.translate(px, y); c.scale(s, s);
  for (let k = 0; k < 4; k++) {
    const yy = (k - 1.5) * 13, w0 = 96 - Math.abs(k - 1.5) * 22;
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const u = i / 10 - 0.5;
      pts.push([u * w0 * 2, yy - Math.cos(u * Math.PI) * (16 - k * 2) + (r() - .5) * 2]);
    }
    Z.wire(c, pts, { w: 2.4, tone: tone * (1 - Math.abs(k - 1.5) * 0.18), seed: 500 + seed * 7 + k, taper: 0.14 });
    Z.wire(c, [[-w0, yy], [-w0 - 12, yy + 6], [-w0 - 16, yy - 4]], { w: 2, tone: tone * 0.8, seed: 520 + k });
  }
  c.restore();
};

// ---------- 枯枝 / 松（版画的线是硬的，不像水墨那样有飞白） ----------
Z.pine = (c, t, { x, y, s = 1, seed = 3, tone = 0.85 } = {}) => {
  const sw = Math.sin(t * 1.4 + seed) * 0.035;
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(sw);
  Z.wire(c, [[0, 0], [-12, -68], [4, -138], [-6, -206]], { w: 7, tone, seed: 400 + seed, taper: 0.2 });
  [[-148, 1], [-94, -1], [-50, 1]].forEach(([yy, sg], k) => {
    Z.wire(c, [[0, yy], [sg * 58, yy - 14], [sg * 100, yy - 32]], { w: 3, tone: tone * 0.9, seed: 410 + seed + k, taper: 0.16 });
    for (let i = 0; i < 4; i++) {                                     // 松针：版画用短直线
      const bx = sg * (54 + i * 13), by = yy - 16 - i * 5;
      for (let j = 0; j < 3; j++) {
        const a = -1.15 + j * 0.38 + Math.sin(t * 1.8 + i) * 0.04;
        Z.wire(c, [[bx, by], [bx + Math.cos(a) * 22, by + Math.sin(a) * 22]], { w: 1.5, tone: 0.78, seed: 430 + seed + i * 3 + j });
      }
    }
  });
  c.restore();
};

// ---------- 雪：留白 + 白点，不用灰雾（这是林冲幕的天气） ----------
Z.snow = (c, t, { n = 90, seed = 5, speed = 1, tone = 0.5 } = {}) => {
  const r = rng(seed);
  c.save(); c.fillStyle = `rgba(252,252,248,${tone})`;
  for (let i = 0; i < n; i++) {
    const sx = (r() * W + Math.sin(t * 0.7 + i) * 34 + t * (12 + r() * 26) * speed) % (W + 40) - 20;
    const sy = (r() * H + t * (46 + r() * 70) * speed) % (H + 40) - 20;
    c.beginPath(); c.arc(sx, sy, 2.4 + r() * 3.2, 0, 7); c.fill();
  }
  c.restore();
};

// ---------- 地 / 雪坡：一条轮廓 + 稀疏排线（留白才够） ----------
Z.ground = (c, y0, { seed = 9, tone = 0.42, bump = 46 } = {}) => {
  const pts = [];
  for (let x = -20; x <= W + 20; x += 26) pts.push([x, y0 - Math.sin(x * 0.0035 + seed) * bump * 0.5]);
  Z.hatchBox(c, [...pts, [W + 20, H + 20], [-20, H + 20]], { ang: -0.55, gap: 26, tone: tone * 0.34, seed: 700 + seed });
  Z.wire(c, pts, { w: 2.6, tone, seed: 710 + seed, taper: 0.05 });
};

// ---------- 榜题框（版画插图的题目必须有双边框） ----------
Z.labelBox = (c, x, y, w, h, { tone = 0.8, seed = 11 } = {}) => {
  Z.wire(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], { w: 2.4, tone, seed, taper: 0.05 });
  Z.wire(c, [[x + 4, y + 4], [x + w - 4, y + 4], [x + w - 4, y + h - 4], [x + 4, y + h - 4], [x + 4, y + 4]], { w: 1, tone: tone * 0.55, seed: seed + 3, taper: 0.05 });
};

// ---------- 竖排题字 ----------
Z.bigText = (c, text, { x = 1500, y = 130, size = 54, gap = 1.18, tone = 0.86, font = '"LXGWWenKai-500"', appear = 1, shadow = true } = {}) => {
  const chars = [...text].slice(0, Math.round(text.length * clamp(appear, 0, 1)));
  c.save(); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  if (shadow) { c.fillStyle = 'rgba(255,255,255,.5)'; chars.forEach((ch, i) => c.fillText(ch, x + 2, y + i * size * gap + 2)); }
  c.fillStyle = ink(tone); chars.forEach((ch, i) => c.fillText(ch, x, y + i * size * gap));
  c.restore();
};

// ---------- 钤印：唯一允许朱砂的地方之一（q 未起时整枚不画，不留空框） ----------
Z.seal = (c, x, y, text, q = 1, { size = 26, seed = 13, col = CINNABAR } = {}) => {
  const chars = [...text], n = Math.round(chars.length * clamp(q, 0, 1));
  if (n < 1) return;
  const cs = chars.slice(0, n);
  const w = size * 2.5, h = size * cs.length * 1.06 + 10;
  c.save();
  const r = rng(seed);
  c.strokeStyle = cin(0.86); c.lineWidth = 2.4; c.strokeRect(x, y, w, h);
  c.fillStyle = cin(0.1); c.fillRect(x, y, w, h);
  for (let i = 0; i < 90; i++) { c.fillStyle = cin(0.14 + r() * 0.2); c.fillRect(x + r() * w, y + r() * h, 1 + r() * 2, 1 + r() * 2); }
  c.fillStyle = cin(0.9); c.font = `${size}px "LXGWWenKai-500"`; c.textAlign = 'center'; c.textBaseline = 'middle';
  cs.forEach((ch, i) => c.fillText(ch, x + w / 2, y + size * 0.9 + i * size * 1.06));
  c.restore();
};

// ---------- 旗（替天行道 / 酒旗）：淡朱底 + 排线，杆一笔 ----------
Z.flag = (c, x, y, h, t, { text = '', seed = 1, size = 34, droop = 0.35 } = {}) => {
  const wav = Math.sin(t * 2.1 + x * 0.01) * 0.05;
  const w = h * 0.52;
  c.save(); c.translate(x, y); c.rotate(wav);
  const pts = [[0, 0], [w, 4], [w * (1 - droop * 0.3), h * 0.55], [w * (1 - droop * 0.6), h], [w * 0.1, h * 0.98]];
  Z.wire(c, pts, { w: 2.6, tone: 0.8, seed, taper: 0.06 });
  c.save(); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.clip();
  c.fillStyle = cin(0.13); c.fill();
  Z.hatchBox(c, pts, { ang: 0.2, gap: 12, tone: 0.1, seed: seed + 5 });
  c.restore();
  if (text) {
    c.save(); c.fillStyle = ink(0.88); c.font = `${size}px "LXGWWenKai-500"`; c.textAlign = 'center'; c.textBaseline = 'middle';
    [...text].forEach((ch, i) => c.fillText(ch, w / 2, 34 + i * size * 1.12)); c.restore();
  }
  Z.wire(c, [[-1, -6], [-1, h + 26]], { w: 3, tone: 0.85, seed: seed + 9, taper: 0.1 });   // 杆
  c.restore();
};

// ---------- 屋脊（界画的味道：直角要准，瓦垄等距） ----------
Z.roof = (c, x, y, w, h, { tone = 0.8, seed = 1, tiles = true } = {}) => {
  const pts = [[x - w / 2, y], [x, y - h], [x + w / 2, y], [x + w / 2, y + 8], [x - w / 2, y + 8], [x - w / 2, y]];
  Z.wire(c, pts, { w: 2.8, tone, seed, taper: 0.05 });
  if (tiles) {
    for (let i = 1; i < 9; i++) {
      const u = i / 9;
      Z.wire(c, [[lerp(x - w / 2, x, u), lerp(y, y - h, u)], [lerp(x - w / 2, x, u) + 2, lerp(y, y - h, u) + 14]], { w: 1.3, tone: tone * 0.6, seed: 900 + i });
      Z.wire(c, [[lerp(x + w / 2, x, u), lerp(y, y - h, u)], [lerp(x + w / 2, x, u) - 2, lerp(y, y - h, u) + 14]], { w: 1.3, tone: tone * 0.6, seed: 950 + i });
    }
  }
};

// ---------- 火：枯笔 + 朱砂星点 ----------
Z.flame = (c, x, y, s, t, { seed = 1, tone = 0.7 } = {}) => {
  const r = rng(seed);
  for (let k = 0; k < 5; k++) {
    const ph = r() * 6.28, amp = 14 + r() * 20;
    const pts = [];
    for (let i = 0; i <= 6; i++) { const u = i / 6; pts.push([Math.sin(t * 3 + ph + u * 2.2) * amp * u, -(u * (110 + k * 22))]); }
    Z.wire(c, pts, { w: 3.2 - k * 0.35, tone: tone * (1 - k * 0.12), seed: 610 + seed * 5 + k, taper: 0.3 });
  }
  c.save(); c.fillStyle = cin(0.5);
  for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(x + Math.sin(t * 2 + i) * 18, y - 40 - i * 16 - (t * 40 % 60), 2 + r() * 3, 0, 7); c.fill(); }
  c.restore();
};

// ---------- 通用配角（王进 / 少华山头领 / 官军 / 牛二 / 周谨等）：一身线描 + 可选头盔 + 枪或刀 ----------
Z.fighter = (c, x, y, s, t, { flip = 0, tone = 0.78, helmet = 0, blade = 0, spear = 0, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const br = Math.sin(t * 1.6 + seed) * 2;
  const body = [[-40, -150], [-50, -70], [-54, 0], [54, 0], [50, -70], [40, -150]];
  Z.lined(c, body, { w: 3, tone, seed, hatch: 0.16, gap: 11, hatchAng: -0.9 });
  Z.wire(c, [[-46, -82], [46, -82]], { w: 3.4, tone: 0.9, seed: seed + 1 });
  const hy = -190 + br * 0.4;
  Z.wire(c, [[-18, hy - 10], [-15, hy - 32], [0, hy - 42], [15, hy - 32], [18, hy - 10], [16, hy + 12], [0, hy + 22], [-16, hy + 10]], { w: 2.4, tone, seed: seed + 2, taper: 0.08 });
  Z.wire(c, [[-8, hy - 4], [-3, hy - 3]], { w: 1.6, tone: 0.85, seed });
  Z.wire(c, [[3, hy - 3], [8, hy - 4]], { w: 1.6, tone: 0.85, seed: seed + 3 });
  Z.wire(c, [[-6, hy + 10], [6, hy + 10]], { w: 1.8, tone: 0.75, seed: seed + 4 });
  if (helmet) {
    Z.lined(c, [[-22, hy - 16], [-18, hy - 44], [18, hy - 44], [22, hy - 16]], { w: 2.6, tone: 0.92, seed: seed + 5, hatch: 0.18, gap: 5 });
    Z.wire(c, [[0, hy - 44], [0, hy - 58], [6, hy - 50]], { w: 2.2, tone: 0.85, seed: seed + 6 });
  } else {
    Z.wire(c, [[-18, hy - 20], [-14, hy - 44], [14, hy - 44], [18, hy - 20]], { w: 2.4, tone: 0.9, seed: seed + 5 });
    Z.wire(c, [[-18, hy - 20], [18, hy - 20]], { w: 2, tone: 0.7, seed: seed + 6 });
  }
  if (spear) {
    Z.wire(c, [[34, -140], [54, -200], [50, -330]], { w: 3.4, tone: 0.95, seed: seed + 7, taper: 0.05 });
    Z.wire(c, [[54, -200], [66, -210]], { w: 2.6, tone, seed: seed + 8 });
    Z.wire(c, [[54, -200], [42, -210]], { w: 2.6, tone, seed: seed + 9 });
  }
  if (blade) {
    Z.wire(c, [[44, -136], [64, -96], [68, -40]], { w: 3, tone, seed: seed + 7 });
    Z.wire(c, [[68, -40], [62, -230]], { w: 3.4, tone: 0.92, seed: seed + 8, taper: 0.04 });
    Z.lined(c, [[62, -230], [70, -256], [62, -276]], { w: 2.4, tone, seed: seed + 9 });
  }
  c.restore();
};

// ---------- 史家庄院（门楼重檐 + 院墙 + 瓦垄 + 匾） ----------
Z.manor = (c, x, y, s, { tone = 0.82, seed = 1, text = '' } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-284, 0], [-284, -150], [284, -150], [284, 0]], { w: 3.4, tone, seed });
  Z.hatchBox(c, [[-284, 0], [284, 0], [284, -150], [-284, -150]], { ang: -1.4, gap: 18, tone: 0.1, seed });
  Z.roof(c, 0, -150, 380, 92, { tone: 0.9, seed });
  Z.roof(c, 0, -252, 286, 70, { tone: 0.85, seed: seed + 1 });
  Z.wire(c, [[-62, -150], [-62, -58], [62, -58], [62, -150]], { w: 3, tone: 0.85, seed: seed + 2 });
  if (text) {
    Z.labelBox(c, -54, -206, 108, 30, { tone: 0.9, seed: seed + 3 });
    c.save(); c.fillStyle = 'rgba(26,26,28,.86)'; c.font = '23px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, 0, -191); c.restore();
  }
  c.restore();
};

// ---------- 少华山寨 / 二龙山寨（木栅 + 望楼 + 旗） ----------
Z.shanzhai = (c, x, y, s, { tone = 0.8, seed = 1, text = '' } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = -6; i <= 6; i++) Z.wire(c, [[i * 40, 0], [i * 40 - 6, -128], [i * 40 + 6, -128], [i * 40, 0]], { w: 2.8, tone, seed: 100 + i });
  Z.wire(c, [[-250, 0], [250, 0]], { w: 3.4, tone, seed: 200 });
  Z.wire(c, [[-250, -128], [250, -128]], { w: 3, tone, seed: 201 });
  Z.wire(c, [[-66, -128], [-66, -226], [66, -226], [66, -128]], { w: 3.2, tone: 0.85, seed: 202 });
  Z.roof(c, 0, -226, 210, 70, { tone: 0.9, seed: 203 });
  if (text) {
    Z.labelBox(c, -50, -282, 100, 28, { tone: 0.9, seed: seed + 3 });
    c.save(); c.fillStyle = 'rgba(26,26,28,.86)'; c.font = '22px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, 0, -268); c.restore();
  }
  c.restore();
};

// ---------- 城关（昱岭关 / 任意关隘：城墙 + 砖纹 + 门洞 + 敌楼） ----------
Z.guan = (c, x, y, s, { tone = 0.82, seed = 1, text = '' } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-380, 0], [-380, -210], [380, -210], [380, 0]], { w: 4, tone, seed });
  Z.hatchBox(c, [[-380, 0], [380, 0], [380, -210], [-380, -210]], { ang: -1.4, gap: 16, tone: 0.12, seed: seed + 1 });
  for (let i = -340; i < 340; i += 42) Z.wire(c, [[i, -210], [i, -110]], { w: 1.4, tone: 0.5, seed: 300 + i });
  Z.wire(c, [[-72, -210], [-72, -112], [72, -112], [72, -210]], { w: 3.4, tone: 0.9, seed: 400 });
  Z.wire(c, [[-190, -210], [-190, -306], [190, -306], [190, -210]], { w: 3.4, tone: 0.85, seed: 401 });
  Z.roof(c, 0, -306, 440, 92, { tone: 0.9, seed: 402 });
  if (text) {
    Z.labelBox(c, -54, -362, 108, 28, { tone: 0.9, seed: seed + 3 });
    c.save(); c.fillStyle = 'rgba(26,26,28,.86)'; c.font = '22px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, 0, -348); c.restore();
  }
  c.restore();
};

// ---------- 天汉州桥（市井石桥：拱 + 栏 + 河） ----------
Z.bridge = (c, x, y, s, { tone = 0.82, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-360, 0], [-200, -90], [200, -90], [360, 0]], { w: 3.4, tone, seed });
  Z.wire(c, [[-360, 0], [-200, -120], [200, -120], [360, 0]], { w: 3, tone: 0.85, seed: seed + 1 });
  Z.hatchBox(c, [[-360, 0], [360, 0], [200, -90], [-200, -90]], { ang: -1.4, gap: 20, tone: 0.1, seed: seed + 2 });
  for (let i = -3; i <= 3; i++) Z.wire(c, [[i * 110, -90], [i * 110, -118]], { w: 2.4, tone: 0.7, seed: 100 + i });
  c.restore();
};

// ---------- 黄河船（花石纲沉船意象：船身 + 帆） ----------
Z.boat = (c, x, y, s, t, { tone = 0.8, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-160, 0], [-120, -46], [120, -46], [160, 0]], { w: 3.4, tone, seed });
  Z.wire(c, [[-160, 0], [160, 0]], { w: 3, tone, seed: seed + 1 });
  Z.wire(c, [[-90, -46], [-90, -176], [70, -176], [70, -46]], { w: 2.6, tone: 0.85, seed: seed + 2 });
  Z.wire(c, [[-90, -46], [70, -176]], { w: 1.8, tone: 0.5, seed: seed + 3 });
  c.restore();
};

// ---------- 营帐（征方腊丹徒：帐 + 旗 + 灯火底座） ----------
Z.tent = (c, x, y, s, { tone = 0.8, seed = 1, text = '' } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-150, 0], [-150, -120], [0, -200], [150, -120], [150, 0]], { w: 3.4, tone, seed });
  Z.roof(c, 0, -200, 320, 80, { tone: 0.9, seed: seed + 1 });
  Z.wire(c, [[-60, 0], [-60, -150], [60, -150], [60, 0]], { w: 3, tone: 0.85, seed: seed + 2 });
  if (text) {
    Z.labelBox(c, -44, -250, 88, 26, { tone: 0.9, seed: seed + 3 });
    c.save(); c.fillStyle = 'rgba(26,26,28,.86)'; c.font = '21px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, 0, -237); c.restore();
  }
  c.restore();
};

// ---------- 生辰纲箱笼（第十万贯金银——以箱笼排线代，不画财宝） ----------
Z.crate = (c, x, y, s, { tone = 0.78, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-46, 0], [-46, -60], [46, -60], [46, 0]], { w: 3.2, tone, seed });
  Z.wire(c, [[-46, 0], [46, 0]], { w: 3.4, tone, seed: seed + 1 });
  Z.hatchBox(c, [[-46, 0], [46, 0], [46, -60], [-46, -60]], { ang: -0.9, gap: 9, tone: 0.16, seed: seed + 2 });
  Z.wire(c, [[-46, -60], [46, -60]], { w: 3.2, tone, seed: seed + 3 });
  c.restore();
};
})();
