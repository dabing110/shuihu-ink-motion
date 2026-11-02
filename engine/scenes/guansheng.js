// 《水浒传·关胜》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：蒲东人氏，汉寿亭侯关羽嫡派子孙——堂堂一表，细细三柳髭髯，凤眼蚕眉，
//   使一口青龙偃月刀，绰号「大刀」，梁山马军五虎将之首。
//   特征：① 青龙偃月刀（signature 兵器，刀缨朱砂）② 长髯（美髯）③ 凤眼蚕眉 ④ 重甲。
// 唯一的彩：朱砂只用于① 青龙偃月刀的刀缨（signature，全片一味朱砂）② 第八幕「大刀」钤印——余皆黑白灰。
// 母题：① 偃月刀 ② 长髯 ③ 朱砂刀缨 ④ 重甲。
// 弧光：蒲东巡检 → 奉旨征讨梁山 → 围魏救赵攻大名府 → 大战林冲秦明 →
//       中伏被擒 → 感义归顺 → 南征北讨为五虎之首 → 授大名府总兵，醉酒坠马而亡。
// 依《水浒传》第六十三、六十四、六十七、七十一、百二十回（百回本第九十九回）。
// 互文：第三幕复用卢俊义（围魏救赵救大名府）、第四幕复用林冲（对战）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 青龙偃月刀（signature：长柄 + 弯月刃 + 龙吞口 + 朱砂刀缨）
Z.yanyue = (c, x, y, s, { tone = 0.92, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.12);
  Z.wire(c, [[0, 186], [0, -104]], { w: 5.6, tone, seed, taper: 0.04 });        // 长柄（缩短，让刀头更贴近手、更醒目）
  Z.wire(c, [[0, 186], [0, 168]], { w: 7.4, tone: tone * 0.9, seed: seed + 1 });// 鐏
  // 弯月刃（新月形：外弧 + 刃口内弧，填深墨块 —— 令刀头成为画面上最醒目的墨团）
  c.save();
  c.fillStyle = 'rgba(26,26,28,.34)'; c.strokeStyle = `rgba(26,26,28,${tone})`;
  c.lineWidth = 5.4; c.lineJoin = 'round'; c.lineCap = 'round';
  c.beginPath();
  c.moveTo(0, -104);                                   // 刃根（柄顶）
  c.quadraticCurveTo(-78, -128, -132, -186);           // 外弧（刀背）
  c.lineTo(-104, -236);                                // 刀尖
  c.quadraticCurveTo(-52, -196, 0, -104);              // 内弧（刃口）
  c.closePath(); c.fill(); c.stroke();
  c.restore();
  // 龙吞口（刃柄相接处的小龙首）
  c.save(); c.fillStyle = 'rgba(26,26,28,.3)';
  c.beginPath(); c.moveTo(0, -104); c.lineTo(26, -100); c.lineTo(34, -80); c.lineTo(18, -74); c.lineTo(0, -84);
  c.closePath(); c.fill(); c.restore();
  Z.wire(c, [[0, -104], [26, -100], [34, -80], [18, -74], [0, -84]], { w: 3.2, tone, seed: seed + 4 });
  Z.wire(c, [[26, -100], [40, -110]], { w: 2.2, tone: tone * 0.8, seed: seed + 5 });
  // 刃背小枝
  Z.wire(c, [[-132, -186], [-150, -198]], { w: 3.2, tone, seed: seed + 6 });
  // 朱砂刀缨（signature：全片唯一彩之一）
  c.save(); c.fillStyle = 'rgba(183,51,46,.84)';
  c.fillRect(-24, -112, 26, 10); c.fillRect(-16, -96, 22, 9); c.fillRect(-32, -84, 18, 8);
  c.restore();
  c.restore();
};

