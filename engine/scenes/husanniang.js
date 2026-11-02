// 《水浒传·扈三娘》rig + 九幕（宋元版画线描 + 焦墨）
// 造型：郓州扈家庄扈太公之女，绰号「一丈青」，使两口日月双刀，善用红锦套索。
//   特征：① 日月双刀（signature 兵器）② 红锦套索（朱砂，signature）③ 雉尾帅盔 ④ 战袍裙甲。
// 唯一的彩：朱砂只用于① 红锦套索 ② 第五幕灭门的血光点 ③ 末幕「一丈青」钤印——余皆黑白灰。
// 母题：① 双刀 ② 套索 ③ 雉尾 ④ 并肩。
// 弧光：扈家庄习武 → 三庄联防 → 套索生擒王英 → 为林冲所活捉 → 李逵杀尽扈家满门 →
//       宋江作主嫁与王英 → 南征北讨并肩 → 乌龙岭王英战死 → 报仇同殉，追封花阳郡夫人。
// 依《水浒传》第四十七至五十回、第一百十七至十八回（征方腊乌龙岭）。
// 互文：第四幕复用林冲（活捉她的人）、第五幕复用李逵（杀她全家的人）、第六幕复用宋江（作主者）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 日月双刀（signature：一日一月，一刀圆首、一刀弯钩）
Z.riyue = (c, x, y, s, { tone = 0.92, seed = 1, open = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  // 左·月刀（弯钩）
  c.save();
  c.rotate(-0.1 - open * 0.16);
  Z.wire(c, [[0, 128], [0, 26]], { w: 4.2, tone, seed, taper: 0.06 });
  Z.wire(c, [[0, 26], [-34, -46], [-52, -128], [-30, -196]], { w: 3.4, tone, seed: seed + 1, taper: 0.05 });
  Z.wire(c, [[0, 26], [-14, -44], [-20, -122], [-30, -196]], { w: 3.2, tone: tone * 0.92, seed: seed + 2, taper: 0.05 });
  c.fillStyle = 'rgba(26,26,28,.26)';
  c.beginPath();
  c.moveTo(0, 26); c.lineTo(-34, -46); c.lineTo(-52, -128); c.lineTo(-30, -196);
  c.lineTo(-20, -122); c.lineTo(-14, -44); c.closePath(); c.fill();
  Z.wire(c, [[-52, -128], [-68, -152]], { w: 2.6, tone, seed: seed + 3 });
  Z.wire(c, [[0, 24], [0, 40]], { w: 6, tone: tone * 0.85, seed: seed + 4 });     // 护手
  c.restore();
  // 右·日刀（圆首直刀）
  c.save(); c.rotate(0.12 + open * 0.18);
  Z.wire(c, [[0, 128], [0, 30]], { w: 4.2, tone, seed: seed + 10, taper: 0.06 });
  Z.wire(c, [[0, 30], [26, -50], [30, -160]], { w: 3.4, tone, seed: seed + 11, taper: 0.05 });
  Z.wire(c, [[0, 30], [12, -50], [14, -150], [30, -160]], { w: 3.2, tone: tone * 0.92, seed: seed + 12, taper: 0.05 });
  c.fillStyle = 'rgba(26,26,28,.26)';
  c.beginPath();
  c.moveTo(0, 30); c.lineTo(26, -50); c.lineTo(30, -160); c.lineTo(14, -150); c.lineTo(12, -50); c.closePath(); c.fill();
  Z.wire(c, [[-6, -186], [0, -204], [10, -200], [6, -184]], { w: 2.2, tone: tone * 0.9, seed: seed + 13 });
  Z.wire(c, [[-14, -170], [14, -170]], { w: 2, tone: tone * 0.7, seed: seed + 14 });
  Z.wire(c, [[0, 28], [0, 44]], { w: 6, tone: tone * 0.85, seed: seed + 15 });
  c.restore();
  c.restore();
};

// 红锦套索（signature：全片唯一彩 —— 朱砂绳）
Z.taosuo = (c, x, y, s, t, { seed = 1, fly = 0, len = 300, curl = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.2);
  const rr = rng(seed);
  const pts = [];
  for (let i = 0; i <= 14; i++) {
    const u = i / 14, wob = Math.sin(t * 2.6 + u * 4.2) * 26 * u * curl;
    pts.push([u * len * (0.4 + fly * 0.75), wob - u * 90 * (1 - fly * 0.5)]);
  }
  c.strokeStyle = 'rgba(183,51,46,.62)'; c.lineWidth = 3.4; c.lineCap = 'round';
  c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
  c.strokeStyle = 'rgba(183,51,46,.3)'; c.lineWidth = 1.6;
  for (let i = 0; i < 20; i++) {
    const u = rr();
    const p = [u * len * (0.4 + fly * 0.75), Math.sin(t * 2.6 + u * 4.2) * 26 * u * curl - u * 90 * (1 - fly * 0.5)];
    c.beginPath(); c.arc(p[0], p[1], 1.4 + rr() * 1.8, 0, 7); c.stroke();
  }
  if (fly > 0.25) {
    const ex = len * (0.4 + fly * 0.75), ey = Math.sin(t * 2.6 + 4.2) * 26 * curl - 90 * (1 - fly * 0.5);
    c.strokeStyle = 'rgba(183,51,46,.72)'; c.lineWidth = 3.6;
    c.beginPath(); c.ellipse(ex + 42, ey - 14, 48, 26, Math.sin(t * 1.8) * 0.2, 0, 7); c.stroke();
    c.strokeStyle = 'rgba(183,51,46,.34)'; c.lineWidth = 2;
    c.beginPath(); c.ellipse(ex + 42, ey - 14, 62, 36, Math.sin(t * 1.8) * 0.2, 0, 7); c.stroke();
  }
  c.restore();
};

// 王英（矮脚虎：五短身材、使枪）
Z.wangying = (c, x, y, s, t, o = {}) => {
  const { flip = 0, down = 0, spear = 1, tone = 0.88 } = o;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  if (down) c.rotate(-down * 1.2);
  const body = [[-42, -96], [-50, -34], [-46, 0], [46, 0], [50, -34], [42, -96]];
  Z.lined(c, body, { w: 3.2, tone, seed: 601, hatch: 0.2, gap: 9 });
  Z.wire(c, [[-48, -46], [48, -46]], { w: 3.4, tone, seed: 602 });
  const hy = -136;
  Z.wire(c, [[-22, hy - 10], [-19, hy - 32], [0, hy - 42], [19, hy - 32], [22, hy - 10], [20, hy + 14], [0, hy + 24], [-20, hy + 12]], { w: 2.6, tone, seed: 603, taper: 0.08 });
  Z.wire(c, [[-10, hy - 6], [-3, hy - 5]], { w: 1.8, tone, seed: 604 });
  Z.wire(c, [[3, hy - 5], [10, hy - 6]], { w: 1.8, tone, seed: 605 });
  Z.wire(c, [[-9, hy + 8], [9, hy + 8]], { w: 2, tone: tone * 0.8, seed: 606 });
  Z.wire(c, [[-22, hy - 18], [-18, hy - 46], [18, hy - 46], [22, hy - 18]], { w: 2.6, tone: 0.92, seed: 607 });
  Z.wire(c, [[-22, hy - 18], [22, hy - 18]], { w: 2.2, tone: 0.7, seed: 608 });
  if (spear) {
    Z.wire(c, [[40, -86], [56, -140], [52, -268]], { w: 3.4, tone: 0.95, seed: 609, taper: 0.05 });
    Z.wire(c, [[56, -140], [68, -152]], { w: 2.6, tone, seed: 610 });
    Z.wire(c, [[56, -140], [44, -152]], { w: 2.6, tone, seed: 611 });
  }
  c.restore();
};

// ============================== 扈三娘本体 ==============================
// o: { blades双刀, rope红锦套索, cape披风, flip, raise, ride, kneel, bound绑, down倒, tone }
Z.husanniang = (c, x, y, s, t, o = {}) => {
  const {
    blades = 1, rope = 0, cape = 1, flip = 0, raise = 0, ride = 0,
    kneel = 0, bound = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.35) * 2.2;
  c.save();
  c.translate(x, y);
  c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 46 : 0) - (ride ? 58 : 0);
  const shoulderY = ly - 156;
  const waistY = ly - 78;
  const hipY = ly - 26;

  // ---- 下身：战袍裙甲（女性最醒目的辨识）----
  const skirt = [[-40, hipY - 12], [-78, ly + 2], [78, ly + 2], [40, hipY - 12]];
  Z.lined(c, skirt, { w: 3.4, tone, seed: 20, hatch: 0.18, gap: 9, hatchAng: -1.1 });
  for (let i = 0; i < 7; i++) {
    const u = -1 + i * 0.333;
    Z.wire(c, [[u * 34, hipY - 10], [u * 66, ly + 2]], { w: 2, tone: tone * 0.66, seed: 30 + i });
  }
  if (ride) {
    Z.wire(c, [[-40, hipY], [-58, hipY + 34], [-66, hipY + 58]], { w: 4, tone, seed: 40, taper: 0.1 });
    Z.wire(c, [[40, hipY], [58, hipY + 34], [66, hipY + 58]], { w: 4, tone, seed: 41, taper: 0.1 });
  } else {
    Z.wire(c, [[-38, ly + 2], [-52, ly + 12], [-46, ly + 20]], { w: 2.6, tone: tone * 0.8, seed: 42 });
    Z.wire(c, [[38, ly + 2], [52, ly + 12], [46, ly + 20]], { w: 2.6, tone: tone * 0.8, seed: 43 });
  }

  // ---- 躯干（短甲）----
  const body = [[-52, shoulderY + 6], [-58, waistY + 2], [-48, hipY - 6], [48, hipY - 6], [58, waistY + 2], [52, shoulderY + 6]];
  Z.lined(c, body, { w: 3.4, tone, seed: 50, hatch: 0.2, gap: 8 });
  c.save(); c.fillStyle = 'rgba(118,120,126,.14)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  for (let i = 0; i < 3; i++) Z.wire(c, [[-50, shoulderY + 30 + i * 20], [50, shoulderY + 30 + i * 20]], { w: 1.8, tone: tone * 0.55, seed: 51 + i });
  Z.wire(c, [[-58, waistY + 2], [58, waistY + 2], [58, waistY + 20], [-58, waistY + 20], [-58, waistY + 2]], { w: 3.2, tone, seed: 56, taper: 0.06 });
  Z.lined(c, [[-52, shoulderY + 6], [-72, shoulderY + 24], [-62, shoulderY + 50]], { w: 2.8, tone: tone * 0.9, seed: 57, hatch: 0.14 });
  Z.lined(c, [[52, shoulderY + 6], [72, shoulderY + 24], [62, shoulderY + 50]], { w: 2.8, tone: tone * 0.9, seed: 58, hatch: 0.14 });
  // 胸甲「日月」文字徽记（signature 文字化，避开复杂兽形）
  c.save(); c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '30px "LXGWWenKai-500"';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('日月', 0, shoulderY + 42);
  c.restore();

  // ---- 双臂 ----
  const handY = shoulderY + 52 - raise * 46;
  Z.wire(c, [[-52, shoulderY + 12], [-86, shoulderY + 38], [-78, handY + 6]], { w: 3.8, tone, seed: 60, taper: 0.1 });
  Z.wire(c, [[52, shoulderY + 12], [86, shoulderY + 34 - raise * 26], [78, handY - raise * 30]], { w: 3.8, tone, seed: 61, taper: 0.1 });
  if (bound) {
    Z.wire(c, [[-78, handY + 2], [78, handY - 6]], { w: 3, tone: tone * 0.9, seed: 62 });
    Z.wire(c, [[-72, handY + 10], [72, handY - 2]], { w: 2.4, tone: tone * 0.8, seed: 63 });
  } else {
    Z.lined(c, [[-78, handY + 4], [-64, handY + 20], [-52, handY + 6], [-62, handY - 8]], { w: 2.2, tone: tone * 0.85, seed: 64 });
    Z.lined(c, [[78, handY - 6], [64, handY + 10], [52, handY - 4], [62, handY - 18]], { w: 2.2, tone: tone * 0.85, seed: 65 });
  }

  // ---- 头（女将 + 雉尾帅盔 signature）----
  const hy = shoulderY - 40 + br * 0.5;
  const face = [[-21, hy - 12], [-19, hy - 36], [0, hy - 48], [19, hy - 36], [21, hy - 12], [19, hy + 12], [0, hy + 24], [-19, hy + 10]];
  Z.lined(c, face, { w: 2.6, tone: tone * 0.95, seed: 100, hatch: 0.06, gap: 9 });
  Z.wire(c, [[-16, hy - 16], [-8, hy - 22], [-2, hy - 19]], { w: 2.2, tone, seed: 101 });
  Z.wire(c, [[2, hy - 19], [8, hy - 22], [16, hy - 16]], { w: 2.2, tone, seed: 102 });
  Z.wire(c, [[-13, hy - 8], [-4, hy - 7]], { w: 2, tone, seed: 103 });
  Z.wire(c, [[4, hy - 7], [13, hy - 8]], { w: 2, tone, seed: 104 });
  Z.wire(c, [[-6, hy + 4], [6, hy + 3]], { w: 2, tone: tone * 0.8, seed: 105 });
  for (let i = 0; i < 2; i++) {
    const sx = i ? 18 : -18, wob = Math.sin(t * 1.9 + i * 2) * 5;
    Z.wire(c, [[sx, hy - 6], [sx + wob, hy + 22], [sx + wob * 1.6, hy + 46]], { w: 2.4, tone: tone * 0.9, seed: 106 + i, taper: 0.3 });
  }
  Z.wire(c, [[-24, hy - 20], [-20, hy - 46], [20, hy - 46], [24, hy - 20]], { w: 2.8, tone: 0.92, seed: 130 });
  Z.wire(c, [[-20, hy - 46], [-12, hy - 66], [12, hy - 66], [20, hy - 46]], { w: 3, tone: 0.92, seed: 131 });
  Z.wire(c, [[-12, hy - 66], [0, hy - 78], [12, hy - 66]], { w: 2.6, tone: 0.9, seed: 132 });
  for (let i = 0; i < 2; i++) {
    const sx = i ? 20 : -20, wob = Math.sin(t * 2.1 + i * 2.2) * 12;
    Z.wire(c, [[sx, hy - 44], [sx * 1.8 + wob, hy - 84], [sx * 2.4 + wob * 1.8, hy - 130]], { w: 2.4, tone: 0.86, seed: 133 + i, taper: 0.4 });
    Z.wire(c, [[sx * 1.8 + wob, hy - 84], [sx * 2.0 + wob, hy - 108]], { w: 1.6, tone: 0.7, seed: 135 + i });
  }

  // ---- 披风 ----
  if (cape) {
    const sw = Math.sin(t * 1.7) * 16;
    Z.lined(c, [[-52, shoulderY + 8], [-104 + sw, shoulderY + 60], [-96 + sw * 1.6, ly - 6], [-46, hipY - 8]],
      { w: 2.6, tone: tone * 0.72, seed: 150, hatch: 0.16, gap: 11, hatchAng: 0.4 });
  }

  // ---- 手持：必须在 c.restore() 之前 ----
  if (blades) Z.riyue(c, 84, handY + 6, 1.0, { tone, seed: 170, open: 0.4 + raise * 0.6 });
  if (rope) Z.taosuo(c, -76, handY - 10, 1.0, t, { seed: 180, fly: 0.2 + Math.sin(t * 1.6) * 0.2 });
  c.restore();
};

