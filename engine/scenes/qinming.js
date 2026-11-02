// 《水浒传·秦明》rig + 九幕（宋元版画线描 + 焦墨）
// 造型：山后开州人氏，青州兵马统制，使一条狼牙棒，性如烈火，声若雷霆，绰号「霹雳火」，
//   梁山排名第七（天猛星），马军五虎将第三。
//   特征：① 狼牙棒（signature 兵器）② 火焰纹（朱砂，signature）③ 赤发黄须 ④ 连环重甲。
// 唯一的彩：朱砂只用于① 盔上火焰纹 ② 第六幕全家遇害的血光 ③ 末幕「霹雳火」钤印——余皆黑白灰。
// 母题：① 狼牙棒 ② 火焰 ③ 雷霆动势线 ④ 城门。
// 弧光：青州统制 → 清风山起事 → 大战花荣被射落盔缨 → 中计入寨 → 宋江设计假扮秦明夜打青州 →
//       慕容知府杀其全家、首级示众 → 无奈落草、宋江以花荣之妹相赔 → 五虎南征北讨 → 清溪县战死。
// 依《水浒传》第三十三至三十五回、第一百十八回（征方腊清溪县）。
// 版本辨伪：秦明为累积型文学形象，正史无其人；「宋江使人假扮秦明夜打青州、害其全家」
//   出百回本第三十四回，是梁山手段黑暗面的第一次正面呈现，本片直陈而不回避。
// 互文：第三幕复用花荣（射落盔缨者）、第五七幕复用宋江（设计陷害者）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 狼牙棒（signature：长柄 + 八棱棒头 + 周身尖钉）
Z.langya = (c, x, y, s, { tone = 0.94, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.16);
  Z.wire(c, [[0, 196], [0, -30]], { w: 5.6, tone, seed, taper: 0.05 });
  Z.wire(c, [[0, 190], [0, 168]], { w: 7.4, tone: tone * 0.9, seed: seed + 1 });
  // 棒头（八棱）
  const head = [[-40, -30], [-52, -78], [-40, -124], [0, -146], [40, -124], [52, -78], [40, -30], [0, -18]];
  Z.lined(c, head, { w: 3.4, tone, seed: seed + 2, hatch: 0.24, gap: 8, hatchAng: 0.5 });
  c.save(); c.fillStyle = 'rgba(26,26,28,.3)';
  c.beginPath(); head.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  // 周身尖钉（狼牙）
  for (let i = 0; i < 9; i++) {
    const a = -1.45 + i * 0.36;
    const bx = Math.cos(a - 1.57) * 46, by = -74 + Math.sin(a - 1.57) * 58;
    Z.wire(c, [[bx, by], [bx + Math.cos(a - 1.57) * 26, by + Math.sin(a - 1.57) * 26]], { w: 2.8, tone, seed: seed + 10 + i, taper: 0.6 });
  }
  Z.wire(c, [[0, -18], [0, -146]], { w: 2, tone: tone * 0.7, seed: seed + 30 });
  c.restore();
};

// 火焰纹（signature：朱砂点缀的盔焰 / 旗焰）
Z.huoyan = (c, x, y, s, t, { seed = 1, cin = 1, n = 5 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let k = 0; k < n; k++) {
    const ph = k * 1.27, amp = 8 + (k % 3) * 5;
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const u = i / 6;
      pts.push([Math.sin(t * 3.4 + ph + u * 2.4) * amp * u, -(u * (46 + (k % 3) * 16))]);
    }
    Z.wire(c, pts, { w: 2.6 - (k % 3) * 0.4, tone: 0.72, seed: seed * 7 + k, taper: 0.35 });
  }
  if (cin) {
    c.fillStyle = 'rgba(183,51,46,.5)';
    for (let i = 0; i < 5; i++) {
      c.beginPath();
      c.arc(Math.sin(t * 2.2 + i) * 9, -14 - i * 10 - (t * 26 % 22), 1.6 + (i % 3), 0, 7);
      c.fill();
    }
  }
  c.restore();
};

