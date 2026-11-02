// 《水浒传·史进》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：青年英雄——束发簪（不戴冠，少年气）、锦袍（史太公之子，衣饰华整）、三尖两刃刀（标志长械）。
// 唯一的彩：朱砂只用于① 钤印 ② 第五幕燔庄的火星 ③ 第八幕中箭那一抹——全片三处，余皆黑白灰。
// 母题：① 九条龙刺青（bare 时显形，是这部片签字；robe 时不显，靠第三幕与钤印立身份）
//       ② 三尖两刃刀（贯穿，握向取正不横穿脸） ③ 束发飘带（随手摆，活气母题）
//       ④ 火（第五幕） ⑤ 箭雨（第八幕）
// 弧光：史家庄顽少 → 王进教艺得名九纹龙 → 一身花绣 → 少华山结义 → 中秋烧庄逼上梁山
//      → 落草 → 寻师不着聚义梁山 → 昱岭关殉身（阵亡，悲剧闭环）。
// 依《水浒传》第二回及百回本系统；史进为累积型文学形象，《大宋宣和遗事》已著录"九纹龙史进"，正史无其人。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 九条龙之一（刺青母题：S 形蟠身 + 龙头 + 双爪 + 尾；版画龙纹是一缕花绣，头在上尾在下，能读作龙）
Z.dragon = (c, x, y, s, { tone = 0.85, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const pts = [];                                                                                     // 龙身：头在上、尾在下的 S 波
  for (let i = 0; i <= 14; i++) { const u = i / 14; pts.push([Math.sin(u * Math.PI * 2.2) * 12 * (1 - u * 0.3), -20 + u * 40]); }
  Z.wire(c, pts, { w: 2.2, tone, seed, taper: 0.15 });
  Z.wire(c, [[-6, -20], [-10, -30], [-2, -34], [6, -30], [2, -20]], { w: 2, tone, seed: seed + 1 });   // 龙头
  Z.wire(c, [[-2, -34], [-6, -42]], { w: 1.6, tone, seed: seed + 2 });                                  // 龙角
  Z.wire(c, [[0, 20], [6, 30]], { w: 1.8, tone, seed: seed + 3 });                                       // 尾梢
  Z.wire(c, [[-9, 2], [-16, 8]], { w: 1.6, tone, seed: seed + 4 });                                      // 前爪
  Z.wire(c, [[9, 6], [16, 12]], { w: 1.6, tone, seed: seed + 5 });                                       // 后爪
  c.restore();
};

// 史家庄院（门楼重檐 + 院墙 + 瓦垄 + 匾）
Z.manor = (c, x, y, s, { tone = 0.82, seed = 1, text = '' } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-284, 0], [-284, -150], [284, -150], [284, 0]], { w: 3.4, tone, seed });
  Z.hatchBox(c, [[-284, 0], [284, 0], [284, -150], [-284, -150]], { ang: -1.4, gap: 18, tone: 0.1, seed });
  Z.roof(c, 0, -150, 380, 92, { tone: 0.9, seed });
  Z.roof(c, 0, -252, 286, 70, { tone: 0.85, seed: seed + 1 });
  Z.wire(c, [[-62, -150], [-62, -58], [62, -58], [62, -150]], { w: 3, tone: 0.85, seed: seed + 2 });   // 门洞
  if (text) {
    Z.labelBox(c, -54, -206, 108, 30, { tone: 0.9, seed: seed + 3 });
    c.save(); c.fillStyle = 'rgba(26,26,28,.86)'; c.font = '23px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, 0, -191); c.restore();
  }
  c.restore();
};

// 少华山寨（木栅 + 望楼 + 旗）
Z.shanzhai = (c, x, y, s, { tone = 0.8, seed = 1, text = '' } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = -6; i <= 6; i++) Z.wire(c, [[i * 40, 0], [i * 40 - 6, -128], [i * 40 + 6, -128], [i * 40, 0]], { w: 2.8, tone, seed: 100 + i });
  Z.wire(c, [[-250, 0], [250, 0]], { w: 3.4, tone, seed: 200 });
  Z.wire(c, [[-250, -128], [250, -128]], { w: 3, tone, seed: 201 });
  Z.wire(c, [[-66, -128], [-66, -226], [66, -226], [66, -128]], { w: 3.2, tone: 0.85, seed: 202 });   // 望楼
  Z.roof(c, 0, -226, 210, 70, { tone: 0.9, seed: 203 });
  if (text) {
    Z.labelBox(c, -50, -282, 100, 28, { tone: 0.9, seed: seed + 3 });
    c.save(); c.fillStyle = 'rgba(26,26,28,.86)'; c.font = '22px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, 0, -268); c.restore();
  }
  c.restore();
};

