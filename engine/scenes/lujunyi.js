// 《水浒传·卢俊义》rig + 八幕（宋元版画线描 + 焦墨）
// 造型：北京大名府员外——河北三绝之首、家财万贯、棍棒天下无双，绰号「玉麒麟」。
//   特征：① 麒麟纹（袍上祥兽侧影，身份签字）② 玉带（腰间横玉一块 + 玉佩垂落）③ 丈二钢枪（signature 兵器）。
// 唯一的彩：朱砂只用于① 第七幕活捉史文恭、坐梁山第二把交椅的「玉麒麟」钤印 ② 第八幕被赐水银御膳毒死的血光（画外提示）——全片两处，余皆黑白灰。
// 母题：① 麒麟纹 ② 玉带玉佩 ③ 丈二钢枪 ④ 枷（刺配沙门岛）。
// 弧光：大名府员外 → 吴用智赚题反诗 → 梁山相留不降 → 李固告发刺配 → 燕青救主 → 石秀劫法场 →
//       活捉史文恭（为晁盖报仇，坐第二把交椅）→ 征方腊还朝被蔡京赐死。
// 依《水浒传》第六十一回及百回本系统；卢俊义为累积型文学形象，正史无其人。
// 互文：第二幕复用吴用（扮算命）、第三幕复用宋江（劝降）、第七幕复用林冲（晁盖复仇线）。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 麒麟纹（signature：玉麒麟之「麒麟」——浅色徽记底 + 焦墨竖排「麒麟」二字，醒目可辨；不施色）
Z.qilin = (c, x, y, s, { tone = 0.9, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  // 徽记底（浅色圆牌，使「麒麟」二字成清晰徽章，不与灰袍糊在一起）
  c.fillStyle = 'rgba(232,230,222,.94)';
  c.beginPath(); c.ellipse(0, 0, 54, 62, 0, 0, 7); c.fill();
  c.strokeStyle = `rgba(26,26,28,${0.55 * tone})`; c.lineWidth = 2.4; c.stroke();
  // 「麒麟」二字（焦墨竖排，玉麒麟 signature 标识）
  c.fillStyle = `rgba(26,26,28,${0.92 * tone})`;
  c.font = 'bold 44px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('麒', 0, -19); c.fillText('麟', 0, 21);
  c.restore();
};

// 玉带（signature：腰间横玉 + 玉佩垂落——玉作淡墨块示意，不施青绿）
Z.jade = (c, x, y, s, { tone = 0.86, seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-72, 0], [72, 0], [72, 20], [-72, 20], [-72, 0]], { w: 3.4, tone, seed, taper: 0.06 });   // 腰带（更宽更显）
  c.save(); c.fillStyle = 'rgba(150,150,150,.26)'; c.fillRect(-72, 0, 144, 20); c.restore();
  Z.wire(c, [[-20, -12], [20, -12], [20, 12], [-20, 12], [-20, -12]], { w: 2.6, tone: tone * 0.95, seed: seed + 1 }); // 横玉扣（更大）
  Z.wire(c, [[0, 20], [0, 46]], { w: 1.8, tone: tone * 0.75, seed: seed + 2 });                                          // 玉佩绶
  c.beginPath(); c.arc(0, 58, 12, 0, 7); c.strokeStyle = `rgba(26,26,28,${0.9 * tone})`; c.lineWidth = 2.2; c.stroke(); // 玉佩（圆）
  c.restore();
};

