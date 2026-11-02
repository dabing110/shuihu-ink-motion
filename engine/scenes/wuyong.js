// 《水浒传·吴用》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：东溪村私塾先生（乡村塾师）→ 梁山军师（智多星）。特征：儒巾（学者冠） + 长袍 + 羽扇（signature）。
// 母题：① 羽扇（智多星 signature，运筹之具）② 谋略（以北斗/星点示意，不施色）③ 替天行道旗。
// 唯一的彩：朱砂只用于第五幕梁山军师之钤印（军师令）——全片一处，余皆黑白灰。
// 弧光：东溪村私塾先生 → 智取生辰纲（献蒙汗药酒之计） → 说三阮入伙 → 智赚卢俊义（假扮算命先生题反诗）
//       → 梁山军师 → 智取大名府（火攻破城） → 主导招安 → 宋江墓前自缢（与花荣同死，闭环：梁山谋主终局）。
// 依《水浒传》第十四至百回本系统；吴用为累积型文学形象，正史无其人。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 羽扇（智多星 signature：半圆扇面 + 扇骨 + 柄）
Z.fan = (c, x, y, s, { tone = 0.85, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.save(); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 46, Math.PI, 2 * Math.PI); c.closePath(); c.clip();
  Z.hatchBox(c, [[-46, 0], [46, 0], [46, -46], [-46, -46]], { ang: 0.3, gap: 5, tone: 0.16, seed });
  c.restore();
  Z.wire(c, [[0, 0], [-46, 0]], { w: 2.4, tone, seed: seed + 1 });
  Z.wire(c, [[0, 0], [46, 0]], { w: 2.4, tone, seed: seed + 2 });
  Z.wire(c, [[0, 0], [0, -46]], { w: 2.2, tone, seed: seed + 3 });
  Z.wire(c, [[0, 0], [-33, -33]], { w: 1.8, tone: tone * 0.8, seed: seed + 4 });
  Z.wire(c, [[0, 0], [33, -33]], { w: 1.8, tone: tone * 0.8, seed: seed + 5 });
  Z.wire(c, [[0, 0], [0, 30]], { w: 3, tone, seed: seed + 6 });                              // 柄
  c.restore();
};

