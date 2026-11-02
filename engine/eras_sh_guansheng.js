// 《水浒传·关胜》段落表（SH-21）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：蒲东巡检 → 奉旨征讨梁山 → 围魏救赵攻大名府 → 大战林冲秦明 →
//       中伏被擒 → 感义归顺 → 五虎之首南征北讨 → 授大名府总兵，醉后坠马而亡。
// 依《水浒传》第六十三、六十四、六十七回及百回本末回：
//   关胜，蒲东人氏，汉寿亭侯关羽嫡派子孙，堂堂一表、凤眼蚕眉、细细三柳髭髯，
//   使一口青龙偃月刀，绰号大刀，梁山排名第五（天勇星），马军五虎将之首。
//   征方腊还朝，授大名府正兵马总管；一日醉酒，坠马得病而亡。
// 版本辨伪：关胜为累积型文学形象，正史无其人；小说借关羽形象塑造，非史实关羽后裔。
// 视觉主线：青龙偃月刀（朱砂刀缨）+ 长髯 + 凤翅盔 + 重甲。
// 唯一的彩：朱砂只用于青龙偃月刀的刀缨、盔缨 与 第八幕「大刀」钤印——余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/guansheng.js', 'scenes/lujunyi.js', 'scenes/linchong.js', 'scenes/songjiang.js'];
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
  { id: 'gw1_pudong', dur: 3.0,
    counter: col('蒲东', '巡检把关') },

  { id: 'gw2_faming', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('汴京', '奉旨征讨') },

  { id: 'gw3_daming', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('大名府', '围魏救赵') },

  { id: 'gw4_zhan', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('梁山泊', '大战林冲') },

  { id: 'gw5_beiqin', dur: 3.2, transition: { type: 'whip', dur: 0.38 },
    counter: col('寨前', '中伏被擒') },

  { id: 'gw6_guishun', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('忠义堂', '感义归顺') },

  { id: 'gw7_zheng', dur: 3.0, transition: { type: 'redWedge', dur: 0.38 },
    counter: col('江南', '五虎之首') },

  { id: 'gw8_zongbing', dur: 3.8, transition: { type: 'ripple', dur: 0.46 },
    counter: col('大名府', '总兵坠马') },
];
