// 《水浒传·顾大嫂》rig + 十幕（宋元版画线描 + 焦墨）。十幕 33.60s。
// 造型：登州人，绰号「母大虫」，丈夫孙新（小尉迟），开「顾家酒店」。
//   特征：① 包髻（妇人发髻 + 扎巾带，signature 发饰）② 围裙（酒店主妇标识）③ 朴刀（signature 兵器）。
//   唯一的彩：朱砂只用于① 酒旗/招牌的淡朱底（Z.flag 内置）② 劫牢与遭陷的克制血光点 ③ 末幕「母大虫」钤印——余皆黑白灰。
// 母题：① 朴刀 ② 包髻 ③ 围裙 ④ 悍勇拍案。
// 弧光：登州开酒店 → 解珍解宝遭毛太公陷害入狱 → 母大虫拍案定计 → 修书赚兄孙立（登州提辖）里应外合 →
//       持刀劫牢 → 救出二解 → 火并官军杀出登州 → 同投梁山 → 排座次地慧星 → 母大虫之名不让须眉。
// 依《水浒传》第四十九回（解珍解宝双越狱、顾大嫂劫牢）、第五十一回后梁山聚义排座次。
// 考据：孙立「病尉迟」为登州兵马提辖，顾大嫂是其弟妇（孙新之妻）；邹渊、邹润、乐和为同谋；顾大嫂排地慧星，第一百〇一位。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 朴刀（signature：长柄 + 阔背刀头，全片黑白，朱砂只用于旗/血光/钤印）
Z.podao = (c, x, y, s, { tone = 0.9, seed = 1, raise = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.save(); c.rotate(-0.12 - raise * 0.32);
  Z.wire(c, [[0, 132], [0, -118]], { w: 4.2, tone, seed, taper: 0.06 });
  Z.wire(c, [[0, -118], [0, -140]], { w: 6, tone: tone * 0.85, seed: seed + 1 });   // 护手
  Z.wire(c, [[0, -140], [-30, -176], [-46, -212]], { w: 3.4, tone, seed: seed + 2, taper: 0.05 });
  Z.wire(c, [[0, -140], [18, -182], [28, -218]], { w: 3.2, tone: tone * 0.92, seed: seed + 3 });
  c.fillStyle = 'rgba(26,26,28,.22)';
  c.beginPath(); c.moveTo(0, -140); c.lineTo(-30, -176); c.lineTo(-46, -212); c.lineTo(28, -218); c.lineTo(18, -182); c.closePath(); c.fill();
  c.restore();
  c.restore();
};

// ============================== 顾大嫂本体 ==============================
// o: { knife朴刀, apron围裙, flip, raise举刀, kneel, bound缚, hurt, tone }
Z.gudasao = (c, x, y, s, t, o = {}) => {
  const { knife = 1, apron = 1, flip = 0, raise = 0, kneel = 0, bound = 0, hurt = 0, tone = 0.9 } = o;
  const br = Math.sin(t * 1.35) * 2.2;
  c.save();
  c.translate(x, y);
  c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 46 : 0);
  const shoulderY = ly - 156;
  const waistY = ly - 78;
  const hipY = ly - 26;

  // ---- 下身：裤（市井，非战裙）----
  const legs = [[-40, hipY - 12], [-58, ly + 2], [58, ly + 2], [40, hipY - 12]];
  Z.lined(c, legs, { w: 3.4, tone, seed: 20, hatch: 0.18, gap: 9 });
  for (let i = 0; i < 6; i++) {
    const u = -1 + i * 0.4;
    Z.wire(c, [[u * 34, hipY - 10], [u * 58, ly + 2]], { w: 2, tone: tone * 0.6, seed: 25 + i });
  }
  if (!kneel) {
    Z.wire(c, [[-38, ly + 2], [-52, ly + 12], [-46, ly + 20]], { w: 2.6, tone: tone * 0.8, seed: 31 });
    Z.wire(c, [[38, ly + 2], [52, ly + 12], [46, ly + 20]], { w: 2.6, tone: tone * 0.8, seed: 32 });
  }

  // ---- 围裙（酒店主妇标识）----
  if (apron) {
    const ap = [[-46, hipY - 8], [-52, ly - 6], [52, ly - 6], [46, hipY - 8]];
    Z.lined(c, ap, { w: 3.2, tone: tone * 0.92, seed: 35, hatch: 0.24, gap: 10, hatchAng: -0.5 });
    Z.wire(c, [[-46, hipY - 8], [46, hipY - 8]], { w: 2.4, tone: 0.8, seed: 36 });
    Z.wire(c, [[-46, hipY - 8], [-40, hipY - 30]], { w: 2.2, tone: 0.7, seed: 37 });
    Z.wire(c, [[46, hipY - 8], [40, hipY - 30]], { w: 2.2, tone: 0.7, seed: 38 });
  }

  // ---- 躯干（短衫）----
  const body = [[-52, shoulderY + 6], [-58, waistY + 2], [-48, hipY - 6], [48, hipY - 6], [58, waistY + 2], [52, shoulderY + 6]];
  Z.lined(c, body, { w: 3.4, tone, seed: 50, hatch: 0.2, gap: 8 });
  c.save(); c.fillStyle = 'rgba(118,120,126,.14)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  for (let i = 0; i < 3; i++) Z.wire(c, [[-50, shoulderY + 30 + i * 20], [50, shoulderY + 30 + i * 20]], { w: 1.8, tone: tone * 0.55, seed: 51 + i });
  Z.wire(c, [[-58, waistY + 2], [58, waistY + 2], [58, waistY + 20], [-58, waistY + 20], [-58, waistY + 2]], { w: 3.2, tone, seed: 56, taper: 0.06 });
  Z.lined(c, [[-52, shoulderY + 6], [-72, shoulderY + 24], [-62, shoulderY + 50]], { w: 2.8, tone: tone * 0.9, seed: 57, hatch: 0.14 });
  Z.lined(c, [[52, shoulderY + 6], [72, shoulderY + 24], [62, shoulderY + 50]], { w: 2.8, tone: tone * 0.9, seed: 58, hatch: 0.14 });
  // 腰封「母」字徽记（signature 文字化）
  c.save(); c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('母', 0, waistY + 11); c.restore();

  // ---- 双臂 ----
  const handY = shoulderY + 52 - raise * 46;
  Z.wire(c, [[-52, shoulderY + 12], [-86, shoulderY + 38], [-78, handY + 6]], { w: 3.8, tone, seed: 60, taper: 0.1 });
  Z.wire(c, [[52, shoulderY + 12], [86, shoulderY + 34 - raise * 26], [78, handY - raise * 30]], { w: 3.8, tone, seed: 61, taper: 0.1 });
  if (bound) {
    Z.wire(c, [[-78, handY + 2], [78, handY - 6]], { w: 3, tone: tone * 0.9, seed: 62 });
    Z.wire(c, [[-72, handY + 10], [72, handY - 2]], { w: 2.4, tone: tone * 0.8, seed: 63 });
  } else {
    Z.lined(c, [[-78, handY + 4], [-64, handY + 20], [-52, handY + 6], [-62, handY - 8]], { w: 2.2, tone: tone * 0.85, seed: 64 });
    Z.lined(c, [[78, handY - 6], [64, handY + 10], [52, handY - 4], [62, handY - 18]], { w: 2.2, tone: tone * 0.85, seed: 65 });
  }

  // ---- 头（包髻：妇人发髻 + 扎巾带）----
  const hy = shoulderY - 40 + br * 0.5 + hurt * 6;
  const face = [[-21, hy - 12], [-19, hy - 36], [0, hy - 48], [19, hy - 36], [21, hy - 12], [19, hy + 12], [0, hy + 24], [-19, hy + 10]];
  Z.lined(c, face, { w: 2.6, tone: tone * 0.95, seed: 100, hatch: 0.06, gap: 9 });
  Z.wire(c, [[-16, hy - 16], [-8, hy - 22], [-2, hy - 19]], { w: 2.2, tone, seed: 101 });
  Z.wire(c, [[2, hy - 19], [8, hy - 22], [16, hy - 16]], { w: 2.2, tone, seed: 102 });
  Z.wire(c, [[-13, hy - 8], [-4, hy - 7]], { w: 2, tone, seed: 103 });
  Z.wire(c, [[4, hy - 7], [13, hy - 8]], { w: 2, tone, seed: 104 });
  Z.wire(c, [[-6, hy + 4], [6, hy + 3]], { w: 2, tone: tone * 0.8, seed: 105 });
  // 包髻（signature 发饰）：顶圆髻 + 扎巾
  Z.lined(c, [[-22, hy - 30], [-18, hy - 58], [18, hy - 58], [22, hy - 30]], { w: 2.6, tone: 0.9, seed: 130, hatch: 0.2, gap: 6 });
  Z.wire(c, [[-14, hy - 58], [0, hy - 72], [14, hy - 58]], { w: 2.4, tone: 0.9, seed: 131 });
  Z.wire(c, [[-20, hy - 30], [-32, hy - 4]], { w: 2, tone: 0.8, seed: 132 });   // 左巾带
  Z.wire(c, [[20, hy - 30], [32, hy - 4]], { w: 2, tone: 0.8, seed: 133 });       // 右巾带

  // ---- 手持：必须在 c.restore() 之前 ----
  if (knife) Z.podao(c, 80, handY - 4, 1.0, { tone, seed: 170, raise: 0.3 + raise * 0.7 });
  c.restore();
};