// ============================== 关胜本体 ==============================
// o: { blade偃月刀, armor重甲, beard长髯, flip, raise, ride, kneel, hurt, tone }
Z.guansheng = (c, x, y, s, t, o = {}) => {
  const {
    blade = 1, armor = 1, beard = 1, flip = 0, raise = 0, ride = 0,
    kneel = 0, hurt = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.3) * 2.4;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 48 : 0) - (ride ? 60 : 0);
  const shoulderY = ly - 158;
  const waistY = ly - 80;
  const hipY = ly - 24;

  // ---- 腿（马步或立）----
  if (ride) {
    Z.wire(c, [[-30, hipY], [-52, hipY + 30], [-64, hipY + 54]], { w: 4, tone, seed: 60, taper: 0.1 });
    Z.wire(c, [[30, hipY], [52, hipY + 30], [64, hipY + 54]], { w: 4, tone, seed: 61, taper: 0.1 });
  } else {
    Z.wire(c, [[-30, hipY], [-40, hipY + 44], [-36, ly]], { w: 4, tone, seed: 62, taper: 0.1 });
    Z.wire(c, [[30, hipY], [40, hipY + 44], [36, ly]], { w: 4, tone, seed: 63, taper: 0.1 });
    Z.lined(c, [[-36, ly], [-56, ly - 4], [-58, ly + 14], [-34, ly + 11]], { w: 2.6, tone: tone * 0.85, seed: 64 });
    Z.lined(c, [[36, ly], [56, ly - 4], [58, ly + 14], [34, ly + 11]], { w: 2.6, tone: tone * 0.85, seed: 65 });
  }

  // ---- 躯干（重甲：甲片横列）----
  const body = [[-58, shoulderY + 6], [-66, waistY + 4], [-54, hipY], [54, hipY], [66, waistY + 4], [58, shoulderY + 6]];
  Z.lined(c, body, { w: 3.6, tone, seed: 71, hatch: armor ? 0.2 : 0.12, gap: 10, hatchAng: -0.9 });
  c.save(); c.fillStyle = 'rgba(110,112,118,.16)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  for (let i = 0; i < 4; i++) {
    Z.wire(c, [[-52, shoulderY + 32 + i * 22], [52, shoulderY + 32 + i * 22]], { w: 2, tone: tone * 0.6, seed: 72 + i });
  }
  Z.wire(c, [[-64, waistY + 2], [64, waistY + 2], [64, waistY + 20], [-64, waistY + 20], [-64, waistY + 2]], { w: 3.4, tone, seed: 76, taper: 0.06 });
  // 披膊（护肩）
  Z.lined(c, [[-58, shoulderY + 6], [-80, shoulderY + 24], [-70, shoulderY + 54]], { w: 3, tone: tone * 0.9, seed: 77, hatch: 0.14 });
  Z.lined(c, [[58, shoulderY + 6], [80, shoulderY + 24], [70, shoulderY + 54]], { w: 3, tone: tone * 0.9, seed: 78, hatch: 0.14 });

  // ---- 双臂 ----
  const handY = shoulderY + 56 - raise * 44;
  Z.wire(c, [[-58, shoulderY + 14], [-92, shoulderY + 42], [-84, handY + 8]], { w: 4, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[58, shoulderY + 14], [92, shoulderY + 36 - raise * 26], [84, handY - raise * 34]], { w: 4, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[-84, handY + 6], [-70, handY + 22], [-58, handY + 8], [-68, handY - 8]], { w: 2.4, tone: tone * 0.85, seed: 82 });
  Z.lined(c, [[84, handY - 6], [70, handY + 10], [58, handY - 4], [68, handY - 20]], { w: 2.4, tone: tone * 0.85, seed: 83 });

  // ---- 头（凤眼蚕眉 + 长髯，signature）----
  const hy = shoulderY - 40 + br * 0.5;
  const face = [[-24, hy - 14], [-21, hy - 40], [0, hy - 52], [21, hy - 40], [24, hy - 14], [22, hy + 14], [0, hy + 28], [-22, hy + 12]];
  Z.lined(c, face, { w: 2.8, tone: tone * 0.95, seed: 100, hatch: 0.06, gap: 9 });
  // 蚕眉（卧蚕：弯而长）
  Z.wire(c, [[-18, hy - 16], [-8, hy - 22], [-2, hy - 18]], { w: 2.6, tone, seed: 101 });
  Z.wire(c, [[2, hy - 18], [8, hy - 22], [18, hy - 16]], { w: 2.6, tone, seed: 102 });
  // 凤眼（细长）
  Z.wire(c, [[-14, hy - 8], [-4, hy - 6]], { w: 2, tone, seed: 103 });
  Z.wire(c, [[4, hy - 6], [14, hy - 8]], { w: 2, tone, seed: 104 });
  Z.wire(c, [[-14, hy - 8], [-16, hy - 12]], { w: 1.6, tone, seed: 105 });
  Z.wire(c, [[14, hy - 8], [16, hy - 12]], { w: 1.6, tone, seed: 106 });
  Z.wire(c, [[-7, hy + 4], [7, hy + 3]], { w: 2.2, tone: tone * 0.8, seed: 107 });
  // 长髯（signature：美髯公，三柳长须）
  if (beard) {
    for (let i = 0; i < 9; i++) {
      const bx = -20 + i * 5, wob = Math.sin(t * 1.4 + i * 0.5) * 4;
      Z.wire(c, [[bx, hy + 16], [bx - 2 + wob, hy + 44 + (i % 3) * 22]], { w: 2.2, tone: tone * 0.9, seed: 110 + i, taper: 0.35 });
    }
    Z.wire(c, [[-16, hy + 4], [16, hy + 4]], { w: 2.4, tone: tone * 0.85, seed: 120 });   // 髭
  }
  // 战盔/幞头（凤翅盔：双翅）
  Z.wire(c, [[-28, hy - 22], [-24, hy - 50], [24, hy - 50], [28, hy - 22]], { w: 3, tone: 0.92, seed: 130 });
  Z.wire(c, [[-24, hy - 50], [-14, hy - 74], [14, hy - 74], [24, hy - 50]], { w: 3.2, tone: 0.92, seed: 131 });
  Z.wire(c, [[-14, hy - 74], [0, hy - 88], [14, hy - 74]], { w: 2.8, tone: 0.9, seed: 132 });
  Z.wire(c, [[0, hy - 88], [0, hy - 102]], { w: 2.4, tone: 0.88, seed: 133 });          // 盔缨杆
  c.save(); c.fillStyle = 'rgba(183,51,46,.7)';                                          // 朱砂：盔缨
  c.fillRect(-6, -102 + (hy | 0) - (hy | 0) + hy - 116, 12, 14);
  c.restore();
  Z.wire(c, [[-28, hy - 40], [-58, hy - 30], [-52, hy - 14]], { w: 2.4, tone: 0.85, seed: 134 });   // 凤翅
  Z.wire(c, [[28, hy - 40], [58, hy - 30], [52, hy - 14]], { w: 2.4, tone: 0.85, seed: 135 });

  // ---- 青龙偃月刀 ----
  if (blade) Z.yanyue(c, 88, handY + 12, 1.16, { tone, seed: 170 });
  c.restore();
};

