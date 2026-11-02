// 林冲 rig + 梁山之前八幕（宋元版画线描 + 焦墨）
// 造型：① 禁军教头期：兜鍪 + 青白战袍 + 花枪  ② 囚徒期：赭衣 + 面颊刺字 + 枷  ③ 雪夜期：毡笠 + 斗篷 + 酒葫芦
// 母题：花枪（贯穿全片的器物，也是本案中给他定罪的刀的影子）、雪、枪缨朱砂、葫芦、庙门、草料场的垛
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 林冲本体 ==============================
// o: { raise抬起, flip朝向(1左/0右), armor战袍, dashed赭囚衣, cangue枷, spear花枪, gourd葫芦,
//      cloak斗篷, brand刺面金印, hurt负伤, firm立怒, bow揖, kneel跪, back背影 }
Z.linchong = (c, x, y, s, t, o = {}) => {
  const {
    raise = 0, flip = 0, armor = 1, dashed = 0, cangue = 0, spear = 0, gourd = 0,
    cloak = 0, brand = 0, hurt = 0, firm = 0, bow = 0, kneel = 0, back = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.6) * 2.2;                    // 呼吸
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const knee = kneel ? 46 : 0, ly = -knee;

  // ---- 斗篷（雪夜）：先画背后的
  if (cloak > 0) {
    const a = cloak * (0.75 + 0.25 * Math.sin(t * 1.9));
    Z.wire(c, [[-28, -166], [-64 * a, -60], [-52 * a, 0], [52 * a, 0], [64 * a, -60], [28, -166]], { w: 3, tone: tone * 0.8, seed: 71, taper: 0.1 });
    Z.hatchBox(c, [[-64 * a, -60], [64 * a, -60], [52 * a, 0], [-52 * a, 0]], { ang: -1.2, gap: 11, tone: 0.2, seed: 72 });
  }

  // ---- 下身（袍）
  const hemY = ly - 2, shoulderY = ly - 152;
  const robeCol = dashed ? 'rgba(108,56,36,.24)' : 'rgba(120,130,140,.13)';
  Z.lined(c, [[-44, shoulderY + 10], [-54, ly - 70], [-60, hemY], [60, hemY], [54, ly - 70], [44, shoulderY + 10]],
    { w: 3.2, tone, seed: 73, hatch: dashed ? 0.18 : 0.12, gap: 10 });
  c.save();
  c.fillStyle = robeCol;
  c.beginPath(); c.moveTo(-44, shoulderY + 10); c.lineTo(-54, ly - 70); c.lineTo(-60, hemY); c.lineTo(60, hemY); c.lineTo(54, ly - 70); c.lineTo(44, shoulderY + 10); c.closePath(); c.fill();
  c.restore();
  // 腰带（革带）
  Z.wire(c, [[-48, ly - 78], [48, ly - 78]], { w: 4, tone: tone * 0.95, seed: 74, taper: 0.08 });
  Z.wire(c, [[-48, ly - 70], [48, ly - 70]], { w: 2, tone: tone * 0.7, seed: 75, taper: 0.08 });

  // ---- 战甲期：胸甲排线（版画用排线做金属）
  if (armor && !dashed) {
    Z.lined(c, [[-42, shoulderY + 8], [42, shoulderY + 8], [46, ly - 80], [-46, ly - 80]], { w: 2.8, tone: tone * 0.85, seed: 76, hatch: 0.16, gap: 6, hatchAng: -1.35 });
  }

  // ---- 上身 / 双臂
  const armA = lerp(0.2, -0.55, raise) + Math.sin(t * 1.6 + 1) * 0.02;
  const handY = shoulderY + 46 + Math.sin(armA) * 56;
  Z.wire(c, [[-36, shoulderY + 12], [-50, shoulderY + 56 + br * 0.3], [-56, handY]], { w: 3, tone, seed: 77, taper: 0.1 });   // 左臂
  Z.wire(c, [[36, shoulderY + 12], [50, shoulderY + 52 - raise * 22], [58, handY - raise * 40]], { w: 3, tone, seed: 78, taper: 0.1 });   // 右臂（持枪时抬）
  // 袍袖
  Z.lined(c, [[-56, handY - 6], [-42, handY + 10], [-32, handY - 4], [-46, handY - 22]], { w: 2.4, tone: tone * 0.8, seed: 79 });

  // ---- 头
  const hy = shoulderY - 34 + br * 0.5;
  c.save(); c.translate(0, hy); c.scale(1.22, 1.22); c.translate(0, -hy);   // 头大身壮：陈洪绶水浒叶子的比例
  const face = [[-20, hy - 12], [-16, hy - 34], [0, hy - 42], [16, hy - 34], [20, hy - 12], [16, hy + 14], [0, hy + 22], [-16, hy + 12]];
  Z.wire(c, face, { w: 2.8, tone, seed: 80, taper: 0.08 });
  // 眉眼口（版画的脸：极简，三笔）
  Z.wire(c, [[-13, hy - 16], [-5, hy - 18]], { w: 2.2, tone: tone * 0.95, seed: 81 });
  Z.wire(c, [[5, hy - 18], [13, hy - 16]], { w: 2.2, tone: tone * 0.95, seed: 82 });
  Z.wire(c, [[-9, hy - 8], [-3, hy - 7]], { w: 1.8, tone: tone * 0.9, seed: 83 });
  Z.wire(c, [[3, hy - 7], [9, hy - 8]], { w: 1.8, tone: tone * 0.9, seed: 84 });
  Z.wire(c, [[-5, hy + 8], [5, hy + 8]], { w: 1.8, tone: tone * 0.75, seed: 85 });
  if (back) { c.save(); c.fillStyle = 'rgba(232,230,222,.92)'; c.beginPath(); face.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore(); }

  // ---- 刺面金印（配军之辱）：颊上两行朱砂小点
  if (brand) {
    c.save(); c.fillStyle = 'rgba(183,51,46,.62)';
    for (let i = 0; i < 6; i++) { c.fillRect(10, hy - 6 + i * 3.4, 2.4, 2.2); c.fillRect(14, hy - 6 + i * 3.4, 2.4, 2.2); }
    c.restore();
  }

  // ---- 兜鍪 / 毡笠 / 发髻
  if (armor && !dashed) {   // 兜鍪（禁军）
    Z.lined(c, [[-22, hy - 26], [-18, hy - 52], [0, hy - 60], [18, hy - 52], [22, hy - 26]], { w: 3, tone: tone * 0.95, seed: 86, hatch: 0.22, gap: 5, hatchAng: -1.4 });
    Z.wire(c, [[0, hy - 60], [0, hy - 78], [3, hy - 70]], { w: 2.6, tone: tone * 0.9, seed: 87, taper: 0.2 });   // 缨
    c.save(); c.fillStyle = 'rgba(183,51,46,.8)'; c.beginPath(); c.arc(2, hy - 74, 3.4, 0, 7); c.fill(); c.restore();
  } else if (cloak || gourd) {   // 毡笠（雪夜）
    Z.lined(c, [[-30, hy - 24], [-16, hy - 44], [16, hy - 44], [30, hy - 24]], { w: 3.2, tone: tone * 0.95, seed: 88, hatch: 0.24, gap: 5 });
    Z.wire(c, [[-26, hy - 26], [26, hy - 26]], { w: 2.4, tone: tone * 0.8, seed: 89 });
  } else {   // 囚徒：散发 + 束巾
    Z.wire(c, [[-20, hy - 26], [-14, hy - 46], [14, hy - 46], [20, hy - 26]], { w: 3, tone: tone * 0.9, seed: 90 });
    Z.wire(c, [[-18, hy - 32], [18, hy - 32]], { w: 2.2, tone: tone * 0.7, seed: 91 });
  }
  c.restore();   // 头部 scale 结束

// ---- 枷（刺配：最重的一件道具，形制必须准：横板两片合颈，绳系于项）
  if (cangue) {
    const gw = 78, gh = 46;
    Z.lined(c, [[-gw / 2, -8], [gw / 2, -8], [gw / 2, gh - 8], [-gw / 2, gh - 8]], { w: 3, tone: tone * 0.9, seed: 92, hatch: 0.2, gap: 7, hatchAng: 0.5 });
    Z.wire(c, [[-44, ly - 150], [44, ly - 150]], { w: 2.4, tone: tone * 0.7, seed: 93 });   // 系绳
    c.save(); c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '20px "LXGWWenKai-500"'; c.textAlign = 'center';
    c.fillText('沧', -18, 22); c.fillText('州', 18, 22); c.restore();
  }

  // ---- 酒葫芦（草料场：全片唯一的暖意）
  if (gourd) {
    c.save(); c.translate(44, ly - 40);
    Z.lined(c, [[0, 0], [-13, 14], [-11, 34], [0, 46], [11, 34], [13, 14]], { w: 2.6, tone: tone * 0.9, seed: 94, hatch: 0.16, gap: 6 });
    Z.wire(c, [[0, 0], [0, -8], [5, -4]], { w: 2, tone: tone * 0.8, seed: 95 });
    c.restore();
  }

  // ---- 花枪（本片的签字兵器：杆 + 刃 + 朱缨）
  if (spear) {
    const gr = lerp(-0.35, -1.05, raise) + Math.sin(t * 1.3) * 0.02;
    c.save(); c.translate(64, handY - raise * 34); c.rotate(gr);
    Z.wire(c, [[0, 96], [0, -190]], { w: 3.6, tone: tone * 0.95, seed: 96, taper: 0.04 });   // 杆
    Z.lined(c, [[0, -190], [-9, -166], [0, -142], [9, -166]], { w: 2.6, tone, seed: 97 });    // 刃
    Z.wire(c, [[0, -166], [0, -196]], { w: 1.4, tone: tone * 0.6, seed: 98 });               // 脊
    c.save(); c.translate(0, -178);                                                          // 缨（朱砂）
    for (let i = 0; i < 7; i++) {
      Z.wire(c, [[0, 0], [Math.sin(t * 2.4 + i) * 9 - 12, 16 + i * 2]], { w: 2, tone: 0.75, col: Z.CINNABAR, seed: 200 + i });
    }
    c.restore();
    c.restore();
  }

  if (hurt) {   // 血迹：仅极少量朱砂，点到为止，血腥场不作直绘
    c.save(); c.fillStyle = 'rgba(183,51,46,.5)';
    for (let i = 0; i < 5; i++) c.fillRect(-20 + i * 9, ly - 96 + i * 4, 3, 3);
    c.restore();
  }
  c.restore();
};