// ============================== 秦明本体 ==============================
// o: { club狼牙棒, armor重甲, flame盔焰, flip, raise, ride, kneel, hurt, down, tone }
Z.qinming = (c, x, y, s, t, o = {}) => {
  const {
    club = 1, armor = 1, flame = 1, flip = 0, raise = 0, ride = 0,
    kneel = 0, hurt = 0, down = 0, tone = 0.94,
  } = o;
  const br = Math.sin(t * 1.5) * 2.6;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  if (down) c.rotate(down * 0.6);
  const ly = -(kneel ? 50 : 0) - (ride ? 60 : 0);
  const shoulderY = ly - 162;
  const waistY = ly - 82;
  const hipY = ly - 26;

  // ---- 腿 ----
  if (ride) {
    Z.wire(c, [[-32, hipY], [-56, hipY + 30], [-68, hipY + 56]], { w: 4.2, tone, seed: 60, taper: 0.1 });
    Z.wire(c, [[32, hipY], [56, hipY + 30], [68, hipY + 56]], { w: 4.2, tone, seed: 61, taper: 0.1 });
  } else {
    Z.wire(c, [[-32, hipY], [-44, hipY + 44], [-40, ly]], { w: 4.2, tone, seed: 62, taper: 0.1 });
    Z.wire(c, [[32, hipY], [44, hipY + 44], [40, ly]], { w: 4.2, tone, seed: 63, taper: 0.1 });
    Z.lined(c, [[-40, ly], [-60, ly - 4], [-62, ly + 15], [-38, ly + 12]], { w: 2.6, tone: tone * 0.85, seed: 64 });
    Z.lined(c, [[40, ly], [60, ly - 4], [62, ly + 15], [38, ly + 12]], { w: 2.6, tone: tone * 0.85, seed: 65 });
  }

  // ---- 躯干（连环重甲）----
  const body = [[-62, shoulderY + 6], [-70, waistY + 4], [-58, hipY], [58, hipY], [70, waistY + 4], [62, shoulderY + 6]];
  Z.lined(c, body, { w: 3.8, tone, seed: 71, hatch: 0.22, gap: 9, hatchAng: -0.9 });
  c.save(); c.fillStyle = 'rgba(112,114,120,.17)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  for (let i = 0; i < 5; i++) Z.wire(c, [[-56, shoulderY + 30 + i * 22], [56, shoulderY + 30 + i * 22]], { w: 2, tone: tone * 0.6, seed: 72 + i });
  Z.wire(c, [[-68, waistY + 2], [68, waistY + 2], [68, waistY + 22], [-68, waistY + 22], [-68, waistY + 2]], { w: 3.6, tone, seed: 76, taper: 0.06 });
  Z.lined(c, [[-62, shoulderY + 6], [-86, shoulderY + 26], [-74, shoulderY + 56]], { w: 3, tone: tone * 0.9, seed: 77, hatch: 0.16 });
  Z.lined(c, [[62, shoulderY + 6], [86, shoulderY + 26], [74, shoulderY + 56]], { w: 3, tone: tone * 0.9, seed: 78, hatch: 0.16 });
  // 火焰纹（肩甲上的 signature 纹样：文字化 + 朱砂点）
  c.save(); c.fillStyle = 'rgba(26,26,28,.7)'; c.font = '28px "LXGWWenKai-500"';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('火', 0, shoulderY + 44);
  c.restore();

  // ---- 双臂 ----
  const handY = shoulderY + 58 - raise * 46;
  Z.wire(c, [[-62, shoulderY + 14], [-96, shoulderY + 44], [-88, handY + 8]], { w: 4.2, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[62, shoulderY + 14], [96, shoulderY + 36 - raise * 28], [88, handY - raise * 34]], { w: 4.2, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[-88, handY + 6], [-74, handY + 22], [-62, handY + 8], [-72, handY - 8]], { w: 2.4, tone: tone * 0.85, seed: 82 });
  Z.lined(c, [[88, handY - 6], [74, handY + 10], [62, handY - 4], [72, handY - 20]], { w: 2.4, tone: tone * 0.85, seed: 83 });

  // ---- 头（赤发黄须 + 铁盔 + 朱砂盔焰）----
  const hy = shoulderY - 42 + br * 0.5;
  const face = [[-26, hy - 14], [-23, hy - 40], [0, hy - 52], [23, hy - 40], [26, hy - 14], [24, hy + 14], [0, hy + 28], [-24, hy + 12]];
  Z.lined(c, face, { w: 2.8, tone: tone * 0.95, seed: 100, hatch: 0.08, gap: 9 });
  // 怒目浓眉（性如烈火）
  Z.wire(c, [[-20, hy - 18], [-8, hy - 12], [-2, hy - 18]], { w: 3, tone, seed: 101 });
  Z.wire(c, [[2, hy - 18], [8, hy - 12], [20, hy - 18]], { w: 3, tone, seed: 102 });
  Z.wire(c, [[-16, hy - 6], [-5, hy - 4]], { w: 2.4, tone, seed: 103 });
  Z.wire(c, [[5, hy - 4], [16, hy - 6]], { w: 2.4, tone, seed: 104 });
  Z.wire(c, [[-8, hy + 6], [8, hy + 5]], { w: 2.4, tone: tone * 0.8, seed: 105 });
  // 赤发（焦墨乱发，随 t 抖）
  for (let i = 0; i < 8; i++) {
    const a = -2.6 + i * 0.34, wob = Math.sin(t * 2.4 + i) * 6;
    Z.wire(c, [[Math.cos(a) * 24, hy - 20 + Math.sin(a) * 12], [Math.cos(a) * 44 + wob, hy - 34 + Math.sin(a) * 26]],
      { w: 2.2, tone: 0.9, seed: 106 + i, taper: 0.5 });
  }
  // 黄须（虬张）
  for (let i = 0; i < 6; i++) {
    const bx = -15 + i * 6, wob = Math.sin(t * 2.0 + i * 0.7) * 5;
    Z.wire(c, [[bx, hy + 14], [bx + wob, hy + 44], [bx + wob * 1.5, hy + 62]], { w: 2.2, tone: tone * 0.88, seed: 114 + i, taper: 0.4 });
  }
  // 铁盔（无缨：第三幕被花荣射落盔缨）
  Z.wire(c, [[-30, hy - 22], [-26, hy - 52], [26, hy - 52], [30, hy - 22]], { w: 3, tone: 0.94, seed: 130 });
  Z.wire(c, [[-26, hy - 52], [-16, hy - 78], [16, hy - 78], [26, hy - 52]], { w: 3.2, tone: 0.94, seed: 131 });
  Z.wire(c, [[-16, hy - 78], [0, hy - 92], [16, hy - 78]], { w: 2.8, tone: 0.92, seed: 132 });
  if (flame) Z.huoyan(c, 0, hy - 94, 0.9, t, { seed: 140, cin: 1, n: 4 });
  // 顿项（护颈）
  Z.wire(c, [[-30, hy - 22], [-36, hy + 6], [-24, hy + 12]], { w: 2.6, tone: 0.86, seed: 136 });
  Z.wire(c, [[30, hy - 22], [36, hy + 6], [24, hy + 12]], { w: 2.6, tone: 0.86, seed: 137 });

  // ---- 狼牙棒（必须在 restore 之前）----
  if (club) Z.langya(c, 92, handY + 10, 1.18, { tone, seed: 170 });
  c.restore();
};

