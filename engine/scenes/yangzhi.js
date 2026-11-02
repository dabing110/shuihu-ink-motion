// 《水浒传·杨志》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：将门之后（杨家将子孙）——武举出身、殿司制使。特征「青面」：面皮上一搭青记（本系列仅朱砂一味，
//       故青记以焦墨排线块示意，不施青色，见 eras 考据）。武器：祖传宝刀（signature）+ 枪（校场比武用）。
// 唯一的彩：朱砂只用于① 钤印 ② 第四幕杀牛二那一刀的血光 ③ 第六幕黄泥冈酒桶旁一点（蒙汗药酒）——全片三处，余皆黑白灰。
// 母题：① 宝刀（贯穿，握向取正不横穿脸）② 青记（脸上焦墨排线，身份签字）③ 生辰纲（第十万贯金银——以箱笼排线代）
//       ④ 黄河浪（第二幕）⑤ 营帐灯火（第八幕）。
// 弧光：殿司制使 → 失陷花石纲 → 卖刀杀牛二 → 大名府比武 → 押生辰纲被劫 → 二龙山落草 → 梁山 → 征方腊丹徒病故（病死，闭环之一种）。
// 依《水浒传》第十二至十七回及百回本系统；杨志为累积型文学形象，正史无其人。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 天汉州桥（市井石桥：拱 + 桥栏 + 河）
Z.bridge = (c, x, y, s, { tone = 0.82, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-360, 0], [-200, -90], [200, -90], [360, 0]], { w: 3.4, tone, seed });           // 拱
  Z.wire(c, [[-360, 0], [-200, -120], [200, -120], [360, 0]], { w: 3, tone: 0.85, seed: seed + 1 }); // 栏上沿
  Z.hatchBox(c, [[-360, 0], [360, 0], [200, -90], [-200, -90]], { ang: -1.4, gap: 20, tone: 0.1, seed: seed + 2 });
  for (let i = -3; i <= 3; i++) Z.wire(c, [[i * 110, -90], [i * 110, -118]], { w: 2.4, tone: 0.7, seed: 100 + i });
  c.restore();
};

// 黄河船（花石纲沉船意象：船身 + 帆）
Z.boat = (c, x, y, s, t, { tone = 0.8, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-160, 0], [-120, -46], [120, -46], [160, 0]], { w: 3.4, tone, seed });             // 船身
  Z.wire(c, [[-160, 0], [160, 0]], { w: 3, tone, seed: seed + 1 });
  Z.wire(c, [[-90, -46], [-90, -176], [70, -176], [70, -46]], { w: 2.6, tone: 0.85, seed: seed + 2 }); // 帆
  Z.wire(c, [[-90, -46], [70, -176]], { w: 1.8, tone: 0.5, seed: seed + 3 });
  c.restore();
};

// 营帐（征方腊丹徒：帐 + 旗 + 灯火）
Z.tent = (c, x, y, s, { tone = 0.8, seed = 1, text = '' } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-150, 0], [-150, -120], [0, -200], [150, -120], [150, 0]], { w: 3.4, tone, seed }); // 帐顶
  Z.roof(c, 0, -200, 320, 80, { tone: 0.9, seed: seed + 1 });
  Z.wire(c, [[-60, 0], [-60, -150], [60, -150], [60, 0]], { w: 3, tone: 0.85, seed: seed + 2 });  // 帐门
  if (text) {
    Z.labelBox(c, -44, -250, 88, 26, { tone: 0.9, seed: seed + 3 });
    c.save(); c.fillStyle = 'rgba(26,26,28,.86)'; c.font = '21px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, 0, -237); c.restore();
  }
  c.restore();
};

// 生辰纲箱笼（第十万贯金银——以箱笼排线代，不画财宝）
Z.crate = (c, x, y, s, { tone = 0.78, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-46, 0], [-46, -60], [46, -60], [46, 0]], { w: 3.2, tone, seed });
  Z.wire(c, [[-46, 0], [46, 0]], { w: 3.4, tone, seed: seed + 1 });
  Z.hatchBox(c, [[-46, 0], [46, 0], [46, -60], [-46, -60]], { ang: -0.9, gap: 9, tone: 0.16, seed: seed + 2 });
  Z.wire(c, [[-46, -60], [46, -60]], { w: 3.2, tone, seed: seed + 3 });
  c.restore();
};

