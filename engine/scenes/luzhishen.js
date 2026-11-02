// 《水浒传·鲁智深》rig + 八幕（宋元版画线描 + 焦墨）
// 造型三段：① 提辖期：鬃帽 + 皂袍 + 腰刀 + 络腮胡  ② 僧期：戒疤 + 皂布直裰 + 数珠 + 浑铁禅杖  ③ 圆寂期：朱砂袈裟趺坐
// 母题：① 禅杖（从第二幕到第八幕不离身，最后一幕放下）② 酒（坛——戒律与本性的来回拉扯）
//       ③ 数珠  ④ 潮信（末两幕的白浪横排线）  ⑤ 排线密度由密转疏（与林冲片反向：他是从怒走到静）
// 唯一的彩：禅杖握把处那一段朱砂缠绳，全片八幕皆是；直到第八幕最后一秒，朱砂才铺成袈裟。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;
const CIN = Z.CINNABAR;

// ============================== 鲁智深本体 ==============================
// o: { tixia提辖装, monk僧相, cassock朱砂袈裟, staff浑铁禅杖, dao戒刀, jar大酒坛, gourd酒葫芦,
//      flip朝向, raise抡举, angry怒目, drink仰饮, pull上拔发力, kneel跪, sit趺坐, back背影, hurt, tone }
Z.luzhishen = (c, x, y, s, t, o = {}) => {
  const {
    tixia = 0, monk = 1, cassock = 0, staff = 0, dao = 0, jar = 0, gourd = 0,
    flip = 0, raise = 0, angry = 0, drink = 0, pull = 0, kneel = 0, sit = 0,
    back = 0, hurt = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.4) * 2.8;                    // 呼吸：胖大之人幅度也大
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 54 : 0);
  const cp = sit ? 0.64 : 1;                             // 趺坐：躯干纵向压缩
  const shoulderY = ly - 158 * cp - (sit ? 4 : 0);
  const waistY = ly - 78 * cp;
  const hemY = ly - (sit ? 32 : 2);
  const hemW = sit ? 100 : 78;

  // ---- 袈裟（朱砂铺满之前，先用轮廓占位）----
  const cassockPts = [[-58, shoulderY + 6], [26, shoulderY - 2], [46, waistY + 24], [18, hemY - 4], [-46, waistY + 26]];

  // ---- 躯干（胖大：腰阔十围，袍要宽）
  const body = [[-58, shoulderY + 8], [-70, waistY + 8], [-hemW, hemY], [hemW, hemY], [70, waistY + 8], [58, shoulderY + 8]];
  Z.lined(c, body, { w: 3.4, tone, seed: 71, hatch: monk ? 0.16 : 0.2, gap: 11, hatchAng: -0.85 });
  const bodyCol = tixia ? 'rgba(120,124,132,.14)' : 'rgba(96,100,108,.16)';
  c.save();
  c.fillStyle = bodyCol;
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill();
  c.restore();

  // ---- 盘腿（趺坐）
  if (sit) {
    Z.wire(c, [[-84, ly - 46], [-30, ly - 20], [30, ly - 22], [84, ly - 48]], { w: 2.8, tone: tone * 0.85, seed: 72 });
    Z.wire(c, [[-44, ly - 22], [-12, ly - 8], [10, ly - 22]], { w: 2.6, tone, seed: 73 });
    Z.wire(c, [[44, ly - 22], [12, ly - 8], [-10, ly - 22]], { w: 2.6, tone, seed: 74 });
    Z.hatchBox(c, [[-84, ly - 46], [84, ly - 48], [78, ly - 18], [-78, ly - 16]], { ang: 0.1, gap: 12, tone: 0.14, seed: 75 });
  }

  // ---- 腰带（皂绦，僧俗皆系）
  Z.wire(c, [[-64, waistY], [64, waistY]], { w: 4, tone: tone * 0.95, seed: 76, taper: 0.08 });
  Z.wire(c, [[-64, waistY + 8], [64, waistY + 8]], { w: 2, tone: tone * 0.7, seed: 77, taper: 0.08 });

  // ---- 数珠（一百零八颗，垂到腹）
  if (monk) {
    const cy = shoulderY + 54, sway = Math.sin(t * 1.1) * 0.05;
    c.save(); c.translate(0, cy); c.rotate(sway);
    for (let i = 0; i < 17; i++) {
      const a = (Math.PI * 2 * i) / 17;
      c.save();
      c.beginPath(); c.arc(Math.cos(a) * 42, Math.sin(a) * 50, 3.4, 0, 7);
      c.strokeStyle = `rgba(26,26,28,${0.78 * tone})`; c.lineWidth = 1.6; c.stroke();
      c.restore();
    }
    c.restore();
  }

  // ---- 袈裟（斜披：最后一幕的那一片红；随进度显形，铺满时是最重的朱砂）
  if (cassock) {
    const ca = clamp(cassock * 1.6);
    Z.lined(c, cassockPts, { w: 3.2, tone: 0.92, seed: 78, hatch: 0.14, gap: 9, hatchAng: -1.15 });
    c.save();
    c.fillStyle = `rgba(183,51,46,${0.42 * ca})`;
    c.beginPath(); cassockPts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill();
    c.restore();
    Z.wire(c, [[-58, shoulderY + 6], [26, shoulderY - 2], [46, waistY + 24]], { w: 3, tone: 0.9, seed: 79, col: CIN });
  }

  // ---- 双臂（raise/pull/drink 三种发力）
  const armUp = lerp(0.18, -0.62, raise) + lerp(0, -1.15, pull) + Math.sin(t * 1.5 + 1) * 0.02;
  const handY = shoulderY + 52 + Math.sin(armUp) * 62 - pull * 96;
  const armSw = pull ? 0.5 : 0;
  Z.wire(c, [[-52, shoulderY + 14], [-70 + armSw * 14, shoulderY + 60 + br * 0.3], [lerp(-62, -40, pull), handY + 8]], { w: 3.4, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[52, shoulderY + 14], [70 - armSw * 14, shoulderY + 56 - raise * 26], [lerp(62, 40, pull), handY - raise * 44]], { w: 3.4, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[lerp(-62, -40, pull), handY + 4], [-46, handY + 24], [-34, handY + 8], [-50, handY - 16]], { w: 2.4, tone: tone * 0.8, seed: 82 });
  Z.lined(c, [[lerp(62, 40, pull), handY - 4], [46, handY + 16], [34, handY], [50, handY - 22]], { w: 2.4, tone: tone * 0.8, seed: 83 });

  // ---- 头（面圆耳大，鼻直口方，腮边一部落腮胡须）
  const hy = shoulderY - 36 + br * 0.5;
  c.save(); c.translate(0, hy); c.scale(1.18, 1.18); c.translate(0, -hy);
  const face = [[-24, hy - 14], [-21, hy - 40], [0, hy - 50], [21, hy - 40], [24, hy - 14], [22, hy + 14], [0, hy + 26], [-22, hy + 12]];
  Z.wire(c, face, { w: 2.8, tone, seed: 84, taper: 0.08 });
  // 大耳（"面圆耳大"是本角色的特征，不能省）
  Z.wire(c, [[-24, hy - 8], [-31, hy - 2], [-26, hy + 12]], { w: 2.2, tone: tone * 0.85, seed: 85 });
  Z.wire(c, [[24, hy - 8], [31, hy - 2], [26, hy + 12]], { w: 2.2, tone: tone * 0.85, seed: 86 });

  const open = lerp(0.5, 1, angry);
  for (const sx of [-1, 1]) {                                     // 眉 + 眼（怒时眉尾上挑）
    Z.wire(c, [[sx * 5, hy - lerp(21, 24, angry)], [sx * 16, hy - lerp(20, 14, angry)]], { w: 3.2, tone: tone * 0.95, seed: 87 + sx });
    Z.lined(c, [[sx * 4, hy - 12], [sx * 10, hy - 17], [sx * 16, hy - 12], [sx * 10, hy - 7]], { w: 1.6, tone, seed: 89 + sx, hatch: 0.5, gap: 3 });
  }
  Z.wire(c, [[0, hy - 12], [1, hy - 1]], { w: 2.2, tone: tone * 0.8, seed: 91 });            // 鼻
  Z.wire(c, [[-9, hy + 6], [9, hy + 6]], { w: 2.6, tone: tone * 0.85, seed: 92 });           // 方阔之口
  if (drink) Z.wire(c, [[-9, hy + 6], [9, hy + 2], [-9, hy + 12]], { w: 2.2, tone: tone * 0.7, seed: 93 });

  // 络腮胡：颊到颏的一圈短笔画（本角色的签字；短而疏，不压口鼻）
  for (let i = 0; i < 13; i++) {
    const u = i / 12;
    const bx = lerp(-24, 24, u), by = hy + 13 + Math.sin(u * Math.PI) * 11;
    Z.wire(c, [[bx, by], [bx + (u - 0.5) * 6, by + 9 + Math.sin(u * Math.PI) * 6]], { w: 1.8, tone: tone * 0.8, seed: 94 + i, taper: 0.4 });
  }

  if (monk) {                                                     // 戒疤（受戒之记）
    c.save(); c.fillStyle = `rgba(26,26,28,${0.72 * tone})`;
    for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-14 + i * 14, hy - 44 + (i === 1 ? -2 : 0), 2.6, 0, 7); c.fill(); }
    c.restore();
  }
  if (back) { c.save(); c.fillStyle = 'rgba(232,230,222,.94)'; c.beginPath(); face.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore(); }

  // 头衣：提辖戴鬃帽，僧人不戴；走江湖时一顶毡笠不合身份，故一概不取
  if (tixia) {
    Z.lined(c, [[-30, hy - 26], [-22, hy - 54], [22, hy - 54], [30, hy - 26]], { w: 3, tone: tone * 0.95, seed: 110, hatch: 0.24, gap: 5 });
    Z.wire(c, [[-38, hy - 26], [38, hy - 26]], { w: 2.6, tone: tone * 0.85, seed: 111 });
    Z.wire(c, [[0, hy - 54], [0, hy - 64], [6, hy - 58]], { w: 2.4, tone: tone * 0.8, seed: 112 });
  }
  c.restore();   // 头部比例结束

  // ---- 腰刀（提辖期佩在左股）
  if (tixia) {
    c.save(); c.translate(-64, waistY + 4); c.rotate(-0.5);
    Z.wire(c, [[0, 0], [0, -46]], { w: 3, tone: tone * 0.9, seed: 120, taper: 0.06 });
    Z.lined(c, [[0, -46], [7, -86], [0, -104]], { w: 2.4, tone, seed: 121 });
    Z.wire(c, [[-6, -44], [6, -44]], { w: 3.2, tone: tone * 0.8, seed: 122 });
    c.restore();
  }

  // ---- 戒刀（僧人行脚所用）
  if (dao) {
    c.save(); c.translate(-62, waistY + 2); c.rotate(-0.62);
    Z.wire(c, [[0, 0], [0, -34]], { w: 2.8, tone: tone * 0.9, seed: 130 });
    Z.lined(c, [[0, -34], [8, -64], [2, -92]], { w: 2.6, tone, seed: 131 });
    c.restore();
  }

  // ---- 酒葫芦（提辖期随身）
  if (gourd) {
    c.save(); c.translate(58, waistY + 6);
    Z.lined(c, [[0, 0], [-14, 16], [-12, 38], [0, 52], [12, 38], [14, 16]], { w: 2.6, tone: tone * 0.9, seed: 140, hatch: 0.16, gap: 6 });
    Z.wire(c, [[0, 0], [0, -9], [5, -5]], { w: 2, tone: tone * 0.8, seed: 141 });
    c.restore();
  }

  // ---- 大酒坛（半人高的那口：喝时倾向面部）
  if (jar) {
    c.save(); c.translate(lerp(56, 30, drink), lerp(waistY + 6, hy - 26, drink)); c.rotate(-1.15 * drink);
    Z.lined(c, [[-30, 0], [-26, 34], [0, 52], [26, 34], [30, 0]], { w: 3, tone: tone * 0.92, seed: 150, hatch: 0.22, gap: 7, hatchAng: 0.1 });
    Z.wire(c, [[-30, 0], [30, 0]], { w: 3, tone, seed: 151 });
    Z.wire(c, [[-18, -6], [18, -6], [18, 2], [-18, 2]], { w: 2.4, tone: tone * 0.8, seed: 152 });
    c.restore();
  }

  // ---- 浑铁禅杖（长五尺，重六十二斤；握把处一段朱砂缠绳是这部片的签名）
  // 杖向右外侧抡开（rotate 取正），杆身任何角度都不许横穿面部。
  if (staff) {
    const gr = lerp(0.10, 0.95, raise) + Math.sin(t * 1.2) * 0.02;
    c.save(); c.translate(lerp(88, 46, pull), handY - raise * 34); c.rotate(gr);
    Z.wire(c, [[0, 116], [0, -216]], { w: 5.4, tone: tone * 0.95, seed: 160, taper: 0.03 });          // 杆
    Z.wire(c, [[0, -216], [0, -240]], { w: 8.6, tone: tone * 0.95, seed: 161, taper: 0.1 });          // 顶端加粗
    Z.wire(c, [[0, 116], [0, 96]], { w: 8, tone: tone * 0.9, seed: 162, taper: 0.1 });                // 尾鐏
    c.save(); c.translate(0, -110);                                                                    // 朱砂缠绳
    for (let i = 0; i < 5; i++) Z.wire(c, [[-6, i * 8], [6, i * 8 + 4]], { w: 3, tone: 0.9, col: CIN, seed: 170 + i });
    c.restore();
    c.restore();
  }

  if (hurt) {
    c.save(); c.fillStyle = 'rgba(183,51,46,.45)';
    for (let i = 0; i < 5; i++) c.fillRect(-24 + i * 11, waistY - 22 + i * 5, 3.4, 3.4);
    c.restore();
  }
  c.restore();
};

