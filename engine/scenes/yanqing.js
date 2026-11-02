// 《水浒传·燕青》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：北京大名府卢俊义家生小厮——绰号「浪子」，一身遍体花绣，相扑天下无对，
//   川弩三箭救主，说得诸路乡谈，吹得一口好箫；招安后功成身退，挑一担金珠不知所终。
//   特征：① 遍体花绣（锦体）② 川弩（signature 兵器）③ 箫（浪子 signature）④ 扁担（归隐 signature）。
// 唯一的彩：朱砂只用于① 第六幕求得赦书上的御印 ② 第八幕归隐的「浪子」钤印——全片两处，余皆黑白灰。
// 母题：① 花绣 ② 川弩 ③ 箫 ④ 扁担。
// 弧光：卢府小乙 → 主人落难乞食养主 → 泰安州智扑擎天柱 → 川弩救主 → 走李师师门路 →
//       求得赦书成招安 → 劝主归隐不从 → 挑担飘然而去，不知所终。
// 依《水浒传》第六十一、六十二、七十四、八十一、八十二回及百回本末回。
// 互文：第一、二、七幕复用卢俊义（主仆线）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 川弩（signature 兵器：轻弩——弩身 + 双弩臂 + 弓弦 + 箭槽 + 扳机；shot=1 时箭在弦上）
Z.nu = (c, x, y, s, { tone = 0.88, seed = 1, shot = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.22);
  Z.wire(c, [[-54, 0], [56, 0]], { w: 4.2, tone, seed, taper: 0.06 });                    // 弩身（横）
  Z.wire(c, [[-42, 4], [-60, -24], [-36, -34]], { w: 2.8, tone, seed: seed + 1 });        // 左弩臂
  Z.wire(c, [[42, 4], [60, -24], [36, -34]], { w: 2.8, tone, seed: seed + 2 });           // 右弩臂
  Z.wire(c, [[-58, -22], [58, -22]], { w: 2, tone: tone * 0.78, seed: seed + 3 });        // 弓弦
  Z.wire(c, [[-34, -8], [34, -8]], { w: 2.2, tone: tone * 0.7, seed: seed + 4 });         // 箭槽
  Z.wire(c, [[10, 2], [10, 20]], { w: 2.4, tone, seed: seed + 5 });                       // 扳机
  if (shot > 0.1) {                                                                        // 箭在弦
    Z.wire(c, [[-24, -8], [44, -8]], { w: 2.2, tone: tone * 0.95, seed: seed + 6, taper: 0.1 });
    Z.wire(c, [[44, -8], [56, -12], [46, -2]], { w: 2.4, tone, seed: seed + 7 });
  }
  c.restore();
};

// 箫（浪子 signature：玉屏箫——竖管 + 指孔 + 穗）
Z.xiao = (c, x, y, s, { tone = 0.86, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(0.12);
  Z.wire(c, [[0, -58], [0, 58]], { w: 5.6, tone, seed, taper: 0.05 });     // 管身
  for (let i = 0; i < 6; i++) {
    Z.wire(c, [[-6, -32 + i * 17], [6, -32 + i * 17]], { w: 2.2, tone: tone * 0.85, seed: seed + 10 + i });
  }
  Z.wire(c, [[-6, -58], [6, -58]], { w: 2.6, tone, seed: seed + 30 });     // 吹口
  Z.wire(c, [[0, 58], [9, 82], [-3, 96]], { w: 1.8, tone: tone * 0.6, seed: seed + 20 });   // 穗
  c.restore();
};

// 花绣（signature：遍体花绣——臂上三簇卷草，焦墨细笔，不施色）
Z.tattoo = (c, x, y, s, { tone = 0.86, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < 3; i++) {
    const px = -16 + i * 16;
    Z.wire(c, [[px, 0], [px + 6, -13], [px + 18, -10], [px + 13, 4]], { w: 2.3, tone, seed: seed + i });
    Z.wire(c, [[px + 4, 7], [px + 13, 18]], { w: 1.9, tone: tone * 0.84, seed: seed + 10 + i });
    Z.wire(c, [[px + 1, -13], [px - 3, -22]], { w: 1.6, tone: tone * 0.7, seed: seed + 20 + i });
  }
  c.restore();
};

// 扁担（归隐 signature：一担金珠，两只箩筐）
Z.dan = (c, x, y, s, { tone = 0.85, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-158, -10], [158, -10]], { w: 3.4, tone, seed, taper: 0.07 });               // 扁担
  Z.wire(c, [[-146, -10], [-126, 38]], { w: 1.6, tone: tone * 0.8, seed: seed + 1 });
  Z.wire(c, [[146, -10], [126, 38]], { w: 1.6, tone: tone * 0.8, seed: seed + 2 });
  Z.lined(c, [[-166, 38], [-110, 38], [-102, 92], [-174, 92]], { w: 3, tone, seed: seed + 3, hatch: 0.1 });
  Z.lined(c, [[110, 38], [166, 38], [174, 92], [102, 92]], { w: 3, tone, seed: seed + 4, hatch: 0.1 });
  c.restore();
};

