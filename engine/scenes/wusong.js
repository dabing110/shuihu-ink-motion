// 《水浒传·武松》rig + 八幕（宋元版画线描 + 焦墨）
// 造型三段：① 都头/打虎期：巾帻 + 皂箭袖袍 + 哨棒（景阳冈折断）② 配刑/复仇期：枷 + 囚衣 → 行者（铁戒箍 + 人骨数珠 + 双戒刀 + 皂直裰）
//           ③ 六和寺期：僧（与鲁智深同寺，呼应听潮）
// 母题：① 哨棒/戒刀（贯穿全片）② 酒（三碗不过冈、快活林）③ 虎（仅第一幕）④ 头陀装束（行者）
//       ⑤ 题壁（第六幕留白处的墨字，画外不直绘血）
// 唯一的彩：朱砂只用于酒旗与钤印（及第六幕那枚留白的印角）；血绝不直绘——第六幕整幕留白，只留题壁墨字与印。
// 互文：鲁智深在野猪林救过林冲；武松与鲁智深同终六和寺（末幕以潮信呼应鲁智深片听潮圆寂）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;
const CIN = Z.CINNABAR;

// ============================== 武松本体 ==============================
// o: { headband巾帻, hood铁戒箍行者, robe皂袍, prisoner枷囚衣, dual双戒刀, saber单戒刀, staff哨棒, staffBroken哨棒折,
//      gourd酒葫芦, beads人骨数珠, flip, raise抡举, strike击打, crouch伏虎, drunk醉晃, kneel跪, sit趺坐, tone }
Z.wusong = (c, x, y, s, t, o = {}) => {
  const {
    headband = 1, hood = 0, robe = 1, prisoner = 0, dual = 0, saber = 0, staff = 0, staffBroken = 0,
    gourd = 0, beads = 0, flip = 0, raise = 0, strike = 0, crouch = 0, drunk = 0, kneel = 0, sit = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.7) * 2.0;
  const dw = Math.sin(t * 2.6) * (drunk ? 0.05 : 0);            // 醉态微晃
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s); c.rotate(dw);
  const ly = -(kneel ? 54 : 0);
  const cp = sit ? 0.66 : 1;
  const shoulderY = ly - 162 * cp - (sit ? 4 : 0);
  const waistY = ly - 80 * cp;
  const hemY = ly - (sit ? 30 : 0);
  const hemW = sit ? 76 : 48;                                    // 武松精悍：肩宽下摆窄（V 形），不似鲁智深之钟形

  // ---- 躯干（精悍紧实，倒三角形）----
  const body = [[-58, shoulderY + 8], [-54, waistY + 6], [-hemW, hemY], [hemW, hemY], [54, waistY + 6], [58, shoulderY + 8]];
  Z.lined(c, body, { w: 3.2, tone, seed: 71, hatch: robe ? 0.2 : 0.18, gap: 10, hatchAng: -0.86 });
  c.save(); c.fillStyle = 'rgba(90,94,102,.15)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();

  if (sit) {
    Z.wire(c, [[-80, ly - 44], [-28, ly - 18], [28, ly - 20], [80, ly - 46]], { w: 2.8, tone: tone * 0.85, seed: 72 });
    Z.hatchBox(c, [[-80, ly - 44], [80, ly - 46], [74, ly - 16], [-74, ly - 14]], { ang: 0.1, gap: 12, tone: 0.14, seed: 75 });
  }

  // 腰带
  Z.wire(c, [[-60, waistY], [60, waistY]], { w: 4, tone: tone * 0.95, seed: 76, taper: 0.08 });
  Z.wire(c, [[-60, waistY + 8], [60, waistY + 8]], { w: 2, tone: tone * 0.7, seed: 77, taper: 0.08 });

  // 人骨数珠（行者：一百零八颗，垂胸腹）
  if (beads) {
    const cy = shoulderY + 50, sway = Math.sin(t * 1.1) * 0.05;
    c.save(); c.translate(0, cy); c.rotate(sway);
    for (let i = 0; i < 16; i++) {
      const a = (Math.PI * 2 * i) / 16;
      c.save(); c.beginPath(); c.arc(Math.cos(a) * 40, Math.sin(a) * 48, 3.2, 0, 7);
      c.strokeStyle = `rgba(26,26,28,${0.74 * tone})`; c.lineWidth = 1.5; c.stroke(); c.restore();
    }
    c.restore();
  }

  // ---- 双臂（肘点外移出轮廓，手臂要看得见）----
  const armUp = lerp(0.16, -0.6, raise) + Math.sin(t * 1.6 + 1) * 0.02 + strike * 0.3;
  const handY = shoulderY + 52 + Math.sin(armUp) * 60;
  Z.wire(c, [[-54, shoulderY + 12], [-76, shoulderY + 56], [lerp(-62, -42, strike), handY + 6]], { w: 3.2, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[54, shoulderY + 12], [76, shoulderY + 52 - raise * 24], [lerp(62, 42, strike), handY - raise * 42]], { w: 3.2, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[lerp(-62, -42, strike), handY + 2], [-46, handY + 22], [-34, handY + 6], [-50, handY - 14]], { w: 2.4, tone: tone * 0.8, seed: 82 });
  Z.lined(c, [[lerp(62, 42, strike), handY - 2], [46, handY + 14], [34, handY - 2], [50, handY - 20]], { w: 2.4, tone: tone * 0.8, seed: 83 });

  // ---- 头（武松：方脸、浓眉、刚须、目光沉毅；头大身壮承陈洪绶水浒叶子）----
  const hy = shoulderY - 38 + br * 0.5;
  c.save(); c.translate(0, hy); c.scale(1.42, 1.42); c.translate(0, -hy);
  const face = [[-22, hy - 12], [-19, hy - 38], [0, hy - 48], [19, hy - 38], [22, hy - 12], [20, hy + 14], [0, hy + 26], [-20, hy + 12]];
  Z.wire(c, face, { w: 2.8, tone, seed: 84, taper: 0.08 });
  Z.wire(c, [[-22, hy - 8], [-28, hy - 2], [-23, hy + 12]], { w: 2.2, tone: tone * 0.85, seed: 85 });
  Z.wire(c, [[22, hy - 8], [28, hy - 2], [23, hy + 12]], { w: 2.2, tone: tone * 0.85, seed: 86 });
  for (const sx of [-1, 1]) {                                   // 浓眉 + 眼（眉压眼、英气）
    Z.wire(c, [[sx * 4, hy - 21], [sx * 17, hy - 18]], { w: 3.4, tone: tone * 0.95, seed: 87 + sx });
    Z.lined(c, [[sx * 4, hy - 12], [sx * 11, hy - 16], [sx * 17, hy - 12], [sx * 11, hy - 8]], { w: 1.6, tone, seed: 89 + sx, hatch: 0.5, gap: 3 });
  }
  Z.wire(c, [[0, hy - 12], [1, hy - 1]], { w: 2.2, tone: tone * 0.8, seed: 91 });
  Z.wire(c, [[-10, hy + 7], [10, hy + 7]], { w: 2.8, tone: tone * 0.85, seed: 92 });
  for (let i = 0; i < 11; i++) {                                // 刚须（短、硬、疏）
    const u = i / 10, bx = lerp(-20, 20, u), by = hy + 14 + Math.sin(u * Math.PI) * 9;
    Z.wire(c, [[bx, by], [bx + (u - 0.5) * 5, by + 8]], { w: 1.7, tone: tone * 0.8, seed: 94 + i, taper: 0.4 });
  }

  // 头衣：巾帻（都头）／铁戒箍（行者）
  if (headband) {
    Z.lined(c, [[-26, hy - 22], [-18, hy - 44], [18, hy - 44], [26, hy - 22]], { w: 3, tone: tone * 0.95, seed: 110, hatch: 0.22, gap: 5 });
    Z.wire(c, [[-32, hy - 22], [32, hy - 22]], { w: 2.8, tone: tone * 0.9, seed: 111 });
    Z.wire(c, [[0, hy - 44], [0, hy - 54], [-7, hy - 48]], { w: 2.2, tone: tone * 0.8, seed: 112 });   // 巾角
  }
  if (hood) {                                                    // 铁戒箍（冷硬一圈）
    Z.wire(c, [[-24, hy - 28], [-18, hy - 46], [18, hy - 46], [24, hy - 28]], { w: 3.2, tone: tone * 0.95, seed: 113 });
    for (let i = 0; i < 5; i++) { const a = -0.5 + i * 0.25; Z.wire(c, [[Math.cos(a) * 26, hy - 30 + Math.sin(a) * 16], [Math.cos(a) * 20, hy - 34 + Math.sin(a) * 14]], { w: 2, tone, seed: 114 + i }); }
  }
  c.restore();   // 头部比例结束

  // ---- 枷（配刑：飞云浦前；窄板贴颈，不出肩宽）----
  if (prisoner) {
    c.save(); c.translate(0, shoulderY + 6);
    Z.lined(c, [[-72, -14], [72, -14], [72, 16], [-72, 16]], { w: 3.4, tone: tone * 0.9, seed: 118, hatch: 0.18, gap: 7 });
    Z.wire(c, [[-72, -14], [-72, 16]], { w: 4, tone, seed: 119 });
    Z.wire(c, [[72, -14], [72, 16]], { w: 4, tone, seed: 120 });
    for (const sx of [-1, 1]) Z.wire(c, [[sx * 72, 0], [sx * 52, 0]], { w: 3.6, tone, seed: 121 + sx });
    c.restore();
  }

  // ---- 哨棒（景阳冈：可折；折后剩半截）----
  if (staff) {
    const gr = lerp(0.12, 0.9, raise) + Math.sin(t * 1.3) * 0.02;
    c.save(); c.translate(lerp(82, 44, strike), handY - raise * 30); c.rotate(gr);
    const topY = staffBroken ? -96 : -210;
    Z.wire(c, [[0, 100], [0, topY]], { w: 4.6, tone: tone * 0.95, seed: 130, taper: 0.04 });
    Z.wire(c, [[0, topY], [0, topY - 14]], { w: 7, tone: tone * 0.92, seed: 131, taper: 0.08 });
    Z.wire(c, [[0, 100], [0, 84]], { w: 7, tone: tone * 0.88, seed: 132, taper: 0.08 });
    if (staffBroken) {                                          // 折断的茬口（斜断）
      Z.wire(c, [[-4, topY], [4, topY - 10]], { w: 3, tone, seed: 133 });
      Z.wire(c, [[-4, topY - 2], [4, topY - 8]], { w: 2.4, tone: tone * 0.8, seed: 134 });
    }
    c.restore();
  }

  // ---- 戒刀（单）：佩于左股 ----
  if (saber && !dual) {
    c.save(); c.translate(-58, waistY + 2); c.rotate(-0.6);
    Z.wire(c, [[0, 0], [0, -30]], { w: 2.8, tone: tone * 0.9, seed: 140 });
    Z.lined(c, [[0, -30], [7, -62], [2, -92]], { w: 2.6, tone, seed: 141 });
    c.restore();
  }
  // ---- 双戒刀（行者）：两手各一 ----
  if (dual) {
    for (const sx of [-1, 1]) {
      c.save(); c.translate(sx * lerp(48, 30, strike), handY - raise * 20 + sx * 4); c.rotate(sx * (lerp(0.5, 1.0, raise) + strike * 0.4));
      Z.wire(c, [[0, 0], [0, -28]], { w: 2.6, tone: tone * 0.9, seed: 150 + sx });
      Z.lined(c, [[0, -28], [sx * 6, -58], [sx * 2, -88]], { w: 2.4, tone, seed: 152 + sx });
      c.restore();
    }
  }

  // ---- 酒葫芦 ----
  if (gourd) {
    c.save(); c.translate(56, waistY + 6);
    Z.lined(c, [[0, 0], [-13, 16], [-11, 36], [0, 50], [11, 36], [13, 16]], { w: 2.6, tone: tone * 0.9, seed: 160, hatch: 0.16, gap: 6 });
    Z.wire(c, [[0, 0], [0, -9], [5, -5]], { w: 2, tone: tone * 0.8, seed: 161 });
    c.restore();
  }
  c.restore();
};

