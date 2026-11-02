// 《水浒传·张清》rig + 九幕（宋元版画线描 + 焦墨）
// 造型：彰德府人氏，虎骑出身，擅飞石打人，百发百中，绰号「没羽箭」，
//   梁山排名第十六（天捷星），马军八骠骑兼先锋使。征方腊独松关一役战死。
//   特征：① 飞石（signature）② 锦袋（腰间，装石子）③ 长枪 ④ 白袍。
// 唯一的彩：朱砂只用于① 锦袋口的朱砂系绳 ② 第九幕中箭的血光点 ③ 末幕「没羽箭」钤印。
// 母题：① 飞石 ② 锦袋 ③ 碎石 ④ 战马。
// 弧光：虎骑出身 → 飞石绝技 → 东昌府连打十五员 → 归顺梁山 → 娶琼英（108回本） →
//       骠骑先锋 → 破辽征腊 → 独松关战死 → 身后追封。
// 依《水浒传》第七十回、第九十八回、第一百十五至十六回。
// 互文：第三幕连打梁山十五员大将（关胜、呼延灼、董平、杨志等皆在其列），
//       是本片与《关胜》《呼延灼》《杨志》三片的交叉点。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 锦袋（腰间装石子的布袋；朱砂系绳）
Z.jindai = (c, x, y, s, t, { tone = 0.88, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const sw = Math.sin(t * 2.4 + seed) * 4;
  Z.lined(c, [[-26, 0], [-30, -44], [30, -44], [26, 0], [-26, 0]],
    { w: 2.8, tone, seed, hatch: 0.2, gap: 7 });
  Z.wire(c, [[-30, -44], [0, -52], [30, -44]], { w: 2.4, tone: tone * 0.9, seed: seed + 1 });
  c.strokeStyle = 'rgba(183,51,46,.6)'; c.lineWidth = 2.2;
  c.beginPath(); c.moveTo(-24, -46); c.lineTo(24 + sw, -46); c.stroke();
  c.fillStyle = 'rgba(26,26,28,.3)';
  for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-12 + i * 9, -30 + (i % 2) * 8, 3.4, 0, 7); c.fill(); }
  c.restore();
};

