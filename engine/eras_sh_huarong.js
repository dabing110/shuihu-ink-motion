// 《水浒传·花荣》段落表（SH-17）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：清风寨知寨 → 梁山射雁 → 三箭连中 → 祝家庄射灯 → 江州劫法场
//       → 破辽射将 → 征方腊 → 与吴用同缢于蓼儿洼宋江墓前。
// 依《水浒传》第三十三、三十五、四十、四十八、八十七回及百回本末回：
//   花荣，青州清风寨知寨，「齿白唇红双眼俊，两眉入鬓常清」，一张弓箭无虚发，绰号小李广，
//   梁山排名第九（天英星）。宋江死后，与吴用同缢于楚州蓼儿洼宋江墓前。
// 版本辨伪：花荣为累积型文学形象，正史无其人；「梁山射雁」「祝家庄射灯」均出百回本情节。
// 视觉主线：弓（搭箭）+ 朱砂箭羽（全片唯一彩）+ 银枪 + 束发冠。
// 唯一的彩：朱砂只用于箭羽 与 第八幕「小李广」钤印——余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/huarong.js', 'scenes/songjiang.js', 'scenes/wuyong.js'];
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
  { id: 'hr1_qingfeng', dur: 3.0,
    counter: col('青州', '清风寨知寨') },

  { id: 'hr2_sheyan', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('梁山泊', '一箭射雁') },

  { id: 'hr3_sanma', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('演武场', '三箭连中') },

  { id: 'hr4_zhujia', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('祝家庄', '一箭射灯') },

  { id: 'hr5_fachang', dur: 3.2, transition: { type: 'whip', dur: 0.38 },
    counter: col('江州', '劫法场') },

  { id: 'hr6_po', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('幽州', '破辽射将') },

  { id: 'hr7_fangla', dur: 3.0, transition: { type: 'redWedge', dur: 0.38 },
    counter: col('江南', '征方腊') },

  { id: 'hr8_zijin', dur: 3.8, transition: { type: 'ripple', dur: 0.46 },
    counter: col('蓼儿洼', '自缢墓前') },
];
