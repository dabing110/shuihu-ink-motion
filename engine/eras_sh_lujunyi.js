// 《水浒传·卢俊义》段落表（SH-14）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：大名府员外 → 吴用智赚题反诗 → 梁山相留不降 → 李固告发刺配 → 燕青救主
//       → 石秀劫法场 → 活捉史文恭（为晁盖报仇，坐第二把交椅）→ 征方腊还朝被蔡京赐死。
// 依《水浒传》第六十一回及百回本系统：卢俊义，北京大名府员外，河北三绝之首，家财万贯，
//   棍棒天下无双，绰号玉麒麟，梁山排名第二（天罡星）。吴用假扮算命先生题反诗智赚其上梁山；
//   李固与贾氏私通告发，刺配沙门岛，燕青救主；大名府死牢问斩，石秀跳楼劫法场，梁山破城救出；
//   曾头市一枪活捉史文恭为晁盖报仇；征方腊还朝，被蔡京、高俅以水银御膳毒死。
// 版本辨伪：卢俊义为累积型文学形象，正史无其人。
// 视觉主线：麒麟纹（袍上祥兽侧影）+ 玉带玉佩 + 丈二钢枪 + 木枷（刺配）。
// 唯一的彩：朱砂只用于第七幕「玉麒麟」钤印 与 第八幕赐死血光——全片两处，余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/lujunyi.js', 'scenes/songjiang.js', 'scenes/wuyong.js', 'scenes/linchong.js'];
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
  { id: 'lu1_yuanwai', dur: 3.0,
    counter: col('大名府', '玉麒麟') },

  { id: 'lu2_zhuan', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('卢府', '吴用智赚') },

  { id: 'lu3_liushan', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('梁山泊', '相留不降') },

  { id: 'lu4_xianxian', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('大名府', '刺配沙门岛') },

  { id: 'lu5_jiuzhu', dur: 3.0, transition: { type: 'whip', dur: 0.34 },
    counter: col('途中', '燕青救主') },

  { id: 'lu6_dalao', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.44 },
    counter: col('法场', '石秀劫法场') },

  { id: 'lu7_shigong', dur: 3.2, transition: { type: 'redWedge', dur: 0.36 },
    counter: col('忠义堂', '活捉史文恭') },

  { id: 'lu8_cisi', dur: 3.8, transition: { type: 'ripple', dur: 0.5 },
    counter: col('班师', '赐死') },
];
