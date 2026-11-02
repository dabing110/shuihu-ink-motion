// 《水浒传·时迁》rig + 九幕（宋元版画线描 + 焦墨）
// 造型：高唐州人氏，飞檐走壁、没昼没夜的飞贼，身轻似絮，落地无声，绰号「鼓上蚤」，
//   梁山排名第一百零七（地贼星），职司军中走报机密（偷盗细作之事）。
//   征方腊还朝途中患搅肠痧而死——不说结局圆满，也不抹去功劳。
//   特征：① 夜行紧身衣（signature，焦墨重笔）② 蒙面巾 ③ 背囊与撬具 ④ 火折。
// 唯一的彩：朱砂只用于① 第六幕翠云楼的火 ② 末幕「鼓上蚤」钤印。
// 母题：① 夜行 ② 檐脊 ③ 火 ④ 囊中物。
// 弧光：飞贼出身 → 祝家庄偷鸡惹祸 → 随杨雄石秀上梁山 → 盗甲赚徐宁 → 钩镰枪成 →
//       火烧翠云楼 → 细作往来 → 随军征讨 → 客死途中。
// 依《水浒传》第四十六至四十七回、第五十六回、第六十六回、第一百十九回。
// 互文：第四、五幕与呼延灼片互为因果——他盗来的钩镰枪，正是破连环马的那把钥匙。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 火折 / 火种（一线火星 + 朱砂点）
Z.huozhe = (c, x, y, s, t, { seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[0, 0], [0, -34]], { w: 3, tone: 0.9, seed, taper: 0.1 });
  for (let i = 0; i < 5; i++) {
    const a = -1.6 + i * 0.4 + Math.sin(t * 6 + i) * 0.2;
    Z.wire(c, [[0, -34], [Math.cos(a) * 16, -34 + Math.sin(a) * 16]], { w: 1.6, tone: 0.5, seed: seed + 5 + i, taper: 0.9 });
  }
  c.fillStyle = 'rgba(183,51,46,.6)';
  for (let i = 0; i < 4; i++) {
    c.beginPath(); c.arc(Math.sin(t * 5 + i) * 6, -40 - i * 10 - (t * 24 % 20), 1.8 + (i % 2), 0, 7); c.fill();
  }
  c.restore();
};

