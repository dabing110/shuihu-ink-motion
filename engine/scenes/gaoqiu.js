// 《水浒传·高俅》rig + 九幕（宋元版画线描 + 焦墨）
// 【批判视角·基调】本片不是给高俅立传，是给「逼上梁山」写来历：
//   他是全书第一个出场的人，也是全书所有走投无路的总闸门——
//   他每升一级，就多一家人被逼上山；到最后连一个「忠」字也要掐死在他手里。
//   本片不写他的球技本领（不美化其才），只写权力的来源与使用方式。
// 依《水浒传》第二回（王教头私走延安府）、第七回（白虎节堂）、第七十八至八十回（三败高太尉）、
//   第一百二十回（宋江饮毒酒）。
// 版本辨伪：高俅史有其人（《宋史》附传极略，为徽宗朝宠臣，未任殿帅府太尉，亦无陷害林冲事）；
//   「高二改作高俅」「因踢气球发迹」为百回本小说家言——本片按小说叙事，但直陈其为文学塑造。
// 造型：① 长翅乌纱幞头（signature）② 团领斓袍 + 玉带 ③ 执笏 ④ 少年投机者的一双人精眼睛。
// signature 母题为气球（蹴鞠）——他的一生从这一只球起。
// 唯一的彩：朱砂只用于① 气球的缝线（第一二幕他的signature器物）② 第九幕御酒壶口的一线（毒）
//   ③ 末幕「高俅」钤印——余皆黑白灰。
// 互文：第四幕接史进线（王进逃到史家村），第五幕接林冲线，第六幕接呼延灼/关胜/秦明线，
//       第七幕接阮氏兄弟（三败高太尉），第九幕接宋江线。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const ez = (p) => ease.inOut(p);
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 气球（蹴鞠）：signature——他的一生从这一只球起。朱砂缝线是全片唯一的「器物点缀」。
Z.qiu = (c, x, y, r, t, { seed = 1, cin = 1, spin = 1 } = {}) => {
  c.save(); c.translate(x, y);
  Z.lined(c, (() => { const p = []; for (let i = 0; i <= 14; i++) { const a = i / 14 * 7; p.push([Math.cos(a) * r, Math.sin(a) * r]); } return p; })(),
    { w: 2.8, tone: 0.88, seed, hatch: 0.16, gap: 9, hatchAng: 0.4 });
  // 缝线（朱砂）
  if (cin) {
    c.save(); c.rotate(t * 1.6 * spin);
    c.strokeStyle = 'rgba(183,51,46,.72)'; c.lineWidth = 2.2;
    c.beginPath(); c.arc(0, 0, r * 0.52, 0, 7); c.stroke();
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI;
      c.beginPath();
      c.moveTo(Math.cos(a) * r * 0.52, Math.sin(a) * r * 0.52);
      c.lineTo(Math.cos(a + 0.34) * r * 0.94, Math.sin(a + 0.34) * r * 0.94);
      c.stroke();
    }
    c.restore();
  }
  c.restore();
};

// 长翅乌纱幞头（官帽：一顶帽 + 两条平展的硬翅——画面的「权力」记号）
// q: 戴上 / 变大的进度（第一幕还是个浮浪子弟，没资格戴，全靠后面逐幕戴上）
Z.futou = (c, x, y, s, { tone = 0.92, seed = 1, q = 1, t = 0 } = {}) => {
  if (q <= 0.02) return;
  c.save(); c.translate(x, y); c.scale(s * clamp(q, 0, 1), s * clamp(q, 0, 1));
  Z.wire(c, [[-30, 0], [-26, -34], [26, -34], [30, 0]], { w: 3, tone, seed, taper: 0.05 });
  Z.lined(c, [[-30, 0], [-26, -34], [26, -34], [30, 0]], { w: 2.6, tone: tone * 0.9, seed: seed + 1, hatch: 0.2, gap: 7 });
  Z.wire(c, [[-26, -34], [-18, -56], [18, -56], [26, -34]], { w: 3.2, tone, seed: seed + 2 });
  Z.wire(c, [[-18, -56], [0, -64], [18, -56]], { w: 2.8, tone: tone * 0.94, seed: seed + 3 });
  // 两条硬翅（夸张的平直横线：他后来所有的威风都在这两条线上）
  const wob = Math.sin(t * 1.2) * 3;
  for (const sg of [-1, 1]) {
    Z.wire(c, [[sg * 26, -22], [sg * 96, -20 + wob * sg * 0.2], [sg * 132, -22 + wob]], { w: 4.2, tone: tone * 0.96, seed: seed + 8 + sg });
    Z.wire(c, [[sg * 132, -22 + wob], [sg * 150, -12 + wob]], { w: 2.6, tone: tone * 0.8, seed: seed + 12 + sg });
  }
  c.restore();
};