// ============================== 小件 ==============================
// 肉案（状元桥下郑屠的门面：横梁 + 挂钩 + 挂肉 + 案板 + 剁刀）
Z.meatStall = (c, x, y, s, { tone = 0.85, seed = 1, sway = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-158, -196], [158, -196]], { w: 3.6, tone: tone * 0.9, seed: 200 + seed, taper: 0.05 });
  for (const sx of [-1, 1]) Z.wire(c, [[sx * 150, -196], [sx * 150, 0]], { w: 3.4, tone, seed: 202 + sx, taper: 0.05 });
  for (let i = 0; i < 4; i++) {                                    // 挂肉（摇）
    const hx = -108 + i * 72, sw = Math.sin(sway * 1.5 + i * 1.3) * 0.17;
    c.save(); c.translate(hx, -192); c.rotate(sw);
    Z.wire(c, [[0, 0], [0, 22]], { w: 2, tone: tone * 0.75, seed: 210 + i });
    Z.lined(c, [[-17, 22], [-13, 54], [0, 66], [13, 54], [17, 22]], { w: 2.6, tone: tone * 0.85, seed: 220 + i, hatch: 0.24, gap: 6, hatchAng: 0.2 });
    c.restore();
  }
  Z.wire(c, [[-156, -98], [156, -98], [156, -80], [-156, -80], [-156, -98]], { w: 3.4, tone, seed: 230, taper: 0.04 });
  Z.hatchBox(c, [[-156, -98], [156, -98], [156, -80], [-156, -80]], { ang: 0, gap: 9, tone: 0.18, seed: 231 });
  Z.wire(c, [[-128, -80], [-128, 0]], { w: 3.2, tone, seed: 232 });
  Z.wire(c, [[128, -80], [128, 0]], { w: 3.2, tone, seed: 233 });
  Z.lined(c, [[62, -90], [110, -90], [110, -82], [62, -82]], { w: 2.4, tone, seed: 234, hatch: 0.3, gap: 4 });   // 剁刀
  Z.wire(c, [[54, -86], [62, -86]], { w: 3, tone: tone * 0.8, seed: 235 });
  c.restore();
};

