// 《水浒传·阮小七》段落表（SH-19）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：石碣村打鱼 → 随晁盖劫生辰纲 → 芦苇荡火烧官船 → 梁山泊水军头领 →
//       招安时偷喝御酒 → 征方腊血战 → 戏穿方腊龙袍被参 → 削职归村，寿终正寝。
// 依《水浒传》第十五、十六、十九、七十五、九十九回及百回本末回：
//   阮小七，济州梁山泊边石碣村人，阮氏三雄之七，打鱼为生，水里本事了得，绰号活阎罗，
//   梁山排名第三十一（天败星）。征方腊后戏穿方腊赭黄袍，被童贯等参奏「不成体统」，
//   削去官职，复为庶民，归石碣村打鱼，至六十而亡——梁山少有的善终者。
// 版本辨伪：阮小七为累积型文学形象，正史无其人；「偷喝御酒」「戏穿龙袍」均出百回本情节。
// 视觉主线：斗笠蓑衣 + 渔叉 + 酒葫芦 + 朱砂龙袍。
// 唯一的彩：朱砂只用于第五幕御酒酒封、第七幕方腊龙袍 与 第八幕「活阎罗」钤印——余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/ruanxiaoqi.js', 'scenes/wuyong.js', 'scenes/chaogai.js'];
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
  { id: 'rq1_yumin', dur: 3.0,
    counter: col('石碣村', '打鱼为生') },

  { id: 'rq2_huangni', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('黄泥冈', '劫生辰纲') },

  { id: 'rq3_huogong', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('芦苇荡', '火烧官船') },

  { id: 'rq4_shuijun', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('梁山泊', '水军头领') },

  { id: 'rq5_yujiu', dur: 3.2, transition: { type: 'whip', dur: 0.38 },
    counter: col('忠义堂', '偷喝御酒') },

  { id: 'rq6_fangla', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('江南', '血战方腊') },

  { id: 'rq7_longpao', dur: 3.0, transition: { type: 'redWedge', dur: 0.38 },
    counter: col('杭州', '戏穿龙袍') },

  { id: 'rq8_guiyu', dur: 3.8, transition: { type: 'ripple', dur: 0.46 },
    counter: col('石碣村', '归乡打鱼') },
];
