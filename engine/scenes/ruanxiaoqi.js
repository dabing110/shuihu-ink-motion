// 《水浒传·阮小七》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：济州梁山泊边石碣村人——打鱼为生，斗笠蓑衣、手执渔叉，水里本事了得，
//   心直口快、敢作敢当，绰号「活阎罗」（阮氏三雄之七）。
//   特征：① 斗笠蓑衣（signature 渔民）② 渔叉 ③ 酒葫芦（偷喝御酒）④ 龙袍（末段朱砂）。
// 唯一的彩：朱砂只用于① 第五幕偷喝御酒的酒封 ② 第七幕方腊的龙袍 ③ 第八幕「活阎罗」钤印——余皆黑白灰。
// 母题：① 斗笠蓑衣 ② 渔叉 ③ 酒葫芦 ④ 龙袍。
// 弧光：石碣村打鱼 → 随晁盖劫生辰纲 → 芦苇荡火烧官船 → 梁山泊水军头领 →
//       招安时偷喝御酒 → 征方腊血战 → 穿方腊龙袍戏耍被参 → 削职归村，寿终正寝。
// 依《水浒传》第十五、十六、十九、七十五、九十九回及百回本末回。
// 互文：第一幕复用吴用（说三阮撞筹）、第二幕复用晁盖（黄泥冈）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 斗笠（signature：竹笠——三角侧影 + 顶）
Z.douli = (c, x, y, s, { tone = 0.88, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.lined(c, [[-56, 0], [0, -40], [56, 0], [0, 8]], { w: 3, tone, seed, hatch: 0.14, gap: 8 });
  Z.wire(c, [[-56, 0], [56, 0]], { w: 3.4, tone, seed: seed + 1 });
  Z.wire(c, [[0, -40], [0, -50]], { w: 2.4, tone, seed: seed + 2 });
  c.restore();
};

// 渔叉（signature 兵器：三齿叉 + 长柄）
Z.yucha = (c, x, y, s, { tone = 0.9, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(0.16);
  Z.wire(c, [[0, 130], [0, -110]], { w: 4.2, tone, seed, taper: 0.05 });            // 柄
  Z.wire(c, [[0, -110], [0, -150]], { w: 3, tone, seed: seed + 1, taper: 0.1 });    // 中齿
  Z.wire(c, [[0, -110], [-22, -138]], { w: 2.6, tone, seed: seed + 2, taper: 0.1 });
  Z.wire(c, [[0, -110], [22, -138]], { w: 2.6, tone, seed: seed + 3, taper: 0.1 });
  Z.wire(c, [[-22, -110], [22, -110]], { w: 2.2, tone: tone * 0.8, seed: seed + 4 });
  c.restore();
};

// 酒葫芦（signature：偷喝御酒——葫芦腹 + 塞 + 朱砂酒封）
Z.gourd = (c, x, y, s, { tone = 0.86, seed = 1, cinnabar = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.lined(c, [[-4, -26], [4, -26], [22, -8], [24, 16], [0, 36], [-24, 16], [-22, -8]],
    { w: 3, tone, seed, hatch: 0.1 });
  Z.wire(c, [[-6, -26], [6, -26], [6, -38], [-6, -38], [-6, -26]], { w: 2.6, tone, seed: seed + 1 });   // 口
  if (cinnabar > 0.02) {
    c.save(); c.globalAlpha = 0.72 + 0.28 * cinnabar; c.fillStyle = 'rgba(183,51,46,.8)';
    c.fillRect(-8, -38, 16, 10);
    c.restore();
  }
  c.restore();
};

// 龙袍（第七幕：方腊的赭黄袍——朱砂，版画里唯一的"黄"以朱砂示意）
Z.longpao = (c, x, y, s, q, { seed = 1 } = {}) => {
  if (q <= 0.02) return;
  c.save(); c.translate(x, y); c.scale(s, s);
  c.save(); c.globalAlpha = 0.7 * q;
  Z.lined(c, [[-70, -120], [70, -120], [86, 130], [-86, 130], [-70, -120]], { w: 3.4, tone: 0.8, seed, hatch: 0.1 });
  c.restore();
  c.save(); c.globalAlpha = 0.62 + 0.3 * q; c.fillStyle = 'rgba(183,51,46,.62)';
  c.fillRect(-66, -114, 132, 236);
  c.restore();
  // 团龙（简笔：盘曲 + 鳞排线）
  c.save(); c.globalAlpha = 0.8 * q; c.strokeStyle = 'rgba(26,26,28,.8)'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(-38, -40); c.quadraticCurveTo(20, -70, 34, -20);
  c.quadraticCurveTo(44, 30, -10, 34); c.quadraticCurveTo(-40, 20, -22, -6); c.stroke();
  c.restore();
  c.restore();
};

// ============================== 阮小七本体 ==============================
// o: { hat斗笠, yucha渔叉, gourd葫芦, dragon龙袍, flip, raise, kneel, drink, tone }
Z.ruanqi = (c, x, y, s, t, o = {}) => {
  const {
    hat = 1, yucha = 1, gourd = 0, dragon = 0, flip = 0, raise = 0,
    kneel = 0, drink = 0, tone = 0.92,
  } = o;
  const br = Math.sin(t * 1.7) * 2.4;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 46 : 0);
  const shoulderY = ly - 150;
  const waistY = ly - 76;
  const hipY = ly - 26;

  // ---- 腿（赤足/草鞋，跨立）----
  Z.wire(c, [[-28, hipY], [-44, hipY + 44], [-40, ly]], { w: 3.6, tone, seed: 60, taper: 0.1 });
  Z.wire(c, [[28, hipY], [44, hipY + 44], [40, ly]], { w: 3.6, tone, seed: 61, taper: 0.1 });
  Z.wire(c, [[-40, ly], [-58, ly - 2], [-60, ly + 10], [-38, ly + 8]], { w: 2.4, tone: tone * 0.85, seed: 62 });
  Z.wire(c, [[40, ly], [58, ly - 2], [60, ly + 10], [38, ly + 8]], { w: 2.4, tone: tone * 0.85, seed: 63 });

  // ---- 躯干（短打 + 蓑衣排线）----
  const body = [[-52, shoulderY + 6], [-58, waistY + 4], [-50, hipY], [50, hipY], [58, waistY + 4], [52, shoulderY + 6]];
  Z.lined(c, body, { w: 3.4, tone, seed: 71, hatch: 0.22, gap: 9, hatchAng: -0.95 });  // 蓑衣：排线更密
  Z.wire(c, [[-26, shoulderY + 4], [0, shoulderY + 32], [26, shoulderY + 4]], { w: 2.8, tone: tone * 0.9, seed: 72 });
  Z.wire(c, [[-56, waistY + 2], [56, waistY + 2], [56, waistY + 20], [-56, waistY + 20], [-56, waistY + 2]], { w: 3.2, tone, seed: 73, taper: 0.06 });

  // ---- 龙袍（第七幕：罩在身上，朱砂）----
  if (dragon > 0.02) Z.longpao(c, 0, shoulderY + 60, 1.0, dragon, { seed: 190 });

  // ---- 双臂 ----
  const handY = shoulderY + 52 - raise * 42;
  Z.wire(c, [[-52, shoulderY + 12], [-84, shoulderY + 40], [-74, handY + 6]], { w: 3.6, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[52, shoulderY + 12], [84, shoulderY + 38 - raise * 26], [74, handY - raise * 34]], { w: 3.6, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[-74, handY + 4], [-60, handY + 20], [-50, handY + 6], [-60, handY - 10]], { w: 2.4, tone: tone * 0.85, seed: 82 });
  Z.lined(c, [[74, handY - 6], [60, handY + 10], [50, handY - 4], [60, handY - 20]], { w: 2.4, tone: tone * 0.85, seed: 83 });

  // ---- 头（粗豪渔民：浓眉环眼）----
  const hy = shoulderY - 36 + br * 0.5;
  const face = [[-24, hy - 12], [-21, hy - 36], [0, hy - 47], [21, hy - 36], [24, hy - 12], [22, hy + 14], [0, hy + 27], [-22, hy + 11]];
  Z.lined(c, face, { w: 3, tone, seed: 100, hatch: 0.12, gap: 8 });
  Z.wire(c, [[-16, hy - 14], [-5, hy - 11]], { w: 2.8, tone, seed: 101 });
  Z.wire(c, [[5, hy - 11], [16, hy - 14]], { w: 2.8, tone, seed: 102 });
  Z.wire(c, [[-12, hy - 5], [-5, hy - 4]], { w: 2, tone, seed: 103 });
  Z.wire(c, [[5, hy - 4], [12, hy - 5]], { w: 2, tone, seed: 104 });
  Z.wire(c, [[-9, hy + 7], [9, hy + 6]], { w: 2.4, tone: tone * 0.9, seed: 105 });
  for (let i = 0; i < 7; i++) {  // 短髭
    Z.wire(c, [[-16 + i * 5, hy + 15], [-17 + i * 5, hy + 26]], { w: 1.6, tone: tone * 0.8, seed: 106 + i, taper: 0.4 });
  }
  // 斗笠（signature）
  if (hat) Z.douli(c, 0, hy - 34, 1.05, { tone: 0.9, seed: 110 });

  // ---- 手持件 ----
  if (yucha) Z.yucha(c, 74, handY + 14, 1.0, { tone, seed: 170 });
  if (gourd) Z.gourd(c, -78, handY + 26, 1.0, { tone, seed: 175, cinnabar: drink });
  c.restore();
};

// ============================== 八幕 ==============================

// ① 石碣村打鱼：吴用来访，说三阮撞筹（复用吴用）
SCENES['rq1_yumin'] = (() => {
  const p = () => Z.paper('rq1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 560, amp: 150, tone: 0.28, seed: 11 }]);
      Z.ground(c, 900, { seed: 12, tone: 0.4 });
      // 水面（排线）
      for (let i = 0; i < 18; i++) {
        const wy = 830 + (i % 5) * 14, wx = ((t * 12 + i * 110) % 1920);
        Z.wire(c, [[wx, wy], [wx + 70, wy + 3]], { w: 1.6, tone: 0.34, seed: 20 + i, taper: 0.9 });
      }
      Z.boat(c, 1560, 840, 1.0, t, { tone: 0.8, seed: 13 });
      // 芦苇（活气）
      for (let i = 0; i < 16; i++) {
        const rx = 120 + i * 116, sway = Math.sin(t * 1.7 + i * 0.6) * 10;
        Z.wire(c, [[rx, 900], [rx + sway, 800], [rx + sway * 1.5, 730]], { w: 2, tone: 0.5, seed: 30 + i, taper: 0.4 });
      }
      Z.wuyong(c, 700, 892, 1.42, t, { robe: 1, rujin: 1, fan: 1 });
      Z.ruanqi(c, 1120, 892, 1.48, t, { hat: 1, yucha: 1, raise: clamp(Math.sin(t * 1.3) * 0.2 + 0.2) });
    });
    Z.bigText(c, '石碣村渔民', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 黄泥冈：随晁盖劫了生辰纲（复用晁盖、吴用）
SCENES['rq2_huangni'] = (() => {
  const p = () => Z.paper('rq2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 2.8)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 200, tone: 0.34, seed: 41 }, { y0: 660, amp: 110, tone: 0.24, seed: 42 }]);
      Z.ground(c, 900, { seed: 43, tone: 0.42 });
      Z.pine(c, t, { x: 380, y: 890, s: 1.1, seed: 44, tone: 0.84 });
      // 酒担
      Z.crate(c, 620, 862, 1.0, { tone: 0.8, seed: 45 });
      Z.crate(c, 720, 868, 0.9, { tone: 0.78, seed: 46 });
      Z.flag(c, 560, 620, 140, t, { text: '酒', seed: 47, size: 24 });
      // 军汉（麻倒）
      Z.fighter(c, 1340, 892, 1.02, t, { flip: 1, spear: 1, tone: 0.7, seed: 50 });
      Z.fighter(c, 1540, 892, 0.98, t, { flip: 1, spear: 1, tone: 0.7, seed: 51 });
      Z['chao盖'](c, 1000, 892, 1.44, t, { robe: 1, cap: 1, tower: 1, raise: clamp(Math.sin(t * 1.1) * 0.16 + 0.14) });
      Z.ruanqi(c, 760, 892, 1.46, t, { hat: 1, yucha: 1, raise: clamp(ss(0.3, 1.2, lt)) });
      for (let i = 0; i < 8; i++) {
        const dx = 1300 + ((t * 60 + i * 90) % 400), dy = 780 + (i % 3) * 40;
        Z.wire(c, [[dx, dy], [dx + 18, dy - 8]], { w: 1.8, tone: 0.45, seed: 1910 + i, taper: 0.8 });
      }
    });
    Z.bigText(c, '劫了生辰纲', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ③ 芦苇荡：火烧官船，济州官兵全军覆没
SCENES['rq3_huogong'] = (() => {
  const p = () => Z.paper('rq3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 570, amp: 150, tone: 0.28, seed: 61 }]);
      Z.ground(c, 900, { seed: 62, tone: 0.4 });
      for (let i = 0; i < 20; i++) {
        const rx = 50 + i * 96, sway = Math.sin(t * 1.8 + i * 0.7) * 11;
        Z.wire(c, [[rx, 900], [rx + sway, 790], [rx + sway * 1.5, 710]], { w: 2, tone: 0.5, seed: 70 + i, taper: 0.4 });
      }
      Z.boat(c, 1400, 830, 1.1, t, { tone: 0.8, seed: 75 });
      Z.fighter(c, 1400, 800, 0.8, t, { flip: 1, spear: 1, tone: 0.66, seed: 76 });
      // 火攻（活气）
      const fire = clamp(ss(0.8, 1.8, lt));
      if (fire > 0.05) {
        for (let i = 0; i < 6; i++) Z.flame(c, 1280 + i * 70, 760 + (i % 2) * 50, 0.5 + fire * 0.3, t, { seed: 80 + i, tone: 0.65 });
      }
      // 阮小七（水中突进，持叉）
      Z.ruanqi(c, 780, 892, 1.5, t, { hat: 1, yucha: 1, raise: fire });
      if (fire > 0.3) {
        for (let i = 0; i < 8; i++) {
          const fx = ((t * 150 + i * 200) % 1900) + 10, fy = 420 + (i % 4) * 110;
          Z.wire(c, [[fx, fy], [fx + 46, fy - 10]], { w: 1.8, tone: 0.36, seed: 1920 + i, taper: 0.9 });
        }
      }
    });
    Z.bigText(c, '芦苇荡火攻', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 梁山泊水军：八百里水泊，水军头领
SCENES['rq4_shuijun'] = (() => {
  const p = () => Z.paper('rq4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 210, tone: 0.3, seed: 101 }, { y0: 660, amp: 120, tone: 0.2, seed: 102 }]);
      Z.cloud(c, t, { x: 1500, y: 180, s: 1.2, seed: 103, tone: 0.3 });
      // 水泊（排线 + 波纹）
      for (let i = 0; i < 26; i++) {
        const wy = 820 + (i % 7) * 12, wx = ((t * 16 + i * 78) % 1920);
        Z.wire(c, [[wx, wy], [wx + 84, wy + 3]], { w: 1.6, tone: 0.32, seed: 110 + i, taper: 0.9 });
      }
      Z.shanzhai(c, 1560, 640, 0.85, { tone: 0.74, seed: 111, text: '梁山' });
      Z.flag(c, 420, 540, 180, t, { text: '水軍', seed: 112, size: 28 });
      Z.boat(c, 1300, 840, 0.95, t, { tone: 0.78, seed: 113 });
      Z.ruanqi(c, 900, 892, 1.48, t, { hat: 1, yucha: 1, raise: clamp(Math.sin(t * 1.4) * 0.24 + 0.2) });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 48 + i * 230) % 1960) - 30, by = 340 + ((t * 36 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.36, seed: 1916 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '梁山泊水军', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 偷喝御酒：招安御酒到寨，阮小七偷喝（朱砂：酒封）
SCENES['rq5_yujiu'] = (() => {
  const p = () => Z.paper('rq5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 131, tone: 0.42 });
      Z.shanzhai(c, 1580, 700, 0.9, { tone: 0.76, seed: 132, text: '梁山' });
      Z.flag(c, 340, 560, 180, t, { text: '招安', seed: 133, size: 28 });
      // 钦差与随从
      Z.fighter(c, 1500, 892, 1.06, t, { flip: 1, tone: 0.8, seed: 140 });
      Z.fighter(c, 1300, 892, 0.96, t, { flip: 1, tone: 0.75, seed: 141 });
      // 御酒坛（朱砂酒封，本片第一处朱砂）
      const seal = clamp(ss(0.6, 1.6, lt));
      Z.lined(c, [[1180, 820], [1272, 820], [1264, 900], [1188, 900]], { w: 3.2, tone: 0.86, seed: 150, hatch: 0.12 });
      Z.wire(c, [[1184, 820], [1268, 820]], { w: 3.6, tone: 0.88, seed: 151 });
      if (seal > 0.02) {
        c.save(); c.globalAlpha = 0.7 + 0.3 * seal; c.fillStyle = 'rgba(183,51,46,.8)';
        c.fillRect(1196, 812, 60, 14); c.restore();
      }
      // 阮小七（抱葫芦偷喝）
      const drink = clamp(ss(1.0, 2.2, lt));
      Z.ruanqi(c, 820, 892, 1.5, t, { hat: 1, yucha: 0, gourd: 1, drink, raise: drink * 0.7 });
      if (drink > 0.4) {
        c.save(); c.globalAlpha = 0.75 * drink;
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('御酒，先尝为敬', 820, 420);
        c.restore();
      }
    });
    Z.bigText(c, '偷喝御酒', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 征方腊：血战江南，水陆并进
SCENES['rq6_fangla'] = (() => {
  const p = () => Z.paper('rq6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 200, tone: 0.32, seed: 161 }, { y0: 660, amp: 110, tone: 0.22, seed: 162 }]);
      Z.ground(c, 900, { seed: 163, tone: 0.44 });
      Z.flag(c, 1580, 500, 200, t, { text: '宋', seed: 164, size: 32 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1420 + i * 128, 892, 0.94, t, { flip: 1, blade: 1, tone: 0.72, seed: 170 + i });
      // 阮小七（持叉冲杀）
      const charge = clamp(ss(0.2, 1.6, lt));
      Z.ruanqi(c, lerp(640, 780, charge), 892, 1.52, t, { hat: 1, yucha: 1, raise: charge });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 110 + i * 165) % 1500) + 280, dy = 800 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1960 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '血战江南', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑦ 穿龙袍：戏穿方腊赭黄袍，被参奏（朱砂：龙袍）
SCENES['rq7_longpao'] = (() => {
  const p = () => Z.paper('rq7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 181, tone: 0.42 });
      Z.tent(c, 1560, 780, 1.0, { tone: 0.78, seed: 182, text: '' });
      Z.flag(c, 380, 560, 180, t, { text: '方臘', seed: 183, size: 28 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 300 + i * 120, 900, 0.62, t, { seed: 184 + i, tone: 0.5 });
      // 阮小七（戏穿龙袍，朱砂）
      const wear = clamp(ss(0.8, 2.0, lt));
      Z.ruanqi(c, 1000, 892, 1.52, t, { hat: 1, yucha: 0, dragon: wear, raise: wear * 0.5 });
      if (wear > 0.4) {
        c.save(); c.globalAlpha = 0.78 * wear;
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('皇帝老儿做得，我如何做不得', 1000, 380);
        c.restore();
      }
      // 哄笑（动势线）
      if (wear > 0.5) {
        for (let i = 0; i < 6; i++) {
          const dx = 280 + i * 110, dy = 700 + Math.sin(t * 3 + i) * 14;
          Z.wire(c, [[dx, dy], [dx + 16, dy - 14]], { w: 1.8, tone: 0.45, seed: 1970 + i, taper: 0.8 });
        }
      }
    });
    Z.bigText(c, '戏穿龙袍', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 归石碣村：削职为民，回乡打鱼，寿终正寝（朱砂：钤印）
SCENES['rq8_guiyu'] = (() => {
  const p = () => Z.paper('rq8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 220, tone: 0.34, seed: 201 }, { y0: 660, amp: 120, tone: 0.24, seed: 202 }]);
      Z.cloud(c, t, { x: 1480, y: 170, s: 1.2, seed: 203, tone: 0.3 });
      Z.cloud(c, t, { x: 380, y: 230, s: 0.95, seed: 204, tone: 0.26 });
      Z.ground(c, 900, { seed: 205, tone: 0.4 });
      for (let i = 0; i < 22; i++) {
        const wy = 830 + (i % 6) * 13, wx = ((t * 14 + i * 90) % 1920);
        Z.wire(c, [[wx, wy], [wx + 76, wy + 3]], { w: 1.6, tone: 0.32, seed: 210 + i, taper: 0.9 });
      }
      for (let i = 0; i < 14; i++) {
        const rx = 60 + i * 132, sway = Math.sin(t * 1.6 + i * 0.7) * 10;
        Z.wire(c, [[rx, 900], [rx + sway, 800], [rx + sway * 1.5, 720]], { w: 2, tone: 0.48, seed: 220 + i, taper: 0.4 });
      }
      Z.boat(c, 1420, 840, 1.0, t, { tone: 0.8, seed: 213 });
      // 阮小七（归乡，斗笠渔叉）
      const walk = clamp(ss(0.2, 3.4, lt));
      Z.ruanqi(c, lerp(760, 940, walk * 0.6), 892, lerp(1.5, 1.3, walk * 0.5), t, { hat: 1, yucha: 1 });
      if (lt > 1.4) {
        c.save(); c.globalAlpha = 0.8 * clamp(ss(1.4, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('依旧打鱼为生，六十而终', 1560, 360);
        c.restore();
      }
    });
    Z.bigText(c, '归石碣村', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '活阎罗', clamp(ss(0.8, 2.4, lt)), { size: 28 });
  } };
})();
})();
