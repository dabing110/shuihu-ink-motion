// 《水浒传·燕青》段落表（SH-15）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：卢府小乙 → 主人落难乞食养主 → 泰安州智扑擎天柱 → 川弩救主 → 走李师师门路
//       → 求得赦书成招安 → 劝主归隐不从 → 挑担飘然而去，不知所终。
// 依《水浒传》第六十一、六十二、七十四、八十一、八十二回及百回本末回：
//   燕青，北京大名府卢俊义家生小厮，遍体花绣，相扑天下无对，川弩三箭救主；
//   梁山排名第三十六（天巧星）。招安后功成身退，挑一担金珠归隐，是梁山少数善终者。
// 版本辨伪：燕青为累积型文学形象，正史无其人；「招安关节走李师师」出百回本系统。
// 视觉主线：遍体花绣 + 川弩 + 箫 + 扁担（归隐）。
// 唯一的彩：朱砂只用于第六幕求得赦书上的御印 与 第八幕「浪子」钤印——全片两处，余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/yanqing.js', 'scenes/lujunyi.js'];
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
  { id: 'yq1_xiaoyi', dur: 3.0,
    counter: col('大名府', '卢府小乙') },

  { id: 'yq2_qitao', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('刺配路上', '乞食养主') },

  { id: 'yq3_xiangpu', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('泰安州', '智扑擎天柱') },

  { id: 'yq4_nujian', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('荒野', '一弩救主') },

  { id: 'yq5_shishi', dur: 3.2, transition: { type: 'whip', dur: 0.38 },
    counter: col('东京', '樊楼李师师') },

  { id: 'yq6_zhaoan', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('御前', '求得赦书') },

  { id: 'yq7_biezhu', dur: 3.0, transition: { type: 'redWedge', dur: 0.38 },
    counter: col('还朝', '劝主归隐') },

  { id: 'yq8_guiyin', dur: 3.8, transition: { type: 'ripple', dur: 0.46 },
    counter: col('江湖', '不知所终') },
];
