// 宋江 rig + 水浒之前八幕（SH-07，宋元版画线描 + 焦墨）
// 造型：① 押司期：幞头 + 皂公服 + 执笔/卷 ② 囚徒期：赭衣 + 面颊金印 + 枷 ③ 梁山期：素袍 + 冠 + 替天行道旗
// 母题：① 招文袋（杀惜的那口袋，呼应本案中全部秘密）② 笔（浔阳楼题诗）③ 酒碗（最后一杯御酒）
//      ④ 排线密度（随幕推进越来越密＝压抑）⑤ 朱砂仅用于印与那一笔血。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 宋江本体 ==============================
// o: { raise抬手, flip朝向, official押司皂服, dashed赭囚衣, cangue枷, hat幞头, crown冠,
//      brush执笔, write题写（笔触微颤）, bag招文袋, bowl酒碗, kneel跪, back背影, hurt负伤, tone墨色 }
Z.songjiang = (c, x, y, s, t, o = {}) => {
  const {
    raise = 0, flip = 0, official = 1, dashed = 0, cangue = 0, hat = 1, crown = 0,
    brush = 0, write = 0, bag = 0, bowl = 0, kneel = 0, back = 0, hurt = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.6) * 3.4;                   // 呼吸
  c.save();
  c.translate(x, y + Math.sin(t * 1.9) * 1.2); c.scale(flip ? -s : s, s);
  const knee = kneel ? 44 : 0, ly = -knee;

  // ---- 袍（三类期：皂服／赭囚衣／素袍）
  const hemY = ly - 2, shoulderY = ly - 152;
  let robeCol = 'rgba(58,56,54,.16)';                   // 皂（押司）
  if (dashed) robeCol = 'rgba(112,58,36,.22)';          // 赭（囚徒）
  else if (!official) robeCol = 'rgba(226,222,210,.5)'; // 素（梁山）
  const body = [[-42, shoulderY + 10], [-52, ly - 70], [-58, hemY], [58, hemY], [52, ly - 70], [42, shoulderY + 10]];
  Z.lined(c, body, { w: 3.2, tone, seed: 173, hatch: dashed ? 0.2 : 0.12, gap: 10 });
  c.save(); c.fillStyle = robeCol;
  c.beginPath(); c.moveTo(body[0][0], body[0][1]);
  for (let i = 1; i < body.length; i++) c.lineTo(body[i][0], body[i][1]);
  c.closePath(); c.fill(); c.restore();

  // 腰带
  Z.wire(c, [[-46, ly - 78], [46, ly - 78]], { w: 4, tone: tone * 0.95, seed: 174, taper: 0.08 });
  Z.wire(c, [[-46, ly - 70], [46, ly - 70]], { w: 2, tone: tone * 0.7, seed: 175, taper: 0.08 });

  // ---- 头
  const hy = shoulderY - 26 + br * 0.3;
  c.save(); c.translate(6, hy);
  c.beginPath(); c.ellipse(0, 0, 17, 19, 0, 0, Math.PI * 2);
  c.fillStyle = 'rgba(238,232,220,.95)'; c.fill();
  c.strokeStyle = `rgba(26,26,28,${tone})`; c.lineWidth = 2.4; c.stroke();
  if (!back) {
    // 眉眼（短竖线＝焦墨小点）
    c.strokeStyle = `rgba(26,26,28,${tone * 0.95})`; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-8, -3); c.lineTo(-3, -3); c.moveTo(4, -3); c.lineTo(9, -3); c.stroke();
    c.fillStyle = `rgba(26,26,28,${tone})`;
    c.beginPath(); c.ellipse(-5.5, -1, 1.5, 2.2, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(6.5, -1, 1.5, 2.2, 0, 0, Math.PI * 2); c.fill();
    // 三绺短须（孝义黑三郎）
    Z.wire(c, [[-2, 12], [-3, 20], [-2, 27]], { w: 2, tone: tone * 0.8, seed: 176, taper: 0.3 });
    Z.wire(c, [[3, 12], [3, 21], [4, 28]], { w: 2, tone: tone * 0.8, seed: 177, taper: 0.3 });
  }
  // 幞头（押司）／软冠（梁山）／散发（囚徒）
  if (hat) {
    Z.lined(c, [[-20, -12], [-16, -34], [0, -38], [16, -34], [20, -12]],
      { w: 2.8, tone, seed: 178, hatch: 0.24, gap: 5 });
    c.fillStyle = 'rgba(40,38,36,.82)';
    c.beginPath(); c.moveTo(-20, -12); c.lineTo(-16, -34); c.lineTo(0, -38); c.lineTo(16, -34); c.lineTo(20, -12); c.closePath(); c.fill();
    Z.wire(c, [[-20, -12], [-30, -4], [-26, 8]], { w: 2.6, tone: tone * 0.8, seed: 179, taper: 0.2 });
    Z.wire(c, [[20, -12], [30, -4], [26, 8]], { w: 2.6, tone: tone * 0.8, seed: 180, taper: 0.2 });
  } else if (crown) {
    Z.lined(c, [[-19, -12], [-12, -32], [0, -26], [12, -32], [19, -12]],
      { w: 2.6, tone, seed: 181, hatch: 0.2, gap: 6 });
  } else {
    Z.wire(c, [[-18, -10], [-24, 2], [-20, 14]], { w: 2.4, tone: tone * 0.75, seed: 182, taper: 0.3 });
    Z.wire(c, [[18, -10], [24, 2], [20, 14]], { w: 2.4, tone: tone * 0.75, seed: 183, taper: 0.3 });
  }
  // 面颊金印（刺配）
  if (dashed) {
    c.strokeStyle = Z.CINNABAR; c.lineWidth = 1.8; c.globalAlpha = 0.7;
    c.beginPath(); c.moveTo(-14, 6); c.lineTo(-8, 10); c.moveTo(-14, 12); c.lineTo(-8, 16); c.stroke();
    c.globalAlpha = 1;
  }
  c.restore();

  // ---- 双臂
  // 持续性微摆：仅有「抬手目标值」的静态构图会被 QA 判死帧，必须叠加连续分量
  const rl = clamp(raise) + Math.sin(t * 2.2) * 0.06;
  if (brush) {
    // 执笔：右臂抬起，笔尖随 write 微颤
    const wr = write ? Math.sin(t * 9) * 3 : 0;
    Z.wire(c, [[-34, shoulderY + 22], [-58, ly - 96 - 30 * rl], [-72, ly - 130 - 52 * rl]], { w: 7, tone: tone * 0.85, seed: 184, taper: 0.15 });
    Z.wire(c, [[-72, ly - 130 - 52 * rl], [-78 - wr * 0.4, ly - 172 - 52 * rl - wr]], { w: 3, tone, seed: 185, taper: 0.5 });
  } else if (bag) {
    // 招文袋：垂于腰侧，随步微摆
    const bw = Math.sin(t * 2.2) * 6;
    Z.wire(c, [[-34, shoulderY + 22], [-52, ly - 96], [-40, ly - 62]], { w: 7, tone: tone * 0.85, seed: 186, taper: 0.15 });
    Z.lined(c, [[-50 + bw * 0.2, ly - 62], [-22 + bw * 0.2, ly - 60], [-20 + bw, ly - 20], [-48 + bw, ly - 22]],
      { w: 2.6, tone, seed: 187, hatch: 0.18, gap: 5 });
  } else if (bowl) {
    // 酒碗：末幕那一杯
    Z.wire(c, [[-34, shoulderY + 22], [-56, ly - 100], [-46, ly - 74]], { w: 7, tone: tone * 0.85, seed: 188, taper: 0.15 });
    Z.lined(c, [[-58, ly - 76], [-34, ly - 76], [-44, ly - 62], [-48, ly - 62]], { w: 2.4, tone, seed: 189, hatch: 0.12, gap: 4 });
  } else {
    Z.wire(c, [[-34, shoulderY + 22], [-54, ly - 96 - 24 * rl], [-66, ly - 128 - 46 * rl]], { w: 7, tone: tone * 0.85, seed: 190, taper: 0.15 });
  }
  Z.wire(c, [[34, shoulderY + 22], [54, ly - 92], [62, ly - 66]], { w: 7, tone: tone * 0.85, seed: 191, taper: 0.15 });

  // ---- 枷
  if (cangue) {
    const gw = 128, gh = 96, gy = shoulderY + 44;
    Z.lined(c, [[-gw / 2, gy], [gw / 2, gy], [gw / 2, gy + gh], [-gw / 2, gy + gh]],
      { w: 3.4, tone, seed: 192, hatch: 0.16, gap: 9, hatchAng: -1.5 });
    c.strokeStyle = `rgba(26,26,28,${tone * 0.6})`; c.lineWidth = 1.6;
    c.beginPath(); c.moveTo(-gw / 2 + 8, gy + gh / 2); c.lineTo(gw / 2 - 8, gy + gh / 2); c.stroke();
  }
  // ---- 负伤（以乱笔示意）
  if (hurt) {
    Z.wire(c, [[20, ly - 120], [34, ly - 104], [26, ly - 88]], { w: 2, tone: tone * 0.7, seed: 193, taper: 0.4 });
  }
  c.restore();
};

