// 《水浒传·柴进》rig + 九幕（宋元版画线描 + 焦墨）
// 造型：后周皇裔柴世宗嫡派子孙，沧州横海郡人，绰号「小旋风」，梁山排名第十（天贵星），掌管钱粮。
//   征方腊时化名入方腊军中为内应；班师后推称风疾，辞官归沧州，善终。
//   特征：① 丹书铁券（signature，朱砂）② 素袍 ③ 束发紫金冠 ④ 银钱筛箩。
// 唯一的彩：朱砂只用于① 丹书铁券上的钤印与券文 ② 第四幕牢狱血光（不直绘）③ 末幕「小旋风」钤印。
// 母题：① 铁券 ② 素袍 ③ 钱粮（箩筐/斗斛）④ 庄院。
// 弧光：后周皇裔 → 招纳天下好汉 → 高唐州叔父受欺 → 李逵打死殷天锡 → 下狱 →
//       公孙胜斗法救出 → 上梁山掌钱粮 → 化名入方腊军为内应 → 辞官归沧州善终。
// 依《水浒传》第九回、第二十二回、第五十二至五十四回、第一百十六至十九回。
// 互文：第二幕复用林冲、武松、宋江（皆受其惠），第四幕复用李逵，第五幕复用公孙胜，
//       第九幕对照卢俊义（同为富贵出身，一辞官善终、一赐毒酒而死）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 丹书铁券（signature：铁券本身就是他的命根 —— 朱砂券文 + 朱砂钤印）
Z.tiequan = (c, x, y, s, q = 1, { tone = 0.9, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.08);
  const w = 150, h = 96;
  Z.wire(c, [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2], [-w / 2, -h / 2]],
    { w: 3.4, tone, seed, taper: 0.04 });
  Z.wire(c, [[-w / 2 + 8, -h / 2 + 8], [w / 2 - 8, -h / 2 + 8], [w / 2 - 8, h / 2 - 8], [-w / 2 + 8, h / 2 - 8], [-w / 2 + 8, -h / 2 + 8]],
    { w: 1.6, tone: tone * 0.6, seed: seed + 1 });
  Z.scorch(c, [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], { tone: 0.14, seed: seed + 2, layers: 3 });
  c.save();
  c.globalAlpha = clamp(q);
  c.fillStyle = 'rgba(183,51,46,.82)';
  c.font = '26px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('丹书铁券', 0, -18);
  c.font = '17px "LXGWWenKai-500"';
  c.fillText('免死免刑', 0, 16);
  c.restore();
  // 朱砂钤印
  const r = rng(seed + 5);
  if (q > 0.5) {
    c.save(); c.globalAlpha = (q - 0.5) * 2;
    c.strokeStyle = 'rgba(183,51,46,.8)'; c.lineWidth = 2;
    c.strokeRect(w / 2 - 42, h / 2 - 44, 34, 34);
    c.fillStyle = 'rgba(183,51,46,.16)'; c.fillRect(w / 2 - 42, h / 2 - 44, 34, 34);
    for (let i = 0; i < 26; i++) { c.fillStyle = 'rgba(183,51,46,' + (0.14 + r() * 0.2) + ')'; c.fillRect(w / 2 - 42 + r() * 34, h / 2 - 44 + r() * 34, 1 + r() * 2, 1 + r() * 2); }
    c.fillStyle = 'rgba(183,51,46,.86)'; c.font = '15px "LXGWWenKai-500"';
    c.fillText('柴', w / 2 - 34, h / 2 - 34); c.fillText('进', w / 2 - 34, h / 2 - 16);
    c.restore();
  }
  c.restore();
};

