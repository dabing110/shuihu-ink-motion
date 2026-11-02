// 《水浒传·秦明》段落表（SH-23）：宋元版画线描 + 焦墨。九幕 29.60s。
// 弧光：青州统制 → 清风山起事 → 大战花荣、被射落盔缨 → 中计入寨 → 假扮夜打青州 →
//       全家遇害首级示众 → 无奈落草、花荣之妹相赔 → 五虎南征 → 清溪县力战而亡。
// 依《水浒传》第三十三至三十五回、第一百十八回（征方腊清溪县）。
//   秦明，山后开州人氏，青州兵马统制，使一条狼牙棒，性如烈火、声若雷霆，绰号「霹雳火」，
//   梁山排名第七（天猛星），马军五虎将第三。征方腊时于清溪县一役战死。
// 版本辨伪：秦明为累积型文学形象，正史无其人；「宋江使人假扮秦明夜打青州、致其全家被杀」
//   出百回本第三十四回——这是梁山手段黑暗面的第一次正面呈现，本片直陈而不粉饰。
// 视觉主线：狼牙棒 + 火焰纹（朱砂）+ 赤发黄须 + 连环重甲。
// 唯一的彩：朱砂只用于① 盔上火焰纹的星点 ② 第三幕坠地的盔缨 ③ 第六幕的血光点 ④ 末幕「霹雳火」钤印。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/qinming.js',
  'scenes/huarong.js', 'scenes/songjiang.js'];
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
  { id: 'qm1_qingzhou', dur: 3.0,
    counter: col('青州', '兵马统制') },

  { id: 'qm2_qingfeng', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('清风山', '奉命来剿') },

  { id: 'qm3_huarong', dur: 3.2, transition: { type: 'whip', dur: 0.38 },
    counter: col('阵前', '盔缨落地') },

  { id: 'qm4_ruzhai', dur: 3.2, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('山寨', '中计入伙') },

  { id: 'qm5_jiazhuang', dur: 3.4, transition: { type: 'radiant', dur: 0.44 },
    counter: col('青州城下', '假扮夜袭') },

  { id: 'qm6_miemen', dur: 3.4, transition: { type: 'redWedge', dur: 0.4 },
    counter: col('青州', '满门之祸') },

  { id: 'qm7_luocao', dur: 3.2, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('清风山', '无奈落草') },

  { id: 'qm8_zheng', dur: 3.0, transition: { type: 'ripple', dur: 0.4 },
    counter: col('江南', '五虎南征') },

  { id: 'qm9_qingxi', dur: 3.6, transition: { type: 'dotBloom', dur: 0.44 },
    counter: col('清溪县', '力战而亡') },
];