// ============================== 八幕 ==============================

// ① 蒲东巡检：关羽嫡派子孙，一口青龙偃月刀
SCENES['gw1_pudong'] = (() => {
  const p = () => Z.paper('gw1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 430, y: 180, s: 1.0, seed: 4, tone: 0.32 });
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.guan(c, 1520, 760, 0.92, { tone: 0.86, seed: 12, text: '蒲東' });
      Z.flag(c, 620, 600, 160, t, { text: '關', seed: 13, size: 28 });
      Z.pine(c, t, { x: 330, y: 888, s: 1.0, seed: 14, tone: 0.84 });
      Z.guansheng(c, 940, 892, 1.5, t, { blade: 1, armor: 1, beard: 1, raise: clamp(Math.sin(t * 1.2) * 0.2 + 0.2) });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 54 + i * 230) % 1980) - 30, by = 340 + ((t * 40 + i * 150) % 470);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.38, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '蒲东巡检', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 奉旨征讨：徽宗命关胜领兵征剿梁山
SCENES['gw2_faming'] = (() => {
  const p = () => Z.paper('gw2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 2.8)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 21, tone: 0.42 });
      Z.wire(c, [[1120, 900], [1120, 480], [1760, 480], [1760, 900]], { w: 3.6, tone: 0.88, seed: 22 });
      Z.roof(c, 1440, 480, 700, 150, { tone: 0.9, seed: 23 });
      Z.hatchBox(c, [[1120, 900], [1760, 900], [1760, 480], [1120, 480]], { ang: -1.35, gap: 22, tone: 0.1, seed: 24 });
      Z.wire(c, [[1300, 900], [1300, 620], [1580, 620], [1580, 900]], { w: 3, tone: 0.84, seed: 25 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.66)'; c.font = '32px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('聖旨', 1440, 740); c.restore();
      // 香炉烟（活气）
      for (let i = 0; i < 7; i++) {
        const sy = 820 - ((t * 36 + i * 70) % 340), sx = 700 + Math.sin((sy + i * 40) * 0.02 + t) * 20;
        Z.wire(c, [[sx, sy], [sx + 8, sy - 12]], { w: 1.5, tone: 0.32, seed: 1910 + i, taper: 0.8 });
      }
      Z.guansheng(c, 700, 892, 1.5, t, { blade: 1, kneel: 1, raise: clamp(ss(0.4, 1.3, lt)) });
    });
    Z.bigText(c, '奉旨征讨', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ③ 围魏救赵：不打梁山，直取大名府（复用卢俊义）
SCENES['gw3_daming'] = (() => {
  const p = () => Z.paper('gw3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 550, amp: 170, tone: 0.3, seed: 31 }]);
      Z.ground(c, 900, { seed: 32, tone: 0.44 });
      Z.guan(c, 1480, 760, 0.98, { tone: 0.88, seed: 33, text: '大名府' });
      Z.flag(c, 400, 560, 190, t, { text: '關', seed: 34, size: 32 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1480 + i * 100, 892, 0.78, t, { flip: 1, spear: 1, tone: 0.68, seed: 35 + i });
      // 城中卢俊义（囚于大名府，互文）
      Z.lujunyi(c, 1520, 700, 0.9, t, { robe: 1, qilin: 1, jade: 0, bind: 1, tone: 0.62 });
      // 关胜（城下勒马）
      Z.guansheng(c, 700, 892, 1.52, t, { blade: 1, ride: 1, raise: clamp(ss(0.3, 1.4, lt)) });
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 110 + i * 165) % 1400) + 320, dy = 800 + ((t * 36 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.36, seed: 1960 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '围魏救赵', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 大战林冲：一打梁山，与林冲秦明酣战（复用林冲）
SCENES['gw4_zhan'] = (() => {
  const p = () => Z.paper('gw4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 190, tone: 0.3, seed: 41 }]);
      Z.ground(c, 900, { seed: 42, tone: 0.44 });
      Z.flag(c, 1560, 520, 200, t, { text: '梁山', seed: 43, size: 30 });
      // 林冲（右，持枪）
      Z.linchong(c, 1320, 892, 1.44, t, { flip: 1, spear: 1, blade: 0, raise: clamp(Math.sin(t * 2.2) * 0.3 + 0.4) });
      // 关胜（左，挥刀）
      const clash = clamp(ss(0.6, 1.8, lt));
      Z.guansheng(c, 780, 892, 1.54, t, { blade: 1, ride: 1, raise: clash });
      // 交击（火花线）
      if (clash > 0.35) {
        for (let i = 0; i < 8; i++) {
          const a = -1.3 + i * 0.3 + Math.sin(t * 4 + i) * 0.1;
          Z.wire(c, [[1060, 660], [1060 + Math.cos(a) * 66, 660 + Math.sin(a) * 66]],
            { w: 2.4, tone: 0.6, seed: 1920 + i, taper: 0.8 });
        }
      }
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 120 + i * 170) % 1400) + 320, dy = 800 + ((t * 38 + i * 90) % 110);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 5]], { w: 1.9, tone: 0.36, seed: 1970 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '大战林冲', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 中伏被擒：呼延灼诈降赚入寨，关胜被挠钩拖倒
SCENES['gw5_beiqin'] = (() => {
  const p = () => Z.paper('gw5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 51, tone: 0.42 });
      Z.shanzhai(c, 1560, 700, 0.9, { tone: 0.76, seed: 52, text: '梁山' });
      // 挠钩手（左、右各二）
      for (let i = 0; i < 2; i++) Z.fighter(c, 500 + i * 130, 892, 0.72, t, { seed: 53 + i, tone: 0.62 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 1200 + i * 130, 892, 0.72, t, { flip: 1, seed: 55 + i, tone: 0.62 });
      // 关胜（被拖倒：渐次下挫）
      const fall = clamp(ss(1.0, 2.2, lt));
      Z.guansheng(c, 900, 892 + fall * 40, 1.5, t, { blade: 1, hurt: fall, raise: 0.3 - fall * 0.3 });
      // 挠钩（绳索）
      if (fall > 0.2) {
        for (let i = 0; i < 4; i++) {
          const hx = 620 + i * 90;
          Z.wire(c, [[hx, 800], [hx + 40, 840], [900, 820 + fall * 20]], { w: 2, tone: 0.6, seed: 1930 + i, taper: 0.3 });
        }
      }
      for (let i = 0; i < 8; i++) {
        const dx = ((t * 100 + i * 180) % 1300) + 380, dy = 790 + ((t * 40 + i * 80) % 100);
        Z.wire(c, [[dx, dy], [dx + 24, dy - 6]], { w: 1.8, tone: 0.34, seed: 1980 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '中伏被擒', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 感义归顺：宋江亲解其缚，关胜拜服（复用宋江）
SCENES['gw6_guishun'] = (() => {
  const p = () => Z.paper('gw6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 71, tone: 0.4 });
      Z.wire(c, [[1080, 900], [1080, 520], [1780, 520], [1780, 900]], { w: 3.6, tone: 0.88, seed: 72 });
      Z.roof(c, 1430, 520, 740, 150, { tone: 0.9, seed: 73 });
      Z.hatchBox(c, [[1080, 900], [1780, 900], [1780, 520], [1080, 520]], { ang: -1.35, gap: 22, tone: 0.1, seed: 74 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.66)'; c.font = '32px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('忠義堂', 1430, 740); c.restore();
      Z.songjiang(c, 1220, 892, 1.46, t, { official: 1, raise: clamp(Math.sin(t * 1.2) * 0.16 + 0.2) });
      // 关胜（拜服）
      Z.guansheng(c, 720, 892, 1.48, t, { blade: 0, kneel: 1, raise: clamp(ss(0.4, 1.4, lt)) * 0.4 });
      Z.yanyue(c, 980, 880, 0.9, { tone: 0.8, seed: 175 });   // 刀置于地
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 46 + i * 240) % 1960) - 30, by = 330 + ((t * 34 + i * 150) % 440);
        Z.wire(c, [[bx, by], [bx + 12, by + 5]], { w: 1.5, tone: 0.34, seed: 1916 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '感义归顺', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 南征北讨：五虎将之首，破辽征腊屡建奇功
SCENES['gw7_zheng'] = (() => {
  const p = () => Z.paper('gw7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 200, tone: 0.32, seed: 101 }, { y0: 660, amp: 110, tone: 0.22, seed: 102 }]);
      Z.ground(c, 900, { seed: 103, tone: 0.44 });
      Z.flag(c, 1580, 500, 200, t, { text: '宋', seed: 104, size: 32 });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1400 + i * 130, 892, 0.96, t, { flip: 1, blade: 1, tone: 0.72, seed: 110 + i });
      // 关胜（立马挥刀）
      const charge = clamp(ss(0.2, 1.6, lt));
      Z.guansheng(c, lerp(640, 780, charge), 892, 1.54, t, { blade: 1, ride: 1, raise: charge });
      for (let i = 0; i < 5; i++) {
        const a = -1.1 + i * 0.34 + Math.sin(t * 4.5) * 0.1;
        Z.wire(c, [[810, 690], [810 + Math.cos(a) * 80, 690 + Math.sin(a) * 80]], { w: 2.4, tone: 0.5, seed: 1950 + i, taper: 0.8 });
      }
      for (let i = 0; i < 12; i++) {
        const dx = ((t * 110 + i * 165) % 1500) + 280, dy = 800 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1990 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '五虎之首', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑧ 总兵坠马：授大名府正兵马总管，一日醉酒坠马而亡（朱砂：钤印）
SCENES['gw8_zongbing'] = (() => {
  const p = () => Z.paper('gw8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 210, tone: 0.32, seed: 131 }, { y0: 660, amp: 120, tone: 0.22, seed: 132 }]);
      Z.cloud(c, t, { x: 1500, y: 180, s: 1.2, seed: 133, tone: 0.3 });
      Z.ground(c, 900, { seed: 134, tone: 0.4 });
      Z.guan(c, 1500, 740, 0.9, { tone: 0.8, seed: 135, text: '大名府' });
      // 关胜（骑马，渐次倾侧）
      const fall = clamp(ss(1.6, 3.2, lt));
      c.save(); c.translate(760, 892); c.rotate(fall * 0.42); c.translate(-760, -892);
      Z.guansheng(c, 760, 892, 1.5, t, { blade: 1, ride: 1, raise: 0.2 });
      c.restore();
      // 坠（动势线）
      if (fall > 0.2) {
        for (let i = 0; i < 7; i++) {
          const dx = 700 + ((t * 130 + i * 150) % 500), dy = 760 + (i % 3) * 50;
          Z.wire(c, [[dx, dy], [dx + 26, dy - 12]], { w: 2, tone: 0.45, seed: 1965 + i, taper: 0.8 });
        }
      }
      if (lt > 2.2) {
        c.save(); c.globalAlpha = 0.8 * clamp(ss(2.2, 3.0, lt));
        c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('醉后坠马，得病身亡', 1560, 350);
        c.restore();
      }
    });
    Z.bigText(c, '大名府总兵', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.2, lt)) });
    Z.seal(c, 130, 880, '大刀', clamp(ss(0.8, 2.4, lt)), { size: 28 });
  } };
})();
})();
