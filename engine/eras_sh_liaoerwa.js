// 《水浒传·蓼儿洼·梁山终局》段落表（SH-31）：宋元版画线描 + 焦墨。十幕 33.60s。
// 收口片：招安 → 征方腊 → 宋江饮御酒 → 李逵同饮 → 吴用花荣双缢，一次收口整个系列。
// 复用 rig：songjiang/likui/wuyong/huarong（含 likui 的 Z.blood 与 Z.axe）。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/linchong.js', 'scenes/songjiang.js', 'scenes/likui.js', 'scenes/wuyong.js', 'scenes/huarong.js', 'scenes/liaoerwa.js'];
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
  { id: 'le1_zhaoan', dur: 3.2, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('招安', '改旗为顺') },

  { id: 'le2_zhengzhan', dur: 3.4, transition: { type: 'smash', dur: 0.4 },
    counter: col('南征北战', '破辽征腊') },

  { id: 'le3_huanchao', dur: 3.2, transition: { type: 'whip', dur: 0.42 },
    counter: col('还朝', '封楚州安抚') },

  { id: 'le4_yujiu', dur: 3.2, transition: { type: 'radiant', dur: 0.44 },
    counter: col('御酒', '赐药酒') },

  { id: 'le5_yin', dur: 3.4, transition: { type: 'redWedge', dur: 0.46 },
    counter: col('饮毒', '已知是毒') },

  { id: 'le6_wang', dur: 3.2, transition: { type: 'smash', dur: 0.4 },
    counter: col('公明死', '毒发而亡') },

  { id: 'le7_zhao', dur: 3.2, transition: { type: 'ripple', dur: 0.44 },
    counter: col('召李逵', '恐其造反') },

  { id: 'le8_tongyin', dur: 3.0, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('同死', '甘心同死') },

  { id: 'le9_shuangyi', dur: 3.6, transition: { type: 'whip', dur: 0.42 },
    counter: col('双缢', '蓼儿洼') },

  { id: 'le10_shou', dur: 4.2, transition: { type: 'redWedge', dur: 0.46 },
    counter: col('蓼儿洼', '梁山终局') },
];
