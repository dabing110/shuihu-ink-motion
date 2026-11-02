// 《水浒传·呼延灼》rig + 九幕（宋元版画线描 + 焦墨）
// 造型：并州太原人氏，开国名将呼延赞嫡派子孙，汝宁郡都统制，使两条铜鞭，绰号「双鞭」，
//   梁山排名第八（天威星），马军五虎将第四。征方腊后授御营兵马指挥使。
//   特征：① 双鞭（signature）② 连环马阵（signature）③ 乌骓马 ④ 重甲。
// 唯一的彩：朱砂只用于① 鞭梢的朱砂缠绳 ② 第八幕抗金战死的血光点 ③ 末幕「双鞭」钤印。
// 母题：① 双鞭 ② 连环马 ③ 链条 ④ 马蹄尘。
// 弧光：名将之后 → 连环马征梁山 → 梁山无计 → 钩镰枪破阵 → 兵败投青州 →
//       三山聚义打青州 → 归顺梁山列五虎 → 南征北讨 → 抗金战死。
// 依《水浒传》第五十四至五十八回、第一百十九回；《说岳全传》抗金战死一节。
// 互文：第六幕对照关胜（同样奉命征剿梁山，一个中计入伙、一个感义来归，落草是同一条路）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 双鞭（signature：分段竹节 + 柄 + 朱砂缠绳）
Z.shuangbian = (c, x, y, s, { tone = 0.94, seed = 1, mir = 1, splay = 0.3 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s * mir, s); c.rotate(-0.14 * mir);
  for (let i = 0; i < 2; i++) {
    const sg = i ? 1 : -1;
    c.save(); c.rotate(sg * splay * 0.5);
    Z.wire(c, [[0, 110], [0, -150]], { w: 5, tone, seed: seed + i * 9, taper: 0.05 });
    for (let k = 0; k < 6; k++) {                       // 竹节
      const yy = -20 - k * 22;
      Z.wire(c, [[-9, yy], [9, yy]], { w: 2.6, tone: tone * 0.86, seed: seed + 20 + k + i * 6 });
    }
    // 鞭梢朱砂缠绳
    c.strokeStyle = 'rgba(183,51,46,.6)'; c.lineWidth = 2.4;
    c.beginPath();
    for (let k = 0; k < 12; k++) {
      const yy = -108 + k * 2.2;
      const xx = sg * 6 + Math.sin(k * 1.1) * 5;
      k ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
    }
    c.stroke();
    Z.lined(c, [[-10, -150], [-14, -168], [0, -186], [14, -168], [10, -150]], { w: 2.6, tone, seed: seed + 40 + i, hatch: 0.2, gap: 5 });
    c.restore();
  }
  c.restore();
};