// 古琴（李师师案上：横卧长板 + 七弦 + 徽点）
Z.qin = (c, x, y, s, { tone = 0.84, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.lined(c, [[-150, -14], [150, -10], [150, 16], [-150, 12]], { w: 2.8, tone, seed, hatch: 0.12 });
  for (let i = 0; i < 7; i++) {
    const yy = -8 + i * 3.4;
    Z.wire(c, [[-146, yy], [146, yy - 1]], { w: 1.1, tone: tone * 0.6, seed: seed + 20 + i });
  }
  c.restore();
};

// 美人（李师师：高髻 + 长裙 + 抚琴；o: { flip, qin, tone }）
Z.madan = (c, x, y, s, t, o = {}) => {
  const { flip = 0, qin = 0, tone = 0.86 } = o;
  const br = Math.sin(t * 1.4) * 2;
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const shoulderY = -150, waistY = -74, hemY = -2;
  // 长裙
  const skirt = [[-44, waistY], [-70, hemY - 6], [70, hemY - 6], [44, waistY]];
  Z.lined(c, skirt, { w: 3, tone, seed: 71, hatch: 0.14, gap: 10, hatchAng: -1.0 });
  // 上身（窄袖长襦）
  const body = [[-40, shoulderY + 6], [-44, waistY + 2], [44, waistY + 2], [40, shoulderY + 6]];
  Z.lined(c, body, { w: 2.8, tone, seed: 72, hatch: 0.08, gap: 11 });
  // 双臂（前伸抚琴）
  const ay = shoulderY + 34 + Math.sin(t * 1.7) * 5;
  Z.wire(c, [[-40, shoulderY + 12], [-64, ay], [-34, ay + 26]], { w: 2.8, tone, seed: 73, taper: 0.1 });
  Z.wire(c, [[40, shoulderY + 12], [64, ay], [34, ay + 26]], { w: 2.8, tone, seed: 74, taper: 0.1 });
  // 头 + 高髻
  const hy = shoulderY - 34 + br * 0.4;
  const face = [[-17, hy - 10], [-14, hy - 30], [0, hy - 40], [14, hy - 30], [17, hy - 10], [15, hy + 10], [0, hy + 21], [-15, hy + 9]];
  Z.lined(c, face, { w: 2.4, tone: tone * 0.95, seed: 100, hatch: 0.05, gap: 9 });
  Z.wire(c, [[-9, hy - 11], [-3, hy - 11]], { w: 1.6, tone, seed: 101 });
  Z.wire(c, [[3, hy - 11], [9, hy - 11]], { w: 1.6, tone, seed: 102 });
  Z.wire(c, [[-4, hy + 2], [4, hy + 2]], { w: 1.4, tone: tone * 0.7, seed: 103 });
  // 高髻（signature）
  Z.wire(c, [[-20, hy - 18], [-16, hy - 46], [16, hy - 46], [20, hy - 18]], { w: 2.6, tone: 0.9, seed: 110 });
  Z.wire(c, [[-14, hy - 46], [-8, hy - 74], [8, hy - 74], [14, hy - 46]], { w: 2.8, tone: 0.9, seed: 111 });
  Z.wire(c, [[-8, hy - 74], [0, hy - 88], [8, hy - 74]], { w: 2.4, tone: 0.88, seed: 112 });
  Z.wire(c, [[18, hy - 40], [40, hy - 24], [34, hy - 6]], { w: 1.6, tone: 0.7, seed: 113 });       // 簪/步摇
  if (qin) Z.qin(c, 0, waistY + 40, 1.0, { tone, seed: 130 });
  c.restore();
};

// ============================== 燕青本体 ==============================
// o: { turban头巾, nu川弩, xiao箫, tattoo花绣, flip, raise, kneel, bow, wrestle相扑, carry挑担, tone }
Z.yanqing = (c, x, y, s, t, o = {}) => {
  const {
    turban = 1, nu = 0, xiao = 0, tattoo = 1, flip = 0, raise = 0,
    kneel = 0, bow = 0, wrestle = 0, carry = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.6) * 2.2;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 44 : 0);
  const cp = bow ? 0.84 : 1;
  const shoulderY = ly - 148 * cp;
  const waistY = ly - 74 * cp;
  const hipY = ly - 26;
  const hemW = 46;

  // ---- 腿（短打裤 + 快靴）----
  if (kneel) {
    Z.wire(c, [[-30, hipY], [-6, hipY + 34], [-46, ly]], { w: 3.2, tone, seed: 60, taper: 0.1 });
    Z.wire(c, [[30, hipY], [6, hipY + 34], [46, ly]], { w: 3.2, tone, seed: 61, taper: 0.1 });
  } else if (wrestle) {
    Z.wire(c, [[-26, hipY], [-48, hipY + 40], [-40, ly]], { w: 3.4, tone, seed: 62, taper: 0.1 });
    Z.wire(c, [[26, hipY], [54, hipY + 34], [40, ly]], { w: 3.4, tone, seed: 63, taper: 0.1 });
  } else {
    Z.wire(c, [[-26, hipY], [-34, hipY + 44], [-30, ly]], { w: 3.2, tone, seed: 64, taper: 0.1 });
    Z.wire(c, [[26, hipY], [34, hipY + 44], [30, ly]], { w: 3.2, tone, seed: 65, taper: 0.1 });
  }
  Z.lined(c, [[-30, ly], [-47, ly - 4], [-49, ly + 13], [-28, ly + 10]], { w: 2.4, tone: tone * 0.85, seed: 66 });
  Z.lined(c, [[30, ly], [47, ly - 4], [49, ly + 13], [28, ly + 10]], { w: 2.4, tone: tone * 0.85, seed: 67 });

  // ---- 躯干（箭袖短打：窄肩细腰，少年身形）----
  const body = [[-46, shoulderY + 6], [-50, waistY + 4], [-hemW, hipY], [hemW, hipY], [50, waistY + 4], [46, shoulderY + 6]];
  Z.lined(c, body, { w: 3, tone, seed: 71, hatch: 0.12, gap: 11, hatchAng: -0.9 });
  Z.wire(c, [[-24, shoulderY + 4], [0, shoulderY + 30], [24, shoulderY + 4]], { w: 2.6, tone: tone * 0.9, seed: 72 });   // 交领
  Z.wire(c, [[-50, waistY + 2], [50, waistY + 2], [50, waistY + 16], [-50, waistY + 16], [-50, waistY + 2]], { w: 3, tone, seed: 73, taper: 0.06 }); // 束带

  // ---- 花绣（遍体花绣，signature）----
  if (tattoo) {
    Z.tattoo(c, -22, shoulderY + 40, 1.32, { tone: tone * 0.92, seed: 90 });
    Z.tattoo(c, 12, shoulderY + 64, 1.18, { tone: tone * 0.88, seed: 95 });
    Z.tattoo(c, -8, shoulderY + 88, 1.06, { tone: tone * 0.82, seed: 96 });
  }

  // ---- 双臂 ----
  const handY = shoulderY + 48 + Math.sin(lerp(0.14, -0.66, raise) + Math.sin(t * 1.7 + 1) * 0.02) * 56;
  if (wrestle) {
    Z.wire(c, [[-46, shoulderY + 12], [-76, shoulderY + 32], [-32, shoulderY + 44]], { w: 3.4, tone, seed: 80, taper: 0.1 });
    Z.wire(c, [[46, shoulderY + 12], [76, shoulderY + 28], [34, shoulderY + 40]], { w: 3.4, tone, seed: 81, taper: 0.1 });
    Z.lined(c, [[-32, shoulderY + 44], [-16, shoulderY + 52], [-8, shoulderY + 40]], { w: 2.2, tone: tone * 0.85, seed: 86 });
    Z.lined(c, [[34, shoulderY + 40], [16, shoulderY + 50], [8, shoulderY + 38]], { w: 2.2, tone: tone * 0.85, seed: 87 });
  } else if (carry) {
    Z.wire(c, [[-46, shoulderY + 12], [-62, shoulderY + 24], [-42, shoulderY - 10]], { w: 3.2, tone, seed: 84, taper: 0.1 });
    Z.wire(c, [[46, shoulderY + 12], [62, shoulderY + 24], [42, shoulderY - 10]], { w: 3.2, tone, seed: 85, taper: 0.1 });
  } else {
    Z.wire(c, [[-46, shoulderY + 12], [-62, shoulderY + 50], [-56, handY + 4]], { w: 3, tone, seed: 80, taper: 0.1 });
    Z.wire(c, [[46, shoulderY + 12], [62, shoulderY + 46 - raise * 22], [56, handY - raise * 34]], { w: 3, tone, seed: 81, taper: 0.1 });
    Z.lined(c, [[-56, handY + 2], [-46, handY + 18], [-38, handY + 4], [-48, handY - 10]], { w: 2.1, tone: tone * 0.8, seed: 82 });
    Z.lined(c, [[56, handY - 2], [46, handY + 14], [38, handY], [48, handY - 12]], { w: 2.1, tone: tone * 0.8, seed: 83 });
  }

  // ---- 头（少年：略小）----
  const hy = shoulderY - 34 + br * 0.5;
  const face = [[-20, hy - 12], [-17, hy - 34], [0, hy - 44], [17, hy - 34], [20, hy - 12], [18, hy + 12], [0, hy + 24], [-18, hy + 10]];
  Z.lined(c, face, { w: 2.6, tone: tone * 0.95, seed: 100, hatch: 0.06, gap: 9 });
  Z.wire(c, [[-12, hy - 12], [-4, hy - 12]], { w: 1.8, tone, seed: 101 });
  Z.wire(c, [[4, hy - 12], [12, hy - 12]], { w: 1.8, tone, seed: 102 });
  Z.wire(c, [[-6, hy + 2], [6, hy + 2]], { w: 1.5, tone: tone * 0.7, seed: 103 });
  // 头巾（软脚幞头，signature）
  if (turban) {
    Z.wire(c, [[-22, hy - 18], [-18, hy - 40], [18, hy - 40], [22, hy - 18]], { w: 2.6, tone: 0.88, seed: 110 });
    Z.wire(c, [[-22, hy - 18], [22, hy - 18]], { w: 2.2, tone: 0.72, seed: 111 });
    const rib = Math.sin(t * 2.2) * 0.32;
    Z.wire(c, [[-22, hy - 26], [-50 - rib * 16, hy - 16 + rib * 10]], { w: 1.8, tone: 0.7, seed: 112 });
    Z.wire(c, [[22, hy - 26], [50 + rib * 16, hy - 18 - rib * 10]], { w: 1.8, tone: 0.7, seed: 113 });
  }
  // ---- 手持件（本地坐标：手在 (±56, handY) 附近；必须在 restore 前画）----
  if (nu) Z.nu(c, 62, handY - raise * 26, 1.0, { tone, shot: 1, seed: 170 });
  if (xiao) Z.xiao(c, 76, handY + 8, 1.0, { tone, seed: 175 });
  if (carry) Z.dan(c, 0, shoulderY - 14, 1.0, { tone, seed: 180 });
  c.restore();
};

