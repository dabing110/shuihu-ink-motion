// 《水浒传·孙二娘》rig + 十幕（宋元版画线描 + 焦墨）。十幕 33.60s。
// 造型：孟州十字坡人，绰号「母夜叉」，丈夫张青（菜园子），开酒店。
//   特征：① 包髻 + 鬓角散发缕（泼辣野性）② 夜叉锯齿纹围裙（signature）③ 剔骨尖刀（短刃，非长柄朴刀）④ 腰封「夜」字。
//   唯一的彩：朱砂只用于① 十字坡酒幌淡朱底（Z.flag 内置）② 聚义幕地壮星小星 ③ 末幕「母夜叉」钤印——余皆黑白灰。
//   ★调性红线：十字坡「人肉包子」全片留白暗写（蒸笼白气 / 后厨门洞暗影 / 蒙汗药酒碗侧写），
//     绝不直白血腥（借鉴皮影武松鸳鸯楼留白经验）。全片不用血光朱砂，改以「星位朱砂」象征，更干净。
// 母题：① 剔骨刀 ② 夜叉纹围裙 ③ 十字坡酒幌 ④ 蒸笼白气。
// 弧光：十字坡开酒店 → 武松发配过路 → 药酒藏机被察觉 → 将计就计反制夜叉 → 张青归来劝和 →
//       义结金兰 → 荐投二龙山 → 并入梁山 → 排座次地壮星 → 母夜叉之名不让须眉。
// 依《水浒传》第二十七回（母夜叉孟州道卖人肉、武都头十字坡遇张青）、第五十八回（三山聚义）后排座次。
// 考据：孙二娘为小说人物，张青（菜园子）之妻；武松杀嫂后发配孟州过十字坡，识破蒙汗药反制，张青劝和结拜；
//   张青荐武松投二龙山（鲁智深、杨志），后孙二娘张青亦上二龙山，三山聚义并入梁山；孙二娘排地壮星，第一百〇三位。
(() => {
const { clamp, lerp, ss, rng, ease } = U, P = PAINT, Z = window.Z;
const W = 1920, H = 1080;

// ============================== 小件 ==============================
// 剔骨尖刀（signature：短柄 + 柳叶尖刃，全片黑白；与顾大嫂的长柄朴刀区分）
Z.tiguDao = (c, x, y, s, { tone = 0.9, seed = 1, raise = 0 } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.save(); c.rotate(-0.15 - raise * 0.4);
  Z.wire(c, [[0, 34], [0, 4]], { w: 5, tone: tone * 0.85, seed, taper: 0.08 });   // 短柄
  Z.wire(c, [[-6, 4], [6, 4]], { w: 4, tone, seed: seed + 1 });                     // 护手
  const blade = [[-6, 4], [-9, -30], [-4, -66], [3, -86], [8, -60], [7, -26], [6, 4]];
  c.save();
  c.fillStyle = 'rgba(26,26,28,.2)';
  c.beginPath(); blade.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill();
  c.restore();
  Z.wire(c, blade, { w: 2.8, tone, seed: seed + 2, taper: 0.06 });
  Z.wire(c, [[-4, -66], [3, -86], [7, -26]], { w: 1.4, tone: tone * 0.6, seed: seed + 3 }); // 刃线
  c.restore();
  c.restore();
};

// 蒸笼白气（十字坡留白母题：只见白气与门洞暗影，不见具体物）
// col：深色门洞里用纸白线画"白气"（留白），浅纸上用默认深墨线
Z.steam = (c, x, y, t, { seed = 1, n = 3, tone = 0.45, col = null } = {}) => {
  for (let k = 0; k < n; k++) {
    const ox = x + k * 34, ph = t * 1.4 + k * 1.7 + seed;
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const u = i / 6;
      pts.push([ox + Math.sin(ph + u * 3) * 16 * u, y - u * 115]);
    }
    Z.wire(c, pts, { w: 2.4, tone: tone * (1 - k * 0.1), seed: 900 + seed * 11 + k, taper: 0.5, col });
  }
};

// ============================== 孙二娘本体 ==============================
// o: { blade剔骨刀, apron围裙, flip, raise举刀, kneel, caught被制, hurt, tone }
Z.sunerniang = (c, x, y, s, t, o = {}) => {
  const { blade = 1, apron = 1, flip = 0, raise = 0, kneel = 0, caught = 0, hurt = 0, tone = 0.9 } = o;
  const br = Math.sin(t * 1.4) * 2.2;
  c.save();
  c.translate(x, y);
  c.scale(flip ? -s : s, s);
  const ly = -(kneel ? 46 : 0);
  const shoulderY = ly - 156;
  const waistY = ly - 78;
  const hipY = ly - 26;

  // ---- 下身：裤（市井）----
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

  // ---- 夜叉纹围裙（signature：围裙 + 叉形锯齿纹）----
  if (apron) {
    const ap = [[-46, hipY - 8], [-52, ly - 6], [52, ly - 6], [46, hipY - 8]];
    Z.lined(c, ap, { w: 3.2, tone: tone * 0.92, seed: 35, hatch: 0.22, gap: 10, hatchAng: -0.5 });
    Z.wire(c, [[-46, hipY - 8], [46, hipY - 8]], { w: 2.4, tone: 0.8, seed: 36 });
    // 夜叉纹：围裙下摆一排叉形锯齿（signature 纹样）
    for (let i = 0; i < 5; i++) {
      const bx = -34 + i * 17;
      Z.wire(c, [[bx, ly - 18], [bx + 8, ly - 30], [bx + 16, ly - 18]], { w: 1.8, tone: tone * 0.7, seed: 40 + i, taper: 0.1 });
    }
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
  // 腰封「夜」字徽记（signature 文字化）
  c.save(); c.fillStyle = 'rgba(26,26,28,.72)'; c.font = '28px "LXGWWenKai-500"';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('夜', 0, waistY + 11); c.restore();

  // ---- 双臂（caught 时双手被扭到身前）----
  const handY = shoulderY + 52 - raise * 46 + caught * 24;
  if (caught) {
    Z.wire(c, [[-52, shoulderY + 12], [-70, shoulderY + 40], [-58, handY + 18]], { w: 3.8, tone, seed: 60, taper: 0.1 });
    Z.wire(c, [[52, shoulderY + 12], [70, shoulderY + 40], [58, handY + 18]], { w: 3.8, tone, seed: 61, taper: 0.1 });
    Z.wire(c, [[-58, handY + 14], [58, handY + 14]], { w: 2.6, tone: tone * 0.85, seed: 62 }); // 被缚的横绳
  } else {
    Z.wire(c, [[-52, shoulderY + 12], [-86, shoulderY + 38], [-78, handY + 6]], { w: 3.8, tone, seed: 60, taper: 0.1 });
    Z.wire(c, [[52, shoulderY + 12], [86, shoulderY + 34 - raise * 26], [78, handY - raise * 30]], { w: 3.8, tone, seed: 61, taper: 0.1 });
    Z.lined(c, [[-78, handY + 4], [-64, handY + 20], [-52, handY + 6], [-62, handY - 8]], { w: 2.2, tone: tone * 0.85, seed: 64 });
    Z.lined(c, [[78, handY - 6], [64, handY + 10], [52, handY - 4], [62, handY - 18]], { w: 2.2, tone: tone * 0.85, seed: 65 });
  }

  // ---- 头（包髻 + 吊梢眉 + 鬓角散发缕：比顾大嫂更泼辣野性）----
  const hy = shoulderY - 40 + br * 0.5 + hurt * 6;
  const face = [[-21, hy - 12], [-19, hy - 36], [0, hy - 48], [19, hy - 36], [21, hy - 12], [19, hy + 12], [0, hy + 24], [-19, hy + 10]];
  Z.lined(c, face, { w: 2.6, tone: tone * 0.95, seed: 100, hatch: 0.06, gap: 9 });
  // 颈（连接头与肩，避免头身悬空）
  Z.wire(c, [[-11, hy + 20], [-13, hy + 46]], { w: 2.6, tone, seed: 106 });
  Z.wire(c, [[11, hy + 20], [13, hy + 46]], { w: 2.6, tone, seed: 107 });
  // 吊梢眉（外挑上扬，凶相）
  Z.wire(c, [[-16, hy - 14], [-8, hy - 22], [-2, hy - 20]], { w: 2.4, tone, seed: 101 });
  Z.wire(c, [[2, hy - 20], [8, hy - 22], [16, hy - 14]], { w: 2.4, tone, seed: 102 });
  Z.wire(c, [[-13, hy - 8], [-4, hy - 7]], { w: 2, tone, seed: 103 });
  Z.wire(c, [[4, hy - 7], [13, hy - 8]], { w: 2, tone, seed: 104 });
  Z.wire(c, [[-6, hy + 5], [6, hy + 4]], { w: 2, tone: tone * 0.8, seed: 105 });
  // 包髻（顶圆髻 + 扎巾）
  Z.lined(c, [[-22, hy - 30], [-18, hy - 58], [18, hy - 58], [22, hy - 30]], { w: 2.6, tone: 0.9, seed: 130, hatch: 0.2, gap: 6 });
  Z.wire(c, [[-14, hy - 58], [0, hy - 72], [14, hy - 58]], { w: 2.4, tone: 0.9, seed: 131 });
  Z.wire(c, [[-20, hy - 30], [-32, hy - 4]], { w: 2, tone: 0.8, seed: 132 });
  Z.wire(c, [[20, hy - 30], [32, hy - 4]], { w: 2, tone: 0.8, seed: 133 });
  // 鬓角散发缕（野性，signature 差异点）
  Z.wire(c, [[-21, hy - 16], [-30, hy + 2], [-26, hy + 22]], { w: 1.8, tone: tone * 0.8, seed: 134 });
  Z.wire(c, [[21, hy - 16], [30, hy + 2], [26, hy + 22]], { w: 1.8, tone: tone * 0.8, seed: 135 });

  // ---- 手持剔骨刀：必须在 c.restore() 之前 ----
  if (blade && !caught) Z.tiguDao(c, 80, handY - 4, 1.0, { tone, seed: 170, raise: 0.3 + raise * 0.7 });
  c.restore();
};

// ============================== 十幕 ==============================

// ① 十字坡开酒店：孟州道十字坡，孙家店幌（朱砂淡朱底），母夜叉持剔骨刀
SCENES['s1_shipo'] = (() => {
  const p = () => Z.paper('s1', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 150, tone: 0.32, seed: 11 }]);
      Z.ground(c, 900, { seed: 12, tone: 0.4 });
      Z.manor(c, 1500, 892, 0.8, { tone: 0.84, seed: 13, text: '十字坡' });
      Z.flag(c, 360, 540, 200, t, { text: '酒', seed: 15, size: 30 });   // 朱砂淡朱底（器物点缀）
      Z.pine(c, t, { x: 300, y: 892, s: 0.9, seed: 14, tone: 0.7 });
      Z.steam(c, 1300, 720, t, { seed: 3, n: 4, tone: 0.5 });               // 蒸笼白气（母题留白）
      const sw = clamp(Math.sin(t * 2.1) * 0.5 + 0.5);
      Z.sunerniang(c, 820, 892, 1.5, t, { blade: 1, apron: 1, raise: sw * 0.2 });
      for (let i = 0; i < 8; i++) {
        const bx = ((t * 44 + i * 220) % 1980) - 30, by = 360 + ((t * 38 + i * 170) % 420);
        Z.wire(c, [[bx, by], [bx + 12, by + 6]], { w: 1.5, tone: 0.32, seed: 1900 + i, taper: 0.6 });
      }
    });
    Z.bigText(c, '十字坡', { x: 1760, y: 120, size: 46, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ② 武松发配过路：杀嫂后发配孟州，两公人押解过十字坡歇脚
SCENES['s2_guolu'] = (() => {
  const p = () => Z.paper('s2', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 170, tone: 0.44, seed: 21 }]);
      Z.ground(c, 900, { seed: 22, tone: 0.42 });
      Z.manor(c, 1630, 892, 0.86, { tone: 0.84, seed: 23, text: '十字坡' });
      const come = clamp(ss(0.3, 2.6, lt));
      const wx = lerp(560, 820, come);
      // 两公人（helmet + 棍）押解在后
      Z.fighter(c, lerp(400, 660, come), 892, 0.96, t, { helmet: 1, spear: 1, tone: 0.66, seed: 25 });
      Z.fighter(c, lerp(300, 560, come) - 60, 892, 0.9, t, { helmet: 1, tone: 0.6, seed: 26 });
      // 武松（正身，tone 深）
      Z.fighter(c, wx, 892, 1.12, t, { tone: 0.72, seed: 24 });
      // 颈上木枷（发配标识：做成明确的枷板——外框 + 卡颈圆孔 + 排线，别太细读不出）
      c.save();
      const jw = 62, jh = 30, jy = 892 - 182;
      Z.wire(c, [[wx - jw, jy], [wx + jw, jy], [wx + jw, jy + jh], [wx - jw, jy + jh], [wx - jw, jy]], { w: 4.2, tone: 0.88, seed: 27 });
      Z.hatchBox(c, [[wx - jw, jy], [wx + jw, jy], [wx + jw, jy + jh], [wx - jw, jy + jh]], { ang: -1.4, gap: 7, tone: 0.26, seed: 28 });
      // 卡颈圆孔（左右两半枷合缝）
      c.strokeStyle = 'rgba(26,26,28,.85)'; c.lineWidth = 3.2;
      c.beginPath(); c.arc(wx, jy + jh * 0.52, 13, 0, Math.PI * 2); c.stroke();
      Z.wire(c, [[wx, jy + 2], [wx, jy + jh - 2]], { w: 2.6, tone: 0.8, seed: 29 });
      c.restore();
      // 孙二娘立店门迎客
      Z.sunerniang(c, 1300, 892, 1.32, t, { blade: 0, apron: 1, flip: 1 });
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 110 + i * 180) % 1500) + 300, dy = 250 + ((t * 30 + i * 88) % 420);
        Z.wire(c, [[dx, dy], [dx + 26, dy - 5]], { w: 1.8, tone: 0.28, seed: 120 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '发配', { x: 1760, y: 120, size: 48, tone: 0.94, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ③ 药酒藏机（留白核心）：后厨门洞暗影 + 蒸笼白气 + 药酒碗侧写，绝不直白血腥
SCENES['s3_yaojiu'] = (() => {
  const p = () => Z.paper('s3', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 31, tone: 0.4 });
      // 后厨门洞（暗影：焦墨灰块 + 排线，明确的深色暗影，不见具体物——留白核心）
      const door = [[1180, 880], [1180, 540], [1460, 540], [1460, 880]];
      c.save();
      c.beginPath(); door.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath();
      c.fillStyle = 'rgba(26,26,28,0.5)'; c.fill();
      c.clip();
      Z.hatchBox(c, door, { ang: -1.4, gap: 9, tone: 0.35, seed: 33 });
      c.restore();
      Z.wire(c, door, { w: 3.4, tone: 0.82, seed: 32 });
      // 蒸笼白气：深色门洞里用纸白线，才显出"气"（留白核心）
      Z.steam(c, 1240, 730, t, { seed: 5, n: 4, tone: 0.95, col: [252, 251, 246] });
      Z.steam(c, 1380, 748, t, { seed: 6, n: 3, tone: 0.9, col: [252, 251, 246] });
      // 案桌 + 三只立体酒碗（药酒侧写，不画药粉）
      Z.wire(c, [[540, 884], [540, 796], [920, 796], [920, 884]], { w: 3.4, tone: 0.84, seed: 34 });
      Z.hatchBox(c, [[540, 884], [920, 884], [920, 796], [540, 796]], { ang: -1.4, gap: 16, tone: 0.12, seed: 35 });
      for (let i = 0; i < 3; i++) {
        const bx = 610 + i * 120;
        Z.wire(c, [[bx - 26, 796], [bx - 20, 772], [bx + 20, 772], [bx + 26, 796]], { w: 2.8, tone: 0.88, seed: 36 + i });
        Z.wire(c, [[bx - 26, 796], [bx + 26, 796]], { w: 2.4, tone: 0.8, seed: 39 + i });
        Z.wire(c, [[bx - 20, 772], [bx + 20, 772]], { w: 2, tone: 0.72, seed: 42 + i });
      }
      // 孙二娘（倾碗斟酒，不画药粉，留白）
      const pour = clamp(ss(0.6, 2.0, lt));
      c.save(); c.translate(740, 892); c.rotate(pour * 0.06); c.translate(-740, -892);
      Z.sunerniang(c, 740, 892, 1.46, t, { blade: 0, apron: 1, raise: pour * 0.5 });
      c.restore();
      // 武松（立案右，按刀警觉）
      Z.fighter(c, 1060, 892, 1.14, t, { flip: 1, blade: 1, tone: 0.72, seed: 37 });
      // 结句框（早现长持）
      c.save(); const a3 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a3;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('药酒藏机，好汉已察觉', 960, 122); c.restore();
    });
    Z.bigText(c, '药酒', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ④ 将计就计反制夜叉：武松居高俯身按住孙二娘（戏剧张力，不血腥）
SCENES['s4_fanzhi'] = (() => {
  const p = () => Z.paper('s4', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.08, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 41, tone: 0.42 });
      Z.manor(c, 1540, 892, 0.6, { tone: 0.8, seed: 42, text: '十字坡' });
      const grab = clamp(ss(0.3, 1.5, lt));
      // 孙二娘被按倒：绕腰大幅后仰近水平、坠向低位，双手缚前
      c.save();
      c.translate(1080, 892);
      c.rotate(-0.95 * grab);
      c.translate(-1080, -892);
      Z.sunerniang(c, 1080, 892 + 40 * grab, 1.28, t - 0.3, { blade: 0, apron: 1, caught: 1, hurt: grab * 0.3 });
      c.restore();
      // 武松居高俯身、自左压向右
      c.save();
      c.translate(830, 892);
      c.rotate(0.32 * grab);
      c.translate(-830, -892);
      Z.fighter(c, 830, 892 - 26 * grab, 1.24, t, { tone: 0.76, seed: 44 });
      c.restore();
      // 压制臂：自武松肩臂探出、下压按住孙二娘肩头（加粗明确）
      c.save(); c.globalAlpha = clamp(ss(0.4, 1.2, lt));
      Z.wire(c, [[885, 892 - 96], [955, 892 - 128], [1024, 892 - 150]], { w: 5, tone: 0.9, seed: 46, taper: 0.1 });
      Z.lined(c, [[1024, 892 - 162], [1050, 892 - 152], [1042, 892 - 130], [1020, 892 - 140]], { w: 3, tone: 0.86, seed: 47 });
      // 挣扎动势线（被按下的一瞬）
      for (let i = 0; i < 3; i++) Z.wire(c, [[1150 + i * 6, 892 - 70 - i * 26], [1196 + i * 8, 892 - 86 - i * 26]], { w: 2, tone: 0.42, seed: 48 + i, taper: 0.6 });
      c.restore();
      // 明显侧翻的案桌
      c.save(); c.translate(600, 856); c.rotate(0.9); c.translate(-600, -856);
      Z.wire(c, [[510, 856], [510, 804], [740, 804], [740, 856]], { w: 3.2, tone: 0.8, seed: 43 });
      Z.wire(c, [[510, 856], [510, 892]], { w: 2.4, tone: 0.74, seed: 49 });
      c.restore();
      // 剔骨刀脱手横落
      c.save(); c.translate(1320, 902); c.rotate(1.32); c.translate(-1320, -902);
      Z.tiguDao(c, 1320, 902, 0.95, { tone: 0.82, seed: 45, raise: 0 });
      c.restore();
      c.save(); const a4 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a4;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('将计就计，反制母夜叉', 960, 122); c.restore();
    });
    Z.bigText(c, '反制', { x: 1760, y: 120, size: 48, tone: 0.94, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑤ 菜园子张青归来劝和：挑担归来，见状解劝，双方罢手
SCENES['s5_zhangqing'] = (() => {
  const p = () => Z.paper('s5', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.4)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 160, tone: 0.3, seed: 51 }]);
      Z.ground(c, 900, { seed: 52, tone: 0.42 });
      // 张青（挑担归来）
      const back = clamp(ss(0.3, 2.4, lt));
      const zx = lerp(1620, 1340, back);
      Z.fighter(c, zx, 892, 1.1, t, { tone: 0.72, seed: 53 });
      // 扁担 + 垂绳 + 两只箩筐（绳子必须有，否则读成"横杆+孤立方块"）
      const byY = 892 - 152;
      Z.wire(c, [[zx - 132, byY], [zx + 132, byY]], { w: 3.6, tone: 0.86, seed: 54 });
      // 垂绳：扁担两端直连筐口（加粗加深，否则降采样后看不见）
      Z.wire(c, [[zx - 126, byY], [zx - 126, byY + 54]], { w: 3.6, tone: 0.9, seed: 55 });
      Z.wire(c, [[zx + 126, byY], [zx + 126, byY + 54]], { w: 3.6, tone: 0.9, seed: 56 });
      Z.wire(c, [[zx - 126, byY - 6], [zx - 126, byY + 8]], { w: 4.2, tone: 0.92, seed: 105 });
      Z.wire(c, [[zx + 126, byY - 6], [zx + 126, byY + 8]], { w: 4.2, tone: 0.92, seed: 106 });
      // 箩筐（上宽下窄梯形 + 排线，明确是担子）
      for (const sgn of [-1, 1]) {
        const bx = zx + sgn * 126, top = byY + 54, bot = byY + 104;
        Z.wire(c, [[bx - 40, top], [bx + 40, top], [bx + 27, bot], [bx - 27, bot], [bx - 40, top]], { w: 3, tone: 0.84, seed: sgn > 0 ? 58 : 57 });
        Z.hatchBox(c, [[bx - 40, top], [bx + 40, top], [bx + 27, bot], [bx - 27, bot]], { ang: -0.9, gap: 8, tone: 0.22, seed: sgn > 0 ? 60 : 59 });
      }
      // 武松（松手起身）
      Z.fighter(c, 800, 892, 1.12, t, { tone: 0.74, seed: 59 });
      // 孙二娘（起身收势）
      Z.sunerniang(c, 1000, 892, 1.44, t, { blade: 0, apron: 1, flip: 1 });
      c.save(); const a5 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a5;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('菜园子张青，归来劝和', 960, 122); c.restore();
    });
    Z.bigText(c, '劝和', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑥ 义结金兰：张青设酒赔礼，武松与张青结拜，孙二娘认武松为叔
SCENES['s6_jiebai'] = (() => {
  const p = () => Z.paper('s6', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 61, tone: 0.4 });
      // 店内：manor 的 y 是墙底，必须贴地面线 892，否则招牌悬空
      Z.manor(c, 1500, 892, 0.78, { tone: 0.82, seed: 62, text: '十字坡' });
      // 案桌 + 三只酒碗（赔礼酒）
      Z.wire(c, [[700, 880], [700, 800], [1120, 800], [1120, 880]], { w: 3.2, tone: 0.84, seed: 63 });
      Z.hatchBox(c, [[700, 880], [1120, 880], [1120, 800], [700, 800]], { ang: -1.4, gap: 16, tone: 0.12, seed: 64 });
      for (let i = 0; i < 3; i++) {
        const bx = 780 + i * 140;
        Z.wire(c, [[bx - 18, 796], [bx + 18, 796], [bx + 12, 782], [bx - 12, 782], [bx - 18, 796]], { w: 2.4, tone: 0.82, seed: 65 + i });
      }
      // 三人：张青（左）、武松（中）、孙二娘（右）
      Z.fighter(c, 700, 892, 1.06, t, { tone: 0.72, seed: 66 });
      Z.fighter(c, 960, 892, 1.12, t, { tone: 0.76, seed: 67 });
      Z.sunerniang(c, 1220, 892, 1.42, t, { blade: 0, apron: 1, flip: 1 });
      // 中部文字（早现长持）
      c.save(); const a6 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a6;
      c.fillStyle = 'rgba(26,26,28,.74)'; c.font = '32px "LXGWWenKai-500"';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('不打不相识，义结金兰', 960, 300); c.restore();
    });
    Z.bigText(c, '义结', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑦ 荐投二龙山：张青劝武松改投二龙山，孙二娘张青相送
SCENES['s7_erlong'] = (() => {
  const p = () => Z.paper('s7', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.2)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 520, amp: 200, tone: 0.3, seed: 71 }]);
      Z.ground(c, 900, { seed: 72, tone: 0.42 });
      Z.shanzhai(c, 1380, 892, 0.92, { tone: 0.8, seed: 73, text: '二龙山' });
      Z.pine(c, t, { x: 320, y: 892, s: 0.9, seed: 74, tone: 0.66 });
      // 武松（辞别，向右行）
      const go = clamp(ss(0.3, 2.4, lt));
      Z.fighter(c, lerp(620, 880, go), 892, 1.08, t, { tone: 0.74, seed: 75 });
      // 孙二娘、张青（相送）
      Z.sunerniang(c, 500, 892, 1.4, t, { blade: 0, apron: 1 });
      Z.fighter(c, 380, 892, 1.0, t, { tone: 0.7, seed: 76 });
      c.save(); const a7 = clamp(ss(0.5, 1.6, lt)); c.globalAlpha = a7;
      c.fillStyle = 'rgba(232,230,222,.9)'; c.fillRect(540, 96, 840, 52);
      c.strokeStyle = 'rgba(26,26,28,.5)'; c.lineWidth = 1.4; c.strokeRect(540, 96, 840, 52);
      c.fillStyle = 'rgba(26,26,28,.9)'; c.font = '38px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('荐投二龙山，另寻去处', 960, 122); c.restore();
    });
    Z.bigText(c, '荐投', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑧ 同投梁山：二龙山并入梁山，随众上水泊
SCENES['s8_touliang'] = (() => {
  const p = () => Z.paper('s8', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.07, clamp(lt / 3.0)) };
    CAM.with(c, cam, (c) => {
      Z.mountains(c, c, -60, 1980, [{ y0: 500, amp: 200, tone: 0.3, seed: 81 }]);
      Z.ground(c, 900, { seed: 82, tone: 0.42 });
      Z.shanzhai(c, 980, 892, 1.0, { tone: 0.8, seed: 83, text: '梁山' });
      Z.flag(c, 1180, 540, 240, t, { text: '替天行道', seed: 84, size: 36 });
      Z.sunerniang(c, 720, 892, 1.5, t, { blade: 1, apron: 1, raise: clamp(Math.sin(t * 1.6) * 0.2 + 0.25) });
      for (let i = 0; i < 3; i++) Z.fighter(c, 1080 + i * 120, 892, 0.94, t, { tone: 0.7, seed: 85 + i });
      for (let i = 0; i < 10; i++) {
        const dx = ((t * 110 + i * 165) % 1500) + 300, dy = 800 + ((t * 36 + i * 90) % 120);
        Z.wire(c, [[dx, dy], [dx + 28, dy - 6]], { w: 2, tone: 0.38, seed: 1990 + i, taper: 0.9 });
      }
    });
    Z.bigText(c, '投梁山', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.0, lt)) });
  } };
})();

