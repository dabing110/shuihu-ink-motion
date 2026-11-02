// 《水浒传·戴宗》rig + 九幕（宋元版画线描 + 焦墨）
// 造型：江州两院押牢节级，有道术，腿绑甲马日行八百里，绰号「神行太保」，
//   梁山排名第二十（天速星），总探声息、走报机密。他是全书所有事件的「线」。
//   征方腊后授兖州府都统制，纳还官诰，赴泰安州岳庙出家，数月后大笑而终。
//   特征：① 甲马（signature，朱砂符文）② 疾行残影 ③ 公文包裹与令牌 ④ 绑腿。
// 唯一的彩：朱砂只用于① 甲马符文 ② 第三幕假印的神行符 ③ 末幕「神行太保」钤印。
// 母题：① 甲马 ② 残影 ③ 路 ④ 书信。
// 弧光：江州节级 → 甲马神行 → 假信败露 → 传信劫法场 → 传令四方 → 走报机密 →
//       招安传旨 → 纳印辞官出家 → 大笑而终。
// 依《水浒传》第三十六至四十回、第四十七回、第八十二回、第一百十九至二十回。
// 互文：第三、四幕复用宋江（浔阳楼事主）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 甲马（signature：纸马符，朱砂符文）
Z.jiama = (c, x, y, s, t, { tone = 0.9, seed = 1, cin = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const flap = Math.sin(t * 4.2 + seed) * 4;
  Z.lined(c, [[-30, 0], [-26, -34], [6, -44], [34, -30], [30, -6], [4, 4]],
    { w: 2.6, tone, seed, hatch: 0.16, gap: 7 });
  // 马头马尾（剪影式，极小）
  Z.wire(c, [[-26, -34], [-44, -46], [-40, -60]], { w: 2.2, tone: tone * 0.9, seed: seed + 1 });
  Z.wire(c, [[30, -6], [48, -18 + flap], [52, -2]], { w: 2, tone: tone * 0.8, seed: seed + 2, taper: 0.6 });
  if (cin) {
    c.strokeStyle = 'rgba(183,51,46,.66)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-16, -22); c.lineTo(-16, -8); c.moveTo(-16, -22); c.lineTo(-4, -20);
    c.moveTo(-16, -8); c.lineTo(-4, -6); c.moveTo(-2, -28); c.lineTo(-2, -4); c.stroke();
    c.fillStyle = 'rgba(183,51,46,.5)';
    c.beginPath(); c.arc(12, -18, 3, 0, 7); c.fill();
  }
  c.restore();
};

// 公文/包裹：背书一封 + 令牌
Z.gongwen = (c, x, y, s, { tone = 0.86, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-26, 0], [-26, -54], [26, -54], [26, 0], [-26, 0]], { w: 2.6, tone, seed, taper: 0.04 });
  Z.wire(c, [[-26, -54], [0, -40], [26, -54]], { w: 2.2, tone: tone * 0.85, seed: seed + 1 });
  Z.wire(c, [[-14, -30], [14, -30]], { w: 1.6, tone: tone * 0.6, seed: seed + 2 });
  Z.wire(c, [[-14, -16], [14, -16]], { w: 1.6, tone: tone * 0.6, seed: seed + 3 });
  c.restore();
};

