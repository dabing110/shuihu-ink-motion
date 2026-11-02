// 《水浒传·林冲·梁山终局》八幕（SH-08）：宋元版画线描 + 焦墨。承接 SH-01《林冲》「雪夜上梁山」之后。
// 复用 Z.linchong（主角贯穿）/ Z.songjiang（招安幕）/ Z.wusong（六和寺幕）+ 版画笔法库 sh_common。
// 为避免与 linchong.js 顶层 const 声明冲突：本文件一律用 window.Z / window.U，本地仅在函数/IIFE 作用域声明。
const S = window.SCENES = window.SCENES || {};

// 群像立影（背景，低墨）：铁线描几笔勾出人形，避免引入未定义 rig。
window.Z.throng = function (c, x, y, s, t, n, o) {
  const Z = window.Z;
  const { tone = 0.42, seed = 50 } = o || {};
  for (let i = 0; i < n; i++) {
    const bx = x + (i - (n - 1) / 2) * 132 * s;
    const bob = Math.sin(t * 1.2 + i) * 1.6;
    Z.lined(c, [[bx - 15 * s, y + bob], [bx - 17 * s, y - 118 * s], [bx - 9 * s, y - 150 * s], [bx, y - 162 * s], [bx + 9 * s, y - 150 * s], [bx + 17 * s, y - 118 * s], [bx + 15 * s, y + bob]],
      { w: 2.4, tone, seed: 60 + i, taper: 0.05 });
    Z.wire(c, [[bx - 17 * s, y - 118 * s], [bx - 30 * s, y - 64 * s], [bx - 26 * s, y + bob]], { w: 2, tone: tone * 0.85, seed: 160 + i });
    Z.wire(c, [[bx + 17 * s, y - 118 * s], [bx + 30 * s, y - 64 * s], [bx + 26 * s, y + bob]], { w: 2, tone: tone * 0.85, seed: 260 + i });
  }
};

// 空交椅（王伦被逐，位空）：版画的椅要直角准。
window.Z.chair = function (c, x, y, s, o) {
  const Z = window.Z;
  const { tone = 0.7, seed = 1 } = o || {};
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-44, 0], [-44, -118], [44, -118], [44, 0]], { w: 3, tone, seed });
  Z.wire(c, [[-34, -118], [-34, -190], [34, -190], [34, -118]], { w: 2.6, tone, seed: seed + 1 });
  Z.wire(c, [[-44, 0], [-58, 10]], { w: 2.6, tone, seed: seed + 2 });
  Z.wire(c, [[44, 0], [58, 10]], { w: 2.6, tone, seed: seed + 3 });
  c.restore();
};

// 病榻
window.Z.couch = function (c, x, y, s, o) {
  const Z = window.Z;
  const { tone = 0.72, seed = 1 } = o || {};
  c.save(); c.translate(x, y); c.scale(s, s);
  Z.wire(c, [[-168, 0], [168, 0]], { w: 3.2, tone, seed });
  Z.wire(c, [[-168, 0], [-168, -40]], { w: 3.2, tone, seed: seed + 1 });
  Z.wire(c, [[168, 0], [168, -40]], { w: 3.2, tone, seed: seed + 2 });
  Z.wire(c, [[-168, -40], [-168, -52], [168, -52], [168, -40]], { w: 2.6, tone, seed: seed + 3 });
  Z.hatchBox(c, [[-168, 0], [168, 0], [168, -52], [-168, -52]], { ang: -0.4, gap: 13, tone: 0.12, seed: seed + 4 });
  c.restore();
};

const LC = (c, x, y, s, t, o) => window.Z.linchong(c, x, y, s, t, o);

// ============================== 八幕 ==============================
// ① 火并王伦：上梁山后第一桩事。林冲挺枪立于堂前，王伦之位空出，众头领侧立。
S['l21_huobing'] = (() => {
  const Z = window.Z, U = window.U; const { clamp, ss, lerp } = U;
  const p = () => Z.paper('l21', '#e8e6de');
  return { draw(c, lt, t) {
    c.drawImage(p(), 0, 0);
    Z.roof(c, 960, 360, 760, 96, { tone: 0.8, seed: 3 });          // 忠义堂檐
    Z.chair(c, 1560, 720, 1.0, { tone: 0.5, seed: 9 });            // 王伦空位（被逐）
    Z.throng(c, 1560, 884, 0.7, t, 4, { seed: 40, tone: 0.4 });    // 众头领侧立
    Z.flag(c, 360, 720, 200, t, { text: '替天行道', seed: 21, size: 32 });  // 初立之旗
    const wk = clamp(ss(0.2, 1.4, lt));
    LC(c, lerp(700, 980, wk), 900, 1.32, t, { armor: 1, spear: 1, firm: 1, flip: 0, raise: 0.5 * wk });
    Z.bigText(c, '火并王伦', { x: 1700, y: 120, size: 50, tone: 0.86, appear: clamp(ss(0.3, 1.2, lt)) });
    Z.seal(c, 120, 900, '豹子头', clamp(ss(0.3, 1.3, lt)));
  } };
})();