// ============================== 九幕 ==============================

// ① 扈家庄习武：扈太公之女，一双日月双刀
SCENES['hs1_zhuang'] = (() => {
  const p = () => Z.paper('hs1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 380, y: 176, s: 1.05, seed: 4, tone: 0.32 });
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.manor(c, 1520, 780, 0.92, { tone: 0.86, seed: 12, text: '扈家庄' });
      Z.pine(c, t, { x: 320, y: 892, s: 1.0, seed: 14, tone: 0.84 });
      Z.wire(c, [[520, 892], [520, 640], [860, 640], [860, 892]], { w: 3.4, tone: 0.84, seed: 15 });
      Z.wire(c, [[580, 892], [580, 660]], { w: 2.6, tone: 0.8, seed: 16 });
      Z.wire(c, [[800, 892], [800, 660]], { w: 2.6, tone: 0.8, seed: 17 });
      for (let i = 0; i < 5; i++) {
        const bx = 546 + i * 58, tip = 556 - (i % 2 ? 44 : 22);
        Z.wire(c, [[bx, 660], [bx + 6, tip]], { w: 2.8, tone: 0.82, seed: 18 + i, taper: 0.05 });
        Z.wire(c, [[bx - 6, tip], [bx + 6, tip + 30]], { w: 2.2, tone: 0.7, seed: 24 + i });
      }
      const sw = clamp(Math.sin(t * 2.3) * 0.5 + 0.5);
      Z.husanniang(c, 1120, 892, 1.52, t, { blades: 1, rope: 0, raise: sw });
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 52 + i * 210) % 1980) - 30, by = 330 + ((t * 38 + i * 150) % 460);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.36, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '扈家庄', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.2, lt)) });
  } };
})();

