// 《水浒传·孙二娘》段落表（SH-33）：宋元版画线描 + 焦墨。十幕 33.60s。
// 母夜叉孙二娘：十字坡开店 → 武松发配过路 → 药酒藏机(留白) → 将计就计反制 → 张青劝和 → 义结 → 荐投二龙 → 投梁山 → 聚义 → 结句。
// 复用 rig：仅 sunerniang（本片自建），公共件出自 sh_common。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/sunerniang.js'];
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
  { id: 's1_shipo', dur: 3.2, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('十字坡', '孟州道上') },

  { id: 's2_guolu', dur: 3.4, transition: { type: 'smash', dur: 0.4 },
    counter: col('发配', '过路歇脚') },

  { id: 's3_yaojiu', dur: 3.2, transition: { type: 'whip', dur: 0.42 },
    counter: col('药酒', '藏机留白') },

  { id: 's4_fanzhi', dur: 3.2, transition: { type: 'radiant', dur: 0.44 },
    counter: col('反制', '将计就计') },

  { id: 's5_zhangqing', dur: 3.4, transition: { type: 'ripple', dur: 0.44 },
    counter: col('劝和', '张青归来') },

  { id: 's6_jiebai', dur: 3.2, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('义结', '不打不相识') },

  { id: 's7_erlong', dur: 3.2, transition: { type: 'radiant', dur: 0.44 },
    counter: col('荐投', '二龙山') },

  { id: 's8_touliang', dur: 3.0, transition: { type: 'whip', dur: 0.42 },
    counter: col('投梁山', '聚义水泊') },

  { id: 's9_juyi', dur: 3.6, transition: { type: 'redWedge', dur: 0.46 },
    counter: col('聚义', '地壮星') },

  { id: 's10_shou', dur: 4.2, transition: { type: 'redWedge', dur: 0.46 },
    counter: col('母夜叉', '不让须眉') },
];
