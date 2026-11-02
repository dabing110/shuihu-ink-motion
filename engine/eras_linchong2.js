// 《水浒传·林冲·梁山终局》（SH-08）：宋元版画线描 + 焦墨。八幕 24.80s。
// 承接 SH-01《林冲》的「雪夜上梁山」之后，补全林冲上梁山 → 最后结局的完整弧光：
//   火并王伦 → 梁山聚义（替天行道）→ 受招安 → 征方腊 → 杭州染病（风瘫）
//   → 六和寺养病（武松伴护）→ 病逝追封（忠武郎）→ 忠义长存。
// 依《水浒传》百回本：林冲上梁山后，吴用智激其火并王伦、尊晁盖；梁山排座次，林冲为马军五虎将之首、
//   天罡星第六位「豹子头」；随宋江受招安，北征辽、南讨方腊，屡立战功；平方腊后于杭州染患风瘫，
//   留养六和寺，由武松照顾，半年后病逝，追封忠武郎。
// 互文：① 花枪（SH-01 贯穿全片的枪，此处仍是他的符号）② 替天行道旗（聚义→招安→征伐一路打着）
//      ③ 雪（SH-01 结尾的雪，本片末幕以雪/潮信呼应）④ 朱砂（旗/枪缨/钤印「忠武郎」/血不直绘）
//      ⑤ 六和寺（与鲁智深「听潮圆寂」、武松「同终此寺」互文）。
// 视觉主线（与 SH-01 一致）：冷白宣纸 + 铁线描 + 排线明暗 + 焦墨块，全片仅朱砂一味。
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

window.ERAS = [
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