// 简笔战马（侧视：侧影只留骨架，避免复杂兽形糊成一团）
Z.zhanma = (c, x, y, s, t, { tone = 0.86, seed = 1, gait = 1, flip = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const bo = Math.sin(t * 3.4 * gait + seed) * 3;
  Z.lined(c, [[-86, -6], [-78, -54], [-10, -66], [58, -58], [76, -20], [56, 4], [-58, 6]],
    { w: 3.2, tone, seed, hatch: 0.18, gap: 11, hatchAng: -0.8 });
  // 四腿（走动）
  for (let i = 0; i < 4; i++) {
    const bx = i < 2 ? 44 : -60, ph = i * 1.6;
    const sw = Math.sin(t * 3.2 * gait + ph) * 12;
    Z.wire(c, [[bx + (i % 2) * 26, 2], [bx + (i % 2) * 26 + sw, 46], [bx + (i % 2) * 26 + sw * 1.4, 76]],
      { w: 3, tone: tone * 0.9, seed: seed + 10 + i, taper: 0.1 });
  }
  // 颈与头
  Z.wire(c, [[60, -58], [86, -104], [112, -112]], { w: 3.4, tone, seed: seed + 20, taper: 0.08 });
  Z.lined(c, [[112, -112], [136, -122], [150, -112], [144, -96], [118, -96]],
    { w: 2.6, tone, seed: seed + 21, hatch: 0.14, gap: 6 });
  Z.wire(c, [[136, -122], [130, -140]], { w: 2, tone: tone * 0.9, seed: seed + 22 });
  // 鬃与尾
  for (let i = 0; i < 5; i++) {
    const yy = -60 - i * 10;
    Z.wire(c, [[64 + i * 6, yy], [52 + i * 4 + bo, yy - 14]], { w: 2, tone: tone * 0.8, seed: seed + 30 + i, taper: 0.5 });
  }
  Z.wire(c, [[-86, -6], [-120, -44 + bo], [-104, -8]], { w: 2.6, tone: tone * 0.85, seed: seed + 40, taper: 0.4 });
  c.restore();
};

// 连环马阵（signature：三骑以铁索相连）
Z.lianhuan = (c, x, y, s, t, { tone = 0.8, seed = 1, n = 3 } = {}) => {
  for (let i = 0; i < n; i++) {
    const hx = x + i * 300 * s;
    Z.zhanma(c, hx, y, s, t, { tone: tone - i * 0.04, seed: seed + i * 5, gait: 1 });
    Z.fighter(c, hx + 10 * s, y - 60 * s, s * 0.86, t, { flip: 0, spear: 1, tone: tone * 0.9, seed: seed + 60 + i });
    if (i < n - 1) {
      Z.wire(c, [[hx + 150 * s, y + 6], [hx + 160 * s, y + 26], [hx + 290 * s, y + 22]], { w: 2.4, tone: 0.7, seed: seed + 80 + i });
    }
  }
};

// ============================== 呼延灼本体 ==============================
// o: { bian双鞭, armor重甲, ride骑马, flip, raise, kneel, down, hurt, tone }
Z.huyanzhuo = (c, x, y, s, t, o = {}) => {
  const {
    bian = 1, armor = 1, ride = 0, flip = 0, raise = 0, kneel = 0,
    down = 0, hurt = 0, tone = 0.94,
  } = o;
  const br = Math.sin(t * 1.5) * 2.4;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  if (down) c.rotate(down * 0.65);
  const ly = -(kneel ? 48 : 0) - (ride ? 62 : 0);
  const shoulderY = ly - 164;
  const waistY = ly - 84;
  const hipY = ly - 28;

  if (ride) {
    Z.wire(c, [[-34, hipY], [-58, hipY + 28], [-70, hipY + 52]], { w: 4.4, tone, seed: 20, taper: 0.1 });
    Z.wire(c, [[34, hipY], [58, hipY + 28], [70, hipY + 52]], { w: 4.4, tone, seed: 21, taper: 0.1 });
  } else {
    Z.wire(c, [[-34, hipY], [-46, hipY + 46], [-42, ly]], { w: 4.4, tone, seed: 22, taper: 0.1 });
    Z.wire(c, [[34, hipY], [46, hipY + 46], [42, ly]], { w: 4.4, tone, seed: 23, taper: 0.1 });
    Z.lined(c, [[-42, ly], [-64, ly - 4], [-66, ly + 16], [-40, ly + 13]], { w: 2.6, tone: tone * 0.85, seed: 24 });
    Z.lined(c, [[42, ly], [64, ly - 4], [66, ly + 16], [40, ly + 13]], { w: 2.6, tone: tone * 0.85, seed: 25 });
  }

  // 连环重甲
  const body = [[-64, shoulderY + 6], [-72, waistY + 4], [-58, hipY], [58, hipY], [72, waistY + 4], [64, shoulderY + 6]];
  Z.lined(c, body, { w: 3.8, tone, seed: 30, hatch: 0.24, gap: 8, hatchAng: -0.9 });
  c.save(); c.fillStyle = 'rgba(114,116,122,.18)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  for (let i = 0; i < 5; i++) Z.wire(c, [[-58, shoulderY + 30 + i * 22], [58, shoulderY + 30 + i * 22]], { w: 2, tone: tone * 0.58, seed: 31 + i });
  Z.wire(c, [[-70, waistY + 2], [70, waistY + 2], [70, waistY + 22], [-70, waistY + 22], [-70, waistY + 2]], { w: 3.6, tone, seed: 36, taper: 0.06 });
  Z.lined(c, [[-64, shoulderY + 6], [-88, shoulderY + 26], [-76, shoulderY + 58]], { w: 3, tone: tone * 0.9, seed: 37, hatch: 0.16 });
  Z.lined(c, [[64, shoulderY + 6], [88, shoulderY + 26], [76, shoulderY + 58]], { w: 3, tone: tone * 0.9, seed: 38, hatch: 0.16 });
  if (armor) {
    c.save(); c.fillStyle = 'rgba(26,26,28,.7)'; c.font = '28px "LXGWWenKai-500"';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('连环', 0, shoulderY + 46);
    c.restore();
  }

  // 双臂
  const handY = shoulderY + 58 - raise * 46;
  Z.wire(c, [[-64, shoulderY + 14], [-98, shoulderY + 44], [-90, handY + 8]], { w: 4.2, tone, seed: 40, taper: 0.1 });
  Z.wire(c, [[64, shoulderY + 14], [98, shoulderY + 36 - raise * 28], [90, handY - raise * 34]], { w: 4.2, tone, seed: 41, taper: 0.1 });

  // 头（虎头盔 + 长髯）
  const hy = shoulderY - 42 + br * 0.5;
  const face = [[-25, hy - 14], [-22, hy - 40], [0, hy - 52], [22, hy - 40], [25, hy - 14], [23, hy + 14], [0, hy + 28], [-23, hy + 12]];
  Z.lined(c, face, { w: 2.8, tone: tone * 0.95, seed: 100, hatch: 0.08, gap: 9 });
  Z.wire(c, [[-19, hy - 18], [-8, hy - 12], [-2, hy - 18]], { w: 3, tone, seed: 101 });
  Z.wire(c, [[2, hy - 18], [8, hy - 12], [19, hy - 18]], { w: 3, tone, seed: 102 });
  Z.wire(c, [[-15, hy - 6], [-5, hy - 4]], { w: 2.4, tone, seed: 103 });
  Z.wire(c, [[5, hy - 4], [15, hy - 6]], { w: 2.4, tone, seed: 104 });
  Z.wire(c, [[-7, hy + 6], [7, hy + 5]], { w: 2.4, tone: tone * 0.8, seed: 105 });
  for (let i = 0; i < 6; i++) {
    const bx = -15 + i * 6, wob = Math.sin(t * 1.8 + i * 0.7) * 4;
    Z.wire(c, [[bx, hy + 14], [bx + wob, hy + 44], [bx + wob * 1.5, hy + 66]], { w: 2.2, tone: tone * 0.88, seed: 106 + i, taper: 0.4 });
  }
  Z.wire(c, [[-30, hy - 22], [-26, hy - 52], [26, hy - 52], [30, hy - 22]], { w: 3, tone: 0.94, seed: 130 });
  Z.wire(c, [[-26, hy - 52], [-16, hy - 78], [16, hy - 78], [26, hy - 52]], { w: 3.2, tone: 0.94, seed: 131 });
  Z.wire(c, [[-16, hy - 78], [0, hy - 94], [16, hy - 78]], { w: 2.8, tone: 0.92, seed: 132 });
  Z.wire(c, [[-30, hy - 22], [-36, hy + 6], [-24, hy + 12]], { w: 2.6, tone: 0.86, seed: 133 });
  Z.wire(c, [[30, hy - 22], [36, hy + 6], [24, hy + 12]], { w: 2.6, tone: 0.86, seed: 134 });
  if (hurt) {
    c.save(); c.globalAlpha = hurt * 0.8; c.fillStyle = 'rgba(183,51,46,.4)';
    c.beginPath(); c.ellipse(0, shoulderY + 20, 40, 26, 0.3, 0, 7); c.fill(); c.restore();
  }

  // 双鞭（必须在 restore 之前）
  if (bian) Z.shuangbian(c, 96, handY + 12, 1.16, { tone, seed: 170, splay: 0.3 + raise * 0.5 });
  c.restore();
};

// ============================== 九幕 ==============================

// ① 名将之后：呼延赞嫡派，汝宁郡都统制
SCENES['hyz1_mingjiang'] = (() => {
  const p = () => Z.paper('hyz1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1500, y: 170, s: 1.1, seed: 4, tone: 0.3 });
      Z.ground(c, 900, { seed: 5, tone: 0.4 });
      Z.guan(c, 1520, 780, 0.94, { tone: 0.88, seed: 6, text: '汝宁郡' });
      Z.flag(c, 620, 590, 168, t, { text: '呼延', seed: 7, size: 30 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1420 + i * 110, 892, 0.78, t, { flip: 1, spear: 1, tone: 0.64, seed: 8 + i });
      Z.huyanzhuo(c, 900, 892, 1.56, t, { raise: clamp(Math.sin(t * 1.3) * 0.22 + 0.32) });
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 54 + i * 205) % 1980) - 30, by = 320 + ((t * 40 + i * 150) % 460);
        Z.wire(c, [[bx, by], [bx + 13, by + 6]], { w: 1.5, tone: 0.34, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '名将之后', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 连环马出阵：奉命征剿梁山
SCENES['hyz2_lianhuan'] = (() => {
  const p = () => Z.paper('hyz2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 180, tone: 0.3, seed: 11 }]);
      Z.ground(c, 940, { seed: 12, tone: 0.44 });
      Z.flag(c, 340, 560, 190, t, { text: '呼延', seed: 13, size: 30 });
      Z.lianhuan(c, 980, 880, 0.86, t, { tone: 0.82, seed: 14, n: 3 });
      for (let i = 0; i < 14; i++) {
        const dx = ((t * 128 + i * 145) % 1900) - 40, dy = 880 + ((t * 34 + i * 90) % 90);
        Z.wire(c, [[dx, dy], [dx + 30, dy - 6]], { w: 2, tone: 0.38, seed: 1960 + i, taper: 0.9 });
      }
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('三千连环马，铁索相连', 940, 300);
        c.restore();
      }
    });
    Z.bigText(c, '连环马阵', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 梁山无计：阵前连败
SCENES['hyz3_pozhen'] = (() => {
  const p = () => Z.paper('hyz3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 170, tone: 0.3, seed: 21 }]);
      Z.ground(c, 940, { seed: 22, tone: 0.44 });
      Z.flag(c, 1600, 540, 190, t, { text: '梁山', seed: 23, size: 30 });
      Z.lianhuan(c, 1080, 880, 0.8, t, { tone: 0.86, seed: 24, n: 3 });
      // 梁山人马败退（背影：低 tone）
      for (let i = 0; i < 3; i++) Z.fighter(c, 480 + i * 96, 892, 0.72 - i * 0.04, t, { flip: 0, blade: 1, tone: 0.46, seed: 25 + i });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 116 + i * 160) % 1500) + 300, dy = 850 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.36, seed: 1970 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '梁山无计', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ④ 钩镰枪破阵：徐宁上山，一物降一物
SCENES['hyz4_pozhen2'] = (() => {
  const p = () => Z.paper('hyz4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 940, { seed: 31, tone: 0.44 });
      Z.guan(c, 380, 800, 0.66, { tone: 0.74, seed: 32, text: '连环马' });
      // 倒地的连环马（链条断裂）
      Z.zhanma(c, 1180, 940, 0.9, t, { tone: 0.66, seed: 33, gait: 0, flip: 1 });
      Z.zhanma(c, 1520, 940, 0.8, t, { tone: 0.6, seed: 34, gait: 0, flip: 1 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 620 + i * 110, 892, 0.9, t, { spear: 1, tone: 0.78, seed: 35 + i });
      Z.huyanzhuo(c, 900, 892, 1.42, t, { ride: 1, hurt: clamp(ss(0.6, 1.8, lt)), raise: 0.2 });
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('徐宁钩镰枪，专破连环马', 940, 300);
        c.restore();
      }
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 110 + i * 168) % 1500) + 300, dy = 860 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 6]], { w: 2, tone: 0.36, seed: 1975 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '钩镰破阵', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 兵败投青州：匹马夜走
SCENES['hyz5_qingzhou'] = (() => {
  const p = () => Z.paper('hyz5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 200, tone: 0.32, seed: 41 }, { y0: 650, amp: 120, tone: 0.22, seed: 42 }]);
      Z.cloud(c, t, { x: 420, y: 180, s: 1.15, seed: 43, tone: 0.3 });
      Z.ground(c, 940, { seed: 44, tone: 0.44 });
      Z.guan(c, 1560, 800, 0.68, { tone: 0.76, seed: 45, text: '青州' });
      const run = clamp(ss(0.2, 2.4, lt));
      Z.zhanma(c, lerp(460, 1120, run), 900, 0.92, t, { tone: 0.84, seed: 46, gait: 1 });
      Z.huyanzhuo(c, lerp(460, 1120, run) + 12, 838, 1.1, t, { ride: 1, bian: 1, raise: 0.2, tone: 0.86 });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 120 + i * 160) % 1500) + 300, dy = 900 + ((t * 36 + i * 90) % 100);
        Z.wire(c, [[dx, dy], [dx + 30, dy - 6]], { w: 2, tone: 0.36, seed: 1980 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '匹马投青州', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 三山聚义打青州：归顺梁山
SCENES['hyz6_guishun'] = (() => {
  const p = () => Z.paper('hyz6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 190, tone: 0.3, seed: 51 }]);
      Z.ground(c, 900, { seed: 52, tone: 0.44 });
      Z.guan(c, 1520, 790, 0.9, { tone: 0.86, seed: 53, text: '青州' });
      Z.shanzhai(c, 420, 760, 0.72, { tone: 0.76, seed: 54, text: '三山' });
      Z.songjiang(c, 1080, 892, 1.44, t, { official: 1, raise: clamp(Math.sin(t * 1.2) * 0.16 + 0.26) });
      Z.huyanzhuo(c, 720, 892, 1.5, t, { kneel: clamp(ss(0.8, 1.8, lt)) * 0.7, raise: 0.2 });
      Z.shuangbian(c, 980, 878, 1.0, { tone: 0.8, seed: 175 });
      for (let i = 0; i < 4; i++) Z.fighter(c, 1300 + i * 110, 892, 0.76, t, { flip: 1, blade: 1, tone: 0.62, seed: 55 + i });
      if (lt > 1.4) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.4, 2.4, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('三山聚义，呼延灼归梁山', 940, 320);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 48 + i * 210) % 1960) - 30, by = 320 + ((t * 32 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1916 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '归顺梁山', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 五虎第四：南征北讨
SCENES['hyz7_wuhu'] = (() => {
  const p = () => Z.paper('hyz7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 200, tone: 0.32, seed: 61 }, { y0: 660, amp: 110, tone: 0.22, seed: 62 }]);
      Z.ground(c, 900, { seed: 63, tone: 0.44 });
      Z.flag(c, 1600, 500, 200, t, { text: '宋', seed: 64, size: 32 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1420 + i * 130, 892, 0.94, t, { flip: 1, blade: 1, tone: 0.7, seed: 65 + i });
      const charge = clamp(ss(0.2, 1.6, lt));
      Z.zhanma(c, lerp(500, 760, charge), 920, 1.0, t, { tone: 0.84, seed: 66, gait: 1 });
      Z.huyanzhuo(c, lerp(512, 772, charge), 858, 1.0, t, { ride: 1, raise: charge });
      for (let i = 0; i < 6; i++) {
        const a = -1.2 + i * 0.32 + Math.sin(t * 4.4) * 0.1;
        Z.wire(c, [[850, 690], [850 + Math.cos(a) * 80, 690 + Math.sin(a) * 80]], { w: 2.4, tone: 0.5, seed: 1950 + i, taper: 0.8 });
      }
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 112 + i * 165) % 1500) + 280, dy = 830 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1990 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '五虎第四', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑧ 破辽征腊：拒敌于国门
SCENES['hyz8_zhengla'] = (() => {
  const p = () => Z.paper('hyz8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 470, amp: 230, tone: 0.34, seed: 71 }, { y0: 640, amp: 130, tone: 0.24, seed: 72 }]);
      Z.cloud(c, t, { x: 380, y: 170, s: 1.2, seed: 73, tone: 0.3 });
      Z.ground(c, 900, { seed: 74, tone: 0.44 });
      Z.guan(c, 1580, 780, 0.9, { tone: 0.8, seed: 75, text: '江南' });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1420 + i * 130, 892, 0.92, t, { flip: 1, spear: 1, tone: 0.7, seed: 76 + i });
      Z.zhanma(c, 780, 920, 1.0, t, { tone: 0.86, seed: 77, gait: 1 });
      Z.huyanzhuo(c, 792, 858, 1.0, t, { ride: 1, raise: clamp(Math.sin(t * 2.6) * 0.3 + 0.5) });
      for (let i = 0; i < 8; i++) {
        const dx = 900 + ((t * 124 + i * 150) % 520), dy = 760 + (i % 3) * 46;
        Z.wire(c, [[dx, dy], [dx + 26, dy - 12]], { w: 2, tone: 0.44, seed: 1965 + i, taper: 0.8 });
      }
    });
    Z.bigText(c, '南征北讨', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑨ 抗金战死：授御营指挥使，后死难于金军阵前（朱砂钤印）
SCENES['hyz9_kangjin'] = (() => {
  const p = () => Z.paper('hyz9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 220, tone: 0.34, seed: 81 }, { y0: 660, amp: 120, tone: 0.22, seed: 82 }]);
      Z.cloud(c, t, { x: 480, y: 180, s: 1.2, seed: 83, tone: 0.32 });
      Z.ground(c, 900, { seed: 84, tone: 0.42 });
      Z.flag(c, 1560, 540, 200, t, { text: '宋', seed: 85, size: 32 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1400 + i * 130, 892, 0.9, t, { flip: 1, spear: 1, tone: 0.66, seed: 86 + i });
      const fall = clamp(ss(1.2, 2.8, lt));
      c.save(); c.translate(820, 892); c.rotate(fall * 0.6); c.translate(-820, -892);
      Z.huyanzhuo(c, 820, 892 + fall * 26, 1.5, t, { raise: 0.3 - fall * 0.2, hurt: fall });
      c.restore();
      if (fall > 0.25) {
        for (let i = 0; i < 8; i++) {
          const dx = 760 + ((t * 126 + i * 150) % 540), dy = 740 + (i % 3) * 52;
          Z.wire(c, [[dx, dy], [dx + 26, dy - 12]], { w: 2, tone: 0.42, seed: 1967 + i, taper: 0.8 });
        }
      }
      if (lt > 2.0) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(2.0, 3.0, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('后领御营兵马，抗金死难', 1420, 330);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 44 + i * 210) % 1960) - 30, by = 320 + ((t * 30 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1991 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '马革裹尸', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '双鞭', clamp(ss(0.9, 2.6, lt)), { size: 28 });
  } };
})();
})();