// ============================== 卢俊义本体 ==============================
// o: { robe锦袍, helmet盔, spear丈二枪, qilin麒麟纹, jade玉带, flip, raise, angry, kneel, sit, bind枷, hurt, tone }
Z.lujunyi = (c, x, y, s, t, o = {}) => {
  const {
    robe = 1, helmet = 0, spear = 0, qilin = 1, jade = 1, flip = 0, raise = 0,
    angry = 0, kneel = 0, sit = 0, bind = 0, hurt = 0, tone = 0.9,
  } = o;
  const br = Math.sin(t * 1.5) * 2.4;
  c.save();
  c.translate(x, y); c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 52 : 0);
  const cp = sit ? 0.66 : 1;
  const shoulderY = ly - 162 * cp - (sit ? 4 : 0);
  const waistY = ly - 82 * cp;
  const hemY = ly - (sit ? 30 : 2);
  const hemW = sit ? 96 : 66;

  // ---- 躯干（员外锦袍：较宽，显富贵）----
  const body = [[-60, shoulderY + 8], [-68, waistY + 8], [-hemW, hemY], [hemW, hemY], [68, waistY + 8], [60, shoulderY + 8]];
  Z.lined(c, body, { w: 3.2, tone, seed: 71, hatch: 0.16, gap: 10, hatchAng: -0.9 });
  c.save(); c.fillStyle = 'rgba(110,112,118,.14)';
  c.beginPath(); body.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();

  // ---- 玉带（腰间横玉 + 玉佩）----
  if (jade) Z.jade(c, 0, waistY + 4, 1.0, { tone, seed: 78 });

  // ---- 麒麟纹（袍左胸，signature 徽章）----
  if (qilin && !sit) Z.qilin(c, -2, shoulderY + 34, 0.6, { tone, seed: 90 });

  // ---- 双臂（垂于袍侧，不遮挡胸前麒麟纹）----
  const armUp = lerp(0.16, -0.6, raise) + Math.sin(t * 1.5 + 1) * 0.02;
  const handY = shoulderY + 54 + Math.sin(armUp) * 60;
  Z.wire(c, [[-52, shoulderY + 14], [-70, shoulderY + 56], [-66, handY + 4]], { w: 3.2, tone, seed: 80, taper: 0.1 });
  Z.wire(c, [[52, shoulderY + 14], [70, shoulderY + 56 - raise * 24], [66, handY - raise * 38]], { w: 3.2, tone, seed: 81, taper: 0.1 });
  Z.lined(c, [[-66, handY + 2], [-54, handY + 20], [-46, handY + 6], [-56, handY - 12]], { w: 2.2, tone: tone * 0.8, seed: 82 });
  Z.lined(c, [[66, handY - 2], [54, handY + 16], [46, handY], [56, handY - 14]], { w: 2.2, tone: tone * 0.8, seed: 83 });

  // ---- 头 ----
  const hy = shoulderY - 38 + br * 0.5;
  c.save(); c.translate(0, hy); c.scale(1.12, 1.12); c.translate(0, -hy);
  const face = [[-22, hy - 14], [-19, hy - 38], [0, hy - 48], [19, hy - 38], [22, hy - 14], [20, hy + 14], [0, hy + 26], [-20, hy + 12]];
  Z.wire(c, face, { w: 2.6, tone, seed: 84, taper: 0.08 });
  if (helmet) {
    Z.lined(c, [[-22, hy - 14], [-18, hy - 44], [18, hy - 44], [22, hy - 14]], { w: 2.6, tone: 0.94, seed: 110, hatch: 0.18, gap: 5 });
    Z.wire(c, [[0, hy - 44], [0, hy - 60], [7, hy - 52]], { w: 2.2, tone: 0.85, seed: 111 });
  } else {
    Z.wire(c, [[-20, hy - 20], [-14, hy - 44], [14, hy - 44], [20, hy - 20]], { w: 2.4, tone: 0.9, seed: 110 });   // 员外巾
    Z.wire(c, [[-20, hy - 20], [20, hy - 20]], { w: 2, tone: 0.7, seed: 111 });
    const rib = Math.sin(t * 2.0) * 0.28;
    Z.wire(c, [[20, hy - 22], [40 + rib * 16, hy - 34 - rib * 10]], { w: 1.8, tone: 0.7, seed: 113 });          // 飘带
  }
  const open = lerp(0.5, 1, angry);
  for (const sx of [-1, 1]) {
    Z.wire(c, [[sx * 5, hy - lerp(19, 22, angry)], [sx * 15, hy - lerp(18, 12, angry)]], { w: 3, tone: tone * 0.95, seed: 87 + sx });
    Z.lined(c, [[sx * 4, hy - 10], [sx * 10, hy - 15], [sx * 16, hy - 10], [sx * 10, hy - 5]], { w: 1.5, tone, seed: 89 + sx, hatch: 0.5, gap: 3 });
  }
  Z.wire(c, [[0, hy - 10], [1, hy]], { w: 2, tone: tone * 0.8, seed: 91 });
  Z.wire(c, [[-8, hy + 6], [8, hy + 6]], { w: 2.4, tone: tone * 0.85, seed: 92 });
  c.restore();

  // ---- 丈二钢枪（长杆细枪，signature 兵器，立于身侧，不横穿身体）----
  if (spear) {
    const gr = 0.06 + Math.sin(t * 1.2) * 0.02;
    c.save(); c.translate(92, handY - raise * 20); c.rotate(gr);
    Z.wire(c, [[0, 138], [0, -240]], { w: 4.4, tone: tone * 0.95, seed: 170, taper: 0.03 });   // 长杆（丈二）
    Z.wire(c, [[0, -240], [0, -292]], { w: 5.4, tone, seed: 171, taper: 0.06 });               // 枪尖（单尖，不岔）
    Z.wire(c, [[-9, -248], [9, -248]], { w: 2.4, tone: tone * 0.85, seed: 172 });              // 护手短横（非三叉）
    Z.wire(c, [[0, 138], [0, 120]], { w: 6, tone: tone * 0.9, seed: 174, taper: 0.1 });        // 鐏
    c.restore();
  }

  // ---- 枷（刺配沙门岛：木枷锁颈 + 缚绳，bind=1 时画）----
  if (bind) {
    c.save(); c.strokeStyle = `rgba(26,26,28,${0.85 * tone})`; c.lineWidth = 4.2;
    c.strokeRect(-100, shoulderY - 14, 200, 28);                                            // 枷板（及颈及肩）
    c.lineWidth = 2.2;
    c.beginPath(); c.arc(0, shoulderY + 1, 14, 0, 7); c.stroke();                          // 项孔（颈部）
    c.restore();
    Z.wire(c, [[-58, waistY + 10], [-30, waistY + 30], [-58, waistY + 40]], { w: 2, tone: tone * 0.7, seed: 130 });  // 缚绳
    Z.wire(c, [[58, waistY + 10], [30, waistY + 30], [58, waistY + 40]], { w: 2, tone: tone * 0.7, seed: 131 });
  }

  if (hurt) {
    c.save(); c.fillStyle = 'rgba(183,51,46,.5)';
    for (let i = 0; i < 4; i++) c.fillRect(-20 + i * 11, waistY - 18 + i * 4, 3.2, 3.2);
    c.restore();
  }
  c.restore();
};