// 次要人物剪影（受施者／好汉／差役）
const extra = (c, x, y, s, t, o = {}) => {
  const { seed = 1, wave = 0, kneel = 0, axe = 0 } = o;
  c.save(); c.translate(x, y + Math.sin(t * 2.4 + seed) * 2.6); c.scale(s, s);
  const hh = kneel ? 62 : 78;
  c.fillStyle = 'rgba(38,36,34,.85)';
  c.beginPath(); c.ellipse(0, -hh - 12, 11, 12, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.moveTo(-18, 0); c.quadraticCurveTo(-22, -48, 0, -hh + 4); c.quadraticCurveTo(22, -48, 18, 0); c.closePath(); c.fill();
  if (wave) {
    c.strokeStyle = 'rgba(38,36,34,.85)'; c.lineWidth = 6; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-14, -50); c.lineTo(-26, -70); c.stroke();
  }
  if (axe) {
    // 双板斧（李逵）
    const sw = Math.sin(t * 7) * 0.5;
    c.save(); c.translate(18, -56); c.rotate(-0.7 + sw);
    c.strokeStyle = 'rgba(38,36,34,.9)'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -42); c.stroke();
    c.fillStyle = 'rgba(46,44,42,.92)';
    c.beginPath(); c.moveTo(0, -42); c.lineTo(26, -50); c.lineTo(20, -20); c.lineTo(0, -24); c.closePath(); c.fill();
    c.restore();
  }
  c.restore();
};