// ============================== 高俅本体 ==============================
// o: { hat幞头(0..1), robe团领袍, belt玉带, hu执笏, ball气球, flip, raise, kneel, hurt, down, tone }
Z.gaoqiu = (c, x, y, s, t, o = {}) => {
  const {
    hat = 1, robe = 1, belt = 1, hu = 1, ball = 0, flip = 0,
    raise = 0, kneel = 0, hurt = 0, down = 0, tone = 0.94,
  } = o;
  const br = Math.sin(t * 1.4) * 2.2;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  if (down) c.rotate(down * 0.55);
  const ly = -(kneel ? 46 : 0);
  const shoulderY = ly - 162, waistY = ly - 82, hipY = ly - 26;

  // ---- 腿（袍摆遮到脚踝，只在跪/倒时露出来）----
  if (!robe || kneel || down) {
    Z.wire(c, [[-30, hipY], [-42, hipY + 44], [-38, ly]], { w: 4, tone, seed: 60, taper: 0.1 });
    Z.wire(c, [[30, hipY], [42, hipY + 44], [38, ly]], { w: 4, tone, seed: 61, taper: 0.1 });
  }

  // ---- 躯干：团领斓袍（宽袖大裾）----
  const body = [[-56, shoulderY + 4], [-70, waistY], [-62, hipY + 10], [62, hipY + 10], [70, waistY], [56, shoulderY + 4]];
  Z.lined(c, body, { w: 3.6, tone, seed: 71, hatch: 0.16, gap: 10, hatchAng: -1.0 });
  c.save(); c.fillStyle = 'rgba(112,114,120,.13)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  // 袍裾（下摆：两笔斜出，末端随 t 微动）
  const hemA = Math.sin(t * 1.7) * 6;
  Z.wire(c, [[-62, hipY + 10], [-82, hipY + 52 + hemA], [-46, hipY + 56 + hemA]], { w: 3, tone: tone * 0.9, seed: 74 });
  Z.wire(c, [[62, hipY + 10], [82, hipY + 52 - hemA], [46, hipY + 56 - hemA]], { w: 3, tone: tone * 0.9, seed: 75 });
  Z.wire(c, [[-46, hipY + 56 + hemA], [0, hipY + 62], [46, hipY + 56 - hemA]], { w: 2.6, tone: tone * 0.84, seed: 76 });
  // 斓（袍上的横向襕纹）
  for (let i = 0; i < 3; i++)
    Z.wire(c, [[-64, waistY + 8 + i * 20], [64, waistY + 8 + i * 20]], { w: 1.8, tone: tone * 0.5, seed: 77 + i });

  // ---- 玉带 ----
  if (belt) Z.lined(c, [[-66, waistY], [66, waistY], [66, waistY + 20], [-66, waistY + 20]],
    { w: 3.4, tone: tone * 0.96, seed: 80, hatch: 0.24, gap: 8 });

  // ---- 双臂 ----
  const handY = shoulderY + 60 - raise * 40;
  Z.wire(c, [[-56, shoulderY + 12], [-92, shoulderY + 42], [-86, handY + 10]], { w: 4, tone, seed: 82, taper: 0.1 });
  Z.wire(c, [[56, shoulderY + 12], [92, shoulderY + 34 - raise * 26], [86, handY - raise * 30]], { w: 4, tone, seed: 83, taper: 0.1 });
  Z.lined(c, [[-86, handY + 8], [-72, handY + 24], [-60, handY + 10], [-70, handY - 6]], { w: 2.4, tone: tone * 0.85, seed: 84 });
  Z.lined(c, [[86, handY - 6], [72, handY + 10], [60, handY - 4], [70, handY - 20]], { w: 2.4, tone: tone * 0.85, seed: 85 });

  // ---- 头：小白脸、细眼、鼠须（不做丑化，只把那点算计画出来）----
  const hy = shoulderY - 40 + br * 0.5;
  const face = [[-25, hy - 14], [-22, hy - 38], [0, hy - 50], [22, hy - 38], [25, hy - 14], [23, hy + 12], [0, hy + 26], [-23, hy + 10]];
  Z.lined(c, face, { w: 2.6, tone: tone * 0.95, seed: 100, hatch: 0.06, gap: 10 });
  // 细长眼（两道微微下撇的线）
  Z.wire(c, [[-19, hy - 16], [-11, hy - 13], [-3, hy - 16]], { w: 2.6, tone, seed: 101 });
  Z.wire(c, [[3, hy - 16], [11, hy - 13], [19, hy - 16]], { w: 2.6, tone, seed: 102 });
  Z.wire(c, [[-14, hy - 6], [-4, hy - 5]], { w: 2, tone: tone * 0.9, seed: 103 });
  Z.wire(c, [[4, hy - 5], [14, hy - 6]], { w: 2, tone: tone * 0.9, seed: 104 });
  // 鼠须 + 嘴角那一撇
  Z.wire(c, [[-10, hy + 8], [10, hy + 7]], { w: 2, tone: tone * 0.8, seed: 105 });
  for (let i = 0; i < 4; i++)
    Z.wire(c, [[-9 + i * 6, hy + 12], [-10 + i * 6, hy + 24]], { w: 1.8, tone: tone * 0.72, seed: 106 + i, taper: 0.6 });
  Z.wire(c, [[16, hy + 2], [21, hy + 8]], { w: 1.8, tone: tone * 0.7, seed: 110 });

  // ---- 长翅幞头 ----
  Z.futou(c, 0, hy - 30, 1.0, { tone: 0.94, seed: 130, q: clamp(hat, 0, 1), t });

  // ---- 执笏（奏事的身份：一块板）----
  if (hu) {
    c.save(); c.translate(88, handY - 2); c.rotate(-0.5 - raise * 0.2);
    Z.lined(c, [[-16, 0], [16, -4], [16, -108], [-16, -104]], { w: 2.6, tone: tone * 0.9, seed: 141, hatch: 0.1, gap: 12 });
    c.restore();
  }
  // ---- 气球（必须在 restore 之前）----
  if (ball) Z.qiu(c, -96, handY + 30, 30, t, { seed: 150 });
  c.restore();
};

