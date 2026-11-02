// 《水浒传·呼延灼》段落表（SH-26）：宋元版画线描 + 焦墨。九幕 29.20s。
// 弧光：名将之后 → 连环马征梁山 → 梁山无计 → 钩镰枪破阵 → 兵败投青州 →
//       三山聚义归顺 → 五虎第四南征 → 南征北讨 → 抗金死难。
// 依《水浒传》第五十四至五十八回、第一百十九回；《说岳全传》抗金战死一节。
//   呼延灼，并州太原人氏，开国名将呼延赞嫡派子孙，汝宁郡都统制，使两条铜鞭，
//   绰号「双鞭」，梁山排名第八（天威星），马军五虎将第四。
// 版本辨伪：呼延灼为文学虚构人物；「授御营兵马指挥使」出百回本末回，
//   「抗金战死」出自清人《说岳全传》，非《水浒》正文——末幕已作标注。
// 视觉主线：双鞭（朱砂缠绳）+ 连环马阵 + 重甲。
// 唯一的彩：朱砂只用于① 鞭梢缠绳 ② 第九幕的血光 ③ 末幕「双鞭」钤印。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/huyanzhuo.js', 'scenes/songjiang.js'];
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
  { id: 'hyz1_mingjiang', dur: 3.0,
    counter: col('汝宁郡', '名将之后') },

  { id: 'hyz2_lianhuan', dur: 3.2, transition: { type: 'smash', dur: 0.4 },
    counter: col('征剿梁山', '连环马阵') },

  { id: 'hyz3_pozhen', dur: 3.0, transition: { type: 'whip', dur: 0.38 },
    counter: col('水泊', '梁山无计') },

  { id: 'hyz4_pozhen2', dur: 3.2, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('阵前', '钩镰破阵') },

  { id: 'hyz5_qingzhou', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('青州', '兵败投奔') },

  { id: 'hyz6_guishun', dur: 3.2, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('青州', '归顺梁山') },

  { id: 'hyz7_wuhu', dur: 3.0, transition: { type: 'ripple', dur: 0.4 },
    counter: col('梁山', '五虎第四') },

  { id: 'hyz8_zhengla', dur: 3.2, transition: { type: 'redWedge', dur: 0.4 },
    counter: col('江南', '南征北讨') },

  { id: 'hyz9_kangjin', dur: 3.4, transition: { type: 'dotBloom', dur: 0.44 },
    counter: col('御营', '马革裹尸') },
];
