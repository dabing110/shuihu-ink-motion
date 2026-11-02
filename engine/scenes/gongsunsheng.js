// 《水浒传·公孙胜》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：蓟州九宫县二仙山罗真人门下——道袍、道冠、手执拂尘，腰悬松纹古定剑，
//   能呼风唤雨、驾雾腾云，五雷天罡正法正宗，绰号「入云龙」。
//   特征：① 拂尘（signature 法器）② 松纹古定剑 ③ 道冠（逍遥巾）④ 符箓雷纹（朱砂）。
// 唯一的彩：朱砂只用于① 符箓雷纹（signature，全片一味朱砂）② 第八幕「入云龙」钤印——余皆黑白灰。
// 母题：① 拂尘 ② 古定剑 ③ 道冠 ④ 雷符。
// 弧光：七星聚义报信 → 黄泥冈智取生辰纲 → 石碣村破官兵 → 梁山罗天大醮 →
//       斗法破高廉妖术 → 北征田虎王庆 → 功成别众 → 归二仙山修道（梁山唯一全身而退）。
// 依《水浒传》第十五、十六、十九、五十二、五十三、八十五、九十九回及百回本末回。
// 互文：第一、二幕复用晁盖、吴用（生辰纲七星聚义）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 拂尘（signature 法器：短柄 + 束丝垂落）
Z.fuchen = (c, x, y, s, t, { tone = 0.88, seed = 1, wave = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[0, -46], [0, -8]], { w: 4.4, tone, seed, taper: 0.06 });      // 柄
  Z.wire(c, [[-6, -8], [6, -8], [6, -2], [-6, -2]], { w: 2.6, tone, seed: seed + 1 });  // 束口
  for (let i = 0; i < 11; i++) {                                             // 丝（随风）
    const sway = Math.sin(t * 1.8 + i * 0.55) * 6 * wave;
    Z.wire(c, [[-5 + i, -2], [-8 + i * 1.6 + sway, 40], [-6 + i * 1.8 + sway * 1.5, 82]],
      { w: 1.5, tone: tone * 0.7, seed: seed + 10 + i, taper: 0.5 });
  }
  c.restore();
};

// 松纹古定剑（signature：直剑 + 剑格 + 剑穗）
Z.guding = (c, x, y, s, { tone = 0.9, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.5);
  Z.wire(c, [[0, 40], [0, -170]], { w: 4, tone, seed, taper: 0.05 });       // 剑身
  Z.wire(c, [[-14, 40], [14, 40]], { w: 3.2, tone, seed: seed + 1 });       // 剑格
  Z.wire(c, [[0, 40], [0, 68]], { w: 4.6, tone, seed: seed + 2 });          // 剑柄
  Z.wire(c, [[0, 68], [0, 78]], { w: 6, tone, seed: seed + 3 });            // 剑首
  Z.wire(c, [[0, 78], [8, 96], [-2, 108]], { w: 1.6, tone: tone * 0.6, seed: seed + 4 });  // 剑穗
  for (let i = 0; i < 4; i++) Z.wire(c, [[-4, 20 - i * 40], [4, 14 - i * 40]], { w: 1.4, tone: tone * 0.6, seed: seed + 20 + i });  // 松纹
  c.restore();
};

// 雷符（朱砂：五雷天罡正法的符箓——朱砂竖幅 + 雷纹折线）
Z.leifu = (c, x, y, s, q, { seed = 1 } = {}) => {
  if (q <= 0.02) return;
  c.save(); c.translate(x, y); c.scale(s, s);
  c.save(); c.globalAlpha = 0.86 * q;
  Z.lined(c, [[-46, -90], [46, -88], [44, 90], [-44, 88]], { w: 3, tone: 0.82, seed, hatch: 0.08 });
  c.strokeStyle = 'rgba(183,51,46,.82)'; c.lineWidth = 4.4; c.lineCap = 'round';
  c.beginPath();
  c.moveTo(0, -70); c.lineTo(-18, -34); c.lineTo(16, -30); c.lineTo(-14, 6);
  c.lineTo(18, 12); c.lineTo(-10, 52); c.lineTo(8, 74);
  c.stroke();
  c.globalAlpha = 0.7 * q; c.fillStyle = 'rgba(183,51,46,.7)';
  c.fillRect(-30, -84, 12, 12); c.fillRect(20, 60, 10, 10);
  c.restore();
  c.restore();
};

