// 《水浒传·花荣》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：清风寨知寨——「齿白唇红双眼俊，两眉入鬓常清」，一张弓、一条银枪，箭无虚发，绰号「小李广」。
//   特征：① 弓箭（signature 兵器：箭羽朱砂，全片贯穿）② 银枪 ③ 束发冠（俊美，与莽汉对照）。
// 唯一的彩：朱砂只用于① 箭羽（signature，全片箭尾一味朱砂）② 第八幕「小李广」钤印——余皆黑白灰。
// 母题：① 弓 ② 箭羽朱砂 ③ 银枪 ④ 束发冠。
// 弧光：清风寨知寨 → 梁山射雁 → 三箭连中 → 祝家庄射灯 → 江州劫法场 → 破辽射将
//       → 征方腊 → 宋江死后与吴用同缢于蓼儿洼。
// 依《水浒传》第三十三、三十五、四十、四十八、八十七、百回本末回。
// 互文：第五幕复用宋江（劫法场）、第八幕复用吴用（同缢蓼儿洼）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 弓（signature：长弓——弓身弧 + 弓弦 + 搭箭；draw=0 松弛，draw=1 满弦）
Z.bow = (c, x, y, s, { tone = 0.9, seed = 1, draw = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.18);
  const pull = lerp(0, 26, draw);
  // 弓身（上下的弧）
  Z.wire(c, [[-6, -150], [-24, -70], [-26, 0], [-18, 70], [-6, 150]], { w: 4.2, tone, seed, taper: 0.08 });
  // 弓弦（满弦时拉开）
  Z.wire(c, [[-6, -150], [-pull * 0.4, 0], [-6, 150]], { w: 1.8, tone: tone * 0.8, seed: seed + 1 });
  // 搭箭（箭杆 + 朱砂箭羽）
  if (draw > 0.05) {
    Z.wire(c, [[-pull * 0.4, 0], [96, 0]], { w: 2.6, tone: tone * 0.95, seed: seed + 2, taper: 0.1 });
    Z.wire(c, [[96, 0], [110, -6], [104, 6]], { w: 2.4, tone, seed: seed + 3 });
    c.save(); c.globalAlpha = 0.62 + 0.3 * draw; c.fillStyle = 'rgba(183,51,46,.8)';  // 朱砂箭羽
    c.fillRect(-pull * 0.4 + 4, -8, 20, 5); c.fillRect(-pull * 0.4 + 8, 4, 16, 5);
    c.restore();
  }
  c.restore();
};