// ============================== 吴用本体 ==============================
// o: { robe, rujin儒巾, armor, fan羽扇, flip, raise, angry, hurt, tone }
Z.wuyong = (c, x, y, s, t, o = {}) => {
  const {
    robe = 1, rujin = 1, armor = 0, fan = 0, flip = 0,
    raise = 0, angry = 0, hurt = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.4) * 2.2;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(hurt ? 40 : 0);
  const shoulderY = ly - 162 * 1;
  const waistY = ly - 82 * 1;
  const hemY = ly - 2;
  const hemW = 50;

  // ---- 躯干（清瘦：肩较窄）----
  const body = [[-48, shoulderY + 8], [-54, waistY + 8], [-hemW, hemY], [hemW, hemY], [54, waistY + 8], [48, shoulderY + 8]];
  Z.lined(c, body, { w: 3.2, tone, seed: 71, hatch: 0.16, gap: 11, hatchAng: -0.9 });
  c.save(); c.fillStyle = 'rgba(104,108,116,.13)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();

  // ---- 腰带 ----
  Z.wire(c, [[-56, waistY], [56, waistY]], { w: 4, tone: tone * 0.95, seed: 76, taper: 0.08 });
  Z.wire(c, [[-56, waistY + 8], [56, waistY + 8]], { w: 2, tone: tone * 0.7, seed: 77, taper: 0.08 });

  // ---- 双臂 ----
  const armUp = lerp(0.16, -0.6, raise) + Math.sin(t * 1.4 + 1) * 0.02;
  const handY = shoulderY + 54 + Math.sin(armUp) * 58;
  Z.wire(c, [[-48, shoulderY + 14], [-62, shoulderY + 56], [-48, handY + 6]], { w: 3.2, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[48, shoulderY + 14], [62, shoulderY + 54 - raise * 26], [48, handY - raise * 40]], { w: 3.2, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[-48, handY + 2], [-36, handY + 22], [-26, handY + 6], [-40, handY - 14]], { w: 2.2, tone: tone * 0.8, seed: 82 });
  Z.lined(c, [[48, handY - 2], [36, handY + 18], [26, handY], [40, handY - 16]], { w: 2.2, tone: tone * 0.8, seed: 83 });

  // ---- 头（儒巾：学者冠，方直，两带垂）----
  const hy = shoulderY - 38 + br * 0.5;
  c.save(); c.translate(0, hy); c.scale(1.1, 1.1); c.translate(0, -hy);
  const face = [[-21, hy - 14], [-18, hy - 38], [0, hy - 46], [18, hy - 38], [21, hy - 14], [19, hy + 14], [0, hy + 26], [-19, hy + 12]];
  Z.wire(c, face, { w: 2.6, tone, seed: 84, taper: 0.08 });
  if (rujin) {
    // 儒巾（方冠 + 两垂带，学者标识）
    Z.wire(c, [[-20, hy - 18], [-18, hy - 46], [18, hy - 46], [20, hy - 18]], { w: 2.6, tone: 0.9, seed: 110, taper: 0.05 });
    Z.wire(c, [[-20, hy - 18], [20, hy - 18]], { w: 2.2, tone: 0.75, seed: 111 });
    Z.wire(c, [[-20, hy - 30], [20, hy - 30]], { w: 1.4, tone: tone * 0.6, seed: 112 });
    Z.wire(c, [[-20, hy - 18], [-28, hy + 18]], { w: 2.4, tone: tone * 0.75, seed: 113 });   // 左垂带
    Z.wire(c, [[20, hy - 18], [28, hy + 18]], { w: 2.4, tone: tone * 0.75, seed: 114 });     // 右垂带
    Z.lined(c, [[-8, hy - 14], [8, hy - 14], [8, hy - 30], [-8, hy - 30]], { w: 1.4, tone: 0.6, seed: 115 });  // 巾前沿
  } else if (armor) {
    Z.lined(c, [[-21, hy - 16], [-17, hy - 44], [17, hy - 44], [21, hy - 16]], { w: 2.6, tone: 0.94, seed: 110, hatch: 0.18, gap: 5 });
    Z.wire(c, [[0, hy - 44], [0, hy - 58], [7, hy - 50]], { w: 2.2, tone: 0.85, seed: 111 });
  }
  const open = lerp(0.5, 1, angry);
  for (const sx of [-1, 1]) {
    Z.wire(c, [[sx * 5, hy - lerp(19, 22, angry)], [sx * 15, hy - lerp(18, 12, angry)]], { w: 3, tone: tone * 0.95, seed: 87 + sx });
    Z.lined(c, [[sx * 4, hy - 10], [sx * 10, hy - 15], [sx * 16, hy - 10], [sx * 10, hy - 5]], { w: 1.5, tone, seed: 89 + sx, hatch: 0.5, gap: 3 });
  }
  Z.wire(c, [[0, hy - 10], [1, hy]], { w: 2, tone: tone * 0.8, seed: 91 });
  Z.wire(c, [[-8, hy + 6], [8, hy + 6]], { w: 2.4, tone: tone * 0.85, seed: 92 });          // 三绺须
  Z.wire(c, [[0, hy + 8], [0, hy + 22]], { w: 1.6, tone: tone * 0.7, seed: 93 });
  c.restore();

  // ---- 羽扇（signature）----
  if (fan) {
    c.save(); c.translate(lerp(70, 44, raise), handY - raise * 30); c.rotate(lerp(0.2, -0.5, raise));
    Z.fan(c, 0, 0, 0.9, { tone: 0.82, seed: 300 });
    c.restore();
  }
  if (hurt) {
    c.save(); c.fillStyle = 'rgba(183,51,46,.5)';
    for (let i = 0; i < 4; i++) c.fillRect(-18 + i * 10, shoulderY + 28 + i * 4, 3, 3);
    c.restore();
  }
  c.restore();
};

