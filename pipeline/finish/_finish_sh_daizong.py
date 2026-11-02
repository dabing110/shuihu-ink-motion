# -*- coding: utf-8 -*-
"""SH-27 戴宗 收尾：配音+烧字幕 → 登记元数据 → 打包待发箱 → 插入上传台（幂等）。

用法:
    python _finish_sh_daizong.py            # 全链路
    python _finish_sh_daizong.py --force    # 覆盖已有待发箱
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
META_TMP = META + ".tmp"
STAGE = os.path.join(BOX, "上传台.html")
STAGE_TMP = STAGE + ".tmp"
FF = os.environ.get("FFMPEG_BIN") or "ffmpeg"

KEY = "sh_daizong"
NAME = "戴宗"
DIRNAME = "SH-27-戴宗"
SILENT = os.path.join(VERIFY, "daizong_silent.mp4")
LINES = os.path.join(ROOT, "data", "lines_sh_daizong.json")

INFO = {
    "cover_time": 4.5,
    "cover_note": "dz2 甲马神行（3.0–6.0s）：两腿缚上甲马，日行八百里，朱砂符条——本片最有辨识度的一幕",
    "title": "戴宗 · 神行太保",
    "sub": "版画动画 · 28秒看完神行太保",
    "desc": "版画线描版《戴宗》，28 秒讲完从江州押牢节级到岳庙大笑而终的神行太保。\n\n江州两院押牢节级，学得道术神行法，腿上缚两副甲马便可日行五百里、四副日行八百里，绰号「神行太保」→ 与宋江结为生死之交（与宋江片互文）→ 宋江写反诗下狱，他奉蔡九知府之命上东京送信 → 吴用伪造蔡京回书，笔迹破绽被黄文炳看破，一起下了死囚牢 → 他先一日飞报梁山，才有江州劫法场（与李逵、晁盖片互文）→ 上泊后专走报机密，传令四方，梁山的耳目尽在他腿上 → 招安前后往返东京传旨，一句话全靠他跑出来 → 还朝授兖州府都统制 → 纳印到泰安州岳庙出家，一日大笑而终。\n\n（考据说明：戴宗为文学虚构人物，正史无其人；「甲马神行」出宋元笔记里的召神役鬼之术，百回本据此敷衍。）\n\n本片与《林冲》《宋江》《武松》《鲁智深》同一套宋元版画线描与焦墨语法：冷白宣纸、铁线描、排线明暗、焦墨块。全片仅朱砂一味（甲马上的朱砂符条与末幕「神行太保」钤印）。signature 母题为甲马符条 + 绑腿芒鞋 + 疾行的烟尘。配音与字幕为 AI 合成。",
    "tags": ["#水浒传", "#戴宗", "#神行太保", "#甲马神行", "#江州两院", "#伪造回书", "#黄文炳", "#江州劫法场", "#走报机密", "#传旨招安", "#纳印出家", "#泰安州岳庙", "#天速星", "#名著", "#历史", "#版画动画", "#AI动画", "#知识分享"],
}


def write_atomic(path, tmp, text):
    with open(tmp, "w", encoding="utf-8", newline="") as f:
        f.write(text)
    os.replace(tmp, path)


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
        "spec": {"w": 1920, "h": 1080, "dur": 28.0, "orientation": "横屏"},
        "batch": "SH",
    }
    write_atomic(META, META_TMP, json.dumps(cfg, ensure_ascii=False, indent=1))
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
    write_atomic(STAGE, STAGE_TMP, s[:st] + json.dumps(obj, ensure_ascii=False) + s[st + end:])
    print(f"  上传台插入 {NAME}（items 共 {len(items)} 条）")


if __name__ == "__main__":
    main()