// ============================== 戴宗本体 ==============================
// o: { jiama甲马, run疾行, package公文, flip, raise, kneel, monk僧, tone }
Z.daizong = (c, x, y, s, t, o = {}) => {
  const {
    jiama = 1, run = 0, package: pkg = 0, flip = 0, raise = 0, kneel = 0,
    monk = 0, tone = 0.92,
  } = o;
  const br = Math.sin(t * (run ? 5.2 : 1.3)) * (run ? 3.4 : 2);
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 46 : 0);
  const shoulderY = ly - 154;
  const waistY = ly - 76;
  const hipY = ly - 24;

  // ---- 腿（绑腿至膝；跑动时交错摆动）----
  const tuck = run ? Math.sin(t * 6.4) * 26 : 0;
  Z.wire(c, [[-32, hipY], [-24 + tuck * 0.5, hipY + 42], [-34 + tuck, ly]], { w: 4, tone, seed: 20, taper: 0.1 });
  Z.wire(c, [[32, hipY], [24 - tuck * 0.5, hipY + 42], [34 - tuck, ly]], { w: 4, tone, seed: 21, taper: 0.1 });
  for (let i = 0; i < 3; i++) {
    Z.wire(c, [[-30, hipY + 12 + i * 12], [-22, hipY + 16 + i * 12]], { w: 1.6, tone: tone * 0.7, seed: 22 + i });
    Z.wire(c, [[30, hipY + 12 + i * 12], [22, hipY + 16 + i * 12]], { w: 1.6, tone: tone * 0.7, seed: 25 + i });
  }
  Z.lined(c, [[-34 + tuck, ly], [-58 + tuck, ly - 6], [-60 + tuck, ly + 13], [-32, ly + 12]], { w: 2.6, tone: tone * 0.85, seed: 28 });
  Z.lined(c, [[34 - tuck, ly], [58 - tuck, ly - 6], [60 - tuck, ly + 13], [32, ly + 12]], { w: 2.6, tone: tone * 0.85, seed: 29 });

  // ---- 躯干（公差服 + 僧衣可换）----
  if (monk) {
    const gown = [[-56, shoulderY + 8], [-64, waistY + 10], [-74, ly - 8], [-60, ly], [60, ly], [74, ly - 8], [64, waistY + 10], [56, shoulderY + 8]];
    Z.lined(c, gown, { w: 3.2, tone, seed: 30, hatch: 0.12, gap: 11, hatchAng: -1.25 });
    Z.wire(c, [[-64, waistY + 10], [64, waistY + 10]], { w: 3, tone, seed: 31, taper: 0.06 });
  } else {
    const body = [[-52, shoulderY + 6], [-58, waistY + 2], [-46, hipY], [46, hipY], [58, waistY + 2], [52, shoulderY + 6]];
    Z.lined(c, body, { w: 3.4, tone, seed: 32, hatch: 0.2, gap: 8 });
    c.save(); c.fillStyle = 'rgba(116,118,124,.15)';
    c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
    Z.wire(c, [[-56, waistY + 2], [56, waistY + 2], [56, waistY + 20], [-56, waistY + 20], [-56, waistY + 2]], { w: 3.2, tone, seed: 33, taper: 0.06 });
    for (let i = 0; i < 3; i++) Z.wire(c, [[-48, shoulderY + 26 + i * 20], [48, shoulderY + 26 + i * 20]], { w: 1.8, tone: tone * 0.55, seed: 34 + i });
    c.save(); c.fillStyle = 'rgba(26,26,28,.66)'; c.font = '26px "LXGWWenKai-500"';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('神行', 0, shoulderY + 44); c.restore();
  }

  // ---- 双臂 ----
  const swing = run ? Math.sin(t * 6.4 + 3.1) * 30 : 0;
  const handY = shoulderY + 52 - raise * 44;
  Z.wire(c, [[-52, shoulderY + 12], [-84, shoulderY + 40 + swing], [-78, handY + 6 - swing * 0.6]], { w: 3.8, tone, seed: 50, taper: 0.1 });
  Z.wire(c, [[52, shoulderY + 12], [84, shoulderY + 36 - raise * 26 - swing], [78, handY - raise * 30 + swing * 0.6]], { w: 3.8, tone, seed: 51, taper: 0.1 });
  if (pkg) {
    Z.gongwen(c, -84, handY - 10, 0.9, { tone: tone * 0.9, seed: 60 });
  } else {
    Z.lined(c, [[-78, handY + 4], [-64, handY + 20], [-52, handY + 6], [-62, handY - 8]], { w: 2.2, tone: tone * 0.85, seed: 52 });
  }
  Z.lined(c, [[78, handY - 6], [64, handY + 10], [52, handY - 4], [62, handY - 18]], { w: 2.2, tone: tone * 0.85, seed: 53 });

  // ---- 头（尖角幞头 / 后期僧帽）----
  const hy = shoulderY - 40 + br * 0.5;
  const face = [[-21, hy - 12], [-19, hy - 36], [0, hy - 48], [19, hy - 36], [21, hy - 12], [19, hy + 12], [0, hy + 24], [-19, hy + 10]];
  Z.lined(c, face, { w: 2.6, tone: tone * 0.95, seed: 100, hatch: 0.06, gap: 9 });
  Z.wire(c, [[-14, hy - 16], [-6, hy - 22], [-2, hy - 19]], { w: 2.2, tone, seed: 101 });
  Z.wire(c, [[2, hy - 19], [6, hy - 22], [14, hy - 16]], { w: 2.2, tone, seed: 102 });
  Z.wire(c, [[-11, hy - 6], [-4, hy - 5]], { w: 2, tone, seed: 103 });
  Z.wire(c, [[4, hy - 5], [11, hy - 6]], { w: 2, tone, seed: 104 });
  Z.wire(c, [[-5, hy + 6], [5, hy + 5]], { w: 2, tone: tone * 0.8, seed: 105 });
  if (monk) {
    Z.wire(c, [[-22, hy - 16], [-20, hy - 46], [20, hy - 46], [22, hy - 16]], { w: 2.8, tone: 0.88, seed: 130 });
    Z.wire(c, [[-20, hy - 46], [-12, hy - 62], [12, hy - 62], [20, hy - 46]], { w: 2.8, tone: 0.88, seed: 131 });
  } else {
    Z.wire(c, [[-24, hy - 18], [-20, hy - 44], [20, hy - 44], [24, hy - 18]], { w: 2.8, tone: 0.92, seed: 132 });
    Z.wire(c, [[-30, hy - 30], [-46, hy - 38], [-34, hy - 18]], { w: 2.4, tone: 0.9, seed: 133 });
    Z.wire(c, [[30, hy - 30], [46, hy - 38], [34, hy - 18]], { w: 2.4, tone: 0.9, seed: 134 });
  }

  // ---- 甲马（signature）必须在 restore 之前：绑在小腿上 ----
  if (jiama) {
    Z.jiama(c, -40 + tuck * 0.6, hipY + 48, 0.66, t, { tone: tone * 0.95, seed: 170 });
    Z.jiama(c, 40 - tuck * 0.6, hipY + 48, 0.66, t, { tone: tone * 0.95, seed: 174 });
  }
  c.restore();
};

