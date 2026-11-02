# -*- coding: utf-8 -*-
"""SH-26 呼延灼 收尾：配音+烧字幕 → 登记元数据 → 打包待发箱 → 插入上传台（幂等）。

用法:
    python _finish_sh_huyanzhuo.py            # 全链路
    python _finish_sh_huyanzhuo.py --force    # 覆盖已有待发箱
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

KEY = "sh_huyanzhuo"
NAME = "呼延灼"
DIRNAME = "SH-26-呼延灼"
SILENT = os.path.join(VERIFY, "huyanzhuo_silent.mp4")
LINES = os.path.join(ROOT, "data", "lines_sh_huyanzhuo.json")

INFO = {
    "cover_time": 4.6,
    "cover_note": "hyz2 连环马阵（3.0–6.2s）：三千连环甲马连成一列，铁墙推进——本片最有辨识度的一幕",
    "title": "呼延灼 · 双鞭",
    "sub": "版画动画 · 28秒看完双鞭呼延灼",
    "desc": "版画线描版《呼延灼》，28 秒讲完从汝宁郡都统制到马革裹尸的双鞭呼延灼。\n\n汝宁郡都统制，开国名将呼延赞嫡派子孙，使两条水磨八棱钢鞭，绰号「双鞭」→ 奉旨领军征剿梁山，摆下三千连环甲马，铁墙推进 → 头一阵大败梁山，梁山几无破法 → 时迁盗甲赚来金枪手徐宁，钩镰枪法破了连环马（与时迁、徐宁线互文）→ 全军尽没，只身投奔青州 → 青州一战又被赚上山，感宋江之义，归顺梁山 → 排座次坐马军五虎将之四 → 征辽、征田虎王庆，鞭下未曾吃亏 → 还朝授御营兵马指挥使 → 后随军抗金，力战而死，马革裹尸。\n\n（考据说明：呼延灼为文学虚构人物，正史无其人，小说借呼延赞的家世塑造；「死于抗金」出简本与续书系统，百回本未写其死。）\n\n本片与《林冲》《宋江》《武松》《鲁智深》同一套宋元版画线描与焦墨语法：冷白宣纸、铁线描、排线明暗、焦墨块。全片仅朱砂一味（双鞭鞭节的朱砂缠丝与末幕「双鞭」钤印）。signature 母题为水磨八棱钢鞭 + 连环甲马 + 踢雪乌骓。配音与字幕为 AI 合成。",
    "tags": ["#水浒传", "#呼延灼", "#双鞭", "#呼延赞之后", "#连环甲马", "#钩镰枪破阵", "#征剿梁山", "#青州", "#归顺梁山", "#五虎将", "#征辽", "#马革裹尸", "#天威星", "#名著", "#历史", "#版画动画", "#AI动画", "#知识分享"],
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
        "spec": {"w": 1920, "h": 1080, "dur": 28.2, "orientation": "横屏"},
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
