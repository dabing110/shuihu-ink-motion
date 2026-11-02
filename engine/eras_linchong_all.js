// 《水浒传·林冲·全传》（SH-09）：宋元版画线描 + 焦墨。十六幕 49.60s。
// 合并 SH-01《林冲》（lc1-lc8：教头→雪夜上梁山）与 SH-08《林冲·梁山终局》（l21-l28：火并王伦→病逝追封），
// 补全林冲从东京教头到六和寺病逝的完整弧光，一镜到底。
// 依《水浒传》第七至十一回 + 百回本后段：教头蒙冤、刺配、野猪林、草料场、雪夜上梁山；
//   火并王伦、聚义、受招安、征方腊、杭州风瘫、六和寺养病（武松伴护）、病逝追封忠武郎。
// 演义型虚构辨伪：正史无林冲其人；「林冲」见于《大宋宣和遗事》与宋元话本，是累积型形象。本片依小说系统，不混索隐。
// 视觉主线（与 SH-01/SH-08 一致）：冷白宣纸 + 铁线描 + 排线明暗 + 焦墨块，全片仅朱砂一味。
// 母题贯穿：花枪（贯穿全片）、雪（越来越大，SH-01 结尾与 SH-08 末幕呼应）、枪缨朱砂、替天行道旗、朱砂钤印。
// 复用 SCENE_LIBS：sh_common（纸/笔法/角标/雪/火/旗）+ linchong（Z.linchong 主角）+ songjiang（招安幕）+ wusong（六和寺幕）+ linchong2（l21-l28 八幕）。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/linchong.js', 'scenes/songjiang.js', 'scenes/wusong.js', 'scenes/linchong2.js'];
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

// ============ 上篇：SH-01《林冲》（lc1-lc8） ============
window.ERAS = [
  { id: 'lc1_jiaotou', dur: 3.0,
    counter: col('禁军教头', '东京八十万') },

  { id: 'lc2_baihu', dur: 2.8, transition: { type: 'inkBloom', dur: 0.46 },
    counter: col('误入节堂', '高俅设局') },

  { id: 'lc3_ciPei', dur: 3.0, transition: { type: 'blueBrush', dur: 0.4 },
    counter: col('刺配沧州', '赭衣枷锁') },

  { id: 'lc4_yezhulin', dur: 3.0, transition: { type: 'redWedge', dur: 0.34 },
    counter: col('野猪林', '一杖留命') },

  { id: 'lc5_caoliaochang', dur: 3.0, transition: { type: 'lampGlow', dur: 0.4 },
    counter: col('草料场', '风雪沽酒') },

  { id: 'lc6_shanshenmiao', dur: 3.2, transition: { type: 'ripple', dur: 0.42 },
    counter: col('山神庙', '夜闻火谋') },

  { id: 'lc7_sharen', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('手刃三人', '忍无可忍') },

  { id: 'lc8_liangshan', dur: 3.8, transition: { type: 'iris', dur: 0.36 },
    counter: col('雪夜上梁山', '再无回头') },

// ============ 下篇：SH-08《林冲·梁山终局》（l21-l28） ============
  { id: 'l21_huobing', dur: 3.0,
    counter: col('火并王伦', '迎晁盖') },

  { id: 'l22_juyi', dur: 3.0, transition: { type: 'inkBloom', dur: 0.46 },
    counter: col('梁山聚义', '替天行道') },

  { id: 'l23_zhaoan', dur: 3.0, transition: { type: 'blueBrush', dur: 0.4 },
    counter: col('受招安', '顺天护国') },

  { id: 'l24_fangla', dur: 3.0, transition: { type: 'redWedge', dur: 0.34 },
    counter: col('征方腊', '南征苦战') },

  { id: 'l25_ganbing', dur: 3.0, transition: { type: 'lampGlow', dur: 0.4 },
    counter: col('杭州染病', '风瘫六和寺') },

  { id: 'l26_liuhe', dur: 3.1, transition: { type: 'ripple', dur: 0.42 },
    counter: col('六和寺', '武松伴护') },

  { id: 'l27_bishi', dur: 3.3, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('病逝追封', '忠武郎') },

  { id: 'l28_zhonghun', dur: 3.4, transition: { type: 'iris', dur: 0.36 },
    counter: col('忠义长存', '豹子头') },
];