// ① 郓城押司：仗义疏财，江湖人称及时雨
SCENES['sj1_yasi'] = (() => {
  const p = () => Z.paper('sj1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const z = lerp(1.0, 1.042, lt / 3.75);
    c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
    const rev = clamp(ss(0.15, 1.1, lt));
    Z.cloud(c, t, { x: 420, y: 200, s: 0.9, seed: 2, tone: 0.4 });
    Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 120, tone: 0.5, seed: 31 }]);
    Z.roof(c, 1180, 660, 420, 150, { tone: 0.75, seed: 5 });
    Z.ground(c, 900, { seed: 11, tone: 0.4 });
    extra(c, 480, 884, 0.62, t, { seed: 3, kneel: 1 });
    extra(c, 620, 884, 0.58, t, { seed: 4, wave: 1 });
    extra(c, 1520, 884, 0.55, t, { seed: 6, wave: 1 });
    const rk = clamp(ss(0.25, 1.6, lt));
    Z.songjiang(c, 1000, 900, 1.32, t, { raise: 0.3 * rk, official: 1, hat: 1, flip: 0 });
    Z.bigText(c, '及时雨', { x: 1760, y: 118, size: 52, tone: 0.86, appear: rev });
    Z.seal(c, 120, 900, '宋江', clamp(ss(1.4, 2.2, lt)));
    c.restore();
  } };
})();

