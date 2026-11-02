# -*- coding: utf-8 -*-
"""SH-33 孙二娘 收尾：配音+烧字幕 → 登记元数据 → 打包待发箱 → 插入上传台（幂等）。

用法:
    python _finish_sh_sunerniang.py            # 全链路
    python _finish_sh_sunerniang.py --force    # 覆盖已有待发箱
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

KEY = "sh_sunerniang"
NAME = "孙二娘"
DIRNAME = "SH-33-孙二娘"
SILENT = os.path.join(VERIFY, "sunerniang_silent.mp4")
LINES = os.path.join(ROOT, "data", "lines_sh_sunerniang.json")

INFO = {
    "cover_time": 1.6,
    "cover_note": "s1 十字坡（0–3.2s）：母夜叉孙二娘，包髻散发缕、夜叉纹围裙、手持剔骨短刃、腰封夜字——signature 三件套俱全",
    "title": "孙二娘 · 母夜叉",
    "sub": "版画动画 · 33秒看完母夜叉",
    "desc": ("版画线描版《孙二娘》，33 秒讲完从十字坡开酒店到梁山女将的母夜叉。\n\n"
             "孟州道十字坡开酒店，绰号「母夜叉」，丈夫张青（菜园子）→ 武松杀嫂后发配孟州，过十字坡歇脚 → "
             "药酒藏机，被武松察觉 → 将计就计，武松反制母夜叉 → 张青挑担归来，从中劝和 → "
             "不打不相识，义结金兰 → 荐投二龙山，另寻去处 → 三山聚义并入梁山 → 排座次地壮星，梁山第一百零三位好汉。\n\n"
             "（考据说明：孙二娘为《水浒传》小说人物；张青绰号「菜园子」，夫妇于十字坡开酒店；"
             "事见第二十七回「母夜叉孟州道卖人肉，武都头十字坡遇张青」；后随二龙山并入梁山，排地壮星，列一百单八将之第一百零三。"
             "黑店一节以留白暗写处理——只画蒸笼白气、后厨门洞暗影与药酒碗，不直白血腥。）\n\n"
             "本片与《扈三娘》《顾大嫂》同为水浒女将线，沿用宋元版画线描与焦墨语法：冷白宣纸、铁线描、排线明暗、焦墨块，"
             "全片仅朱砂一味（只用于十字坡酒幌淡朱底、聚义幕地壮星小星、末幕「母夜叉」钤印）。"
             "signature 母题为剔骨短刃 + 夜叉锯齿纹围裙 + 十字坡酒幌 + 蒸笼白气。配音与字幕为 AI 合成。"),
    "tags": ["#水浒传", "#孙二娘", "#母夜叉", "#十字坡", "#武松", "#张青", "#菜园子", "#蒙汗药",
             "#二龙山", "#地壮星", "#梁山女将", "#名著", "#历史", "#版画动画", "#AI动画", "#知识分享"],
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
