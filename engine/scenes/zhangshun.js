// 《水浒传·张顺》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：江州人氏——遍体白肉、水底伏得七日七夜，水里功夫第一，绰号「浪里白条」；
//   与其兄张横同为浔阳江边好汉，后为梁山四寨水军头领之一。
//   特征：① 浪纹（signature：水中留白的水线）② 白肉（淡墨少笔，与众人焦墨对照）③ 鱼（鱼牙主人）。
// 唯一的彩：朱砂只用于① 第六幕涌金门中箭的血光 ② 第八幕「浪里白条」钤印——余皆黑白灰。
// 母题：① 浪纹 ② 白肉（留白）③ 鱼 ④ 涌金门。
// 弧光：江州鱼市 → 水里斗李逵 → 浪里白条扬名 → 夜渡请医 → 夜渡长江 →
//       涌金门中箭而死 → 魂捉方天定 → 追封金华将军，立庙享祭。
// 依《水浒传》第三十八、六十五、九十六、百回本末回。
// 互文：第二幕复用李逵（水里斗）、第四幕复用宋江（背疮请医）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 鱼（signature：鱼牙主人——侧身 + 尾鳍 + 鳞排线）
Z.fish = (c, x, y, s, t, { tone = 0.8, seed = 1, flip = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const wig = Math.sin(t * 2.4 + seed) * 4;
  Z.lined(c, [[-52, 0], [-20, -20], [26, -18], [50, 0], [26, 18], [-20, 20]], { w: 2.6, tone, seed, hatch: 0.12, gap: 7 });
  Z.wire(c, [[50, 0], [78, -16 + wig], [80, 18 + wig], [50, 0]], { w: 2.2, tone: tone * 0.9, seed: seed + 1 });
  Z.wire(c, [[-52, 0], [-62, -10], [-60, 10], [-52, 0]], { w: 2, tone: tone * 0.85, seed: seed + 2 });
  Z.wire(c, [[-10, -16], [10, -14]], { w: 1.6, tone: tone * 0.75, seed: seed + 3 });
  c.restore();
};

// 浪纹（signature：版画的水——一组平行弧线，不施色）
Z.wave = (c, x0, x1, y, n, t, { tone = 0.4, seed = 1, amp = 14 } = {}) => {
  for (let i = 0; i < n; i++) {
    const yy = y + i * 26, ph = t * 1.2 + i * 0.9;
    const pts = [];
    for (let x = x0; x <= x1; x += 40) pts.push([x, yy + Math.sin(x * 0.006 + ph) * amp]);
    Z.wire(c, pts, { w: 1.8, tone, seed: seed + i, taper: 0.9, amp: 0.4 });
  }
};

// 血光（朱砂：涌金门中箭——弧线笔触 + 点簇 + 飞溅）
Z.blood2 = (c, x, y, s, k, { seed = 1 } = {}) => {
  if (k <= 0.01) return;
  c.save(); c.translate(x, y); c.scale(s, s);
  c.save(); c.globalAlpha = 0.5 + 0.34 * k;
  Z.wire(c, [[-34, 20], [18, -14], [70, 20]], { w: 6, tone: 0.52, seed, taper: 0.86, amp: 0.5 });
  c.restore();
  c.save(); c.globalAlpha = 0.72 + 0.28 * k; c.lineCap = 'round';
  c.strokeStyle = 'rgba(183,51,46,.86)'; c.lineWidth = 6.5;
  c.beginPath(); c.moveTo(8, 14); c.quadraticCurveTo(44, -28, 90, -50); c.stroke();
  c.strokeStyle = 'rgba(183,51,46,.7)'; c.lineWidth = 4;
  c.beginPath(); c.moveTo(16, 24); c.quadraticCurveTo(52, -6, 96, -22); c.stroke();
  c.restore();
  c.save(); c.globalAlpha = 0.78 + 0.22 * k; c.fillStyle = 'rgba(183,51,46,.85)';
  const burst = [[12, 8, 12], [24, 0, 10], [34, 18, 11], [2, 20, 8], [26, 32, 7],
                 [42, 6, 9], [8, -8, 7], [52, 22, 8], [36, 36, 6], [0, 10, 7],
                 [60, 12, 6], [46, -4, 5], [18, 38, 5], [66, 30, 5]];
  for (const [dx, dy, r] of burst) c.fillRect(dx - r / 2, dy - r / 2, r, r);
  c.fillStyle = 'rgba(183,51,46,.62)';
  c.fillRect(22, 10, 15, 15); c.fillRect(56, 24, 11, 11);
  c.restore();
  c.restore();
};

// ============================== 张顺本体 ==============================
// o: { bare赤膊, turban头巾, knife尖刀, fish鱼, flip, raise, swim, hurt, tone }
Z.zhangshun = (c, x, y, s, t, o = {}) => {
  const {
    bare = 1, turban = 1, knife = 0, fish = 0, flip = 0, raise = 0,
    swim = 0, hurt = 0, tone = 0.82,
  } = o;
  const br = Math.sin(t * 1.6) * 2.2;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(swim ? 60 : 0) - (hurt ? 30 : 0);
  const shoulderY = ly - 148;
  const waistY = ly - 74;
  const hipY = ly - 24;

  // ---- 腿（水中则隐）----
  if (swim < 0.5) {
    Z.wire(c, [[-26, hipY], [-34, hipY + 44], [-30, ly]], { w: 3.2, tone, seed: 60, taper: 0.1 });
    Z.wire(c, [[26, hipY], [34, hipY + 44], [30, ly]], { w: 3.2, tone, seed: 61, taper: 0.1 });
    Z.wire(c, [[-30, ly], [-48, ly - 4], [-50, ly + 12], [-28, ly + 9]], { w: 2.4, tone: tone * 0.85, seed: 62 });
    Z.wire(c, [[30, ly], [48, ly - 4], [50, ly + 12], [28, ly + 9]], { w: 2.4, tone: tone * 0.85, seed: 63 });
  } else {
    Z.wire(c, [[-26, hipY], [-40, hipY + 26]], { w: 2.8, tone: tone * 0.8, seed: 64, taper: 0.5 });
    Z.wire(c, [[26, hipY], [40, hipY + 26]], { w: 2.8, tone: tone * 0.8, seed: 65, taper: 0.5 });
  }

  // ---- 躯干（白肉：淡墨少笔、大面积留白，signature）----
  const body = [[-46, shoulderY + 6], [-50, waistY + 4], [-44, hipY], [44, hipY], [50, waistY + 4], [46, shoulderY + 6]];
  Z.lined(c, body, { w: 2.8, tone: bare ? tone * 0.72 : tone, seed: 71, hatch: bare ? 0.05 : 0.16, gap: 12 });
  c.save(); c.fillStyle = 'rgba(232,230,222,.55)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  if (!bare) {
    Z.wire(c, [[-22, shoulderY + 4], [0, shoulderY + 30], [22, shoulderY + 4]], { w: 2.6, tone: tone * 0.9, seed: 72 });
  }
  Z.wire(c, [[-48, waistY + 2], [48, waistY + 2], [48, waistY + 16], [-48, waistY + 16], [-48, waistY + 2]], { w: 2.8, tone, seed: 73, taper: 0.06 });

  // ---- 双臂 ----
  const handY = shoulderY + 50 - raise * 40;
  Z.wire(c, [[-46, shoulderY + 12], [-68, shoulderY + 44], [-60, handY + 6]], { w: 3, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[46, shoulderY + 12], [68, shoulderY + 40 - raise * 24], [60, handY - raise * 32]], { w: 3, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[-60, handY + 4], [-48, handY + 20], [-38, handY + 6], [-48, handY - 10]], { w: 2.1, tone: tone * 0.8, seed: 82 });
  Z.lined(c, [[60, handY - 4], [48, handY + 12], [38, handY - 2], [48, handY - 18]], { w: 2.1, tone: tone * 0.8, seed: 83 });

  // ---- 头 ----
  const hy = shoulderY - 34 + br * 0.5;
  const face = [[-20, hy - 12], [-17, hy - 34], [0, hy - 45], [17, hy - 34], [20, hy - 12], [18, hy + 12], [0, hy + 25], [-18, hy + 10]];
  Z.lined(c, face, { w: 2.5, tone: tone * 0.92, seed: 100, hatch: 0.05, gap: 9 });
  Z.wire(c, [[-13, hy - 13], [-4, hy - 11]], { w: 1.8, tone, seed: 101 });
  Z.wire(c, [[4, hy - 11], [13, hy - 13]], { w: 1.8, tone, seed: 102 });
  Z.wire(c, [[-10, hy - 4], [-4, hy - 3]], { w: 1.5, tone, seed: 103 });
  Z.wire(c, [[4, hy - 3], [10, hy - 4]], { w: 1.5, tone, seed: 104 });
  Z.wire(c, [[-6, hy + 4], [6, hy + 3]], { w: 1.5, tone: tone * 0.75, seed: 105 });
  // 头巾（水手巾）
  if (turban) {
    Z.wire(c, [[-22, hy - 18], [-18, hy - 40], [18, hy - 40], [22, hy - 18]], { w: 2.4, tone: 0.86, seed: 110 });
    Z.wire(c, [[-22, hy - 18], [22, hy - 18]], { w: 2, tone: 0.7, seed: 111 });
    const rib = Math.sin(t * 2.1) * 0.3;
    Z.wire(c, [[22, hy - 26], [48 + rib * 14, hy - 20 - rib * 8]], { w: 1.7, tone: 0.68, seed: 112 });
  }
  // 手持件
  if (knife) {
    c.save(); c.translate(60, handY - 4); c.rotate(-0.4);
    Z.wire(c, [[-30, 0], [22, 0]], { w: 3.4, tone, seed: 120, taper: 0.1 });
    Z.wire(c, [[-30, 0], [-42, 0]], { w: 4, tone: tone * 0.9, seed: 121 });
    c.restore();
  }
  if (fish) Z.fish(c, -66, handY + 26, 1.0, t, { tone, seed: 125 });
  c.restore();
};