// ② 私放晁盖：生辰纲事发，一骑飞书
SCENES['sj2_chao'] = (() => {
  const p = () => Z.paper('sj2', '#e6e3d8');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const z = lerp(1.0, 1.042, lt / 3.75);
    c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
    Z.mountains(c, c, -60, 1990, [{ y0: 500, amp: 140, tone: 0.56, seed: 32 }]);
    Z.pine(c, t, { x: 320, y: 900, s: 1.2, seed: 7, tone: 0.7 });
    Z.ground(c, 920, { seed: 12, tone: 0.44 });
    const rush = clamp(ss(0.3, 2.2, lt));
    Z.songjiang(c, lerp(1560, 1160, rush), 900, 1.26, t, { raise: 0.5, official: 1, flip: 1 });
    Z.labelBox(c, 1180, 700, 150, 96, { tone: 0.8, seed: 13 });
    extra(c, 520, 900, 0.7, t, { seed: 8, wave: 1 });
    Z.bigText(c, '一骑飞书', { x: 1760, y: 118, size: 46, tone: 0.84, appear: clamp(ss(0.9, 1.8, lt)) });
    c.restore();
  } };
})();

// ③ 怒杀阎婆惜：招文袋里的秘密，忍无可忍
SCENES['sj3_poxi'] = (() => {
  const p = () => Z.paper('sj3', '#e2ded2');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const z = lerp(1.0, 1.042, lt / 3.75);
    c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
    Z.roof(c, 960, 520, 620, 240, { tone: 0.7, seed: 9 });
    Z.ground(c, 940, { seed: 14, tone: 0.46 });
    Z.cloud(c, t, { x: 1500, y: 230, s: 0.7, seed: 10, tone: 0.36 });
    extra(c, 1520, 930, 0.62, t, { seed: 11 });
    const st = clamp(ss(0.9, 1.9, lt));
    Z.songjiang(c, 980, 930, 1.38, t, { raise: st * 0.9, official: 1, hat: 1, bag: 1, flip: 0 });
    // 那一笔朱砂（全片唯一的彩）
    c.save(); c.globalAlpha = clamp(ss(1.5, 2.3, lt));
    c.strokeStyle = Z.CINNABAR; c.lineWidth = 3.4;
    c.beginPath(); c.moveTo(1090, 780); c.lineTo(1150, 742); c.stroke();
    c.restore();
    Z.bigText(c, '忍无可忍', { x: 1760, y: 118, size: 44, tone: 0.86, appear: clamp(ss(1.2, 2.0, lt)) });
    c.restore();
  } };
})();

// ④ 发配江州：面颊金印，赭衣带枷
SCENES['sj4_peijun'] = (() => {
  const p = () => Z.paper('sj4', '#e4dfd2');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const z = lerp(1.0, 1.042, lt / 3.75);
    c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
    Z.mountains(c, c, -60, 1990, [{ y0: 510, amp: 150, tone: 0.58, seed: 33 }]);
    Z.cloud(c, t, { x: 300, y: 220, s: 0.8, seed: 12, tone: 0.42 });
    Z.ground(c, 930, { seed: 15, tone: 0.44 });
    extra(c, 620, 930, 0.72, t, { seed: 13 });
    extra(c, 1380, 930, 0.72, t, { seed: 14 });
    const wk = clamp(ss(0.3, 2.4, lt));
    Z.songjiang(c, lerp(400, 1000, wk), 930, 1.34, t, { official: 0, dashed: 1, cangue: 1, hat: 0, flip: 0 });
    Z.bigText(c, '刺配江州', { x: 1760, y: 118, size: 46, tone: 0.84, appear: clamp(ss(0.8, 1.6, lt)) });
    c.restore();
  } };
})();

// ⑤ 浔阳楼：题反诗——他时若遂凌云志
SCENES['sj5_xunyang'] = (() => {
  const p = () => Z.paper('sj5', '#e7e2d4');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const z = lerp(1.0, 1.042, lt / 3.75);
    c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
    Z.roof(c, 980, 480, 900, 300, { tone: 0.68, seed: 15 });
    Z.ground(c, 950, { seed: 16, tone: 0.4 });
    Z.mountains(c, c, -60, 1990, [{ y0: 470, amp: 130, tone: 0.44, seed: 34 }]);
    Z.songjiang(c, 900, 930, 1.4, t, { official: 0, dashed: 1, hat: 0, brush: 1, write: 1, raise: 0.55 });
    // 题壁：两句反诗逐字显
    const a = clamp(ss(0.6, 2.6, lt));
    Z.labelBox(c, 1220, 620, 520, 220, { tone: 0.78, seed: 17 });
    Z.bigText(c, '他時若遂凌雲志', { x: 1480, y: 700, size: 40, tone: 0.88, appear: clamp((a - 0.2) / 0.5) });
    Z.bigText(c, '敢笑黃巢不丈夫', { x: 1480, y: 760, size: 40, tone: 0.88, appear: clamp((a - 0.55) / 0.45) });
    c.restore();
  } };
})();

