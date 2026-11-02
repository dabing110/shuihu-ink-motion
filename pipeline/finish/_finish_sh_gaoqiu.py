# -*- coding: utf-8 -*-
"""SH-30 高俅 收尾：配音+烧字幕 → 登记元数据 → 打包待发箱 → 插入上传台（幂等）。

用法:
    python _finish_sh_gaoqiu.py            # 全链路
    python _finish_sh_gaoqiu.py --force    # 覆盖已有待发箱
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

KEY = "sh_gaoqiu"
NAME = "高俅"
DIRNAME = "SH-30-高俅"
SILENT = os.path.join(VERIFY, "gaoqiu_silent.mp4")
LINES = os.path.join(ROOT, "data", "lines_sh_gaoqiu.json")

INFO = {
    "cover_time": 4.8,
    "cover_note": "gq2 鸳鸯拐（3.2–6.4s）：端王园里一脚踢还那个气球，朱砂缝线是他一生的起点——本片最有辨识度的一幕",
    "title": "高俅 · 高毬",
    "sub": "版画动画 · 31秒看完高俅",
    "desc": "版画线描版《高俅》，31 秒讲完从东京浮浪子弟到一杯毒酒——全书「逼上梁山」的总闸门。\n\n东京开封府一个浮浪破落户子弟，排行第二，吹弹歌舞、使枪棒、相扑顽耍，若论仁义礼智信却是不会 → 因踢得一脚好气球，京师人口顺，叫他做高毬 → 在端王府做亲随，端王踢气球时球滚到脚边，他使一个「鸳鸯拐」踢还，端王大喜，就此留在府里 → 端王登极是为徽宗，不到半年抬举他做到殿帅府太尉 → 上任头一日点卯，先清算三十年前王进之父的旧账，逼得八十万禁军教头王进连夜携母出逃，一路逃到史家村，这才教出了九纹龙史进（与史进片互文）→ 明知干儿子高衙内觊觎林娘子，仍旧做主设局：假买宝刀，引林冲误入白虎节堂，以行刺论罪，刺配沧州（与林冲片互文）→ 与蔡京、童贯结为一党，三番派出呼延灼、关胜、秦明征剿梁山，结果这三员将到后来全成了梁山自己人（与呼延灼、关胜、秦明片互文）→ 他自己领兵三打梁山，三战三败，被阮氏兄弟活捉上山，满口答应替梁山求招安 → 放还之后一字不提，只报「天时不顺，暂且回军」→ 最后合谋把药下在御酒里，宋江饮下而亡——全书最后一件大事，是他做的（与宋江片互文）。\n\n（考据说明：高俅史有其人，《宋史》记载极略，为徽宗朝宠臣，未任殿帅府太尉，亦无陷害林冲之事；「因踢气球发迹」「高二改作高俅」皆出百回本小说家言。本片按小说叙事，立场是批判的：不写他的球技本领，只写权力的来处与用法。）\n\n本片与《林冲》《宋江》《武松》《鲁智深》同一套宋元版画线描与焦墨语法：冷白宣纸、铁线描、排线明暗、焦墨块。全片仅朱砂一味（前两幕气球的缝线、第九幕御酒壶口的一线与末幕「高俅」钤印）。signature 母题为长翅幞头 + 团领斓袍 + 执笏 + 气球。配音与字幕为 AI 合成。",
    "tags": ["#水浒传", "#高俅", "#高太尉", "#高毬", "#蹴鞠", "#鸳鸯拐", "#殿帅府太尉", "#私走延安府", "#王进", "#白虎节堂", "#林冲", "#三败水泊", "#背信", "#御酒毒宋江", "#名著", "#历史", "#版画动画", "#AI动画", "#知识分享"],
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
        "spec": {"w": 1920, "h": 1080, "dur": 31.0, "orientation": "横屏"},
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
