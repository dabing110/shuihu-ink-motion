// 《水浒传·顾大嫂》段落表（SH-32）：宋元版画线描 + 焦墨。十幕 33.60s。
// 母大虫顾大嫂：开酒店 → 二解遭陷 → 拍案定计 → 赚兄里应 → 劫牢 → 救出 → 火并出城 → 投梁山 → 聚义 → 结句。
// 复用 rig：仅 gudasao（本片自建），公共件出自 sh_common。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/gudasao.js'];
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
  { id: 'g1_kaijiu', dur: 3.2, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('开酒店', '登州道旁') },

  { id: 'g2_xianxian', dur: 3.4, transition: { type: 'smash', dur: 0.4 },
    counter: col('遭陷', '二解入狱') },

  { id: 'g3_paian', dur: 3.2, transition: { type: 'whip', dur: 0.42 },
    counter: col('拍案', '定劫牢计') },

  { id: 'g4_bixiong', dur: 3.2, transition: { type: 'radiant', dur: 0.44 },
    counter: col('赚兄', '里应外合') },

  { id: 'g5_jielao', dur: 3.4, transition: { type: 'redWedge', dur: 0.46 },
    counter: col('劫牢', '杀入牢城') },

  { id: 'g6_jiuchu', dur: 3.2, transition: { type: 'smash', dur: 0.4 },
    counter: col('救出', '兄弟重逢') },

  { id: 'g7_huobing', dur: 3.2, transition: { type: 'ripple', dur: 0.44 },
    counter: col('出城', '火并官军') },

  { id: 'g8_touliang', dur: 3.0, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('投梁山', '聚义水泊') },

  { id: 'g9_juyi', dur: 3.6, transition: { type: 'whip', dur: 0.42 },
    counter: col('聚义', '地慧星') },

  { id: 'g10_shou', dur: 4.2, transition: { type: 'redWedge', dur: 0.46 },
    counter: col('母大虫', '不让须眉') },
];