// ============================== 小件 ==============================
// 虎（景阳冈大虫：吊睛白额——圆耳、开颌獠牙、弓背、短斜斑纹、上扬长尾）
Z.tiger = (c, x, y, s, t, { flip = 0, pounce = 0, tone = 0.86, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const bob = Math.sin(t * 2.2) * 3;
  c.save(); c.translate(0, bob);
  // 弓背躯干（前倾扑势）
  const body = [[-140, 46], [-128, -30], [-60, -78], [40, -88], [120, -56], [158, 6], [140, 66], [30, 86], [-100, 80]];
  Z.lined(c, body, { w: 3.4, tone, seed: 300 + seed, hatch: 0.12, gap: 11, hatchAng: 0.12 });
  // 短斜斑纹（背与臀：短笔画，不成竖栅栏）
  for (let i = 0; i < 10; i++) {
    const u = i / 9, bx = -118 + u * 230, by = -52 + Math.sin(u * Math.PI) * 24;
    Z.wire(c, [[bx, by], [bx - 12, by + 34]], { w: 2.6, tone: tone * 0.9, seed: 310 + i });
  }
  for (let i = 0; i < 4; i++) {                                   // 臀部斜纹
    Z.wire(c, [[-108 + i * 16, 20], [-122 + i * 16, 62]], { w: 2.2, tone: tone * 0.8, seed: 322 + i });
  }
  // 头（大而圆：额宽颊阔，"吊睛白额"）
  const hx = 140, hy = -46;
  Z.lined(c, [[hx - 54, hy - 18], [hx - 40, hy - 54], [hx + 20, hy - 60], [hx + 62, hy - 34], [hx + 68, hy + 10], [hx + 40, hy + 42], [hx - 20, hy + 40], [hx - 50, hy + 14]], { w: 3.2, tone, seed: 330, hatch: 0.14, gap: 8 });
  Z.wire(c, [[hx - 40, hy - 54], [hx - 52, hy - 74], [hx - 26, hy - 66]], { w: 2.6, tone, seed: 331 });   // 左耳
  Z.wire(c, [[hx + 20, hy - 60], [hx + 24, hy - 84], [hx + 48, hy - 62]], { w: 2.6, tone, seed: 332 });   // 右耳
  // 王字（额头三横一竖）
  for (let i = 0; i < 3; i++) Z.wire(c, [[hx - 16 + i * 3, hy - 42 + i * 7], [hx + 16 - i * 3, hy - 42 + i * 7]], { w: 2.4, tone: tone * 0.92, seed: 333 + i });
  Z.wire(c, [[hx, hy - 44], [hx, hy - 20]], { w: 2.4, tone: tone * 0.92, seed: 336 });
  // 吊睛
  Z.wire(c, [[hx - 26, hy - 14], [hx - 8, hy - 6]], { w: 2.6, tone, seed: 337 });
  Z.wire(c, [[hx + 8, hy - 6], [hx + 26, hy - 14]], { w: 2.6, tone, seed: 338 });
  // 开颌（张口：上下颌弧 + 獠牙）
  Z.wire(c, [[hx + 30, hy + 18], [hx + 62, hy + 26], [hx + 54, hy + 44]], { w: 2.6, tone: tone * 0.9, seed: 339 });
  Z.wire(c, [[hx + 30, hy + 18], [hx + 44, hy + 12], [hx + 56, hy + 16]], { w: 2.2, tone, seed: 340 });
  for (let i = 0; i < 3; i++) Z.wire(c, [[hx + 38 + i * 8, hy + 18], [hx + 40 + i * 8, hy + 12]], { w: 1.8, tone, seed: 341 + i });
  // 尾（上扬反甩）
  const tail = [[150, 60], [190, 20], [212, -24], [196, -58]];
  Z.wire(c, tail, { w: 3.2, tone, seed: 350, taper: 0.35 });
  // 四腿（扑势前爪离地）
  Z.wire(c, [[-118, 80], [-142, 122], [-108, 128]], { w: 3, tone, seed: 351 });
  Z.wire(c, [[36, 86], [52, 128], [20, 132]], { w: 3, tone, seed: 352 });
  Z.wire(c, [[-80, 80], [-94, 122], [-62, 126]], { w: 2.8, tone, seed: 353 });
  Z.wire(c, [[104, 70], [126, 108], [94, 116]], { w: 2.8, tone, seed: 354 });
  c.restore();
  c.restore();
};

// 酒楼/楼（鸳鸯楼、狮子楼：比例照抄已验证的佛殿——宽体高身，双檐不上翘成蘑菇）
Z.tower = (c, x, y, s, { tone = 0.84, seed = 1, text = '', empty = 0 } = {}) => {
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

// 桥（飞云浦：拱桥 + 水）
Z.bridge = (c, x, y, s, { tone = 0.84, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-300, 0], [-120, -90], [120, -90], [300, 0]], { w: 3.6, tone, seed: 500 + seed, taper: 0.03 });
  Z.wire(c, [[-300, 14], [-120, -76], [120, -76], [300, 14]], { w: 2.6, tone: tone * 0.8, seed: 501 });
  for (let i = -2; i <= 2; i++) Z.wire(c, [[i * 60, -90 + Math.abs(i) * 6], [i * 60, 6]], { w: 2.4, tone: tone * 0.7, seed: 510 + i });
  c.restore();
};