// ============================== 九幕 ==============================

// ① 青州统制：性如烈火，声若雷霆
SCENES['qm1_qingzhou'] = (() => {
  const p = () => Z.paper('qm1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1500, y: 170, s: 1.1, seed: 4, tone: 0.32 });
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.guan(c, 1500, 760, 0.94, { tone: 0.88, seed: 12, text: '青州' });
      Z.flag(c, 620, 590, 168, t, { text: '秦', seed: 13, size: 30 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1420 + i * 110, 892, 0.76, t, { flip: 1, spear: 1, tone: 0.64, seed: 14 + i });
      Z.qinming(c, 900, 892, 1.56, t, { club: 1, raise: clamp(Math.sin(t * 1.4) * 0.25 + 0.3) });
      // 雷霆动势线（霹雳火：空气中细密的短线）
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 58 + i * 205) % 1980) - 30, by = 320 + ((t * 42 + i * 150) % 470);
        Z.wire(c, [[bx, by], [bx + 13, by + 7]], { w: 1.5, tone: 0.36, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '青州统制', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 清风山起事：宋江花荣被捉，秦明奉命来剿
SCENES['qm2_qingfeng'] = (() => {
  const p = () => Z.paper('qm2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 210, tone: 0.34, seed: 21 }, { y0: 650, amp: 120, tone: 0.22, seed: 22 }]);
      Z.ground(c, 900, { seed: 23, tone: 0.44 });
      Z.shanzhai(c, 1560, 700, 0.92, { tone: 0.78, seed: 24, text: '清风山' });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1380 + i * 110, 892, 0.72, t, { flip: 1, blade: 1, tone: 0.62, seed: 25 + i });
      Z.flag(c, 420, 560, 190, t, { text: '秦', seed: 28, size: 30 });
      Z.qinming(c, 760, 892, 1.54, t, { club: 1, ride: 1, raise: clamp(ss(0.3, 1.4, lt)) });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 112 + i * 165) % 1420) + 300, dy = 800 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 6]], { w: 2, tone: 0.36, seed: 1960 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '清风山', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 大战花荣：一箭射落盔缨（互文 Z.huarong）
SCENES['qm3_huarong'] = (() => {
  const p = () => Z.paper('qm3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 190, tone: 0.3, seed: 31 }]);
      Z.ground(c, 900, { seed: 32, tone: 0.44 });
      Z.flag(c, 1560, 520, 190, t, { text: '清风', seed: 33, size: 30 });
      // 花荣（右，开弓）
      Z.huarong(c, 1340, 892, 1.46, t, { flip: 1, bow: 1, draw: 1, crown: 1 });
      // 秦明（左，挥棒）
      Z.qinming(c, 780, 892, 1.56, t, { club: 1, ride: 1, raise: clamp(ss(0.2, 1.4, lt)) });
      // 一箭（飞向盔缨）
      const shot = clamp(ss(0.9, 1.8, lt));
      if (shot > 0.05) {
        const ax = lerp(1180, 800, shot), ay = lerp(700, 500, shot);
        Z.wire(c, [[ax, ay], [ax + 70, ay + 26]], { w: 2.8, tone: 0.92, seed: 41, taper: 0.08 });
        Z.wire(c, [[ax + 70, ay + 26], [ax + 88, ay + 34]], { w: 2, tone: 0.8, seed: 42 });
      }
      // 盔缨落地（第三幕的戏核）
      if (shot > 0.9) {
        c.save(); c.globalAlpha = clamp(ss(1.8, 2.4, lt));
        c.fillStyle = 'rgba(183,51,46,.72)';
        c.beginPath(); c.ellipse(830, 830, 16, 9, 0.4, 0, 7); c.fill();
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 118 + i * 170) % 1400) + 320, dy = 800 + ((t * 38 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 5]], { w: 1.9, tone: 0.36, seed: 1970 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '盔缨落地', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 中计入寨：宋江以礼相待（互文 Z.songjiang）
SCENES['qm4_ruzhai'] = (() => {
  const p = () => Z.paper('qm4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 51, tone: 0.4 });
      Z.wire(c, [[1120, 900], [1120, 520], [1780, 520], [1780, 900]], { w: 3.6, tone: 0.88, seed: 52 });
      Z.roof(c, 1450, 520, 720, 150, { tone: 0.9, seed: 53 });
      Z.hatchBox(c, [[1120, 900], [1780, 900], [1780, 520], [1120, 520]], { ang: -1.35, gap: 22, tone: 0.1, seed: 54 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.66)'; c.font = '32px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('聚義廳', 1450, 740); c.restore();
      Z.songjiang(c, 1240, 892, 1.46, t, { official: 1, raise: clamp(Math.sin(t * 1.2) * 0.16 + 0.24) });
      Z.qinming(c, 720, 892, 1.5, t, { club: 0, kneel: 0, raise: clamp(ss(0.4, 1.5, lt)) * 0.4 });
      Z.langya(c, 980, 880, 0.92, { tone: 0.8, seed: 175 });     // 棒置于地
      // 酒宴（案 + 爵）
      Z.wire(c, [[840, 892], [840, 840], [1080, 840], [1080, 892]], { w: 2.8, tone: 0.8, seed: 55 });
      Z.wire(c, [[860, 840], [860, 812], [890, 812], [890, 840]], { w: 2.2, tone: 0.78, seed: 56 });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 320 + ((t * 34 + i * 150) % 430);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1916 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '中计入寨', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 设计：宋江使人假扮秦明，夜打青州
SCENES['qm5_jiazhuang'] = (() => {
  const p = () => Z.paper('qm5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 61, tone: 0.42 });
      Z.guan(c, 1500, 780, 0.9, { tone: 0.86, seed: 62, text: '青州' });
      // 火把（夜袭）
      for (let i = 0; i < 3; i++) Z.flame(c, 1120 + i * 180, 780, 0.6 + (i % 2) * 0.2, t, { seed: 63 + i, tone: 0.68 });
      // 假秦明（低 tone 的影子，与真秦明同形）
      Z.qinming(c, 1280, 892, 1.5, t, { club: 1, ride: 1, tone: 0.62, raise: clamp(Math.sin(t * 3) * 0.3 + 0.5) });
      // 真秦明（左侧，被缚于寨中，只画半身剪影感：低 tone）
      Z.qinming(c, 640, 892, 1.46, t, { club: 0, tone: 0.5, raise: 0.1 });
      // 宋江（幕后，远景）
      Z.songjiang(c, 480, 892, 1.0, t, { official: 1, tone: 0.5, raise: 0.2 });
      if (lt > 1.4) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(1.4, 2.4, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('宋江使人假扮秦明，夜打青州', 940, 330);
        c.restore();
      }
      for (let i = 0; i < 12; i++) {
        const sx = 1240 - ((t * 60 + i * 120) % 620), sy = 830 + Math.sin(t * 2 + i) * 8;
        Z.wire(c, [[sx, sy], [sx + 26, sy - 5]], { w: 1.9, tone: 0.4, seed: 1980 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '假扮夜袭', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 全家遇害：慕容知府杀其全家、首级示众（留白 + 朱砂，不直绘）
SCENES['qm6_miemen'] = (() => {
  const p = () => Z.paper('qm6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 71, tone: 0.4 });
      Z.guan(c, 1520, 780, 0.92, { tone: 0.9, seed: 72, text: '青州' });
      // 城头示众：一排悬笼（以简笔圆 + 排线示意，不着一笔血腥）
      Z.wire(c, [[1180, 660], [1780, 660]], { w: 3, tone: 0.84, seed: 73 });
      for (let i = 0; i < 4; i++) {
        const hx = 1300 + i * 130, hy = 660 + Math.sin(t * 1.1 + i) * 4;
        Z.wire(c, [[hx, 640], [hx, hy]], { w: 1.8, tone: 0.7, seed: 74 + i });
        Z.wire(c, [[hx - 20, hy], [hx, hy + 34], [hx + 20, hy], [hx, hy - 2], [hx - 20, hy]], { w: 2.4, tone: 0.78, seed: 78 + i });
        Z.hatchBox(c, [[hx - 18, hy + 2], [hx + 18, hy + 2], [hx + 16, hy + 30], [hx - 16, hy + 30]], { ang: -0.9, gap: 7, tone: 0.14, seed: 82 + i });
      }
      // 秦明（城下跪，仰面）—— 幕心留白：不绘其家，只绘其一人
      Z.qinming(c, 700, 892, 1.52, t, { club: 0, kneel: 1, hurt: 1, raise: 0.1, flame: 0 });
      Z.langya(c, 980, 878, 0.9, { tone: 0.7, seed: 176 });
      // 朱砂血光（克制：几点，不画血）
      const bleed = clamp(ss(0.8, 2.2, lt));
      c.save();
      for (let i = 0; i < 7; i++) {
        const px = 1010 + (i % 3) * 60 + Math.sin(t * 1.5 + i) * 5;
        const py = 800 + Math.floor(i / 3) * 42;
        c.fillStyle = `rgba(183,51,46,${(0.22 + (i % 3) * 0.1) * bleed})`;
        c.beginPath(); c.ellipse(px, py, 6 + (i % 2) * 3, 4 + (i % 3), i, 0, 7); c.fill();
      }
      c.restore();
      // 风（连续·保活气）
      for (let i = 0; i < 14; i++) {
        const sx = ((t * 120 + i * 150) % 1500) + 300, sy = 520 + ((t * 30 + i * 80) % 300);
        Z.wire(c, [[sx, sy], [sx + 40, sy + 8]], { w: 1.8, tone: 0.34, seed: 1910 + i, taper: 0.9 });
      }
      if (lt > 1.8) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(1.8, 2.8, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('慕容知府杀其全家，首级示众', 1000, 320);
        c.restore();
      }
    });
    Z.bigText(c, '满门之祸', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 无奈落草：宋江以花荣之妹相赔（互文 Z.songjiang / Z.huarong）
SCENES['qm7_luocao'] = (() => {
  const p = () => Z.paper('qm7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 91, tone: 0.42 });
      Z.shanzhai(c, 1560, 720, 0.86, { tone: 0.78, seed: 92, text: '清风山' });
      Z.flag(c, 340, 560, 190, t, { text: '秦', seed: 93, size: 30 });
      Z.songjiang(c, 1120, 892, 1.42, t, { official: 1, raise: clamp(Math.sin(t * 1.2) * 0.16 + 0.2) });
      Z.huarong(c, 1420, 892, 1.34, t, { flip: 1, bow: 0, crown: 1, raise: 0.3 });
      Z.qinming(c, 700, 892, 1.5, t, { club: 1, kneel: clamp(ss(0.8, 1.8, lt)) * 0.6, raise: 0.2 });
      if (lt > 1.6) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.6, 2.6, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('以花荣之妹相赔，秦明只得落草', 940, 320);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 50 + i * 210) % 1960) - 30, by = 320 + ((t * 32 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1918 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '无奈落草', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 五虎南征：马军五虎第三，破辽征腊
SCENES['qm8_zheng'] = (() => {
  const p = () => Z.paper('qm8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 200, tone: 0.32, seed: 101 }, { y0: 660, amp: 110, tone: 0.22, seed: 102 }]);
      Z.ground(c, 900, { seed: 103, tone: 0.44 });
      Z.flag(c, 1600, 500, 200, t, { text: '宋', seed: 104, size: 32 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1400 + i * 130, 892, 0.96, t, { flip: 1, blade: 1, tone: 0.72, seed: 110 + i });
      const charge = clamp(ss(0.2, 1.6, lt));
      Z.qinming(c, lerp(620, 780, charge), 892, 1.58, t, { club: 1, ride: 1, raise: charge });
      for (let i = 0; i < 6; i++) {
        const a = -1.2 + i * 0.32 + Math.sin(t * 4.6) * 0.1;
        Z.wire(c, [[850, 690], [850 + Math.cos(a) * 78, 690 + Math.sin(a) * 78]], { w: 2.4, tone: 0.5, seed: 1950 + i, taper: 0.8 });
      }
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 110 + i * 165) % 1500) + 280, dy = 800 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1990 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '五虎南征', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑨ 清溪战死：征方腊，清溪县一役力战而亡（朱砂钤印）
SCENES['qm9_qingxi'] = (() => {
  const p = () => Z.paper('qm9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.6)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 220, tone: 0.34, seed: 131 }, { y0: 660, amp: 120, tone: 0.22, seed: 132 }]);
      Z.cloud(c, t, { x: 420, y: 180, s: 1.1, seed: 133, tone: 0.3 });
      Z.ground(c, 900, { seed: 134, tone: 0.42 });
      Z.guan(c, 1560, 760, 0.88, { tone: 0.8, seed: 135, text: '清溪县' });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1400 + i * 130, 892, 0.92, t, { flip: 1, spear: 1, tone: 0.7, seed: 136 + i });
      const fall = clamp(ss(1.2, 2.8, lt));
      c.save(); c.translate(820, 892); c.rotate(fall * 0.56); c.translate(-820, -892);
      Z.qinming(c, 820, 892 + fall * 26, 1.54, t, { club: 1, raise: 0.3 - fall * 0.2, hurt: fall });
      c.restore();
      if (fall > 0.25) {
        for (let i = 0; i < 8; i++) {
          const dx = 760 + ((t * 128 + i * 150) % 540), dy = 740 + (i % 3) * 52;
          Z.wire(c, [[dx, dy], [dx + 26, dy - 12]], { w: 2, tone: 0.42, seed: 1967 + i, taper: 0.8 });
        }
      }
      if (lt > 2.0) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(2.0, 3.0, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('清溪县一役，力战而亡', 1400, 330);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 44 + i * 210) % 1960) - 30, by = 320 + ((t * 30 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1919 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '清溪殉身', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '霹雳火', clamp(ss(0.9, 2.6, lt)), { size: 28 });
  } };
})();
})();