// ============================== 小件 ==============================
// 官差（董超薛霸）：黑衣 + 朴刀 + 尖帽
Z.guard = (c, x, y, s, t, o = {}) => {
  const { flip = 0, tone = 0.85, drag = 0, seed = 1 } = o;
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  Z.lined(c, [[-26, -140], [-34, -60], [-36, 0], [34, 0], [32, -60], [26, -140]], { w: 3, tone, seed: 110 + seed, hatch: 0.2, gap: 8 });
  Z.wire(c, [[-16, -186], [-12, -210], [12, -210], [16, -186]], { w: 2.6, tone: tone * 0.9, seed: 111 + seed });   // 尖帽
  Z.wire(c, [[-18, -176], [-13, -190], [0, -196], [13, -190], [18, -176]], { w: 2.6, tone, seed: 112 + seed });     // 脸
  Z.wire(c, [[-8, -184], [-3, -183]], { w: 1.8, tone: tone * 0.9, seed: 113 + seed });
  Z.wire(c, [[3, -183], [8, -184]], { w: 1.8, tone: tone * 0.9, seed: 114 + seed });
  Z.wire(c, [[26, -130], [44, -80], [46, -30]], { w: 2.8, tone, seed: 115 + seed });                               // 持刀臂
  Z.wire(c, [[46, -30], [52, -96]], { w: 3, tone: tone * 0.9, seed: 116 + seed });                                 // 朴刀
  if (drag) Z.wire(c, [[-26, -110], [-60, -40], [-70, -6]], { w: 2.6, tone, seed: 117 + seed });                   // 拖拉动作
  c.restore();
};