// 店（十字坡黑店：招幌 + 门 + 案板）
Z.shop = (c, x, y, s, { tone = 0.84, seed = 1, text = '' } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-190, 0], [-190, -230], [190, -230], [190, 0]], { w: 3.4, tone, seed: 600 + seed, taper: 0.03 });
  Z.roof(c, 0, -230, 440, 80, { tone: tone * 0.95, seed: 610 });
  Z.hatchBox(c, [[-190, 0], [190, 0], [190, -230], [-190, -230]], { ang: -1.4, gap: 24, tone: 0.08, seed: 615 });
  Z.templeDoor(c, 0, 0, 1.0, { tone: tone * 0.85, seed: 8 });
  // 招幌（杆在檐外，旗垂在杆侧）
  Z.wire(c, [[252, -200], [252, -320]], { w: 2.6, tone, seed: 620 });
  Z.wire(c, [[252, -320], [316, -314]], { w: 2.4, tone: tone * 0.8, seed: 621 });
  Z.labelBox(c, 292, -312, 46, 66, { tone: tone * 0.9, seed: 622 });
  if (text) { c.save(); c.fillStyle = 'rgba(26,26,28,.86)'; c.font = '24px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 315, -278); c.restore(); }
  c.restore();
};

// 案（肉案 / 酒桌：横板 + 腿；十字坡、快活林共用）
Z.butcherTable = (c, x, y, s, { tone = 0.84, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-110, -60], [110, -60], [110, -44], [-110, -44], [-110, -60]], { w: 3.2, tone, seed: 700 + seed, taper: 0.04 });
  Z.hatchBox(c, [[-110, -60], [110, -60], [110, -44], [-110, -44]], { ang: 0, gap: 9, tone: 0.18, seed: 701 });
  Z.wire(c, [[-92, -44], [-92, 0]], { w: 3, tone, seed: 702 });
  Z.wire(c, [[92, -44], [92, 0]], { w: 3, tone, seed: 703 });
  c.restore();
};

