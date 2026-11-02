// 《水浒传·晁盖》段落表（SH-12）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：东溪村保正 → 西溪夺塔(托塔天王) → 七星聚义 → 智取生辰纲 → 火并王伦 → 梁山寨主
//       → 曾头市亲征 → 中箭身亡（史文恭毒箭，闭环：引出宋江接班）。
// 依《水浒传》第十四至六十回及百回本系统：晁盖，东溪村保正，赤发（本系列仅朱砂一味，赤发作焦墨排线代），
//   性如烈火；因夺西溪村石塔抱归东溪，人称"托塔天王"；邀吴用、刘唐、三阮、公孙胜七星聚义，智取生辰纲；
//   上梁山火并王伦，为第二任寨主；曾头市亲征，中史文恭毒箭身亡，临终遗言"捉得史文恭者便为梁山主"。
// 版本辨伪：晁盖为累积型文学形象，正史无其人。
// 视觉主线：员外袍 + 巾帻双角（保正/寨主）→ 战时盔甲 + 朴刀；signature 母题 = 石塔（托塔天王）。
// 母题：① 石塔（贯穿）② 烈火纹（胸前排线，性如烈火，不施色）③ 替天行道旗。
// 唯一的彩：朱砂只用于第八幕中箭的箭伤血光（血）——全片一处，余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/linchong.js', 'scenes/chaogai.js'];
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
  { id: 'ch1_dongxi', dur: 3.0,
    counter: col('东溪村保正', '乡绅头目') },

  { id: 'ch2_tuota', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('西溪夺塔', '托塔天王') },

  { id: 'ch3_qiyi', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('七星聚义', '智取生辰纲') },

  { id: 'ch4_shengchen', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('黄泥冈', '蒙汗药酒') },

  { id: 'ch5_huobing', dur: 3.2, transition: { type: 'whip', dur: 0.34 },
    counter: col('梁山', '火并王伦') },

  { id: 'ch6_zhaizhu', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.44 },
    counter: col('聚义厅', '梁山寨主') },

  { id: 'ch7_zengtou', dur: 3.0, transition: { type: 'redWedge', dur: 0.36 },
    counter: col('曾头市', '夜战亲征') },

  { id: 'ch8_zhongjian', dur: 3.8, transition: { type: 'ripple', dur: 0.5 },
    counter: col('中箭', '史文恭毒箭') },
];