// 郑屠（绰号"镇关西"：一个大胖轧户 + 围裙 + 一把尖刀）
Z.butcher = (c, x, y, s, t, { flip = 0, tone = 0.85, stagger = 0, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const lean = stagger * 0.34;
  c.save(); c.rotate(lean);
  const body = [[-58, -150], [-72, -70], [-74, 0], [74, 0], [70, -70], [56, -150]];
  Z.lined(c, body, { w: 3.2, tone, seed: 300 + seed, hatch: 0.2, gap: 10, hatchAng: 0.15 });
  c.save(); c.fillStyle = 'rgba(112,116,124,.13)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  Z.lined(c, [[-62, -84], [62, -84], [58, 0], [-58, 0]], { w: 2.6, tone: tone * 0.9, seed: 310, hatch: 0.26, gap: 8, hatchAng: 0 });   // 油布围裙
  Z.wire(c, [[-64, -96], [64, -96]], { w: 4, tone: tone * 0.95, seed: 311 });
  const hy = -190;
  c.save(); c.translate(0, hy); c.scale(1.26, 1.26); c.translate(0, -hy);   // 头大身壮：与主角同一比例法则
  Z.wire(c, [[-22, hy - 10], [-19, hy - 34], [0, hy - 44], [19, hy - 34], [22, hy - 10], [19, hy + 14], [0, hy + 24], [-19, hy + 12]], { w: 2.8, tone, seed: 312, taper: 0.08 });
  Z.wire(c, [[-13, hy - 6], [-5, hy - 4]], { w: 2.4, tone: tone * 0.9, seed: 313 });
  Z.wire(c, [[5, hy - 4], [13, hy - 6]], { w: 2.4, tone: tone * 0.9, seed: 314 });
  Z.wire(c, [[-8, hy + 10], [8, hy + 10]], { w: 2.4, tone: tone * 0.8, seed: 315 });
  Z.wire(c, [[-22, hy - 16], [-18, hy - 40], [18, hy - 40], [22, hy - 16]], { w: 2.8, tone: tone * 0.9, seed: 316 });   // 巾
  Z.wire(c, [[-24, hy - 16], [24, hy - 16]], { w: 2.2, tone: tone * 0.7, seed: 317 });
  c.restore();
  c.restore();
  if (stagger < 0.6) {                                             // 尖刀（被打掉之前）
    c.save(); c.translate(70, -128); c.rotate(-0.6 - stagger * 1.6);
    Z.lined(c, [[0, 0], [6, -34], [0, -62]], { w: 2.6, tone, seed: 320 });
    Z.wire(c, [[-4, 0], [4, 0]], { w: 3, tone: tone * 0.8, seed: 321 });
    c.restore();
  }
  c.restore();
};

// 佛殿（文殊院大雄宝殿：重檐 + 柱 + 匾 + 台阶；殿要高，不能塌成一座坟）
Z.temple = (c, x, y, s, { tone = 0.84, seed = 1, text = '' } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-300, 0], [-300, -320], [300, -320], [300, 0]], { w: 3.6, tone, seed: 400 + seed, taper: 0.03 });
  Z.roof(c, 0, -320, 700, 112, { tone: tone * 0.95, seed: 410 });
  Z.roof(c, 0, -430, 560, 90, { tone: tone * 0.9, seed: 411 });
  Z.wire(c, [[-150, 0], [-150, -250], [150, -250], [150, 0]], { w: 3.2, tone: tone * 0.85, seed: 420 });
  Z.hatchBox(c, [[-150, 0], [150, 0], [150, -250], [-150, -250]], { ang: 0, gap: 15, tone: 0.2, seed: 421 });
  for (const sx of [-1, 1]) Z.wire(c, [[sx * 262, 0], [sx * 262, -322]], { w: 4.4, tone: tone * 0.9, seed: 430 + sx });
  Z.hatchBox(c, [[-300, 0], [300, 0], [300, -320], [-300, -320]], { ang: -1.4, gap: 22, tone: 0.1, seed: 440 });
  for (let i = 0; i < 3; i++) Z.wire(c, [[-330 + i * 12, 0], [330 - i * 12, 0], [340 - i * 12, 18], [-340 + i * 12, 18]], { w: 2.2, tone: tone * 0.7, seed: 450 + i, taper: 0.1 });
  if (text) {
    Z.labelBox(c, -76, -372, 152, 34, { tone: tone * 0.92, seed: 460 });
    c.save(); c.fillStyle = 'rgba(26,26,28,.86)'; c.font = '26px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, 0, -355); c.restore();
  }
  c.restore();
};