// 草料场的垛（草堆）：一堆短线的集合
Z.stack = (c, x, y, s, { seed = 1, tone = 0.6, fire = 0 } = {}) => {
  const r = rng(seed);
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < 46; i++) {
    const u = r() * 2 - 1, v = r();
    const bx = u * 66 * (1 - v * 0.4), by = -v * 54;
    Z.wire(c, [[bx, by], [bx + (r() - .5) * 16, by - 14 - r() * 12]], { w: 1.4, tone: tone * (0.6 + r() * 0.4), seed: 300 + i });
  }
  Z.wire(c, [[-70, 0], [-40, -18], [0, -26], [40, -18], [70, 0]], { w: 2.4, tone, seed: 301, taper: 0.08 });
  if (fire) { Z.flame(c, 0, -30, 1, performance.now() / 1000, { seed: 302, tone: 0.7 }); }
  c.restore();
};

// 庙门（山神庙）：两扇门 + 门钉 + 匾
Z.templeDoor = (c, x, y, s, { open = 0, tone = 0.85, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const sg of [-1, 1]) {
    c.save(); c.translate(sg * 74, 0); c.rotate(sg * open * 0.55);
    Z.wire(c, [[0, 0], [sg * -70, 0], [sg * -70, -178], [0, -178], [0, 0]], { w: 3, tone, seed: 320 + sg, taper: 0.04 });
    Z.hatchBox(c, [[0, 0], [sg * -70, 0], [sg * -70, -178], [0, -178]], { ang: 0, gap: 13, tone: 0.14, seed: 330 + sg });
    const r = rng(340 + sg);
    for (let i = 0; i < 8; i++) { c.fillStyle = 'rgba(26,26,28,.6)'; c.beginPath(); c.arc(sg * (-14 - (i % 3) * 20), -30 - Math.floor(i / 3) * 40, 2.6, 0, 7); c.fill(); }
    c.restore();
  }
  Z.labelBox(c, -66, -214, 132, 30, { tone: tone * 0.9, seed: 350 });
  c.save(); c.fillStyle = 'rgba(26,26,28,.85)'; c.font = '22px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('山神庙', 0, -199); c.restore();
  c.restore();
};