// 昱岭关（城墙 + 砖纹 + 城门洞 + 敌楼）
Z.guan = (c, x, y, s, { tone = 0.82, seed = 1, text = '' } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-380, 0], [-380, -210], [380, -210], [380, 0]], { w: 4, tone, seed });
  Z.hatchBox(c, [[-380, 0], [380, 0], [380, -210], [-380, -210]], { ang: -1.4, gap: 16, tone: 0.12, seed: seed + 1 });
  for (let i = -340; i < 340; i += 42) Z.wire(c, [[i, -210], [i, -110]], { w: 1.4, tone: 0.5, seed: 300 + i });
  Z.wire(c, [[-72, -210], [-72, -112], [72, -112], [72, -210]], { w: 3.4, tone: 0.9, seed: 400 });       // 门洞
  Z.wire(c, [[-190, -210], [-190, -306], [190, -306], [190, -210]], { w: 3.4, tone: 0.85, seed: 401 });   // 敌楼
  Z.roof(c, 0, -306, 440, 92, { tone: 0.9, seed: 402 });
  if (text) {
    Z.labelBox(c, -54, -362, 108, 28, { tone: 0.9, seed: seed + 3 });
    c.save(); c.fillStyle = 'rgba(26,26,28,.86)'; c.font = '22px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, 0, -348); c.restore();
  }
  c.restore();
};

