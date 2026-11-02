// 《水浒传·杨志》段落表（SH-11）：宋元版画线描 + 焦墨。八幕 24.80s。
// 弧光：殿司制使 → 失陷花石纲 → 卖刀杀牛二 → 大名府比武 → 押生辰纲被劫 → 二龙山落草 → 梁山 → 丹徒病故。
// 依《水浒传》第十二至十七回及百回本系统：杨志，杨家将之后（自谓"三代将门之后，五侯杨令公之孙"），
//   武举出身，官至殿司制使；奉命押送花石纲，黄河翻船失陷，不敢回京；遇赦回东京求官，为高俅斥退，盘缠用尽，
//   于天汉州桥卖祖传宝刀，遇泼皮牛二纠缠，怒杀之，自首发配大名府；
//   梁中书抬举，校场比武（胜周谨、与索超不分胜负）任管军提辖使；奉命押送生辰纲（献蔡京的十万贯金银），
//   黄泥冈为晁盖、吴用等智取（蒙汗药酒），纲失，落草二龙山（与鲁智深、武松）；三山聚义上梁山，排第十七位（天暗星，马军八骠骑兼先锋使）；
//   征方腊，于丹徒病故，为梁山病故头领之一。
// 版本辨伪：杨志为累积型文学形象，《大宋宣和遗事》已著录"青面兽杨志"，正史无其人。
// 视觉主线：将门锦袍 + 盔（制使/比武）→ 落魄头巾（卖刀/落草）+ 祖传宝刀（signature）。
// 造型特征"青面"：面皮上一搭青记——本系列仅朱砂一味，青记以焦墨排线块示意，不施青色（考据见此）。
// 母题：① 宝刀（贯穿）② 青记（脸上焦墨排线，身份签字）③ 生辰纲箱笼 ④ 黄河浪 ⑤ 营帐灯火。
// 唯一的彩：钤印 / 第四幕杀牛二那一刀的血光 / 第六幕蒙汗药酒一点——全片三处朱砂，余皆黑白灰。
window.SCENE_LIBS = ['scenes/sh_common.js', 'scenes/luzhishen.js', 'scenes/yangzhi.js'];
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
  { id: 'yz1_yangjia', dur: 3.0,
    counter: col('杨家将之后', '殿司制使') },

  { id: 'yz2_huashigang', dur: 2.8, transition: { type: 'dotBloom', dur: 0.42 },
    counter: col('黄河翻船', '失陷花石纲') },

  { id: 'yz3_maidao', dur: 3.0, transition: { type: 'smash', dur: 0.36 },
    counter: col('天汉州桥', '落魄卖刀') },

  { id: 'yz4_shaniu', dur: 3.0, transition: { type: 'radiant', dur: 0.44 },
    counter: col('牛二缠闹', '怒而杀之') },

  { id: 'yz5_daming', dur: 3.2, transition: { type: 'whip', dur: 0.34 },
    counter: col('大名府', '校场比武') },

  { id: 'yz6_shengchen', dur: 3.0, transition: { type: 'goldLeaf', dur: 0.44 },
    counter: col('黄泥冈', '生辰纲被劫') },

  { id: 'yz7_ershan', dur: 3.0, transition: { type: 'redWedge', dur: 0.36 },
    counter: col('二龙山', '三山聚义') },

  { id: 'yz8_dantu', dur: 3.8, transition: { type: 'ripple', dur: 0.5 },
    counter: col('丹徒', '征方腊病故') },
];