// 香炉 + 烟（一炷不断的青烟，这一幕的活气大半靠它）
Z.incense = (c, x, y, s, t, { tone = 0.8, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.lined(c, [[-30, 0], [-24, -40], [24, -40], [30, 0]], { w: 3, tone, seed: 500 + seed, hatch: 0.2, gap: 7 });
  Z.wire(c, [[-34, -40], [34, -40]], { w: 3, tone: tone * 0.9, seed: 501 });
  for (const sx of [-1, 1]) Z.wire(c, [[sx * 22, 0], [sx * 34, -14]], { w: 2.6, tone: tone * 0.8, seed: 502 + sx });
  for (let k = 0; k < 3; k++) {
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const u = i / 8;
      pts.push([Math.sin(t * 1.1 + k * 2.1 + u * 3.4) * (10 + u * 26), -40 - u * 200]);
    }
    Z.wire(c, pts, { w: 2.6 - k * 0.5, tone: tone * (0.6 - k * 0.12), seed: 510 + k, taper: 0.5 });
  }
  c.restore();
};

// 长老（智真：老僧 + 长眉 + 拂尘）
Z.master = (c, x, y, s, t, { flip = 0, tone = 0.8 } = {}) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const br = Math.sin(t * 1.1) * 1.6;
  const body = [[-56, -150], [-66, -70], [-70, 0], [70, 0], [64, -70], [54, -150]];
  Z.lined(c, body, { w: 3.2, tone, seed: 600, hatch: 0.14, gap: 12, hatchAng: -1.1 });
  Z.wire(c, [[-58, -84], [58, -84]], { w: 3.6, tone: tone * 0.9, seed: 601 });
  const hy = -190 + br * 0.4;
  Z.wire(c, [[-21, hy - 12], [-18, hy - 36], [0, hy - 46], [18, hy - 36], [21, hy - 12], [19, hy + 14], [0, hy + 24], [-19, hy + 12]], { w: 2.6, tone, seed: 602, taper: 0.08 });
  Z.wire(c, [[-16, hy - 14], [-4, hy - 17]], { w: 3.4, tone: tone * 0.9, seed: 603 });        // 长眉（寿者之相）
  Z.wire(c, [[4, hy - 17], [16, hy - 14]], { w: 3.4, tone: tone * 0.9, seed: 604 });
  Z.wire(c, [[-9, hy - 4], [-3, hy - 3]], { w: 1.8, tone: tone * 0.8, seed: 605 });
  Z.wire(c, [[3, hy - 3], [9, hy - 4]], { w: 1.8, tone: tone * 0.8, seed: 606 });
  Z.wire(c, [[-8, hy + 10], [8, hy + 10]], { w: 2, tone: tone * 0.7, seed: 607 });
  for (let i = 0; i < 9; i++) {                                     // 白须
    const bx = lerp(-16, 16, i / 8);
    Z.wire(c, [[bx, hy + 16], [bx + (i - 4) * 1.6, hy + 44]], { w: 1.8, tone: tone * 0.62, seed: 620 + i, taper: 0.5 });
  }
  Z.wire(c, [[-52, -140], [64, -96]], { w: 3, tone, seed: 630 });    // 持拂尘的手臂
  Z.wire(c, [[64, -96], [78, -56]], { w: 3.4, tone: tone * 0.9, seed: 631 });
  for (let i = 0; i < 9; i++) Z.wire(c, [[78, -56], [66 + i * 3, -56 + 34 + Math.sin(t * 1.6 + i) * 5]], { w: 1.6, tone: tone * 0.6, seed: 640 + i, taper: 0.4 });
  c.restore();
};

// 众僧（一个个)：袍 + 光头 + 慌张时双臂上扬
Z.monk = (c, x, y, s, t, { flip = 0, tone = 0.72, panic = 0, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const br = Math.sin(t * 2 + seed) * 2;
  const body = [[-34, -132], [-44, -60], [-46, 0], [46, 0], [42, -60], [34, -132]];
  Z.lined(c, body, { w: 2.8, tone, seed: 700 + seed, hatch: 0.14, gap: 10, hatchAng: -1.0 });
  const hy = -166 + br * 0.4;
  Z.wire(c, [[-17, hy - 10], [-14, hy - 32], [0, hy - 41], [14, hy - 32], [17, hy - 10], [15, hy + 12], [0, hy + 21], [-15, hy + 10]], { w: 2.4, tone, seed: 710 + seed, taper: 0.08 });
  Z.wire(c, [[-8, hy - 4], [-3, hy - 4]], { w: 1.6, tone: tone * 0.85, seed: 720 + seed });
  Z.wire(c, [[3, hy - 4], [8, hy - 4]], { w: 1.6, tone: tone * 0.85, seed: 730 + seed });
  const au = lerp(0.2, -1.1, panic) + Math.sin(t * 3 + seed) * 0.06 * panic;
  for (const sx of [-1, 1]) Z.wire(c, [[sx * 30, hy + 44], [sx * 52, hy + 78 + Math.sin(au) * 30], [sx * 60, hy + 96 + Math.sin(au) * 62]], { w: 2.6, tone, seed: 740 + seed + sx });
  c.restore();
};

// 山门（寺院三门：三洞 + 檐 + 匾）
Z.templeGate = (c, x, y, s, { tone = 0.85, seed = 1, text = '', broken = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-268, 0], [-268, -236], [268, -236], [268, 0]], { w: 3.6, tone, seed: 800 + seed, taper: 0.03 });
  Z.roof(c, 0, -236, 620, 96, { tone: tone * 0.95, seed: 810 });
  Z.roof(c, 0, -316, 470, 72, { tone: tone * 0.88, seed: 811 });
  for (const cx of [-170, 0, 170]) {
    const op = cx === 0 ? 130 : 96;
    Z.wire(c, [[cx - 52, 0], [cx - 52, -op], [cx + 52, -op], [cx + 52, 0]], { w: 3, tone: tone * 0.85, seed: 820 + cx });
    c.save(); c.beginPath(); c.rect(cx - 52, -op, 104, op); c.clip();
    Z.hatchBox(c, [[cx - 52, 0], [cx + 52, 0], [cx + 52, -op], [cx - 52, -op]], { ang: 0, gap: 14, tone: 0.22, seed: 830 + cx });
    c.restore();
  }
  Z.hatchBox(c, [[-268, 0], [268, 0], [268, -236], [-268, -236]], { ang: -1.4, gap: 24, tone: 0.1, seed: 840 });
  if (broken) {                                                     // 被禅杖打折的檐角：断口留枯白
    Z.wire(c, [[268, -180], [236, -150], [268, -124]], { w: 3, tone: tone * 0.9, seed: 850, breaks: 0.5 });
    Z.scorch(c, [[210, -210], [268, -196], [268, -120], [226, -140]], { tone: 0.4, seed: 851, layers: 3 });
  }
  if (text) {
    Z.labelBox(c, -70, -286, 140, 32, { tone: tone * 0.92, seed: 860 });
    c.save(); c.fillStyle = 'rgba(26,26,28,.86)'; c.font = '25px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, 0, -270); c.restore();
  }
  c.restore();
};

