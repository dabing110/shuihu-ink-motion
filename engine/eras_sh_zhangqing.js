// 《水浒传·张清》段落表（SH-29）：宋元版画线描 + 焦墨。九幕 29.00s。
// 弧光：虎骑出身 → 飞石绝技 → 连打十五将 → 归顺梁山 → 骠骑先锋 →
//       结缡琼英 → 破辽征腊 → 独松关战死 → 身后留名。
// 依《水浒传》第七十回、第九十八回、第一百十五至十六回；《水浒后传》张节抗金一节。
//   张清，彰德府人氏，虎骑出身，擅飞石打人、百发百中，绰号「没羽箭」，
//   梁山排名第十六（天捷星），马军八骠骑兼先锋使。征方腊独松关一役力战而死。
// 版本辨伪：张清为文学虚构人物；娶琼英一节出百二十回本征田虎故事，
//   「子张节随吴玠抗金」出清人《水浒后传》，末幕已作标注。
// 视觉主线：飞石 + 锦袋（朱砂系绳）+ 白袍 + 战马。
// 唯一的彩：朱砂只用于① 锦袋系绳 ② 第八幕的血光点 ③ 末幕「没羽箭」钤印。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/zhangqing.js',
  'scenes/huyanzhuo.js', 'scenes/husanniang.js', 'scenes/songjiang.js'];
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
  { id: 'zq1_chushen', dur: 3.0,
    counter: col('彰德府', '没羽箭') },

  { id: 'zq2_feishi', dur: 3.0, transition: { type: 'whip', dur: 0.36 },
    counter: col('校场', '飞石绝技') },

  { id: 'zq3_shiwu', dur: 3.2, transition: { type: 'smash', dur: 0.36 },
    counter: col('东昌府', '连打十五将') },

  { id: 'zq4_guishun', dur: 3.0, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('梁山', '归顺入伙') },

  { id: 'zq5_piaoqi', dur: 3.0, transition: { type: 'ripple', dur: 0.4 },
    counter: col('江南', '骠骑先锋') },

  { id: 'zq6_qiongying', dur: 3.2, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('河北', '结缡琼英') },

  { id: 'zq7_zhengla', dur: 3.0, transition: { type: 'redWedge', dur: 0.38 },
    counter: col('两京', '破辽征腊') },

  { id: 'zq8_dusong', dur: 3.2, transition: { type: 'radiant', dur: 0.44 },
    counter: col('独松关', '力战而亡') },

  { id: 'zq9_shenhou', dur: 3.4, transition: { type: 'dotBloom', dur: 0.44 },
    counter: col('身后', '一石留名') },
];
