// 《水浒传·扈三娘》段落表（SH-22）：宋元版画线描 + 焦墨。九幕 29.20s。
// 弧光：扈家庄习武 → 三庄联防 → 套索生擒王英 → 为林冲所活捉 → 李逵杀尽扈家满门 →
//       宋江作主嫁与王英 → 南征北讨并肩 → 乌龙岭王英战死 → 报仇同殉，追封花阳郡夫人。
// 依《水浒传》第四十七至五十回、第一百十七至十八回（征方腊乌龙岭）。
//   扈三娘，郓州扈家庄扈太公之女，绰号「一丈青」，使两口日月双刀，善用红锦套索，
//   梁山排名第五十九（地慧星），掌三军内探事马军头领。征方腊乌龙岭一役，
//   夫王英战死，她赶去报仇，被郑魔君铜砖打中面门而死，追封花阳郡夫人。
// 版本辨伪：扈三娘为文学虚构人物，正史无其人；「全家被杀却由宋江作主嫁给王英」
//   依百回本，是后世批评水浒女性观的主要靶点，本片直陈而不美化。
// 视觉主线：日月双刀 + 红锦套索（朱砂，全片唯一彩）+ 雉尾帅盔 + 战袍裙甲。
// 唯一的彩：朱砂只用于① 红锦套索 ② 第五幕灭门的血光点 ③ 末幕「一丈青」钤印——余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/husanniang.js',
  'scenes/linchong.js', 'scenes/likui.js', 'scenes/songjiang.js'];
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
  { id: 'hs1_zhuang', dur: 3.2,
    counter: col('扈家庄', '日月双刀') },

  { id: 'hs2_lianmeng', dur: 3.0, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('郓州', '三庄联防') },

  { id: 'hs3_shengqin', dur: 3.4, transition: { type: 'whip', dur: 0.38 },
    counter: col('阵前', '红锦套索') },

  { id: 'hs4_beihuo', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('村口', '林冲擒获') },

  { id: 'hs5_miemen', dur: 3.2, transition: { type: 'radiant', dur: 0.44 },
    counter: col('扈家庄', '一门屠戮') },

  { id: 'hs6_xipei', dur: 3.4, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('忠义堂', '宋江主婚') },

  { id: 'hs7_bingjian', dur: 3.0, transition: { type: 'redWedge', dur: 0.38 },
    counter: col('江南', '并肩征战') },

  { id: 'hs8_wulong', dur: 3.4, transition: { type: 'ripple', dur: 0.46 },
    counter: col('乌龙岭', '王英战死') },

  { id: 'hs9_zhuisi', dur: 3.6, transition: { type: 'dotBloom', dur: 0.44 },
    counter: col('乌龙岭', '追封郡夫人') },
];
