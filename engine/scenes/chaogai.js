// 《水浒传·晁盖》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：东溪村保正（乡绅武装头目）→ 梁山泊第二任寨主。身材魁伟、性如烈火。常服：员外袍 + 巾帻（双角）；
//       战时：盔甲 + 朴刀/枪。母题：① 石塔（托塔天王——夺西溪村石塔抱归东溪，signature）
//       ② 烈火纹（性如烈火，以排线火纹代之，不施色）③ 替天行道旗。
// 唯一的彩：朱砂只用于第八幕中箭的箭伤血光（血）——全片一处，余皆黑白灰（与杨志、史进等片各自独立守"仅朱砂一味"）。
// 弧光：东溪村保正 → 西溪夺塔(托塔天王) → 七星聚义 → 智取生辰纲 → 火并王伦 → 梁山寨主
//       → 曾头市亲征 → 中箭身亡（史文恭毒箭，闭环：晁盖死，引出宋江接班、卢俊义后续）。
// 依《水浒传》第十四至六十回及百回本系统；晁盖为累积型文学形象，正史无其人。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 石塔（托塔天王 signature：三层楼阁式塔 + 塔刹 + 基座）
Z.pagoda = (c, x, y, s, { tone = 0.85, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.lined(c, [[-26, 0], [-26, -40], [-16, -40], [-16, -64], [-22, -64], [-22, -96],
              [-14, -96], [-14, -124], [14, -124], [14, -96], [22, -96], [22, -64],
              [16, -64], [16, -40], [26, -40], [26, 0]],
    { w: 2.6, tone, seed, hatch: 0.14, gap: 7 });
  Z.wire(c, [[0, -124], [0, -150], [11, -138]], { w: 2, tone, seed: seed + 1 });     // 塔刹
  Z.wire(c, [[-26, 0], [26, 0]], { w: 3, tone, seed: seed + 2 });                     // 基座
  Z.wire(c, [[-16, -64], [16, -64]], { w: 1.6, tone: tone * 0.7, seed: seed + 3 });
  Z.wire(c, [[-14, -96], [14, -96]], { w: 1.6, tone: tone * 0.7, seed: seed + 4 });
  c.restore();
};

// 箭（曾头市中箭：史文恭毒箭）
Z.arrow = (c, x, y, ang, len = 120, { tone = 0.9, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.rotate(ang);
  Z.wire(c, [[0, 0], [len, 0]], { w: 3, tone, seed });
  const hx = len;
  Z.wire(c, [[hx, 0], [hx - 22, -12]], { w: 3, tone, seed: seed + 1 });
  Z.wire(c, [[hx, 0], [hx - 22, 12]], { w: 3, tone, seed: seed + 2 });
  Z.wire(c, [[hx - 6, 0], [hx - 22, 0]], { w: 2, tone, seed: seed + 5 });
  Z.wire(c, [[0, 0], [-15, -9]], { w: 1.8, tone: tone * 0.8, seed: seed + 3 });
  Z.wire(c, [[0, 0], [-15, 9]], { w: 1.8, tone: tone * 0.8, seed: seed + 4 });
  c.restore();
};

// ============================== 晁盖本体 ==============================
// o: { robe, cap巾帻, armor, blade朴刀, spear枪, tower石塔, flip, raise, angry, hurt, tone }
Z.chao盖 = (c, x, y, s, t, o = {}) => {
  const {
    robe = 1, cap = 1, armor = 0, blade = 0, spear = 0, tower = 0, flip = 0,
    raise = 0, angry = 0, hurt = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.4) * 2.6;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(hurt ? 60 : 0);
  const cp = 1;
  const shoulderY = ly - 168 * cp;
  const waistY = ly - 86 * cp;
  const hemY = ly - 2;
  const hemW = 70;

  // ---- 躯干（魁伟：肩更宽）----
  const body = [[-64, shoulderY + 8], [-74, waistY + 8], [-hemW, hemY], [hemW, hemY], [74, waistY + 8], [64, shoulderY + 8]];
  Z.lined(c, body, { w: 3.4, tone, seed: 71, hatch: 0.18, gap: 10, hatchAng: -0.9 });
  c.save(); c.fillStyle = 'rgba(104,108,116,.16)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();

  // ---- 腰带 ----
  Z.wire(c, [[-66, waistY], [66, waistY]], { w: 4, tone: tone * 0.95, seed: 76, taper: 0.08 });
  Z.wire(c, [[-66, waistY + 8], [66, waistY + 8]], { w: 2, tone: tone * 0.7, seed: 77, taper: 0.08 });

  // ---- 烈火纹（身份签字之一：胸前排线火纹，性如烈火，不施色）----
  c.save();
  c.beginPath(); c.moveTo(-32, waistY - 4); c.lineTo(32, waistY - 4); c.lineTo(26, waistY - 38); c.lineTo(-26, waistY - 38); c.closePath(); c.clip();
  Z.hatchBox(c, [[-34, waistY - 40], [34, waistY - 40], [34, waistY - 2], [-34, waistY - 2]], { ang: 1.1, gap: 4, tone: 0.42, seed: 805 });
  c.restore();

  // ---- 双臂 ----
  const armUp = lerp(0.16, -0.6, raise) + Math.sin(t * 1.4 + 1) * 0.02;
  const handY = shoulderY + 56 + Math.sin(armUp) * 62;
  Z.wire(c, [[-58, shoulderY + 14], [-76, shoulderY + 60], [-58, handY + 6]], { w: 3.4, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[58, shoulderY + 14], [76, shoulderY + 56 - raise * 26], [58, handY - raise * 40]], { w: 3.4, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[-58, handY + 2], [-44, handY + 22], [-34, handY + 6], [-48, handY - 14]], { w: 2.2, tone: tone * 0.8, seed: 82 });
  Z.lined(c, [[58, handY - 2], [44, handY + 18], [34, handY], [48, handY - 16]], { w: 2.2, tone: tone * 0.8, seed: 83 });

  // ---- 头（巾帻双角：保正/员外标识）----
  const hy = shoulderY - 40 + br * 0.5;
  c.save(); c.translate(0, hy); c.scale(1.14, 1.14); c.translate(0, -hy);
  const face = [[-23, hy - 14], [-20, hy - 40], [0, hy - 50], [20, hy - 40], [23, hy - 14], [21, hy + 14], [0, hy + 28], [-21, hy + 12]];
  Z.wire(c, face, { w: 2.6, tone, seed: 84, taper: 0.08 });
  if (cap) {
    // 巾帻（双角上扬，烈火性情的签字）
    Z.wire(c, [[-22, hy - 14], [-18, hy - 46], [18, hy - 46], [22, hy - 14]], { w: 2.6, tone: 0.9, seed: 110, taper: 0.06 });
    Z.wire(c, [[-22, hy - 20], [22, hy - 20]], { w: 2, tone: 0.7, seed: 111 });
    Z.wire(c, [[-18, hy - 46], [-44, hy - 74]], { w: 2.4, tone: 0.85, seed: 112 });   // 左角
    Z.wire(c, [[18, hy - 46], [44, hy - 74]], { w: 2.4, tone: 0.85, seed: 113 });     // 右角
  } else if (armor) {
    Z.lined(c, [[-23, hy - 16], [-19, hy - 46], [19, hy - 46], [23, hy - 16]], { w: 2.6, tone: 0.94, seed: 110, hatch: 0.18, gap: 5 });
    Z.wire(c, [[0, hy - 46], [0, hy - 62], [7, hy - 54]], { w: 2.2, tone: 0.85, seed: 111 });
  }
  const open = lerp(0.5, 1, angry);
  for (const sx of [-1, 1]) {
    Z.wire(c, [[sx * 5, hy - lerp(19, 22, angry)], [sx * 15, hy - lerp(18, 12, angry)]], { w: 3, tone: tone * 0.95, seed: 87 + sx });
    Z.lined(c, [[sx * 4, hy - 10], [sx * 10, hy - 15], [sx * 16, hy - 10], [sx * 10, hy - 5]], { w: 1.5, tone, seed: 89 + sx, hatch: 0.5, gap: 3 });
  }
  Z.wire(c, [[0, hy - 10], [1, hy]], { w: 2, tone: tone * 0.8, seed: 91 });
  Z.wire(c, [[-9, hy + 6], [9, hy + 6]], { w: 2.4, tone: tone * 0.85, seed: 92 });
  c.restore();

  // ---- 石塔（托塔天王 signature：竖立握于身侧右手）----
  if (tower) {
    c.save(); c.translate(flip ? -64 : 64, handY + 26);
    Z.pagoda(c, 0, 0, 0.88, { tone: 0.84, seed: 300 });
    c.restore();
  }
  // ---- 朴刀（战时）----
  if (blade) {
    const gr = lerp(0.1, 0.95, raise) + Math.sin(t * 1.2) * 0.02;
    c.save(); c.translate(lerp(96, 52, raise), handY - raise * 30); c.rotate(gr);
    Z.wire(c, [[0, 120], [0, -200]], { w: 5, tone: tone * 0.95, seed: 160, taper: 0.03 });
    Z.wire(c, [[0, 120], [0, 100]], { w: 7, tone: tone * 0.9, seed: 161, taper: 0.1 });
    Z.wire(c, [[0, -200], [62, -234], [72, -210], [40, -200]], { w: 3.6, tone, seed: 162 });
    Z.wire(c, [[40, -200], [72, -210]], { w: 2.6, tone, seed: 163 });
    Z.wire(c, [[0, -200], [0, -218]], { w: 4, tone: tone * 0.9, seed: 164 });
    c.restore();
  }
  // ---- 枪 ----
  if (spear) {
    const gr = lerp(0.12, 0.9, raise) + Math.sin(t * 1.2) * 0.02;
    c.save(); c.translate(lerp(94, 52, raise), handY - raise * 30); c.rotate(gr);
    Z.wire(c, [[0, 120], [0, -210]], { w: 4.6, tone: tone * 0.95, seed: 170, taper: 0.03 });
    Z.wire(c, [[0, -210], [0, -250]], { w: 5.4, tone, seed: 171, taper: 0.08 });
    Z.wire(c, [[0, -210], [-16, -210], [-22, -228]], { w: 2.6, tone, seed: 172 });
    Z.wire(c, [[0, -210], [16, -210], [22, -228]], { w: 2.6, tone, seed: 173 });
    c.restore();
  }
  if (hurt) {
    c.save(); c.fillStyle = 'rgba(183,51,46,.5)';
    for (let i = 0; i < 5; i++) c.fillRect(-22 + i * 11, shoulderY + 30 + i * 5, 3.4, 3.4);
    c.restore();
  }
  c.restore();
};

// ============================== 八幕 ==============================
// ① 东溪村保正：掌管东溪村坊，乡绅武装头目
SCENES['ch1_dongxi'] = (() => {
  const p = () => Z.paper('ch1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 440, y: 180, s: 1.0, seed: 4, tone: 0.32 });
      Z.ground(c, 904, { seed: 11, tone: 0.4 });
      Z.manor(c, 1500, 856, 0.92, { tone: 0.82, seed: 2, text: '晁家庄' });
      Z.pagoda(c, 1240, 856, 0.7, { tone: 0.8, seed: 9 });                        // 村中石塔（母题）
      Z.chao盖(c, 820, 892, 1.5, t, { robe: 1, cap: 1, raise: clamp(Math.sin(t * 1.3) * 0.25 + 0.18) });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 60 + i * 230) % 2000) - 40, by = 360 + ((t * 44 + i * 150) % 500);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.6, tone: 0.42, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '东溪村保正', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 西溪夺塔：抢来西溪村石塔，双手抱归东溪 —— 托塔天王由来
SCENES['ch2_tuota'] = (() => {
  const p = () => Z.paper('ch2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1500, y: 180, s: 1.0, seed: 6, tone: 0.3 });
      Z.ground(c, 904, { seed: 12, tone: 0.4 });
      // 溪水波纹（活气）
      for (let i = 0; i < 7; i++) {
        const bx = ((t * 120 + i * 300) % 2000) - 40, by = 916 - ((t * 40 + i * 70) % 80);
        Z.wire(c, [[bx, by], [bx + 34, by - 8], [bx + 70, by]], { w: 2.2, tone: 0.5, seed: 2000 + i, taper: 0.6 });
      }
      Z.chao盖(c, 960, 888, 1.5, t, { robe: 1, cap: 1, tower: 1, raise: 0.2 });     // 横抱石塔
      Z.pagoda(c, 1380, 856, 0.5, { tone: 0.6, seed: 9 });                           // 远处西溪塔影（虚）
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 56 + i * 240) % 2000) - 40, by = 360 + ((t * 42 + i * 160) % 520);
        Z.wire(c, [[bx, by], [bx + 10, by + 5]], { w: 1.5, tone: 0.4, seed: 2100 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '西溪夺塔', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 132, 890, '托塔', clamp(ss(1.8, 2.8, lt)), { size: 28 });
  } };
})();

// ③ 七星聚义：晁盖带头，吴用、三阮、刘唐、公孙胜盟誓取生辰纲
SCENES['ch3_qiyi'] = (() => {
  const p = () => Z.paper('ch3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.05, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.0, seed: 8, tone: 0.32 });
      Z.ground(c, 904, { seed: 13, tone: 0.4 });
      Z.pine(c, t, { x: 320, y: 880, s: 1.0, seed: 3, tone: 0.85 });
      // 七人聚义（晁盖 + 六友，用 fighter 群像代吴用/三阮/刘唐/公孙胜/白胜等）
      Z.chao盖(c, 760, 892, 1.42, t, { robe: 1, cap: 1, raise: 0.15 });
      Z.fighter(c, 1010, 888, 1.0, t, { seed: 3, tone: 0.74 });
      Z.fighter(c, 1150, 884, 0.94, t, { seed: 5, tone: 0.7, flip: 1 });
      Z.fighter(c, 1290, 888, 1.0, t, { seed: 7, tone: 0.74 });
      Z.fighter(c, 1430, 884, 0.94, t, { seed: 9, tone: 0.7, flip: 1 });
      Z.fighter(c, 1560, 888, 1.0, t, { seed: 11, tone: 0.74 });
      // 七星（北斗点，排线小点，不施色）
      for (let i = 0; i < 7; i++) {
        const u = i / 6;
        Z.wire(c, [[560 + u * 60, 220 + (i % 2) * 24], [568 + u * 60, 220 + (i % 2) * 24]], { w: 4, tone: 0.6, seed: 2200 + i });
      }
    });
    Z.bigText(c, '七星聚义', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 智取生辰纲：黄泥冈，晁盖带头，吴用蒙汗药酒 —— 与杨志片互文
SCENES['ch4_shengchen'] = (() => {
  const p = () => Z.paper('ch4', '#e8e6de');
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
      // 酒桶（蒙汗药酒：朱砂一点，与杨志片黄泥冈互文）
      c.save(); c.translate(1180, 870);
      Z.lined(c, [[-34, 0], [-28, -70], [28, -70], [34, 0]], { w: 3, tone: 0.82, seed: 5, hatch: 0.2, gap: 7 });
      Z.wire(c, [[-34, 0], [34, 0]], { w: 3.2, tone: 0.82, seed: 6 });
      Z.wire(c, [[-22, -70], [22, -70], [22, -80], [-22, -80], [-22, -70]], { w: 2.4, tone: 0.8, seed: 7 });
      c.restore();
      c.save(); c.globalAlpha = 0.6; c.fillStyle = 'rgba(183,51,46,.4)';
      c.beginPath(); c.arc(1180, 724, 4, 0, 7); c.fill(); c.restore();
      Z.fighter(c, 1380, 888, 1.0, t, { seed: 8, tone: 0.72, flip: 1 });
      Z.fighter(c, 1500, 884, 0.92, t, { seed: 9, tone: 0.68, flip: 1 });
      Z.chao盖(c, 920, 892, 1.46, t, { robe: 1, cap: 1, blade: 1, tone: lerp(0.9, 0.5, doze) });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 50 + i * 250) % 2000) - 40, by = 360 + ((t * 40 + i * 170) % 520);
        Z.wire(c, [[bx, by], [bx + 10, by + 5]], { w: 1.4, tone: 0.36, seed: 2400 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '智取生辰纲', { x: 1760, y: 120, size: 44, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 火并王伦：林冲杀王伦，晁盖主盟梁山（复用 Z.linchong 互文）
SCENES['ch5_huobing'] = (() => {
  const p = () => Z.paper('ch5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const clash = clamp(ss(1.0, 2.4, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.1, seed: 10, tone: 0.32 });
      Z.ground(c, 904, { seed: 15, tone: 0.4 });
      Z.shanzhai(c, 1520, 856, 0.9, { tone: 0.8, seed: 8, text: '梁山' });
      Z.flag(c, 300, 650, 130, t, { text: '替天行道', seed: 18, size: 26 });
      Z.fighter(c, 1380, 888, 1.0, t, { seed: 3, tone: 0.72, helmet: 1, hurt: clash, flip: 1 });   // 王伦（被诛，后仰）
      Z.linchong(c, 1180, 892, 1.2, t, { armor: 1, spear: 1, angry: 1, flip: 0 });          // 林冲（火并，面向王伦）
      Z.chao盖(c, 820, 892, 1.5, t, { robe: 1, cap: 1, blade: 1, raise: clash * 0.5, angry: 1 });
      if (clash > 0.4) {                                                             // 刀枪交击：墨线火花迸溅
        c.save(); c.globalAlpha = clamp((clash - 0.4) / 0.6); c.strokeStyle = 'rgba(26,26,28,.8)'; c.lineWidth = 2.2;
        const cx = 1300, cy = 752;
        for (let i = 0; i < 10; i++) { const a = -0.8 + i * 0.178; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * 40, cy + Math.sin(a) * 40); c.stroke(); }
        c.lineWidth = 3; c.beginPath(); c.moveTo(cx - 26, cy + 20); c.lineTo(cx + 26, cy - 20); c.stroke();
        c.beginPath(); c.moveTo(cx - 22, cy - 22); c.lineTo(cx + 22, cy + 22); c.stroke();
        c.restore();
      }
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 60 + i * 220) % 2000) - 40, by = 360 + ((t * 44 + i * 150) % 500);
        Z.wire(c, [[bx, by], [bx + 11, by + 5]], { w: 1.5, tone: 0.4, seed: 2300 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '火并王伦', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 梁山寨主：坐镇聚义厅，替天行道旗
SCENES['ch6_zhaizhu'] = (() => {
  const p = () => Z.paper('ch6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.1, seed: 12, tone: 0.32 });
      Z.ground(c, 904, { seed: 16, tone: 0.4 });
      Z.shanzhai(c, 1540, 856, 0.92, { tone: 0.8, seed: 8, text: '梁山泊' });
      Z.flag(c, 320, 660, 140, t, { text: '替天行道', seed: 18, size: 28 });
      Z.pagoda(c, 1340, 856, 0.55, { tone: 0.75, seed: 9 });                              // 石塔随寨（母题）
      // 群雄拱立（fighter 群像）
      Z.fighter(c, 620, 888, 0.96, t, { seed: 4, tone: 0.72 });
      Z.fighter(c, 760, 884, 0.92, t, { seed: 6, tone: 0.68, flip: 1 });
      Z.chao盖(c, 960, 892, 1.55, t, { robe: 1, cap: 1, raise: 0.12 });                    // 寨主居中
      Z.fighter(c, 1180, 884, 0.92, t, { seed: 8, tone: 0.7 });
      Z.fighter(c, 1320, 888, 0.96, t, { seed: 10, tone: 0.72, flip: 1 });
    });
    Z.bigText(c, '梁山寨主', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 140, 884, '天王', clamp(ss(2.0, 3.0, lt)), { size: 26 });
  } };
})();

// ⑦ 曾头市亲征：晁盖不听劝，夜攻曾头市，中伏
SCENES['ch7_zengtou'] = (() => {
  const p = () => Z.paper('ch7', '#d9d6cc');                                       // 夜战：纸色压暗
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 200, tone: 0.3, seed: 121 }, { y0: 650, amp: 120, tone: 0.22, seed: 122 }]);
      Z.ground(c, 904, { seed: 17, tone: 0.3 });
      Z.shanzhai(c, 1540, 856, 0.9, { tone: 0.6, seed: 8, text: '曾头市' });
      Z.flame(c, 600, 866, 0.8, t, { seed: 3, tone: 0.5 });                            // 火把（夜战活气）
      Z.flame(c, 1300, 866, 0.8, t, { seed: 5, tone: 0.5 });
      Z.fighter(c, 1380, 888, 1.0, t, { seed: 8, tone: 0.6, flip: 1 });                 // 曾家伏兵
      Z.fighter(c, 1500, 884, 0.94, t, { seed: 9, tone: 0.58, flip: 1 });
      Z.chao盖(c, 820, 892, 1.5, t, { armor: 1, blade: 1, raise: 0.5, angry: 1 });
      for (let i = 0; i < 10; i++) {                                                  // 火星飞溅（活气）
        const bx = ((t * 140 + i * 200) % 2000) - 40, by = 800 - ((t * 70 + i * 60) % 160);
        Z.wire(c, [[bx, by], [bx + 16, by - 10]], { w: 1.6, tone: 0.45, seed: 2500 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '曾头市亲征', { x: 1760, y: 120, size: 44, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 中箭身亡：史文恭毒箭射中，晁盖不治（朱砂箭伤，全片唯一朱砂）
SCENES['ch8_zhongjian'] = (() => {
  const p = () => Z.paper('ch8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const hit = clamp(ss(1.2, 2.6, lt));
    const cam = { x: 960, y: 560, z: lerp(1.08, 1.0, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 600, y: 180, s: 1.1, seed: 14, tone: 0.3 });
      Z.ground(c, 904, { seed: 18, tone: 0.34 });
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 170, tone: 0.32, seed: 141 }]);
      Z.pagoda(c, 1500, 856, 0.6, { tone: 0.6, seed: 9 });                            // 远处石塔（天王落幕）
      Z.chao盖(c, 900, 884, 1.5, t, { armor: 1, hurt: hit > 0.3, tone: lerp(0.9, 0.6, hit) });  // 中箭踉跄
      if (hit > 0.3) {                                                               // 史文恭毒箭 + 朱砂箭伤
        const k = clamp((hit - 0.3) / 0.7);
        c.save(); c.globalAlpha = 0.72 + 0.28 * k; c.fillStyle = 'rgba(183,51,46,.74)';
        const burst = [[916, 712, 13], [902, 704, 10], [928, 720, 11], [894, 724, 9], [910, 732, 8],
                       [934, 710, 7], [900, 694, 7], [922, 736, 6]];
        for (const [dx, dy, r] of burst) c.fillRect(dx - r / 2, dy - r / 2, r, r);
        c.fillStyle = 'rgba(183,51,46,.64)'; c.fillRect(904, 706, 18, 18);
        c.restore();
        Z.arrow(c, 1300, 716, Math.PI, 384, { tone: 0.9, seed: 3 });                   // 毒箭贯入胸口，箭头露于血外
      }
    });
    Z.bigText(c, '中箭身亡', { x: 1760, y: 110, size: 46, tone: 0.92, appear: clamp(ss(2.0, 3.0, lt)) });
    Z.seal(c, 140, 884, '托塔天王', clamp(ss(2.6, 3.7, lt)), { size: 24 });
  } };
})();
})();
