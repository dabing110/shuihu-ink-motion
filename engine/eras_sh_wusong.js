// 《水浒传·武松》段落表（SH-03）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：打虎扬名（景阳冈）→ 复仇（斗杀西门庆）→ 历难（十字坡·飞云浦）→ 决绝（血溅鸳鸯楼，留白）→ 化身（行者）→ 收束（六和寺出家）。
// 依《水浒传》第二十三至三十一回（百回本）：景阳冈打虎；斗杀西门庆为兄报仇；十字坡遇张青孙二娘；醉打蒋门神夺回快活林；
//   遭张都监陷害，大闹飞云浦，血溅鸳鸯楼（题壁"杀人者打虎武松也"），夜走蜈蚣岭，后于六和寺出家（与鲁智深同寺）。
// 演义型虚构辨伪：武松为累积型文学形象，《大宋宣和遗事》已有"武松"名；正史无其人；"血溅鸳鸯楼"情节为小说系统，本片从百回本。
// 视觉主线：巾帻 + 皂箭袖袍 → 枷 + 囚衣 → 铁戒箍 + 人骨数珠 + 双戒刀（行者）→ 六和寺僧。
// 母题：① 哨棒/戒刀（贯穿）② 酒（三碗不过冈、快活林）③ 虎（仅第一幕）④ 题壁（第六幕留白处墨字，画外不直绘血）。
// 红线：血溅鸳鸯楼整幕留白——不直绘血，只留题壁墨字与一枚朱砂印角（画外提示）。
// 互文：末幕六和寺，远处趺坐的鲁智深与武松同终此寺，以钱塘潮呼应鲁智深片"听潮而圆"。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/linchong.js', 'scenes/luzhishen.js', 'scenes/wusong.js'];
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
  { id: 'ws1_jingyang', dur: 3.0,
    counter: col('景阳冈打虎', '三碗不过冈') },

  { id: 'ws2_ximen', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('斗杀西门庆', '为兄报仇') },

  { id: 'ws3_shizipo', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('十字坡', '识破黑店') },

  { id: 'ws4_jiang', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('醉打蒋门神', '快活林') },

  { id: 'ws5_feiyun', dur: 3.0, transition: { type: 'whip', dur: 0.34 },
    counter: col('大闹飞云浦', '带枷杀出') },

  { id: 'ws6_yuanyang', dur: 3.2, transition: { type: 'redWedge', dur: 0.34 },
    counter: col('血溅鸳鸯楼', '留白·题壁') },

  { id: 'ws7_xingzhe', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('行者武松', '铁戒箍·数珠') },

  { id: 'ws8_liuhe', dur: 3.8, transition: { type: 'iris', dur: 0.36 },
    counter: col('六和寺出家', '与鲁同终') },
];