// ============================== 九幕 ==============================

// ① 东京浮浪：只写他发迹之前的样子——帮闲、踢球、使枪棒，被开封府脊杖二十、迭配出界
SCENES['gq1_popi'] = (() => {
  const p = () => Z.paper('gq1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 11, tone: 0.42 });
      Z.manor(c, 1540, 780, 0.9, { tone: 0.84, seed: 12, text: '东京' });
      Z.cloud(c, t, { x: 1520, y: 170, s: 1.0, seed: 13, tone: 0.3 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1420 + i * 120, 892, 0.74, t, { flip: 1, tone: 0.58, seed: 14 + i });
      // 浮浪子弟：无官无袍、只有一颗球
      Z.gaoqiu(c, 880, 892, 1.52, t, { hat: 0, robe: 0.5, hu: 0, ball: 1, raise: clamp(Math.sin(t * 1.8) * 0.3 + 0.35) });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 44 + i * 250) % 1980) - 30, by = 320 + ((t * 38 + i * 170) % 460);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.32, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '东京浮浪', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 130, 880, '高二', clamp(ss(1.0, 2.8, lt)), { size: 26 });
  } };
})();

// ② 鸳鸯拐：一只球滚到脚边，他踢还端王——一脚踢开了半生的富贵
SCENES['gq2_cuju'] = (() => {
  const p = () => Z.paper('gq2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.roof(c, 960, 300, 1180, 150, { tone: 0.8, seed: 21 });
      Z.ground(c, 900, { seed: 22, tone: 0.4 });
      Z.pine(c, t, { x: 340, y: 892, s: 1.0, seed: 23, tone: 0.7 });
      Z.pine(c, t, { x: 1660, y: 892, s: 0.86, seed: 24, tone: 0.62 });
      // 端王（后来的徽宗）：右边，团袍无翅软巾，看球
      Z.gaoqiu(c, 1420, 892, 1.3, t, { flip: 1, hat: 0, robe: 1, hu: 0, tone: 0.72, raise: 0.15 });
      c.save(); c.globalAlpha = 0.9; c.fillStyle = 'rgba(26,26,28,.72)';
      c.font = '24px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('端王', 1420, 950); c.restore();
      // 高俅：左边，一脚踢出
      Z.gaoqiu(c, 760, 892, 1.5, t, { hat: 0, robe: 0.6, hu: 0, ball: clamp(ss(2.0, 2.9, lt)) ? 0 : 1, raise: clamp(ss(0.4, 1.6, lt)) });
      // 飞行的球：从他的脚滚到端王脚下，缝线是朱砂
      const u = clamp(ss(0.6, 2.4, lt));
      const bx = lerp(700, 1330, ez(u)), by = 880 - Math.sin(u * Math.PI) * 130;
      Z.qiu(c, bx, by, 34, t, { seed: 30, cin: 1, spin: 3 });
      // 动势线
      for (let i = 0; i < 6; i++) {
        const w2 = u * 620 - i * 34;
        if (w2 > 20) Z.wire(c, [[bx - w2 * 0.12, by + 10 + i * 4], [bx - w2 * 0.3, by + 16 + i * 5]], { w: 1.6, tone: 0.34, seed: 40 + i, taper: 0.8 });
      }
    });
    Z.bigText(c, '鸳鸯拐', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 半年做到殿帅府太尉：一顶幞头，两条硬翅，从此有了生杀的权
SCENES['gq3_taowei'] = (() => {
  const p = () => Z.paper('gq3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.hall(c, 980, 900, 1.24, { tone: 0.9, seed: 31 });
      Z.ground(c, 900, { seed: 32, tone: 0.36 });
      Z.roof(c, 980, 380, 900, 120, { tone: 0.78, seed: 33 });
      Z.flag(c, 380, 620, 190, t, { text: '殿', seed: 34, size: 30 });
      Z.flag(c, 1580, 620, 190, t, { text: '帅', seed: 35, size: 30 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 560 + i * 190, 892, 0.8, t, { tone: 0.6, seed: 36 + i });
      // 幞头逐级戴上：权力的具象化
      Z.gaoqiu(c, 980, 892, 1.62, t, { hat: clamp(ss(0.5, 2.6, lt)), robe: 1, belt: 1, hu: 1, raise: 0.2 });
      for (let i = 0; i < 5; i++) {
        const yy = 300 + i * 90;
        Z.wire(c, [[300, yy], [300 + 60 * Math.sin(t * 0.6 + i), yy + 8]], { w: 1.4, tone: 0.22, seed: 45 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '殿帅府太尉', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 公报私仇逼走王进：上任头一日点卯，先清算三十年前的旧账（接《史进》线）
SCENES['gq4_wangjin'] = (() => {
  const p = () => Z.paper('gq4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.hall(c, 900, 900, 1.1, { tone: 0.88, seed: 51 });
      Z.ground(c, 900, { seed: 52, tone: 0.4 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1500 + i * 130, 892, 0.72, t, { flip: 1, tone: 0.56, seed: 53 + i });
      // 高俅坐堂，一手拍案
      Z.gaoqiu(c, 760, 892, 1.56, t, { hat: 1, robe: 1, hu: 1, raise: clamp(Math.sin(t * 2.4) * 0.2 + 0.3) });
      // 王进：教头制服（会画画不了的人形），接过条文后连夜出城
      const flee = clamp(ss(1.4, 3.2, lt));
      const wx = lerp(1380, 1880, ez(flee));
      c.save(); c.globalAlpha = 1 - flee * 0.35;
      Z.fighter(c, wx, 892, 0.86, t, { flip: 1, tone: 0.74, seed: 60, spear: 0 });
      c.restore();
      // 逃亡的尘土 + 一纸军令
      c.save(); c.globalAlpha = 0.9; c.fillStyle = 'rgba(26,26,28,.72)';
      c.font = '22px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('八十万禁军教头 王进', 760, 940); c.restore();
      for (let i = 0; i < 10; i++) {
        const bx = wx - 20 - ((t * 130 + i * 44) % 320), by = 896 - (i % 3) * 8;
        Z.wire(c, [[bx, by], [bx + 22, by - 3]], { w: 1.6, tone: 0.3 * (1 - flee * 0.5), seed: 70 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '私走延安府', { x: 1760, y: 120, size: 44, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 白虎节堂陷害林冲：制度之威，就是一个门框（接《林冲》线）
SCENES['gq5_baihu'] = (() => {
  const p = () => Z.paper('gq5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.6)) };
    CAM.with(c, cam, (c) => {
      Z.hall(c, 1180, 900, 1.3, { tone: 0.92, seed: 71 });
      Z.ground(c, 900, { seed: 72, tone: 0.38 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 560 + i * 150, 892, 0.74, t, { tone: 0.58, seed: 73 + i });
      // 高俅：堂上端坐式站姿，执笏，看林冲进来
      Z.gaoqiu(c, 900, 892, 1.58, t, { hat: 1, robe: 1, hu: 1, raise: 0.1 });
      // 林冲：被赚入门——复用林冲 rig
      const walk = clamp(ss(0.5, 2.6, lt));
      const lx = lerp(1560, 1180, ez(walk));
      Z.linchong(c, lx, 892, 1.44, t, { flip: 1, blade: 1, hurt: clamp(ss(2.6, 3.4, lt)) });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1290 + i * 120, 892, 0.68, t, { flip: 1, tone: 0.5, seed: 80 + i });
      // 一纸坐实的罪名：擅入节堂即论行刺
      c.save(); c.globalAlpha = 0.9 * clamp(ss(2.2, 3.2, lt)); c.fillStyle = 'rgba(26,26,28,.72)';
      c.font = '26px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('擅入白虎节堂，论行刺', 960, 790); c.restore();
    });
    Z.bigText(c, '白虎节堂', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 三番征剿：他派去的那三员将为首的全成了梁山自己人（接《呼延灼》《关胜》《秦明》线）
SCENES['gq6_santa'] = (() => {
  const p = () => Z.paper('gq6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 200, tone: 0.32, seed: 91 }]);
      Z.ground(c, 900, { seed: 92, tone: 0.44 });
      Z.tent(c, 1560, 830, 1.0, { tone: 0.8, seed: 93 });
      Z.gaoqiu(c, 700, 892, 1.5, t, { hat: 1, robe: 1, hu: 0, raise: 0.35 });
      // 令旗下的三员将：他们都回来了，只是回的不是东京
      const names = ['呼', '关', '秦'];
      for (let i = 0; i < 3; i++) {
        const x = 1120 + i * 190;
        Z.flag(c, x - 90, 600, 168, t, { text: names[i], seed: 100 + i, size: 28 });
        Z.fighter(c, x, 892, 0.82, t, { flip: 1, spear: 1, tone: 0.62, seed: 110 + i });
      }
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 96 + i * 165) % 1500) + 300, dy = 250 + ((t * 30 + i * 88) % 420);
        Z.wire(c, [[dx, dy], [dx + 24, dy - 5]], { w: 1.8, tone: 0.28, seed: 120 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '三番征剿', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 三败遭擒：他自己领兵三打梁山，三战三败，最后在水泊里被活捉上山
SCENES['gq7_beiqin'] = (() => {
  const p = () => Z.paper('gq7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.6)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 170, tone: 0.3, seed: 131 }]);
      Z.ground(c, 900, { seed: 132, tone: 0.4 });
      Z.shanzhai(c, 1600, 700, 0.9, { tone: 0.76, seed: 133, text: '忠义堂' });
      // 水：一排起伏的横浪线
      for (let i = 0; i < 16; i++) {
        const yy = 830 + i * 16, o = Math.sin(t * 1.6 + i * 0.6) * 12;
        Z.wire(c, [[120 + o, yy], [520 + o * 1.6, yy - 4], [920 - o, yy], [1300 + o * 1.3, yy + 3], [1780 - o * 0.8, yy - 2]],
          { w: 1.8, tone: 0.26, seed: 140 + i, taper: 0.8 });
      }
      Z.boat(c, 1520, 880, 0.9, t, { tone: 0.7, seed: 150 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1300 + i * 120, 892, 0.7, t, { flip: 1, tone: 0.56, seed: 151 + i });
      // 高俅：幞头仍在，跪了
      Z.gaoqiu(c, 820, 892, 1.48, t, { hat: 1, robe: 1, kneel: clamp(ss(1.2, 2.6, lt)), hurt: clamp(ss(1.8, 3.0, lt)), hu: 0 });
      c.save(); c.globalAlpha = 0.9; c.fillStyle = 'rgba(26,26,28,.72)';
      c.font = '24px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('生擒高太尉', 820, 1000); c.restore();
    });
    Z.bigText(c, '三败水泊', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 放还之后背信：答应替梁山求招安，回朝只报「天时不顺」四个字
SCENES['gq8_beixin'] = (() => {
  const p = () => Z.paper('gq8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.hall(c, 960, 900, 1.2, { tone: 0.9, seed: 161 });
      Z.ground(c, 900, { seed: 162, tone: 0.36 });
      Z.roof(c, 960, 370, 940, 130, { tone: 0.78, seed: 163 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1420 + i * 140, 892, 0.7, t, { flip: 1, tone: 0.5, seed: 164 + i });
      // 回到东京：他执笏奏事，把「招安」二字咽了回去
      Z.gaoqiu(c, 900, 892, 1.6, t, { hat: 1, robe: 1, hu: 1, raise: clamp(ss(0.8, 2.2, lt)) });
      // 一纸谎言
      c.save(); c.globalAlpha = clamp(ss(1.6, 2.8, lt)); c.fillStyle = 'rgba(26,26,28,.7)';
      c.font = '28px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('天时不顺，暂且回军', 960, 780); c.restore();
      for (let i = 0; i < 6; i++) {
        const yy = 320 + i * 80;
        Z.wire(c, [[1560, yy], [1560 + 50 * Math.sin(t * 0.7 + i), yy + 6]], { w: 1.4, tone: 0.2, seed: 170 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '背信', { x: 1760, y: 120, size: 52, tone: 0.94, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑨ 毒酒：全书最后一桩大事是他做的——最后一个「忠」字，也掐死在他手里
SCENES['gq9_duyao'] = (() => {
  const p = () => Z.paper('gq9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.05, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.hall(c, 1180, 900, 1.16, { tone: 0.9, seed: 181 });
      Z.ground(c, 900, { seed: 182, tone: 0.38 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 540 + i * 150, 892, 0.68, t, { tone: 0.5, seed: 183 + i });
      Z.gaoqiu(c, 820, 892, 1.54, t, { hat: 1, robe: 1, hu: 1, raise: 0.15 });
      // 御酒：一只执壶，壶口一线朱砂——全片最后一点红
      const hu1 = clamp(ss(0.8, 2.4, lt));
      c.save(); c.translate(1400, 700); c.globalAlpha = hu1;
      Z.lined(c, [[-46, 40], [46, 40], [40, -60], [-40, -60]], { w: 3, tone: 0.86, seed: 190, hatch: 0.14, gap: 10 });
      Z.wire(c, [[-40, -60], [-30, -78], [30, -78], [40, -60]], { w: 2.8, tone: 0.86, seed: 191 });
      Z.wire(c, [[46, 10], [96, -18], [104, -46]], { w: 2.8, tone: 0.84, seed: 192 });   // 壶嘴
      Z.wire(c, [[-46, 8], [-92, 6], [-96, -34]], { w: 2.8, tone: 0.84, seed: 193 });    // 壶把
      c.restore();
      // 壶口的一线朱砂
      c.save(); c.globalAlpha = clamp(ss(1.6, 3.0, lt));
      c.strokeStyle = 'rgba(183,51,46,.86)'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(1400, 622); c.quadraticCurveTo(1410 + Math.sin(t * 3) * 3, 660, 1400 + Math.sin(t * 2) * 4, 700); c.stroke();
      c.restore();
      // 结句
      c.save(); c.globalAlpha = clamp(ss(2.4, 3.4, lt)); c.fillStyle = 'rgba(26,26,28,.8)';
      c.font = '30px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('一百八人，一半是他送上去的', 960, 790); c.restore();
    });
    Z.bigText(c, '御酒', { x: 1760, y: 120, size: 48, tone: 0.94, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 130, 880, '高俅', clamp(ss(0.9, 2.8, lt)), { size: 26 });
  } };
})();
})();
