# -*- coding: utf-8 -*-
"""SH-07 宋江 收尾：配音+烧字幕 → 登记元数据 → 打包待发箱 → 插入上传台（幂等）。

用法:
    python _finish_sh_songjiang.py            # 全链路
    python _finish_sh_songjiang.py --force    # 覆盖已有待发箱
"""
import argparse
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))      # 仓库根
ENG = os.path.join(ROOT, "engine")
VERIFY = os.path.join(ROOT, "_渲染验证")
BOX = os.path.join(ROOT, "_视频号待发箱")
META = os.path.join(ROOT, "publish", "发布元数据.json")
STAGE = os.path.join(BOX, "上传台.html")
FF = os.environ.get("FFMPEG_BIN") or "ffmpeg"

KEY = "sh_songjiang"
NAME = "宋江"
DIRNAME = "SH-07-宋江"
SILENT = os.path.join(VERIFY, "songjiang_silent.mp4")
LINES = os.path.join(ROOT, "data", "lines_sh_songjiang.json")

INFO = {
    "cover_time": 13.8,
    "cover_note": "sj5 浔阳楼题反诗（11.8–15.0s）：「他时若遂凌云志，敢笑黄巢不丈夫」——宋江一生最关键的一次自我暴露",
    "title": "宋江 · 及时雨的不归路",
    "sub": "版画动画 · 25秒看完宋公明",
    "desc": ("版画线描版《宋江》，25 秒讲完从郓城小吏到梁山首领的最后一步。\n\n"
             "郓城县押司，乐善好施，人称及时雨、孝义黑三郎 → 晁盖等智取生辰纲事发，宋江飞马报信私放之 → "
             "晁盖书落于招文袋，被阎婆惜以告发达官府相逼，宋江怒而杀之 → 刺配江州，识戴宗、李逵 → "
             "浔阳楼醉题反诗「他时若遂凌云志，敢笑黄巢不丈夫」，被黄文炳告发论死 → "
             "晁盖率梁山好汉劫法场，李逵抡斧开路，遂得上山 → 梁山聚义一百单八将，立「替天行道」旗 → "
             "受招安，征方腊之后功成，饮赐御酒而亡，葬于蓼儿洼。\n\n"
             "（考据说明：宋江为累积型文学形象，《大宋宣和遗事》已见其名，龚圣与《宋江三十六人赞》著录，"
             "正史无其人；本片依《水浒传》小说系统。）\n\n"
             "本片与《林冲》《鲁智深》《武松》同一套宋元版画线描与焦墨语法：冷白宣纸、铁线描、排线明暗、焦墨块，"
             "全片仅朱砂一味（只用于印与第三幕那一刀）。第三幕「怒杀阎婆惜」以招文袋与一笔朱砂交代，不做血腥直绘。"
             "配音与字幕为 AI 合成。"),
    "tags": ["#水浒传", "#宋江", "#及时雨", "#私放晁盖", "#怒杀阎婆惜", "#浔阳楼题反诗",
             "#江州劫法场", "#梁山聚义", "#替天行道", "#招安", "#蓼儿洼", "#名著",
             "#历史", "#版画动画", "#AI动画", "#知识分享"],
}


