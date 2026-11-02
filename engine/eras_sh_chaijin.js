// 《水浒传·柴进》段落表（SH-25）：宋元版画线描 + 焦墨。九幕 29.20s。
// 弧光：后周皇裔 → 招纳天下好汉 → 高唐州叔父受欺 → 李逵打死殷天锡 → 下狱 →
//       公孙胜破高廉救出 → 上梁山掌钱粮 → 化名卧底方腊军 → 辞官归沧州善终。
// 依《水浒传》第九回、第二十二回、第五十二至五十四回、第一百十六至十九回。
//   柴进，后周皇裔柴世宗嫡派子孙，沧州横海郡人，绰号「小旋风」，梁山排名第十（天贵星），掌管钱粮。
//   征方腊时化名柯引混入方腊军中为内应；班师后推称风疾，辞官归沧州，得以善终。
// 版本辨伪：柴进为文学虚构人物，正史无其人；丹书铁券为宋廷赐柴氏的免罪凭证，
//   小说借它做「法度抵抗不住权势」的讽刺——铁券救不了柴进，救他的是梁山。
// 视觉主线：丹书铁券（朱砂券文与钤印）+ 素袍 + 束发冠 + 斗斛钱粮。
// 唯一的彩：朱砂只用于① 丹书铁券的券文与钤印 ② 末幕「小旋风」钤印。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/chaijin.js',
  'scenes/linchong.js', 'scenes/wusong.js', 'scenes/songjiang.js',
  'scenes/likui.js', 'scenes/gongsunsheng.js'];
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
  { id: 'cj1_huangyi', dur: 3.0,
    counter: col('沧州', '后周皇裔') },

  { id: 'cj2_zhaona', dur: 3.2, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('柴家庄', '纳士招贤') },

  { id: 'cj3_gaotang', dur: 3.0, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('高唐州', '叔父受欺') },

  { id: 'cj4_xiayu', dur: 3.2, transition: { type: 'smash', dur: 0.38 },
    counter: col('高唐州', '下狱') },

  { id: 'cj5_doufa', dur: 3.2, transition: { type: 'radiant', dur: 0.44 },
    counter: col('高唐州', '破城救出') },

  { id: 'cj6_qianliang', dur: 3.0, transition: { type: 'whip', dur: 0.38 },
    counter: col('梁山', '掌管钱粮') },

  { id: 'cj7_neiying', dur: 3.2, transition: { type: 'redWedge', dur: 0.4 },
    counter: col('江南', '卧底方腊') },

  { id: 'cj8_ciguan', dur: 3.0, transition: { type: 'ripple', dur: 0.42 },
    counter: col('东京', '辞官归里') },

  { id: 'cj9_shanzhong', dur: 3.4, transition: { type: 'dotBloom', dur: 0.44 },
    counter: col('沧州', '得以善终') },
];
