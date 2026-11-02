// 《水浒传·张顺》段落表（SH-20）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：江州鱼市 → 水里斗李逵 → 浪里白条扬名 → 夜请安道全 → 雪夜渡长江
//       → 涌金门中箭而死 → 魂归助破城 → 追封金华将军，立庙享祭。
// 依《水浒传》第三十八、六十五、九十六回及百回本末回：
//   张顺，江州人氏，遍体白肉、水底伏得七日七夜，绰号浪里白条，梁山排名第三十（天损星）。
//   征方腊攻杭州，自涌金门下水暗渡，被守军发觉，乱箭射死于城下；
//   后宋江奏报朝廷，追封为金华将军，立庙享祭。
// 版本辨伪：张顺为累积型文学形象，正史无其人；「魂捉方天定」出百回本第九十六回。
// 视觉主线：浪纹 + 白肉（留白淡墨，与众好汉焦墨对照）+ 鱼 + 涌金门。
// 唯一的彩：朱砂只用于第六幕涌金门中箭的血光 与 第八幕「浪里白条」钤印——余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/zhangshun.js', 'scenes/likui.js', 'scenes/songjiang.js'];
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
  { id: 'zs1_yushi', dur: 3.0,
    counter: col('江州', '鱼牙主人') },

  { id: 'zs2_shuidou', dur: 2.8, transition: { type: 'ripple', dur: 0.44 },
    counter: col('浔阳江', '水里斗李逵') },

  { id: 'zs3_bailang', dur: 3.0, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('大江', '浪里白条') },

  { id: 'zs4_qingyi', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('建康府', '夜请安道全') },

  { id: 'zs5_yedu', dur: 3.2, transition: { type: 'radiant', dur: 0.44 },
    counter: col('长江', '雪夜暗渡') },

  { id: 'zs6_yongjin', dur: 3.0, transition: { type: 'whip', dur: 0.38 },
    counter: col('杭州', '涌金门') },

  { id: 'zs7_hun', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('杭城', '魂归助阵') },

  { id: 'zs8_jinhua', dur: 3.8, transition: { type: 'redWedge', dur: 0.38 },
    counter: col('西湖', '追封金华将军') },
];