// 金刚力士（山门两尊：怒目 + 降魔杵 + 一足踏小鬼；被推倒时整体旋转）
Z.jingang = (c, x, y, s, t, { flip = 0, tone = 0.85, topple = 0, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.rotate(topple * topple * 1.05 * (seed % 2 ? 1 : -1));
  const body = [[-64, -196], [-84, -96], [-88, 0], [88, 0], [82, -96], [62, -196]];
  Z.lined(c, body, { w: 3.4, tone, seed: 900 + seed, hatch: 0.22, gap: 9, hatchAng: -0.9 });
  Z.wire(c, [[-76, -110], [76, -110]], { w: 3.6, tone: tone * 0.9, seed: 901 });
  const hy = -246;
  Z.wire(c, [[-26, hy - 12], [-23, hy - 40], [0, hy - 52], [23, hy - 40], [26, hy - 12], [24, hy + 18], [0, hy + 31], [-24, hy + 16]], { w: 3, tone, seed: 902, taper: 0.08 });
  for (const sx of [-1, 1]) {
    Z.wire(c, [[sx * 5, hy - 20], [sx * 19, hy - 26]], { w: 3.6, tone: tone * 0.95, seed: 903 + sx });
    Z.lined(c, [[sx * 4, hy - 14], [sx * 11, hy - 20], [sx * 18, hy - 14], [sx * 11, hy - 8]], { w: 1.8, tone, seed: 905 + sx, hatch: 0.5, gap: 3 });
  }
  Z.wire(c, [[-12, hy + 8], [12, hy + 8]], { w: 3, tone: tone * 0.85, seed: 908 });           // 张口叱咤
  Z.wire(c, [[-20, hy - 30], [-16, hy - 60], [16, hy - 60], [20, hy - 30]], { w: 2.8, tone: tone * 0.9, seed: 909 });   // 宝冠
  Z.wire(c, [[-62, -180], [-96, -120]], { w: 3.2, tone, seed: 910 });                          // 举杵之臂
  Z.wire(c, [[-96, -120], [-104, -250]], { w: 4, tone: tone * 0.95, seed: 911 });              // 降魔杵
  Z.wire(c, [[-118, -244], [-90, -244]], { w: 3.4, tone: tone * 0.9, seed: 912 });
  Z.wire(c, [[62, -180], [96, -128]], { w: 3.2, tone, seed: 913 });
  c.restore();
};

// 垂杨柳（下粗上收的干 + 三条主枝 + 垂条缀叶；lift 时连根带起）
Z.willow = (c, x, y, s, t, { tone = 0.86, seed = 1, lift = 0, whip = 1 } = {}) => {
  const r = rng(seed * 17 + 3);
  c.save(); c.translate(x, y - lift * 170); c.scale(s, s);
  Z.lined(c, [[-40, 0], [-26, -170], [-30, -330]], { w: 6, tone, seed: 1000 + seed, taper: 0.3 });
  Z.lined(c, [[40, 0], [28, -170], [30, -330]], { w: 6, tone, seed: 1001, taper: 0.3 });
  Z.hatchBox(c, [[-38, -20], [38, -20], [28, -320], [-28, -320]], { ang: 0.04, gap: 14, tone: 0.13, seed: 1002 });
  const boughs = [[-30, -320, -150, -430], [-2, -344, 10, -468], [30, -320, 160, -424]];
  for (let i = 0; i < 3; i++) {                                     // 三条主枝
    const [bx, by, ex, ey] = boughs[i];
    Z.wire(c, [[bx, by], [(bx + ex) / 2, (by + ey) / 2 - 22], [ex, ey]], { w: 4, tone, seed: 1010 + i, taper: 0.25 });
  }
  for (let i = 0; i < 16; i++) {                                    // 垂条（随风摆）
    const bi = i % 3, ex = boughs[bi][2], ey = boughs[bi][3];
    const ox = ex + (r() - 0.5) * 96, oy = ey + r() * 28;
    const len = 130 + r() * 150;
    const sw = Math.sin(t * 1.25 + i * 0.8) * 13 * whip;
    const pts = [];
    for (let k = 0; k <= 7; k++) { const u = k / 7; pts.push([ox + Math.sin(u * 2.6) * sw * u + u * u * 7 * (bi - 1), oy + u * len]); }
    Z.wire(c, pts, { w: 1.6, tone: tone * (0.6 + (i % 4) * 0.09), seed: 1030 + i, taper: 0.6 });
    for (let k = 1; k <= 4; k++) {                                  // 叶（短线缀在条上）
      const u = k / 5;
      const lx = ox + Math.sin(u * 2.6) * sw * u + u * u * 7 * (bi - 1), ly2 = oy + u * len;
      Z.wire(c, [[lx, ly2], [lx + 9 + r() * 6, ly2 + 3]], { w: 1.3, tone: tone * 0.5, seed: 1060 + i * 5 + k, taper: 0.6 });
    }
  }
  if (lift > 0) {                                                   // 拔出来的根团
    for (let i = 0; i < 22; i++) {
      const u = r() * 2 - 1;
      Z.wire(c, [[u * 56, 0], [u * 74 + (r() - 0.5) * 30, 26 + r() * 46]], { w: 2.4, tone: tone * 0.8, seed: 1100 + i, taper: 0.5 });
    }
    Z.wire(c, [[-62, 6], [62, 6]], { w: 3, tone: tone * 0.9, seed: 1120, breaks: 1.2 });
  }
  c.restore();
};

// 泼皮（相国寺菜园那二三十个：短褐 + 头巾 + 赤足）
Z.rascal = (c, x, y, s, t, { flip = 0, tone = 0.74, kneel = 0, cheer = 0, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const br = Math.sin(t * 1.9 + seed) * 2;
  const body = [[-34, -124], [-42, -56], [-44, 0], [44, 0], [40, -56], [32, -124]];
  Z.lined(c, body, { w: 2.8, tone, seed: 1200 + seed, hatch: 0.18, gap: 9, hatchAng: -0.8 });
  Z.wire(c, [[-38, -70], [38, -70]], { w: 3.2, tone: tone * 0.9, seed: 1201 });
  const hy = -156 + br * 0.4;
  Z.wire(c, [[-17, hy - 10], [-14, hy - 32], [0, hy - 41], [14, hy - 32], [17, hy - 10], [15, hy + 12], [0, hy + 21], [-15, hy + 10]], { w: 2.4, tone, seed: 1202 + seed, taper: 0.08 });
  Z.wire(c, [[-8, hy - 4], [-3, hy - 4]], { w: 1.8, tone: tone * 0.85, seed: 1210 + seed });
  Z.wire(c, [[3, hy - 4], [8, hy - 4]], { w: 1.8, tone: tone * 0.85, seed: 1220 + seed });
  Z.wire(c, [[-6, hy + 10], [6, hy + 10]], { w: 1.8, tone: tone * 0.75, seed: 1230 + seed });
  Z.wire(c, [[-18, hy - 22], [-14, hy - 44], [14, hy - 44], [18, hy - 22]], { w: 2.4, tone: tone * 0.9, seed: 1240 });   // 头巾
  Z.wire(c, [[-18, hy - 22], [18, hy - 22]], { w: 2, tone: tone * 0.7, seed: 1241 });
  const au = lerp(0.25, -1.3, cheer) + Math.sin(t * 3.2 + seed) * 0.08 * cheer;
  for (const sx of [-1, 1]) Z.wire(c, [[sx * 28, hy + 40], [sx * 48, hy + 70 + Math.sin(au) * 26], [sx * 56, hy + 86 + Math.sin(au) * 54]], { w: 2.4, tone, seed: 1250 + seed + sx });
  c.restore();
};

// 六和塔（杭州钱塘江畔：十三层密檐，版画里层数要数得清）
Z.pagoda = (c, x, y, s, { tone = 0.84, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  let w = 168, yy = 0;
  for (let i = 0; i < 7; i++) {
    const hh = 62 - i * 3.2;
    Z.wire(c, [[-w / 2, yy], [-w / 2, yy - hh], [w / 2, yy - hh], [w / 2, yy]], { w: 3.2, tone: tone * (0.9 - i * 0.03), seed: 1300 + i, taper: 0.04 });
    Z.roof(c, 0, yy - hh, w + 62, 30, { tone: tone * 0.95, seed: 1310 + i, tiles: true });
    Z.wire(c, [[-26, yy - 6], [-26, yy - hh + 16], [26, yy - hh + 16], [26, yy - 6]], { w: 2.2, tone: tone * 0.7, seed: 1320 + i });   // 券门
    yy -= hh + 10; w *= 0.9;
  }
  Z.wire(c, [[0, yy], [0, yy - 52]], { w: 3.4, tone, seed: 1340 });   // 塔刹
  c.save(); c.fillStyle = 'rgba(26,26,28,.7)'; c.beginPath(); c.arc(0, yy - 56, 7, 0, 7); c.fill(); c.restore();
  Z.wire(c, [[-230, 0], [230, 0]], { w: 3.4, tone: tone * 0.8, seed: 1350, taper: 0.06 });   // 台基
  c.restore();
};

// 钱塘潮（版画的水就是一排排横线：一层推进，一层退回）
Z.tide = (c, y0, t, { rows = 9, tone = 0.55, seed = 1 } = {}) => {
  for (let i = 0; i < rows; i++) {
    const yy = y0 + i * 22;
    const ph = t * 1.5 + i * 0.5;
    const amp = 10 + i * 2.6;
    const pts = [];
    for (let x = -30; x <= W + 30; x += 26) {
      pts.push([x, yy + Math.sin(x * 0.0042 + ph) * amp * 0.4 + Math.sin(ph) * amp * 0.5]);
    }
    Z.wire(c, pts, { w: 2.2 - i * 0.08, tone: tone * (1 - i * 0.06), seed: 1400 + i + seed * 20, taper: 0.25, amp: 0.5 });
  }
  for (let i = 0; i < 5; i++) {                                     // 溅起的浪头
    const bx = ((t * 130 + i * 430) % (W + 200)) - 100, yy = y0 + 34 + (i % 3) * 26;
    Z.wire(c, [[bx, yy], [bx + 26, yy - 14], [bx + 54, yy - 4]], { w: 2.4, tone: 0.7, seed: 1450 + i, taper: 0.5 });
  }
};

// 山寨头领（二龙山：杨志、武松作群像时用；也可以 solo）
Z.warrior = (c, x, y, s, t, { flip = 0, tone = 0.8, seed = 1, blade = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const br = Math.sin(t * 1.6 + seed) * 2.2;
  const body = [[-42, -152], [-52, -70], [-56, 0], [56, 0], [50, -70], [42, -152]];
  Z.lined(c, body, { w: 3, tone, seed: 1500 + seed, hatch: 0.18, gap: 10, hatchAng: -0.9 });
  Z.wire(c, [[-48, -84], [48, -84]], { w: 3.6, tone: tone * 0.9, seed: 1501 });
  const hy = -192 + br * 0.4;
  Z.wire(c, [[-20, hy - 12], [-17, hy - 36], [0, hy - 46], [17, hy - 36], [20, hy - 12], [18, hy + 14], [0, hy + 24], [-18, hy + 12]], { w: 2.6, tone, seed: 1502, taper: 0.08 });
  Z.wire(c, [[-9, hy - 6], [-3, hy - 5]], { w: 2, tone: tone * 0.85, seed: 1503 });
  Z.wire(c, [[3, hy - 5], [9, hy - 6]], { w: 2, tone: tone * 0.85, seed: 1504 });
  Z.wire(c, [[-7, hy + 10], [7, hy + 10]], { w: 2, tone: tone * 0.75, seed: 1505 });
  Z.lined(c, [[-24, hy - 28], [-18, hy - 56], [18, hy - 56], [24, hy - 28]], { w: 2.8, tone: tone * 0.92, seed: 1506, hatch: 0.22, gap: 5 });   // 盔
  Z.wire(c, [[0, hy - 56], [0, hy - 72], [6, hy - 64]], { w: 2.4, tone: tone * 0.85, seed: 1507 });
  if (blade) {
    Z.wire(c, [[42, -136], [66, -96], [70, -40]], { w: 3, tone, seed: 1510 });
    Z.wire(c, [[70, -40], [64, -230]], { w: 3.4, tone: tone * 0.92, seed: 1511, taper: 0.04 });
    Z.lined(c, [[64, -230], [72, -256], [64, -276]], { w: 2.4, tone, seed: 1512 });
  }
  c.restore();
};

// ============================== 八幕 ==============================
// ① 拳打镇关西：渭州状元桥下 · 三拳（结果画作三次冲击，暴烈不作直绘）
SCENES['zh1_quanda'] = (() => {
  const p = () => Z.paper('zh1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const hit = clamp(ss(1.0, 2.5, lt));                  // 三拳的总进度
    const n = Math.min(3, 1 + Math.floor(hit * 3.0));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 11, tone: 0.42 });
      Z.meatStall(c, 400, 872, 1.12, { tone: 0.84, seed: 1, sway: t * 1.6 });
      Z.butcher(c, 1050, 890, 1.44, t, { stagger: hit, tone: 0.86, seed: 1, flip: 1 });
      Z.luzhishen(c, lerp(580, 780, hit), 890, 1.54, t, {
        tixia: 1, monk: 0, staff: 0, gourd: 1,
        raise: clamp(Math.sin(hit * Math.PI * 3.2) * 0.7 + 0.5), angry: 1, hurt: 0,
      });
      for (let k = 0; k < n; k++) {                       // 三拳：三次命中，位置分别落在鼻、眼、太阳
        const fl = 1 - (hit * 3 - k);
        if (fl <= 0 || fl > 1) continue;
        c.save(); c.globalAlpha = clamp(fl) * 0.9;
        const cx = 1020 - hit * 60, cy = [772, 730, 698][k];
        for (let i = 0; i < 9; i++) {
          const a = (Math.PI * 2 * i) / 9 + k;
          Z.wire(c, [[cx + Math.cos(a) * 22, cy + Math.sin(a) * 22], [cx + Math.cos(a) * 76, cy + Math.sin(a) * 76]],
            { w: 3, tone: 0.75, seed: 1600 + k * 10 + i, taper: 0.7 });
        }
        c.restore();
      }
    });
    Z.bigText(c, '三拳打死镇关西', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.2, lt)) });
  } };
})();