// 营房（军寨）：直墙 + 瓦顶 + 门洞，规矩方正
Z.barrack = (c, x, y, s, { tone = 0.8, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-150, 0], [-150, -120], [150, -120], [150, 0]], { w: 3.2, tone, seed: 360 + seed, taper: 0.04 });
  Z.roof(c, 0, -120, 340, 76, { tone: tone * 0.95, seed: 370 + seed });
  Z.wire(c, [[-70, 0], [-70, -76], [70, -76], [70, 0]], { w: 2.6, tone: tone * 0.8, seed: 380 + seed });   // 门
  Z.hatchBox(c, [[-150, 0], [150, 0], [150, -120], [-150, -120]], { ang: -1.4, gap: 18, tone: 0.12, seed: 390 + seed });
  c.restore();
};

// 城门 / 军寨大门（东京城规制：直墙 + 瓦顶 + 门洞，版画的直角必须准）
Z.gate = (c, x, y, s, { tone = 0.82, seed = 1, text = '' } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-190, 0], [-190, -210], [-130, -210], [-130, -120], [130, -120], [130, -210], [190, -210], [190, 0]], { w: 3.2, tone, seed: 400 + seed, taper: 0.04 });
  Z.roof(c, 0, -210, 420, 84, { tone: tone * 0.95, seed: 410 + seed });
  Z.wire(c, [[-130, 0], [-130, -120], [130, -120], [130, 0]], { w: 3, tone: tone * 0.85, seed: 420 + seed });
  Z.hatchBox(c, [[-130, 0], [130, 0], [130, -120], [-130, -120]], { ang: 0, gap: 15, tone: 0.16, seed: 430 + seed });
  if (text) { Z.labelBox(c, -58, -306, 116, 30, { tone: tone * 0.9, seed: 440 }); c.save(); c.fillStyle = 'rgba(26,26,28,.85)'; c.font = '22px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 0, -291); c.restore(); }
  c.restore();
};

// 白虎节堂：制度之威在这一幕里就是一个门框，人走进去，框便合了
Z.hall = (c, x, y, s, { tone = 0.85, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-240, 0], [-240, -260], [240, -260], [240, 0]], { w: 3.4, tone, seed: 450 + seed, taper: 0.04 });
  Z.roof(c, 0, -260, 560, 96, { tone, seed: 460 + seed });
  Z.wire(c, [[-120, 0], [-120, -180], [120, -180], [120, 0]], { w: 3, tone: tone * 0.85, seed: 470 + seed });   // 门洞
  Z.hatchBox(c, [[-240, 0], [240, 0], [240, -260], [-240, -260]], { ang: -1.4, gap: 20, tone: 0.1, seed: 480 + seed });
  for (const sg of [-1, 1]) Z.wire(c, [[sg * 268, 0], [sg * 268, -270]], { w: 4, tone: tone * 0.9, seed: 490 + sg });   // 柱
  c.restore();
};

