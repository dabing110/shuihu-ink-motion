# shuihu-ink-motion · 水浒传版画动画流水线

用**代码**画版画线描动画、批量生产《水浒传》人物传的完整开源工程：确定性帧引擎 + 28 部人物剧本 + 逐帧渲染 + TTS 配音烧字幕 + 发布门禁，全部本地完成，不依赖任何云服务。

```
鲁智深 · 倒拔垂杨柳        林冲 · 风雪山神庙        武松 · 景阳冈打虎        孙二娘 · 十字坡
```

## 这是什么

| 层 | 内容 | 说明 |
|---|---|---|
| 引擎 | `engine/engine.js` + `engine/eras_sh_*.js` + `engine/scenes/*.js` | 确定性帧引擎（同一时刻 t 必得同一帧，可复现、可回归）；28 个段落表 + 31 个场景文件 + 版画线描笔法库 |
| 流水线 | `pipeline/` | 逐帧渲染（Playwright→ffmpeg）、TTS 配音与字幕烧录、发布门禁与待发箱打包、收尾脚本生成器 |
| 数据 | `data/` | 30 份台词轴 `lines_sh_*.json`（时间轴 + 文案，配音与字幕共源） |
| 发布 | `publish/` | 发布元数据（28 部，标题/描述/话题/封面帧） |
| 方法 | `docs/` | 水浒人物选题研究 |

**独立工程**：不依赖任何 AI 绘画服务、不依赖云端 API、不依赖 WorkBuddy skill。外部依赖只有 Python + Playwright（Chromium）+ ffmpeg + Node（可选）。

## 与《三国》水墨系列的差异

