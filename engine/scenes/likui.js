// 《水浒传·李逵》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：沂州百丈村人，黑凛凛一条大汉，鬓发蓬松、虬髯满面，使两把夹钢板斧，绰号「黑旋风」。
//   特征：① 双板斧（signature 兵器）② 黑凛凛（通身焦墨重笔）③ 虬髯乱发 ④ 莽（动势最大）。
// 唯一的彩：朱砂只用于① 第三幕沂岭杀四虎的血光 ② 第八幕宋江赐下的毒酒 ③ 第八幕「黑旋风」钤印——余皆黑白灰。
// 母题：① 板斧 ② 焦墨重笔 ③ 虬髯 ④ 毒酒（末幕）。
// 弧光：江州牢城小牢子 → 劫法场抡斧救人 → 沂岭杀四虎（母亡） → 元夜闹东京 →
//       扯诏骂钦差 → 征方腊冲锋 → 宋江赐毒酒，甘心同死。
// 依《水浒传》第三十八、四十、四十三、七十二、七十五、百二十回末（百回本第一百二十回）。
// 互文：第二幕复用宋江（劫法场）、第八幕复用宋江（赐毒酒）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 板斧（signature：夹钢板斧——短柄 + 扇形单刃 + 斧脑方孔）
Z.axe = (c, x, y, s, { tone = 0.94, seed = 1, mir = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s * mir, s);
  Z.wire(c, [[0, 84], [0, -48]], { w: 5, tone, seed, taper: 0.06 });              // 柄（加长）
  const blade = [[-6, -50], [-66, -86], [-78, -42], [-44, -16], [-6, -24]];       // 扇形刃（放大）
  c.save(); c.fillStyle = 'rgba(26,26,28,.30)';                                   // 斧刃深墨块（醒目）
  c.beginPath(); blade.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  Z.lined(c, blade, { w: 4, tone, seed: seed + 1, hatch: 0.16, gap: 7 });
  Z.wire(c, [[-6, -50], [16, -50], [16, -20], [-6, -20]], { w: 3.2, tone, seed: seed + 2 });  // 斧脑
  Z.wire(c, [[0, -52], [0, -18]], { w: 2.6, tone: tone * 0.8, seed: seed + 3 });
  for (let i = 0; i < 3; i++) Z.wire(c, [[-70 + i * 6, -78 + i * 8], [-58 + i * 6, -70 + i * 8]], { w: 1.6, tone: tone * 0.7, seed: seed + 10 + i });
  c.restore();
};

// 血光（朱砂：焦墨片里唯一可用的"血"——弧线笔触 + 密集点簇 + 大块飞溅）
Z.blood = (c, x, y, s, k, { seed = 1 } = {}) => {
  if (k <= 0.01) return;
  c.save(); c.translate(x, y); c.scale(s, s);
  c.save(); c.globalAlpha = 0.52 + 0.34 * k;
  Z.wire(c, [[-38, 24], [22, -12], [76, 22]], { w: 6, tone: 0.52, seed, taper: 0.86, amp: 0.5 });
  Z.wire(c, [[-16, 10], [46, -8]], { w: 3.6, tone: 0.4, seed: seed + 1, taper: 0.6 });
  c.restore();
  c.save(); c.globalAlpha = 0.66 + 0.32 * k; c.lineCap = 'round';
  c.strokeStyle = 'rgba(183,51,46,.72)'; c.lineWidth = 5;
  c.beginPath(); c.moveTo(10, 16); c.quadraticCurveTo(48, -30, 96, -54); c.stroke();
  c.strokeStyle = 'rgba(183,51,46,.55)'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(18, 26); c.quadraticCurveTo(56, -8, 102, -24); c.stroke();
  c.restore();
  c.save(); c.globalAlpha = 0.7 + 0.3 * k; c.fillStyle = 'rgba(183,51,46,.72)';
  const burst = [[14, 10, 12], [26, 2, 10], [36, 20, 11], [4, 22, 8], [28, 34, 7],
                 [44, 8, 9], [10, -6, 7], [54, 24, 8], [38, 38, 6], [-2, 12, 7],
                 [62, 14, 6], [48, -2, 5], [20, 40, 5], [68, 32, 5]];
  for (const [dx, dy, r] of burst) c.fillRect(dx - r / 2, dy - r / 2, r, r);
  c.fillStyle = 'rgba(183,51,46,.62)';
  c.fillRect(24, 12, 15, 15); c.fillRect(58, 26, 11, 11);
  c.restore();
  c.restore();
};

