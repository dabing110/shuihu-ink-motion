// 《水浒传·公孙胜》段落表（SH-18）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：七星聚义报信 → 黄泥冈智取生辰纲 → 石碣村破官兵 → 梁山罗天大醮
//       → 斗法破高廉妖术 → 北征田虎王庆 → 奉师命辞别 → 归二仙山修道。
// 依《水浒传》第十五、十六、十九、五十二、五十三、八十五、九十九回及百回本末回：
//   公孙胜，蓟州九宫县二仙山罗真人门下，道号一清，能呼风唤雨、驾雾腾云，五雷天罡正法正宗，
//   绰号入云龙，梁山排名第四（天闲星）。招安北征后功成身退，归山修道——梁山唯一全身而退者。
// 版本辨伪：公孙胜为累积型文学形象，正史无其人；「斗法破高廉」出百回本第五十二至五十四回。
// 视觉主线：拂尘 + 松纹古定剑 + 道冠（逍遥巾）+ 朱砂雷符。
// 唯一的彩：朱砂只用于五雷天罡正法的雷符 与 第八幕「入云龙」钤印——余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/gongsunsheng.js', 'scenes/wuyong.js', 'scenes/chaogai.js', 'scenes/songjiang.js'];
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
  { id: 'gs1_juyi', dur: 3.0,
    counter: col('东溪村', '七星聚义') },

  { id: 'gs2_huangni', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('黄泥冈', '智取生辰纲') },

  { id: 'gs3_shijie', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('石碣村', '芦苇破官兵') },

  { id: 'gs4_jiao', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('梁山泊', '罗天大醮') },

  { id: 'gs5_pofa', dur: 3.2, transition: { type: 'whip', dur: 0.38 },
    counter: col('高唐州', '斗法破高廉') },

  { id: 'gs6_zhengtao', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('河北', '北征破阵') },

  { id: 'gs7_bie', dur: 3.0, transition: { type: 'redWedge', dur: 0.38 },
    counter: col('汴京', '奉师命辞别') },

  { id: 'gs8_xiu', dur: 3.8, transition: { type: 'ripple', dur: 0.46 },
    counter: col('二仙山', '归山修道') },
];
