// 《水浒传·时迁》段落表（SH-28）：宋元版画线描 + 焦墨。九幕 29.00s。
// 弧光：飞贼出身 → 偷鸡惹祸 → 同上梁山 → 盗甲赚徐宁 → 钩镰枪成 →
//       火烧翠云楼 → 细作往来 → 随军征讨 → 客死途中。
// 依《水浒传》第四十六至四十七回、第五十六回、第六十六回、第一百十九回。
//   时迁，高唐州人氏，飞檐走壁的飞贼，身轻似絮、落地无声，绰号「鼓上蚤」，
//   梁山排名第一百零七（地贼星）——全山唯一的「技术工种」。班师途中患搅肠痧而死。
// 版本辨伪：时迁为文学虚构人物；本片不以褒笔洗白偷盗，也不以贬笔抹去战功：
//   他偷来的钩镰枪破了连环马，他放的火烧开了大名府，最后也只是病死在路上。
// 视觉主线：夜行紧身衣（焦墨重笔）+ 檐脊 + 火（朱砂）+ 背囊。
// 唯一的彩：朱砂只用于① 第六幕的火 ② 末幕「鼓上蚤」钤印。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/wusong.js', 'scenes/shiqian.js'];
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
  { id: 'sq1_feizei', dur: 3.0,
    counter: col('高唐州', '鼓上蚤') },

  { id: 'sq2_zhuojia', dur: 3.0, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('祝家庄', '偷鸡惹祸') },

  { id: 'sq3_shangshan', dur: 3.0, transition: { type: 'whip', dur: 0.38 },
    counter: col('路上', '同上梁山') },

  { id: 'sq4_daojia', dur: 3.2, transition: { type: 'smash', dur: 0.36 },
    counter: col('东京', '盗甲赚徐宁') },

  { id: 'sq5_goulian', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('梁山', '钩镰枪法') },

  { id: 'sq6_cuiyunlou', dur: 3.2, transition: { type: 'redWedge', dur: 0.4 },
    counter: col('大名府', '火烧翠云楼') },

  { id: 'sq7_xizuo', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('曾头市', '细作往来') },

  { id: 'sq8_zhengtiao', dur: 3.2, transition: { type: 'ripple', dur: 0.42 },
    counter: col('江南', '随军征讨') },

  { id: 'sq9_kesi', dur: 3.4, transition: { type: 'dotBloom', dur: 0.44 },
    counter: col('归途', '客死途中') },
];