// ② 梁山聚义：替天行道大旗展开，一百单八将排座次，林冲为马军五虎将之首、天罡第六。
S['l22_juyi'] = (() => {
  const Z = window.Z, U = window.U; const { clamp, ss, lerp } = U;
  const p = () => Z.paper('l22', '#e8e6de');
  return { draw(c, lt, t) {
    c.drawImage(p(), 0, 0);
    Z.mountains(c, c, -60, 1980, [{ y0: 560, amp: 110, tone: 0.45, seed: 31 }]);
    Z.ground(c, 920, { seed: 12, tone: 0.4 });
    Z.flag(c, 980, 820, 320, t, { text: '替天行道', seed: 21, size: 38 });   // 大旗
    Z.throng(c, 980, 900, 0.66, t, 6, { seed: 44, tone: 0.4 });               // 一百单八将群像
    const wk = clamp(ss(0.2, 1.4, lt));
    LC(c, 980, 900, 1.3, t, { armor: 1, spear: 0, raise: 0.2 * wk, firm: 1 });
    Z.bigText(c, '梁山聚义', { x: 1700, y: 120, size: 50, tone: 0.86, appear: clamp(ss(0.3, 1.2, lt)) });
    Z.seal(c, 120, 900, '天罡六', clamp(ss(0.3, 1.3, lt)));
  } };
})();

// ③ 受招安：宋江主导，林冲随众受招安。宋江执招文袋（诏书意象），林冲挺枪。
S['l23_zhaoan'] = (() => {
  const Z = window.Z, U = window.U; const { clamp, ss, lerp } = U;
  const p = () => Z.paper('l23', '#e8e6de');
  return { draw(c, lt, t) {
    c.drawImage(p(), 0, 0);
    Z.ground(c, 920, { seed: 13, tone: 0.4 });
    Z.flag(c, 1500, 720, 200, t, { text: '顺天护国', seed: 22, size: 30 });   // 招安后旗号
    const wk = clamp(ss(0.2, 1.3, lt));
    Z.songjiang(c, 700, 900, 1.25, t, { official: 1, hat: 1, bag: 1, flip: 0 });
    LC(c, 1180, 900, 1.32, t, { armor: 1, spear: 1, firm: 1, flip: 0, raise: 0.3 * wk });
    Z.bigText(c, '受招安', { x: 1700, y: 120, size: 50, tone: 0.86, appear: clamp(ss(0.3, 1.2, lt)) });
    Z.seal(c, 120, 900, '忠义', clamp(ss(0.3, 1.3, lt)));
  } };
})();

// ④ 征方腊：江南战场，林冲屡立战功，兄弟却渐凋零。
S['l24_fangla'] = (() => {
  const Z = window.Z, U = window.U; const { clamp, ss, lerp } = U;
  const p = () => Z.paper('l24', '#e8e6de');
  return { draw(c, lt, t) {
    c.drawImage(p(), 0, 0);
    Z.mountains(c, c, -60, 1980, [{ y0: 540, amp: 130, tone: 0.5, seed: 33 }]);
    Z.ground(c, 920, { seed: 14, tone: 0.4 });
    Z.throng(c, 1450, 900, 0.66, t, 3, { seed: 55, tone: 0.45 });             // 敌影
    Z.flame(c, 1660, 840, 1, t, { seed: 7, tone: 0.7 });                       // 战火
    const wk = clamp(ss(0.2, 1.3, lt));
    LC(c, lerp(400, 760, wk), 900, 1.34, t, { armor: 1, spear: 1, firm: 1, flip: 0, raise: 0.6 * wk });
    Z.bigText(c, '征方腊', { x: 1700, y: 120, size: 50, tone: 0.86, appear: clamp(ss(0.3, 1.2, lt)) });
    Z.seal(c, 120, 900, '五虎首', clamp(ss(0.3, 1.3, lt)));
  } };
})();