// 山道：一条上下起伏的路差不多了，版画的路要疏
Z.road = (c, y0, { seed = 1, tone = 0.5 } = {}) => {
  const pts = [], pts2 = [];
  for (let x = -20; x <= W + 20; x += 30) {
    const yy = y0 + Math.sin(x * 0.0026 + seed) * 34;
    pts.push([x, yy]); pts2.push([x, yy + 26 + Math.sin(x * 0.004 + seed) * 8]);
  }
  Z.wire(c, pts, { w: 2.4, tone, seed: 510 + seed, taper: 0.05 });
  Z.wire(c, pts2, { w: 2, tone: tone * 0.7, seed: 520 + seed, taper: 0.05 });
};

// ============================== 八幕 ==============================
const Dur = (id, dur, transitions) => ({ id, dur, ...(transitions ? { transitions } : {}) });

// ① 东京：禁军教头（枪棒在手上，袍也不必太重，这一幕要亮）
SCENES['lc1_jiaotou'] = (() => {
  const p = () => Z.paper('lc1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const rev = clamp(ss(0.15, 1.1, lt));
    Z.cloud(c, t, { x: 380, y: 210, s: 0.9, seed: 2, tone: 0.4 });
    Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 120, tone: 0.5, seed: 31 }]);
    Z.barrack(c, 1560, 700, 1.0, { seed: 3 });
    Z.flag(c, 1680, 560, 110, t, { text: "禁", seed: 21, size: 26 });
    Z.ground(c, 900, { seed: 11, tone: 0.4 });
    // 操演（母题：三名学员挥棒）
    for (let i = 0; i < 3; i++) {
      const bx = 430 + i * 180, ph = i * 1.1;
      Z.linchong(c, bx, 884, 0.55, t + ph, { armor: 0, dashed: 0, raise: clamp(Math.sin(t * 2.6 + ph) * 0.55 + 0.5) });
    }
    const rk = clamp(ss(0.25, 1.6, lt) * 0.9);
    const wk = clamp(ss(1.15, 3.0, lt));
    if (wk > 0 && wk < 1) Z.linchong(c, lerp(1850, 40, wk), 946, 0.78, t, { armor: 0, spear: 1, raise: 0.4, flip: 1, tone: 0.78 });
    Z.linchong(c, 1020, 900, 1.34, t, { raise: rk + Math.sin(t * 2.2) * 0.11 * rk, spear: 1, armor: 1, flip: 0, firm: clamp(ss(0.8, 1.6, lt)) });
    Z.bigText(c, '八十万禁军枪棒教头', { x: 1760, y: 120, size: 46, tone: 0.86, appear: rev });
    Z.seal(c, 120, 900, '林冲', clamp(ss(1.4, 2.2, lt)));
  } };
})();