本仓库是 [sanguo-ink-motion](https://github.com/dabing110/sanguo-ink-motion) 的姊妹工程，**引擎底座完全同源**（均来自花叔 huashu-art-motion）。差异在**内容层的美术语言**：

| | 三国（水墨） | 水浒（本仓库） |
|---|---|---|
| 视觉 | 干笔 + 平涂 + 描边的水墨笔法 | **版画线描**：焦墨勾线 + 宣纸底 + 钤印 |
| 转场 | 水墨晕染系 | dotBloom / smash / radiant / whip / goldLeaf / redWedge / ripple |
| 音效 | — | 活气 QA（相邻帧灰度差占比判死帧/跳变） |

## 快速开始

### 1. 环境

```bash
# Python 依赖
pip install playwright pillow numpy edge-tts
python -m playwright install chromium

# ffmpeg：装好加入 PATH 即可；或用环境变量指定
export FFMPEG_BIN=/path/to/ffmpeg
```

### 2. 本地看片（零依赖预览）

```bash
cd engine
python -m http.server 8080
# 浏览器打开 http://127.0.0.1:8080/index.html?film=sh_luzhishen
```

`?film=<名>` 选段落表（默认 `eras.js`）；不加参数直接看默认片。页面里按 `R` 可从任意时刻重渲（用于 QA 抽帧）。

### 3. 渲染一部片

```bash
# 整段渲（短片段）
python pipeline/render.py --film sh_luzhishen --out luzhishen.mp4

# 长片分段渲（推荐，绕开 Chromium 内存累积）
python pipeline/render.py --film sh_luzhishen --from 0 --to 8.2666667 --out luzhishen_c0.mp4
python pipeline/render.py --film sh_luzhishen --from 8.2666667 --to 16.5333333 --out luzhishen_c1.mp4
python pipeline/render.py --film sh_luzhishen --from 16.5333333 --to 24.8 --out luzhishen_c2.mp4

# 合并（流复制，不重编码）
printf "file 'luzhishen_c0.mp4'\nfile 'luzhishen_c1.mp4'\nfile 'luzhishen_c2.mp4'\n" > luzhishen_list.txt
ffmpeg -f concat -safe 0 -i luzhishen_list.txt -c copy -movflags +faststart luzhishen.mp4
```

### 4. 配音 + 烧字幕

```bash
python pipeline/build_voice.py --lines data/lines_sh_luzhishen.json --video luzhishen.mp4 --outdir _voice
```

产出：配音后成片 + `sub.ass` 烧录字幕 + 时间轴报告。**语速红线：每句所需 tempo ≤1.30（+30%）**，脚本会自适应轻微拉伸/压缩并在超标时报错——文案阶段就要控制（旁白每句约 9–14 字）。

### 5. 发布门禁 + 待发箱

```bash
python pipeline/prepare_channels.py --key sh_luzhishen --meta publish/发布元数据.json --force
```

自动执行：参数体检、音轨探测、字幕登记、抽封面帧、打待发箱目录（成片 + 封面 + 发布文案 + manifest）。

## 新增一部片（六步）

```bash
# ① 写剧本：N 幕 + 每幕一句旁白（id 对应 eras 里的幕 id）
# ② 写造型与场景：scenes/<名>.js（版画线描 rig）
# ③ 写段落表：engine/eras_sh_<名>.js（各幕时长、镜头、SCENE_LIBS 声明）
# ④ 回填台词轴：data/lines_sh_<名>.json（id/t0/t1/text）
# ⑤ 静态检查 → 渲染 → 配音 → 门禁（同上 3/4/5）
# ⑥ 生成收尾脚本（一次性）
python pipeline/gen_finish.py <key> <片名> <总时长> <幕1,幕2,...>
```

场景契约：`scenes/<名>.js` 以 `SCENES['<scene_id>'] = { draw(c, lt, t) }` 注册，`engine.js` 每帧调 `e.draw(c, lt, t, IMG, prev)`；`scenes/index.js` 按 `e.id` 匹配，缺场景记 `__bootErrors` 且引擎拒绝启动（fail-fast，不会渲出静默黑帧）。

## 已知坑（都踩过）

| 坑 | 解法 |
|---|---|
| Chromium 继承系统代理，连 `127.0.0.1` 本地服务都被拒，页面永远 boot 不完 | Playwright launch 加 `--no-proxy-server` |
| Windows 下 Python 子进程的 PATH 搜索不可靠，ffmpeg `FileNotFoundError` | `FFMPEG_BIN` 环境变量或 PATH 里放绝对路径 |
| 整段渲长片 Chromium 内存累积爆掉 | 分 3 段渲，再 concat 流复制合并 |
| 目录/文件名含中文，`http.server` 下资源 404 | 入口与素材全 ASCII；中文只进画面与文案 |
| 语速超标（tempo >1.30）配音变尖利 | 文案阶段按 5.5 字/秒估算；每句 ≤14 字 |
| 转场用 `chiaroscuro`/`dabs` 在版画片上出戏 | 版画片用 dotBloom / smash / radiant / whip / goldLeaf / redWedge / ripple |
| `eras` 的 `durs` 之和必须等于 `lines` 的 `total` | 转场时长已嵌入 dur，不额外叠加 |
| 结句白底标题框填充色与宣纸 `#e8e6de` 同色不可见 | 加深色细边框 + 早现长持 |
| 深色墨线画在深色暗块上等于没画 | 蒸汽/白气用纸白线画在焦墨灰块上 |
| 组合道具缺连接件（扁担↔筐）读不出 | 补垂绳，线宽 ≥3.4、tone ≥0.9 |
| `Z.seal` 钤印按 `q` 逐字显影，`q<1` 只显前缀 | 钤印收尾才完整 |
| `Z.manor`/`Z.shanzhai` 的 y 是「底部」 | 贴地面线 892，勿设 620~730（会悬空） |

## 目录

```
shuihu-ink-motion/
├── engine/
│   ├── engine.js            # 帧引擎（节拍网格、段落调度、renderFrame API）
│   ├── index.html           # 本地预览入口（?film=<名>）
│   ├── clip.html / clip.js  # 参数化片段入口
│   ├── transitions.js       # 幕间转场
│   ├── eras_sh_<名>.js ×28  # 28 部片段落表
│   ├── lib/                 # 工具库：brush paint rig render motion camera 等 17 个
│   │   └── fonts/           # 开源字体（SIL OFL，见 fonts/LICENSES.md）
│   └── scenes/              # 31 个水浒场景
├── pipeline/
│   ├── render.py            # 逐帧渲染（Playwright → image2pipe → ffmpeg）
│   ├── build_voice.py       # 配音字幕（edge-tts）
│   ├── prepare_channels.py  # 发布门禁 + 待发箱打包
│   ├── gen_finish.py        # 收尾脚本生成器
│   ├── gen_qa.py            # 活气 QA 脚本生成器
│   └── finish/              # 27 个各人物收尾脚本（配音→登记→打包→上传台）
├── data/                    # lines_sh_*.json ×30（台词轴：id/t0/t1/text）
├── publish/
│   └── 发布元数据.json       # 28 部元数据（标题/描述/话题/封面时刻）
└── docs/                    # 方法论
```

## 28 部人物（截至 2026-10）

宋江 · 晁盖 · 林冲（含全传） · 鲁智深 · 武松 · 吴用 · 卢俊义 · 李逵 · 花荣 · 杨志 · 燕青 · 史进 · 呼延灼 · 柴进 · 秦明 · 李俊 · 戴宗 · 时迁 · 张清 · 公孙胜 · 关胜 · 阮小七 · 石秀 · 顾大嫂 · 孙二娘 · 扈三娘 · 蓼儿洼 · 张顺

> 以 `publish/发布元数据.json` 的 `films` 为权威清单。

## 许可

- 代码：MIT（版权 © 2026 dabing110）
- 台词与场景代码：原创
- 《水浒传》原著：公共领域
- 字体：各开源字体沿用各自 SIL OFL 1.1（见 `engine/lib/fonts/LICENSES.md`）
- **TTS 服务条款提示**：`build_voice.py` 使用 edge-tts（调用微软 Edge 在线 TTS 服务），使用前请自行确认微软服务条款对你的场景可用。

## 致谢

**引擎底座来自花叔的 [huashu-art-motion](https://github.com/alchaincyf/huashu-art-motion)**（MIT © 花叔 Huashu）：本仓库 `engine/` 下的确定性帧引擎（`engine.js`、`index.html`、`transitions.js`）与 `engine/lib/` 的 17 个绘画/动效库均复制自该技能的 `scripts/engine/`，`pipeline/render.py` 亦源自其渲染器（本仓库仅做了 ffmpeg 路径参数化、`dur` 秒制适配与目录布局调整）。

本仓库的原创部分：28 部人物的剧本与台词轴（`data/lines_sh_*.json`）、31 个水浒场景（`engine/scenes/`）、28 个段落表（`engine/eras_sh_*.js`）、配音/门禁/发布流水线脚本，以及方法论文档。

版画线描的「焦墨勾线 + 宣纸底 + 钤印」视觉语言，来自对明清版画插图与近代木刻版画的观察；工程结构受「确定性渲染」思想影响（同 t 必同帧，QA 才能回归）。