// ============================== 公孙胜本体 ==============================
// o: { fuchen拂尘, sword古定剑, crown道冠, flip, raise, kneel, cast作法, fu雷符, tone }
Z.gongsun = (c, x, y, s, t, o = {}) => {
  const {
    fuchen = 1, sword = 0, crown = 1, flip = 0, raise = 0, kneel = 0,
    cast = 0, fu = 0, tone = 0.88,
  } = o;
  const br = Math.sin(t * 1.2) * 2.2;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 46 : 0);
  const shoulderY = ly - 152;
  const waistY = ly - 76;
  const hipY = ly - 22;
  const hemW = 74;

  // ---- 道袍（宽大：下摆开展）----
  const robe = [[-52, shoulderY + 6], [-62, waistY + 4], [-hemW, hipY + 8], [hemW, hipY + 8], [62, waistY + 4], [52, shoulderY + 6]];
  Z.lined(c, robe, { w: 3.4, tone, seed: 71, hatch: 0.14, gap: 11, hatchAng: -0.95 });
  c.save(); c.fillStyle = 'rgba(232,230,222,.42)';
  c.beginPath(); robe.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  // 交领（道袍大襟）
  Z.wire(c, [[-28, shoulderY + 4], [0, shoulderY + 36], [30, shoulderY + 6]], { w: 3, tone: tone * 0.9, seed: 72 });
  Z.wire(c, [[-58, waistY + 2], [58, waistY + 2], [58, waistY + 20], [-58, waistY + 20], [-58, waistY + 2]], { w: 3.2, tone, seed: 73, taper: 0.06 });  // 丝绦
  Z.wire(c, [[0, waistY + 20], [0, waistY + 52]], { w: 1.8, tone: tone * 0.7, seed: 74 });  // 绦垂
  // 云纹（道袍下摆的水火云纹，signature）
  for (let i = 0; i < 3; i++) {
    const cx = -44 + i * 44, cy = hipY - 6;
    Z.wire(c, [[cx - 14, cy], [cx - 6, cy - 10], [cx + 4, cy - 8], [cx + 12, cy], [cx + 4, cy + 6]], { w: 1.8, tone: tone * 0.6, seed: 80 + i });
  }

  // ---- 双臂（左手持拂尘，右手作诀）----
  const handY = shoulderY + 54 - raise * 40;
  Z.wire(c, [[-52, shoulderY + 12], [-74, shoulderY + 44], [-66, handY + 6]], { w: 3.2, tone, seed: 81, taper: 0.1 });
  Z.wire(c, [[52, shoulderY + 12], [82, shoulderY + 34 - raise * 30], [72, handY - raise * 26]], { w: 3.2, tone, seed: 82, taper: 0.1 });
  Z.lined(c, [[-66, handY + 4], [-54, handY + 20], [-44, handY + 6], [-54, handY - 10]], { w: 2.2, tone: tone * 0.8, seed: 83 });
  if (cast > 0.02) {   // 作诀（剑指）
    Z.wire(c, [[72, handY - raise * 26], [96, handY - 14 - raise * 26]], { w: 2.4, tone, seed: 84 });
    Z.wire(c, [[72, handY - raise * 26], [92, handY - 4 - raise * 26]], { w: 2.2, tone, seed: 85 });
  } else {
    Z.lined(c, [[72, handY - raise * 26], [60, handY + 12 - raise * 26], [50, handY - 2 - raise * 26], [60, handY - 16 - raise * 26]], { w: 2.2, tone: tone * 0.8, seed: 86 });
  }

  // ---- 头（清癯道人）----
  const hy = shoulderY - 38 + br * 0.5;
  const face = [[-21, hy - 12], [-18, hy - 36], [0, hy - 47], [18, hy - 36], [21, hy - 12], [19, hy + 12], [0, hy + 25], [-19, hy + 10]];
  Z.lined(c, face, { w: 2.6, tone: tone * 0.95, seed: 100, hatch: 0.05, gap: 9 });
  Z.wire(c, [[-14, hy - 14], [-4, hy - 12]], { w: 1.8, tone, seed: 101 });
  Z.wire(c, [[4, hy - 12], [14, hy - 14]], { w: 1.8, tone, seed: 102 });
  Z.wire(c, [[-9, hy - 4], [-3, hy - 3]], { w: 1.5, tone, seed: 103 });
  Z.wire(c, [[3, hy - 3], [9, hy - 4]], { w: 1.5, tone, seed: 104 });
  Z.wire(c, [[-8, hy + 10], [8, hy + 8]], { w: 1.8, tone: tone * 0.8, seed: 105 });   // 长须
  Z.wire(c, [[-4, hy + 12], [-6, hy + 28]], { w: 1.6, tone: tone * 0.75, seed: 106 });
  Z.wire(c, [[4, hy + 12], [6, hy + 28]], { w: 1.6, tone: tone * 0.75, seed: 107 });
  // 道冠（逍遥巾，signature）
  if (crown) {
    Z.wire(c, [[-26, hy - 20], [-22, hy - 46], [22, hy - 46], [26, hy - 20]], { w: 2.8, tone: 0.9, seed: 110 });
    Z.wire(c, [[-22, hy - 46], [-14, hy - 70], [14, hy - 70], [22, hy - 46]], { w: 3, tone: 0.92, seed: 111 });
    Z.wire(c, [[-14, hy - 70], [0, hy - 84], [14, hy - 70]], { w: 2.6, tone: 0.9, seed: 112 });
    Z.wire(c, [[0, hy - 84], [0, hy - 96]], { w: 2, tone: 0.85, seed: 113 });         // 冠上簪
  }

  // ---- 手持件 ----
  if (fuchen) Z.fuchen(c, -66, handY + 18, 1.0, t, { tone: tone * 0.9, seed: 170, wave: 1 + cast });
  if (sword) Z.guding(c, 66, handY + 10, 1.0, { tone, seed: 180 });
  if (fu > 0.02) Z.leifu(c, 96, handY - 40, 1.0, fu, { seed: 190 });
  c.restore();
};

