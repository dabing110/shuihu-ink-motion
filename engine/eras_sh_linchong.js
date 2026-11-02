// 《水浒传·林冲》段落表（SH-01）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：怀刑之名（东京教头）→ 中计（白虎节堂）→ 受辱（刺配沧州）→ 一线（野猪林）→ 隐忍（草料场）
//      → 寒尽（山神庙）→ 爆发（手刃陆谦）→ 转身（雪夜上梁山）。
// 依《水浒传》第七至十一回（容与堂本／贯华堂本第七十回以前本）：东京八十万禁军枪棒教头，妻被高衙内调戏，
//   高俅设局使持刀误入白虎节堂，刺配沧州；道经野猪林，董超薛霸受陆谦嘱托加害，鲁智深救之；
//   至沧州守草料场，风雪，夜宿山神庙，闻陆谦、富安、差拨放火之谋，遂杀三人，投奔梁山（柴进荐书）。
// 演义型虚构辨伪：正史无常有其人；「林冲」其人见于《大宋宣和遗事》与宋元话本残目，是累积型形象。
//   本片依小说系统（七十回本／百回本前段），不混党纪索隐。
// 视觉主线：禁军青袍 + 兜鍪 → 赭囚衣 + 刺面 + 枷 → 毡笠斗篷 + 酒葫芦。花枪贯穿全片。
// 母题：① 花枪（贯穿全片的器物，也是本案中给他定罪的刀的影子）② 雪（越来越大，直至全屏）
//      ③ 枪缨朱砂（唯一的彩）④ 葫芦（仅 lc5-lc6 出现的暖）⑤ 排线密度（随幕推进越来越密＝压抑）
// 互文：鲁智深（lc4 一杖之救）、柴进（lc8 荐书，本片以替天行道旗点出梁山）。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/linchong.js'];
window.COUNTER_IN_TRANSITION = 'cut';
window.PUNCH = 0.02;

const col = (title, sub) => ({
  draw(c, lt) {
    const Z0 = window.Z;
    c.save();
    c.fillStyle = 'rgba(232,230,222,.72)';
    c.fillRect(24, 24, 232, 66);
    c.strokeStyle = 'rgba(26,26,28,.7)'; c.lineWidth = 1.2;
    c.strokeRect(24, 24, 232, 66);
    c.strokeRect(29, 29, 222, 56);
    c.fillStyle = 'rgba(26,26,28,.92)';
    c.font = '26px "LXGWWenKai-500"'; c.textBaseline = 'middle';
    c.fillText(title, 42, 48);
    c.font = '17px "LXGWWenKai-500"';
    c.fillStyle = 'rgba(26,26,28,.62)';
    c.fillText(sub, 42, 74);
    c.restore();
  },
});

window.ERAS = [
  { id: 'lc1_jiaotou', dur: 3.0,
    counter: col('禁军教头', '东京八十万') },

  { id: 'lc2_baihu', dur: 2.8, transition: { type: 'inkBloom', dur: 0.46 },
    counter: col('误入节堂', '高俅设局') },

  { id: 'lc3_ciPei', dur: 3.0, transition: { type: 'blueBrush', dur: 0.4 },
    counter: col('刺配沧州', '赭衣枷锁') },

  { id: 'lc4_yezhulin', dur: 3.0, transition: { type: 'redWedge', dur: 0.34 },
    counter: col('野猪林', '一杖留命') },

  { id: 'lc5_caoliaochang', dur: 3.0, transition: { type: 'lampGlow', dur: 0.4 },
    counter: col('草料场', '风雪沽酒') },

  { id: 'lc6_shanshenmiao', dur: 3.2, transition: { type: 'ripple', dur: 0.42 },
    counter: col('山神庙', '夜闻火谋') },

  { id: 'lc7_sharen', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('手刃三人', '忍无可忍') },

  { id: 'lc8_liangshan', dur: 3.8, transition: { type: 'iris', dur: 0.36 },
    counter: col('雪夜上梁山', '再无回头') },
];