// ============================== 八幕 ==============================

// ① 卢府小乙：卢俊义家生小厮，一身花绣，吹得好箫（复用卢俊义）
SCENES['yq1_xiaoyi'] = (() => {
  const p = () => Z.paper('yq1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 430, y: 180, s: 1.0, seed: 4, tone: 0.32 });
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.roof(c, 1520, 740, 420, 120, { tone: 0.9, seed: 2 });
      Z.roof(c, 1520, 588, 300, 86, { tone: 0.84, seed: 3 });
      Z.wire(c, [[1360, 880], [1360, 630], [1690, 630], [1690, 880]], { w: 3.2, tone: 0.85, seed: 4 });
      Z.pine(c, t, { x: 330, y: 880, s: 1.05, seed: 7, tone: 0.85 });
      Z.flag(c, 620, 604, 150, t, { text: '卢府', seed: 18, size: 26 });
      Z.lujunyi(c, 800, 892, 1.5, t, { robe: 1, helmet: 0, spear: 0, qilin: 1, jade: 1, raise: clamp(Math.sin(t * 1.3) * 0.3 + 0.2) });
      Z.yanqing(c, 1180, 892, 1.52, t, { xiao: 1, tattoo: 1, turban: 1 });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 58 + i * 230) % 2000) - 40, by = 360 + ((t * 42 + i * 150) % 500);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.6, tone: 0.42, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '卢府小乙', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 乞食养主：主人刺配，燕青沿途讨饭养主（复用卢俊义·枷）
SCENES['yq2_qitao'] = (() => {
  const p = () => Z.paper('yq2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 2.8)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 190, tone: 0.34, seed: 121 }, { y0: 660, amp: 110, tone: 0.24, seed: 122 }]);
      Z.cloud(c, t, { x: 1500, y: 200, s: 1.1, seed: 24, tone: 0.3 });
      Z.ground(c, 900, { seed: 21, tone: 0.42 });
      Z.pine(c, t, { x: 260, y: 890, s: 0.9, seed: 27, tone: 0.8 });
      // 押解队伍（右远处）
      Z.fighter(c, 1660, 892, 1.0, t, { flip: 1, spear: 1, seed: 40 });
      Z.lujunyi(c, 1450, 892, 1.24, t, { robe: 1, qilin: 1, jade: 0, bind: 1, hurt: 0.3, tone: 0.8 });
      Z.fighter(c, 1250, 892, 0.96, t, { flip: 1, blade: 1, seed: 41 });
      // 燕青（左，端碗乞食）
      Z.yanqing(c, 700, 892, 1.5, t, { tattoo: 1, raise: clamp(Math.sin(t * 1.4) * 0.2 + 0.3) });
      Z.lined(c, [[640, 792], [676, 792], [672, 812], [644, 812]], { w: 2.4, tone: 0.8, seed: 55 });   // 乞食碗
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 30 + i * 197) % 1900) + 10;
        Z.wire(c, [[dx, 250 + (i % 4) * 90], [dx + 10, 250 + (i % 4) * 90 + 5]], { w: 1.5, tone: 0.38, seed: 1910 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '乞食养主', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ③ 智扑擎天柱：泰安州擂台，燕青相扑摔任原
SCENES['yq3_xiangpu'] = (() => {
  const p = () => Z.paper('yq3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1520, y: 170, s: 1.0, seed: 34, tone: 0.3 });
      Z.ground(c, 900, { seed: 31, tone: 0.4 });
      // 擂台
      Z.lined(c, [[540, 760], [1420, 760], [1460, 812], [500, 812]], { w: 3.4, tone: 0.86, seed: 60, hatch: 0.1 });
      for (const px of [560, 1400]) Z.wire(c, [[px, 812], [px, 940]], { w: 4, tone: 0.84, seed: 61, taper: 0.08 });
      Z.wire(c, [[500, 812], [1460, 812]], { w: 3, tone: 0.8, seed: 62 });
      Z.flag(c, 480, 470, 190, t, { text: '泰安州', seed: 63, size: 30 });
      // 观众
      for (let i = 0; i < 4; i++) {
        Z.fighter(c, 200 + i * 118, 900, 0.62, t, { seed: 70 + i, tone: 0.55 });
      }
      for (let i = 0; i < 3; i++) {
        Z.fighter(c, 1520 + i * 122, 900, 0.62, t, { flip: 1, seed: 76 + i, tone: 0.55 });
      }
      // 任原（擎天柱，巨汉）与燕青（相扑）
      const swing = Math.sin(t * 2.4) * 6;
      Z.fighter(c, 1120 + swing, 770, 1.62, t, { flip: 1, tone: 0.86, seed: 80 });
      Z.yanqing(c, 860 - swing, 772, 1.42, t, { wrestle: 1, tattoo: 1, tone: 0.94 });
      // 交手动势线
      if (lt > 0.8) {
        for (let i = 0; i < 5; i++) {
          const a = -0.5 + i * 0.36 + Math.sin(t * 3) * 0.06;
          Z.wire(c, [[990, 690], [990 + Math.cos(a) * 46, 690 + Math.sin(a) * 46]], { w: 1.8, tone: 0.5, seed: 1900 + i, taper: 0.7 });
        }
      }
    });
    Z.bigText(c, '智扑擎天柱', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 一弩救主：川弩三箭，射翻董超薛霸（复用卢俊义·枷）
SCENES['yq4_nujian'] = (() => {
  const p = () => Z.paper('yq4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 560, amp: 150, tone: 0.3, seed: 141 }]);
      Z.ground(c, 900, { seed: 41, tone: 0.42 });
      Z.pine(c, t, { x: 1720, y: 890, s: 0.95, seed: 47, tone: 0.8 });
      Z.lujunyi(c, 1420, 892, 1.3, t, { robe: 1, qilin: 1, jade: 0, bind: 1, tone: 0.82 });
      // 两公人（中箭倒）
      const fall = clamp(ss(0.8, 1.8, lt));
      Z.fighter(c, 1180, 892, 1.0, t, { flip: 1, blade: 1, tone: 0.72, seed: 90 });
      Z.fighter(c, 1000, 892, 0.98, t, { flip: 1, blade: 1, tone: 0.72, seed: 91 });
      // 燕青（左，张弩）
      const draw = clamp(ss(0.3, 1.2, lt));
      Z.yanqing(c, 640, 892, 1.5, t, { nu: 1, raise: draw, tattoo: 1, tone: 0.92 });
      // 飞箭（三箭连发）
      for (let i = 0; i < 3; i++) {
        const st = 1.1 + i * 0.5, k = clamp(ss(st, st + 0.42, lt));
        if (k <= 0 || k >= 1) continue;
        const ax = lerp(740, 1160, k), ay = 700 - Math.sin(k * 3.1) * 40;
        Z.wire(c, [[ax - 34, ay], [ax + 26, ay + 2]], { w: 2.4, tone: 0.92, seed: 1950 + i, taper: 0.12 });
        Z.wire(c, [[ax + 26, ay + 2], [ax + 14, ay - 8], [ax + 12, ay + 12]], { w: 2.4, tone: 0.92, seed: 1960 + i });
      }
      if (fall > 0.3) {
        for (let i = 0; i < 6; i++) {
          Z.wire(c, [[1120 + i * 14, 760], [1114 + i * 14, 736]], { w: 1.6, tone: 0.5, seed: 1970 + i, taper: 0.6 });
        }
      }
    });
    Z.bigText(c, '一弩救主', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 东京樊楼：燕青走李师师门路，打通招安关节
SCENES['yq5_shishi'] = (() => {
  const p = () => Z.paper('yq5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 51, tone: 0.4 });
      // 樊楼（两层楼阁）
      Z.wire(c, [[1180, 900], [1180, 560], [1720, 560], [1720, 900]], { w: 3.4, tone: 0.86, seed: 52 });
      Z.roof(c, 1450, 560, 600, 140, { tone: 0.9, seed: 53 });
      Z.wire(c, [[1210, 700], [1690, 700]], { w: 3, tone: 0.8, seed: 54 });
      Z.roof(c, 1450, 452, 420, 100, { tone: 0.84, seed: 55 });
      Z.hatchBox(c, [[1180, 900], [1720, 900], [1720, 560], [1180, 560]], { ang: -1.4, gap: 22, tone: 0.1, seed: 56 });
      // 帘与灯
      for (let i = 0; i < 4; i++) {
        const lx = 1290 + i * 130, sw = Math.sin(t * 1.6 + i) * 5;
        Z.wire(c, [[lx, 700], [lx + sw, 780], [lx + 34 + sw, 780], [lx + 34, 700]], { w: 1.8, tone: 0.6, seed: 57 + i });
      }
      Z.flame(c, 1560, 640, 0.5, t, { seed: 61, tone: 0.6 });
      // 李师师（抚琴）与燕青（持箫）
      Z.madan(c, 780, 892, 1.42, t, { qin: 1, tone: 0.84 });
      Z.yanqing(c, 1220, 892, 1.46, t, { xiao: 1, tattoo: 1, tone: 0.9 });
      // 琴音/箫声：飘出的短线（活气）
      for (let i = 0; i < 8; i++) {
        const nx = 900 + ((t * 26 + i * 120) % 700), ny = 640 - (i % 3) * 46 + Math.sin(t * 2 + i) * 8;
        Z.wire(c, [[nx, ny], [nx + 18, ny - 8]], { w: 1.5, tone: 0.36, seed: 1980 + i, taper: 0.7 });
      }
    });
    Z.bigText(c, '东京樊楼', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 求得赦书：御前求得赦书，招安遂成（朱砂：御印）
SCENES['yq6_zhaoan'] = (() => {
  const p = () => Z.paper('yq6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 71, tone: 0.4 });
      // 御前屏风
      Z.wire(c, [[1080, 880], [1080, 420], [1660, 420], [1660, 880]], { w: 3.4, tone: 0.88, seed: 72 });
      Z.hatchBox(c, [[1080, 880], [1660, 880], [1660, 420], [1080, 420]], { ang: -1.35, gap: 20, tone: 0.12, seed: 73 });
      Z.roof(c, 1370, 420, 640, 120, { tone: 0.9, seed: 74 });
      Z.bigText(c, '御', { x: 1370, y: 560, size: 76, tone: 0.5, appear: clamp(ss(0.1, 0.9, lt)), shadow: false });
      // 香炉烟（活气）
      Z.lined(c, [[1200, 880], [1260, 880], [1250, 840], [1210, 840]], { w: 2.6, tone: 0.8, seed: 75 });
      for (let i = 0; i < 7; i++) {
        const sy = 830 - ((t * 34 + i * 60) % 300), sx = 1230 + Math.sin((sy + i * 40) * 0.02 + t) * 18;
        Z.wire(c, [[sx, sy], [sx + 8, sy - 12]], { w: 1.4, tone: 0.34, seed: 1990 + i, taper: 0.8 });
      }
      // 燕青跪呈赦书
      Z.yanqing(c, 700, 892, 1.5, t, { kneel: 1, bow: 1, raise: clamp(ss(0.4, 1.2, lt)), tattoo: 1, tone: 0.92 });
      Z.labelBox(c, 620, 690, 200, 120, { tone: 0.86, seed: 76 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.88)'; c.font = '54px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('赦', 720, 750); c.restore();
      // 朱砂御印（本片第一处朱砂）
      const q = clamp(ss(0.7, 1.6, lt));
      if (q > 0.02) Z.seal(c, 800, 720, '御', q, { size: 22, seed: 77 });
    });
    Z.bigText(c, '求得赦书', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 劝主归隐：征方腊还朝，劝卢俊义同去不从（复用卢俊义）
SCENES['yq7_biezhu'] = (() => {
  const p = () => Z.paper('yq7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 530, amp: 200, tone: 0.32, seed: 161 }, { y0: 660, amp: 110, tone: 0.22, seed: 162 }]);
      Z.cloud(c, t, { x: 400, y: 190, s: 1.0, seed: 164, tone: 0.3 });
      Z.ground(c, 900, { seed: 81, tone: 0.42 });
      Z.boat(c, 1560, 800, 1.0, t, { tone: 0.8, seed: 82 });
      Z.pine(c, t, { x: 300, y: 890, s: 1.0, seed: 87, tone: 0.82 });
      // 卢俊义（立，不肯去）
      Z.lujunyi(c, 1180, 892, 1.46, t, { robe: 1, qilin: 1, jade: 1, spear: 0, raise: clamp(Math.sin(t * 1.2) * 0.2 + 0.15) });
      // 燕青（跪别）
      Z.yanqing(c, 760, 892, 1.46, t, { kneel: 1, bow: 1, tattoo: 1, tone: 0.92 });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 320 + ((t * 36 + i * 160) % 460);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.38, seed: 1915 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '劝主归隐', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 不知所终：挑一担金珠飘然而去（朱砂：浪子钤印）
SCENES['yq8_guiyin'] = (() => {
  const p = () => Z.paper('yq8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 220, tone: 0.34, seed: 181 }, { y0: 660, amp: 120, tone: 0.24, seed: 182 }]);
      Z.cloud(c, t, { x: 1500, y: 170, s: 1.2, seed: 184, tone: 0.3 });
      Z.cloud(c, t, { x: 340, y: 230, s: 0.9, seed: 185, tone: 0.26 });
      Z.ground(c, 900, { seed: 91, tone: 0.4 });
      Z.pine(c, t, { x: 380, y: 890, s: 1.05, seed: 97, tone: 0.82 });
      // 燕青挑担，向右远去
      const walk = clamp(ss(0.2, 3.6, lt));
      const px = lerp(760, 1240, walk * 0.6);
      Z.yanqing(c, px, 892, lerp(1.5, 1.28, walk * 0.5), t, { carry: 1, tattoo: 1, turban: 1, tone: 0.94 });
      // 归路留白：飞鸟三两
      for (let i = 0; i < 3; i++) {
        const bx = 1500 + ((t * 22 + i * 180) % 420), by = 300 + i * 60 + Math.sin(t * 1.4 + i) * 12;
        Z.wire(c, [[bx, by], [bx + 14, by - 7], [bx + 28, by], [bx + 14, by + 3]], { w: 1.6, tone: 0.5, seed: 1920 + i });
      }
      if (lt > 1.4) {
        c.save(); c.globalAlpha = 0.8 * clamp(ss(1.4, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('自此不知所终', 1560, 380);
        c.restore();
      }
    });
    Z.bigText(c, '不知所终', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '浪子', clamp(ss(1.0, 2.6, lt)), { size: 28 });
  } };
})();
})();