// 疾行残影：同一形状多次低 tone 重影（速度感）
Z.daizong_run = (c, x, y, s, t, o = {}) => {
  for (let i = 3; i >= 0; i--) {
    Z.daizong(c, x - i * 88 * s, y, s, t - i * 0.06, Object.assign({}, o, { tone: (o.tone || 0.92) * (0.9 - i * 0.22) }));
  }
};

// ============================== 九幕 ==============================

// ① 江州节级：两院押牢节级，人称神行太保
SCENES['dz1_jiangzhou'] = (() => {
  const p = () => Z.paper('dz1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 460, y: 170, s: 1.1, seed: 4, tone: 0.3 });
      Z.ground(c, 900, { seed: 5, tone: 0.4 });
      Z.guan(c, 1540, 780, 0.94, { tone: 0.88, seed: 6, text: '江州' });
      Z.flag(c, 600, 590, 168, t, { text: '戴', seed: 7, size: 32 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1420 + i * 110, 892, 0.74, t, { flip: 1, blade: 1, tone: 0.62, seed: 8 + i });
      Z.daizong(c, 940, 892, 1.56, t, { pkg: 1, raise: clamp(Math.sin(t * 1.4) * 0.2 + 0.3) });
      Z.jiama(c, 1330, 760, 1.2, t, { tone: 0.9, seed: 9 });
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 52 + i * 205) % 1980) - 30, by = 300 + ((t * 38 + i * 150) % 460);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.34, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '江州节级', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 甲马神行：腿绑甲马，日行八百里
SCENES['dz2_jiama'] = (() => {
  const p = () => Z.paper('dz2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 190, tone: 0.3, seed: 11 }, { y0: 660, amp: 110, tone: 0.2, seed: 12 }]);
      Z.ground(c, 900, { seed: 13, tone: 0.44 });
      Z.pine(c, t, { x: 340, y: 890, s: 0.9, seed: 14, tone: 0.78 });
      Z.pine(c, t, { x: 1620, y: 890, s: 1.0, seed: 15, tone: 0.76 });
      Z.daizong_run(c, lerp(300, 1500, (t % 3) / 3), 892, 1.5, t, { run: 1, pkg: 1 });
      for (let i = 0; i < 16; i++) {
        const sx = ((t * 320 + i * 130) % 2200) - 200, sy = 500 + ((i * 137) % 380);
        Z.wire(c, [[sx, sy], [sx + 60, sy + 4]], { w: 1.8, tone: 0.3, seed: 1960 + i, taper: 1.0 });
      }
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('绑上甲马，日行八百里', 940, 300);
        c.restore();
      }
    });
    Z.bigText(c, '神行太保', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 假信败露：为救宋江传假书，被黄文炳识破（互文 Z.songjiang）
SCENES['dz3_jiaxin'] = (() => {
  const p = () => Z.paper('dz3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 21, tone: 0.42 });
      Z.guan(c, 1500, 790, 0.88, { tone: 0.86, seed: 22, text: '江州府' });
      Z.daizong(c, 900, 892, 1.52, t, { pkg: 1, kneel: clamp(ss(0.8, 1.8, lt)) * 0.8, raise: 0.1 });
      Z.songjiang(c, 1240, 892, 1.3, t, { official: 1, hurt: clamp(ss(0.8, 1.8, lt)), raise: 0.15 });
      // 识破：散落的书简
      for (let i = 0; i < 4; i++) {
        const dx = 660 + i * 60, dy = 820 + Math.sin(t * 1.6 + i) * 6;
        Z.gongwen(c, dx, dy, 0.5, { tone: 0.6, seed: 23 + i });
      }
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('假书被识破，同下死牢', 940, 300);
        c.restore();
      }
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 320 + ((t * 34 + i * 150) % 430);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1913 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '假书败露', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 劫法场：往返传信，梁山好汉齐至江州
SCENES['dz4_fachang'] = (() => {
  const p = () => Z.paper('dz4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 31, tone: 0.44 });
      Z.guan(c, 400, 800, 0.68, { tone: 0.76, seed: 32, text: '法场' });
      Z.likui(c, 1520, 892, 1.34, t, { axe: 1, rage: clamp(ss(0.4, 1.4, lt)), raise: clamp(Math.sin(t * 3.4) * 0.3 + 0.5), tone: 0.92 });
      Z.songjiang(c, 1180, 892, 1.3, t, { official: 1, raise: 0.3 });
      Z.daizong_run(c, lerp(300, 820, clamp(ss(0.2, 2.6, lt))), 892, 1.16, t, { run: 1, tone: 0.86 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 640 + i * 100, 892, 0.76, t, { blade: 1, tone: 0.6, seed: 33 + i });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 116 + i * 165) % 1500) + 300, dy = 830 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.36, seed: 1973 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '飞报江州', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 传令四方：三打祝家庄、攻高唐州，他来他往
SCENES['dz5_chuanling'] = (() => {
  const p = () => Z.paper('dz5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 530, amp: 200, tone: 0.3, seed: 41 }, { y0: 660, amp: 120, tone: 0.22, seed: 42 }]);
      Z.ground(c, 900, { seed: 43, tone: 0.44 });
      Z.manor(c, 1560, 790, 0.74, { tone: 0.8, seed: 44, text: '祝家庄' });
      Z.guan(c, 380, 800, 0.62, { tone: 0.74, seed: 45, text: '高唐州' });
      Z.daizong_run(c, lerp(360, 1480, ((t * 0.4) % 1)), 892, 1.2, t, { run: 1, pkg: 1, tone: 0.86 });
      for (let i = 0; i < 14; i++) {
        const sx = ((t * 300 + i * 150) % 2200) - 200, sy = 520 + ((i * 151) % 360);
        Z.wire(c, [[sx, sy], [sx + 56, sy + 4]], { w: 1.8, tone: 0.3, seed: 1985 + i, taper: 1.0 });
      }
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('三打祝家庄，他往来传令', 940, 320);
        c.restore();
      }
    });
    Z.bigText(c, '日行千里', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑥ 走报机密：天速星职司，全书情报的「线」
SCENES['dz6_zoubao'] = (() => {
  const p = () => Z.paper('dz6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 51, tone: 0.42 });
      Z.wire(c, [[1100, 900], [1100, 500], [1820, 500], [1820, 900]], { w: 3.6, tone: 0.88, seed: 52 });
      Z.roof(c, 1460, 500, 760, 156, { tone: 0.9, seed: 53 });
      Z.hatchBox(c, [[1100, 900], [1820, 900], [1820, 500], [1100, 500]], { ang: -1.35, gap: 22, tone: 0.1, seed: 54 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.66)'; c.font = '32px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('忠义堂', 1460, 736); c.restore();
      Z.songjiang(c, 1220, 892, 1.4, t, { official: 1, raise: clamp(Math.sin(t * 1.2) * 0.16 + 0.24) });
      Z.daizong(c, 820, 892, 1.5, t, { pkg: 1, raise: clamp(ss(0.4, 1.5, lt)) * 0.45, jiama: 1 });
      // 情报线：远处几封报文（四散）
      for (let i = 0; i < 4; i++) Z.gongwen(c, 560 + i * 90, 820 + Math.sin(t * 1.8 + i) * 6, 0.6, { tone: 0.7, seed: 55 + i });
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('总探声息，走报机密', 900, 300);
        c.restore();
      }
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 320 + ((t * 34 + i * 150) % 430);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1918 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '走报机密', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 招安传旨：数进东京，往返传旨
SCENES['dz7_zhaoan'] = (() => {
  const p = () => Z.paper('dz7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 170, tone: 0.3, seed: 61 }]);
      Z.ground(c, 900, { seed: 62, tone: 0.44 });
      Z.guan(c, 1560, 800, 0.9, { tone: 0.88, seed: 63, text: '东京' });
      Z.shanzhai(c, 380, 780, 0.66, { tone: 0.74, seed: 64, text: '梁山' });
      Z.daizong_run(c, lerp(460, 1320, ((t * 0.35) % 1)), 892, 1.18, t, { run: 1, pkg: 1, tone: 0.88 });
      Z.jiama(c, 1660, 780, 0.9, t, { tone: 0.86, seed: 65 });
      for (let i = 0; i < 14; i++) {
        const sx = ((t * 280 + i * 150) % 2200) - 200, sy = 520 + ((i * 149) % 360);
        Z.wire(c, [[sx, sy], [sx + 54, sy + 4]], { w: 1.8, tone: 0.3, seed: 1988 + i, taper: 1.0 });
      }
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('数进东京，招安由此而成', 940, 320);
        c.restore();
      }
    });
    Z.bigText(c, '往返传旨', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 纳印辞官：缴还官诰，赴泰安州岳庙出家
SCENES['dz8_chuguan'] = (() => {
  const p = () => Z.paper('dz8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 470, amp: 230, tone: 0.32, seed: 71 }, { y0: 650, amp: 120, tone: 0.22, seed: 72 }]);
      Z.ground(c, 900, { seed: 73, tone: 0.42 });
      Z.temple(c, 1520, 800, 0.92, { tone: 0.84, seed: 74, text: '岳庙' });
      // 官印（放在案上）
      Z.wire(c, [[1240, 892], [1240, 846], [1400, 846], [1400, 892]], { w: 2.8, tone: 0.84, seed: 75 });
      Z.gongwen(c, 1320, 846, 0.8, { tone: 0.82, seed: 76 });
      const monk = clamp(ss(0.6, 2.0, lt));
      Z.daizong(c, 820, 892, 1.5, t, { monk, raise: monk * 0.3, kneel: monk * 0.5, jiama: 0, pkg: 0 });
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 48 + i * 210) % 1960) - 30, by = 320 + ((t * 32 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1919 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '纳印出家', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑨ 大笑而终：数月之后，一笑而逝（朱砂钤印）
SCENES['dz9_xiaoshi'] = (() => {
  const p = () => Z.paper('dz9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 200, tone: 0.3, seed: 81 }, { y0: 660, amp: 110, tone: 0.2, seed: 82 }]);
      Z.cloud(c, t, { x: 480, y: 180, s: 1.2, seed: 83, tone: 0.3 });
      Z.ground(c, 900, { seed: 84, tone: 0.4 });
      Z.temple(c, 1540, 800, 0.86, { tone: 0.82, seed: 85, text: '泰安州' });
      Z.pine(c, t, { x: 360, y: 892, s: 1.0, seed: 86, tone: 0.8 });
      const fade = clamp(ss(1.4, 3.0, lt));
      c.save(); c.globalAlpha = 1 - fade * 0.35;
      Z.daizong(c, 940, 892, 1.52, t, { monk: 1, raise: 0.4, jiama: 0, pkg: 0 });
      c.restore();
      if (lt > 2.0) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(2.0, 3.0, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('数月之后，大笑而终', 700, 330);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 44 + i * 210) % 1960) - 30, by = 320 + ((t * 30 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1991 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '大笑而终', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '神行太保', clamp(ss(0.9, 2.6, lt)), { size: 24 });
  } };
})();
})();