// ============================== 八幕 ==============================
// ① 东溪村私塾先生：设帐教书，乡里称为"学究"
SCENES['wu1_sishu'] = (() => {
  const p = () => Z.paper('wu1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 440, y: 180, s: 1.0, seed: 4, tone: 0.3 });
      Z.ground(c, 904, { seed: 11, tone: 0.4 });
      Z.manor(c, 1500, 856, 0.9, { tone: 0.82, seed: 2, text: '私塾' });
      Z.fighter(c, 700, 884, 0.7, t, { seed: 3, tone: 0.6 });                              // 学童
      Z.fighter(c, 800, 886, 0.7, t, { seed: 5, tone: 0.6, flip: 1 });
      Z.wuyong(c, 1080, 892, 1.5, t, { robe: 1, rujin: 1, fan: 1, raise: clamp(Math.sin(t * 1.3) * 0.25 + 0.18) });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 60 + i * 230) % 2000) - 40, by = 360 + ((t * 44 + i * 150) % 500);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.6, tone: 0.42, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '私塾先生', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 智取生辰纲：黄泥冈，吴用献蒙汗药酒之计（与晁盖/杨志互文）
SCENES['wu2_shengchen'] = (() => {
  const p = () => Z.paper('wu2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const doze = clamp(ss(1.2, 2.6, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1500, y: 190, s: 1.0, seed: 9, tone: 0.32 });
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 200, tone: 0.42, seed: 101 }, { y0: 650, amp: 120, tone: 0.3, seed: 102 }]);
      Z.ground(c, 904, { seed: 14, tone: 0.4 });
      Z.crate(c, 600, 870, 1.0, { tone: 0.78, seed: 2 });
      Z.crate(c, 690, 862, 0.9, { tone: 0.74, seed: 3 });
      c.save(); c.translate(1180, 870);                                                     // 酒桶（蒙汗药酒：朱砂一点）
      Z.lined(c, [[-34, 0], [-28, -70], [28, -70], [34, 0]], { w: 3, tone: 0.82, seed: 5, hatch: 0.2, gap: 7 });
      Z.wire(c, [[-34, 0], [34, 0]], { w: 3.2, tone: 0.82, seed: 6 });
      Z.wire(c, [[-22, -70], [22, -70], [22, -80], [-22, -80], [-22, -70]], { w: 2.4, tone: 0.8, seed: 7 });
      c.restore();
      c.save(); c.globalAlpha = 0.6; c.fillStyle = 'rgba(183,51,46,.4)';
      c.beginPath(); c.arc(1180, 724, 4, 0, 7); c.fill(); c.restore();
      Z.fighter(c, 1380, 888, 1.0, t, { seed: 8, tone: 0.72, flip: 1 });
      Z.fighter(c, 1500, 884, 0.92, t, { seed: 9, tone: 0.68, flip: 1 });
      Z.wuyong(c, 920, 892, 1.46, t, { robe: 1, rujin: 1, fan: 1, tone: lerp(0.9, 0.5, doze) });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 50 + i * 250) % 2000) - 40, by = 360 + ((t * 40 + i * 170) % 520);
        Z.wire(c, [[bx, by], [bx + 10, by + 5]], { w: 1.4, tone: 0.36, seed: 2400 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '智取生辰纲', { x: 1760, y: 120, size: 44, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 说三阮入嘱：吴用游说阮氏三兄弟入伙（双掌连环计）
SCENES['wu3_shuanruan'] = (() => {
  const p = () => Z.paper('wu3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.05, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.0, seed: 8, tone: 0.32 });
      Z.ground(c, 904, { seed: 13, tone: 0.4 });
      Z.pine(c, t, { x: 320, y: 880, s: 1.0, seed: 3, tone: 0.85 });
      Z.wuyong(c, 760, 892, 1.42, t, { robe: 1, rujin: 1, fan: 1, raise: 0.15 });          // 吴用游说
      Z.fighter(c, 1010, 888, 1.0, t, { seed: 3, tone: 0.74 });
      Z.fighter(c, 1150, 884, 0.94, t, { seed: 5, tone: 0.7, flip: 1 });
      Z.fighter(c, 1290, 888, 1.0, t, { seed: 7, tone: 0.74 });
    });
    Z.bigText(c, '说三阮入伙', { x: 1760, y: 120, size: 44, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 智赚卢俊义：吴用假扮算命先生，题反诗赚卢俊义上山（与卢俊义片互文）
SCENES['wu4_zhuanlu'] = (() => {
  const p = () => Z.paper('wu4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1500, y: 190, s: 1.0, seed: 9, tone: 0.32 });
      Z.ground(c, 904, { seed: 14, tone: 0.4 });
      Z.manor(c, 1500, 856, 0.92, { tone: 0.82, seed: 2, text: '卢府' });
      Z.wuyong(c, 820, 892, 1.46, t, { robe: 1, rujin: 1, fan: 0 });                       // 假扮算命先生（无扇，持幡）
      Z.wire(c, [[980, 720], [980, 880]], { w: 3, tone: 0.8, seed: 30 });                    // 幡杆
      Z.labelBox(c, 952, 700, 56, 90, { tone: 0.85, seed: 31 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.84)'; c.font = '20px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      '算命'.split('').forEach((ch, i) => c.fillText(ch, 980, 730 + i * 26)); c.restore();
      Z.fighter(c, 1360, 888, 1.0, t, { seed: 8, tone: 0.74 });                              // 卢府家丁/卢俊义侧影
    });
    Z.bigText(c, '智赚卢俊义', { x: 1760, y: 120, size: 44, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 梁山军师：坐镇忠义堂，替天行道旗（钤印：朱砂军师令，全片唯一朱砂）
SCENES['wu5_junshi'] = (() => {
  const p = () => Z.paper('wu5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.1, seed: 12, tone: 0.32 });
      Z.ground(c, 904, { seed: 16, tone: 0.4 });
      Z.shanzhai(c, 1540, 856, 0.92, { tone: 0.8, seed: 8, text: '梁山泊' });
      Z.flag(c, 320, 660, 140, t, { text: '替天行道', seed: 18, size: 28 });
      Z.fighter(c, 620, 888, 0.96, t, { seed: 4, tone: 0.72 });
      Z.fighter(c, 1320, 888, 0.96, t, { seed: 10, tone: 0.72, flip: 1 });
      Z.wuyong(c, 960, 892, 1.55, t, { robe: 1, rujin: 1, fan: 1, raise: 0.1 });             // 军师居中
    });
    Z.bigText(c, '梁山军师', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 140, 884, '智多星', clamp(ss(0.5, 1.8, lt)), { size: 26 });
  } };
})();

// ⑥ 智取大名府：吴用计破大名府，救卢俊义石秀（火攻破城）
SCENES['wu6_daming'] = (() => {
  const p = () => Z.paper('wu6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const fire = clamp(ss(1.0, 2.4, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.1, seed: 10, tone: 0.32 });
      Z.guan(c, 1500, 856, 0.92, { tone: 0.82, seed: 2, text: '大名府' });
      Z.flame(c, 1480, 866, 1.0, t, { seed: 3, tone: 0.6 * (0.5 + fire) });                  // 城火
      Z.flame(c, 1360, 866, 0.8, t, { seed: 5, tone: 0.5 * (0.5 + fire) });
      Z.fighter(c, 1380, 888, 1.0, t, { seed: 8, tone: 0.72, flip: 1 });
      Z.wuyong(c, 820, 892, 1.5, t, { robe: 1, rujin: 1, fan: 1, raise: fire * 0.5 });
      for (let i = 0; i < 10; i++) {                                                        // 火星飞溅（活气）
        const bx = ((t * 130 + i * 200) % 2000) - 40, by = 800 - ((t * 70 + i * 60) % 160);
        Z.wire(c, [[bx, by], [bx + 16, by - 10]], { w: 1.6, tone: 0.45, seed: 2500 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '智取大名府', { x: 1760, y: 120, size: 44, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 主导招安：吴用劝进招安，梁山受诏（妥协之始）
SCENES['wu7_zhaoan'] = (() => {
  const p = () => Z.paper('wu7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.1, seed: 12, tone: 0.32 });
      Z.ground(c, 904, { seed: 17, tone: 0.4 });
      Z.shanzhai(c, 1540, 856, 0.9, { tone: 0.8, seed: 8, text: '梁山泊' });
      // 朝廷诏旗（淡墨旗，区别于替天行道）
      Z.labelBox(c, 320, 660, 130, 60, { tone: 0.85, seed: 18 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.84)'; c.font = '28px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('受诏', 385, 690); c.restore();
      Z.wuyong(c, 960, 892, 1.5, t, { robe: 1, rujin: 1, fan: 1, raise: 0.2 });
      Z.fighter(c, 760, 888, 0.96, t, { seed: 4, tone: 0.72 });
      Z.fighter(c, 1160, 888, 0.96, t, { seed: 6, tone: 0.72, flip: 1 });
    });
    Z.bigText(c, '主导招安', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 自缢而死：宋江被赐死后，吴用与花荣于宋江墓前自缢（梁山谋主终局）
SCENES['wu8_zijin'] = (() => {
  const p = () => Z.paper('wu8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const fade = clamp(ss(1.6, 3.4, lt));
    const cam = { x: 960, y: 560, z: lerp(1.08, 1.0, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 600, y: 180, s: 1.1, seed: 14, tone: 0.3 });
      Z.pine(c, t, { x: 360, y: 880, s: 1.2, seed: 3, tone: 0.85 });                         // 墓前松
      Z.ground(c, 904, { seed: 18, tone: 0.34 });
      Z.roof(c, 1500, 720, 200, 60, { tone: 0.7, seed: 2 });                                   // 墓冢
      Z.wire(c, [[1420, 720], [1580, 720], [1560, 860], [1440, 860], [1420, 720]], { w: 2.6, tone: 0.7, seed: 3 });
      // 两吊影（吴用、花荣自缢，简笔人形悬于松枝）
      const hang = (hx) => {
        const yy = 520 + fade * 6;
        Z.wire(c, [[hx, 360], [hx, yy - 40]], { w: 2, tone: 0.7, seed: 200 + hx });            // 缢索
        Z.lined(c, [[hx - 14, yy], [hx + 14, yy], [hx + 10, yy + 60], [hx - 10, yy + 60], [hx - 14, yy]], { w: 2.4, tone: 0.7, seed: 210 + hx, hatch: 0.12, gap: 9 });
        Z.wire(c, [[hx, yy - 40], [hx - 14, yy - 24], [hx + 14, yy - 24], [hx, yy - 40]], { w: 2, tone: 0.7, seed: 220 + hx });  // 头
      };
      hang(760); hang(1160);                                                                     // 吴用、花荣自缢吊影
    });
    Z.bigText(c, '自缢而死', { x: 1760, y: 110, size: 46, tone: 0.92, appear: clamp(ss(2.0, 3.0, lt)) });
    Z.seal(c, 140, 884, '智多星', clamp(ss(2.6, 3.7, lt)), { size: 24 });
  } };
})();
})();