// ② 五台山剃度：一刀下去，鲁达成了智深
SCENES['zh2_wutai'] = (() => {
  const p = () => Z.paper('zh2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const shave = clamp(ss(1.0, 2.2, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 2.8)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 420, y: 190, s: 1.0, seed: 4, tone: 0.34 });
      Z.mountains(c, c, -60, 1980, [{ y0: 430, amp: 190, tone: 0.36, seed: 91 }]);
      Z.ground(c, 900, { seed: 12, tone: 0.34 });
      Z.temple(c, 1000, 872, 1.18, { tone: 0.82, seed: 2, text: '文殊院' });
      Z.incense(c, 300, 884, 1.15, t, { tone: 0.78, seed: 3 });
      Z.master(c, 560, 890, 1.14, t, { tone: 0.78 });
      Z.luzhishen(c, 1300, 890, 1.42, t, { tixia: 0, monk: shave, staff: 0, kneel: 1, dao: 0 });
      // 落发（一直往下飘：这一幕靠它维持活气）
      for (let i = 0; i < 16; i++) {
        const sd = 1700 + i;
        const bx = 1300 + Math.sin(i * 2.3) * 44 + Math.sin(t * 0.9 + i) * 8;
        const by = 700 + ((t * 42 + i * 58) % 190) - 20;
        Z.wire(c, [[bx, by], [bx + Math.sin(t * 1.6 + i) * 9, by + 16]], { w: 2, tone: 0.75, seed: sd, taper: 0.6 });
      }
      c.save(); c.globalAlpha = 0.9 - shave * 0.9;          // 剃刀（剃完就收）
      Z.wire(c, [[1240, 730], [1290, 700]], { w: 2.8, tone: 0.85, seed: 1710 });
      c.restore();
    });
    Z.bigText(c, '五台山剃度', { x: 1760, y: 120, size: 46, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ③ 大闹五台山：半只狗腿、一坛酒之后，山门和金刚一起倒下
SCENES['zh3_danao'] = (() => {
  const p = () => Z.paper('zh3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const smash = clamp(ss(0.9, 2.6, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 13, tone: 0.4 });
      Z.templeGate(c, 1220, 878, 1.3, { tone: 0.84, seed: 4, text: '五台山', broken: smash });
      Z.jingang(c, 350, 894, 1.1, t, { tone: 0.84, seed: 1, topple: clamp(ss(1.3, 2.7, lt)) });
      Z.jingang(c, 1800, 894, 1.1, t, { tone: 0.8, seed: 2, flip: 1 });
      Z.monk(c, 1580, 888, 0.95, t, { panic: smash, seed: 1, tone: 0.66, flip: 1 });
      Z.monk(c, 1710, 882, 0.86, t, { panic: smash, seed: 2, tone: 0.6, flip: 1 });
      Z.luzhishen(c, 800, 890, 1.48, t, {
        monk: 1, staff: 1, raise: clamp(ss(0.7, 1.6, lt)) * 0.9, angry: 1,
        jar: 1 - clamp(ss(1.4, 2.0, lt)), drink: 0.25 * (1 - smash),
      });
      for (let i = 0; i < 7; i++) {                        // 碎坛：地上散落的陶片
        const bx = 980 + i * 46, by = 880 - (smash * ((i * 37) % 60));
        Z.wire(c, [[bx, by], [bx + 18, by - 10], [bx + 30, by + 4]], { w: 2, tone: 0.62, seed: 1810 + i });
      }
    });
    Z.bigText(c, '大闹五台山', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 倒拔垂杨柳：菜园里那二三十个泼皮，从此再不敢仰视
SCENES['zh4_daoba'] = (() => {
  const p = () => Z.paper('zh4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const up = clamp(ss(1.1, 2.5, lt));
    const pull = up * (0.85 + 0.15 * Math.sin(t * 2.6));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.09, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 120, tone: 0.32, seed: 101 }]);
      Z.cloud(c, t, { x: 900, y: 180, s: 1.0, seed: 7, tone: 0.3 });
      Z.ground(c, 900, { seed: 14, tone: 0.4 });
      Z.willow(c, 1250, 906, 1.15, t, { tone: 0.86, seed: 5, lift: up, whip: 1 + up * 2 });
      Z.luzhishen(c, 900, 890, 1.5, t, { monk: 1, staff: 0, dao: 1, pull, angry: 0.7 });
      for (let i = 0; i < 3; i++) {
        Z.rascal(c, [450, 590, 720][i], 892, [1.0, 1.06, 0.96][i], t, { seed: 10 + i, cheer: up, tone: 0.7 });
      }
      for (let i = 0; i < 22; i++) {                       // 土块（根出地时飞溅）
        const sd = 1900 + i;
        const bx = 1220 + Math.sin(i * 2.7) * 120, by = 900 - ((t * 90 + i * 71) % (60 + up * 240));
        c.save(); c.globalAlpha = up * 0.8;
        c.fillStyle = 'rgba(26,26,28,.42)'; c.fillRect(bx, by, 3.4, 3.4);
        c.restore();
      }
    });
    Z.bigText(c, '倒拔垂杨柳', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 130, 890, '花和尚', clamp(ss(1.6, 2.6, lt)), { size: 28 });
  } };
})();

