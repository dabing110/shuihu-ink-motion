# -*- coding: utf-8 -*-
"""SH-13 吴用 收尾：配音+烧字幕 → 登记元数据 → 打包待发箱 → 插入上传台（幂等）。

用法:
    python _finish_sh_wuyong.py            # 全链路
    python _finish_sh_wuyong.py --force    # 覆盖已有待发箱
"""
import argparse
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ENG = os.path.join(ROOT, "engine")
VERIFY = os.path.join(ROOT, "_渲染验证")
BOX = os.path.join(ROOT, "_视频号待发箱")
META = os.path.join(ROOT, "publish", "发布元数据.json")
STAGE = os.path.join(BOX, "上传台.html")
FF = os.environ.get("FFMPEG_BIN") or "ffmpeg"

KEY = "sh_wuyong"
NAME = "吴用"
DIRNAME = "SH-13-吴用"
SILENT = os.path.join(VERIFY, "wuyong_silent.mp4")
LINES = os.path.join(ROOT, "data", "lines_sh_wuyong.json")

INFO = {
    "cover_time": 13.6,
    "cover_note": "wu5 忠义堂梁山军师（11.8–15.0s）：运筹帏幄的智多星，朱砂钤下「智多星」军师令——全片唯一一处朱砂",
    "title": "吴用 · 智多星",
    "sub": "版画动画 · 25秒看完智多星",
    "desc": ("版画线描版《吴用》，25 秒讲完从东溪村私塾先生到宋江墓前自缢的谋主一生。\n\n"
             "郓城县东溪村私塾先生，表字学究、道号加亮，乡里唤他「智多星」→ 黄泥冈上献下蒙汗药酒之计，智取那十万贯生辰纲（与杨志、晁盖片互文）→ "
             "一番唇舌说动阮氏三雄入伙，七星聚义共图大事 → 假扮算命先生题下反诗，智赚玉麒麟卢俊义上了梁山（引出卢俊义片）→ "
             "坐镇忠义堂做了梁山军师，替天行道旗前第一谋主 → 定计火攻破大名府，救出卢俊义、石秀，梁山威名更盛 → "
             "却力主招安，劝众兄弟受朝廷诏安，埋下散伙根由 → 宋江被赐死后，吴用与花荣于墓前自缢，梁山谋主就此终局（与花荣片互文）。\n\n"
             "（考据说明：吴用为累积型文学形象，正史无其人；本片依《水浒传》小说系统。）\n\n"
             "本片与《林冲》《鲁智深》《武松》《宋江》《史进》《杨志》《晁盖》同一套宋元版画线描与焦墨语法：冷白宣纸、铁线描、排线明暗、焦墨块，"
             "全片仅朱砂一味（只用于第五幕忠义堂军师的「智多星」钤印）。signature 母题为儒巾（学者冠）+ 长袍 + 羽扇。配音与字幕为 AI 合成。"),
    "tags": ["#水浒传", "#吴用", "#智多星", "#加亮先生", "#东溪村", "#私塾先生",
             "#智取生辰纲", "#说三阮", "#智赚卢俊义", "#梁山军师", "#火攻大名府",
             "#招安", "#墓前自缢", "#名著", "#历史", "#版画动画", "#AI动画", "#知识分享"],
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

    cmd = [sys.executable, os.path.join(HERE, "prepare_channels.py"), "--key", KEY]
    if a.force:
        cmd.append("--force")
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    print("  " + ((r.stdout or "") + (r.stderr or ""))[-600:].replace("\n", "\n  "))

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
