// 《水浒传·史进》段落表（SH-10）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：史家庄顽少 → 王进教艺得名九纹龙 → 一身花绣 → 少华山结义 → 中秋烧庄逼上梁山
//      → 落草 → 寻师不着聚义梁山 → 昱岭关殉身（阵亡，悲剧闭环）。
// 依《水浒传》第二回及百回本系统：史进，华阴县史家庄史太公独子，不务农，爱枪棒；
//   东京八十万禁军教头王进（因高俅迫害避难史家庄）教其武艺，半年精通，史进于身刺九条龙，人称九纹龙；
//   少华山朱武、陈达、杨春借粮，陈达被擒，朱武杨春行苦肉计，史进感其义，反与三人结交；
//   中秋夜猎户李吉告发，华阴县尉领兵围庄，史进杀出、烧了庄院，往少华山落草；
//   后离少华山寻王进不着，辗转江湖，终上梁山，排第二十三位（马军八骠骑兼先锋使）；
//   征方腊，昱岭关之战，被庞万春乱箭射死，为梁山阵亡头领之一。
// 版本辨伪：史进为累积型文学形象，《大宋宣和遗事》已著录"九纹龙史进"，龚圣与《宋江三十六人赞》有赞，正史无其人。
// 造型：青年束发簪 + 锦袍 + 三尖两刃刀（标志长械）。
// 母题：① 九条龙刺青（第三幕袒身显形，全片签字）② 三尖两刃刀（贯穿）③ 束发飘带（活气）
//       ④ 火（第五幕燔庄）⑤ 箭雨（第八幕）。全片仅朱砂一味（钤印 / 燔庄火星 / 中箭）。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/shijin.js'];
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
  { id: 'sj1_shijiazhuang', dur: 3.0,
    counter: col('史家庄', '顽少爱枪棒') },

  { id: 'sj2_wangjin', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('王教头教艺', '拜师学武') },

  { id: 'sj3_jiuwenlong', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('九纹龙', '一身花绣') },

  { id: 'sj4_shaohuashan', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('少华山', '苦肉结义') },

  { id: 'sj5_zhongqiu', dur: 3.2, transition: { type: 'whip', dur: 0.34 },
    counter: col('中秋夜', '烧庄杀出') },

  { id: 'sj6_luocao', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.44 },
    counter: col('少华山', '落草为寇') },

  { id: 'sj7_xunshi', dur: 3.0, transition: { type: 'redWedge', dur: 0.36 },
    counter: col('梁山泊', '第二十三把交椅') },

  { id: 'sj8_yulingguan', dur: 3.8, transition: { type: 'ripple', dur: 0.5 },
    counter: col('昱岭关', '阵前殒身') },
];