// ⑤ 野猪林：同样一片林子，这次站在林冲那一边的位置上的是他
SCENES['zh5_yezhulin'] = (() => {
  const p = () => Z.paper('zh5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const strike = clamp(ss(1.2, 2.3, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 480, amp: 160, tone: 0.36, seed: 111 }]);
      Z.ground(c, 900, { seed: 15, tone: 0.4 });
      for (let i = 0; i < 2; i++) Z.pine(c, t, { x: [180, 1680][i], y: 906, s: [1.7, 1.9][i], seed: 10 + i, tone: 0.72 });
      Z.linchong(c, 1450, 878, 1.10, t, { dashed: 1, brand: 1, raise: 1, hurt: 0.4, tone: 0.72 });
      Z.guard(c, 1620, 872, 0.82, t, { seed: 5, flip: 1, drag: 1 });
      Z.guard(c, 1730, 870, 0.72, t, { seed: 6, flip: 1, drag: 1 });
      Z.luzhishen(c, lerp(360, 860, strike), 890, 1.5, t, { monk: 1, staff: 1, raise: strike, angry: 1, dao: 1 });
      if (strike > 0.2) {                                  // 禅杖横扫的风（一道白）
        c.save(); c.globalAlpha = strike * 0.5;
        Z.wire(c, [[460, 700], [1180, 620], [1520, 700]], { w: 4, tone: 0.6, seed: 2010, taper: 0.8, amp: 0.4 });
        c.restore();
      }
      for (let i = 0; i < 9; i++) {                        // 落叶
        const bx = ((t * 70 + i * 240) % 2000) - 40, by = 420 + ((t * 50 + i * 130) % 480);
        Z.wire(c, [[bx, by], [bx + 14, by + 7]], { w: 1.8, tone: 0.45, seed: 2020 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '野猪林救人', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 二龙山：三山聚义，鲁智深、杨志、武松三人同立
SCENES['zh6_ershan'] = (() => {
  const p = () => Z.paper('zh6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const rev = clamp(ss(0.2, 1.1, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 210, s: 1.1, seed: 9, tone: 0.4 });
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 220, tone: 0.5, seed: 121 }, { y0: 650, amp: 130, tone: 0.32, seed: 122 }]);
      Z.ground(c, 900, { seed: 16, tone: 0.36 });
      Z.barrack(c, 1520, 790, 1.0, { tone: 0.76, seed: 8 });
      Z.flag(c, 1700, 640, 150, t, { text: '替天行道', seed: 18, size: 28 });
      Z.flag(c, 300, 660, 120, t, { text: '', seed: 19, size: 28 });
      Z.warrior(c, 600, 890, 1.1, t, { tone: 0.74, seed: 1 });
      Z.warrior(c, 1330, 890, 1.1, t, { tone: 0.74, seed: 2, flip: 1 });
      Z.luzhishen(c, 970, 890, 1.5, t, { monk: 1, staff: 1, dao: 1, raise: 0.3, angry: 0.35 });
    });
    Z.bigText(c, '三山聚义', { x: 1760, y: 120, size: 46, tone: 0.88, appear: rev });
    Z.seal(c, 130, 890, '鲁智深', clamp(ss(1.4, 2.4, lt)), { size: 26 });
  } };
})();