// ⑨ 聚义排座次：地壮星女将（朱砂小星，象征，本片朱砂第二处）
SCENES['s9_juyi'] = (() => {
  const p = () => Z.paper('s9', '#e8e6de');
  return { draw(c, lt, t) {
    const g = p(); c.drawImage(g, 0, 0);
    const cam = { x: 960, y: 560, z: lerp(1.0, 1.06, clamp(lt / 3.6)) };
    CAM.with(c, cam, (c) => {
      Z.ground(c, 900, { seed: 91, tone: 0.38 });
      // 忠义堂放右后方（贴地），主角堂前独立立像——避免山寨压住人物
      Z.shanzhai(c, 1430, 892, 0.74, { tone: 0.8, seed: 92, text: '忠义堂' });
      Z.flag(c, 300, 600, 180, t, { text: '地', seed: 93, size: 30 });
      Z.flag(c, 1660, 620, 180, t, { text: '壮', seed: 94, size: 30 });
      Z.sunerniang(c, 960, 892, 1.52, t, { blade: 1, apron: 1, raise: clamp(ss(0.6, 2.2, lt)) });
      // 星位意象（朱砂小星，克制，象征地壮星入列）
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
      c.fillText('排座次，地壮星女将', 960, 122); c.restore();
    });
    Z.bigText(c, '聚义', { x: 1760, y: 120, size: 48, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
  } };
})();

// ⑩ 收束：母夜叉之名不让须眉——朱砂「母夜叉」钤印（本片朱砂第三处）
SCENES['s10_shou'] = (() => {
  const p = () => Z.paper('s10', '#e8e6de');
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
      Z.sunerniang(c, 960, 892, 1.66, t, { blade: 1, apron: 1, raise: 0.18 });
      c.save(); c.globalAlpha = clamp(ss(0.6, 2.4, lt)); c.fillStyle = 'rgba(26,26,28,.82)';
      c.font = '34px "LXGWWenKai-500"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('母夜叉之名，不让须眉', 960, 386);
      c.font = '24px "LXGWWenKai-500"'; c.fillStyle = 'rgba(26,26,28,.62)';
      c.fillText('水浒女将，孙二娘居其一', 960, 426); c.restore();
    });
    Z.bigText(c, '母夜叉', { x: 1760, y: 120, size: 44, tone: 0.92, appear: clamp(ss(0.2, 1.1, lt)) });
    Z.seal(c, 130, 800, '母夜叉', clamp(ss(0.8, 2.6, lt)), { size: 36 });
  } };
})();
})();
