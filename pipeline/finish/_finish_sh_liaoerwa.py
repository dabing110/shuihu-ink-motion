# -*- coding: utf-8 -*-
"""SH-31 蓼儿洼·梁山终局 收尾：配音+烧字幕 → 登记元数据 → 打包待发箱 → 插入上传台（幂等）。

用法:
    python _finish_sh_liaoerwa.py            # 全链路
    python _finish_sh_liaoerwa.py --force    # 覆盖已存在待发箱
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

KEY = "sh_liaoerwa"
NAME = "蓼儿洼"
DIRNAME = "SH-31-蓼儿洼"
SILENT = os.path.join(VERIFY, "liaoerwa_silent.mp4")
LINES = os.path.join(ROOT, "data", "lines_sh_liaoerwa.json")

INFO = {
    "cover_time": 1.6,
    "cover_note": "le1 受招安（0–3.2s）：梁山竖起「替天行道」大旗，宋江受封——由反入顺的转折，本片最有辨识度的一幕",
    "title": "蓼儿洼 · 梁山终局",
    "sub": "版画动画 · 33秒收口梁山",
    "desc": ("版画线描版《蓼儿洼·梁山终局》，33 秒收口整个系列：从「替天行道」的旗号，到楚州蓼儿洼的土冢。\n\n"
             "宣和年间，宋江率梁山受招安，旗号由「替天行道」改作「顺天护国」——从此由反入顺，北破大辽、南征方腊，功在社稷 → "
             "还朝封楚州安抚使，衣锦还乡 → 谁料高俅、杨戬奉旨赐下御酒，酒中藏毒（壶口一线朱砂，便是催命的记号）→ "
             "宋江已知是毒，为保全忠义之名，一饮而尽，毒发而亡 → 他恐李逵闻讯造反坏了梁山清名，唤来同饮 → "
             "黑旋风垂泪：「生时服侍哥哥，死了也只是哥哥部下一个小鬼。」一并饮下 → "
             "吴用、花荣闻讯，同缢于楚州蓼儿洼宋江墓前 → 一百单八将，十亡其八；招安不是归处，蓼儿洼才是。\n\n"
             "（考据说明：吴用、花荣「同缢蓼儿洼」出百回本第一百二十回；宋江饮药酒、李逵同死均依百回本末回。"
             "宋江、李逵、吴用、花荣皆为累积型文学形象，正史无其人。）\n\n"
             "本片复用《宋江》《李逵》《吴用》《花荣》四片的 rig，以蓼儿洼荒洼、双松、宋江墓（碑「宋公明之墓」）、"
             "两条垂落的墨色缢绳，一次收口整个系列。全片仅朱砂一味（御酒壶口一线、宋江李逵的毒酒盏与胸前血光、末幕「梁山」钤印）。"
             "配音与字幕为 AI 合成。"),
    "tags": ["#水浒传", "#蓼儿洼", "#梁山终局", "#宋江", "#李逵", "#吴用", "#花荣",
             "#受招安", "#征方腊", "#御酒毒死", "#同缢蓼儿洼", "#一百单八将",
             "#招安不是归处", "#百回本", "#名著", "#历史", "#版画动画", "#AI动画", "#知识分享"],
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
        "spec": {"w": 1920, "h": 1080, "dur": 33.6, "orientation": "横屏"},
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