// ⑤ 杭州染病：班师杭州，林冲染患风瘫，留养六和寺。
S['l25_ganbing'] = (() => {
  const Z = window.Z, U = window.U; const { clamp, ss, lerp } = U;
  const p = () => Z.paper('l25', '#e8e6de');
  return { draw(c, lt, t) {
    c.drawImage(p(), 0, 0);
    Z.barrack(c, 1500, 580, 1.3, { seed: 6 });                                 // 六和寺（远景）
    Z.couch(c, 960, 760, 1.0, { tone: 0.72, seed: 1 });                        // 病榻
    Z.flame(c, 720, 720, 0.7, t, { seed: 6, tone: 0.6 });                       // 榻边摇曳灯
    LC(c, 960, 760, 1.2, t, { armor: 1, spear: 0, kneel: 1, hurt: 1, flip: 0 });  // 倚榻染病
    Z.bigText(c, '杭州染病', { x: 1700, y: 120, size: 46, tone: 0.86, appear: clamp(ss(0.3, 1.2, lt)) });
    Z.seal(c, 120, 900, '风瘫', clamp(ss(0.3, 1.3, lt)));
  } };
})();

// ⑥ 六和寺养病：武松伴护榻前，半年，潮信几度起落（呼应鲁智深听潮圆寂、武松同终此寺）。
S['l26_liuhe'] = (() => {
  const Z = window.Z, U = window.U; const { clamp, ss, lerp } = U;
  const p = () => Z.paper('l26', '#e8e6de');
  return { draw(c, lt, t) {
    c.drawImage(p(), 0, 0);
    Z.barrack(c, 1500, 560, 1.4, { seed: 7 });                                 // 寺
    Z.couch(c, 1180, 760, 1.0, { tone: 0.72, seed: 2 });
    Z.flame(c, 1480, 700, 0.8, t, { seed: 8, tone: 0.6 });                       // 佛前长明灯
    LC(c, 1180, 760, 1.15, t, { armor: 1, spear: 0, kneel: 1, hurt: 1, flip: 1 });  // 林冲卧
    Z.wusong(c, 760, 900, 1.1, t, { hood: 1, beads: 1, sit: 1, flip: 0 });     // 武松趺坐伴护
    Z.bigText(c, '六和寺', { x: 1700, y: 120, size: 50, tone: 0.86, appear: clamp(ss(0.3, 1.2, lt)) });
    Z.seal(c, 120, 900, '伴护', clamp(ss(0.3, 1.3, lt)));
  } };
})();

// ⑦ 病逝追封：风瘫难起，林冲病逝，追封忠武郎（朱砂印）。
S['l27_bishi'] = (() => {
  const Z = window.Z, U = window.U; const { clamp, ss, lerp } = U;
  const p = () => Z.paper('l27', '#e8e6de');
  return { draw(c, lt, t) {
    c.drawImage(p(), 0, 0);
    Z.barrack(c, 1500, 560, 1.3, { seed: 8 });
    Z.couch(c, 960, 760, 1.0, { tone: 0.7, seed: 3 });
    Z.flame(c, 1320, 740, 0.7, t, { seed: 9, tone: 0.6 });                       // 榻边烛
    LC(c, 960, 760, 1.2, t, { armor: 1, spear: 0, kneel: 1, hurt: 1, flip: 0 });   // 病逝
    Z.seal(c, 1300, 600, '忠武郎', clamp(ss(0.3, 1.3, lt)));                        // 追封朱砂印
    Z.bigText(c, '病逝追封', { x: 1700, y: 120, size: 46, tone: 0.86, appear: clamp(ss(0.3, 1.2, lt)) });
  } };
})();

// ⑧ 忠义长存：空堂 + 花枪 + 雪（呼应 SH-01 结尾），豹子头之名长留忠义堂上。
S['l28_zhonghun'] = (() => {
  const Z = window.Z, U = window.U; const { clamp, ss, lerp } = U;
  const p = () => Z.paper('l28', '#e8e6de');
  return { draw(c, lt, t) {
    c.drawImage(p(), 0, 0);
    Z.roof(c, 960, 360, 700, 90, { tone: 0.7, seed: 4 });                       // 忠义堂檐
    Z.flag(c, 1500, 760, 240, t, { text: '替天行道', seed: 23, size: 34 });
    Z.snow(c, t, { n: 170, seed: 5, speed: 1.5, tone: 0.55 });                   // 雪（呼应 SH-01 结尾，增强）
    Z.flame(c, 1000, 880, 0.85, t, { seed: 6, tone: 0.55 });                     // 忠义堂烛
    LC(c, 760, 900, 1.3, t, { armor: 1, spear: 1, firm: 1, flip: 0 });           // 英雄立于堂前
    Z.bigText(c, '忠义长存', { x: 1700, y: 120, size: 50, tone: 0.86, appear: clamp(ss(0.3, 1.2, lt)) });
    Z.seal(c, 120, 900, '豹子头', clamp(ss(0.3, 1.3, lt)));
  } };
})();
