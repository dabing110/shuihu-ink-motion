// 《水浒传·李俊》rig + 九幕（宋元版画线描 + 焦墨）
// 造型：庐州人氏，揭阳岭一带私商领袖，扬子江上撑船为生，水性极好，绰号「混江龙」，
//   梁山排名第二十六（天寿星），水军大都督。征方腊后诈病脱队，造舟出海，后为暹罗国主。
//   特征：① 混江龙纹（signature，朱砂点睛）② 舟船 ③ 短襟水靠 ④ 分水峨眉刺。
// 唯一的彩：朱砂只用于① 龙纹点睛 ② 第六幕火烧官船的火星（不直绘血）③ 末幕「混江龙」钤印。
// 母题：① 舟 ② 江浪 ③ 龙纹 ④ 帆。
// 弧光：揭阳岭私渡 → 三救宋江 → 揭阳镇结义 → 白龙庙小聚义 → 水军破官军 → 生擒高俅 →
//       反对招安 → 诈中风脱队 → 出海为王。
// 依《水浒传》第三十六至四十回、第七十七回、第一百十九回；《水浒后传》（陈忱）出海为王一节。
// 互文：第2/4幕复用宋江（被救者），第7幕复用阮小七（同为水军、同反招安，结局分岔）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 混江龙纹（signature：盘曲龙身 + 朱砂点睛；不用复杂兽形，靠文字化的弧线骨架）
Z.hunjianglong = (c, x, y, s, t, { tone = 0.9, seed = 1, cin = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const spine = [];
  for (let i = 0; i <= 22; i++) {
    const u = i / 22;
    spine.push([lerp(-96, 96, u), Math.sin(u * 6.2 + t * 0.9) * 20 * Math.sin(u * Math.PI)]);
  }
  Z.wire(c, spine, { w: 4.2, tone, seed, taper: 0.06 });
  for (let i = 0; i < 7; i++) {
    const u = 0.12 + i * 0.13;
    const px = lerp(-96, 96, u), py = Math.sin(u * 6.2 + t * 0.9) * 20 * Math.sin(u * Math.PI);
    const bob = Math.sin(t * 2.2 + i) * 5;
    Z.wire(c, [[px, py], [px + 6, py - 20 + bob]], { w: 2.2, tone: tone * 0.85, seed: seed + 30 + i, taper: 0.5 });
  }
  // 龙爪（两处）
  Z.wire(c, [[-40, 4], [-54, 22], [-40, 34]], { w: 2.4, tone: tone * 0.9, seed: seed + 50 });
  Z.wire(c, [[44, 2], [58, 20], [44, 32]], { w: 2.4, tone: tone * 0.9, seed: seed + 51 });
  // 龙头（简笔：只留轮廓与须）
  Z.lined(c, [[-96, 0], [-118, -12], [-112, -34], [-88, -30], [-84, -12]], { w: 2.8, tone, seed: seed + 60, hatch: 0.14, gap: 6 });
  Z.wire(c, [[-118, -12], [-142, -18 - Math.sin(t * 2.6) * 6]], { w: 2, tone: tone * 0.8, seed: seed + 61, taper: 0.6 });
  Z.wire(c, [[-118, -6], [-144, -2 + Math.sin(t * 2.2 + 1) * 6]], { w: 2, tone: tone * 0.8, seed: seed + 62, taper: 0.6 });
  if (cin) {
    c.fillStyle = 'rgba(183,51,46,.72)';
    c.beginPath(); c.arc(-104, -22, 4.2, 0, 7); c.fill();
  }
  c.restore();
};

// 分水峨眉刺（short twin spikes）—— 必须画在人物 restore 之前
Z.emeci = (c, x, y, s, { tone = 0.92, seed = 1, open = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < 2; i++) {
    const sg = i ? 1 : -1;
    c.save(); c.rotate(sg * (0.2 + open * 0.18));
    Z.wire(c, [[0, 96], [0, 10]], { w: 3.4, tone, seed: seed + i * 7, taper: 0.06 });
    Z.lined(c, [[0, 10], [-9, -20], [0, -96], [9, -20]], { w: 2.6, tone, seed: seed + 1 + i * 7, hatch: 0.18, gap: 6 });
    Z.wire(c, [[-11, 4], [11, 4]], { w: 3, tone: tone * 0.85, seed: seed + 2 + i * 7 });
    c.restore();
  }
  c.restore();
};

// 篷船（李俊的饭碗：龙骨 + 篷 + 篙）
Z.pengchuan = (c, x, y, s, t, { tone = 0.86, seed = 1, sail = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const bob = Math.sin(t * 1.5 + seed) * 6;
  c.translate(0, bob);
  Z.lined(c, [[-190, 0], [-150, -34], [150, -34], [190, 0]], { w: 3.4, tone, seed, hatch: 0.2, gap: 10 });
  Z.wire(c, [[-190, 0], [190, 0]], { w: 3.4, tone, seed: seed + 1 });
  Z.wire(c, [[-96, -34], [-90, -110], [70, -110], [76, -34]], { w: 2.6, tone: tone * 0.9, seed: seed + 2 });
  for (let i = 0; i < 5; i++) Z.wire(c, [[-80 + i * 38, -34], [-74 + i * 38, -110]], { w: 1.8, tone: tone * 0.6, seed: seed + 10 + i });
  if (sail) {
    const sw = Math.sin(t * 1.9 + 1) * 8;
    Z.lined(c, [[-60, -110], [-60, -236], [-8 + sw, -196], [-52, -120]],
      { w: 2.4, tone: tone * 0.85, seed: seed + 20, hatch: 0.16, gap: 9, hatchAng: 0.3 });
    Z.wire(c, [[-60, -110], [-60, -244]], { w: 2.6, tone: 0.9, seed: seed + 21 });
  }
  Z.wire(c, [[150, -34], [176, -150]], { w: 2.8, tone: tone * 0.8, seed: seed + 30, taper: 0.1 });
  c.restore();
};

// ============================== 李俊本体 ==============================
// o: { spikes, boatHook篙, dragon龙纹, flip, raise, stand蹲/swim, oar, sick诈病, down, tone }
Z.lijun = (c, x, y, s, t, o = {}) => {
  const {
    spikes = 1, hook = 0, dragon = 1, flip = 0, raise = 0, oar = 0,
    sick = 0, down = 0, kneel = 0, tone = 0.92,
  } = o;
  const br = Math.sin(t * 1.4) * 2.4;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  if (down) c.rotate(down * 0.7);
  const ly = -(kneel ? 44 : 0);
  const shoulderY = ly - 152;
  const waistY = ly - 76;
  const hipY = ly - 24;

  // ---- 下身（水靠短裤 + 绑腿）----
  Z.wire(c, [[-34, hipY], [-46, hipY + 44], [-42, ly]], { w: 4, tone, seed: 20, taper: 0.1 });
  Z.wire(c, [[34, hipY], [46, hipY + 44], [42, ly]], { w: 4, tone, seed: 21, taper: 0.1 });
  Z.wire(c, [[-46, hipY + 30], [-30, hipY + 40]], { w: 1.8, tone: tone * 0.7, seed: 22 });
  Z.wire(c, [[46, hipY + 30], [30, hipY + 40]], { w: 1.8, tone: tone * 0.7, seed: 23 });

  // ---- 躯干（短襟）----
  const body = [[-52, shoulderY + 6], [-58, waistY + 2], [-46, hipY], [46, hipY], [58, waistY + 2], [52, shoulderY + 6]];
  Z.lined(c, body, { w: 3.4, tone, seed: 30, hatch: 0.2, gap: 8 });
  c.save(); c.fillStyle = 'rgba(116,118,124,.16)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  Z.wire(c, [[-56, waistY], [56, waistY], [56, waistY + 20], [-56, waistY + 20], [-56, waistY]], { w: 3.2, tone, seed: 31, taper: 0.06 });
  for (let i = 0; i < 3; i++) Z.wire(c, [[-48, shoulderY + 30 + i * 22], [48, shoulderY + 30 + i * 22]], { w: 1.8, tone: tone * 0.55, seed: 32 + i });
  // 混江龙纹（signature，朱砂点睛）：斜披在胸前
  c.save();
  c.translate(0, shoulderY + 46); c.rotate(-0.12);
  if (dragon) Z.hunjianglong(c, 0, 0, 0.52, t, { tone: tone * 0.95, seed: 40 });
  c.restore();

  // ---- 双臂 ----
  const handY = shoulderY + 52 - raise * 44;
  Z.wire(c, [[-52, shoulderY + 12], [-86, shoulderY + 40], [-80, handY + 6]], { w: 3.8, tone, seed: 50, taper: 0.1 });
  Z.wire(c, [[52, shoulderY + 12], [86, shoulderY + 34 - raise * 26], [80, handY - raise * 32]], { w: 3.8, tone, seed: 51, taper: 0.1 });
  if (oar) {
    // 撑篙（右臂延长）
    Z.wire(c, [[80, handY - raise * 32], [150, handY + 150 - raise * 40]], { w: 3.6, tone: 0.92, seed: 52, taper: 0.06 });
  } else {
    Z.lined(c, [[-80, handY + 4], [-66, handY + 20], [-54, handY + 6], [-64, handY - 8]], { w: 2.2, tone: tone * 0.85, seed: 53 });
    Z.lined(c, [[80, handY - 6], [66, handY + 10], [54, handY - 4], [64, handY - 18]], { w: 2.2, tone: tone * 0.85, seed: 54 });
  }

  // ---- 头（方巾 + 短须；诈病时低垂）----
  const hy = shoulderY - 40 + br * 0.5 + sick * 16;
  const face = [[-22, hy - 12], [-20, hy - 36], [0, hy - 48], [20, hy - 36], [22, hy - 12], [20, hy + 12], [0, hy + 24], [-20, hy + 10]];
  Z.lined(c, face, { w: 2.6, tone: tone * 0.95, seed: 100, hatch: 0.06, gap: 9 });
  Z.wire(c, [[-15, hy - 16], [-7, hy - 22], [-2, hy - 19]], { w: 2.2, tone, seed: 101 });
  Z.wire(c, [[2, hy - 19], [7, hy - 22], [15, hy - 16]], { w: 2.2, tone, seed: 102 });
  Z.wire(c, [[-12, hy - 6], [-4, hy - 5]], { w: 2, tone, seed: 103 });
  Z.wire(c, [[4, hy - 5], [12, hy - 6]], { w: 2, tone, seed: 104 });
  Z.wire(c, [[-6, hy + 6], [6, hy + 5]], { w: 2, tone: tone * 0.8, seed: 105 });
  for (let i = 0; i < 4; i++) {
    const bx = -9 + i * 6;
    Z.wire(c, [[bx, hy + 16], [bx + Math.sin(t * 1.9 + i) * 3, hy + 36]], { w: 1.8, tone: tone * 0.8, seed: 106 + i, taper: 0.5 });
  }
  Z.wire(c, [[-26, hy - 18], [-22, hy - 44], [22, hy - 44], [26, hy - 18]], { w: 2.8, tone: 0.92, seed: 130 });
  Z.wire(c, [[-22, hy - 44], [-12, hy - 60], [12, hy - 60], [22, hy - 44]], { w: 3, tone: 0.92, seed: 131 });
  Z.wire(c, [[-26, hy - 18], [26, hy - 18]], { w: 2, tone: 0.72, seed: 132 });

  // ---- 手持兵器（必须在 restore 之前）----
  if (spikes) Z.emeci(c, 86, handY + 8, 1.0, { tone, seed: 170, open: 0.4 + raise * 0.6 });
  if (hook) Z.wire(c, [[-84, handY], [-96, handY + 130]], { w: 3, tone: 0.9, seed: 176, taper: 0.1 });
  c.restore();
};

// ============================== 九幕 ==============================

// ① 揭阳岭私渡：扬子江上撑船，私盐与黑店
SCENES['lj1_jieyang'] = (() => {
  const p = () => Z.paper('lj1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 470, amp: 200, tone: 0.3, seed: 5 }]);
      Z.cloud(c, t, { x: 1420, y: 168, s: 1.1, seed: 6, tone: 0.3 });
      Z.wave(c, -60, 1980, 880, 6, t, { tone: 0.34, seed: 7, amp: 12 });
      Z.wave(c, -60, 1980, 940, 5, t, { tone: 0.26, seed: 8, amp: 16 });
      Z.pengchuan(c, 1320, 900, 0.92, t, { tone: 0.86, seed: 9, sail: 1 });
      Z.lijun(c, 1180, 872, 1.5, t, { spikes: 1, oar: 1, raise: clamp(Math.sin(t * 1.6) * 0.2 + 0.35) });
      Z.manor(c, 380, 700, 0.6, { tone: 0.72, seed: 10, text: '揭阳岭' });
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 48 + i * 205) % 1980) - 30, by = 300 + ((t * 40 + i * 150) % 460);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.34, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '揭阳岭', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 三救宋江：浔阳江上三次救下宋江性命（互文 Z.songjiang）
SCENES['lj2_sanjiu'] = (() => {
  const p = () => Z.paper('lj2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 500, y: 170, s: 1.15, seed: 11, tone: 0.32 });
      Z.wave(c, -60, 1980, 900, 6, t, { tone: 0.36, seed: 12, amp: 14 });
      Z.wave(c, -60, 1980, 960, 5, t, { tone: 0.28, seed: 13, amp: 18 });
      Z.pengchuan(c, 880, 920, 1.0, t, { tone: 0.88, seed: 14, sail: 1 });
      Z.lijun(c, 700, 890, 1.52, t, { spikes: 0, oar: 1, raise: 0.5 });
      Z.songjiang(c, 1080, 884, 1.3, t, { official: 1, raise: clamp(ss(0.4, 1.6, lt)) * 0.5, tone: 0.8 });
      for (let i = 0; i < 14; i++) {
        const sx = ((t * 130 + i * 140) % 1900) - 40, sy = 940 + Math.sin(t * 2 + i) * 10;
        Z.wire(c, [[sx, sy], [sx + 34, sy - 4]], { w: 1.9, tone: 0.34, seed: 1910 + i, taper: 0.9 });
      }
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('三救宋江于浔阳江上', 1340, 300);
        c.restore();
      }
    });
    Z.bigText(c, '三救宋江', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 揭阳镇：结穆弘、识二张（张横张顺）
SCENES['lj3_jieyangzhen'] = (() => {
  const p = () => Z.paper('lj3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 180, tone: 0.3, seed: 21 }]);
      Z.ground(c, 960, { seed: 22, tone: 0.44 });
      Z.manor(c, 1520, 780, 0.78, { tone: 0.84, seed: 23, text: '揭阳镇' });
      Z.flag(c, 380, 600, 180, t, { text: '揭阳', seed: 24, size: 30 });
      Z.lijun(c, 1000, 900, 1.56, t, { spikes: 1, raise: clamp(ss(0.3, 1.4, lt)) * 0.5 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1300 + i * 120, 900, 0.86, t, { flip: 1, spear: 1, tone: 0.68, seed: 25 + i });
      for (let i = 0; i < 2; i++) Z.fighter(c, 520 + i * 120, 900, 0.8, t, { blade: 1, tone: 0.66, seed: 28 + i });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 108 + i * 168) % 1400) + 300, dy = 830 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 6]], { w: 2, tone: 0.36, seed: 1960 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '揭阳镇', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ④ 白龙庙小聚义：二十九好汉江边聚义（互文 Z.songjiang）
SCENES['lj4_bailongmiao'] = (() => {
  const p = () => Z.paper('lj4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1560, y: 160, s: 1.2, seed: 31, tone: 0.3 });
      Z.ground(c, 940, { seed: 32, tone: 0.42 });
      Z.temple(c, 1500, 800, 0.86, { tone: 0.84, seed: 33, text: '白龙庙' });
      Z.wave(c, -60, 700, 1000, 3, t, { tone: 0.3, seed: 34, amp: 10 });
      Z.songjiang(c, 1160, 900, 1.42, t, { official: 1, raise: clamp(Math.sin(t * 1.2) * 0.16 + 0.24) });
      Z.lijun(c, 880, 900, 1.5, t, { spikes: 1, raise: clamp(ss(0.4, 1.5, lt)) * 0.4 });
      for (let i = 0; i < 4; i++) Z.fighter(c, 620 + i * 96, 900, 0.74, t, { tone: 0.6, seed: 35 + i, blade: i % 2 });
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 50 + i * 215) % 1960) - 30, by = 300 + ((t * 32 + i * 150) % 430);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1916 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '白龙庙聚义', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 水军破官军：梁山泊水战，火烧官船（朱砂火星）
SCENES['lj5_shuizhan'] = (() => {
  const p = () => Z.paper('lj5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 440, amp: 210, tone: 0.32, seed: 41 }]);
      Z.wave(c, -60, 1980, 900, 7, t, { tone: 0.36, seed: 42, amp: 15 });
      Z.wave(c, -60, 1980, 980, 6, t, { tone: 0.26, seed: 43, amp: 19 });
      Z.pengchuan(c, 1400, 930, 0.9, t, { tone: 0.84, seed: 44, sail: 1 });
      Z.fighter(c, 1560, 906, 0.86, t, { flip: 1, spear: 1, tone: 0.66, seed: 45 });
      Z.lijun(c, 760, 900, 1.56, t, { spikes: 1, raise: clamp(ss(0.2, 1.5, lt)) });
      Z.pengchuan(c, 420, 960, 0.7, t, { tone: 0.7, seed: 46, sail: 0 });
      // 火攻（朱砂火星，不画血）
      for (let i = 0; i < 3; i++) Z.flame(c, 1380 + i * 90, 900, 0.5 + (i % 2) * 0.2, t, { seed: 47 + i, tone: 0.66 });
      for (let i = 0; i < 14; i++) {
        const sx = ((t * 126 + i * 142) % 1900) - 40, sy = 950 + Math.sin(t * 2.1 + i) * 10;
        Z.wire(c, [[sx, sy], [sx + 32, sy - 4]], { w: 2, tone: 0.38, seed: 1970 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '水战破官军', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 生擒高俅：三败高太尉，水军擒之
SCENES['lj6_qin_gaoqiu'] = (() => {
  const p = () => Z.paper('lj6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 380, y: 170, s: 1.1, seed: 51, tone: 0.3 });
      Z.wave(c, -60, 1980, 910, 6, t, { tone: 0.34, seed: 52, amp: 14 });
      Z.pengchuan(c, 900, 930, 1.02, t, { tone: 0.88, seed: 53, sail: 1 });
      Z.lijun(c, 700, 900, 1.54, t, { spikes: 1, raise: clamp(ss(0.3, 1.5, lt)) });
      // 高俅（中箭落水被擒：以被押的官帽官员示意，不着一笔羞辱）
      const pulled = clamp(ss(0.8, 2.2, lt));
      Z.songjiang(c, lerp(1660, 1240, pulled), 900, 1.24, t, { official: 1, hurt: pulled, raise: 0.2, tone: 0.82 });
      for (let i = 0; i < 12; i++) {
        const sx = ((t * 118 + i * 150) % 1880) - 30, sy = 950 + Math.sin(t * 2 + i) * 10;
        Z.wire(c, [[sx, sy], [sx + 30, sy - 5]], { w: 1.9, tone: 0.36, seed: 1980 + i, taper: 0.9 });
      }
      if (lt > 1.4) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.4, 2.4, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('三败高太尉，水军擒之', 940, 300);
        c.restore();
      }
    });
    Z.bigText(c, '生擒高俅', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 反对招安：与阮氏兄弟同持异议（互文 Z.ruanqi）
SCENES['lj7_fanzhaoan'] = (() => {
  const p = () => Z.paper('lj7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 950, { seed: 61, tone: 0.42 });
      Z.wire(c, [[1100, 910], [1100, 500], [1820, 500], [1820, 910]], { w: 3.6, tone: 0.88, seed: 62 });
      Z.roof(c, 1460, 500, 760, 156, { tone: 0.9, seed: 63 });
      Z.hatchBox(c, [[1100, 910], [1820, 910], [1820, 500], [1100, 500]], { ang: -1.35, gap: 22, tone: 0.1, seed: 64 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.66)'; c.font = '32px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('忠义堂', 1460, 736); c.restore();
      Z.songjiang(c, 1220, 900, 1.4, t, { official: 1, raise: 0.34, tone: 0.86 });
      Z.lijun(c, 760, 900, 1.5, t, { spikes: 1, raise: clamp(ss(0.4, 1.5, lt)) * 0.6 });
      Z.ruanqi(c, 480, 900, 1.4, t, { flip: 0, raise: clamp(ss(0.4, 1.5, lt)) * 0.6, tone: 0.84 });
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('水军头领，同持异议', 900, 300);
        c.restore();
      }
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 300 + ((t * 34 + i * 150) % 430);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1918 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '同反招安', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 诈中风脱队：征方腊班师途中，诈病留下
SCENES['lj8_zhafeng'] = (() => {
  const p = () => Z.paper('lj8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 190, tone: 0.3, seed: 71 }, { y0: 660, amp: 110, tone: 0.22, seed: 72 }]);
      Z.ground(c, 950, { seed: 73, tone: 0.44 });
      Z.tent(c, 1560, 880, 0.9, { tone: 0.78, seed: 74, text: '中军' });
      // 大军前行（远去的小兵）
      for (let i = 0; i < 4; i++) Z.fighter(c, 1500 + i * 90, 900, 0.6 - i * 0.04, t, { flip: 1, spear: 1, tone: 0.42, seed: 75 + i });
      const sick = clamp(ss(0.6, 1.8, lt));
      Z.lijun(c, 760, 900, 1.5, t, { spikes: 0, sick, kneel: sick * 0.8, raise: 0.05, dragon: 1 });
      // 随行小校
      Z.fighter(c, 560, 900, 0.82, t, { tone: 0.6, spear: 1, seed: 79 });
      if (lt > 1.4) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.4, 2.4, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('诈称中风，脱队留下', 1000, 320);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 48 + i * 210) % 1960) - 30, by = 320 + ((t * 30 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1919 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '诈病脱身', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑨ 出海为王：造舟出海，后为暹罗国主（朱砂钤印）
SCENES['lj9_chuhai'] = (() => {
  const p = () => Z.paper('lj9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 170, s: 1.25, seed: 81, tone: 0.32 });
      Z.cloud(c, t, { x: 1500, y: 210, s: 1.0, seed: 82, tone: 0.26 });
      Z.wave(c, -60, 1980, 880, 6, t, { tone: 0.3, seed: 83, amp: 14 });
      Z.wave(c, -60, 1980, 950, 6, t, { tone: 0.34, seed: 84, amp: 18 });
      Z.wave(c, -60, 1980, 1020, 5, t, { tone: 0.24, seed: 85, amp: 22 });
      const sail = clamp(ss(0.2, 1.6, lt));
      Z.pengchuan(c, lerp(520, 1180, sail), lerp(920, 960, sail), lerp(1.0, 1.3, sail), t, { tone: 0.9, seed: 86, sail: 1 });
      Z.lijun(c, lerp(360, 1000, sail), lerp(892, 932, sail), lerp(1.5, 1.34, sail), t, { spikes: 0, oar: 1, raise: 0.45 });
      for (let i = 0; i < 16; i++) {
        const sx = ((t * 132 + i * 128) % 1980) - 40, sy = 960 + Math.sin(t * 2.2 + i) * 12;
        Z.wire(c, [[sx, sy], [sx + 38, sy - 5]], { w: 2, tone: 0.34, seed: 1990 + i, taper: 0.9 });
      }
      if (lt > 1.8) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(1.8, 2.8, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('出海而为暹罗国主', 1500, 300);
        c.restore();
      }
    });
    Z.bigText(c, '出海为王', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '混江龙', clamp(ss(0.9, 2.6, lt)), { size: 28 });
  } };
})();
})();