// ② 白虎节堂：被计，全片唯一一幕他自己完全没有主动过一步
SCENES['lc2_baihu'] = (() => {
  const p = () => Z.paper('lc2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const walk = clamp(ss(0.4, 2.2, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 2.8)) };   // 慢推镜：压迫感 + 幕尾不静
    CAM.with(c, cam, (c) => {
    Z.hall(c, 960, 900, 1.15, { seed: 5 });
    Z.ground(c, 900, { seed: 12, tone: 0.36 });
    Z.linchong(c, lerp(360, 880, walk), 880, 1.22, t, { armor: 1, spear: 1, back: lerp(0, 1, ss(1.7, 2.78, lt)), raise: 0.15 });
    // 高俅：不以人形出现，只作一小团高位的墨影，人在暗处才可怕
    const gq = clamp(ss(1.3, 2.2, lt));
    c.save(); c.globalAlpha = gq;
    Z.linchong(c, 1340, 862, 0.72, t, { armor: 0, flip: 1, raise: 0.1, tone: 0.62 });
    c.restore();
    });   // CAM 结束
    Z.bigText(c, '误入白虎节堂', { x: 1720, y: 110, size: 44, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
    Z.flame(c, 1560, 620, 0.7, t, { seed: 9, tone: 0.55 });
    Z.flame(c, 480, 640, 0.5, t, { seed: 10, tone: 0.45 });
  } };
})();

// ③ 刺配沧州：牢城营道上，风雪初起
SCENES['lc3_ciPei'] = (() => {
  const p = () => Z.paper('lc3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const step = clamp(ss(0.3, 2.9, lt));
    Z.mountains(c, c, -80, 2000, [{ y0: 500, amp: 150, tone: 0.45, seed: 41 }, { y0: 610, amp: 90, tone: 0.3, seed: 42 }]);
    Z.road(c, 860, { seed: 21, tone: 0.5 });
    Z.pine(c, t, { x: 1650, y: 900, s: 1.2, seed: 6, tone: 0.7 });
    const x0 = lerp(300, 900, step);
    Z.guard(c, x0 - 175, 884, 0.92, t, { seed: 1 });
    Z.guard(c, x0 + 175, 884, 0.92, t, { seed: 2, flip: 1, drag: 1 });
    Z.linchong(c, x0, 884, 1.26, t, { dashed: 1, cangue: 1, brand: 1, hurt: 0, raise: 0.05 });
    Z.bigText(c, '刺配沧州道', { x: 1740, y: 110, size: 44, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
    Z.snow(c, t, { n: 60, seed: 33, tone: 0.75 });
  } };
})();

// ④ 野猪林：鲁智深一禅杖
SCENES['lc4_yezhulin'] = (() => {
  const p = () => Z.paper('lc4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const bind = clamp(ss(0.3, 1.5, lt));          // 绑在树上
    const save = clamp(ss(1.6, 2.5, lt));
    Z.mountains(c, c, -60, 1980, [{ y0: 480, amp: 160, tone: 0.4, seed: 51 }]);
    Z.ground(c, 900, { seed: 31, tone: 0.4 });
    for (let i = 0; i < 3; i++) Z.pine(c, t, { x: [210, 640, 1660][i], y: 906, s: [1.7, 2.0, 1.9][i], seed: 10 + i, tone: 0.75 });
    Z.linchong(c, 1180, 884, 1.26, t, { dashed: 1, brand: 1, raise: bind, hurt: bind * 0.5 });
    Z.guard(c, 990, 876, 0.88, t, { seed: 3, drag: 1 });
    // 鲁智深：禅杖一击（此时尚在林冲片中，只作重轮廓加禅杖的示意，留一层）
    if (save > 0) {
      c.save(); c.globalAlpha = save;
      Z.linchong(c, lerp(1560, 1420, save), 872, 1.22, t, { armor: 0, raise: 0.5, flip: 1, tone: 0.95 });
      Z.wire(c, [[1420, 860], [1440, 300]], { w: 6, tone: 0.9, seed: 61, taper: 0.06 });   // 禅杖
      Z.wire(c, [[1408, 320], [1472, 320], [1472, 268], [1408, 268]], { w: 3.4, tone: 0.9, seed: 62 });
      c.restore();
    }
    Z.bigText(c, '野猪林遇救', { x: 1740, y: 110, size: 44, tone: 0.86, appear: clamp(ss(1.9, 2.6, lt)) });
  } };
})();

// ⑤ 草料场：大雪 + 酒葫芦（全片最冷也最暖的一幕）
SCENES['lc5_caoliaochang'] = (() => {
  const p = () => Z.paper('lc5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const rev = clamp(ss(0.2, 1.0, lt));
    Z.mountains(c, c, -60, 1980, [{ y0: 470, amp: 140, tone: 0.4, seed: 61 }]);
    Z.ground(c, 890, { seed: 41, tone: 0.34 });
    Z.barrack(c, 1450, 760, 0.9, { seed: 7 });
    Z.stack(c, 480, 880, 1.15, { seed: 4, tone: 0.55 });
    Z.linchong(c, 900, 884, 1.3, t, { cloak: 1, gourd: 1, armor: 0, dashed: 0, brand: 1, raise: 0.2 });
    Z.snow(c, t, { n: 150, seed: 55, speed: 1.3, tone: 0.9 });
    Z.bigText(c, '草料场大雪', { x: 1740, y: 110, size: 44, tone: 0.86, appear: rev });
  } };
})();