// ============================== 李逵本体 ==============================
// o: { axe双板斧, bare赤膊, beard虬髯, flip, raise, kneel, rage暴怒, hurt, drink, tone }
Z.likui = (c, x, y, s, t, o = {}) => {
  const {
    axe = 1, bare = 1, beard = 1, flip = 0, raise = 0, kneel = 0,
    rage = 0, hurt = 0, drink = 0, tone = 0.98,
  } = o;
  const br = Math.sin(t * 1.9 + rage * 2) * (2.4 + rage * 2.2);
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 48 : 0);
  const shoulderY = ly - 156;
  const waistY = ly - 78;
  const hipY = ly - 26;

  // ---- 腿（粗壮，跨立）----
  Z.wire(c, [[-30, hipY], [-48, hipY + 46], [-44, ly]], { w: 4.4, tone, seed: 60, taper: 0.1 });
  Z.wire(c, [[30, hipY], [48, hipY + 46], [44, ly]], { w: 4.4, tone, seed: 61, taper: 0.1 });
  Z.lined(c, [[-44, ly], [-62, ly - 4], [-64, ly + 14], [-42, ly + 11]], { w: 2.8, tone: tone * 0.9, seed: 62 });
  Z.lined(c, [[44, ly], [62, ly - 4], [64, ly + 14], [42, ly + 11]], { w: 2.8, tone: tone * 0.9, seed: 63 });

  // ---- 躯干（黑凛凛：宽肩厚背，焦墨重笔）----
  const body = [[-64, shoulderY + 4], [-72, waistY + 4], [-58, hipY], [58, hipY], [72, waistY + 4], [64, shoulderY + 4]];
  Z.lined(c, body, { w: 4.2, tone, seed: 71, hatch: 0.26, gap: 8, hatchAng: -0.85 });
  c.save(); c.fillStyle = 'rgba(26,26,28,.20)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  // 赤膊：胸腹肌肉（两道横弧）
  if (bare) {
    Z.wire(c, [[-34, shoulderY + 46], [0, shoulderY + 58], [34, shoulderY + 46]], { w: 2.6, tone: tone * 0.85, seed: 72 });
    Z.wire(c, [[-26, waistY - 6], [0, waistY + 4], [26, waistY - 6]], { w: 2.2, tone: tone * 0.8, seed: 73 });
  } else {
    Z.wire(c, [[-64, shoulderY + 4], [-52, waistY + 6], [-56, hipY]], { w: 3, tone: tone * 0.9, seed: 74 });
    Z.wire(c, [[64, shoulderY + 4], [52, waistY + 6], [56, hipY]], { w: 3, tone: tone * 0.9, seed: 75 });
  }
  // 束带（粗）
  Z.wire(c, [[-70, waistY], [70, waistY], [70, waistY + 20], [-70, waistY + 20], [-70, waistY]], { w: 3.6, tone, seed: 76, taper: 0.06 });

  // ---- 双臂（粗壮，抡斧）----
  const swing = Math.sin(t * 2.6 + rage * 3) * (0.1 + rage * 0.24);
  const handY = shoulderY + 52 - raise * 46;
  Z.wire(c, [[-64, shoulderY + 14], [-96, shoulderY + 40 + swing * 40], [-86, handY + swing * 30]], { w: 4.4, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[64, shoulderY + 14], [96, shoulderY + 36 - swing * 40], [86, handY - raise * 22 - swing * 30]], { w: 4.4, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[-86, handY], [-72, handY + 22], [-60, handY + 6], [-74, handY - 14]], { w: 2.8, tone: tone * 0.9, seed: 82 });
  Z.lined(c, [[86, handY - 8], [72, handY + 12], [60, handY - 4], [74, handY - 22]], { w: 2.8, tone: tone * 0.9, seed: 83 });

  // ---- 头（蓬头虬髯）----
  const hy = shoulderY - 40 + br * 0.5;
  const face = [[-26, hy - 14], [-22, hy - 40], [0, hy - 52], [22, hy - 40], [26, hy - 14], [24, hy + 14], [0, hy + 28], [-24, hy + 12]];
  Z.lined(c, face, { w: 3.4, tone, seed: 100, hatch: 0.16, gap: 8 });
  c.save(); c.fillStyle = 'rgba(26,26,28,.14)';
  c.beginPath(); face.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  // 环眼浓眉（怒）
  Z.wire(c, [[-18, hy - 16], [-4, hy - 12]], { w: 3.2, tone, seed: 101 });
  Z.wire(c, [[4, hy - 12], [18, hy - 16]], { w: 3.2, tone, seed: 102 });
  Z.wire(c, [[-12, hy - 8], [-6, hy - 6]], { w: 2.4, tone, seed: 103 });
  Z.wire(c, [[6, hy - 6], [12, hy - 8]], { w: 2.4, tone, seed: 104 });
  Z.wire(c, [[-10, hy + 8], [10, hy + 6]], { w: 2.6, tone: tone * 0.9, seed: 105 });   // 阔口
  // 虬髯（乱须，signature）
  if (beard) {
    for (let i = 0; i < 9; i++) {
      const bx = -20 + i * 5, wob = Math.sin(t * 2.4 + i * 0.9) * 3;
      Z.wire(c, [[bx, hy + 14], [bx - 3 + wob, hy + 30 + (i % 3) * 8]], { w: 2, tone: tone * 0.92, seed: 110 + i, taper: 0.4 });
    }
    Z.wire(c, [[-14, hy + 2], [14, hy + 2]], { w: 2.4, tone: tone * 0.85, seed: 120 });   // 髭
  }
  // 蓬乱发（signature：鬓发蓬松）
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI + i * (Math.PI / 10), wob = Math.sin(t * 2.8 + i) * 0.14;
    const r0 = 30, r1 = 46 + (i % 3) * 7;
    Z.wire(c, [[Math.cos(a) * r0, hy - 18 + Math.sin(a) * r0 * 0.8],
               [Math.cos(a + wob) * r1, hy - 18 + Math.sin(a + wob) * r1 * 0.8]],
      { w: 2.4, tone: tone * 0.95, seed: 130 + i, taper: 0.5 });
  }
  // ---- 双板斧（左右各一；必须在 restore 前画，坐标系仍在人物本地）----
  if (axe) {
    Z.axe(c, -100, handY + 30, 1.28, { tone, seed: 170, mir: 1 });
    Z.axe(c, 100, handY + 14, 1.28, { tone, seed: 171, mir: -1 });
  }
  // ---- 毒酒盏（末幕：朱砂）----
  if (drink > 0.02) {
    c.save(); c.globalAlpha = 0.7 + 0.3 * drink;
    Z.lined(c, [[16, handY - 4], [52, handY - 4], [48, handY + 22], [20, handY + 22]], { w: 2.8, tone: 0.86, seed: 180 });
    if (drink > 0.5) {
      c.fillStyle = 'rgba(183,51,46,.82)';
      c.fillRect(22, handY - 1, 24, 8);
    }
    c.restore();
  }
  c.restore();
};