// 潮（钱塘潮：与鲁智深片呼应的白浪横排线）
Z.tide = (c, t, { tone = 0.5, seed = 1 } = {}) => {
  for (let i = 0; i < 6; i++) {
    const yy = 940 + i * 22 + Math.sin(t * 1.3 + i) * 4;
    Z.wire(c, [[-20, yy], [W + 20, yy]], { w: 1.6, tone: tone * (0.5 + i * 0.06), seed: 800 + i, taper: 0.2 });
  }
};

// ============================== 八幕 ==============================
// ① 景阳冈打虎：哨棒折、徒手搏；酒旗"三碗不过冈"
SCENES['ws1_jingyang'] = (() => {
  const p = () => Z.paper('ws1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const hit = clamp(ss(1.4, 2.6, lt));
    Z.mountains(c, c, -60, 1980, [{ y0: 470, amp: 200, tone: 0.42, seed: 61 }]);
    Z.ground(c, 900, { seed: 41, tone: 0.34 });
    Z.flag(c, 360, 540, 150, t, { text: '三碗不过冈', seed: 15, size: 26 });
    Z.tiger(c, 1520, 884, 1.4, t, { flip: 1, pounce: hit, tone: 0.86, seed: 1 });
    Z.wusong(c, lerp(760, 1000, hit), 884, 1.32, t, { headband: 1, robe: 1, staff: 1, staffBroken: hit, raise: lerp(0.3, 1, hit), strike: hit });
    Z.bigText(c, '景阳冈打虎', { x: 1740, y: 110, size: 44, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
    Z.seal(c, 150, 880, '行者', clamp(ss(1.6, 2.6, lt)));
  } };
})();

// ② 斗杀西门庆：狮子桥下酒楼，武松（都头）自上扑下
SCENES['ws2_ximen'] = (() => {
  const p = () => Z.paper('ws2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    // 慢推镜（全画面连续微变，破后半段静止）
    const z = 1 + 0.035 * clamp(lt / 2.8);
    c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
    const drop = clamp(ss(1.2, 2.6, lt));
    Z.ground(c, 900, { seed: 42, tone: 0.34 });
    Z.tower(c, 1460, 850, 0.78, { tone: 0.78, seed: 2, text: '狮子楼' });
    Z.wusong(c, lerp(500, 860, drop), 884, 1.3, t, { headband: 1, robe: 1, saber: 1, raise: drop, strike: drop });
    Z.wusong(c, 1120, 884, 1.16, t, { headband: 0, robe: 1, flip: 1, kneel: drop });   // 西门庆（被击跪地）
    Z.scorch(c, [[-20, 900], [W + 20, 900], [W + 20, 1010], [-20, 1010]], { tone: 0.1, seed: 21, layers: 2 });
    Z.bigText(c, '斗杀西门庆', { x: 1740, y: 110, size: 44, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
    c.restore();
  } };
})();

// ③ 十字坡：孙二娘黑店，武松识破
SCENES['ws3_shizipo'] = (() => {
  const p = () => Z.paper('ws3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    // 慢推镜（破识别完成后的静止）
    const z = 1 + 0.035 * clamp(lt / 3.0);
    c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
    const reveal = clamp(ss(1.2, 2.6, lt));
    Z.ground(c, 900, { seed: 43, tone: 0.34 });
    Z.shop(c, 1420, 866, 1.05, { tone: 0.82, seed: 3, text: '孙' });
    Z.butcherTable(c, 720, 884, 1.0, { tone: 0.84, seed: 4 });
    Z.wusong(c, 500, 884, 1.3, t, { headband: 1, robe: 1, saber: 1, raise: reveal * 0.5 });
    // 孙二娘（短装、利落）
    c.save(); c.translate(980, 884); c.scale(-1.15, 1.15);
    const body = [[-40, -140], [-50, -70], [-52, 0], [52, 0], [48, -70], [40, -140]];
    Z.lined(c, body, { w: 3, tone: 0.82, seed: 330, hatch: 0.2, gap: 10 });
    Z.wire(c, [[-24, -118], [-18, -150], [18, -150], [24, -118]], { w: 2.8, tone: 0.82, seed: 331 });
    Z.wire(c, [[-18, -128], [18, -128]], { w: 2.6, tone: 0.8, seed: 332 });
    c.restore();
    Z.bigText(c, '十字坡遇孙二娘', { x: 1710, y: 110, size: 40, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
    c.restore();
  } };
})();

// ④ 醉打蒋门神：快活林酒肆，武松佯醉
SCENES['ws4_jiang'] = (() => {
  const p = () => Z.paper('ws4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const hit = clamp(ss(1.4, 2.7, lt));
    Z.ground(c, 900, { seed: 44, tone: 0.34 });
    Z.tower(c, 1580, 850, 0.76, { tone: 0.78, seed: 5, text: '快活林' });
    Z.butcherTable(c, 480, 884, 1.05, { tone: 0.84, seed: 6 });
    Z.wusong(c, lerp(720, 960, hit), 884, 1.3, t, { headband: 1, robe: 1, gourd: 1, drunk: 1, raise: lerp(0.2, 0.9, hit), strike: hit });
    Z.wusong(c, 1240, 884, 1.16, t, { headband: 0, robe: 1, flip: 1, kneel: hit });   // 蒋门神
    Z.bigText(c, '醉打蒋门神', { x: 1740, y: 110, size: 44, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑤ 大闹飞云浦：带枷杀出
SCENES['ws5_feiyun'] = (() => {
  const p = () => Z.paper('ws5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const burst = clamp(ss(1.2, 2.7, lt));
    Z.mountains(c, c, -60, 1980, [{ y0: 470, amp: 170, tone: 0.4, seed: 71 }]);
    Z.ground(c, 900, { seed: 45, tone: 0.32 });
    Z.bridge(c, 1060, 906, 1.1, { tone: 0.8, seed: 7 });
    Z.tide(c, t, { tone: 0.4, seed: 8 });
    // 两个公差/蒋门神徒弟（被击跪地）
    for (let i = 0; i < 2; i++) Z.wusong(c, [1450, 1620][i], 884, 1.02, t, { headband: 0, robe: 1, flip: i, kneel: burst });
    Z.wusong(c, lerp(520, 840, burst), 884, 1.36, t, { headband: 1, robe: 1, prisoner: 1, saber: 1, raise: burst, strike: burst });
    Z.bigText(c, '大闹飞云浦', { x: 1740, y: 110, size: 44, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑥ 血溅鸳鸯楼：整幕留白——不直绘血。空楼 + 题壁墨字 + 一枚朱砂印角（画外）。
SCENES['ws6_yuanyang'] = (() => {
  const p = () => Z.paper('ws6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    // 慢推镜：留白幕也要有呼吸（极缓），题字显形之后画面仍不完全静止
    const z = 1 + 0.03 * clamp(lt / 3.2);
    c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
    const appear = clamp(ss(0.4, 2.4, lt));
    Z.tower(c, 960, 830, 0.72, { tone: 0.78, seed: 9, text: '鸳鸯楼', empty: 1 });
    // 留白：整幕不出现人物、不直绘血——只有空楼与题壁墨字（画外之事，以"题"代"绘"）
    c.save(); c.fillStyle = `rgba(26,26,28,${0.88 * appear})`; c.font = '72px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('杀人者，打虎武松也', 960, 300); c.restore();
    // 一枚朱砂印角（留白处的画外提示，非血）
    Z.seal(c, 150, 880, '武松', appear);
    Z.bigText(c, '血溅鸳鸯楼', { x: 1740, y: 110, size: 44, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
    c.restore();
  } };
})();

// ⑦ 行者装束：铁戒箍 + 人骨数珠 + 双戒刀 + 皂直裰
SCENES['ws7_xingzhe'] = (() => {
  const p = () => Z.paper('ws7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const armed = clamp(ss(1.0, 2.6, lt));
    Z.ground(c, 900, { seed: 46, tone: 0.34 });
    Z.pine(c, t, { x: 340, y: 906, s: 1.8, seed: 12, tone: 0.72 });
    c.save(); c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 2.2; c.beginPath(); c.arc(1640, 230, 62, 0, 7); c.stroke(); c.restore();
    Z.wusong(c, 960, 884, 1.4, t, { headband: 0, hood: 1, robe: 1, beads: 1, dual: armed, raise: armed * 0.6 });
    Z.scorch(c, [[-20, 900], [W + 20, 900], [W + 20, 1010], [-20, 1010]], { tone: 0.12, seed: 21, layers: 2 });
    Z.bigText(c, '行者武松', { x: 1740, y: 110, size: 44, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑧ 六和寺出家：与鲁智深同终，以潮信呼应听潮圆寂
SCENES['ws8_liuhe'] = (() => {
  const p = () => Z.paper('ws8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const sit = clamp(ss(0.6, 2.4, lt));
    Z.mountains(c, c, -60, 1980, [{ y0: 480, amp: 150, tone: 0.38, seed: 81 }]);
    Z.ground(c, 900, { seed: 47, tone: 0.32 });
    Z.tower(c, 1160, 830, 0.75, { tone: 0.8, seed: 10, text: '六和寺' });
    Z.tide(c, t, { tone: 0.5, seed: 11 });
    Z.wusong(c, 620, 884, 1.36, t, { headband: 0, hood: 1, robe: 1, beads: 1, kneel: sit, sit: sit });
    // 远处趺坐的鲁智深（呼应：同一座寺，同一道潮）
    Z.luzhishen(c, 1600, 884, 1.18, t, { monk: 1, sit: 1, cassock: 0.0, staff: 0, tone: 0.62 });
    Z.bigText(c, '六和寺出家', { x: 1740, y: 110, size: 44, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();
})();
