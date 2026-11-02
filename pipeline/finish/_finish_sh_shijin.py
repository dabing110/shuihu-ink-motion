# -*- coding: utf-8 -*-
"""SH-10 史进 收尾：配音+烧字幕 → 登记元数据 → 打包待发箱 → 插入上传台（幂等）。

用法:
    python _finish_sh_shijin.py            # 全链路
    python _finish_sh_shijin.py --force    # 覆盖已有待发箱
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

KEY = "sh_shijin"
NAME = "史进"
DIRNAME = "SH-10-史进"
SILENT = os.path.join(VERIFY, "shijin_silent.mp4")
LINES = os.path.join(ROOT, "data", "lines_sh_shijin.json")

INFO = {
    "cover_time": 7.3,
    "cover_note": "sj3 一身九纹龙（5.8–8.8s）：一身刺了九条龙，人都唤他九纹龙——史进的签字，也是全书第一个出场的梁山好汉",
    "title": "史进 · 九纹龙的不归路",
    "sub": "版画动画 · 25秒看完九纹龙",
    "desc": ("版画线描版《史进》，25 秒讲完从史家庄顽少到昱岭关阵亡的最后一步。\n\n"
             "华阴县史家庄史太公独子，不喜农耕，独爱枪棒 → 东京八十万禁军教头王进因高俅迫害避难史家庄，史进拜其为师，"
             "半年武艺精通，于身刺九条龙，人称九纹龙 → 少华山朱武、陈达、杨春借粮，陈达被擒，朱武杨春行苦肉计，"
             "史进感其义气，反与三人结交 → 中秋夜猎户李吉告发，华阴县尉领兵围庄，史进杀出、烧了庄院，往少华山落草 → "
             "后离少华山寻王进不着，辗转江湖，终上梁山，排第二十三位（马军八骠骑兼先锋使）→ 征方腊昱岭关之战，"
             "被庞万春乱箭射死，为梁山阵亡头领之一。\n\n"
             "（考据说明：史进为累积型文学形象，《大宋宣和遗事》已著录「九纹龙史进」，龚圣与《宋江三十六人赞》有赞，正史无其人；"
             "本片依《水浒传》小说系统。昱岭关中箭阵亡依百回本。）\n\n"
             "本片与《林冲》《鲁智深》《武松》《宋江》同一套宋元版画线描与焦墨语法：冷白宣纸、铁线描、排线明暗、焦墨块，"
             "全片仅朱砂一味（只用于钤印、第五幕燔庄的火星、第八幕中箭那一抹）。第三幕「九纹龙身」以袒身九条龙刺青立其身份，不做艳俗直绘。"
             "配音与字幕为 AI 合成。"),
    "tags": ["#水浒传", "#史进", "#九纹龙", "#王进教艺", "#少华山结义", "#中秋烧庄",
             "#梁山聚义", "#马军八骠骑", "#昱岭关", "#征方腊", "#阵亡", "#名著",
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