// 箭羽朱砂（飞在空中的箭：杆 + 箭头 + 朱砂羽）
Z.arrowFly = (c, x, y, ang, len, { tone = 0.92, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.rotate(ang);
  Z.wire(c, [[-len, 0], [0, 0]], { w: 2.6, tone, seed, taper: 0.1 });
  Z.wire(c, [[0, 0], [16, -6], [10, 6]], { w: 2.6, tone, seed: seed + 1 });
  c.save(); c.fillStyle = 'rgba(183,51,46,.8)';
  c.fillRect(-len + 2, -8, 20, 5); c.fillRect(-len + 6, 4, 16, 5);
  c.restore();
  c.restore();
};

// 靶（三箭连中：圆靶 + 已中的两支箭）
Z.target = (c, x, y, s, { tone = 0.82, seed = 1, hits = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < 3; i++) {
    c.beginPath(); c.arc(0, 0, 62 - i * 20, 0, 7);
    c.strokeStyle = `rgba(26,26,28,${(0.8 - i * 0.16) * tone})`; c.lineWidth = 2.4; c.stroke();
  }
  for (let i = 0; i < hits; i++) {
    const ax = -34 + i * 34;
    Z.wire(c, [[ax, -96], [ax, 6]], { w: 2.4, tone, seed: seed + 10 + i, taper: 0.1 });
    c.save(); c.fillStyle = 'rgba(183,51,46,.8)'; c.fillRect(ax - 9, -92, 18, 5); c.restore();
  }
  c.restore();
};

// 雁（简笔：身 + 双翼 + 颈）
Z.goose = (c, x, y, s, t, { tone = 0.8, seed = 1, flap = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const w = Math.sin(t * 3.2 + seed) * 12 * flap;
  Z.lined(c, [[-40, 0], [-14, -12], [22, -8], [40, 6], [16, 14], [-20, 12]], { w: 2.4, tone, seed, hatch: 0.1 });
  Z.wire(c, [[-40, -2], [-64, -14], [-70, -4], [-52, 8]], { w: 2, tone: tone * 0.9, seed: seed + 1 });   // 颈头
  Z.wire(c, [[-10, -6], [-4, -30 - w], [16, -26 - w]], { w: 2.2, tone, seed: seed + 2, taper: 0.3 });     // 上翼
  Z.wire(c, [[6, 8], [14, 32 + w * 0.6], [34, 26 + w * 0.6]], { w: 2.2, tone: tone * 0.85, seed: seed + 3, taper: 0.3 });
  c.restore();
};

// ============================== 花荣本体 ==============================
// o: { bow弓, spear银枪, crown束发冠, flip, draw拉弓, raise, kneel, ride, tone }
Z.huarong = (c, x, y, s, t, o = {}) => {
  const {
    bow = 1, spear = 0, crown = 1, flip = 0, draw = 0, raise = 0,
    kneel = 0, ride = 0, tone = 0.88,
  } = o;
  const br = Math.sin(t * 1.4) * 2.2;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 46 : 0);
  const shoulderY = ly - 152;
  const waistY = ly - 76;
  const hipY = ly - 26;

  // ---- 腿（战靴）----
  if (ride) {
    Z.wire(c, [[-28, hipY], [-46, hipY + 34], [-58, hipY + 60]], { w: 3.4, tone, seed: 60, taper: 0.1 });
    Z.wire(c, [[28, hipY], [46, hipY + 34], [58, hipY + 60]], { w: 3.4, tone, seed: 61, taper: 0.1 });
  } else {
    Z.wire(c, [[-28, hipY], [-36, hipY + 44], [-32, ly]], { w: 3.4, tone, seed: 62, taper: 0.1 });
    Z.wire(c, [[28, hipY], [36, hipY + 44], [32, ly]], { w: 3.4, tone, seed: 63, taper: 0.1 });
    Z.lined(c, [[-32, ly], [-50, ly - 4], [-52, ly + 13], [-30, ly + 10]], { w: 2.5, tone: tone * 0.85, seed: 64 });
    Z.lined(c, [[32, ly], [50, ly - 4], [52, ly + 13], [30, ly + 10]], { w: 2.5, tone: tone * 0.85, seed: 65 });
  }

  // ---- 躯干（白袍银甲：淡墨，俊美）----
  const body = [[-50, shoulderY + 6], [-56, waistY + 4], [-48, hipY], [48, hipY], [56, waistY + 4], [50, shoulderY + 6]];
  Z.lined(c, body, { w: 3.2, tone, seed: 71, hatch: 0.14, gap: 10, hatchAng: -0.9 });
  c.save(); c.fillStyle = 'rgba(232,230,222,.5)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  // 甲片（胸前横列）
  for (let i = 0; i < 3; i++) {
    Z.wire(c, [[-40, shoulderY + 34 + i * 20], [40, shoulderY + 34 + i * 20]], { w: 1.8, tone: tone * 0.6, seed: 72 + i });
  }
  // 束带
  Z.wire(c, [[-54, waistY + 2], [54, waistY + 2], [54, waistY + 18], [-54, waistY + 18], [-54, waistY + 2]], { w: 3, tone, seed: 76, taper: 0.06 });

  // ---- 双臂（左持弓，右拉弦）----
  const handY = shoulderY + 50 - draw * 12;
  Z.wire(c, [[-50, shoulderY + 12], [-80, shoulderY + 34], [-72, handY + 6]], { w: 3.2, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[50, shoulderY + 12], [76 + draw * 14, shoulderY + 30 - draw * 20], [64 + draw * 26, handY - 8 - draw * 16]], { w: 3.2, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[-72, handY + 4], [-60, handY + 20], [-50, handY + 6], [-60, handY - 10]], { w: 2.2, tone: tone * 0.8, seed: 82 });
  Z.lined(c, [[64 + draw * 26, handY - 8 - draw * 16], [52 + draw * 26, handY + 6 - draw * 16], [42 + draw * 26, handY - 10 - draw * 16]], { w: 2.2, tone: tone * 0.8, seed: 83 });

  // ---- 头（俊美：清秀，眉入鬓）----
  const hy = shoulderY - 36 + br * 0.5;
  const face = [[-21, hy - 12], [-18, hy - 36], [0, hy - 47], [18, hy - 36], [21, hy - 12], [19, hy + 12], [0, hy + 25], [-19, hy + 10]];
  Z.lined(c, face, { w: 2.6, tone: tone * 0.95, seed: 100, hatch: 0.05, gap: 9 });
  Z.wire(c, [[-14, hy - 14], [-4, hy - 12]], { w: 2, tone, seed: 101 });      // 眉（入鬓）
  Z.wire(c, [[4, hy - 12], [14, hy - 14]], { w: 2, tone, seed: 102 });
  Z.wire(c, [[-11, hy - 6], [-5, hy - 5]], { w: 1.6, tone, seed: 103 });
  Z.wire(c, [[5, hy - 5], [11, hy - 6]], { w: 1.6, tone, seed: 104 });
  Z.wire(c, [[-6, hy + 4], [6, hy + 3]], { w: 1.5, tone: tone * 0.75, seed: 105 });
  // 束发冠（signature：俊美武将）
  if (crown) {
    Z.wire(c, [[-24, hy - 20], [-20, hy - 44], [20, hy - 44], [24, hy - 20]], { w: 2.6, tone: 0.9, seed: 110 });
    Z.wire(c, [[-20, hy - 44], [-12, hy - 66], [12, hy - 66], [20, hy - 44]], { w: 2.8, tone: 0.9, seed: 111 });
    Z.wire(c, [[-12, hy - 66], [0, hy - 78], [12, hy - 66]], { w: 2.4, tone: 0.88, seed: 112 });
    const rib = Math.sin(t * 2.0) * 0.3;
    Z.wire(c, [[-24, hy - 30], [-52 - rib * 14, hy - 22 + rib * 8]], { w: 1.8, tone: 0.7, seed: 113 });
    Z.wire(c, [[24, hy - 30], [52 + rib * 14, hy - 22 - rib * 8]], { w: 1.8, tone: 0.7, seed: 114 });
  }
  // ---- 手持件（本地坐标，必须在 restore 前画）----
  if (bow) Z.bow(c, -72, handY + 20, 1.0, { tone, draw, seed: 170 });
  if (spear) {
    c.save(); c.translate(64, handY - 10); c.rotate(0.1);
    Z.wire(c, [[0, 150], [0, -250]], { w: 4.2, tone: tone * 0.95, seed: 180, taper: 0.04 });
    Z.wire(c, [[0, -250], [0, -300]], { w: 5, tone, seed: 181, taper: 0.08 });
    Z.wire(c, [[-8, -256], [8, -256]], { w: 2.4, tone: tone * 0.85, seed: 182 });
    c.restore();
  }
  c.restore();
};

// ============================== 八幕 ==============================

// ① 清风寨：知寨花荣，一张弓镇住清风山
SCENES['hr1_qingfeng'] = (() => {
  const p = () => Z.paper('hr1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 420, y: 180, s: 1.0, seed: 4, tone: 0.3 });
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.guan(c, 1480, 760, 0.92, { tone: 0.86, seed: 12, text: '清风寨' });
      Z.flag(c, 640, 600, 160, t, { text: '清风', seed: 13, size: 26 });
      Z.pine(c, t, { x: 330, y: 888, s: 1.0, seed: 14, tone: 0.84 });
      Z.huarong(c, 940, 892, 1.48, t, { bow: 1, crown: 1, draw: clamp(Math.sin(t * 1.2) * 0.25 + 0.2) });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 54 + i * 230) % 1980) - 30, by = 340 + ((t * 40 + i * 150) % 470);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.38, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '清风寨知寨', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 梁山射雁：一箭射中雁行第三只（朱砂：箭羽）
SCENES['hr2_sheyan'] = (() => {
  const p = () => Z.paper('hr2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 2.8)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 21, tone: 0.4 });
      Z.mountains(c, c, -60, 1980, [{ y0: 560, amp: 160, tone: 0.28, seed: 22 }]);
      // 雁阵（三只，斜行）
      for (let i = 0; i < 3; i++) {
        const gx = 1180 + i * 150 + Math.sin(t * 0.9 + i) * 8, gy = 330 + i * 62;
        Z.goose(c, gx, gy, 0.9, t, { tone: 0.8, seed: 30 + i });
      }
      // 花荣（左，张弓）
      const draw = clamp(ss(0.3, 1.2, lt));
      Z.huarong(c, 700, 892, 1.5, t, { bow: 1, draw, crown: 1 });
      // 一箭中的（朱砂箭羽，飞向第三只）
      const k = clamp(ss(1.2, 1.9, lt));
      if (k > 0 && k < 1) {
        const ax = lerp(820, 1420, k), ay = lerp(760, 470, k) - Math.sin(k * 3.1) * 30;
        Z.arrowFly(c, ax, ay, -0.72, 90, { tone: 0.94, seed: 40 });
      }
      if (k >= 1) Z.arrowFly(c, 1460, 452, -0.72, 90, { tone: 0.94, seed: 41 });
      Z.cloud(c, t, { x: 300, y: 190, s: 0.9, seed: 23, tone: 0.28 });
    });
    Z.bigText(c, '梁山射雁', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ③ 三箭连中：靶上三箭，箭箭朱砂羽（朱砂：箭羽）
SCENES['hr3_sanma'] = (() => {
  const p = () => Z.paper('hr3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 31, tone: 0.42 });
      Z.flag(c, 300, 560, 170, t, { text: '演武', seed: 32, size: 26 });
      for (let i = 0; i < 4; i++) Z.fighter(c, 1560 + i * 92, 900, 0.6, t, { flip: 1, seed: 33 + i, tone: 0.5 });
      // 靶（三箭连中）
      const hits = clamp(ss(1.0, 2.6, lt)) > 0.25 ? 1 : 0;
      const hits2 = clamp(ss(1.5, 2.6, lt)) > 0.3 ? 2 : hits;
      const hits3 = clamp(ss(2.0, 2.8, lt)) > 0.35 ? 3 : hits2;
      Z.target(c, 1320, 700, 1.05, { tone: 0.84, seed: 50, hits: hits3 });
      // 花荣（左，连发）
      const draw = clamp(ss(0.2, 0.9, lt)) * (1 - clamp(ss(2.2, 2.8, lt)) * 0.6);
      Z.huarong(c, 680, 892, 1.5, t, { bow: 1, draw, crown: 1 });
      // 飞箭（三连发）
      for (let i = 0; i < 3; i++) {
        const st = 0.7 + i * 0.55, k = clamp(ss(st, st + 0.4, lt));
        if (k <= 0 || k >= 1) continue;
        const ax = lerp(800, 1300, k), ay = 740 - Math.sin(k * 3.1) * 44;
        Z.arrowFly(c, ax, ay, -0.2, 80, { tone: 0.94, seed: 60 + i });
      }
    });
    Z.bigText(c, '三箭连中', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 祝家庄射灯：一箭射灭红灯，敌阵自乱
SCENES['hr4_zhujia'] = (() => {
  const p = () => Z.paper('hr4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 41, tone: 0.42 });
      Z.mountains(c, c, -60, 1980, [{ y0: 570, amp: 150, tone: 0.26, seed: 42 }]);
      // 祝家庄（堡墙 + 敌楼 + 红灯）
      Z.guan(c, 1450, 780, 0.95, { tone: 0.86, seed: 43, text: '祝家庄' });
      const lampOut = clamp(ss(1.6, 2.2, lt));
      c.save(); c.globalAlpha = 1 - lampOut * 0.85;
      Z.lined(c, [[1300, 520], [1370, 520], [1382, 580], [1288, 580]], { w: 3, tone: 0.86, seed: 44, hatch: 0.14 });
      Z.wire(c, [[1335, 520], [1335, 470]], { w: 2, tone: 0.8, seed: 45 });
      c.restore();
      for (let i = 0; i < 3; i++) Z.fighter(c, 1520 + i * 110, 892, 0.72, t, { flip: 1, blade: 1, tone: 0.66, seed: 46 + i });
      // 花荣（左，射灯）
      const draw = clamp(ss(0.3, 1.2, lt));
      Z.huarong(c, 620, 892, 1.5, t, { bow: 1, draw, crown: 1 });
      const k = clamp(ss(1.2, 1.9, lt));
      if (k > 0 && k < 1) {
        const ax = lerp(740, 1290, k), ay = lerp(740, 552, k) - Math.sin(k * 3.1) * 40;
        Z.arrowFly(c, ax, ay, -0.32, 84, { tone: 0.94, seed: 70 });
      }
      // 敌阵自乱（动势线）
      if (lampOut > 0.3) {
        for (let i = 0; i < 8; i++) {
          const dx = 1500 + ((t * 130 + i * 150) % 380), dy = 700 + (i % 3) * 60;
          Z.wire(c, [[dx, dy], [dx + 26, dy - 10]], { w: 2, tone: 0.45, seed: 1930 + i, taper: 0.8 });
        }
      }
    });
    Z.bigText(c, '祝家庄射灯', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 江州劫法场：随晁盖下山，救出宋江（复用宋江，朱砂：箭羽）
SCENES['hr5_fachang'] = (() => {
  const p = () => Z.paper('hr5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 81, tone: 0.42 });
      Z.cloud(c, t, { x: 1540, y: 180, s: 1.1, seed: 82, tone: 0.32 });
      // 法场桩
      Z.wire(c, [[900, 892], [900, 700]], { w: 4.4, tone: 0.9, seed: 83, taper: 0.06 });
      Z.wire(c, [[840, 720], [960, 720]], { w: 3.6, tone: 0.88, seed: 84 });
      Z.songjiang(c, 900, 892, 1.4, t, { official: 0, cangue: 1, hurt: 0.2, tone: 0.84 });
      for (let i = 0; i < 4; i++) Z.fighter(c, 330 + i * 130, 900, 0.64, t, { seed: 85 + i, tone: 0.5 });
      // 花荣（右，掩护放箭）
      const draw = clamp(ss(0.2, 1.1, lt));
      Z.huarong(c, 1380, 892, 1.48, t, { bow: 1, draw, crown: 1 });
      for (let i = 0; i < 2; i++) {
        const st = 1.0 + i * 0.5, k = clamp(ss(st, st + 0.4, lt));
        if (k <= 0 || k >= 1) continue;
        const ax = lerp(1300, 700, k), ay = 720 - Math.sin(k * 3.1) * 46;
        Z.arrowFly(c, ax, ay, Math.PI + 0.28, 84, { tone: 0.94, seed: 90 + i });
      }
    });
    Z.bigText(c, '江州劫法场', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 破辽射将：一箭射落辽邦大将（朱砂：箭羽）
SCENES['hr6_po'] = (() => {
  const p = () => Z.paper('hr6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 101, tone: 0.44 });
      Z.mountains(c, c, -60, 1980, [{ y0: 550, amp: 170, tone: 0.3, seed: 102 }]);
      Z.tent(c, 320, 800, 0.95, { tone: 0.76, seed: 103, text: '' });
      Z.flag(c, 1620, 500, 200, t, { text: '遼', seed: 104, size: 34 });
      // 辽将（右）
      Z.fighter(c, 1420, 892, 1.12, t, { flip: 1, helmet: 1, spear: 1, tone: 0.82, seed: 110 });
      Z.fighter(c, 1180, 892, 0.98, t, { flip: 1, blade: 1, tone: 0.76, seed: 111 });
      // 花荣（左，张弓）
      const draw = clamp(ss(0.3, 1.2, lt));
      Z.huarong(c, 620, 892, 1.5, t, { bow: 1, draw, crown: 1 });
      const k = clamp(ss(1.2, 1.9, lt));
      if (k > 0 && k < 1) {
        const ax = lerp(740, 1340, k), ay = 720 - Math.sin(k * 3.1) * 46;
        Z.arrowFly(c, ax, ay, -0.18, 88, { tone: 0.94, seed: 120 });
      }
      // 战尘
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 110 + i * 165) % 1500) + 280, dy = 810 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1940 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '破辽射将', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑦ 征方腊：江南苦战，箭无虚发
SCENES['hr7_fangla'] = (() => {
  const p = () => Z.paper('hr7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 200, tone: 0.32, seed: 141 }, { y0: 660, amp: 110, tone: 0.22, seed: 142 }]);
      Z.ground(c, 900, { seed: 143, tone: 0.44 });
      Z.flag(c, 1580, 500, 200, t, { text: '宋', seed: 144, size: 32 });
      Z.pine(c, t, { x: 340, y: 890, s: 1.0, seed: 145, tone: 0.82 });
      // 敌阵
      for (let i = 0; i < 3; i++) Z.fighter(c, 1400 + i * 128, 892, 0.92, t, { flip: 1, blade: 1, tone: 0.7, seed: 150 + i });
      // 花荣（左，连射）
      const draw = clamp(ss(0.2, 0.9, lt)) * (1 - clamp(ss(2.0, 2.7, lt)) * 0.5);
      Z.huarong(c, 640, 892, 1.5, t, { bow: 1, draw, crown: 1 });
      for (let i = 0; i < 3; i++) {
        const st = 0.9 + i * 0.6, k = clamp(ss(st, st + 0.4, lt));
        if (k <= 0 || k >= 1) continue;
        const ax = lerp(760, 1380, k), ay = 730 - Math.sin(k * 3.1) * 48;
        Z.arrowFly(c, ax, ay, -0.16, 84, { tone: 0.94, seed: 160 + i });
      }
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 100 + i * 170) % 1400) + 320, dy = 800 + ((t * 40 + i * 95) % 120);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 5]], { w: 1.9, tone: 0.36, seed: 1950 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '征方腊', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑧ 蓼儿洼自缢：与吴用同缢于宋江墓前（复用吴用，朱砂：钤印）
SCENES['hr8_zijin'] = (() => {
  const p = () => Z.paper('hr8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 210, tone: 0.32, seed: 181 }, { y0: 660, amp: 120, tone: 0.22, seed: 182 }]);
      Z.cloud(c, t, { x: 1480, y: 180, s: 1.2, seed: 183, tone: 0.3 });
      Z.ground(c, 900, { seed: 184, tone: 0.4 });
      Z.pine(c, t, { x: 360, y: 890, s: 1.05, seed: 185, tone: 0.84 });
      // 宋江墓（碑 + 坟丘）
      Z.lined(c, [[820, 892], [1120, 892], [1080, 800], [860, 800]], { w: 3.2, tone: 0.82, seed: 186, hatch: 0.1 });
      Z.wire(c, [[960, 800], [960, 620]], { w: 5, tone: 0.9, seed: 187, taper: 0.06 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '34px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('宋公明之墓', 960, 700); c.restore();
      // 树上双吊影（吴用 + 花荣 自缢）
      const hang = (hx, hy2, flip2) => {
        c.save(); c.translate(hx, hy2); c.scale(flip2 ? -1 : 1, 1);
        Z.wire(c, [[0, -300], [0, -150]], { w: 3.4, tone: 0.86, seed: 190, taper: 0.08 });
        Z.wire(c, [[-40, 300], [40, 300], [30, 120], [-30, 120]], { w: 3.2, tone: 0.82, seed: 191, hatch: 0.12 });
        c.beginPath(); c.arc(0, 88, 22, 0, 7); c.strokeStyle = 'rgba(26,26,28,.82)'; c.lineWidth = 2.6; c.stroke();
        Z.wire(c, [[-30, 120], [-46, 210]], { w: 2.8, tone: 0.8, seed: 192 });
        Z.wire(c, [[30, 120], [46, 210]], { w: 2.8, tone: 0.8, seed: 193 });
        Z.wire(c, [[-24, 300], [-30, 380]], { w: 2.8, tone: 0.8, seed: 194 });
        Z.wire(c, [[24, 300], [30, 380]], { w: 2.8, tone: 0.8, seed: 195 });
        c.restore();
      };
      const k = clamp(ss(1.0, 2.4, lt));
      Z.wire(c, [[400, 880], [400, 380]], { w: 5.4, tone: 0.88, seed: 196, taper: 0.06 });   // 树干
      Z.wire(c, [[400, 420], [270, 356], [210, 390]], { w: 3.4, tone: 0.84, seed: 197, taper: 0.1 });
      Z.wire(c, [[400, 460], [540, 396], [600, 432]], { w: 3.4, tone: 0.84, seed: 198, taper: 0.1 });
      if (k > 0.05) { hang(250, 420 + (1 - k) * 60, 0); hang(560, 430 + (1 - k) * 60, 1); }
      c.save(); c.globalAlpha = 0.7 * k;
      Z.wuyong(c, 250, 500, 0.9, t, { robe: 1, rujin: 1, fan: 0, tone: 0.7 });
      Z.huarong(c, 560, 510, 0.9, t, { bow: 0, spear: 0, crown: 1, tone: 0.7 });
      c.restore();
      // 落叶（活气）
      for (let i = 0; i < 10; i++) {
        const lx = 300 + ((t * 40 + i * 90) % 700), ly = 300 + ((t * 60 + i * 120) % 500);
        Z.wire(c, [[lx, ly], [lx + 14, ly + 8], [lx + 6, ly + 18]], { w: 1.6, tone: 0.42, seed: 1960 + i });
      }
    });
    Z.bigText(c, '蓼儿洼自缢', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '小李广', clamp(ss(0.8, 2.4, lt)), { size: 28 });
  } };
})();
})();