// ============================== 杨志本体 ==============================
// o: { robe袍, helmet盔, blade宝刀, spear枪, flip, raise, angry, draw拔刀, kneel, sit, hurt, tone }
Z.yangzhi = (c, x, y, s, t, o = {}) => {
  const {
    robe = 1, helmet = 0, blade = 0, spear = 0, flip = 0, raise = 0, angry = 0,
    draw = 0, kneel = 0, sit = 0, hurt = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.5) * 2.4;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 52 : 0);
  const cp = sit ? 0.66 : 1;
  const shoulderY = ly - 162 * cp - (sit ? 4 : 0);
  const waistY = ly - 82 * cp;
  const hemY = ly - (sit ? 30 : 2);
  const hemW = sit ? 94 : 64;

  // ---- 躯干（将门锦袍）----
  const body = [[-58, shoulderY + 8], [-66, waistY + 8], [-hemW, hemY], [hemW, hemY], [66, waistY + 8], [58, shoulderY + 8]];
  Z.lined(c, body, { w: 3.2, tone, seed: 71, hatch: 0.18, gap: 10, hatchAng: -0.9 });
  c.save(); c.fillStyle = 'rgba(104,108,116,.15)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();

  // ---- 腰带 ----
  Z.wire(c, [[-62, waistY], [62, waistY]], { w: 4, tone: tone * 0.95, seed: 76, taper: 0.08 });
  Z.wire(c, [[-62, waistY + 8], [62, waistY + 8]], { w: 2, tone: tone * 0.7, seed: 77, taper: 0.08 });
  // 将门甲胄：护心镜（圆镜一枚，身份签字之一）
  c.save(); c.strokeStyle = `rgba(26,26,28,${0.82 * tone})`; c.lineWidth = 2.6;
  c.beginPath(); c.arc(0, shoulderY + 54, 13, 0, 7); c.stroke(); c.restore();
  c.save(); c.strokeStyle = `rgba(26,26,28,${0.5 * tone})`; c.lineWidth = 1.4;
  c.beginPath(); c.arc(0, shoulderY + 54, 6, 0, 7); c.stroke(); c.restore();

  // ---- 双臂 ----
  const armUp = lerp(0.16, -0.6, raise) + Math.sin(t * 1.5 + 1) * 0.02;
  const handY = shoulderY + 54 + Math.sin(armUp) * 60;
  Z.wire(c, [[-52, shoulderY + 14], [-68, shoulderY + 58], [-54, handY + 6]], { w: 3.2, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[52, shoulderY + 14], [68, shoulderY + 54 - raise * 26], [54, handY - raise * 40]], { w: 3.2, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[-54, handY + 2], [-40, handY + 22], [-30, handY + 6], [-44, handY - 14]], { w: 2.2, tone: tone * 0.8, seed: 82 });
  Z.lined(c, [[54, handY - 2], [40, handY + 18], [30, handY], [44, handY - 16]], { w: 2.2, tone: tone * 0.8, seed: 83 });

  // ---- 头（青面：面皮上一搭青记——以焦墨排线块示意）----
  const hy = shoulderY - 38 + br * 0.5;
  c.save(); c.translate(0, hy); c.scale(1.12, 1.12); c.translate(0, -hy);
  const face = [[-22, hy - 14], [-19, hy - 38], [0, hy - 48], [19, hy - 38], [22, hy - 14], [20, hy + 14], [0, hy + 26], [-20, hy + 12]];
  Z.wire(c, face, { w: 2.6, tone, seed: 84, taper: 0.08 });
  // 青记（左颊焦墨排线块——本系列仅朱砂一味，青记以墨块示意，不施青色）
  c.save();
  c.beginPath(); c.moveTo(-22, hy - 6); c.lineTo(-10, hy - 2); c.lineTo(-12, hy + 14); c.lineTo(-22, hy + 10); c.closePath(); c.clip();
  Z.hatchBox(c, [[-24, hy - 8], [-8, hy - 8], [-8, hy + 16], [-24, hy + 16]], { ang: 0.2, gap: 3.4, tone: 0.5, seed: 800 });
  c.restore();
  if (helmet) {
    Z.lined(c, [[-22, hy - 14], [-18, hy - 44], [18, hy - 44], [22, hy - 14]], { w: 2.6, tone: 0.94, seed: 110, hatch: 0.18, gap: 5 });
    Z.wire(c, [[0, hy - 44], [0, hy - 60], [7, hy - 52]], { w: 2.2, tone: 0.85, seed: 111 });   // 盔缨
  } else {
    Z.wire(c, [[-20, hy - 20], [-14, hy - 44], [14, hy - 44], [20, hy - 20]], { w: 2.4, tone: 0.9, seed: 110 });   // 头巾
    Z.wire(c, [[-20, hy - 20], [20, hy - 20]], { w: 2, tone: 0.7, seed: 111 });
    const rib = Math.sin(t * 2.0) * 0.28;
    Z.wire(c, [[20, hy - 22], [44 + rib * 18, hy - 36 - rib * 12]], { w: 1.8, tone: 0.7, seed: 112 });          // 飘带
  }
  const open = lerp(0.5, 1, angry);
  for (const sx of [-1, 1]) {
    Z.wire(c, [[sx * 5, hy - lerp(19, 22, angry)], [sx * 15, hy - lerp(18, 12, angry)]], { w: 3, tone: tone * 0.95, seed: 87 + sx });
    Z.lined(c, [[sx * 4, hy - 10], [sx * 10, hy - 15], [sx * 16, hy - 10], [sx * 10, hy - 5]], { w: 1.5, tone, seed: 89 + sx, hatch: 0.5, gap: 3 });
  }
  Z.wire(c, [[0, hy - 10], [1, hy]], { w: 2, tone: tone * 0.8, seed: 91 });
  Z.wire(c, [[-8, hy + 6], [8, hy + 6]], { w: 2.4, tone: tone * 0.85, seed: 92 });
  c.restore();

  // ---- 宝刀（祖传：长柄大刀，握向取正不横穿脸）----
  if (blade) {
    const gr = lerp(0.1, 0.95, raise) + Math.sin(t * 1.2) * 0.02;
    c.save(); c.translate(lerp(88, 48, draw), handY - raise * 30); c.rotate(gr);
    Z.wire(c, [[0, 120], [0, -200]], { w: 5, tone: tone * 0.95, seed: 160, taper: 0.03 });          // 柄
    Z.wire(c, [[0, 120], [0, 100]], { w: 7, tone: tone * 0.9, seed: 161, taper: 0.1 });             // 鐏
    Z.wire(c, [[0, -200], [62, -232], [70, -210], [40, -200]], { w: 3.4, tone, seed: 162 });         // 刀身（单刃弧）
    Z.wire(c, [[40, -200], [70, -210]], { w: 2.4, tone, seed: 163 });
    Z.wire(c, [[0, -200], [0, -216]], { w: 4, tone: tone * 0.9, seed: 164 });                        // 刀首
    Z.wire(c, [[0, -200], [54, -252], [88, -240], [72, -206], [40, -200]], { w: 3.8, tone, seed: 165 }); // 刀身（大刀弧刃，放大辨识）
    Z.wire(c, [[40, -200], [72, -206]], { w: 2.8, tone, seed: 166 });
    c.restore();
  }
  // ---- 枪（校场比武用）----
  if (spear) {
    const gr = lerp(0.12, 0.9, raise) + Math.sin(t * 1.2) * 0.02;
    c.save(); c.translate(lerp(86, 48, draw), handY - raise * 30); c.rotate(gr);
    Z.wire(c, [[0, 120], [0, -210]], { w: 4.6, tone: tone * 0.95, seed: 170, taper: 0.03 });
    Z.wire(c, [[0, -210], [0, -250]], { w: 5.4, tone, seed: 171, taper: 0.08 });
    Z.wire(c, [[0, -210], [-16, -210], [-22, -228]], { w: 2.6, tone, seed: 172 });
    Z.wire(c, [[0, -210], [16, -210], [22, -228]], { w: 2.6, tone, seed: 173 });
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
// ① 殿司制使：杨家将之后，武举出身，官至殿司制使
SCENES['yz1_yangjia'] = (() => {
  const p = () => Z.paper('yz1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 440, y: 180, s: 1.0, seed: 4, tone: 0.32 });
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.roof(c, 1500, 760, 420, 120, { tone: 0.9, seed: 2 });
      Z.roof(c, 1500, 600, 320, 90, { tone: 0.85, seed: 3 });
      Z.wire(c, [[1320, 880], [1320, 640], [1680, 640], [1680, 880]], { w: 3.2, tone: 0.85, seed: 4 });
      Z.flag(c, 360, 620, 150, t, { text: '杨家将', seed: 18, size: 26 });
      Z.yangzhi(c, 920, 892, 1.5, t, { robe: 1, helmet: 1, blade: 1, raise: clamp(Math.sin(t * 1.3) * 0.3 + 0.2) });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 60 + i * 230) % 2000) - 40, by = 360 + ((t * 44 + i * 150) % 500);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.6, tone: 0.42, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '殿司制使', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 失陷花石纲：押花石纲，黄河翻船，不敢回京
SCENES['yz2_huashigang'] = (() => {
  const p = () => Z.paper('yz2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const sink = clamp(ss(0.8, 2.6, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 2.8)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1500, y: 180, s: 1.1, seed: 6, tone: 0.32 });
      Z.tide(c, 900, t, { rows: 9, tone: 0.5, seed: 2 });
      Z.tide(c, 820, t * 0.8 + 1.2, { rows: 6, tone: 0.3, seed: 3 });
      Z.boat(c, 1000, 880 - sink * 60, 1.1, t, { tone: 0.8, seed: 1 });
      Z.yangzhi(c, 1000, 760 - sink * 60, 1.2, t, { robe: 1, helmet: 1, blade: 0, angry: sink * 0.6 });
      for (let i = 0; i < 7; i++) {                                                            // 浪沫（活气）
        const bx = ((t * 130 + i * 300) % 2000) - 40, by = 880 - sink * 20 - ((t * 60 + i * 90) % 120);
        Z.wire(c, [[bx, by], [bx + 22, by - 12], [bx + 50, by - 2]], { w: 2.2, tone: 0.6, seed: 2000 + i, taper: 0.5 });
      }
    });
    Z.bigText(c, '失陷花石纲', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ③ 杨志卖刀：东京天汉州桥，落魄卖祖传宝刀，遇泼皮牛二
SCENES['yz3_maidao'] = (() => {
  const p = () => Z.paper('yz3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 420, y: 190, s: 1.0, seed: 5, tone: 0.3 });
      Z.ground(c, 900, { seed: 12, tone: 0.4 });
      Z.bridge(c, 1450, 880, 1.0, { tone: 0.82, seed: 2 });
      Z.fighter(c, 1500, 884, 1.0, t, { seed: 7, tone: 0.7, flip: 1 });                          // 牛二（泼皮）
      Z.yangzhi(c, 820, 892, 1.46, t, { robe: 1, helmet: 0, blade: 1, draw: clamp(ss(0.6, 1.6, lt)) });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 56 + i * 240) % 2000) - 40, by = 360 + ((t * 42 + i * 160) % 520);
        Z.wire(c, [[bx, by], [bx + 10, by + 5]], { w: 1.5, tone: 0.4, seed: 2100 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '天汉州桥卖刀', { x: 1760, y: 120, size: 44, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 怒杀牛二：牛二纠缠不休，杨志怒而杀之（刀光一抹朱砂）
SCENES['yz4_shaniu'] = (() => {
  const p = () => Z.paper('yz4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const kill = clamp(ss(1.0, 2.4, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 13, tone: 0.4 });
      Z.bridge(c, 1450, 880, 1.0, { tone: 0.82, seed: 2 });
      Z.fighter(c, lerp(1180, 1080, kill), 884, 1.0, t, { seed: 7, tone: 0.7, flip: 1 });
      Z.yangzhi(c, 820, 892, 1.5, t, { robe: 1, helmet: 0, blade: 1, raise: kill, angry: 1 });
      if (kill > 0.2) {                                                                      // 刀光 + 朱砂血光（画外提示，全程可见）
        const k = clamp((kill - 0.2) / 0.8);
        c.save(); c.globalAlpha = 0.55 + 0.35 * k;
        Z.wire(c, [[896, 706], [1124, 632], [1208, 724]], { w: 5.6, tone: 0.52, seed: 2200, taper: 0.86, amp: 0.5 });
        Z.wire(c, [[972, 692], [1168, 648]], { w: 3.4, tone: 0.4, seed: 2201, taper: 0.6 });
        c.restore();
        // 朱砂血光：刀势留下的红色笔触 + 迸溅墨簇（本片唯二朱砂彩之一，画外提示）
        c.save(); c.globalAlpha = 0.66 + 0.32 * k; c.lineCap = 'round';
        c.strokeStyle = 'rgba(183,51,46,.72)'; c.lineWidth = 5;
        c.beginPath(); c.moveTo(1072, 708); c.quadraticCurveTo(1110, 660, 1158, 636); c.stroke();
        c.strokeStyle = 'rgba(183,51,46,.55)'; c.lineWidth = 3;
        c.beginPath(); c.moveTo(1080, 718); c.quadraticCurveTo(1118, 678, 1164, 664); c.stroke();
        c.restore();
        c.save(); c.globalAlpha = 0.7 + 0.3 * k; c.fillStyle = 'rgba(183,51,46,.72)';
        const burst = [[1076, 702, 11], [1088, 694, 9], [1098, 712, 10], [1066, 714, 7], [1090, 726, 6],
                       [1106, 700, 8], [1072, 686, 6], [1116, 716, 7], [1100, 730, 5], [1060, 704, 6],
                       [1124, 706, 6], [1110, 690, 5], [1082, 732, 4], [1130, 724, 5]];
        for (const [dx, dy, r] of burst) c.fillRect(dx - r / 2, dy - r / 2, r, r);
        c.fillStyle = 'rgba(183,51,46,.62)';
        c.fillRect(1086, 704, 14, 14); c.fillRect(1120, 718, 10, 10);
        c.restore();
      }
    });
    Z.bigText(c, '怒杀牛二', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 130, 890, '青面兽', clamp(ss(1.8, 2.8, lt)), { size: 28 });
  } };
})();

// ⑤ 大名府比武：梁中书抬举，校场比武显本事
SCENES['yz5_daming'] = (() => {
  const p = () => Z.paper('yz5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const spar = clamp(ss(0.8, 2.4, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.1, seed: 8, tone: 0.32 });
      Z.ground(c, 900, { seed: 14, tone: 0.4 });
      Z.roof(c, 1550, 700, 360, 100, { tone: 0.9, seed: 2 });
      Z.flag(c, 320, 640, 150, t, { text: '帅府', seed: 18, size: 26 });
      Z.fighter(c, 1380, 888, 1.1, t, { seed: 3, tone: 0.74, helmet: 1, spear: 1, flip: 1 });    // 周谨/索超
      Z.yangzhi(c, 820, 892, 1.48, t, { robe: 1, helmet: 1, spear: 1, raise: spar * 0.7 });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 60 + i * 220) % 2000) - 40, by = 360 + ((t * 44 + i * 150) % 500);
        Z.wire(c, [[bx, by], [bx + 11, by + 5]], { w: 1.5, tone: 0.4, seed: 2300 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '大名府比武', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 押送生辰纲·黄泥冈被劫：晁盖吴用智取（蒙汗药酒）——箱笼 + 酒桶
SCENES['yz6_shengchen'] = (() => {
  const p = () => Z.paper('yz6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const doze = clamp(ss(1.2, 2.6, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1500, y: 190, s: 1.0, seed: 9, tone: 0.32 });
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 200, tone: 0.42, seed: 101 }, { y0: 650, amp: 120, tone: 0.3, seed: 102 }]);
      Z.ground(c, 900, { seed: 15, tone: 0.4 });
      Z.crate(c, 600, 866, 1.0, { tone: 0.78, seed: 2 });
      Z.crate(c, 690, 858, 0.9, { tone: 0.74, seed: 3 });
      Z.crate(c, 770, 866, 1.0, { tone: 0.78, seed: 4 });
      // 酒桶（蒙汗药酒：朱砂一点，画外提示）
      c.save(); c.translate(1180, 866); c.scale(1.0, 1.0);
      Z.lined(c, [[-34, 0], [-28, -70], [28, -70], [34, 0]], { w: 3, tone: 0.82, seed: 5, hatch: 0.2, gap: 7 });
      Z.wire(c, [[-34, 0], [34, 0]], { w: 3.2, tone: 0.82, seed: 6 });
      Z.wire(c, [[-22, -70], [22, -70], [22, -80], [-22, -80], [-22, -70]], { w: 2.4, tone: 0.8, seed: 7 });
      c.restore();
      c.save(); c.globalAlpha = 0.6; c.fillStyle = 'rgba(183,51,46,.4)';
      c.beginPath(); c.arc(1180, 720, 4, 0, 7); c.fill(); c.restore();
      Z.fighter(c, 1400, 888, 1.0, t, { seed: 8, tone: 0.72, flip: 1 });                          // 晁盖等（群像其一）
      Z.fighter(c, 1520, 884, 0.92, t, { seed: 9, tone: 0.68, flip: 1 });                           // 吴用等
      Z.yangzhi(c, 920, 892, 1.46, t, { robe: 1, helmet: 1, blade: 1, raise: 0.2, tone: lerp(0.9, 0.5, doze) });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 50 + i * 250) % 2000) - 40, by = 360 + ((t * 40 + i * 170) % 520);
        Z.wire(c, [[bx, by], [bx + 10, by + 5]], { w: 1.4, tone: 0.36, seed: 2400 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '黄泥冈被劫', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 二龙山落草：与鲁智深、武松据二龙山（呼应鲁智深片第六幕）
SCENES['yz7_ershan'] = (() => {
  const p = () => Z.paper('yz7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.1, seed: 10, tone: 0.34 });
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 220, tone: 0.48, seed: 121 }, { y0: 650, amp: 130, tone: 0.32, seed: 122 }]);
      Z.ground(c, 900, { seed: 16, tone: 0.36 });
      Z.shanzhai(c, 1520, 856, 0.96, { tone: 0.8, seed: 8, text: '二龙山' });
      Z.flag(c, 300, 650, 130, t, { text: '替天行道', seed: 18, size: 26 });
      Z.luzhishen(c, 600, 890, 1.1, t, { monk: 1, staff: 1, dao: 1, raise: 0.3, tone: 0.74 });      // 鲁智深（复用）
      Z.yangzhi(c, 980, 892, 1.5, t, { robe: 1, helmet: 0, blade: 1, raise: 0.25 });
    });
    Z.bigText(c, '二龙山落草', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 征方腊·丹徒病故：杨志于丹徒病故（梁山病死头领之一，闭环之一种）
SCENES['yz8_dantu'] = (() => {
  const p = () => Z.paper('yz8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const fade = clamp(ss(1.8, 3.4, lt));
    const cam = { x: 960, y: 560, z: lerp(1.08, 1.0, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 600, y: 180, s: 1.1, seed: 12, tone: 0.32 });
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 170, tone: 0.34, seed: 141 }]);
      Z.ground(c, 900, { seed: 17, tone: 0.34 });
      Z.tent(c, 1480, 856, 0.92, { tone: 0.8, seed: 6, text: '丹徒' });
      Z.flag(c, 320, 640, 140, t, { text: '梁山泊', seed: 20, size: 26 });
      Z.flame(c, 1180, 866, 0.7, t, { seed: 3, tone: 0.6 });                                         // 营帐灯火（活气）
      Z.wire(c, [[1180, 866], [1180, 770]], { w: 3, tone: 0.8, seed: 2500 });
      c.save(); c.globalAlpha = 1 - fade * 0.6;
      Z.yangzhi(c, 900, 884, 1.4, t, { robe: 1, helmet: 0, blade: 0, sit: 1, tone: 0.9 });          // 病榻趺坐/倚卧
      c.restore();
    });
    Z.bigText(c, '丹徒病故', { x: 1760, y: 110, size: 46, tone: 0.92, appear: clamp(ss(2.0, 3.0, lt)) });
    Z.seal(c, 140, 884, '天暗星', clamp(ss(2.8, 3.7, lt)), { size: 26 });
  } };
})();
})();