// 通用配角（王进 / 少华山三头领 / 官军）：一身线描 + 可选头盔 + 枪或刀
Z.fighter = (c, x, y, s, t, { flip = 0, tone = 0.78, helmet = 0, blade = 0, spear = 0, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const br = Math.sin(t * 1.6 + seed) * 2;
  const body = [[-40, -150], [-50, -70], [-54, 0], [54, 0], [50, -70], [40, -150]];
  Z.lined(c, body, { w: 3, tone, seed, hatch: 0.16, gap: 11, hatchAng: -0.9 });
  Z.wire(c, [[-46, -82], [46, -82]], { w: 3.4, tone: 0.9, seed: seed + 1 });
  const hy = -190 + br * 0.4;
  Z.wire(c, [[-18, hy - 10], [-15, hy - 32], [0, hy - 42], [15, hy - 32], [18, hy - 10], [16, hy + 12], [0, hy + 22], [-16, hy + 10]], { w: 2.4, tone, seed: seed + 2, taper: 0.08 });
  Z.wire(c, [[-8, hy - 4], [-3, hy - 3]], { w: 1.6, tone: 0.85, seed });
  Z.wire(c, [[3, hy - 3], [8, hy - 4]], { w: 1.6, tone: 0.85, seed: seed + 3 });
  Z.wire(c, [[-6, hy + 10], [6, hy + 10]], { w: 1.8, tone: 0.75, seed: seed + 4 });
  if (helmet) {
    Z.lined(c, [[-22, hy - 16], [-18, hy - 44], [18, hy - 44], [22, hy - 16]], { w: 2.6, tone: 0.92, seed: seed + 5, hatch: 0.18, gap: 5 });
    Z.wire(c, [[0, hy - 44], [0, hy - 58], [6, hy - 50]], { w: 2.2, tone: 0.85, seed: seed + 6 });
  } else {
    Z.wire(c, [[-18, hy - 20], [-14, hy - 44], [14, hy - 44], [18, hy - 20]], { w: 2.4, tone: 0.9, seed: seed + 5 });
    Z.wire(c, [[-18, hy - 20], [18, hy - 20]], { w: 2, tone: 0.7, seed: seed + 6 });
  }
  if (spear) {                                                       // 枪（王进用）
    Z.wire(c, [[34, -140], [54, -200], [50, -330]], { w: 3.4, tone: 0.95, seed: seed + 7, taper: 0.05 });
    Z.wire(c, [[54, -200], [66, -210]], { w: 2.6, tone, seed: seed + 8 });
    Z.wire(c, [[54, -200], [42, -210]], { w: 2.6, tone, seed: seed + 9 });
  }
  if (blade) {                                                       // 大刀（官军用）
    Z.wire(c, [[44, -136], [64, -96], [68, -40]], { w: 3, tone, seed: seed + 7 });
    Z.wire(c, [[68, -40], [62, -230]], { w: 3.4, tone: 0.92, seed: seed + 8, taper: 0.04 });
    Z.lined(c, [[62, -230], [70, -256], [62, -276]], { w: 2.4, tone, seed: seed + 9 });
  }
  c.restore();
};

// ============================== 史进本体 ==============================
// o: { robe锦袍, spear三尖两刃刀, flip朝向, raise抡举, angry怒, bare袒身露龙纹,
//      draw提刀, kneel跪, sit趺坐, hurt中箭, tone }
Z.shijin = (c, x, y, s, t, o = {}) => {
  const {
    robe = 1, spear = 0, flip = 0, raise = 0, angry = 0, bare = 0,
    draw = 0, kneel = 0, sit = 0, hurt = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.5) * 2.4;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 52 : 0);
  const cp = sit ? 0.66 : 1;
  const shoulderY = ly - 160 * cp - (sit ? 4 : 0);
  const waistY = ly - 80 * cp;
  const hemY = ly - (sit ? 30 : 2);
  const hemW = sit ? 92 : 62;

  // ---- 躯干（锦袍/袒身）----
  const body = [[-56, shoulderY + 8], [-64, waistY + 8], [-hemW, hemY], [hemW, hemY], [64, waistY + 8], [56, shoulderY + 8]];
  if (!bare) {
    Z.lined(c, body, { w: 3.2, tone, seed: 71, hatch: 0.18, gap: 10, hatchAng: -0.9 });
    c.save(); c.fillStyle = 'rgba(108,112,120,.14)';
    c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  } else {
    Z.lined(c, body, { w: 2.8, tone: tone * 0.92, seed: 71, hatch: 0.12, gap: 12, hatchAng: -0.7 });
  }

  // ---- 腰带 ----
  Z.wire(c, [[-60, waistY], [60, waistY]], { w: 4, tone: tone * 0.95, seed: 76, taper: 0.08 });
  Z.wire(c, [[-60, waistY + 8], [60, waistY + 8]], { w: 2, tone: tone * 0.7, seed: 77, taper: 0.08 });

  // ---- 九条龙刺青（仅袒身时显形：这部片的签字）----
  if (bare) {
    const dragons = [
      [-26, shoulderY + 30], [26, shoulderY + 30], [0, shoulderY + 10],
      [-32, waistY + 8], [32, waistY + 8], [0, waistY + 12],
      [-22, waistY + 40], [22, waistY + 40], [0, waistY + 30],
    ];
    for (let i = 0; i < 9; i++) Z.dragon(c, dragons[i][0], dragons[i][1], 1.0, { tone: tone * 0.9, seed: 600 + i });
  }

  // ---- 双臂 ----
  const armUp = lerp(0.16, -0.6, raise) + Math.sin(t * 1.5 + 1) * 0.02;
  const handY = shoulderY + 54 + Math.sin(armUp) * 60;
  Z.wire(c, [[-50, shoulderY + 14], [-66, shoulderY + 58], [-54, handY + 6]], { w: 3.2, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[50, shoulderY + 14], [66, shoulderY + 54 - raise * 26], [54, handY - raise * 40]], { w: 3.2, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[-54, handY + 2], [-40, handY + 22], [-30, handY + 6], [-44, handY - 14]], { w: 2.2, tone: tone * 0.8, seed: 82 });
  Z.lined(c, [[54, handY - 2], [40, handY + 18], [30, handY], [44, handY - 16]], { w: 2.2, tone: tone * 0.8, seed: 83 });

  // ---- 头（青年，束发簪）----
  const hy = shoulderY - 38 + br * 0.5;
  c.save(); c.translate(0, hy); c.scale(1.12, 1.12); c.translate(0, -hy);
  const face = [[-22, hy - 14], [-19, hy - 38], [0, hy - 48], [19, hy - 38], [22, hy - 14], [20, hy + 14], [0, hy + 26], [-20, hy + 12]];
  Z.wire(c, face, { w: 2.6, tone, seed: 84, taper: 0.08 });
  Z.wire(c, [[-20, hy - 22], [-14, hy - 48], [14, hy - 48], [20, hy - 22]], { w: 2.6, tone: 0.9, seed: 110 });   // 束发
  Z.wire(c, [[-20, hy - 22], [20, hy - 22]], { w: 2, tone: 0.7, seed: 111 });
  Z.wire(c, [[0, hy - 48], [10, hy - 58]], { w: 2.2, tone: 0.85, seed: 112 });                                     // 簪
  const rib = Math.sin(t * 2.2) * 0.3;                                                                            // 飘动束发带（母题活气）
  Z.wire(c, [[-20, hy - 26], [-44 - rib * 20, hy - 40 - rib * 14]], { w: 1.8, tone: 0.7, seed: 113 });
  for (const sx of [-1, 1]) {
    Z.wire(c, [[sx * 5, hy - lerp(20, 23, angry)], [sx * 15, hy - lerp(19, 13, angry)]], { w: 3, tone: tone * 0.95, seed: 87 + sx });
    Z.lined(c, [[sx * 4, hy - 11], [sx * 10, hy - 16], [sx * 16, hy - 11], [sx * 10, hy - 6]], { w: 1.5, tone, seed: 89 + sx, hatch: 0.5, gap: 3 });
  }
  Z.wire(c, [[0, hy - 11], [1, hy]], { w: 2, tone: tone * 0.8, seed: 91 });
  Z.wire(c, [[-8, hy + 6], [8, hy + 6]], { w: 2.4, tone: tone * 0.85, seed: 92 });
  c.restore();

  // ---- 三尖两刃刀（长杆 + 三叉刃，握向取正不横穿脸）----
  if (spear) {
    const gr = lerp(0.12, 0.92, raise) + Math.sin(t * 1.2) * 0.02;
    c.save(); c.translate(lerp(86, 48, draw), handY - raise * 30); c.rotate(gr);
    Z.wire(c, [[0, 120], [0, -200]], { w: 5, tone: tone * 0.95, seed: 160, taper: 0.03 });
    Z.wire(c, [[0, -200], [0, -236]], { w: 6, tone: tone * 0.95, seed: 161, taper: 0.1 });
    Z.wire(c, [[0, -236], [-20, -236], [-26, -258]], { w: 3.2, tone, seed: 162 });
    Z.wire(c, [[0, -236], [20, -236], [26, -258]], { w: 3.2, tone, seed: 163 });
    Z.wire(c, [[0, -236], [0, -272]], { w: 3.4, tone, seed: 164 });
    Z.wire(c, [[0, 120], [0, 100]], { w: 7, tone: tone * 0.9, seed: 165, taper: 0.1 });
    c.restore();
  }
  if (hurt) {
    c.save(); c.fillStyle = 'rgba(183,51,46,.5)';
    for (let i = 0; i < 4; i++) c.fillRect(-20 + i * 11, waistY - 18 + i * 4, 3.2, 3.2);
    c.restore();
  }
  c.restore();
};

