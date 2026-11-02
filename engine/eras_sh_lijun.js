// 《水浒传·李俊》段落表（SH-24）：宋元版画线描 + 焦墨。九幕 29.20s。
// 弧光：揭阳岭私渡 → 三救宋江 → 揭阳镇结义 → 白龙庙小聚义 → 水战破官军 → 生擒高俅 →
//       同反招安 → 诈中风脱队 → 造舟出海为王。
// 依《水浒传》第三十六至四十回、第七十七回、第一百十九回；《水浒后传》（陈忱）出海为王一节。
//   李俊，庐州人氏，揭阳岭一带的私商领袖，扬子江上撑船为生，水性极好，绰号「混江龙」，
//   梁山排名第二十六（天寿星），水军大都督。征方腊后诈称中风脱离队伍，后造舟出海。
// 版本辨伪：李俊为累积型文学形象，正史无其人；「出海为暹罗国主」出清人陈忱《水浒后传》，
//   非百回本正文，末幕已以字幕标注，不作正史陈述。本系列最强的一组对照：同反招安的阮小七
//   回村打鱼终老，李俊出海称王——两人结局在此分岔。
// 视觉主线：混江龙纹（朱砂点睛）+ 篷船 + 江浪 + 分水峨眉刺。
// 唯一的彩：朱砂只用于① 龙纹点睛 ② 第五幕火攻的火星 ③ 末幕「混江龙」钤印。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/lijun.js',
  'scenes/songjiang.js', 'scenes/ruanxiaoqi.js', 'scenes/zhangshun.js', 'scenes/luzhishen.js'];
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
  { id: 'lj1_jieyang', dur: 3.0,
    counter: col('揭阳岭', '扬子江上') },

  { id: 'lj2_sanjiu', dur: 3.2, transition: { type: 'ripple', dur: 0.44 },
    counter: col('浔阳江', '三救宋江') },

  { id: 'lj3_jieyangzhen', dur: 3.0, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('揭阳镇', '结识豪杰') },

  { id: 'lj4_bailongmiao', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.42 },
    counter: col('白龙庙', '小聚义') },

  { id: 'lj5_shuizhan', dur: 3.2, transition: { type: 'smash', dur: 0.38 },
    counter: col('梁山泊', '水战破敌') },

  { id: 'lj6_qin_gaoqiu', dur: 3.0, transition: { type: 'whip', dur: 0.38 },
    counter: col('水泊', '生擒高俅') },

  { id: 'lj7_fanzhaoan', dur: 3.2, transition: { type: 'redWedge', dur: 0.4 },
    counter: col('忠义堂', '同反招安') },

  { id: 'lj8_zhafeng', dur: 3.2, transition: { type: 'radiant', dur: 0.44 },
    counter: col('班师途中', '诈病脱身') },

  { id: 'lj9_chuhai', dur: 3.4, transition: { type: 'ripple', dur: 0.46 },
    counter: col('海上', '出海为王') },
];