// ⑦ 万松林生擒方腊（依百回本：不是别人，是他一杖）
SCENES['zh7_wansonglin'] = (() => {
  const p = () => Z.paper('zh7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const sw = clamp(ss(1.0, 2.0, lt));                    // 一杖
    const down = clamp(ss(1.3, 2.4, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 17, tone: 0.4 });
      for (let i = 0; i < 4; i++) Z.pine(c, t, { x: [90, 350, 1600, 1860][i], y: 900, s: [1.1, 1.3, 1.2, 1.1][i], seed: 40 + i, tone: 0.5 });   // 远一层
      for (let i = 0; i < 5; i++) Z.pine(c, t, { x: [200, 470, 1150, 1520, 1810][i], y: 912, s: [1.8, 2.2, 2.1, 1.8, 2.2][i], seed: 30 + i, tone: 0.72 });   // 中景留出 600-1000 的决斗空档
      Z.hatchBox(c, [[-20, 0], [W + 20, 0], [W + 20, 260], [-20, 220]], { ang: -1.4, gap: 26, tone: 0.1, seed: 31 });
      c.save(); c.globalAlpha = 0.9 - down * 0.45;
      Z.warrior(c, lerp(1640, 1300, down), 890, 1.12, t, { tone: 0.72, seed: 3, flip: 1, blade: 0 });   // 方腊（弃械而走）
      c.restore();
      Z.luzhishen(c, 680, 890, 1.5, t, { monk: 1, staff: 1, dao: 1, raise: sw, angry: 0.9 });
      if (sw > 0.25) {
        c.save(); c.globalAlpha = sw * 0.55;
        Z.wire(c, [[860, 640], [1180, 600], [1440, 690]], { w: 4.4, tone: 0.6, seed: 2110, taper: 0.8, amp: 0.4 });
        c.restore();
      }
      for (let i = 0; i < 11; i++) {                       // 松针落
        const bx = ((t * 84 + i * 190) % 2000) - 40, by = 380 + ((t * 46 + i * 150) % 520);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.6, tone: 0.42, seed: 2120 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '万松林擒方腊', { x: 1760, y: 120, size: 44, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 听潮圆寂：禅杖放下，朱砂这才铺开成袈裟
SCENES['zh8_tingchao'] = (() => {
  const p = () => Z.paper('zh8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cass = clamp(ss(1.9, 3.2, lt));                  // 袈裟显形
    const fade = clamp(ss(2.6, 3.7, lt));                  // 他自己淡去
    const cam = { x: 960, y: 560, z: lerp(1.08, 1.0, clamp(lt / 3.8)) };   // 与全片相反：这一幕往后撤
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 600, y: 180, s: 1.1, seed: 12, tone: 0.34 });
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 150, tone: 0.3, seed: 131 }]);
      Z.pagoda(c, 1620, 830, 1.05, { tone: 0.8, seed: 6 });
      Z.ground(c, 880, { seed: 18, tone: 0.3 });
      Z.tide(c, 940, t, { rows: 10, tone: 0.5, seed: 2 });
      Z.tide(c, 820, t * 0.8 + 1.4, { rows: 6, tone: 0.3, seed: 3 });
      // 放下的禅杖：立在身边，不再握着
      Z.wire(c, [[1220, 878], [1228, 560]], { w: 5.4, tone: 0.9, seed: 2210, taper: 0.04 });
      c.save(); c.translate(1224, 700);
      for (let i = 0; i < 5; i++) Z.wire(c, [[-6, i * 8], [6, i * 8 + 4]], { w: 3, tone: 0.9, col: CIN, seed: 2220 + i });
      c.restore();
      c.save(); c.globalAlpha = 1 - fade * 0.72;
      Z.luzhishen(c, 940, 884, 1.40, t, { monk: 1, sit: 1, staff: 0, dao: 0, cassock: cass });
      c.restore();
      Z.incense(c, 1160, 884, 0.8, t, { tone: 0.6, seed: 9 });
    });
    Z.bigText(c, '今日方知我是我', { x: 1760, y: 110, size: 48, tone: 0.94, appear: clamp(ss(2.7, 3.7, lt)) });
    Z.seal(c, 140, 880, '听潮而圆', clamp(ss(2.9, 3.7, lt)), { size: 26 });
  } };
})();
})();