// ⑥ 山神庙：草厅被雪压塌，只得来此借宿，反倒留了性命
SCENES['lc6_shanshenmiao'] = (() => {
  const p = () => Z.paper('lc6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const fire = clamp(ss(1.6, 2.8, lt));          // 远处草料场起火
    Z.mountains(c, c, -60, 1980, [{ y0: 460, amp: 150, tone: 0.38, seed: 71 }]);
    Z.ground(c, 900, { seed: 51, tone: 0.32 });
    Z.templeDoor(c, 960, 890, 1.3, { open: 0.12 + Math.sin(t * 1.8) * 0.07, tone: 0.85, seed: 8 });
    Z.linchong(c, 680, 884, 1.28, t, { cloak: 1, gourd: 1, brand: 1, raise: 0.3, firm: clamp(ss(1.4, 2.2, lt)) });
    if (fire > 0) { c.save(); c.globalAlpha = fire; Z.stack(c, 1600, 840, 0.9, { seed: 9, tone: 0.5, fire: 1 }); c.restore(); }
    Z.snow(c, t, { n: 170, seed: 66, speed: 1.5, tone: 0.92 });
    Z.bigText(c, '风雪山神庙', { x: 1740, y: 110, size: 44, tone: 0.86, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑦ 手刃三人：忍到尽头之后的一击，暴烈只作结果、不作直绘
SCENES['lc7_sharen'] = (() => {
  const p = () => Z.paper('lc7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const listen = clamp(ss(0.2, 1.2, lt));
    const burst = clamp(ss(1.4, 2.78, lt));
    const done = clamp(ss(2.2, 2.8, lt));
    Z.ground(c, 900, { seed: 61, tone: 0.32 });
    Z.templeDoor(c, 620, 890, 1.25, { open: 0.5, tone: 0.8, seed: 12 });
    // 三四个同谋的人影（听到他们对话时轮廓才渐次确定）
    for (let i = 0; i < 3; i++) {
      c.save(); c.globalAlpha = listen * (1 - done * 0.85);
      Z.guard(c, 1180 + i * 130, 866, 0.62, t, { seed: 20 + i, flip: i % 2 });
      c.restore();
    }
    Z.linchong(c, lerp(880, 1120, burst), 884, 1.36, t, { cloak: 1, spear: 1, brand: 1, raise: lerp(0.4, 1, burst), firm: burst, hurt: done });
    c.save(); c.globalAlpha = 0.5 * burst; c.fillStyle = 'rgba(183,51,46,.5)';
    for (let i = 0; i < 8; i++) c.fillRect(1140 + i * 22, 780 + (i % 3) * 14, 4, 4);
    c.restore();
    Z.snow(c, t, { n: 130, seed: 77, speed: 1.4, tone: 0.85 });
    Z.bigText(c, '是可忍孰不可忍', { x: 1740, y: 110, size: 44, tone: 0.9, appear: clamp(ss(1.5, 2.4, lt)) });
  } };
})();

// ⑧ 雪夜上梁山：从此再无回头路
SCENES['lc8_liangshan'] = (() => {
  const p = () => Z.paper('lc8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const go = clamp(ss(0.4, 2.6, lt));
    Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 220, tone: 0.5, seed: 81 }, { y0: 660, amp: 130, tone: 0.35, seed: 82 }]);
    Z.ground(c, 900, { seed: 71, tone: 0.3 });
    Z.cloud(c, t, { x: 620, y: 220, s: 1.1, seed: 13, tone: 0.42 });
    // 水泊：波纹用平行（版画的水就是排线）
    for (let i = 0; i < 5; i++) {
      const yy = 950 + i * 26;
      Z.wire(c, [[-20, yy], [W + 20, yy]], { w: 1.4, tone: 0.2 + i * 0.02, seed: 700 + i, taper: 0.2 });
    }
    Z.flag(c, 1560, 640, 150, t, { text: '替天行道', seed: 15, size: 30 });
    Z.linchong(c, lerp(300, 780, go), 884, 1.42, t, { cloak: 1, spear: 1, brand: 1, gourd: 0, raise: 0.5, flip: 0, firm: 1 });
    Z.snow(c, t, { n: 190, seed: 88, speed: 1.6, tone: 0.95 });
    Z.bigText(c, '雪夜上梁山', { x: 1740, y: 110, size: 48, tone: 0.92, appear: clamp(ss(0.3, 1.2, lt)) });
    Z.seal(c, 150, 880, '豹子头', clamp(ss(1.6, 2.6, lt)));
  } };
})();
})();
