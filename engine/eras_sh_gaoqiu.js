// 《水浒传·高俅》段落表（SH-30）：宋元版画线描 + 焦墨。九幕 31.00s。
// 【批判视角】本片不是给高俅立传，是给「逼上梁山」写来历。全书第一个出场的人，
//   是全书所有走投无路的总闸门——他每升一级，就多一家人被逼上山；
//   到最后连宋江那一个「忠」字，也掐死在他手里。本片不写他的球技本领，只写权力的来处与用法。
// 弧光：东京浮浪 → 鸳鸯拐 → 半年做到殿帅府太尉 → 公报私仇逼走王进 → 白虎节堂陷害林冲 →
//       三番征剿（送三员五虎上山）→ 三败被擒 → 放还之后背信 → 御酒下毒。
// 依《水浒传》第二回（王教头私走延安府）、第六至八回（林冲刺配沧州）、
//   第七十八至八十回（三败高太尉）、第一百二十回（宋江饮御酒而亡）。
// 版本辨伪：高俅史有其人（《宋史》记载极略，为徽宗朝宠臣，未任殿帅府太尉，亦无陷害林冲事）；
//   「因踢气球发迹」「高二改作高俅」是百回本小说家言——本片按小说叙事，但直陈其为文学塑造。
// 视觉主线：长翅幞头（权力的记号）+ 团领斓袍 + 执笏 + 气球（朱砂缝线，他一生的起点）。
// 唯一的彩：朱砂只用于① 第一二幕气球的缝线 ② 第九幕御酒壶口的一线 ③ 末幕「高俅」钤印。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/gaoqiu.js', 'scenes/linchong.js'];
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
  { id: 'gq1_popi', dur: 3.2,
    counter: col('东京', '浮浪子弟') },

  { id: 'gq2_cuju', dur: 3.2, transition: { type: 'radiant', dur: 0.44 },
    counter: col('端王府', '一脚得幸') },

  { id: 'gq3_taowei', dur: 3.4, transition: { type: 'whip', dur: 0.42 },
    counter: col('半年之间', '位至太尉') },

  { id: 'gq4_wangjin', dur: 3.4, transition: { type: 'smash', dur: 0.4 },
    counter: col('点卯堂', '公报私仇') },

  { id: 'gq5_baihu', dur: 3.6, transition: { type: 'iris', dur: 0.44 },
    counter: col('白虎节堂', '构陷林冲') },

  { id: 'gq6_santa', dur: 3.4, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('帅台', '三番征剿') },

  { id: 'gq7_beiqin', dur: 3.6, transition: { type: 'ripple', dur: 0.44 },
    counter: col('水泊', '三败遭擒') },

  { id: 'gq8_beixin', dur: 3.4, transition: { type: 'smash', dur: 0.4 },
    counter: col('东京', '归朝背信') },

  { id: 'gq9_duyao', dur: 3.8, transition: { type: 'redWedge', dur: 0.46 },
    counter: col('御酒', '毒—忠') },
];
