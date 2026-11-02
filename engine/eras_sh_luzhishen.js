// 《水浒传·鲁智深》段落表（SH-02）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：怒的发生（拳打镇关西）→ 转身（五台山剃度）→ 旧习难改（大闹五台山）→ 天生神力（倒拔垂杨柳）
//      → 义（野猪林救林冲）→ 聚（二龙山）→ 功（万松林擒方腊）→ 静（听潮圆寂）。
// 依《水浒传》第三、四、七、八回及第九十九回（百回本／人民文学出版社本）：鲁达本渭州小种经略相公帐下提辖，
//   因救金翠莲父女三拳打死郑屠（绰号镇关西），亡命五台山文殊院，智真长老剃度赐名"智深"；
//   屡犯戒律，转荐东京大相国寺，守菜园，倒拔垂杨柳镇住众泼皮；林冲刺配，于野猪林救之，遂落二龙山；
//   后归并梁山。征方腊时于万松林生擒方腊。班师至杭州，夜宿六和寺，闻钱塘江潮信，
//   忆长老"听潮而圆，见信而寂"之偈，沐浴焚香，趺坐而化。偈云：钱塘江上潮信来，今日方知我是我。
// 版本辨伪：① "生擒方腊"在百回本属鲁智深；影视改编（1998 央视本）改为武松独臂擒方腊，本片依百回本。
//          ② "倒拔垂杨柳"为小说虚构；宋元话本与《大宋宣和遗事》著录三十六人中有"花和尚鲁智深"，
//             龚圣与《宋江三十六人赞》赞曰"有飞飞儿，出家尤好"，是累积型形象，正史无其人。
// 造型：提辖期（鬃帽 + 皂袍 + 腰刀）→ 僧期（戒疤 + 皂布直裰 + 数珠 + 浑铁禅杖）→ 圆寂期（朱砂袈裟趺坐）。
// 母题：① 禅杖（第二幕起不离身，第八幕放下——放下的那一刻是这部片的终点）
//       ② 酒（坛与葫芦：戒律与本性的来回拉扯，第三幕达到顶点）③ 数珠 ④ 潮（白浪横排线，末幕铺满）
//       ⑤ 排线密度由密转疏——与林冲片反向：那部是从静走到怒，这部是从怒走到静。
// 唯一的彩：禅杖握把处一段朱砂缠绳（八幕贯穿），直到第八幕最后一刻才铺成袈裟。
// 互文：Z.linchong 与 Z.guard 直接复用 SH-01 林冲片的代码（第五幕同一片野猪林，只换了站的人）。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/linchong.js', 'scenes/luzhishen.js'];
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
  { id: 'zh1_quanda', dur: 3.0,
    counter: col('渭州提辖', '拳打镇关西') },

  { id: 'zh2_wutai', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('五台山', '剃度为僧') },

  { id: 'zh3_danao', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('大闹山门', '金刚倒地') },

  { id: 'zh4_daoba', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('菜园神力', '倒拔垂杨') },

  { id: 'zh5_yezhulin', dur: 3.2, transition: { type: 'whip', dur: 0.34 },
    counter: col('野猪林', '一杖留人') },

  { id: 'zh6_ershan', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.44 },
    counter: col('二龙山', '三山聚义') },

  { id: 'zh7_wansonglin', dur: 3.0, transition: { type: 'redWedge', dur: 0.36 },
    counter: col('万松林', '生擒方腊') },

  { id: 'zh8_tingchao', dur: 3.8, transition: { type: 'ripple', dur: 0.5 },
    counter: col('六和寺', '听潮而寂') },
];
