// 《水浒传·吴用》段落表（SH-13）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：东溪村私塾先生 → 智取生辰纲（献蒙汗药酒之计） → 说三阮入伙 → 智赚卢俊义
//       → 梁山军师 → 智取大名府（火攻破城） → 主导招安 → 宋江墓前自缢（与花荣同死）。
// 依《水浒传》第十四至百回本系统：吴用，表字学究，道号加亮先生，郓城县东溪村私塾先生，梁山军师中排行第三（天机星）。
//   黄泥冈献计智取生辰纲；说阮氏三雄入伙；假扮算命先生题反诗智赚卢俊义；坐镇忠义堂为军师；
//   定计破大名府救卢俊义石秀；力主招安（妥协之始）；宋江被赐死后，与花荣于宋江墓前自缢而亡。
// 版本辨伪：吴用为累积型文学形象，正史无其人。
// 视觉主线：儒巾（学者冠）+ 长袍 + 羽扇（智多星 signature）；母题：① 羽扇 ② 谋略（北斗/星点示意，不施色）③ 替天行道旗。
// 唯一的彩：朱砂只用于第五幕梁山军师之钤印（智多星军师令）——全片一处，余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/wuyong.js'];
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
  { id: 'wu1_sishu', dur: 3.0,
    counter: col('东溪村', '私塾先生') },

  { id: 'wu2_shengchen', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('黄泥冈', '智取生辰纲') },

  { id: 'wu3_shuanruan', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('说三阮', '双掌连环计') },

  { id: 'wu4_zhuanlu', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('卢府', '智赚卢俊义') },

  { id: 'wu5_junshi', dur: 3.2, transition: { type: 'whip', dur: 0.34 },
    counter: col('忠义堂', '梁山军师') },

  { id: 'wu6_daming', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.44 },
    counter: col('大名府', '火攻破城') },

  { id: 'wu7_zhaoan', dur: 3.0, transition: { type: 'redWedge', dur: 0.36 },
    counter: col('梁山泊', '主导招安') },

  { id: 'wu8_zijin', dur: 3.8, transition: { type: 'ripple', dur: 0.5 },
    counter: col('宋江墓', '自缢而死') },
];