// 背囊（盗得的物件）
Z.beinang = (c, x, y, s, { tone = 0.86, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.lined(c, [[-34, 0], [-44, -46], [0, -62], [44, -46], [34, 0]], { w: 2.8, tone, seed, hatch: 0.2, gap: 8 });
  Z.wire(c, [[-34, 0], [34, 0]], { w: 2.6, tone, seed: seed + 1 });
  Z.wire(c, [[-40, -30], [40, -30]], { w: 1.8, tone: tone * 0.7, seed: seed + 2 });
  c.restore();
};

// 檐脊（他为数不多的「主场」：屋顶）
Z.yanji = (c, x, y, w, s, { tone = 0.84, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.roof(c, 0, 0, w, 70, { tone, seed });
  Z.wire(c, [[-w / 2, 8], [w / 2, 8]], { w: 3, tone: tone * 0.9, seed: seed + 1 });
  c.restore();
};

// ============================== 时迁本体 ==============================
// o: { mask蒙面, dark夜行, bag背囊, flip, raise, crouch蹲行, hang倒挂, sick病, down, tone }
Z.shiqian = (c, x, y, s, t, o = {}) => {
  const {
    mask = 1, bag = 0, flip = 0, raise = 0, crouch = 0, hang = 0,
    sick = 0, down = 0, tone = 0.96,
  } = o;
  const br = Math.sin(t * 2.2) * 2;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  if (hang) c.rotate(Math.PI);
  if (down) c.rotate(down * 0.7);
  const ly = -(crouch ? 34 : 0);
  const shoulderY = ly - 128 - (crouch ? 0 : 0);
  const waistY = ly - 62;
  const hipY = ly - 16;

  // ---- 下身（紧身裤 + 软靴）----
  const bend = crouch ? 26 : 0;
  Z.wire(c, [[-26, hipY], [-34 - bend * 0.6, hipY + 34], [-26 - bend, ly]], { w: 3.6, tone, seed: 20, taper: 0.1 });
  Z.wire(c, [[26, hipY], [34 + bend * 0.6, hipY + 34], [26 + bend, ly]], { w: 3.6, tone, seed: 21, taper: 0.1 });
  Z.lined(c, [[-26 - bend, ly], [-48 - bend, ly - 4], [-50 - bend, ly + 14], [-24, ly + 12]], { w: 2.4, tone: tone * 0.9, seed: 22 });
  Z.lined(c, [[26 + bend, ly], [48 + bend, ly - 4], [50 + bend, ly + 14], [24, ly + 12]], { w: 2.4, tone: tone * 0.9, seed: 23 });

  // ---- 躯干（夜行紧身）----
  const body = [[-40, shoulderY + 4], [-46, waistY], [-38, hipY], [38, hipY], [46, waistY], [40, shoulderY + 4]];
  Z.lined(c, body, { w: 3.2, tone, seed: 30, hatch: 0.26, gap: 6, hatchAng: -1.1 });
  c.save(); c.fillStyle = 'rgba(26,26,28,.2)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  Z.wire(c, [[-44, waistY], [44, waistY], [44, waistY + 16], [-44, waistY + 16], [-44, waistY]], { w: 3, tone, seed: 31, taper: 0.06 });
  for (let i = 0; i < 3; i++) Z.wire(c, [[-38, shoulderY + 22 + i * 18], [38, shoulderY + 22 + i * 18]], { w: 1.6, tone: tone * 0.5, seed: 32 + i });

  // ---- 双臂（攀爬）----
  const handY = shoulderY + 40 - raise * 48;
  Z.wire(c, [[-40, shoulderY + 10], [-76, shoulderY + 30 - raise * 22], [-72, handY - raise * 14]], { w: 3.4, tone, seed: 40, taper: 0.1 });
  Z.wire(c, [[40, shoulderY + 10], [76, shoulderY + 26 - raise * 20], [72, handY - raise * 22]], { w: 3.4, tone, seed: 41, taper: 0.1 });
  Z.lined(c, [[-72, handY - raise * 14], [-58, handY + 4 - raise * 14], [-46, handY - 6 - raise * 14]], { w: 2, tone: tone * 0.88, seed: 42 });
  Z.lined(c, [[72, handY - raise * 22], [58, handY - 6 - raise * 22], [46, handY - 16 - raise * 22]], { w: 2, tone: tone * 0.88, seed: 43 });

  // ---- 头（尖腮瘦身 + 蒙面）----
  const hy = shoulderY - 32 + br * 0.5 + sick * 10;
  const face = [[-17, hy - 10], [-15, hy - 30], [0, hy - 40], [15, hy - 30], [17, hy - 10], [15, hy + 12], [0, hy + 22], [-15, hy + 8]];
  Z.lined(c, face, { w: 2.4, tone: tone * 0.95, seed: 100, hatch: 0.08, gap: 8 });
  // 眼睛（滴溜转，贼的眼）
  const eye = Math.sin(t * 3.1) * 2;
  Z.wire(c, [[-12, hy - 14 + eye * 0.3], [-5, hy - 14]], { w: 2, tone, seed: 101 });
  Z.wire(c, [[5, hy - 14], [12, hy - 14 + eye * 0.3]], { w: 2, tone, seed: 102 });
  c.fillStyle = 'rgba(26,26,28,.9)';
  c.beginPath(); c.arc(-8.5, hy - 12 + eye * 0.3, 2.2, 0, 7); c.fill();
  c.beginPath(); c.arc(8.5, hy - 12 + eye * 0.3, 2.2, 0, 7); c.fill();
  if (mask) {
    Z.wire(c, [[-17, hy + 2], [17, hy + 2], [15, hy + 12], [0, hy + 20], [-15, hy + 8]], { w: 2.4, tone: tone * 0.92, seed: 103 });
  } else {
    Z.wire(c, [[-7, hy + 8], [7, hy + 7]], { w: 2, tone: tone * 0.8, seed: 104 });
  }
  Z.wire(c, [[-19, hy - 14], [-16, hy - 38], [16, hy - 38], [19, hy - 14]], { w: 2.6, tone: 0.94, seed: 130 });
  Z.wire(c, [[-16, hy - 38], [-8, hy - 52], [8, hy - 52], [16, hy - 38]], { w: 2.6, tone: 0.94, seed: 131 });

  // ---- 背囊 / 火折（必须在 restore 之前）----
  if (bag) Z.beinang(c, -56, shoulderY + 18, 0.8, { tone: tone * 0.9, seed: 170 });
  c.restore();
};

// ============================== 九幕 ==============================

// ① 飞贼出身：高一脚低一脚，人送绰号鼓上蚤
SCENES['sq1_feizei'] = (() => {
  const p = () => Z.paper('xq1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 5, tone: 0.42 });
      Z.manor(c, 1500, 790, 0.8, { tone: 0.8, seed: 6, text: '高唐州' });
      Z.yanji(c, 700, 640, 460, 0.9, { tone: 0.82, seed: 7 });
      const climb = clamp(ss(0.3, 2.2, lt));
      Z.shiqian(c, lerp(560, 700, climb), lerp(892, 616, climb), 1.5, t, { crouch: 1, bag: 1, raise: clamp(ss(0.3, 1.4, lt)) * 0.6 });
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 50 + i * 205) % 1980) - 30, by = 300 + ((t * 38 + i * 150) % 460);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.34, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '鼓上蚤', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 祝家庄偷鸡：一只报晓鸡惹出一场战争
SCENES['sq2_zhuojia'] = (() => {
  const p = () => Z.paper('xq2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 11, tone: 0.44 });
      Z.manor(c, 1520, 790, 0.84, { tone: 0.84, seed: 12, text: '祝家庄' });
      Z.shiqian(c, 900, 892, 1.5, t, { crouch: 1, raise: clamp(ss(0.3, 1.4, lt)) * 0.5, bag: 0 });
      // 报晓鸡（简笔）
      Z.lined(c, [[1000, 892], [1010, 856], [1040, 848], [1058, 862], [1046, 892], [1014, 890]],
        { w: 2.4, tone: 0.82, seed: 13, hatch: 0.16, gap: 7 });
      Z.wire(c, [[1010, 856], [1044, 860], [1040, 844]], { w: 2, tone: 0.86, seed: 14 });
      Z.wire(c, [[1000, 892], [1046, 892]], { w: 1.6, tone: 0.6, seed: 15 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1420 + i * 110, 892, 0.8, t, { flip: 1, spear: 1, tone: 0.66, seed: 16 + i });
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('偷了报晓鸡，惹出三打祝家庄', 940, 300);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 106 + i * 168) % 1400) + 300, dy = 830 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 6]], { w: 2, tone: 0.36, seed: 1962 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '偷鸡惹祸', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 同上梁山：杨雄石秀带他投奔梁山
SCENES['sq3_shangshan'] = (() => {
  const p = () => Z.paper('xq3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 190, tone: 0.3, seed: 21 }, { y0: 660, amp: 110, tone: 0.22, seed: 22 }]);
      Z.ground(c, 900, { seed: 23, tone: 0.44 });
      Z.shanzhai(c, 1560, 780, 0.86, { tone: 0.8, seed: 24, text: '梁山' });
      Z.shiqian(c, 900, 892, 1.46, t, { raise: clamp(ss(0.3, 1.4, lt)) * 0.4 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1320 + i * 120, 892, 0.9, t, { flip: 1, blade: 1, tone: 0.68, seed: 25 + i });
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 48 + i * 210) % 1960) - 30, by = 320 + ((t * 32 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1913 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '同上梁山', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ④ 盗甲赚徐宁：夜入东京，盗取雁翎砌就圈金甲
SCENES['sq4_daojia'] = (() => {
  const p = () => Z.paper('xq4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 31, tone: 0.42 });
      Z.manor(c, 1520, 800, 0.92, { tone: 0.86, seed: 32, text: '东京' });
      Z.yanji(c, 1500, 470, 620, 1.0, { tone: 0.82, seed: 33 });
      const climb = clamp(ss(0.3, 2.4, lt));
      Z.shiqian(c, lerp(620, 1420, climb), lerp(892, 440, climb), 1.42, t, { crouch: climb > 0.5 ? 1 : 0, hang: 0, raise: 0.7 });
      // 雁翎金圈甲：梁上悬着一领锁子甲（铁线描勾轮廓、纵向排线作甲片），被他取走后消失
      const aa = clamp(ss(0.5, 1.4, lt)) * (1 - clamp(ss(2.5, 3.0, lt)));
      if (aa > 0.01) {
        c.save(); c.translate(1500, 486); c.globalAlpha = aa;
        Z.wire(c, [[0, -66], [0, -8]], { w: 2, tone: 0.7, seed: 51, taper: 0.3 });          // 悬梁的绳
        Z.wire(c, [[-54, -8], [-40, 30], [40, 30], [54, -8]], { w: 3, tone: 0.86, seed: 41, taper: 0.05 }); // 双肩
        Z.wire(c, [[-40, 30], [-44, 92], [44, 92], [40, 30]], { w: 3.2, tone: 0.9, seed: 42, taper: 0.04 }); // 甲身
        for (let i = -3; i <= 3; i++)
          Z.wire(c, [[i * 13, 32], [i * 12.6, 90]], { w: 1.4, tone: 0.48, seed: 43 + i, taper: 0.5 });
        Z.wire(c, [[-44, 92], [-54, 138], [54, 138], [44, 92]], { w: 2.6, tone: 0.86, seed: 50, taper: 0.06 }); // 甲裙
        for (let i = -2; i <= 2; i++)
          Z.wire(c, [[i * 21, 94], [i * 23, 136]], { w: 1.3, tone: 0.42, seed: 60 + i, taper: 0.5 });
        c.globalAlpha = aa * 0.92; c.strokeStyle = 'rgba(183,51,46,.7)'; c.lineWidth = 2.6;
        c.beginPath(); c.arc(0, 20, 22, 0.2, Math.PI - 0.2); c.stroke();                     // 圈金领口
        c.restore();
      }
      // 金甲梁上的朱砂微光（锁子甲所在：只留一点暗示）
      c.save(); c.globalAlpha = clamp(ss(1.6, 2.6, lt)); c.fillStyle = 'rgba(183,51,46,.34)';
      c.beginPath(); c.ellipse(1500, 452, 46, 16, 0, 0, 7); c.fill(); c.restore();
      if (lt > 1.6) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.6, 2.6, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('攀梁而入，盗取雁翎金甲', 940, 760);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 300 + ((t * 34 + i * 150) % 300);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.3, seed: 1914 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '盗甲赚徐宁', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 钩镰枪成：他盗来的正是破连环马的那把钥匙
SCENES['sq5_goulian'] = (() => {
  const p = () => Z.paper('xq5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 180, tone: 0.3, seed: 41 }]);
      Z.ground(c, 900, { seed: 42, tone: 0.44 });
      Z.flag(c, 380, 560, 190, t, { text: '梁山', seed: 43, size: 30 });
      Z.shiqian(c, 700, 892, 1.44, t, { raise: clamp(ss(0.3, 1.4, lt)) * 0.4, bag: 1 });
      // 钩镰枪（演示：长杆 + 钩）
      for (let i = 0; i < 3; i++) {
        const yy = 780 + Math.sin(t * 1.6 + i) * 8;
        Z.wire(c, [[1040 + i * 90, 900], [1050 + i * 90, 720], [1030 + i * 90, 640]], { w: 3, tone: 0.86, seed: 44 + i, taper: 0.06 });
        Z.wire(c, [[1050 + i * 90, 720], [1092 + i * 90, 700]], { w: 2.6, tone: 0.84, seed: 47 + i });
      }
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('钩镰枪法成，专破连环马', 900, 300);
        c.restore();
      }
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 110 + i * 168) % 1500) + 300, dy = 840 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.36, seed: 1976 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '钩镰枪法', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 火烧翠云楼：大名府元宵，他一把火先起，城池遂破（朱砂火）
SCENES['sq6_cuiyunlou'] = (() => {
  const p = () => Z.paper('xq6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 51, tone: 0.42 });
      Z.tower(c, 1180, 880, 1.0, { tone: 0.86, seed: 52, text: '翠云楼' });
      Z.shiqian(c, 900, 640, 1.3, t, { raise: 0.8, tone: 0.96 });
      Z.huozhe(c, 960, 700, 1.2, t, { seed: 53 });
      for (let i = 0; i < 4; i++) Z.flame(c, 1120 + i * 90, 700, 0.7 + (i % 2) * 0.3, t, { seed: 54 + i, tone: 0.72 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1560 + i * 110, 892, 0.8, t, { flip: 1, blade: 1, tone: 0.66, seed: 58 + i });
      for (let i = 0; i < 14; i++) {
        const sy = 760 - ((t * 60 + i * 120) % 620), sx = 1160 + Math.sin((sy + i * 40) * 0.014 + t) * 90;
        Z.wire(c, [[sx, sy], [sx + 9, sy - 14]], { w: 1.6, tone: 0.34, seed: 1911 + i, taper: 0.8 });
      }
      if (lt > 1.4) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(1.4, 2.4, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('元宵放火，打破大名府', 700, 320);
        c.restore();
      }
    });
    Z.bigText(c, '火烧翠云楼', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 细作往来：曾头市、大名府，处处是他先入城
SCENES['sq7_xizuo'] = (() => {
  const p = () => Z.paper('xq7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 190, tone: 0.3, seed: 61 }, { y0: 660, amp: 110, tone: 0.22, seed: 62 }]);
      Z.ground(c, 900, { seed: 63, tone: 0.44 });
      Z.guan(c, 1540, 800, 0.82, { tone: 0.82, seed: 64, text: '曾头市' });
      Z.yanji(c, 620, 660, 420, 0.8, { tone: 0.78, seed: 65 });
      Z.shiqian(c, 620, 636, 1.2, t, { crouch: 1, raise: 0.4, tone: 0.94 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1300 + i * 110, 892, 0.72, t, { flip: 1, spear: 1, tone: 0.6, seed: 66 + i });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 108 + i * 168) % 1500) + 300, dy = 830 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 6]], { w: 2, tone: 0.36, seed: 1979 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '细作往来', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 随军征讨：征辽伐腊，他的夜里工夫照旧有用
SCENES['sq8_zhengtiao'] = (() => {
  const p = () => Z.paper('xq8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 470, amp: 230, tone: 0.32, seed: 71 }, { y0: 640, amp: 130, tone: 0.24, seed: 72 }]);
      Z.cloud(c, t, { x: 420, y: 170, s: 1.2, seed: 73, tone: 0.3 });
      Z.ground(c, 900, { seed: 74, tone: 0.44 });
      Z.tent(c, 1560, 800, 0.94, { tone: 0.8, seed: 75, text: '大营' });
      Z.flag(c, 360, 560, 190, t, { text: '宋', seed: 76, size: 30 });
      Z.shiqian(c, 900, 892, 1.46, t, { raise: clamp(ss(0.3, 1.4, lt)) * 0.4, bag: 1 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1320 + i * 120, 892, 0.86, t, { flip: 1, spear: 1, tone: 0.66, seed: 77 + i });
      for (let i = 0; i < 8; i++) {
        const dx = 1000 + ((t * 120 + i * 150) % 520), dy = 770 + (i % 3) * 46;
        Z.wire(c, [[dx, dy], [dx + 26, dy - 12]], { w: 2, tone: 0.44, seed: 1966 + i, taper: 0.8 });
      }
    });
    Z.bigText(c, '随军征讨', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑨ 客死途中：患搅肠痧而亡（盗贼也有结局，朱砂钤印）
SCENES['sq9_kesi'] = (() => {
  const p = () => Z.paper('xq9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 200, tone: 0.3, seed: 81 }, { y0: 660, amp: 110, tone: 0.2, seed: 82 }]);
      Z.cloud(c, t, { x: 460, y: 180, s: 1.2, seed: 83, tone: 0.3 });
      Z.ground(c, 900, { seed: 84, tone: 0.42 });
      Z.tent(c, 1560, 820, 0.82, { tone: 0.76, seed: 85, text: '途次' });
      const fall = clamp(ss(1.2, 2.8, lt));
      Z.shiqian(c, 860, 892 + fall * 20, 1.5, t, { sick: fall, crouch: fall, down: fall * 0.9, raise: 0.05, tone: 0.9 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1300 + i * 110, 892, 0.7, t, { flip: 1, tone: 0.54, seed: 86 + i });
      if (lt > 2.0) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(2.0, 3.0, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('班师途中，患搅肠痧而亡', 620, 320);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 44 + i * 210) % 1960) - 30, by = 320 + ((t * 30 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1992 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '客死途中', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '鼓上蚤', clamp(ss(0.9, 2.6, lt)), { size: 28 });
  } };
})();
})();