// ============================== 八幕 ==============================

// ① 江州牢城：小牢子李逵，结识宋江（复用宋江）
SCENES['lk1_jiangzhou'] = (() => {
  const p = () => Z.paper('lk1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.wire(c, [[1180, 900], [1180, 560], [1740, 560], [1740, 900]], { w: 3.6, tone: 0.88, seed: 12 });   // 牢城营
      Z.hatchBox(c, [[1180, 900], [1740, 900], [1740, 560], [1180, 560]], { ang: -1.4, gap: 20, tone: 0.1, seed: 13 });
      Z.roof(c, 1460, 560, 620, 130, { tone: 0.9, seed: 14 });
      Z.wire(c, [[1300, 900], [1300, 700], [1390, 700], [1390, 900]], { w: 3, tone: 0.86, seed: 15 });   // 牢门
      for (let i = 0; i < 5; i++) Z.wire(c, [[1300 + i * 22, 700], [1300 + i * 22, 900]], { w: 2.2, tone: 0.8, seed: 16 + i });
      Z.cloud(c, t, { x: 400, y: 180, s: 1.0, seed: 17, tone: 0.3 });
      Z.songjiang(c, 760, 892, 1.44, t, { official: 1, raise: clamp(Math.sin(t * 1.2) * 0.18 + 0.2) });
      Z.likui(c, 1160, 892, 1.5, t, { axe: 1, rage: 0.15, raise: clamp(Math.sin(t * 1.6) * 0.2 + 0.2) });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 50 + i * 240) % 1980) - 30, by = 340 + ((t * 38 + i * 160) % 480);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.38, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '江州牢城', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 劫法场：抡起板斧，跳楼砍翻刽子手（复用宋江）
SCENES['lk2_fachang'] = (() => {
  const p = () => Z.paper('lk2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 2.8)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 21, tone: 0.42 });
      Z.cloud(c, t, { x: 1560, y: 180, s: 1.1, seed: 22, tone: 0.32 });
      // 法场：十字桩 + 围观
      Z.wire(c, [[820, 892], [820, 700]], { w: 4.4, tone: 0.9, seed: 23, taper: 0.06 });
      Z.wire(c, [[760, 720], [880, 720]], { w: 3.6, tone: 0.88, seed: 24 });
      Z.songjiang(c, 820, 892, 1.4, t, { official: 0, cangue: 1, hurt: 0.2, tone: 0.84 });
      for (let i = 0; i < 4; i++) Z.fighter(c, 300 + i * 130, 900, 0.66, t, { seed: 30 + i, tone: 0.55 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1380 + i * 130, 900, 0.66, t, { flip: 1, seed: 34 + i, tone: 0.55 });
      // 李逵（自左侧抡斧扑入）
      const rush = clamp(ss(0.2, 1.4, lt));
      const px = lerp(420, 660, rush);
      Z.likui(c, px, 892, 1.54, t, { axe: 1, rage: 0.9, raise: rush });
      // 斧风（动势线）
      for (let i = 0; i < 6; i++) {
        const a = -1.2 + i * 0.3 + Math.sin(t * 4) * 0.08;
        Z.wire(c, [[px + 120, 700], [px + 120 + Math.cos(a) * 70, 700 + Math.sin(a) * 70]],
          { w: 2.2, tone: 0.55, seed: 1910 + i, taper: 0.8 });
      }
    });
    Z.bigText(c, '抡斧劫法场', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ③ 沂岭杀四虎：母亲被虎吞，李逵怒杀四虎（朱砂：血光）
SCENES['lk3_yiling'] = (() => {
  const p = () => Z.paper('lk3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 220, tone: 0.36, seed: 41 }, { y0: 660, amp: 120, tone: 0.26, seed: 42 }]);
      Z.ground(c, 900, { seed: 43, tone: 0.44 });
      Z.pine(c, t, { x: 320, y: 890, s: 1.1, seed: 44, tone: 0.86 });
      Z.pine(c, t, { x: 1700, y: 890, s: 0.95, seed: 45, tone: 0.8 });
      // 四虎（简笔虎形：身 + 头 + 尾 + 斑纹排线）
      const tiger = (tx, ty, ss2, flip2, dead) => {
        c.save(); c.translate(tx, ty); c.scale(flip2 ? -ss2 : ss2, ss2);
        Z.lined(c, [[-90, 0], [-40, -42], [40, -46], [86, -18], [80, 22], [30, 34], [-60, 30]],
          { w: 3.2, tone: 0.86, seed: 50, hatch: 0.16, gap: 9 });
        Z.lined(c, [[-90, -6], [-124, -22], [-136, -4], [-112, 16], [-88, 18]],
          { w: 3, tone: 0.88, seed: 51, hatch: 0.1 });
        Z.wire(c, [[-134, -10], [-142, -24]], { w: 2, tone: 0.85, seed: 52 });
        Z.wire(c, [[-118, 2], [-110, 8]], { w: 1.6, tone: 0.8, seed: 53 });
        Z.wire(c, [[86, 4], [128, -14], [138, -34]], { w: 2.8, tone: 0.84, seed: 54, taper: 0.2 });
        for (let i = 0; i < 5; i++) Z.wire(c, [[-50 + i * 26, -30], [-44 + i * 26, -12]], { w: 2, tone: 0.7, seed: 60 + i });
        for (const lx of [-56, -16, 30, 66]) Z.wire(c, [[lx, 28], [lx - 4, 52]], { w: 2.6, tone: 0.84, seed: 70 });
        if (dead) { c.save(); c.globalAlpha = .5; c.fillStyle = 'rgba(26,26,28,.4)'; c.fillRect(-60, 6, 40, 22); c.restore(); }
        c.restore();
      };
      const kill = clamp(ss(1.2, 2.4, lt));
      tiger(1420, 780, 1.0, 1, kill > 0.4);
      tiger(1560, 830, 0.86, 1, kill > 0.7);
      tiger(1180, 850, 0.78, 0, kill > 0.9);
      // 李逵（怒，抡斧）
      Z.likui(c, 780, 892, 1.56, t, { axe: 1, rage: 1.0, raise: clamp(ss(0.4, 1.6, lt)) });
      // 朱砂血光（本片第一处朱砂）
      if (kill > 0.2) Z.blood(c, 1400, 760, 1.0, clamp((kill - 0.2) / 0.8), { seed: 2200 });
    });
    Z.bigText(c, '沂岭杀四虎', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 元夜闹东京：李师师家放火闹事，扯碎御书
SCENES['lk4_yuanxiao'] = (() => {
  const p = () => Z.paper('lk4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 81, tone: 0.4 });
      // 樊楼（与燕青片互文）
      Z.wire(c, [[1120, 900], [1120, 560], [1720, 560], [1720, 900]], { w: 3.4, tone: 0.86, seed: 82 });
      Z.roof(c, 1420, 560, 640, 140, { tone: 0.9, seed: 83 });
      Z.hatchBox(c, [[1120, 900], [1720, 900], [1720, 560], [1120, 560]], { ang: -1.4, gap: 22, tone: 0.1, seed: 84 });
      // 灯火（活气：元夜灯）
      for (let i = 0; i < 5; i++) {
        const lx = 1240 + i * 110, sw = Math.sin(t * 1.8 + i) * 6;
        Z.lined(c, [[lx - 16, 620 + sw], [lx + 16, 620 + sw], [lx + 20, 680 + sw], [lx - 20, 680 + sw]],
          { w: 2.2, tone: 0.7, seed: 85 + i });
        Z.flame(c, lx, 646 + sw, 0.34, t, { seed: 90 + i, tone: 0.55 });
      }
      // 李逵（闹，抡斧）
      Z.likui(c, 700, 892, 1.54, t, { axe: 1, rage: 1.0, raise: clamp(ss(0.3, 1.4, lt)) });
      // 扯碎的纸片飞舞（活气）
      for (let i = 0; i < 10; i++) {
        const px = 900 + ((t * 90 + i * 190) % 800), py = 420 + ((t * 70 + i * 130) % 420);
        Z.wire(c, [[px, py], [px + 16, py + 5], [px + 12, py + 18], [px - 4, py + 12]],
          { w: 1.6, tone: 0.45, seed: 1920 + i });
      }
    });
    Z.bigText(c, '元夜闹东京', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 扯诏骂钦差：一斧砍翻招安诏书
SCENES['lk5_chezhao'] = (() => {
  const p = () => Z.paper('lk5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 101, tone: 0.42 });
      Z.cloud(c, t, { x: 380, y: 190, s: 1.0, seed: 102, tone: 0.3 });
      Z.shanzhai(c, 1560, 700, 0.9, { tone: 0.76, seed: 103, text: '梁山' });
      // 钦差与随从（右）
      Z.fighter(c, 1560, 892, 1.06, t, { flip: 1, tone: 0.8, seed: 110 });
      Z.fighter(c, 1340, 892, 0.98, t, { flip: 1, tone: 0.75, seed: 111 });
      // 诏书（轴卷）
      const tear = clamp(ss(1.0, 2.2, lt));
      c.save(); c.translate(1120, 700); c.rotate(tear * 0.5);
      Z.lined(c, [[-120, -40], [120, -36], [120, 40], [-120, 36]], { w: 3, tone: 0.86, seed: 120, hatch: 0.1 });
      Z.wire(c, [[-120, -40], [-120, 36]], { w: 4, tone: 0.88, seed: 121 });
      c.fillStyle = 'rgba(26,26,28,.7)'; c.font = '30px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('招', -40, 0); c.fillText('安', 40, 0);
      c.restore();
      // 李逵（左，怒扯）
      Z.likui(c, 660, 892, 1.56, t, { axe: 1, rage: 1.0, raise: clamp(ss(0.2, 1.2, lt)) });
      if (tear > 0.3) {
        for (let i = 0; i < 8; i++) {
          const px = 1180 + ((t * 100 + i * 160) % 620), py = 480 + ((t * 80 + i * 140) % 380);
          Z.wire(c, [[px, py], [px + 18, py + 6], [px + 14, py + 20], [px - 4, py + 14]], { w: 1.7, tone: 0.5, seed: 1930 + i });
        }
      }
    });
    Z.bigText(c, '扯诏骂钦差', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 征方腊：随军冲锋，板斧开道
SCENES['lk6_fangla'] = (() => {
  const p = () => Z.paper('lk6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 190, tone: 0.32, seed: 141 }]);
      Z.ground(c, 900, { seed: 142, tone: 0.44 });
      Z.flag(c, 1560, 500, 210, t, { text: '宋', seed: 143, size: 34 });
      Z.tent(c, 300, 800, 0.9, { tone: 0.78, seed: 144, text: '營' });
      // 敌阵（右）
      for (let i = 0; i < 3; i++) Z.fighter(c, 1480 + i * 130, 892, 0.94, t, { flip: 1, blade: 1, tone: 0.72, seed: 150 + i });
      // 李逵（左，冲锋）
      const charge = clamp(ss(0.2, 1.6, lt));
      Z.likui(c, lerp(620, 760, charge), 892, 1.56, t, { axe: 1, rage: 0.95, raise: charge });
      // 战尘（活气）
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 120 + i * 170) % 1500) + 300, dy = 800 + ((t * 40 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 30, dy - 6]], { w: 2, tone: 0.4, seed: 1940 + i, taper: 0.9 });
      }
      // 斧风
      for (let i = 0; i < 5; i++) {
        const a = -1.0 + i * 0.34 + Math.sin(t * 5) * 0.1;
        Z.wire(c, [[780, 700], [780 + Math.cos(a) * 78, 700 + Math.sin(a) * 78]], { w: 2.4, tone: 0.5, seed: 1950 + i, taper: 0.8 });
      }
    });
    Z.bigText(c, '征方腊', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑦ 还朝封赏：授镇江润州都统制（唯一袍带一幕，对比其莽）
SCENES['lk7_huanchao'] = (() => {
  const p = () => Z.paper('lk7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 161, tone: 0.4 });
      Z.wire(c, [[1100, 900], [1100, 480], [1780, 480], [1780, 900]], { w: 3.6, tone: 0.88, seed: 162 });
      Z.roof(c, 1440, 480, 740, 150, { tone: 0.9, seed: 163 });
      Z.hatchBox(c, [[1100, 900], [1780, 900], [1780, 480], [1100, 480]], { ang: -1.35, gap: 22, tone: 0.1, seed: 164 });
      Z.wire(c, [[1280, 900], [1280, 620], [1600, 620], [1600, 900]], { w: 3, tone: 0.84, seed: 165 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.62)'; c.font = '34px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('都統制', 1440, 740); c.restore();
      // 李逵（袍带，仍按斧）
      Z.likui(c, 700, 892, 1.5, t, { axe: 1, bare: 0, rage: 0.2, raise: clamp(Math.sin(t * 1.2) * 0.12 + 0.12) });
      Z.cloud(c, t, { x: 380, y: 200, s: 1.0, seed: 166, tone: 0.3 });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 44 + i * 230) % 1960) - 30, by = 330 + ((t * 34 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.36, seed: 1916 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '授都统制', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 饮毒酒：宋江赐酒，李逵甘心同死（朱砂：毒酒 + 钤印）
SCENES['lk8_dujiu'] = (() => {
  const p = () => Z.paper('lk8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 181, tone: 0.4 });
      Z.cloud(c, t, { x: 420, y: 190, s: 1.1, seed: 182, tone: 0.3 });
      Z.pine(c, t, { x: 1720, y: 890, s: 1.0, seed: 183, tone: 0.82 });
      // 宋江（左，赐酒）
      Z.songjiang(c, 640, 892, 1.46, t, { official: 1, bowl: 1, raise: clamp(ss(0.4, 1.4, lt)) * 0.5, tone: 0.88 });
      // 李逵（右，接盏）
      const drink = clamp(ss(1.2, 2.6, lt));
      Z.likui(c, 1180, 892, 1.52, t, { axe: 0, rage: 0, kneel: 0, drink, raise: 0.3, tone: 0.94 });
      // 朱砂：毒酒（盏中朱砂）与饮下后的血光
      if (drink > 0.75) {
        c.save(); c.globalAlpha = 0.6 + 0.4 * (drink - 0.75) / 0.25;
        c.fillStyle = 'rgba(183,51,46,.7)';
        c.fillRect(1196, 800, 12, 12); c.fillRect(1230, 812, 10, 10); c.fillRect(1180, 826, 8, 8);
        c.restore();
      }
      if (lt > 2.4) {
        c.save(); c.globalAlpha = 0.8 * clamp(ss(2.4, 3.1, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('生时服侍哥哥，死了也只是哥哥部下一个小鬼', 960, 300);
        c.restore();
      }
    });
    Z.bigText(c, '饮下毒酒', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '黑旋风', clamp(ss(1.0, 2.6, lt)), { size: 28 });
  } };
})();
})();