// ⑥ 江州劫法场：黑旋风抡斧，白龙庙再聚
SCENES['sj6_fachang'] = (() => {
  const p = () => Z.paper('sj6', '#dfd9cb');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const z = lerp(1.0, 1.042, lt / 3.75);
    c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
    Z.roof(c, 1700, 560, 380, 180, { tone: 0.72, seed: 18 });
    Z.ground(c, 950, { seed: 17, tone: 0.5 });
    Z.scorch(c, [[300, 950], [1600, 950]], { tone: 0.4, seed: 19, layers: 3, spread: 2 });
    extra(c, 520, 930, 0.8, t, { seed: 20, axe: 1 });
    extra(c, 660, 930, 0.72, t, { seed: 21, axe: 1 });
    extra(c, 1400, 930, 0.68, t, { seed: 22, wave: 1 });
    Z.songjiang(c, 980, 930, 1.36, t, { official: 0, dashed: 1, hat: 0, raise: 0.7, hurt: 1 });
    Z.flame(c, 1760, 900, 1.0, t, { seed: 23, tone: 0.6 });
    Z.bigText(c, '劫法場', { x: 1760, y: 118, size: 46, tone: 0.86, appear: clamp(ss(0.5, 1.4, lt)) });
    c.restore();
  } };
})();

// ⑦ 梁山聚义：一百单八，替天行道
SCENES['sj7_juyi'] = (() => {
  const p = () => Z.paper('sj7', '#e6e1d3');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const z = lerp(1.0, 1.042, lt / 3.75);
    c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
    Z.cloud(c, t, { x: 340, y: 190, s: 1.1, seed: 24, tone: 0.38 });
    Z.mountains(c, c, -60, 1990, [{ y0: 480, amp: 150, tone: 0.5, seed: 35 }]);
    Z.roof(c, 940, 620, 760, 240, { tone: 0.72, seed: 25 });
    Z.ground(c, 950, { seed: 18, tone: 0.42 });
    for (let i = 0; i < 7; i++) extra(c, 220 + i * 250, 930, 0.6, t, { seed: 26 + i, wave: 1 });
    Z.flag(c, 1560, 900, 280, t, { text: '替天行道', seed: 27, size: 40, droop: 0.3 });
    Z.songjiang(c, 980, 940, 1.44, t, { official: 0, crown: 1, hat: 0, raise: 0.45 });
    Z.bigText(c, '一百單八', { x: 1760, y: 118, size: 46, tone: 0.86, appear: clamp(ss(0.8, 1.8, lt)) });
    c.restore();
  } };
})();

// ⑧ 蓼儿洼：招安之后的最后一杯
SCENES['sj8_liaowa'] = (() => {
  const p = () => Z.paper('sj8', '#e0dbcd');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const z = lerp(1.0, 1.042, lt / 3.75);
    c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
    Z.mountains(c, c, -60, 1990, [{ y0: 500, amp: 160, tone: 0.6, seed: 36 }]);
    Z.cloud(c, t, { x: 1500, y: 210, s: 1.0, seed: 28, tone: 0.44 });
    Z.ground(c, 940, { seed: 19, tone: 0.44 });
    Z.pine(c, t, { x: 1720, y: 940, s: 1.1, seed: 29, tone: 0.72 });
    const drink = clamp(ss(1.2, 2.6, lt));
    Z.songjiang(c, 960, 930, 1.38, t, { official: 0, crown: 1, hat: 0, bowl: 1, raise: 0.3 + drink * 0.4, hurt: drink });
    Z.seal(c, 1700, 900, '宋江', clamp(ss(0.9, 2.0, lt)), { size: 30 });
    Z.bigText(c, '御酒一杯', { x: 1760, y: 118, size: 44, tone: 0.84, appear: clamp(ss(0.6, 1.6, lt)) });
    c.restore();
  } };
})();
})();
