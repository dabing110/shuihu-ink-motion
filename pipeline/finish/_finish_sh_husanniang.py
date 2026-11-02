# -*- coding: utf-8 -*-
"""SH-22 扈三娘 收尾：配音+烧字幕 → 登记元数据 → 打包待发箱 → 插入上传台（幂等）。

用法:
    python _finish_sh_husanniang.py            # 全链路
    python _finish_sh_husanniang.py --force    # 覆盖已有待发箱
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

KEY = "sh_husanniang"
NAME = "扈三娘"
DIRNAME = "SH-22-扈三娘"
SILENT = os.path.join(VERIFY, "husanniang_silent.mp4")
LINES = os.path.join(ROOT, "data", "lines_sh_husanniang.json")

INFO = {
    "cover_time": 8.0,
    "cover_note": "hs3 红锦套索（6.2–9.6s）：阵前一抛套索生擒王英，朱砂飞索——本片最有辨识度的一幕",
    "title": "扈三娘 · 一丈青",
    "sub": "版画动画 · 29秒看完一丈青",
    "desc": "版画线描版《扈三娘》，29 秒讲完从扈家庄女将到追封花阳郡夫人的一丈青。\n\n"
            "郓州扈家庄扈太公之女，使两口日月双刀，善用红锦套索，绰号「一丈青」→ "
            "三庄联防，与祝家庄李家庄共拒梁山 → 阵前一抛红锦套索，生擒矮脚虎王英 → "
            "追袭宋江，反被林冲活捉上山（与林冲片互文）→ 李逵抡起板斧，杀尽扈家一门老幼（与李逵片互文）→ "
            "宋江作主，把她许配给矮脚虎王英 → 梁山排座次，夫妻双双上阵 → "
            "征方腊乌龙岭一役，王英战死 → 她赶去报仇，力竭同殉，追封花阳郡夫人。\n\n"
            "（考据说明：扈三娘为文学虚构人物，正史无其人；「全家被杀却由宋江作主嫁给王英」"
            "依百回本第五十回，是后世批评水浒女性观的主要靶点，本片直陈而不美化。）\n\n"
            "本片与《林冲》《宋江》《李逵》《武松》同一套宋元版画线描与焦墨语法：冷白宣纸、铁线描、"
            "排线明暗、焦墨块。全片仅朱砂一味（红锦套索、第五幕灭门的血光点与末幕「一丈青」钤印）。"
            "signature 母题为日月双刀 + 红锦套索 + 雉尾帅盔。配音与字幕为 AI 合成。",
    "tags": ["#水浒传", "#扈三娘", "#一丈青", "#日月双刀", "#红锦套索", "#三庄联防",
             "#生擒王英", "#梁山女将", "#乌龙岭", "#花阳郡夫人", "#地慧星",
             "#名著", "#历史", "#版画动画", "#AI动画", "#知识分享"],
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
        "spec": {"w": 1920, "h": 1080, "dur": 29.2, "orientation": "横屏"},
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