// ② 三庄联防：扈家庄与祝家庄、李家庄结盟
SCENES['hs2_lianmeng'] = (() => {
  const p = () => Z.paper('hs2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 552, amp: 170, tone: 0.3, seed: 31 }]);
      Z.ground(c, 900, { seed: 32, tone: 0.44 });
      Z.manor(c, 1560, 790, 0.8, { tone: 0.84, seed: 33, text: '祝家庄' });
      Z.manor(c, 380, 790, 0.72, { tone: 0.76, seed: 34, text: '李家庄' });
      Z.flag(c, 700, 560, 200, t, { text: '扈', seed: 35, size: 32 });
      Z.flag(c, 1180, 560, 200, t, { text: '扈', seed: 36, size: 32 });
      // 三庄连线（同盟）—— 用虚线索性一笔
      Z.wire(c, [[380, 700], [940, 660], [1560, 700]], { w: 2.4, tone: 0.5, seed: 37, taper: 0.1 });
      for (let i = 0; i < 4; i++) Z.fighter(c, 1420 + i * 90, 892, 0.7, t, { flip: 1, spear: 1, tone: 0.6, seed: 38 + i });
      Z.husanniang(c, 900, 892, 1.5, t, { blades: 1, ride: 1, raise: clamp(ss(0.3, 1.4, lt)) });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 104 + i * 168) % 1420) + 300, dy = 800 + ((t * 34 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 6]], { w: 2, tone: 0.36, seed: 1960 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '三庄联防', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 套索生擒王英：红锦套索（朱砂 signature）一抛，活捉矮脚虎
SCENES['hs3_shengqin'] = (() => {
  const p = () => Z.paper('hs3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 41, tone: 0.44 });
      Z.flag(c, 300, 540, 200, t, { text: '扈', seed: 42, size: 30 });
      Z.flag(c, 1620, 540, 200, t, { text: '梁山', seed: 43, size: 30 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1560 + i * 110, 892, 0.72, t, { flip: 1, tone: 0.6, seed: 44 + i });
      // 王英（突击 → 被拽）
      const caught = clamp(ss(1.2, 2.4, lt));
      Z.wangying(c, lerp(1500, 1320, caught), 892, 1.16, t, { flip: 1, down: caught * 0.5, spear: 1 });
      // 扈三娘（抛索）
      const swing = clamp(ss(0.3, 1.4, lt));
      Z.husanniang(c, 760, 892, 1.54, t, { blades: 0, rope: 1, ride: 1, raise: swing });
      // 朱砂飞索：从三娘手中甩向王英（全片唯一彩的使用点之一）
      if (lt > 0.5) {
        c.save(); c.strokeStyle = 'rgba(183,51,46,.68)'; c.lineWidth = 3.6; c.lineCap = 'round';
        const k = clamp(ss(0.5, 1.5, lt));
        const ex = lerp(940, lerp(1500, 1320, caught) - 60, k);
        c.beginPath();
        c.moveTo(860, 740);
        c.quadraticCurveTo((860 + ex) / 2 + Math.sin(t * 3.2) * 40, 620 - k * 40, ex, 800 - caught * 40);
        c.stroke();
        c.strokeStyle = 'rgba(183,51,46,.4)'; c.lineWidth = 2.4;
        c.beginPath(); c.ellipse(ex + 10, 806 - caught * 40, 56, 30, Math.sin(t * 2) * 0.2, 0, 7); c.stroke();
        c.restore();
      }
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 118 + i * 165) % 1400) + 320, dy = 800 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 5]], { w: 1.9, tone: 0.36, seed: 1970 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '红锦套索', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 为林冲所活捉（互文 Z.linchong）
SCENES['hs4_beihuo'] = (() => {
  const p = () => Z.paper('hs4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 548, amp: 180, tone: 0.3, seed: 51 }]);
      Z.ground(c, 900, { seed: 52, tone: 0.44 });
      Z.flag(c, 1600, 520, 190, t, { text: '梁山', seed: 53, size: 30 });
      // 林冲（右，花枪朱砂枪缨）
      Z.linchong(c, 1360, 892, 1.44, t, { flip: 1, spear: 1, blade: 0, raise: clamp(ss(0.4, 1.6, lt)) });
      // 扈三娘（左，被拽下马：跪）
      const drop = clamp(ss(0.8, 1.8, lt));
      Z.husanniang(c, 700, 892, 1.5, t, { blades: 0, bound: drop, kneel: drop, raise: 0.2 - drop * 0.2 });
      Z.riyue(c, 980, 878, 0.94, { tone: 0.78, seed: 175, open: 0.2 });    // 双刀坠地
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 108 + i * 172) % 1380) + 340, dy = 800 + ((t * 36 + i * 90) % 100);
        Z.wire(c, [[dx, dy], [dx + 24, dy - 6]], { w: 1.9, tone: 0.36, seed: 1980 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '林冲擒获', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 李逵杀尽扈家满门：不直绘血，只留白 + 朱砂血光点 + 烟烬（互文 Z.likui）
SCENES['hs5_miemen'] = (() => {
  const p = () => Z.paper('hs5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 61, tone: 0.4 });
      // 扈家庄残垣（门楼歪斜 + 断墙）
      c.save(); c.translate(1500, 800); c.rotate(0.06); c.translate(-1500, -800);
      Z.manor(c, 1500, 800, 0.86, { tone: 0.6, seed: 62, text: '扈家庄' });
      c.restore();
      for (let i = 0; i < 6; i++) {
        const bx = 1280 + i * 52, by = 812 - (i % 3) * 30;
        Z.wire(c, [[bx, by], [bx + 34, by - 18]], { w: 2.4, tone: 0.56, seed: 63 + i, taper: 0.5 });
      }
      // 李逵（右，双斧，互文）
      Z.likui(c, 1320, 892, 1.5, t, { axe: 1, raise: clamp(Math.sin(t * 3.2) * 0.3 + 0.5) });
      // 扈三娘（左，跪地背向，画面右侧大面积留白 —— 满门之惨不着一笔）
      Z.husanniang(c, 660, 892, 1.46, t, { blades: 0, kneel: 1, cape: 0, bound: 1, raise: 0.05 });
      // 朱砂血光点（克制：只几点，不画血流）
      const bleed = clamp(ss(0.6, 2.0, lt));
      c.save();
      for (let i = 0; i < 9; i++) {
        const px = 1040 + (i % 3) * 64 + Math.sin(t * 1.6 + i) * 6;
        const py = 790 + Math.floor(i / 3) * 44;
        c.fillStyle = `rgba(183,51,46,${(0.24 + (i % 3) * 0.1) * bleed})`;
        c.beginPath(); c.ellipse(px, py, 7 + (i % 2) * 3, 4 + (i % 3), i, 0, 7); c.fill();
      }
      c.restore();
      // 烟烬（连续·保活气）
      for (let i = 0; i < 14; i++) {
        const sy = 880 - ((t * 46 + i * 130) % 640), sx = 1420 + Math.sin((sy + i * 50) * 0.014 + t) * 60;
        Z.wire(c, [[sx, sy], [sx + 9, sy - 14]], { w: 1.6, tone: 0.34, seed: 1910 + i, taper: 0.8 });
      }
      if (lt > 1.6) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(1.6, 2.6, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('一门老幼，尽遭屠戮', 1000, 330);
        c.restore();
      }
    });
    Z.bigText(c, '扈门之祸', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 宋江作主嫁与王英（互文 Z.songjiang）
SCENES['hs6_xipei'] = (() => {
  const p = () => Z.paper('hs6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 71, tone: 0.4 });
      Z.wire(c, [[1120, 900], [1120, 500], [1820, 500], [1820, 900]], { w: 3.6, tone: 0.88, seed: 72 });
      Z.roof(c, 1470, 500, 760, 156, { tone: 0.9, seed: 73 });
      Z.hatchBox(c, [[1120, 900], [1820, 900], [1820, 500], [1120, 500]], { ang: -1.35, gap: 22, tone: 0.1, seed: 74 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.66)'; c.font = '32px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('忠義堂', 1470, 736); c.restore();
      // 宋江（主婚人）
      Z.songjiang(c, 1180, 892, 1.44, t, { official: 1, raise: clamp(Math.sin(t * 1.2) * 0.16 + 0.2) });
      // 扈三娘（左）

      Z.husanniang(c, 720, 892, 1.48, t, { blades: 0, cape: 1, kneel: clamp(ss(0.8, 1.8, lt)) * 0.7, raise: 0.2 });
      // 王英（右，喜不自胜）
      Z.wangying(c, 1560, 892, 1.1, t, { flip: 1, spear: 0 });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 320 + ((t * 34 + i * 150) % 430);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1916 + i, taper: 0.6 });
      }
      if (lt > 1.8) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.8, 2.8, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('一丈青配矮脚虎，宋江一言而定', 940, 320);
        c.restore();
      }
    });
    Z.bigText(c, '宋江主婚', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 南征北讨：与王英并肩作战
SCENES['hs7_bingjian'] = (() => {
  const p = () => Z.paper('hs7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 200, tone: 0.32, seed: 101 }, { y0: 660, amp: 110, tone: 0.22, seed: 102 }]);
      Z.ground(c, 900, { seed: 103, tone: 0.44 });
      Z.flag(c, 1600, 500, 200, t, { text: '宋', seed: 104, size: 32 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1420 + i * 130, 892, 0.94, t, { flip: 1, blade: 1, tone: 0.72, seed: 110 + i });
      Z.wangying(c, 1080, 892, 1.08, t, { flip: 1, spear: 1 });
      const charge = clamp(ss(0.2, 1.6, lt));
      Z.husanniang(c, lerp(620, 780, charge), 892, 1.56, t, { blades: 1, ride: 1, raise: charge });
      for (let i = 0; i < 6; i++) {
        const a = -1.2 + i * 0.3 + Math.sin(t * 4.5) * 0.1;
        Z.wire(c, [[840, 690], [840 + Math.cos(a) * 76, 690 + Math.sin(a) * 76]], { w: 2.4, tone: 0.5, seed: 1950 + i, taper: 0.8 });
      }
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 110 + i * 165) % 1500) + 280, dy = 800 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1990 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '并肩征战', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑧ 乌龙岭：王英战死
SCENES['hs8_wulong'] = (() => {
  const p = () => Z.paper('hs8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 470, amp: 240, tone: 0.36, seed: 121 }, { y0: 630, amp: 130, tone: 0.24, seed: 122 }]);
      Z.cloud(c, t, { x: 1500, y: 170, s: 1.2, seed: 123, tone: 0.32 });
      Z.ground(c, 900, { seed: 124, tone: 0.42 });
      Z.guan(c, 1580, 760, 0.86, { tone: 0.8, seed: 125, text: '乌龙岭' });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1420 + i * 120, 892, 0.9, t, { flip: 1, spear: 1, tone: 0.7, seed: 126 + i });
      // 王英（已倒）
      const dead = clamp(ss(0.6, 1.6, lt));
      Z.wangying(c, 1160, 892, 1.1, t, { flip: 1, down: dead, spear: 0 });
      // 扈三娘（冲前复仇）
      const rush = clamp(ss(0.8, 2.2, lt));
      Z.husanniang(c, lerp(700, 900, rush), 892, 1.54, t, { blades: 1, ride: 0, raise: rush });
      for (let i = 0; i < 8; i++) {
        const dx = 1000 + ((t * 120 + i * 150) % 520), dy = 760 + (i % 3) * 46;
        Z.wire(c, [[dx, dy], [dx + 26, dy - 12]], { w: 2, tone: 0.44, seed: 1965 + i, taper: 0.8 });
      }
    });
    Z.bigText(c, '乌龙岭', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑨ 报仇同殉：追封花阳郡夫人（朱砂钤印）
SCENES['hs9_zhuisi'] = (() => {
  const p = () => Z.paper('hs9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.6)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 220, tone: 0.34, seed: 131 }, { y0: 660, amp: 120, tone: 0.22, seed: 132 }]);
      Z.cloud(c, t, { x: 420, y: 180, s: 1.1, seed: 133, tone: 0.3 });
      Z.ground(c, 900, { seed: 134, tone: 0.4 });
      // 扈三娘（力竭倾颓）
      const fall = clamp(ss(1.4, 3.0, lt));
      c.save(); c.translate(880, 892); c.rotate(fall * 0.5); c.translate(-880, -892);
      Z.husanniang(c, 880, 892 + fall * 30, 1.52, t, { blades: 1, raise: 0.3 - fall * 0.2 });
      c.restore();
      if (fall > 0.25) {
        for (let i = 0; i < 8; i++) {
          const dx = 820 + ((t * 128 + i * 150) % 540), dy = 740 + (i % 3) * 52;
          Z.wire(c, [[dx, dy], [dx + 26, dy - 12]], { w: 2, tone: 0.42, seed: 1967 + i, taper: 0.8 });
        }
      }
      if (lt > 2.0) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(2.0, 3.0, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('夫妻同殁，追封花阳郡夫人', 1420, 330);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 44 + i * 210) % 1960) - 30, by = 320 + ((t * 30 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1918 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '魂归乌龙', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '一丈青', clamp(ss(0.9, 2.6, lt)), { size: 28 });
  } };
})();
})();
