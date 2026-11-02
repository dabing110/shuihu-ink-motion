// 《水浒传·李逵》段落表（SH-16）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：江州牢城小牢子 → 劫法场抡斧救人 → 沂岭杀四虎（母亡） → 元夜闹东京
//       → 扯诏骂钦差 → 征方腊冲锋 → 授都统制 → 宋江赐毒酒，甘心同死。
// 依《水浒传》第三十八、四十、四十三、七十二、七十五回及百回本末回：
//   李逵，沂州百丈村人，黑凛凛一条大汉，使两把夹钢板斧，绰号黑旋风，梁山排名第二十二（天杀星）。
//   宋江饮毒酒后恐其造反，召来同饮，李逵甘心同死——「生时服侍哥哥，死了也只是哥哥部下一个小鬼」。
// 版本辨伪：李逵为累积型文学形象，正史无其人；「元夜闹东京」「扯诏谤徽宗」均出百回本情节。
// 视觉主线：双板斧 + 焦墨重笔（黑凛凛）+ 虬髯乱发 + 毒酒（末幕）。
// 唯一的彩：朱砂只用于第三幕杀虎血光、第八幕毒酒与「黑旋风」钤印——余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/likui.js', 'scenes/songjiang.js'];
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
  { id: 'lk1_jiangzhou', dur: 3.0,
    counter: col('江州', '牢城小牢子') },

  { id: 'lk2_fachang', dur: 2.8, transition: { type: 'smash', dur: 0.36 },
    counter: col('法场', '抡斧劫人') },

  { id: 'lk3_yiling', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('沂岭', '怒杀四虎') },

  { id: 'lk4_yuanxiao', dur: 3.0, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('东京', '元夜大闹') },

  { id: 'lk5_chezhao', dur: 3.2, transition: { type: 'whip', dur: 0.38 },
    counter: col('梁山', '扯诏骂钦差') },

  { id: 'lk6_fangla', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('江南', '征方腊') },

  { id: 'lk7_huanchao', dur: 3.0, transition: { type: 'redWedge', dur: 0.38 },
    counter: col('还朝', '授都统制') },

  { id: 'lk8_dujiu', dur: 3.8, transition: { type: 'ripple', dur: 0.46 },
    counter: col('楚州', '饮下毒酒') },
];
