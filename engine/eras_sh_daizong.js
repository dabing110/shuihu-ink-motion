// 《水浒传·戴宗》段落表（SH-27）：宋元版画线描 + 焦墨。九幕 29.00s。
// 弧光：江州节级 → 甲马神行 → 假书败露 → 飞报江州 → 传令四方 → 走报机密 →
//       往返传旨促成招安 → 纳印出家 → 大笑而终。
// 依《水浒传》第三十六至四十回、第四十七回、第八十二回、第一百十九至二十回。
//   戴宗，江州两院押牢节级，有道术，腿绑甲马日行八百里，绰号「神行太保」，
//   梁山排名第二十（天速星），职司「总探声息、走报机密」——全书的事件都由他的双腿串起来。
//   征方腊后授兖州府都统制，纳还官诰，赴泰安州岳庙出家，数月后大笑而终。
// 版本辨伪：戴宗为文学虚构人物；甲马神行属道术化的民间想象，本片以民俗符号呈现，不作写实。
// 视觉主线：甲马（朱砂符文）+ 疾行残影 + 公文令牌。
// 唯一的彩：朱砂只用于① 甲马符文 ② 末幕「神行太保」钤印。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/daizong.js',
  'scenes/songjiang.js', 'scenes/likui.js', 'scenes/luzhishen.js'];
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
  { id: 'dz1_jiangzhou', dur: 3.0,
    counter: col('江州', '押牢节级') },

  { id: 'dz2_jiama', dur: 3.0, transition: { type: 'whip', dur: 0.38 },
    counter: col('官道', '甲马神行') },

  { id: 'dz3_jiaxin', dur: 3.2, transition: { type: 'redWedge', dur: 0.4 },
    counter: col('江州府', '假书败露') },

  { id: 'dz4_fachang', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('江州', '飞报法场') },

  { id: 'dz5_chuanling', dur: 3.0, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('官道', '传令四方') },

  { id: 'dz6_zoubao', dur: 3.2, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('忠义堂', '走报机密') },

  { id: 'dz7_zhaoan', dur: 3.0, transition: { type: 'ripple', dur: 0.4 },
    counter: col('东京', '往返传旨') },

  { id: 'dz8_chuguan', dur: 3.2, transition: { type: 'radiant', dur: 0.44 },
    counter: col('泰安州', '纳印出家') },

  { id: 'dz9_xiaoshi', dur: 3.4, transition: { type: 'dotBloom', dur: 0.44 },
    counter: col('岳庙', '大笑而终') },
];