// ============================== 八幕 ==============================
// ① 大名府员外：河北首富，棍棒天下无双，绰号玉麒麟
SCENES['lu1_yuanwai'] = (() => {
  const p = () => Z.paper('lu1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 440, y: 180, s: 1.0, seed: 4, tone: 0.32 });
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.roof(c, 1500, 740, 440, 120, { tone: 0.9, seed: 2 });
      Z.roof(c, 1500, 580, 320, 90, { tone: 0.85, seed: 3 });
      Z.wire(c, [[1320, 880], [1320, 620], [1680, 620], [1680, 880]], { w: 3.2, tone: 0.85, seed: 4 });
      Z.flag(c, 360, 600, 150, t, { text: '卢府', seed: 18, size: 26 });
      Z.lujunyi(c, 940, 892, 1.5, t, { robe: 1, helmet: 0, spear: 1, qilin: 1, jade: 1, raise: clamp(Math.sin(t * 1.3) * 0.3 + 0.25) });
      for (let i = 0; i < 9; i++) {
        const bx = ((t * 60 + i * 230) % 2000) - 40, by = 360 + ((t * 44 + i * 150) % 500);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.6, tone: 0.42, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '大名府员外', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 吴用智赚：扮算命先生题反诗，骗卢俊义去泰安州躲灾（复用吴用）
SCENES['lu2_zhuan'] = (() => {
  const p = () => Z.paper('lu2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 2.8)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 190, s: 1.0, seed: 5, tone: 0.3 });
      Z.ground(c, 900, { seed: 12, tone: 0.4 });
      Z.roof(c, 1560, 720, 360, 110, { tone: 0.9, seed: 2 });                          // 卢府
      Z.wire(c, [[1400, 880], [1400, 660], [1720, 660], [1720, 880]], { w: 3.2, tone: 0.85, seed: 4 });
      // 题反诗之墙（清晰竖排「反诗」标题 + 诗句竖列意象）
      Z.wire(c, [[1120, 870], [1120, 580], [1360, 580], [1360, 870]], { w: 3, tone: 0.82, seed: 6 });
      Z.hatchBox(c, [[1120, 870], [1360, 870], [1360, 580], [1120, 580]], { ang: -1.4, gap: 18, tone: 0.07, seed: 7 });
      c.save(); c.fillStyle = 'rgba(26,26,28,.72)';
      c.font = '24px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('反', 1158, 626); c.fillText('诗', 1158, 672); c.restore();
      for (let k = 0; k < 3; k++) Z.wire(c, [[1230 + k * 36, 600], [1230 + k * 36, 838]], { w: 1.6, tone: 0.5, seed: 600 + k });  // 诗句竖列意象
      Z.wuyong(c, 600, 892, 1.32, t, { robe: 1, rujin: 1, fan: 1, flip: 1 });          // 吴用扮算命
      Z.lujunyi(c, 940, 892, 1.46, t, { robe: 1, helmet: 0, qilin: 1, jade: 1, flip: 0 });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 56 + i * 240) % 2000) - 40, by = 360 + ((t * 42 + i * 160) % 520);
        Z.wire(c, [[bx, by], [bx + 10, by + 5]], { w: 1.5, tone: 0.4, seed: 2100 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '吴用智赚', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ③ 梁山相留：宋江、吴用劝降，卢俊义坚拒不从（复用宋江、吴用）
SCENES['lu3_liushan'] = (() => {
  const p = () => Z.paper('lu3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1500, y: 180, s: 1.0, seed: 6, tone: 0.32 });
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 200, tone: 0.42, seed: 101 }, { y0: 650, amp: 120, tone: 0.3, seed: 102 }]);
      Z.ground(c, 900, { seed: 13, tone: 0.4 });
      Z.shanzhai(c, 1560, 856, 0.96, { tone: 0.8, seed: 8, text: '梁山泊' });
      Z.flag(c, 320, 640, 140, t, { text: '替天行道', seed: 18, size: 26 });
      Z.songjiang(c, 640, 892, 1.4, t, { raise: 0.3, official: 0 });                    // 宋江劝降
      Z.wuyong(c, 820, 892, 1.3, t, { robe: 1, rujin: 1, fan: 1, flip: 1 });             // 吴用
      Z.lujunyi(c, 1120, 892, 1.5, t, { robe: 1, helmet: 0, qilin: 1, jade: 1, angry: 0.5 }); // 卢俊义不从
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 50 + i * 250) % 2000) - 40, by = 360 + ((t * 40 + i * 170) % 520);
        Z.wire(c, [[bx, by], [bx + 10, by + 5]], { w: 1.4, tone: 0.4, seed: 2300 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '梁山相留', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 李固告发·刺配沙门岛：管家告发谋反，卢俊义戴枷刺配（两个解差）
SCENES['lu4_xianxian'] = (() => {
  const p = () => Z.paper('lu4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.0, seed: 8, tone: 0.32 });
      Z.ground(c, 900, { seed: 14, tone: 0.4 });
      Z.guan(c, 1500, 860, 0.8, { tone: 0.82, seed: 2, text: '大名府' });
      Z.lujunyi(c, 860, 892, 1.46, t, { robe: 1, helmet: 0, qilin: 1, jade: 0, bind: 1, flip: 0 });  // 戴枷
      Z.fighter(c, 1240, 888, 1.0, t, { seed: 3, tone: 0.7, flip: 1 });                              // 解差董超
      Z.fighter(c, 1380, 884, 0.92, t, { seed: 9, tone: 0.66, flip: 1 });                             // 解差薛霸
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 52 + i * 240) % 2000) - 40, by = 360 + ((t * 42 + i * 160) % 520);
        Z.wire(c, [[bx, by], [bx + 10, by + 5]], { w: 1.4, tone: 0.38, seed: 2400 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '刺配沙门岛', { x: 1760, y: 120, size: 46, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 燕青救主：途中解差欲害，燕青射杀二差，救下卢俊义（与燕青片互文）
SCENES['lu5_jiuzhu'] = (() => {
  const p = () => Z.paper('lu5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 1500, y: 190, s: 1.0, seed: 9, tone: 0.32 });
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 210, tone: 0.4, seed: 121 }, { y0: 660, amp: 120, tone: 0.3, seed: 122 }]);
      Z.ground(c, 900, { seed: 15, tone: 0.4 });
      Z.fighter(c, 1300, 888, 1.0, t, { seed: 3, tone: 0.7, flip: 1, spear: 1 });                 // 解差欲害
      Z.fighter(c, 1440, 884, 0.92, t, { seed: 9, tone: 0.66, flip: 1 });
      Z.lujunyi(c, 900, 892, 1.46, t, { robe: 1, helmet: 0, qilin: 1, jade: 0, bind: 1, flip: 0 });
      // 燕青（川弩救主：用 fighter + 弓示意，远射）
      Z.fighter(c, 560, 892, 1.1, t, { seed: 12, tone: 0.74, flip: 0, spear: 1 });
      // 箭（活气）
      const fly = clamp(ss(1.0, 2.4, lt));
      Z.wire(c, [[640, 800], [lerp(700, 1180, fly), 812]], { w: 2.4, tone: 0.7, seed: 2500, taper: 0.3 });
      for (let i = 0; i < 7; i++) {
        const bx = ((t * 60 + i * 260) % 2000) - 40, by = 360 + ((t * 44 + i * 150) % 500);
        Z.wire(c, [[bx, by], [bx + 11, by + 5]], { w: 1.5, tone: 0.4, seed: 2501 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '燕青救主', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 大名府死牢·石秀劫法场：卢俊义囚牢问斩，石秀跳楼劫法场（与吴用片呼应）
SCENES['lu6_dalao'] = (() => {
  const p = () => Z.paper('lu6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 190, s: 1.0, seed: 10, tone: 0.32 });
      Z.ground(c, 900, { seed: 16, tone: 0.38 });
      Z.guan(c, 1500, 860, 0.82, { tone: 0.82, seed: 2, text: '法场' });
      // 囚笼
      Z.wire(c, [[760, 880], [760, 640], [1080, 640], [1080, 880]], { w: 3.2, tone: 0.8, seed: 5 });
      for (let i = 0; i <= 6; i++) Z.wire(c, [[760 + i * 53, 640], [760 + i * 53, 880]], { w: 1.6, tone: 0.5, seed: 100 + i });
      for (let j = 0; j <= 4; j++) Z.wire(c, [[760, 640 + j * 60], [1080, 640 + j * 60]], { w: 1.4, tone: 0.45, seed: 200 + j });
      Z.lujunyi(c, 920, 884, 1.4, t, { robe: 1, helmet: 0, qilin: 1, jade: 0, bind: 1, kneel: 1 });   // 囚中卢俊义
      Z.fighter(c, 1300, 888, 1.04, t, { seed: 7, tone: 0.74, helmet: 1, blade: 1, flip: 1 });          // 石秀跳楼劫法场
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 56 + i * 240) % 2000) - 40, by = 360 + ((t * 42 + i * 160) % 520);
        Z.wire(c, [[bx, by], [bx + 10, by + 5]], { w: 1.4, tone: 0.38, seed: 2600 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '石秀劫法场', { x: 1760, y: 120, size: 44, tone: 0.9, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 活捉史文恭：为晁盖报仇，一枪活捉史文恭，坐梁山第二把交椅（复用林冲，互文晁盖）
SCENES['lu7_shigong'] = (() => {
  const p = () => Z.paper('lu7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const catchh = clamp(ss(0.8, 2.6, lt));
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 480, y: 200, s: 1.1, seed: 11, tone: 0.32 });
      Z.ground(c, 900, { seed: 17, tone: 0.4 });
      Z.hall(c, 1480, 600, 1.0, { tone: 0.8, seed: 2, text: '忠义堂' });                  // 忠义堂（来自林冲片）
      Z.flag(c, 320, 640, 140, t, { text: '替天行道', seed: 18, size: 26 });
      Z.linchong(c, 1380, 888, 1.1, t, { flip: 1, spear: 1, armor: 1 });                  // 林冲（晁盖复仇线互文）
      Z.lujunyi(c, 940, 892, 1.5, t, { robe: 1, helmet: 0, spear: 1, qilin: 1, jade: 1, raise: catchh * 0.8 }); // 卢俊义擒史文恭
      Z.fighter(c, lerp(1180, 1080, catchh), 888, 1.0, t, { seed: 8, tone: 0.72, flip: 1, helmet: 1, blade: 0 }); // 史文恭被擒
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 58 + i * 240) % 2000) - 40, by = 360 + ((t * 42 + i * 160) % 520);
        Z.wire(c, [[bx, by], [bx + 11, by + 5]], { w: 1.5, tone: 0.4, seed: 2700 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '活捉史文恭', { x: 1760, y: 120, size: 46, tone: 0.88, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 130, 884, '玉麒麟', clamp(ss(1.8, 3.0, lt)), { size: 28 });
  } };
})();

// ⑧ 征方腊还朝·赐死：蔡京、高俅赐水银御膳毒死（画外朱砂血光）
SCENES['lu8_cisi'] = (() => {
  const p = () => Z.paper('lu8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const die = clamp(ss(1.6, 3.4, lt));
    const cam = { x: 960, y: 560, z: lerp(1.08, 1.0, clamp(lt / 3.8)) };
    CAM.with(c, cam, (c) => {
      Z.cloud(c, t, { x: 600, y: 180, s: 1.1, seed: 12, tone: 0.32 });
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 170, tone: 0.34, seed: 141 }]);
      Z.ground(c, 900, { seed: 18, tone: 0.34 });
      Z.tent(c, 1480, 856, 0.92, { tone: 0.8, seed: 6, text: '班师' });
      Z.flag(c, 320, 640, 140, t, { text: '梁山泊', seed: 20, size: 26 });
      Z.flame(c, 1180, 866, 0.7, t, { seed: 3, tone: 0.6 });                                         // 营火（活气）
      Z.wire(c, [[1180, 866], [1180, 770]], { w: 3, tone: 0.8, seed: 2800 });
      c.save(); c.globalAlpha = 1 - die * 0.5;
      Z.lujunyi(c, 900, 884, 1.4, t, { robe: 1, helmet: 0, qilin: 1, jade: 1, sit: 1, tone: 0.9 });  // 毒发倚坐
      c.restore();
      if (die > 0.2) {                                                                          // 朱砂血光（画外提示，全程可见）
        const k = clamp((die - 0.2) / 0.8);
        c.save(); c.globalAlpha = 0.6 + 0.34 * k; c.lineCap = 'round';
        c.strokeStyle = 'rgba(183,51,46,.72)'; c.lineWidth = 5;
        c.beginPath(); c.moveTo(880, 720); c.quadraticCurveTo(920, 676, 968, 652); c.stroke();
        c.strokeStyle = 'rgba(183,51,46,.55)'; c.lineWidth = 3;
        c.beginPath(); c.moveTo(888, 730); c.quadraticCurveTo(928, 690, 974, 676); c.stroke();
        c.restore();
        c.save(); c.globalAlpha = 0.7 + 0.3 * k; c.fillStyle = 'rgba(183,51,46,.72)';
        const burst = [[884, 714, 11], [896, 706, 9], [906, 724, 10], [874, 726, 7], [908, 738, 6],
                       [924, 712, 8], [880, 700, 6], [936, 726, 7], [912, 742, 5], [868, 716, 6],
                       [944, 716, 6], [930, 700, 5], [896, 744, 4], [952, 728, 5]];
        for (const [dx, dy, r] of burst) c.fillRect(dx - r / 2, dy - r / 2, r, r);
        c.fillStyle = 'rgba(183,51,46,.62)';
        c.fillRect(898, 716, 14, 14); c.fillRect(932, 730, 10, 10);
        c.restore();
      }
    });
    Z.bigText(c, '班师赐死', { x: 1760, y: 110, size: 46, tone: 0.92, appear: clamp(ss(2.0, 3.0, lt)) });
    Z.seal(c, 140, 884, '天罡星', clamp(ss(1.8, 3.2, lt)), { size: 26 });
  } };
})();
})();
