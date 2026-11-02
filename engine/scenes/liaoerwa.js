// 《水浒传·蓼儿洼·梁山终局》收口片（SH-31）：宋元版画线描 + 焦墨。十幕 33.60s。
// 基调：招安 → 征方腊 → 宋江饮御酒 → 李逵同饮 → 吴用花荣双缢，一次收口整个系列。
// 复用 rig：Z.songjiang / Z.likui / Z.wuyong / Z.huarong（已在各自 scenes 文件，SCENE_LIBS 加载）。
// 唯一的新镜头语言：蓼儿洼——楚州荒洼、双松、宋江墓（碑「宋公明之墓」）、两条垂落的墨色缢绳。
// 朱砂铁律：只用① 御酒壶口一线 ② 宋江/李逵的毒酒盏与胸前血光 ③ 末幕「梁山」钤印——余皆黑白灰。
// 依《水浒传》第八十二回（受招安）、百回本末回（宋江饮药酒、李逵同死、吴用花荣自缢于楚州蓼儿洼）。
// 考据：吴用花荣「同缢蓼儿洼」出百回本第一百二十回；花荣为累积型文学形象，正史无其人。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const ez = (p) => ease.inOut(p);
const W = 1920, H = 1080;

// ============================== 收口片专用小件 ==============================