// ============================== 八幕 ==============================
// ① 史家庄少主：不喜农耕，独爱枪棒
SCENES['sj1_shijiazhuang'] = (() => {
  const p = () => Z.paper('sj1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 420, y: 180, s: 1.0, seed: 4, tone: 0.32 });
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.pine(c, t, { x: 210, y: 906, s: 1.9, seed: 50, tone: 0.72 });          // 左松（平衡构图）
      Z.manor(c, 1430, 866, 1.0, { tone: 0.82, seed: 2, text: '史家庄' });
      Z.flag(c, 380, 640, 150, t, { text: '史', seed: 18, size: 30 });
      Z.shijin(c, 930, 892, 1.5, t, { robe: 1, spear: 1, raise: clamp(Math.sin(t * 1.4) * 0.4 + 0.2) });
      // 枪尖微颤 + 落叶（活气）
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 60 + i * 230) % 2000) - 40, by = 360 + ((t * 44 + i * 150) % 500);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.6, tone: 0.42, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '史家庄少主', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 王教头教艺：东京八十万禁军教头王进避难至此，史进拜师
SCENES['sj2_wangjin'] = (() => {
  const p = () => Z.paper('sj2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const prac = clamp(ss(0.8, 2.4, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 2.8)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1500, y: 200, s: 1.0, seed: 6, tone: 0.3 });
      Z.ground(c, 900, { seed: 12, tone: 0.38 });
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 150, tone: 0.34, seed: 91 }]);
      Z.fighter(c, 1300, 890, 1.42, t, { helmet: 1, spear: 1, seed: 1, tone: 0.78, flip: 1 });   // 王进
      Z.shijin(c, 760, 892, 1.46, t, { robe: 1, spear: 1, raise: prac * 0.6 });                      // 史进学艺
      for (let i = 0; i < 11; i++) {                                                              // 落叶
        const bx = ((t * 52 + i * 190) % 2000) - 40, by = 380 + ((t * 40 + i * 130) % 520);
        Z.wire(c, [[bx, by], [bx + 10, by + 5]], { w: 1.6, tone: 0.4, seed: 2000 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '王教头教艺', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ③ 九纹龙身：半年武艺精通，一身刺了九条龙
SCENES['sj3_jiuwenlong'] = (() => {
  const p = () => Z.paper('sj3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const bare = clamp(ss(0.6, 2.0, lt));
    const cam = { x: 960, y: 560, z: lerp(1.05, 1.12, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 220, s: 1.0, seed: 8, tone: 0.3 });
      Z.ground(c, 900, { seed: 13, tone: 0.36 });
      // 火把（活气母题：光与火苗随 t 摇曳）
      Z.flame(c, 320, 866, 0.8, t, { seed: 3, tone: 0.66 });
      Z.wire(c, [[320, 866], [320, 760]], { w: 3, tone: 0.8, seed: 2100 });
      Z.shijin(c, 980, 892, 1.65, t, { robe: 1 - bare, bare, tone: 0.9 });
      for (let i = 0; i < 8; i++) {                                                              // 飘动束发带余波（活气）
        const bx = ((t * 70 + i * 260) % 2000) - 40, by = 300 + ((t * 50 + i * 170) % 520);
        Z.wire(c, [[bx, by], [bx + 14, by + 6]], { w: 1.5, tone: 0.36, seed: 2200 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '一身九纹龙', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 130, 890, '九纹龙', clamp(ss(1.8, 2.8, lt)), { size: 28 });
  } };
})();

// ④ 少华山结义：陈达借粮被擒，朱武杨春苦肉计，史进反与三人结义
SCENES['sj4_shaohuashan'] = (() => {
  const p = () => Z.paper('sj4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 420, y: 190, s: 1.0, seed: 5, tone: 0.32 });
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 200, tone: 0.42, seed: 101 }, { y0: 640, amp: 120, tone: 0.3, seed: 102 }]);
      Z.ground(c, 900, { seed: 14, tone: 0.36 });
      Z.shanzhai(c, 1560, 856, 0.92, { tone: 0.78, seed: 4, text: '少华山' });
      Z.flag(c, 300, 660, 120, t, { text: '', seed: 19, size: 28 });
      Z.fighter(c, 1320, 890, 1.1, t, { seed: 2, tone: 0.74, flip: 1 });   // 朱武
      Z.fighter(c, 1480, 886, 1.0, t, { seed: 3, tone: 0.7, flip: 1 });    // 杨春
      Z.fighter(c, 1180, 888, 1.04, t, { seed: 4, tone: 0.72 });           // 陈达
      Z.shijin(c, 760, 892, 1.46, t, { robe: 1, spear: 1, raise: 0.2 });   // 史进
    });
    Z.bigText(c, '少华山结义', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 中秋事发·烧庄：李吉告发，官军围庄，史进烧庄杀出（火为朱砂星点）
SCENES['sj5_zhongqiu'] = (() => {
  const p = () => Z.paper('sj5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const burn = clamp(ss(0.9, 2.6, lt));
    const rush = clamp(ss(1.2, 2.6, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 15, tone: 0.4 });
      Z.manor(c, 1450, 864, 1.0, { tone: 0.82, seed: 2, text: '史家庄' });
      // 火（燔庄：强活气，朱砂星点）
      Z.flame(c, 1320, 760, 1.6 + burn, t, { seed: 3, tone: 0.7 });
      Z.flame(c, 1560, 800, 1.3 + burn, t, { seed: 7, tone: 0.66 });
      Z.flame(c, 1180, 820, 1.1 + burn, t, { seed: 11, tone: 0.62 });
      Z.fighter(c, 1620, 884, 0.9, t, { seed: 5, blade: 1, tone: 0.7, flip: 1 });   // 官军
      Z.fighter(c, 1740, 880, 0.8, t, { seed: 6, blade: 1, tone: 0.66, flip: 1 });
      Z.shijin(c, lerp(560, 820, rush), 892, 1.5, t, { robe: 1, spear: 1, raise: rush, angry: 1 });
      for (let i = 0; i < 7; i++) {                                                       // 飞溅火星余烬（活气）
        const bx = ((t * 200 + i * 320) % 2000) - 40, by = 600 - ((t * 120 + i * 90) % 360);
        c.save(); c.globalAlpha = burn * 0.7; c.fillStyle = 'rgba(183,51,46,.5)';
        c.beginPath(); c.arc(bx, by, 2.4 + (i % 3), 0, 7); c.fill(); c.restore();
      }
    });
    Z.bigText(c, '中秋烧庄', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 落草少华山：据山寨，做了绿林头领
SCENES['sj6_luocao'] = (() => {
  const p = () => Z.paper('sj6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.1, seed: 9, tone: 0.34 });
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 220, tone: 0.48, seed: 121 }, { y0: 650, amp: 130, tone: 0.32, seed: 122 }]);
      Z.ground(c, 900, { seed: 16, tone: 0.36 });
      Z.shanzhai(c, 1520, 856, 0.96, { tone: 0.8, seed: 8, text: '少华山' });
      Z.flag(c, 300, 650, 130, t, { text: '替天行道', seed: 18, size: 26 });
      Z.fighter(c, 600, 890, 1.1, t, { seed: 2, tone: 0.74 });
      Z.fighter(c, 760, 888, 1.0, t, { seed: 3, tone: 0.7 });
      Z.shijin(c, 1000, 892, 1.5, t, { robe: 1, spear: 1, raise: 0.25 });
    });
    Z.bigText(c, '少华山落草', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 寻师聚义：寻王进不着，终上梁山，坐第二十三把交椅
SCENES['sj7_xunshi'] = (() => {
  const p = () => Z.paper('sj7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1500, y: 190, s: 1.1, seed: 10, tone: 0.34 });
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 240, tone: 0.46, seed: 131 }, { y0: 670, amp: 140, tone: 0.3, seed: 132 }]);
      Z.ground(c, 900, { seed: 17, tone: 0.36 });
      Z.shanzhai(c, 1560, 856, 0.9, { tone: 0.78, seed: 5, text: '梁山泊' });
      Z.flag(c, 320, 640, 160, t, { text: '替天行道', seed: 18, size: 28 });
      Z.shijin(c, 940, 892, 1.5, t, { robe: 1, spear: 1, raise: clamp(Math.sin(t * 1.2) * 0.3 + 0.2) });
      for (let i = 0; i < 10; i++) {                                                              // 漂泊之落叶
        const bx = ((t * 64 + i * 210) % 2000) - 40, by = 360 + ((t * 46 + i * 140) % 540);
        Z.wire(c, [[bx, by], [bx + 11, by + 5]], { w: 1.6, tone: 0.4, seed: 2300 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '梁山聚义', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 昱岭关殉身：征方腊，乱箭之下，九纹龙殒于阵前（中箭一抹朱砂）
SCENES['sj8_yulingguan'] = (() => {
  const p = () => Z.paper('sj8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const fall = clamp(ss(1.6, 3.2, lt));
    const cam = { x: 960, y: 560, z: lerp(1.08, 1.0, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 600, y: 180, s: 1.1, seed: 12, tone: 0.32 });
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 180, tone: 0.34, seed: 141 }]);
      Z.ground(c, 900, { seed: 18, tone: 0.34 });
      Z.guan(c, 1500, 856, 0.92, { tone: 0.82, seed: 6, text: '昱岭关' });
      Z.flag(c, 320, 640, 140, t, { text: '', seed: 20, size: 28 });
      // 箭雨（活气母题：自右上方不绝落下）
      for (let i = 0; i < 16; i++) {
        const bx = ((t * 360 + i * 130) % 1700) + 120, by = ((t * 520 + i * 70) % 760) + 40;
        const sw = Math.sin(t * 4 + i) * 0.16;
        Z.wire(c, [[bx, by], [bx - 26 - sw * 30, by + 60]], { w: 2, tone: 0.62, seed: 2400 + i, taper: 0.3 });
        Z.wire(c, [[bx - 26 - sw * 30, by + 60], [bx - 34 - sw * 30, by + 50]], { w: 2.4, tone: 0.7, seed: 2450 + i });
      }
      c.save(); c.globalAlpha = 1 - fall * 0.3;
      Z.shijin(c, 860, 892 - fall * 30, 1.46, t, { robe: 1, spear: 1 - fall, hurt: fall, angry: 0.4, tone: 0.9 });
      c.restore();
    });
    Z.bigText(c, '昱岭关殒身', { x: 1760, y: 110, size: 46, tone: 0.92, appear: clamp(ss(1.8, 2.8, lt)) });
    Z.seal(c, 140, 884, '阵亡', clamp(ss(2.6, 3.7, lt)), { size: 26 });
  } };
})();
})();
