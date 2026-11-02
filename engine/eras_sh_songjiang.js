// 《水浒传·宋江》段落表（SH-07）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：施予（郓城押司·及时雨）→ 义气（私放晁盖）→ 失控（怒杀阎婆惜）→ 屈辱（刺配江州）
//      → 心声（浔阳楼题反诗）→ 再生（江州劫法场）→ 巅峰（梁山聚义）→ 终局（招安·蓼儿洼御酒）。
// 依《水浒传》第十八至一百二十回（百回本／百二十回本）：郓城县押司，号及时雨、孝义黑三郎 →
//   晁盖等劫生辰纲事发，宋江飞马报信 → 阎婆惜得晁盖书于招文袋，逼之，宋江怒杀之 →
//   流配江州，识戴宗李逵 → 浔阳楼醉题反诗，黄文炳告发，下狱论死 → 晁盖率梁山好汉劫法场救之 →
//   归梁山，聚义一百单八 → 受招安，征方腊后功成，赐御酒而被鸩，葬蓼儿洼。
// 视觉主线：押司皂服＋幞头 → 赭囚衣＋面颊金印＋枷 → 素袍＋冠＋替天行道旗。
// 母题：① 招文袋（秘密／杀机）② 笔（浔阳楼反诗）③ 酒碗（末一杯御酒）④ 排线密度递增 ⑤ 朱砂仅用于印与一刀
// 互文：晁盖（sj2 报信／sj6 相救）、阎婆惜（sj3）、戴宗李逵（sj4／sj6）、林冲（梁山旧影）。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/songjiang.js'];
window.COUNTER_IN_TRANSITION = 'cut';
window.PUNCH = 0.02;

const col = (title, sub) => ({
  draw(c, lt) {
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
  { id: 'sj1_yasi', dur: 3.0,
    counter: col('郓城押司', '及时雨名') },

  { id: 'sj2_chao', dur: 2.8, transition: { type: 'inkBloom', dur: 0.46 },
    counter: col('私放晁盖', '一骑飞书') },

  { id: 'sj3_poxi', dur: 3.0, transition: { type: 'redWedge', dur: 0.34 },
    counter: col('怒杀婆惜', '招文袋里') },

  { id: 'sj4_peijun', dur: 3.0, transition: { type: 'blueBrush', dur: 0.4 },
    counter: col('刺配江州', '金印赭衣') },

  { id: 'sj5_xunyang', dur: 3.2, transition: { type: 'ripple', dur: 0.42 },
    counter: col('浔阳题诗', '敢笑黄巢') },

  { id: 'sj6_fachang', dur: 3.0, transition: { type: 'smash', dur: 0.4 },
    counter: col('江州法场', '斧起再生') },

  { id: 'sj7_juyi', dur: 3.6, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('梁山聚义', '一百单八') },

  { id: 'sj8_liaowa', dur: 3.2, transition: { type: 'iris', dur: 0.42 },
    counter: col('蓼儿洼月', '御酒一杯') },
];