// 御酒执壶（朱砂只出现在壶口那一线，毒的记号）
Z.yujiu = (c, x, y, s, t, { seed = 1, fill = 0, mouth = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.lined(c, [[-46, 44], [46, 44], [40, -60], [-40, -60]], { w: 3, tone: 0.86, seed, hatch: 0.14, gap: 10 });
  Z.wire(c, [[-40, -60], [-30, -80], [30, -80], [40, -60]], { w: 2.8, tone: 0.86, seed: seed + 1 });
  Z.wire(c, [[46, 12], [96, -16], [104, -46]], { w: 2.8, tone: 0.84, seed: seed + 2 });     // 壶嘴
  Z.wire(c, [[-46, 8], [-92, 6], [-96, -34]], { w: 2.8, tone: 0.84, seed: seed + 3 });       // 壶把
  if (fill > 0.02) {                                                                          // 壶中药酒（朱砂）
    c.save(); c.globalAlpha = 0.5 + 0.4 * fill;
    c.fillStyle = 'rgba(183,51,46,.7)'; c.fillRect(-34, -10, 68, 48); c.restore();
  }
  if (mouth > 0.02) {                                                                         // 壶口那一线朱砂（毒）
    c.save(); c.globalAlpha = mouth; c.strokeStyle = 'rgba(183,51,46,.92)'; c.lineWidth = 4;
    c.beginPath(); c.moveTo(0, -82); c.quadraticCurveTo(12 + Math.sin(t * 3) * 3, -46, 2 + Math.sin(t * 2) * 4, -8); c.stroke();
    c.restore();
  }
  c.restore();
};

// 宋江墓（蓼儿洼荒洼里的土冢 + 碑「宋公明之墓」）
Z.songmu = (c, x, y, s, t, { seed = 1 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  // 土冢：一道起伏的坟丘线 + 稀疏排线（压低坟顶，避免遮挡碑文）
  const pts = [];
  for (let i = -120; i <= 120; i += 12) pts.push([i, -34 + Math.cos(i / 120 * Math.PI) * 30]);
  Z.wire(c, pts, { w: 3.2, tone: 0.7, seed, taper: 0.05 });
  Z.hatchBox(c, [...pts, [120, 20], [-120, 20]], { ang: -0.6, gap: 22, tone: 0.22, seed: seed + 1 });
  // 碑（高于坟顶，五字完整无遮挡）
  Z.lined(c, [[-44, -64], [44, -64], [44, -226], [-44, -226]], { w: 3, tone: 0.9, seed: seed + 2, hatch: 0.12, gap: 9 });
  Z.wire(c, [[-54, -64], [54, -64]], { w: 2.6, tone: 0.8, seed: seed + 3 });
  c.save(); c.fillStyle = 'rgba(26,26,28,.92)'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '30px "LXGWWenKai-500"'; c.fillText('宋', 0, -196); c.fillText('公', 0, -162);
  c.fillText('明', 0, -128); c.fillText('之', 0, -94); c.fillText('墓', 0, -60); c.restore();
  c.restore();
};

// 蓼儿洼双缢：两棵松 + 从松顶垂落的两条墨色缢绳（环在颈侧）；朱砂不用于绳，只用于末幕钤印
Z.yiRope = (c, xTop, yTop, xNeck, yNeck, t, { seed = 1 } = {}) => {
  c.save();
  Z.wire(c, [[xTop, yTop], [xNeck, yNeck - 26]], { w: 2.4, tone: 0.8, seed, taper: 0.1 });   // 绳：松顶到颈上
  Z.wire(c, [[xTop, yTop], [xNeck - 14, yNeck - 24]], { w: 2, tone: 0.7, seed: seed + 1, taper: 0.1 });
  // 颈上的绳圈（小椭圆，墨线）
  c.strokeStyle = 'rgba(26,26,28,.82)'; c.lineWidth = 2.2;
  c.beginPath(); c.ellipse(xNeck, yNeck, 16, 22, 0, 0, Math.PI * 2); c.stroke();
  c.restore();
};

// ============================== 十幕 ==============================

// ① 受招安：梁山竖「替天行道」旗，宋江受封——从此由「反」转「顺」
SCENES['le1_zhaoan'] = (() => {
  const p = () => Z.paper('le1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 11, tone: 0.4 });
      Z.shanzhai(c, 1480, 620, 1.0, { tone: 0.8, seed: 12, text: '忠义堂' });
      Z.cloud(c, t, { x: 420, y: 190, s: 1.0, seed: 13, tone: 0.3 });
      Z.flag(c, 1180, 540, 260, t, { text: '替天行道', seed: 14, size: 38 });
      Z.songjiang(c, 960, 892, 1.62, t, { official: 0, crown: 1, raise: clamp(Math.sin(t * 1.6) * 0.2 + 0.25) });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 44 + i * 250) % 1980) - 30, by = 320 + ((t * 38 + i * 170) % 460);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.32, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '受招安', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 北破大辽，南征方腊：刀弓并用，功在社稷
SCENES['le2_zhengzhan'] = (() => {
  const p = () => Z.paper('le2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 180, tone: 0.32, seed: 21 }]);
      Z.ground(c, 900, { seed: 22, tone: 0.44 });
      Z.pine(c, t, { x: 320, y: 892, s: 1.0, seed: 23, tone: 0.7 });
      Z.pine(c, t, { x: 1640, y: 892, s: 0.86, seed: 24, tone: 0.62 });
      // 花荣拉弓射（南征方腊）
      Z.huarong(c, 720, 892, 1.5, t, { bow: 1, draw: clamp(ss(0.4, 1.6, lt)), crown: 1, flip: 0 });
      // 李逵抡斧冲（北破大辽）
      Z.likui(c, 1260, 892, 1.5, t, { axe: 1, rage: 0.5, raise: clamp(Math.sin(t * 1.8) * 0.2 + 0.25) });
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 110 + i * 200) % 1500) + 300, dy = 250 + ((t * 30 + i * 88) % 420);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 5]], { w: 1.8, tone: 0.28, seed: 120 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '南征北战', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 功成还朝，封楚州安抚使
SCENES['le3_huanchao'] = (() => {
  const p = () => Z.paper('le3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.hall(c, 980, 900, 1.18, { tone: 0.9, seed: 31 });
      Z.ground(c, 900, { seed: 32, tone: 0.36 });
      Z.roof(c, 980, 370, 940, 130, { tone: 0.78, seed: 33 });
      Z.flag(c, 360, 600, 180, t, { text: '楚', seed: 34, size: 30 });
      Z.flag(c, 1600, 600, 180, t, { text: '州', seed: 35, size: 30 });
      Z.songjiang(c, 980, 892, 1.62, t, { official: 1, hat: 1, raise: clamp(ss(0.6, 2.2, lt)) });
      c.save(); c.globalAlpha = clamp(ss(1.6, 2.8, lt)); c.fillStyle = 'rgba(26,26,28,.72)';
      c.font = '28px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('封楚州安抚使', 980, 790); c.restore();
    });
    Z.bigText(c, '还朝封官', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 一杯御酒，自东京来：高俅（或童贯）奉旨赐药酒
SCENES['le4_yujiu'] = (() => {
  const p = () => Z.paper('le4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.hall(c, 1180, 900, 1.12, { tone: 0.9, seed: 41 });
      Z.ground(c, 900, { seed: 42, tone: 0.38 });
      for (let i = 0; i < 2; i++) Z.fighter(c, 540 + i * 150, 892, 0.68, t, { tone: 0.5, seed: 43 + i });
      Z.songjiang(c, 820, 892, 1.56, t, { official: 1, hat: 1, raise: 0.12 });
      // 御酒执壶：壶口一线朱砂
      const hu1 = clamp(ss(0.6, 2.4, lt));
      Z.yujiu(c, 1430, 700, 1.35, t, { seed: 50, fill: hu1, mouth: clamp(ss(1.4, 2.8, lt)) });
      c.save(); const a4 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a4;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('御赐药酒，自东京来', 960, 122); c.restore();
    });
    Z.bigText(c, '御酒', { x: 1760, y: 120, size: 48, tone: 0.94, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 宋江饮下，已知是毒
SCENES['le5_yin'] = (() => {
  const p = () => Z.paper('le5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.05, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.hall(c, 960, 900, 1.1, { tone: 0.88, seed: 51 });
      Z.ground(c, 900, { seed: 52, tone: 0.36 });
      const raise = clamp(ss(0.3, 1.8, lt));
      Z.songjiang(c, 960, 892, 1.66, t, { official: 1, hat: 1, bowl: 1, raise: raise * 0.4 });
      // 碗里朱砂酒液（碗在左手：songjiang 以 (960,892) 为原点、scale 1.66；碗中心约世界 (880,766)）
      c.save(); c.globalAlpha = 0.6 + 0.35 * clamp(ss(1.0, 2.4, lt));
      c.fillStyle = 'rgba(183,51,46,.9)'; c.fillRect(866, 749, 48, 20);
      c.strokeStyle = 'rgba(183,51,46,.94)'; c.lineWidth = 2; c.strokeRect(866, 749, 48, 20);
      c.restore();
      c.save(); const a5 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a5;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('已知是毒，一饮而尽', 960, 122); c.restore();
    });
    Z.bigText(c, '饮毒', { x: 1760, y: 120, size: 48, tone: 0.94, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 忠义一生，毒发而亡（复用 Z.blood 朱砂血光）
SCENES['le6_wang'] = (() => {
  const p = () => Z.paper('le6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.hall(c, 960, 900, 1.1, { tone: 0.86, seed: 61 });
      Z.ground(c, 900, { seed: 62, tone: 0.34 });
      const die = clamp(ss(0.8, 2.6, lt));
      Z.songjiang(c, 960, 892, 1.66, t, { official: 1, hat: 1, hurt: 1, kneel: die });
      // 胸前朱砂血光（songjiang 胸约全局 (960, 892-92)=800）
      Z.blood(c, 960, 800, 1.5, clamp(ss(1.4, 2.8, lt)), { seed: 70 });
      c.save(); const a6 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a6;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('忠义一生，毒发而亡', 960, 122); c.restore();
    });
    Z.bigText(c, '公明死', { x: 1760, y: 120, size: 46, tone: 0.94, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 召李逵来，恐其造反——宋江瞒下死讯
SCENES['le7_zhao'] = (() => {
  const p = () => Z.paper('le7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.hall(c, 980, 900, 1.12, { tone: 0.88, seed: 71 });
      Z.ground(c, 900, { seed: 72, tone: 0.36 });
      const walk = clamp(ss(0.4, 2.4, lt));
      Z.songjiang(c, 760, 892, 1.56, t, { official: 0, crown: 1, raise: 0.2 });
      const lx = lerp(1500, 1180, ez(walk));
      Z.likui(c, lx, 892, 1.52, t, { axe: 0, flip: 1, raise: clamp(Math.sin(t * 1.6) * 0.2 + 0.2) });
      c.save(); c.globalAlpha = clamp(ss(1.4, 2.8, lt)); c.fillStyle = 'rgba(26,26,28,.76)';
      c.font = '28px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('恐其造反，召来同饮', 960, 790); c.restore();
    });
    Z.bigText(c, '召李逵', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 黑旋风，甘心同死——李逵饮下同样的酒
SCENES['le8_tongyin'] = (() => {
  const p = () => Z.paper('le8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.hall(c, 980, 900, 1.1, { tone: 0.88, seed: 81 });
      Z.ground(c, 900, { seed: 82, tone: 0.36 });
      Z.songjiang(c, 700, 892, 1.5, t, { official: 0, crown: 1, flip: 1, raise: 0.1 });
      Z.likui(c, 1180, 892, 1.58, t, { axe: 0, drink: clamp(ss(0.6, 2.2, lt)) });
      c.save(); const a8 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a8;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('生时服侍哥哥，死亦同死', 960, 122); c.restore();
    });
    Z.bigText(c, '同死', { x: 1760, y: 120, size: 48, tone: 0.94, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑨ 吴用花荣，同缢蓼儿洼：楚州荒洼、双松、宋江墓、两条垂落的缢绳
SCENES['le9_shuangyi'] = (() => {
  const p = () => Z.paper('le9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.04, 1.0, clamp(lt / 3.6)) };
    CAM.with(c, cam, (c) => {
      // 荒洼：远山压低、地坡、两棵松
      Z.mountains(c, c, -60, 1980, [{ y0: 430, amp: 150, tone: 0.28, seed: 91 }]);
      Z.ground(c, 900, { seed: 92, tone: 0.34 });
      Z.pine(c, t, { x: 520, y: 760, s: 1.2, seed: 93, tone: 0.66 });
      Z.pine(c, t, { x: 1400, y: 760, s: 1.2, seed: 94, tone: 0.66 });
      // 宋江墓（中）
      Z.songmu(c, 960, 880, 1.0, t, { seed: 95 });
      // 吴用、花荣在墓前诀别（kneel 跪、hurt 黯然）
      const a = clamp(ss(0.4, 2.4, lt));
      Z.wuyong(c, 700, 900, 1.4, t, { fan: 1, hurt: 1, kneel: a });
      Z.huarong(c, 1230, 900, 1.4, t, { crown: 1, bow: 0, hurt: 1, kneel: a });
      // 两条缢绳：自松顶垂落，环在二人颈侧（墨线，非朱砂）
      // 吴用头约 (700, 900-162*1.4-38*1.4)= (700, 900-227-53)= (700,620)；花荣头约 (1230, 900-152*1.4-26*1.4)=(1230, 900-213-36)=(1230,651)
      const k = clamp(ss(1.0, 3.0, lt));
      Z.yiRope(c, 520, 360, 700, 624, t, { seed: 96 });
      Z.yiRope(c, 1400, 360, 1230, 655, t, { seed: 97 });
      c.save(); c.globalAlpha = k; c.fillStyle = 'rgba(26,26,28,.8)';
      c.font = '30px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('吴用花荣，同缢蓼儿洼', 960, 480); c.restore();
    });
    Z.bigText(c, '双缢', { x: 1760, y: 120, size: 48, tone: 0.94, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑩ 收束：一百单八将，十亡其八——朱砂「梁山」钤印
SCENES['le10_shou'] = (() => {
  const p = () => Z.paper('le10', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: 1.0 };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 460, amp: 170, tone: 0.3, seed: 101 }]);
      Z.ground(c, 900, { seed: 102, tone: 0.36 });
      Z.cloud(c, t, { x: 520, y: 200, s: 1.0, seed: 103, tone: 0.3 });
      Z.cloud(c, t, { x: 1420, y: 260, s: 0.9, seed: 104, tone: 0.28 });
      Z.songmu(c, 960, 880, 1.05, t, { seed: 105 });
      // 荒洼里散落的几点：远去的兄弟（剪影）
      for (let i = 0; i < 4; i++) Z.fighter(c, 360 + i * 160, 900, 0.5, t, { tone: 0.4, seed: 110 + i });
      c.save(); c.globalAlpha = clamp(ss(0.6, 2.4, lt)); c.fillStyle = 'rgba(26,26,28,.82)';
      c.font = '34px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('一百单八将，十亡其八', 960, 470);
      c.font = '24px "LXGWWenKai-500"'; c.fillStyle = 'rgba(26,26,28,.62)';
      c.fillText('招安不是归处，蓼儿洼才是', 960, 520); c.restore();
    });
    Z.bigText(c, '蓼儿洼', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 130, 800, '梁山', clamp(ss(0.8, 2.6, lt)), { size: 36 });
  } };
})();
})();