// ============================== 十幕 ==============================

// ① 登州开酒店：顾家酒店，包髻短衫围裙的市井起点
SCENES['g1_kaijiu'] = (() => {
  const p = () => Z.paper('g1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.cloud(c, t, { x: 420, y: 190, s: 1.0, seed: 13, tone: 0.3 });
      Z.manor(c, 1500, 660, 0.82, { tone: 0.84, seed: 12, text: '顾家酒店' });
      Z.pine(c, t, { x: 320, y: 892, s: 0.9, seed: 14, tone: 0.7 });
      Z.flag(c, 360, 560, 180, t, { text: '酒', seed: 15, size: 30 });
      const sw = clamp(Math.sin(t * 2.3) * 0.5 + 0.5);
      Z.gudasao(c, 820, 892, 1.5, t, { knife: 1, apron: 1, raise: sw * 0.2 });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 44 + i * 220) % 1980) - 30, by = 320 + ((t * 38 + i * 170) % 460);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.32, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '开酒店', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 解珍解宝遭陷：毛太公赖虎，二解入狱（远写，牢城 + 朱砂血光点克制）
SCENES['g2_xianxian'] = (() => {
  const p = () => Z.paper('g2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 170, tone: 0.32, seed: 21 }]);
      Z.ground(c, 900, { seed: 22, tone: 0.42 });
      Z.guan(c, 980, 720, 1.0, { tone: 0.82, seed: 23, text: '牢城' });
      // 二解（垂手被押，seed 不同以示二人）
      Z.fighter(c, 700, 892, 1.0, t, { tone: 0.6, seed: 24 });
      Z.fighter(c, 820, 892, 1.0, t, { tone: 0.6, seed: 25 });
      // 官军（helmet）
      Z.fighter(c, 1240, 892, 1.0, t, { flip: 1, helmet: 1, spear: 1, tone: 0.7, seed: 26 });
      // 朱砂血光点（克制：被陷之惨只几点，不画血流）
      const bleed = clamp(ss(0.6, 2.2, lt));
      c.save();
      for (let i = 0; i < 7; i++) {
        const px = 700 + (i % 2) * 90 + Math.sin(t * 1.6 + i) * 6;
        const py = 800 + Math.floor(i / 2) * 40;
        c.fillStyle = `rgba(183,51,46,${(0.22 + (i % 3) * 0.08) * bleed})`;
        c.beginPath(); c.ellipse(px, py, 6 + (i % 2) * 3, 4 + (i % 3), i, 0, 7); c.fill();
      }
      c.restore();
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 110 + i * 180) % 1500) + 300, dy = 250 + ((t * 30 + i * 88) % 420);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 5]], { w: 1.8, tone: 0.28, seed: 120 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '遭陷', { x: 1760, y: 120, size: 48, tone: 0.94, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 母大虫拍案：闻讯拍案定计，串联孙新、邹渊、邹润、乐和
SCENES['g3_paian'] = (() => {
  const p = () => Z.paper('g3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 31, tone: 0.4 });
      Z.manor(c, 980, 700, 0.9, { tone: 0.82, seed: 32, text: '孙家庄' });
      // 拍案的案桌
      Z.wire(c, [[640, 880], [640, 800], [900, 800], [900, 880]], { w: 3.2, tone: 0.84, seed: 33 });
      Z.hatchBox(c, [[640, 880], [900, 880], [900, 800], [640, 800]], { ang: -1.4, gap: 16, tone: 0.12, seed: 34 });
      // 顾大嫂（拍案：刀垂、身前倾）
      const slap = clamp(ss(0.4, 1.6, lt));
      c.save(); c.translate(760, 892); c.rotate(slap * 0.08); c.translate(-760, -892);
      Z.gudasao(c, 760, 892, 1.5, t, { knife: 1, apron: 1, raise: -0.2 - slap * 0.3 });
      c.restore();
      // 同谋配角（邹渊、邹润、乐和）
      Z.fighter(c, 1250, 892, 0.92, t, { tone: 0.66, seed: 35 });
      Z.fighter(c, 1380, 892, 0.92, t, { tone: 0.66, seed: 36 });
      Z.fighter(c, 1510, 892, 0.92, t, { tone: 0.66, seed: 37 });
      c.save(); const a3 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a3;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('母大虫拍案，定劫牢计', 960, 122); c.restore();
    });
    Z.bigText(c, '拍案', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 修书赚兄：写信赚登州提辖孙立（兄）里应外合
SCENES['g4_bixiong'] = (() => {
  const p = () => Z.paper('g4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 41, tone: 0.38 });
      Z.manor(c, 1500, 700, 0.86, { tone: 0.82, seed: 42, text: '提辖府' });
      // 孙立（登州提辖，helmet 配角代表）
      Z.fighter(c, 1300, 892, 1.16, t, { flip: 1, helmet: 1, spear: 1, tone: 0.74, seed: 43 });
      // 顾大嫂（持刀、修书定计）
      Z.gudasao(c, 720, 892, 1.5, t, { knife: 1, apron: 1, raise: clamp(Math.sin(t * 1.6) * 0.2 + 0.25) });
      // 书信（朱砂封缄一点）
      const letter = clamp(ss(0.6, 2.4, lt));
      c.save(); c.globalAlpha = 0.7 + 0.3 * letter;
      Z.wire(c, [[520, 760], [660, 760], [660, 820], [520, 820], [520, 760]], { w: 2.6, tone: 0.8, seed: 44 });
      c.fillStyle = 'rgba(183,51,46,.5)'; c.beginPath(); c.arc(590, 790, 5, 0, 7); c.fill();
      c.fillStyle = 'rgba(26,26,28,.82)'; c.font = '20px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('书', 590, 790);
      c.restore();
      c.save(); const a4 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a4;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('修书赚兄，里应外合', 960, 122); c.restore();
    });
    Z.bigText(c, '赚兄', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 持刀劫牢：母大虫杀入牢城（signature 武勇 + 克制血光）
SCENES['g5_jielao'] = (() => {
  const p = () => Z.paper('g5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 51, tone: 0.42 });
      Z.guan(c, 980, 720, 1.0, { tone: 0.82, seed: 52, text: '牢城' });
      // 官军（被冲倒）
      const down = clamp(ss(1.2, 2.4, lt));
      Z.fighter(c, 1320, 892, 1.1, t, { flip: 1, helmet: 1, spear: 0, tone: 0.7, seed: 53, down: down });
      // 顾大嫂（持刀冲入）
      const rush = clamp(ss(0.4, 1.8, lt));
      Z.gudasao(c, lerp(620, 780, rush), 892, 1.58, t, { knife: 1, apron: 0, raise: rush });
      // 朱砂血光点（劫牢之战，克制）
      const bleed = clamp(ss(0.8, 2.4, lt));
      c.save();
      for (let i = 0; i < 8; i++) {
        const px = 1100 + (i % 3) * 70 + Math.sin(t * 1.8 + i) * 6;
        const py = 800 + Math.floor(i / 3) * 38;
        c.fillStyle = `rgba(183,51,46,${(0.24 + (i % 3) * 0.1) * bleed})`;
        c.beginPath(); c.ellipse(px, py, 7 + (i % 2) * 3, 4 + (i % 3), i, 0, 7); c.fill();
      }
      c.restore();
      c.save(); const a5 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a5;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('持刀劫牢，杀入牢城', 960, 122); c.restore();
    });
    Z.bigText(c, '劫牢', { x: 1760, y: 120, size: 48, tone: 0.94, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 救出二解：牢门洞开，兄弟重逢
SCENES['g6_jiuchu'] = (() => {
  const p = () => Z.paper('g6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 61, tone: 0.4 });
      Z.guan(c, 980, 720, 1.0, { tone: 0.62, seed: 62, text: '牢城' });
      // 二解出牢门（从门洞走出）
      const out = clamp(ss(0.4, 2.4, lt));
      Z.fighter(c, lerp(940, 700, out), 892, 1.0, t, { tone: 0.66, seed: 63 });
      Z.fighter(c, lerp(1010, 840, out), 892, 1.0, t, { tone: 0.66, seed: 64 });
      // 顾大嫂（持刀守门，flip 面向牢内）
      Z.gudasao(c, 1320, 892, 1.5, t, { knife: 1, apron: 1, flip: 1, raise: clamp(ss(0.3, 1.4, lt)) });
      c.save(); const a6c = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a6c;
      c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('牢门洞开，兄弟重逢', 960, 320); c.restore();
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 320 + ((t * 34 + i * 150) % 430);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1916 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '救出', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 火并官军，杀出登州
SCENES['g7_huobing'] = (() => {
  const p = () => Z.paper('g7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 180, tone: 0.32, seed: 71 }]);
      Z.ground(c, 900, { seed: 72, tone: 0.44 });
      Z.pine(c, t, { x: 320, y: 892, s: 0.9, seed: 73, tone: 0.66 });
      Z.pine(c, t, { x: 1640, y: 892, s: 0.8, seed: 74, tone: 0.6 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1420 + i * 120, 892, 0.96, t, { flip: 1, helmet: 1, spear: 1, tone: 0.7, seed: 75 + i });
      const charge = clamp(ss(0.2, 1.6, lt));
      Z.gudasao(c, lerp(620, 800, charge), 892, 1.58, t, { knife: 1, apron: 0, raise: charge });
      // 朱砂血光点（战）
      const bleed = clamp(ss(0.6, 2.2, lt));
      c.save();
      for (let i = 0; i < 7; i++) {
        const px = 1000 + (i % 3) * 64 + Math.sin(t * 1.8 + i) * 6;
        const py = 800 + Math.floor(i / 3) * 40;
        c.fillStyle = `rgba(183,51,46,${(0.22 + (i % 3) * 0.08) * bleed})`;
        c.beginPath(); c.ellipse(px, py, 6 + (i % 2) * 3, 4 + (i % 3), i, 0, 7); c.fill();
      }
      c.restore();
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 110 + i * 165) % 1500) + 300, dy = 800 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1990 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '出城', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑧ 同投梁山：上水泊梁山
SCENES['g8_touliang'] = (() => {
  const p = () => Z.paper('g8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 200, tone: 0.3, seed: 81 }]);
      Z.ground(c, 900, { seed: 82, tone: 0.42 });
      Z.shanzhai(c, 980, 620, 1.0, { tone: 0.8, seed: 83, text: '梁山' });
      Z.flag(c, 1180, 540, 240, t, { text: '替天行道', seed: 84, size: 36 });
      Z.gudasao(c, 720, 892, 1.5, t, { knife: 0, apron: 1, raise: clamp(Math.sin(t * 1.6) * 0.2 + 0.25) });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1080 + i * 120, 892, 0.94, t, { tone: 0.7, seed: 85 + i });
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 110 + i * 165) % 1500) + 300, dy = 800 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1990 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '投梁山', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑨ 聚义排座次：地慧星，女将
SCENES['g9_juyi'] = (() => {
  const p = () => Z.paper('g9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.6)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 91, tone: 0.38 });
      Z.shanzhai(c, 980, 620, 1.0, { tone: 0.8, seed: 92, text: '忠义堂' });
      Z.flag(c, 360, 600, 180, t, { text: '地', seed: 93, size: 30 });
      Z.flag(c, 1600, 600, 180, t, { text: '慧', seed: 94, size: 30 });
      Z.gudasao(c, 960, 892, 1.52, t, { knife: 0, apron: 1, raise: clamp(ss(0.6, 2.2, lt)) });
      // 星位意象（朱砂小星，克制，象征地慧星入列）
      const star = clamp(ss(0.8, 2.0, lt));
      c.save(); c.globalAlpha = 0.78 * star; c.fillStyle = 'rgba(183,51,46,.74)';
      const sx = 960, sy = 296;
      c.beginPath();
      for (let k = 0; k < 10; k++) { const a = k / 10 * 6.28 - Math.PI / 2; const r = k % 2 ? 5 : 13; c.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); }
      c.closePath(); c.fill();
      c.restore();
      c.save(); const a9 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a9;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('排座次，地慧星女将', 960, 122); c.restore();
    });
    Z.bigText(c, '聚义', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑩ 收束：母大虫之名，不让须眉——朱砂「母大虫」钤印
SCENES['g10_shou'] = (() => {
  const p = () => Z.paper('g10', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: 1.0 };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 470, amp: 200, tone: 0.3, seed: 101 }]);
      Z.cloud(c, t, { x: 520, y: 200, s: 1.0, seed: 103, tone: 0.3 });
      Z.cloud(c, t, { x: 1420, y: 260, s: 0.9, seed: 104, tone: 0.28 });
      Z.ground(c, 900, { seed: 102, tone: 0.38 });
      Z.pine(c, t, { x: 360, y: 892, s: 1.0, seed: 105, tone: 0.66 });
      Z.pine(c, t, { x: 1560, y: 892, s: 1.0, seed: 106, tone: 0.66 });
      // 顾大嫂立像（母大虫）
      Z.gudasao(c, 960, 892, 1.66, t, { knife: 1, apron: 1, raise: 0.18 });
      c.save(); c.globalAlpha = clamp(ss(0.6, 2.4, lt)); c.fillStyle = 'rgba(26,26,28,.82)';
      c.font = '34px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('母大虫之名，不让须眉', 960, 470);
      c.font = '24px "LXGWWenKai-500"'; c.fillStyle = 'rgba(26,26,28,.62)';
      c.fillText('水浒女将，顾大嫂居其一', 960, 520); c.restore();
    });
    Z.bigText(c, '母大虫', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 130, 800, '母大虫', clamp(ss(0.8, 2.6, lt)), { size: 36 });
  } };
})();
})();