// 钱粮：斗斛 + 箩筐（掌钱粮的标识）
Z.douhu = (c, x, y, s, { tone = 0.82, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.lined(c, [[-56, 0], [-46, -72], [46, -72], [56, 0]], { w: 3, tone, seed, hatch: 0.18, gap: 9, hatchAng: -0.7 });
  Z.wire(c, [[-56, 0], [56, 0]], { w: 3.2, tone, seed: seed + 1 });
  Z.hatchBox(c, [[-46, -30], [46, -30], [56, 0], [-56, 0]], { ang: -1.3, gap: 10, tone: 0.12, seed: seed + 2 });
  c.restore();
};

// ============================== 柴进本体 ==============================
// o: { robe素袍, crown冠, tiequan丹书铁券, flip, raise, kneel, jailed囚, down, tone }
Z.chaijin = (c, x, y, s, t, o = {}) => {
  const {
    robe = 1, crown = 1, tiequan = 1, flip = 0, raise = 0, kneel = 0,
    jailed = 0, sick = 0, down = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.2) * 2;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  if (down) c.rotate(down * 0.6);
  const ly = -(kneel ? 46 : 0);
  const shoulderY = ly - 158;
  const waistY = ly - 72;
  const hipY = ly - 10;

  // ---- 素袍（长袍，宽袖 —— 与武将的短打形成对比）----
  const gown = [[-64, shoulderY + 8], [-72, waistY + 10], [-86, ly - 6], [-70, ly], [70, ly], [86, ly - 6], [72, waistY + 10], [64, shoulderY + 8]];
  Z.lined(c, gown, { w: 3.4, tone, seed: 20, hatch: 0.14, gap: 11, hatchAng: -1.25 });
  Z.wire(c, [[-70, ly], [70, ly]], { w: 3, tone, seed: 21, taper: 0.06 });
  Z.wire(c, [[-72, waistY + 10], [72, waistY + 10]], { w: 3.2, tone, seed: 22, taper: 0.06 });
  for (let i = 0; i < 5; i++) {
    const u = -1 + i * 0.5;
    Z.wire(c, [[u * 46, waistY + 14], [u * 62, ly - 2]], { w: 1.8, tone: tone * 0.5, seed: 23 + i });
  }
  // 交领
  Z.wire(c, [[-40, shoulderY + 6], [0, shoulderY + 60], [40, shoulderY + 6]], { w: 3, tone: tone * 0.9, seed: 30 });

  // ---- 双臂（宽袖）----
  const handY = shoulderY + 66 - raise * 44;
  Z.lined(c, [[-64, shoulderY + 12], [-100, shoulderY + 48], [-92, handY + 26], [-58, handY + 6]],
    { w: 3.2, tone, seed: 50, hatch: 0.12, gap: 9 });
  Z.lined(c, [[64, shoulderY + 12], [100, shoulderY + 44 - raise * 20], [92, handY + 20 - raise * 26], [58, handY - raise * 30]],
    { w: 3.2, tone, seed: 51, hatch: 0.12, gap: 9 });

  // ---- 头（束发紫金冠 + 三绺微须）----
  const hy = shoulderY - 44 + br * 0.5 + sick * 12;
  const face = [[-21, hy - 12], [-19, hy - 36], [0, hy - 48], [19, hy - 36], [21, hy - 12], [19, hy + 12], [0, hy + 24], [-19, hy + 10]];
  Z.lined(c, face, { w: 2.6, tone: tone * 0.95, seed: 100, hatch: 0.05, gap: 10 });
  Z.wire(c, [[-14, hy - 16], [-6, hy - 22], [-2, hy - 19]], { w: 2.2, tone, seed: 101 });
  Z.wire(c, [[2, hy - 19], [6, hy - 22], [14, hy - 16]], { w: 2.2, tone, seed: 102 });
  Z.wire(c, [[-11, hy - 6], [-4, hy - 5]], { w: 2, tone, seed: 103 });
  Z.wire(c, [[4, hy - 5], [11, hy - 6]], { w: 2, tone, seed: 104 });
  Z.wire(c, [[-5, hy + 6], [5, hy + 5]], { w: 2, tone: tone * 0.8, seed: 105 });
  for (let i = 0; i < 3; i++) {
    const bx = -6 + i * 6;
    Z.wire(c, [[bx, hy + 16], [bx + Math.sin(t * 1.6 + i) * 2, hy + 40]], { w: 1.6, tone: tone * 0.7, seed: 106 + i, taper: 0.6 });
  }
  if (crown) {
    Z.wire(c, [[-24, hy - 20], [-21, hy - 48], [21, hy - 48], [24, hy - 20]], { w: 2.8, tone: 0.92, seed: 130 });
    Z.wire(c, [[-21, hy - 48], [-14, hy - 70], [0, hy - 62], [14, hy - 70], [21, hy - 48]], { w: 3, tone: 0.92, seed: 131 });
    Z.wire(c, [[0, hy - 62], [0, hy - 86]], { w: 2.4, tone: 0.86, seed: 132 });
    Z.wire(c, [[-8, hy - 86], [8, hy - 86]], { w: 2.2, tone: 0.86, seed: 133 });
  } else {
    Z.wire(c, [[-22, hy - 20], [-18, hy - 46], [18, hy - 46], [22, hy - 20]], { w: 2.6, tone: 0.8, seed: 134 });
    Z.wire(c, [[-22, hy - 20], [22, hy - 20]], { w: 2, tone: 0.66, seed: 135 });
  }
  // 囚：项上枷意的粗线（不画刑具细节）
  if (jailed) {
    Z.wire(c, [[-56, shoulderY + 2], [56, shoulderY + 2]], { w: 4.4, tone: 0.9, seed: 136 });
    Z.wire(c, [[-30, shoulderY - 6], [-30, shoulderY + 10]], { w: 3, tone: 0.86, seed: 137 });
    Z.wire(c, [[30, shoulderY - 6], [30, shoulderY + 10]], { w: 3, tone: 0.86, seed: 138 });
  }

  // ---- 手持：丹书铁券（必须在 restore 之前）----
  if (tiequan) Z.tiequan(c, 94, handY - raise * 26, 0.92, 1, { tone: 0.9, seed: 170 });
  c.restore();
};

// ============================== 九幕 ==============================

// ① 后周皇裔：沧州横海郡，柴世宗嫡派子孙
SCENES['cj1_huangyi'] = (() => {
  const p = () => Z.paper('cj1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 400, y: 170, s: 1.1, seed: 4, tone: 0.3 });
      Z.ground(c, 900, { seed: 5, tone: 0.4 });
      Z.manor(c, 1480, 780, 0.98, { tone: 0.88, seed: 6, text: '柴家庄' });
      Z.pine(c, t, { x: 340, y: 890, s: 1.0, seed: 7, tone: 0.84 });
      Z.flag(c, 640, 590, 168, t, { text: '柴', seed: 8, size: 32 });
      Z.chaijin(c, 1020, 892, 1.56, t, { raise: 0.3 });
      Z.tiequan(c, 700, 700, 1.15, clamp(ss(0.3, 1.4, lt)), { tone: 0.92, seed: 9 });
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 50 + i * 205) % 1980) - 30, by = 300 + ((t * 38 + i * 150) % 460);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.34, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '后周皇裔', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 招纳天下好汉：林冲、宋江、武松皆受其惠（互文）
SCENES['cj2_zhaona'] = (() => {
  const p = () => Z.paper('cj2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 11, tone: 0.42 });
      Z.manor(c, 1560, 790, 0.86, { tone: 0.84, seed: 12, text: '柴家庄' });
      Z.chaijin(c, 1080, 892, 1.5, t, { raise: clamp(ss(0.3, 1.2, lt)) * 0.45 });
      Z.linchong(c, 1560, 892, 1.16, t, { flip: 1, spear: 1, tone: 0.8, raise: 0.2 });
      Z.wusong(c, 640, 892, 1.2, t, { staff: 1, tone: 0.8, raise: 0.2 });
      Z.songjiang(c, 400, 892, 1.16, t, { official: 1, tone: 0.78, raise: 0.18 });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 320 + ((t * 34 + i * 150) % 430);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1911 + i, taper: 0.6 });
      }
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('林冲宋江武松，皆曾受惠于此', 940, 300);
        c.restore();
      }
    });
    Z.bigText(c, '纳士招贤', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 高唐州：叔父柴皇城被殷天锡欺辱
SCENES['cj3_gaotang'] = (() => {
  const p = () => Z.paper('cj3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 170, tone: 0.3, seed: 21 }]);
      Z.ground(c, 900, { seed: 22, tone: 0.44 });
      Z.manor(c, 1500, 790, 0.9, { tone: 0.86, seed: 23, text: '高唐州' });
      Z.guan(c, 420, 780, 0.6, { tone: 0.7, seed: 24, text: '州衙' });
      // 殷天锡（仗势的豪强：大腹 + 遮阳扇）
      Z.fighter(c, 1420, 892, 1.24, t, { flip: 1, tone: 0.86, seed: 25 });
      Z.wire(c, [[1490, 700], [1560, 660], [1566, 720]], { w: 2.6, tone: 0.84, seed: 26 });
      Z.chaijin(c, 760, 892, 1.5, t, { raise: clamp(ss(0.4, 1.5, lt)) * 0.4 });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 104 + i * 168) % 1400) + 300, dy = 810 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 6]], { w: 2, tone: 0.36, seed: 1961 + i, taper: 0.9 });
      }
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('殷天锡要占柴家花园', 940, 300);
        c.restore();
      }
    });
    Z.bigText(c, '高唐州', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ④ 李逵打死殷天锡，柴进下狱（互文 Z.likui；不直绘血）
SCENES['cj4_xiayu'] = (() => {
  const p = () => Z.paper('cj4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 31, tone: 0.4 });
      Z.guan(c, 1480, 790, 0.86, { tone: 0.88, seed: 32, text: '州牢' });
      // 牢栅
      for (let i = 0; i < 9; i++) Z.wire(c, [[420 + i * 44, 620], [420 + i * 44, 900]], { w: 2.6, tone: 0.8, seed: 33 + i });
      Z.wire(c, [[420, 640], [820, 640]], { w: 3, tone: 0.84, seed: 42 });
      Z.wire(c, [[420, 860], [820, 860]], { w: 3, tone: 0.84, seed: 43 });
      Z.likui(c, 1400, 892, 1.5, t, { axe: 1, rage: clamp(ss(0.2, 1.2, lt)), raise: clamp(Math.sin(t * 3.2) * 0.3 + 0.5) });
      Z.chaijin(c, 640, 892, 1.46, t, { jailed: clamp(ss(0.8, 1.8, lt)), raise: 0.1, crown: 0, tiequan: 0 });
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 48 + i * 210) % 1960) - 30, by = 300 + ((t * 32 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1917 + i, taper: 0.6 });
      }
      if (lt > 1.4) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(1.4, 2.4, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('李逵打死殷天锡，柴进锒铛入狱', 1000, 320);
        c.restore();
      }
    });
    Z.bigText(c, '祸起旋风的斧', { x: 1760, y: 120, size: 42, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 梁山破高唐州：公孙胜斗法破高廉，柴进得救（互文 Z.gongsun）
SCENES['cj5_doufa'] = (() => {
  const p = () => Z.paper('cj5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 190, tone: 0.3, seed: 51 }]);
      Z.ground(c, 900, { seed: 52, tone: 0.44 });
      Z.guan(c, 1560, 790, 0.92, { tone: 0.86, seed: 53, text: '高唐州' });
      Z.gongsun(c, 1500, 892, 1.44, t, { raise: clamp(ss(0.3, 1.4, lt)) });
      Z.leifu(c, 1620, 520, 1.15, clamp(ss(0.6, 1.8, lt)), { seed: 54 });
      Z.chaijin(c, 900, 892, 1.44, t, { jailed: 1 - clamp(ss(0.8, 2.0, lt)) * 0.9, raise: clamp(ss(0.8, 2.0, lt)) * 0.4, crown: 0 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 480 + i * 110, 892, 0.86, t, { blade: 1, tone: 0.68, seed: 55 + i });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 112 + i * 165) % 1500) + 300, dy = 800 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1971 + i, taper: 0.9 });
      }
      if (lt > 1.4) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.4, 2.4, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('五雷正法破妖术，柴进出狱', 960, 300);
        c.restore();
      }
    });
    Z.bigText(c, '破城救出', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 上梁山掌钱粮：天贵星，掌管山寨钱粮
SCENES['cj6_qianliang'] = (() => {
  const p = () => Z.paper('cj6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 61, tone: 0.42 });
      Z.wire(c, [[1100, 900], [1100, 500], [1820, 500], [1820, 900]], { w: 3.6, tone: 0.88, seed: 62 });
      Z.roof(c, 1460, 500, 760, 156, { tone: 0.9, seed: 63 });
      Z.hatchBox(c, [[1100, 900], [1820, 900], [1820, 500], [1100, 500]], { ang: -1.35, gap: 22, tone: 0.1, seed: 64 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.66)'; c.font = '32px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('忠义堂', 1460, 736); c.restore();
      Z.chaijin(c, 1180, 892, 1.46, t, { raise: clamp(ss(0.3, 1.3, lt)) * 0.4 });
      Z.douhu(c, 1520, 892, 1.0, { tone: 0.84, seed: 65 });
      Z.crate(c, 1680, 892, 0.86, { tone: 0.8, seed: 66 });
      Z.crate(c, 1780, 892, 0.7, { tone: 0.72, seed: 67 });
      Z.songjiang(c, 780, 892, 1.4, t, { official: 1, raise: clamp(Math.sin(t * 1.2) * 0.16 + 0.24) });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 320 + ((t * 34 + i * 150) % 430);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1918 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '掌管钱粮', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑦ 征方腊：化名柯引，潜入方腊军中为内应
SCENES['cj7_neiying'] = (() => {
  const p = () => Z.paper('cj7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 470, amp: 220, tone: 0.32, seed: 71 }, { y0: 640, amp: 120, tone: 0.22, seed: 72 }]);
      Z.ground(c, 900, { seed: 73, tone: 0.44 });
      Z.tent(c, 1560, 800, 0.98, { tone: 0.82, seed: 74, text: '方腊中军' });
      Z.flag(c, 380, 560, 190, t, { text: '方', seed: 75, size: 32 });
      Z.chaijin(c, 900, 892, 1.5, t, { raise: clamp(ss(0.4, 1.5, lt)) * 0.35, crown: 0, tiequan: 0, tone: 0.86 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1320 + i * 120, 892, 0.9, t, { flip: 1, spear: 1, tone: 0.7, seed: 76 + i });
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('化名柯引，卧底方腊军中', 940, 300);
        c.restore();
      }
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 110 + i * 168) % 1500) + 300, dy = 810 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 6]], { w: 2, tone: 0.36, seed: 1975 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '卧底江南', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 辞官：推称风疾，纳还官诰
SCENES['cj8_ciguan'] = (() => {
  const p = () => Z.paper('cj8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 81, tone: 0.42 });
      Z.guan(c, 1520, 790, 0.88, { tone: 0.86, seed: 82, text: '殿前' });
      // 官诰（一卷纸）
      Z.wire(c, [[1240, 892], [1240, 840], [1420, 840], [1420, 892]], { w: 2.8, tone: 0.84, seed: 83 });
      Z.wire(c, [[1240, 866], [1420, 866]], { w: 1.8, tone: 0.6, seed: 84 });
      const sick = clamp(ss(0.4, 1.6, lt));
      Z.chaijin(c, 840, 892, 1.5, t, { sick, kneel: sick * 0.5, raise: 0.1, crown: 0 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1700 + i * 90, 892, 0.66, t, { flip: 1, tone: 0.56, seed: 85 + i });
      if (lt > 1.2) {
        c.save(); c.globalAlpha = 0.84 * clamp(ss(1.2, 2.2, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('推称风疾，纳还官诰', 940, 320);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 48 + i * 210) % 1960) - 30, by = 320 + ((t * 30 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1919 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '辞官归里', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑨ 善终：归沧州横海郡，寿终正寝（朱砂钤印；对照卢俊义赐死）
SCENES['cj9_shanzhong'] = (() => {
  const p = () => Z.paper('cj9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 200, tone: 0.3, seed: 91 }, { y0: 660, amp: 110, tone: 0.2, seed: 92 }]);
      Z.cloud(c, t, { x: 460, y: 180, s: 1.2, seed: 93, tone: 0.3 });
      Z.ground(c, 900, { seed: 94, tone: 0.4 });
      Z.manor(c, 1520, 800, 0.86, { tone: 0.84, seed: 95, text: '柴家庄' });
      Z.pine(c, t, { x: 380, y: 892, s: 1.05, seed: 96, tone: 0.84 });
      Z.chaijin(c, 940, 892, 1.52, t, { raise: 0.24, sick: 0.6 });
      Z.tiequan(c, 1300, 700, 1.0, clamp(ss(0.6, 2.0, lt)), { tone: 0.88, seed: 97 });
      if (lt > 2.0) {
        c.save(); c.globalAlpha = 0.86 * clamp(ss(2.0, 3.0, lt));
        c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '30px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('归沧州横海郡，得以善终', 700, 330);
        c.restore();
      }
      for (let i = 0; i < 10; i++) {
        const bx = ((t * 44 + i * 210) % 1960) - 30, by = 320 + ((t * 30 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1991 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '得以善终', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '小旋风', clamp(ss(0.9, 2.6, lt)), { size: 28 });
  } };
})();
})();