// ============================== 八幕 ==============================

// ① 江州鱼市：鱼牙主人张顺（鱼 + 浪纹）
SCENES['zs1_yushi'] = (() => {
  const p = () => Z.paper('zs1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 570, amp: 150, tone: 0.26, seed: 11 }]);
      Z.ground(c, 900, { seed: 12, tone: 0.4 });
      Z.wave(c, 1180, 1900, 830, 4, t, { tone: 0.34, seed: 13 });
      // 鱼摊（案 + 鱼）
      Z.lined(c, [[560, 800], [860, 796], [866, 830], [554, 834]], { w: 3.2, tone: 0.84, seed: 14, hatch: 0.1 });
      for (const px of [580, 830]) Z.wire(c, [[px, 830], [px, 900]], { w: 3, tone: 0.82, seed: 15, taper: 0.08 });
      Z.fish(c, 660, 780, 0.8, t, { tone: 0.8, seed: 16 });
      Z.fish(c, 780, 782, 0.72, t, { tone: 0.76, seed: 17, flip: 1 });
      Z.flag(c, 480, 600, 150, t, { text: '魚市', seed: 18, size: 26 });
      Z.zhangshun(c, 1120, 892, 1.48, t, { bare: 1, fish: 1, raise: clamp(Math.sin(t * 1.3) * 0.18 + 0.18) });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 50 + i * 230) % 1960) - 30, by = 340 + ((t * 38 + i * 150) % 450);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.36, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '江州鱼牙主人', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 水里斗李逵：江中把李逵淹个半死（复用李逵）
SCENES['zs2_shuidou'] = (() => {
  const p = () => Z.paper('zs2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 2.8)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 560, amp: 170, tone: 0.28, seed: 21 }]);
      // 满幅浪（水中：留白 + 水线）
      Z.wave(c, 0, 1920, 780, 6, t, { tone: 0.36, seed: 22, amp: 18 });
      Z.wave(c, 0, 1920, 640, 3, t, { tone: 0.26, seed: 23, amp: 12 });
      // 李逵（在水中挣扎：只露头肩）
      Z.likui(c, 1420, 830, 1.24, t, { axe: 0, rage: 0.8, raise: clamp(Math.sin(t * 4) * 0.4 + 0.5), tone: 0.9 });
      // 张顺（水中白条：只露头肩，游来）
      const swim = clamp(ss(0.2, 1.6, lt));
      Z.zhangshun(c, lerp(1180, 780, swim), 820, 1.4, t, { bare: 1, swim: 1, raise: 0.4 });
      // 水花（活气）
      for (let i = 0; i < 14; i++) {
        const dx = ((t * 130 + i * 140) % 1500) + 300, dy = 700 + ((t * 50 + i * 60) % 160);
        Z.wire(c, [[dx, dy], [dx + 20, dy - 14]], { w: 1.8, tone: 0.42, seed: 1910 + i, taper: 0.8 });
      }
    });
    Z.bigText(c, '水里斗李逵', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ③ 浪里白条：水底伏得七日七夜
SCENES['zs3_bailang'] = (() => {
  const p = () => Z.paper('zs3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 190, tone: 0.3, seed: 31 }, { y0: 660, amp: 110, tone: 0.2, seed: 32 }]);
      Z.wave(c, 0, 1920, 800, 7, t, { tone: 0.34, seed: 33, amp: 20 });
      Z.cloud(c, t, { x: 1520, y: 180, s: 1.1, seed: 34, tone: 0.3 });
      // 张顺（踏浪而行）
      Z.zhangshun(c, 960, 850, 1.52, t, { bare: 1, swim: 0, raise: clamp(Math.sin(t * 1.6) * 0.3 + 0.3) });
      Z.wave(c, 700, 1240, 880, 3, t, { tone: 0.44, seed: 35, amp: 16 });
      // 游鱼（活气 + signature）
      for (let i = 0; i < 5; i++) {
        const fx = ((t * 60 + i * 380) % 1900) + 10, fy = 700 + (i % 3) * 70;
        Z.fish(c, fx, fy, 0.62, t, { tone: 0.55, seed: 40 + i });
      }
    });
    Z.bigText(c, '浪里白条', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 请医：宋江背发背疮，张顺夜去建康请安道全（复用宋江）
SCENES['zs4_qingyi'] = (() => {
  const p = () => Z.paper('zs4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 51, tone: 0.4 });
      Z.wire(c, [[1180, 900], [1180, 600], [1720, 600], [1720, 900]], { w: 3.4, tone: 0.86, seed: 52 });
      Z.roof(c, 1450, 600, 580, 130, { tone: 0.9, seed: 53 });
      Z.hatchBox(c, [[1180, 900], [1720, 900], [1720, 600], [1180, 600]], { ang: -1.4, gap: 22, tone: 0.1, seed: 54 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.66)'; c.font = '30px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('安神醫', 1450, 720); c.restore();
      Z.songjiang(c, 700, 892, 1.42, t, { official: 1, hurt: 0.5, raise: clamp(Math.sin(t * 1.1) * 0.1 + 0.1) });
      Z.zhangshun(c, 1080, 892, 1.46, t, { bare: 1, knife: 1, raise: clamp(ss(0.3, 1.3, lt)) });
      Z.wave(c, 40, 640, 880, 2, t, { tone: 0.3, seed: 55, amp: 10 });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 44 + i * 240) % 1960) - 30, by = 340 + ((t * 34 + i * 150) % 430);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1916 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '夜请安道全', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 夜渡长江：雪夜渡江，斩了张旺（水贼）
SCENES['zs5_yedu'] = (() => {
  const p = () => Z.paper('zs5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 530, amp: 200, tone: 0.28, seed: 71 }]);
      Z.wave(c, 0, 1920, 820, 6, t, { tone: 0.34, seed: 72, amp: 20 });
      Z.wave(c, 0, 1920, 700, 3, t, { tone: 0.24, seed: 73, amp: 12 });
      Z.boat(c, 560, 840, 1.0, t, { tone: 0.78, seed: 74 });
      // 张顺（夜渡：水中）
      const swim = clamp(ss(0.3, 1.8, lt));
      Z.zhangshun(c, lerp(620, 1080, swim), 830, 1.46, t, { bare: 1, swim: 0.7, knife: 1, raise: 0.5 });
      Z.snow(c, t, { n: 80, seed: 75, speed: 1, tone: 0.42 });
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 120 + i * 190) % 1800) + 60, dy = 720 + ((t * 40 + i * 70) % 140);
        Z.wire(c, [[dx, dy], [dx + 22, dy - 12]], { w: 1.8, tone: 0.4, seed: 1920 + i, taper: 0.8 });
      }
    });
    Z.bigText(c, '雪夜渡长江', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 涌金门：征方腊攻打杭州，中箭死于涌金门下（朱砂：血光）
SCENES['zs6_yongjin'] = (() => {
  const p = () => Z.paper('zs6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 91, tone: 0.44 });
      // 涌金门（城门 + 城楼）
      Z.wire(c, [[1240, 900], [1240, 540], [1780, 540], [1780, 900]], { w: 3.8, tone: 0.88, seed: 92 });
      Z.roof(c, 1510, 540, 580, 130, { tone: 0.9, seed: 93 });
      Z.hatchBox(c, [[1240, 900], [1780, 900], [1780, 540], [1240, 540]], { ang: -1.35, gap: 20, tone: 0.12, seed: 94 });
      Z.wire(c, [[1400, 900], [1400, 700], [1540, 700], [1540, 900]], { w: 3.4, tone: 0.86, seed: 95 });   // 门洞
      c.save(); c.fillStyle = 'rgba(26,26,28,.7)'; c.font = '34px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('湧金門', 1470, 620); c.restore();
      // 城上守军（放箭）
      for (let i = 0; i < 3; i++) Z.fighter(c, 1300 + i * 130, 640, 0.66, t, { flip: 1, tone: 0.7, seed: 96 + i });
      // 乱箭（飞下）
      for (let i = 0; i < 7; i++) {
        const st = 0.6 + i * 0.28, k = clamp(ss(st, st + 0.5, lt));
        if (k <= 0 || k >= 1) continue;
        const ax = lerp(1420, 1060, k), ay = lerp(660, 780, k) + Math.sin(k * 3.1) * 20;
        Z.wire(c, [[ax - 26, ay - 18], [ax + 22, ay + 14]], { w: 2.2, tone: 0.9, seed: 1930 + i, taper: 0.1 });
      }
      // 张顺（城下，中箭）
      const hit = clamp(ss(1.6, 2.6, lt));
      Z.zhangshun(c, 1020, 892, 1.5, t, { bare: 1, knife: 1, hurt: hit, raise: clamp(ss(0.2, 1.2, lt)) });
      // 朱砂血光（本片第一处朱砂）
      if (hit > 0.2) Z.blood2(c, 1030, 768, 1.34, clamp((hit - 0.2) / 0.8), { seed: 2200 });
    });
    Z.bigText(c, '涌金门', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 魂捉方天定：张顺死后显圣，助兄弟破城
SCENES['zs7_hun'] = (() => {
  const p = () => Z.paper('zs7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 111, tone: 0.42 });
      Z.cloud(c, t, { x: 1200, y: 190, s: 1.3, seed: 112, tone: 0.34 });
      Z.cloud(c, t, { x: 500, y: 250, s: 1.0, seed: 113, tone: 0.28 });
      Z.wire(c, [[1300, 900], [1300, 640], [1780, 640], [1780, 900]], { w: 3.4, tone: 0.82, seed: 114 });
      Z.roof(c, 1540, 640, 520, 110, { tone: 0.84, seed: 115 });
      // 张顺魂影（半透明：淡墨 + 上浮）
      const rise = clamp(ss(0.2, 2.4, lt));
      c.save(); c.globalAlpha = 0.34 + 0.3 * rise;
      Z.zhangshun(c, 900, 892 - rise * 150, 1.44 + rise * 0.1, t, { bare: 1, knife: 1, raise: rise * 0.6, tone: 0.5 });
      c.restore();
      // 云气托举（活气）
      for (let i = 0; i < 8; i++) {
        const cx = 700 + ((t * 30 + i * 200) % 900), cy = 700 - rise * 60 + Math.sin(t * 1.4 + i) * 20;
        Z.wire(c, [[cx, cy], [cx + 70, cy - 14], [cx + 140, cy + 4]], { w: 1.8, tone: 0.3, seed: 1940 + i, taper: 0.7 });
      }
      if (lt > 1.6) {
        c.save(); c.globalAlpha = 0.78 * clamp(ss(1.6, 2.3, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('兄弟，我助你破城', 900, 380);
        c.restore();
      }
    });
    Z.bigText(c, '魂归助破城', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 追封：宋江奏报，追封金华将军，立庙享祭（朱砂：钤印）
SCENES['zs8_jinhua'] = (() => {
  const p = () => Z.paper('zs8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 220, tone: 0.32, seed: 131 }, { y0: 660, amp: 120, tone: 0.22, seed: 132 }]);
      Z.cloud(c, t, { x: 1500, y: 170, s: 1.2, seed: 133, tone: 0.3 });
      Z.ground(c, 900, { seed: 134, tone: 0.4 });
      // 庙（金华将军庙）
      Z.guan(c, 1420, 740, 0.92, { tone: 0.84, seed: 135, text: '金華將軍' });
      // 张顺立像（追封后的神像）
      Z.zhangshun(c, 840, 892, 1.5, t, { bare: 1, knife: 1, raise: clamp(Math.sin(t * 1.1) * 0.12 + 0.14) });
      // 香烟（活气）
      for (let i = 0; i < 8; i++) {
        const sy = 700 - ((t * 34 + i * 80) % 420), sx = 1420 + Math.sin((sy + i * 50) * 0.02 + t) * 22;
        Z.wire(c, [[sx, sy], [sx + 8, sy - 14]], { w: 1.5, tone: 0.32, seed: 1950 + i, taper: 0.8 });
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 42 + i * 200) % 1900) + 10, by = 330 + ((t * 32 + i * 130) % 420);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1960 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '追封金华将军', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '浪里白条', clamp(ss(0.8, 2.4, lt)), { size: 26 });
  } };
})();
})();