def probe(video):
    r = subprocess.run([FF, "-hide_banner", "-i", video],
                       capture_output=True, text=True, encoding="utf-8", errors="ignore")
    txt = r.stderr or ""
    dur = 0.0
    m = re.search(r"Duration:\s*(\d+):(\d+):([\d.]+)", txt)
    if m:
        dur = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    w = h = 0
    m = re.search(r"Video:.*?,\s*(\d{3,5})x(\d{3,5})", txt)
    if m:
        w, h = int(m.group(1)), int(m.group(2))
    return w, h, round(dur, 2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()

    if not os.path.exists(SILENT):
        print("!! 无声成片不存在：", SILENT)
        sys.exit(1)

    # ---- 1) 配音 + 烧字幕
    outdir = os.path.join(ROOT, DIRNAME, "配音与字幕")
    final = os.path.join(ROOT, DIRNAME, f"{NAME}_配音字幕版.mp4")
    os.makedirs(outdir, exist_ok=True)
    if os.path.exists(final) and os.path.getsize(final) > 1_000_000:
        print(f"  配音已存在，跳过：{final}")
    else:
        cmd = [sys.executable, os.path.join(HERE, "build_voice_hq.py"),
               "--lines", LINES, "--video", SILENT, "--outdir", outdir, "--final", final]
        r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
        if not os.path.exists(final) or os.path.getsize(final) < 1_000_000:
            print((r.stdout or "")[-1200:], (r.stderr or "")[-800:])
            print("!! 配音未产出")
            sys.exit(1)
    print(f"  终版 -> {final}（{os.path.getsize(final)}B）")

    # ---- 2) 登记
    cfg = json.load(open(META, encoding="utf-8"))
    cfg["films"][KEY] = {
        "name": NAME,
        "video": f"{DIRNAME}/{NAME}_配音字幕版.mp4",
        "subtitle": f"{DIRNAME}/配音与字幕/sub.ass",
        "voice": "narration",
        "cover_time": INFO["cover_time"],
        "cover_note": INFO["cover_note"],
        "title": INFO["title"],
        "sub": INFO["sub"],
        "desc": INFO["desc"],
        "tags": INFO["tags"],
        "spec": {"w": 1920, "h": 1080, "dur": 24.8, "orientation": "横屏"},
        "batch": "SH",
    }
    json.dump(cfg, open(META, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"  已登记 {KEY}（films 共 {len(cfg['films'])} 部）")

    # ---- 3) 打包
    cmd = [sys.executable, os.path.join(HERE, "prepare_channels.py"), "--key", KEY]
    if a.force:
        cmd.append("--force")
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    print("  " + ((r.stdout or "") + (r.stderr or ""))[-600:].replace("\n", "\n  "))

    # ---- 4) 上传台
    s = open(STAGE, encoding="utf-8").read()
    ms = list(re.finditer(r"(?:const|let|var|window\.)\s*DATA\s*=", s))
    if not ms:
        print("  !! 上传台未找到 DATA，跳过插入")
        return
    st = s.find("{", ms[0].end() - 1)
    dec = json.JSONDecoder()
    obj, end = dec.raw_decode(s[st:])
    items = obj.setdefault("items", [])
    if any(i.get("key") == KEY for i in items):
        print(f"  上传台已含 {KEY}，跳过")
        return
    cands = [d for d in os.listdir(BOX)
             if os.path.isdir(os.path.join(BOX, d)) and d.endswith(f"-{NAME}")]
    if not cands:
        print(f"  !! 待发箱目录不存在（*/-{NAME}）")
        return
    folder = sorted(cands)[-1]
    manifest = {}
    mp = os.path.join(BOX, folder, "manifest.json")
    if os.path.exists(mp):
        manifest = json.load(open(mp, encoding="utf-8"))
    w, h, dur = probe(final)
    items.append({
        "folder": folder, "batch": manifest.get("batch", folder.rsplit("-", 1)[0]),
        "name": NAME, "key": KEY,
        "title": INFO["title"], "sub": INFO["sub"], "desc": INFO["desc"], "tags": INFO["tags"],
        "video": f"{NAME}.mp4", "cover": "封面.jpg", "cover_time": INFO["cover_time"],
        "spec": {"w": w, "h": h, "dur": dur,
                 "size_mb": round(os.path.getsize(final) / 1048576, 2), "orientation": "横屏"},
        "gate": manifest.get("gate", {"voice": True, "subtitle": True, "issues": [], "passed": True}),
        "warnings": manifest.get("warnings", []), "badge": "新",
    })
    open(STAGE, "w", encoding="utf-8").write(s[:st] + json.dumps(obj, ensure_ascii=False) + s[st + end:])
    print(f"  上传台插入 {NAME}（items 共 {len(items)} 条）")


if __name__ == "__main__":
    main()