// ============================== 八幕 ==============================

// ① 七星聚义：公孙胜来投晁盖庄上报信（复用晁盖、吴用）
SCENES['gs1_juyi'] = (() => {
  const p = () => Z.paper('gs1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 420, y: 180, s: 1.0, seed: 4, tone: 0.32 });
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.roof(c, 1520, 740, 420, 120, { tone: 0.9, seed: 2 });
      Z.wire(c, [[1360, 880], [1360, 630], [1690, 630], [1690, 880]], { w: 3.2, tone: 0.85, seed: 4 });
      Z.pine(c, t, { x: 320, y: 886, s: 1.05, seed: 7, tone: 0.85 });
      Z['chao盖'](c, 1670, 884, 1.3, t, { robe: 1, cap: 1, tower: 1, raise: clamp(Math.sin(t * 1.1) * 0.1 + 0.1) });
      Z.gongsun(c, 1240, 892, 1.48, t, { fuchen: 1, crown: 1, raise: clamp(Math.sin(t * 1.2) * 0.2 + 0.2) });
      Z.wuyong(c, 900, 892, 1.4, t, { robe: 1, rujin: 1, fan: 1 });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 54 + i * 230) % 1980) - 30, by = 340 + ((t * 40 + i * 150) % 470);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.38, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '七星聚义', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 黄泥冈：智取生辰纲，白胜卖酒（复用晁盖、吴用）
SCENES['gs2_huangni'] = (() => {
  const p = () => Z.paper('gs2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 2.8)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 200, tone: 0.34, seed: 21 }, { y0: 660, amp: 110, tone: 0.24, seed: 22 }]);
      Z.ground(c, 900, { seed: 23, tone: 0.42 });
      Z.pine(c, t, { x: 380, y: 890, s: 1.1, seed: 24, tone: 0.84 });
      // 酒担（白胜）
      Z.crate(c, 700, 860, 1.0, { tone: 0.8, seed: 25 });
      Z.crate(c, 800, 866, 0.9, { tone: 0.78, seed: 26 });
      Z.flag(c, 640, 620, 140, t, { text: '酒', seed: 27, size: 24 });
      // 押送的军汉（倒地：药酒）
      const down = clamp(ss(1.0, 2.0, lt));
      Z.fighter(c, 1320, 892, 1.02, t, { flip: 1, spear: 1, tone: 0.7, seed: 30 });
      Z.fighter(c, 1520, 892, 0.98, t, { flip: 1, spear: 1, tone: 0.7, seed: 31 });
      // 公孙胜（左，望风）
      Z.gongsun(c, 1000, 892, 1.46, t, { fuchen: 1, crown: 1, raise: clamp(ss(0.3, 1.2, lt)) * 0.6 });
      if (down > 0.3) {
        for (let i = 0; i < 8; i++) {
          const dx = 1280 + ((t * 60 + i * 90) % 400), dy = 780 + (i % 3) * 40;
          Z.wire(c, [[dx, dy], [dx + 18, dy - 8]], { w: 1.8, tone: 0.45, seed: 1910 + i, taper: 0.8 });
        }
      }
    });
    Z.bigText(c, '智取生辰纲', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ③ 石碣村：芦苇荡中破了官兵何涛
SCENES['gs3_shijie'] = (() => {
  const p = () => Z.paper('gs3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 570, amp: 150, tone: 0.28, seed: 41 }]);
      Z.ground(c, 900, { seed: 42, tone: 0.4 });
      // 芦苇（活气：摇曳）
      for (let i = 0; i < 22; i++) {
        const rx = 60 + i * 88, sway = Math.sin(t * 1.6 + i * 0.7) * 9;
        Z.wire(c, [[rx, 900], [rx + sway, 800], [rx + sway * 1.6, 720]], { w: 2, tone: 0.5, seed: 50 + i, taper: 0.4 });
      }
      // 官船（右）
      Z.boat(c, 1420, 830, 1.05, t, { tone: 0.8, seed: 55 });
      Z.fighter(c, 1420, 800, 0.8, t, { flip: 1, spear: 1, tone: 0.66, seed: 56 });
      // 公孙胜（左，作法起风）
      const cast = clamp(ss(0.6, 1.8, lt));
      Z.gongsun(c, 760, 892, 1.48, t, { fuchen: 1, crown: 1, cast, raise: cast * 0.8 });
      // 朱砂雷符（第一处朱砂）
      Z.leifu(c, 980, 640, 1.0, cast, { seed: 190 });
      // 风（动势线）
      for (let i = 0; i < 10; i++) {
        const fx = ((t * 150 + i * 200) % 1900) + 10, fy = 420 + (i % 4) * 110;
        Z.wire(c, [[fx, fy], [fx + 46, fy - 10]], { w: 1.8, tone: 0.36, seed: 1920 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '石碣村破官兵', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 罗天大醮：梁山设七昼夜罗天大醮，祈禳谢天
SCENES['gs4_jiao'] = (() => {
  const p = () => Z.paper('gs4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 71, tone: 0.4 });
      Z.cloud(c, t, { x: 1500, y: 170, s: 1.2, seed: 72, tone: 0.3 });
      // 醮坛（三层台）
      for (let i = 0; i < 3; i++) {
        const tw = 300 - i * 70, ty = 880 - i * 90;
        Z.lined(c, [[960 - tw, ty], [960 + tw, ty], [960 + tw - 20, ty - 24], [960 - tw + 20, ty - 24]],
          { w: 3.2, tone: 0.84, seed: 73 + i, hatch: 0.1 });
      }
      Z.flag(c, 700, 500, 200, t, { text: '羅天大醮', seed: 76, size: 26 });
      Z.flag(c, 1220, 500, 200, t, { text: '祈禳', seed: 77, size: 26 });
      // 香炉 + 香烟（活气）
      Z.lined(c, [[880, 700], [1040, 700], [1030, 660], [890, 660]], { w: 3, tone: 0.86, seed: 78 });
      for (let i = 0; i < 8; i++) {
        const sy = 650 - ((t * 40 + i * 70) % 380), sx = 960 + Math.sin((sy + i * 50) * 0.02 + t) * 24;
        Z.wire(c, [[sx, sy], [sx + 8, sy - 14]], { w: 1.5, tone: 0.32, seed: 1930 + i, taper: 0.8 });
      }
      // 公孙胜（坛上作法）
      const cast = clamp(ss(0.4, 1.6, lt));
      Z.gongsun(c, 960, 700, 1.42, t, { fuchen: 1, crown: 1, cast, raise: cast });
      Z.leifu(c, 1160, 620, 0.9, cast, { seed: 194 });
    });
    Z.bigText(c, '罗天大醮', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 斗法破高廉：五雷天罡正法破妖术（朱砂：雷符）
SCENES['gs5_pofa'] = (() => {
  const p = () => Z.paper('gs5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 101, tone: 0.44 });
      Z.mountains(c, c, -60, 1980, [{ y0: 550, amp: 170, tone: 0.3, seed: 102 }]);
      Z.guan(c, 1560, 780, 0.92, { tone: 0.84, seed: 103, text: '高唐州' });
      // 高廉（妖道：黑风妖术）
      Z.fighter(c, 1360, 892, 1.2, t, { flip: 1, helmet: 1, blade: 1, tone: 0.86, seed: 110 });
      for (let i = 0; i < 7; i++) {   // 妖风（黑气）
        const a = -1.4 + i * 0.32 + Math.sin(t * 2.2 + i) * 0.12;
        Z.wire(c, [[1360 - Math.cos(a) * 60, 640 - Math.sin(a) * 60], [1360 - Math.cos(a) * 190, 640 - Math.sin(a) * 190]],
          { w: 3.4, tone: 0.6, seed: 120 + i, taper: 0.9 });
      }
      // 公孙胜（左，作法破法）
      const cast = clamp(ss(0.8, 2.0, lt));
      Z.gongsun(c, 700, 892, 1.5, t, { sword: 1, fuchen: 0, crown: 1, cast, raise: cast });
      // 五雷（朱砂雷符 + 雷纹放射）
      Z.leifu(c, 900, 560, 1.15, cast, { seed: 196 });
      if (cast > 0.3) {
        for (let i = 0; i < 6; i++) {
          const a = -0.9 + i * 0.3 + Math.sin(t * 3 + i) * 0.08;
          Z.wire(c, [[900 + Math.cos(a) * 70, 560 + Math.sin(a) * 70],
                     [900 + Math.cos(a) * 230, 560 + Math.sin(a) * 230]],
            { w: 3, tone: 0.7, seed: 1950 + i, taper: 0.85 });
        }
      }
      // 雷火（活气）
      for (let i = 0; i < 5; i++) Z.flame(c, 1240 + i * 60, 700 + (i % 2) * 40, 0.44, t, { seed: 130 + i, tone: 0.6 });
    });
    Z.bigText(c, '斗法破高廉', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 北征：随宋江北征田虎、王庆，雷法破阵
SCENES['gs6_zhengtao'] = (() => {
  const p = () => Z.paper('gs6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 190, tone: 0.32, seed: 141 }]);
      Z.ground(c, 900, { seed: 142, tone: 0.44 });
      Z.flag(c, 1580, 500, 200, t, { text: '宋', seed: 143, size: 32 });
      Z.tent(c, 320, 800, 0.95, { tone: 0.76, seed: 144, text: '' });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1420 + i * 128, 892, 0.96, t, { flip: 1, blade: 1, tone: 0.72, seed: 150 + i });
      // 公孙胜（阵前作法）
      const cast = clamp(ss(0.4, 1.6, lt));
      Z.gongsun(c, 700, 892, 1.48, t, { sword: 1, crown: 1, cast, raise: cast });
      Z.leifu(c, 880, 620, 1.0, cast, { seed: 197 });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 110 + i * 165) % 1500) + 280, dy = 800 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1960 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '北征破阵', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑦ 别众：功成之后，奉师命辞别众兄弟
SCENES['gs7_bie'] = (() => {
  const p = () => Z.paper('gs7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 210, tone: 0.32, seed: 161 }, { y0: 660, amp: 120, tone: 0.22, seed: 162 }]);
      Z.cloud(c, t, { x: 400, y: 190, s: 1.1, seed: 163, tone: 0.3 });
      Z.ground(c, 900, { seed: 164, tone: 0.42 });
      Z.shanzhai(c, 1560, 700, 0.9, { tone: 0.76, seed: 165, text: '梁山' });
      // 众兄弟（送别，复用宋江）
      Z.songjiang(c, 1480, 892, 1.34, t, { official: 1, raise: clamp(Math.sin(t * 1.2) * 0.16 + 0.16) });
      // 公孙胜（左，作揖辞别，挑拂尘）
      Z.gongsun(c, 760, 892, 1.48, t, { fuchen: 1, crown: 1, raise: clamp(ss(0.3, 1.4, lt)) * 0.5 });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 330 + ((t * 34 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.36, seed: 1916 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '奉师命辞别', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 归山修道：回蓟州二仙山，梁山唯一全身而退（朱砂：钤印）
SCENES['gs8_xiu'] = (() => {
  const p = () => Z.paper('gs8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 250, tone: 0.36, seed: 181 }, { y0: 660, amp: 130, tone: 0.24, seed: 182 }]);
      Z.cloud(c, t, { x: 1480, y: 170, s: 1.3, seed: 183, tone: 0.32 });
      Z.cloud(c, t, { x: 360, y: 230, s: 1.0, seed: 184, tone: 0.26 });
      Z.ground(c, 900, { seed: 185, tone: 0.4 });
      Z.pine(c, t, { x: 380, y: 890, s: 1.1, seed: 186, tone: 0.84 });
      Z.pine(c, t, { x: 1680, y: 890, s: 0.95, seed: 187, tone: 0.8 });
      // 二仙山（观宇）
      Z.guan(c, 1480, 720, 0.9, { tone: 0.8, seed: 188, text: '二仙山' });
      // 公孙胜（山中独行，拂尘）
      const walk = clamp(ss(0.2, 3.4, lt));
      Z.gongsun(c, lerp(700, 900, walk * 0.7), 892, lerp(1.48, 1.3, walk * 0.5), t, { fuchen: 1, crown: 1 });
      // 云气（活气：入云龙之"云"）
      for (let i = 0; i < 6; i++) {
        const cx = ((t * 24 + i * 320) % 1900) + 10, cy = 480 + Math.sin(t * 0.8 + i) * 30;
        Z.wire(c, [[cx, cy], [cx + 60, cy - 12], [cx + 120, cy + 4]], { w: 1.8, tone: 0.3, seed: 1970 + i, taper: 0.7 });
      }
      if (lt > 1.4) {
        c.save(); c.globalAlpha = 0.8 * clamp(ss(1.4, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('归二仙山修道，梁山唯一全身而退', 960, 320);
        c.restore();
      }
    });
    Z.bigText(c, '入云龙归山', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '入云龙', clamp(ss(0.8, 2.4, lt)), { size: 28 });
  } };
})();
})();