// 飞石（signature：一枚带尾迹的石子）
Z.feishi = (c, x, y, s, { tone = 0.92, seed = 1, tail = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (tail) {
    for (let i = 1; i <= 5; i++) {
      c.save(); c.globalAlpha = 0.5 - i * 0.08;
      Z.wire(c, [[-16 * i, 0], [-16 * i - 8, 0]], { w: 2, tone: tone * 0.6, seed: seed + 20 + i });
      c.restore();
    }
  }
  Z.lined(c, [[-14, -6], [-6, -16], [10, -12], [16, 2], [6, 14], [-10, 10]],
    { w: 2.4, tone, seed, hatch: 0.24, gap: 5 });
  c.restore();
};

// 长枪（张清的常规兵器）
Z.zhangqiang = (c, x, y, s, { tone = 0.92, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.14);
  Z.wire(c, [[0, 170], [0, -30]], { w: 4, tone, seed, taper: 0.05 });
  Z.lined(c, [[0, -30], [-11, -70], [0, -132], [11, -70]], { w: 2.8, tone, seed: seed + 1, hatch: 0.2, gap: 6 });
  Z.wire(c, [[-14, -44], [14, -44]], { w: 2.6, tone: tone * 0.88, seed: seed + 2 });
  c.restore();
};

// ============================== 张清本体 ==============================
// o: { spear长枪, bag锦袋, stone飞石, ride骑马, flip, raise, throw投石, down, hurt, tone }
Z.zhangqing = (c, x, y, s, t, o = {}) => {
  const {
    spear = 1, bag = 1, stone = 0, ride = 0, flip = 0, raise = 0,
    down = 0, hurt = 0, tone = 0.92,
  } = o;
  const br = Math.sin(t * 1.45) * 2.4;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  if (down) c.rotate(down * 0.66);
  const ly = -(ride ? 60 : 0);
  const shoulderY = ly - 158;
  const waistY = ly - 80;
  const hipY = ly - 26;

  if (ride) {
    Z.wire(c, [[-32, hipY], [-54, hipY + 28], [-66, hipY + 52]], { w: 4.2, tone, seed: 20, taper: 0.1 });
    Z.wire(c, [[32, hipY], [54, hipY + 28], [66, hipY + 52]], { w: 4.2, tone, seed: 21, taper: 0.1 });
  } else {
    Z.wire(c, [[-32, hipY], [-44, hipY + 44], [-40, ly]], { w: 4.2, tone, seed: 22, taper: 0.1 });
    Z.wire(c, [[32, hipY], [44, hipY + 44], [40, ly]], { w: 4.2, tone, seed: 23, taper: 0.1 });
    Z.lined(c, [[-40, ly], [-62, ly - 4], [-64, ly + 15], [-38, ly + 12]], { w: 2.6, tone: tone * 0.85, seed: 24 });
    Z.lined(c, [[40, ly], [62, ly - 4], [64, ly + 15], [38, ly + 12]], { w: 2.6, tone: tone * 0.85, seed: 25 });
  }

  // 白袍战甲
  const body = [[-56, shoulderY + 6], [-62, waistY + 2], [-50, hipY], [50, hipY], [62, waistY + 2], [56, shoulderY + 6]];
  Z.lined(c, body, { w: 3.4, tone, seed: 30, hatch: 0.16, gap: 9 });
  c.save(); c.fillStyle = 'rgba(236,234,226,.3)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  Z.wire(c, [[-60, waistY + 2], [60, waistY + 2], [60, waistY + 20], [-60, waistY + 20], [-60, waistY + 2]], { w: 3.2, tone, seed: 31, taper: 0.06 });
  for (let i = 0; i < 4; i++) Z.wire(c, [[-52, shoulderY + 28 + i * 22], [52, shoulderY + 28 + i * 22]], { w: 1.8, tone: tone * 0.5, seed: 32 + i });
  Z.lined(c, [[-56, shoulderY + 6], [-78, shoulderY + 24], [-68, shoulderY + 52]], { w: 2.8, tone: tone * 0.9, seed: 37, hatch: 0.14 });
  Z.lined(c, [[56, shoulderY + 6], [78, shoulderY + 24], [68, shoulderY + 52]], { w: 2.8, tone: tone * 0.9, seed: 38, hatch: 0.14 });
  c.save(); c.fillStyle = 'rgba(26,26,28,.68)'; c.font = '27px "LXGWWenKai-500"';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('没羽', 0, shoulderY + 44); c.restore();

  // 双臂：右手投石，左手握枪
  const handY = shoulderY + 54 - raise * 42;
  const thr = raise;
  Z.wire(c, [[-56, shoulderY + 12], [-88, shoulderY + 40], [-82, handY + 8]], { w: 3.8, tone, seed: 40, taper: 0.1 });
  Z.wire(c, [[56, shoulderY + 12], [90 - thr * 30, shoulderY + 30 - thr * 34], [86 - thr * 46, handY - thr * 40]], { w: 3.8, tone, seed: 41, taper: 0.1 });
  Z.lined(c, [[-82, handY + 4], [-68, handY + 20], [-56, handY + 6], [-66, handY - 8]], { w: 2.2, tone: tone * 0.85, seed: 42 });
  Z.lined(c, [[86 - thr * 46, handY - thr * 40], [72 - thr * 40, handY + 8 - thr * 34], [60 - thr * 34, handY - 6 - thr * 40]], { w: 2.2, tone: tone * 0.85, seed: 43 });

  // 头（白面长身 + 抹额盔）
  const hy = shoulderY - 40 + br * 0.5;
  const face = [[-22, hy - 12], [-20, hy - 38], [0, hy - 50], [20, hy - 38], [22, hy - 12], [20, hy + 12], [0, hy + 24], [-20, hy + 10]];
  Z.lined(c, face, { w: 2.6, tone: tone * 0.95, seed: 100, hatch: 0.06, gap: 9 });
  Z.wire(c, [[-15, hy - 17], [-6, hy - 23], [-2, hy - 20]], { w: 2.2, tone, seed: 101 });
  Z.wire(c, [[2, hy - 20], [6, hy - 23], [15, hy - 17]], { w: 2.2, tone, seed: 102 });
  Z.wire(c, [[-11, hy - 6], [-4, hy - 5]], { w: 2, tone, seed: 103 });
  Z.wire(c, [[4, hy - 5], [11, hy - 6]], { w: 2, tone, seed: 104 });
  Z.wire(c, [[-5, hy + 6], [5, hy + 5]], { w: 2, tone: tone * 0.8, seed: 105 });
  Z.wire(c, [[-26, hy - 20], [-22, hy - 48], [22, hy - 48], [26, hy - 20]], { w: 2.8, tone: 0.92, seed: 130 });
  Z.wire(c, [[-22, hy - 48], [-13, hy - 70], [13, hy - 70], [22, hy - 48]], { w: 3, tone: 0.92, seed: 131 });
  Z.wire(c, [[-26, hy - 20], [26, hy - 20]], { w: 2, tone: 0.7, seed: 132 });
  if (hurt) {
    c.save(); c.globalAlpha = hurt * 0.8; c.fillStyle = 'rgba(183,51,46,.4)';
    c.beginPath(); c.ellipse(0, shoulderY + 18, 38, 24, 0.3, 0, 7); c.fill(); c.restore();
  }

  // 手持 / 腰间（必须在 restore 之前）
  if (bag) Z.jindai(c, -62, waistY + 26, 0.86, t, { tone: tone * 0.92, seed: 170 });
  if (spear) Z.zhangqiang(c, 88 - thr * 46, handY + 10 - thr * 40, 1.1, { tone, seed: 176 });
  if (stone) {
    const fly = clamp(stone);
    Z.feishi(c, 96 + fly * 620, handY - 120 - Math.sin(fly * 3.14) * 90, 0.9, { tone: 0.94, seed: 180, tail: 1 });
  }
  c.restore();
};

// ============================== 九幕 ==============================

// ① 虎骑出身：彰德府人，飞石百发百中
SCENES['zq1_chushen'] = (() => {
  const p = () => Z.paper('zq1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 460, y: 170, s: 1.1, seed: 4, tone: 0.3 });
      Z.ground(c, 900, { seed: 5, tone: 0.4 });
      Z.guan(c, 1520, 780, 0.92, { tone: 0.86, seed: 6, text: '彰德府' });
      Z.flag(c, 620, 590, 168, t, { text: '张', seed: 7, size: 32 });
      Z.zhangqing(c, 940, 892, 1.56, t, { raise: clamp(Math.sin(t * 1.4) * 0.2 + 0.3) });
      // 靶（三石皆中）
      Z.wire(c, [[1500, 700], [1500, 860]], { w: 3, tone: 0.8, seed: 8 });
      for (let i = 0; i < 3; i++) {
        Z.wire(c, [[1448 + i * 12, 736 + i * 26], [1560 + i * 10, 726 + i * 24]], { w: 2, tone: 0.7, seed: 9 + i });
        Z.feishi(c, 1504 + i * 8, 748 + i * 24 + Math.sin(t * 2 + i) * 2, 0.7, { tone: 0.9, seed: 12 + i });
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 52 + i * 205) % 1980) - 30, by = 300 + ((t * 38 + i * 150) % 460);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.34, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '没羽箭', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 飞石绝技：不用弓箭，一石了账
SCENES['zq2_feishi'] = (() => {
  const p = () => Z.paper('zq2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 530, amp: 180, tone: 0.3, seed: 11 }]);
      Z.ground(c, 900, { seed: 12, tone: 0.44 });
      Z.zhanma(c, 760, 920, 1.0, t, { tone: 0.84, seed: 13, gait: 1 });
      const thr = clamp(ss(0.4, 1.4, lt));
      Z.zhangqing(c, 772, 856, 1.0, t, { ride: 1, raise: 0.5, spear: 1 });
      Z.feishi(c, lerp(900, 1500, thr), lerp(660, 700, thr), 1.0, { tone: 0.94, seed: 14, tail: 1 });
      for (let i = 0; i < 12; i++) {
        const sx = ((t * 240 + i * 150) % 2000) - 100, sy = 560 + ((i * 137) % 340);
        Z.wire(c, [[sx, sy], [sx + 44, sy + 3]], { w: 1.7, tone: 0.28, seed: 1962 + i, taper: 1.0 });
      }
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('手不弯弓，一石了账', 1100, 320);
        c.restore();
      }
    });
    Z.bigText(c, '飞石绝技', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 连打十五将：东昌府一战，梁山十五员大将尽被他打翻
SCENES['zq3_shiwu'] = (() => {
  const p = () => Z.paper('zq3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 170, tone: 0.3, seed: 21 }]);
      Z.ground(c, 900, { seed: 22, tone: 0.44 });
      Z.guan(c, 1560, 790, 0.88, { tone: 0.84, seed: 23, text: '东昌府' });
      Z.flag(c, 340, 560, 190, t, { text: '梁山', seed: 24, size: 30 });
      Z.zhangqing(c, 1240, 892, 1.52, t, { raise: clamp(ss(0.3, 1.4, lt)), stone: clamp(ss(0.5, 1.8, lt)) });
      // 被打翻的梁山将领（倒地，低 tone）
      const ko = clamp(ss(0.6, 2.0, lt));
      for (let i = 0; i < 5; i++) {
        const bx = 380 + i * 130;
        c.save(); c.translate(bx, 892); c.rotate(ko * 0.5 * (i % 2 ? 1 : -1)); c.translate(-bx, -892);
        Z.fighter(c, bx, 892, 0.74, t, { flip: i % 2, blade: 1, tone: 0.5, seed: 25 + i });
        c.restore();
      }
      for (let i = 0; i < 4; i++) Z.feishi(c, 620 + i * 180, 820 + Math.sin(t * 2 + i) * 6, 0.8, { tone: 0.9, seed: 30 + i });
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('连打梁山一十五员大将', 940, 300);
        c.restore();
      }
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 112 + i * 168) % 1500) + 300, dy = 840 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.36, seed: 1974 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '连打十五将', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 归顺梁山：吴用设计，被逼上水泊
SCENES['zq4_guishun'] = (() => {
  const p = () => Z.paper('zq4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 31, tone: 0.42 });
      Z.wire(c, [[1100, 900], [1100, 500], [1820, 500], [1820, 900]], { w: 3.6, tone: 0.88, seed: 32 });
      Z.roof(c, 1460, 500, 760, 156, { tone: 0.9, seed: 33 });
      Z.hatchBox(c, [[1100, 900], [1820, 900], [1820, 500], [1100, 500]], { ang: -1.35, gap: 22, tone: 0.1, seed: 34 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.66)'; c.font = '32px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('忠义堂', 1460, 736); c.restore();
      Z.songjiang(c, 1240, 892, 1.42, t, { official: 1, raise: clamp(Math.sin(t * 1.2) * 0.16 + 0.26) });
      Z.zhangqing(c, 800, 892, 1.5, t, { kneel: 0, raise: clamp(ss(0.4, 1.5, lt)) * 0.4, spear: 0 });
      Z.zhangqiang(c, 1020, 878, 0.96, { tone: 0.8, seed: 178 });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 320 + ((t * 34 + i * 150) % 430);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1916 + i, taper: 0.6 });
      }
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('吴用设计，张清也上梁山', 900, 300);
        c.restore();
      }
    });
    Z.bigText(c, '归顺梁山', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 骠骑先锋：八骠骑兼先锋使，阵前先登
SCENES['zq5_piaoqi'] = (() => {
  const p = () => Z.paper('zq5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 200, tone: 0.32, seed: 41 }, { y0: 660, amp: 110, tone: 0.22, seed: 42 }]);
      Z.ground(c, 900, { seed: 43, tone: 0.44 });
      Z.flag(c, 1600, 500, 200, t, { text: '宋', seed: 44, size: 32 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1420 + i * 130, 892, 0.94, t, { flip: 1, blade: 1, tone: 0.7, seed: 45 + i });
      const charge = clamp(ss(0.2, 1.6, lt));
      Z.zhanma(c, lerp(500, 780, charge), 920, 1.0, t, { tone: 0.84, seed: 46, gait: 1 });
      Z.zhangqing(c, lerp(512, 792, charge), 856, 1.0, t, { ride: 1, raise: charge, stone: charge });
      for (let i = 0; i < 6; i++) {
        const a = -1.2 + i * 0.32 + Math.sin(t * 4.5) * 0.1;
        Z.wire(c, [[850, 690], [850 + Math.cos(a) * 78, 690 + Math.sin(a) * 78]], { w: 2.4, tone: 0.5, seed: 1950 + i, taper: 0.8 });
      }
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 112 + i * 165) % 1500) + 280, dy = 830 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1990 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '骠骑先锋', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑥ 娶琼英：田虎之役，与琼英结为夫妇（百二十回本）
SCENES['zq6_qiongying'] = (() => {
  const p = () => Z.paper('zq6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 51, tone: 0.42 });
      Z.tent(c, 1560, 820, 0.9, { tone: 0.8, seed: 52, text: '大营' });
      Z.flag(c, 380, 560, 190, t, { text: '宋', seed: 53, size: 30 });
      Z.zhangqing(c, 1080, 892, 1.48, t, { raise: clamp(ss(0.4, 1.5, lt)) * 0.4, spear: 0 });
      Z.husanniang(c, 760, 892, 1.4, t, { blades: 1, cape: 1, raise: 0.2, tone: 0.84 });
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('田虎之役，与琼英结为夫妇', 940, 320);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 48 + i * 210) % 1960) - 30, by = 320 + ((t * 32 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1918 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '结缡琼英', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 破辽征腊：北征大辽，南下江南
SCENES['zq7_zhengla'] = (() => {
  const p = () => Z.paper('zq7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 480, amp: 220, tone: 0.32, seed: 61 }, { y0: 650, amp: 120, tone: 0.24, seed: 62 }]);
      Z.cloud(c, t, { x: 400, y: 170, s: 1.2, seed: 63, tone: 0.3 });
      Z.ground(c, 900, { seed: 64, tone: 0.44 });
      Z.guan(c, 1560, 800, 0.86, { tone: 0.8, seed: 65, text: '江南' });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1400 + i * 130, 892, 0.9, t, { flip: 1, spear: 1, tone: 0.68, seed: 66 + i });
      Z.zhanma(c, 780, 920, 1.0, t, { tone: 0.84, seed: 67, gait: 1 });
      Z.zhangqing(c, 792, 856, 1.0, t, { ride: 1, raise: clamp(Math.sin(t * 2.6) * 0.3 + 0.5), stone: clamp(ss(0.4, 1.6, lt)) });
      for (let i = 0; i < 8; i++) {
        const dx = 900 + ((t * 124 + i * 150) % 520), dy = 760 + (i % 3) * 46;
        Z.wire(c, [[dx, dy], [dx + 26, dy - 12]], { w: 2, tone: 0.44, seed: 1966 + i, taper: 0.8 });
      }
    });
    Z.bigText(c, '破辽征腊', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 独松关：步战被厉天闰刺中，力竭而死（朱砂血光，克制）
SCENES['zq8_dusong'] = (() => {
  const p = () => Z.paper('zq8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 470, amp: 230, tone: 0.34, seed: 71 }, { y0: 640, amp: 130, tone: 0.24, seed: 72 }]);
      Z.cloud(c, t, { x: 500, y: 170, s: 1.15, seed: 73, tone: 0.3 });
      Z.ground(c, 900, { seed: 74, tone: 0.44 });
      Z.guan(c, 1580, 780, 0.9, { tone: 0.8, seed: 75, text: '独松关' });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1420 + i * 130, 892, 0.9, t, { flip: 1, spear: 1, tone: 0.7, seed: 76 + i });
      const fall = clamp(ss(1.2, 2.8, lt));
      c.save(); c.translate(820, 892); c.rotate(fall * 0.58); c.translate(-820, -892);
      Z.zhangqing(c, 820, 892 + fall * 24, 1.5, t, { raise: 0.3 - fall * 0.2, hurt: fall, spear: 1 });
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
        c.fillText('独松关下，力战而亡', 1400, 330);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 44 + i * 210) % 1960) - 30, by = 320 + ((t * 30 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1991 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '独松关', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑨ 身后：妻琼英守节，子张节抗金（朱砂钤印）
SCENES['zq9_shenhou'] = (() => {
  const p = () => Z.paper('zq9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 200, tone: 0.3, seed: 81 }, { y0: 660, amp: 110, tone: 0.2, seed: 82 }]);
      Z.cloud(c, t, { x: 480, y: 180, s: 1.2, seed: 83, tone: 0.3 });
      Z.ground(c, 900, { seed: 84, tone: 0.4 });
      Z.pine(c, t, { x: 1560, y: 892, s: 1.0, seed: 85, tone: 0.8 });
      // 碑（不写人物，只留碑形）
      Z.wire(c, [[880, 892], [880, 660], [1030, 640], [1030, 892]], { w: 3.4, tone: 0.86, seed: 86 });
      Z.hatchBox(c, [[880, 892], [1030, 892], [1030, 656], [880, 676]], { ang: -1.3, gap: 18, tone: 0.1, seed: 87 });
      Z.jindai(c, 1300, 760, 1.0, t, { tone: 0.84, seed: 88 });
      Z.feishi(c, 1420, 880, 1.1, { tone: 0.9, seed: 89 });
      Z.feishi(c, 1500, 900, 0.9, { tone: 0.86, seed: 90 });
      if (lt > 2.0) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(2.0, 3.0, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('子张节随吴玠抗金，得保其家', 620, 330);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 44 + i * 210) % 1960) - 30, by = 320 + ((t * 30 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1992 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '一石留名', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '没羽箭', clamp(ss(0.9, 2.6, lt)), { size: 28 });
  } };
})();
})();
