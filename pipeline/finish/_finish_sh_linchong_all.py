# -*- coding: utf-8 -*-
"""SH-09 林冲·全传 收尾：配音+烧字幕 → 登记元数据 → 打包待发箱 → 插入上传台（幂等）。

合并 SH-01《林冲》(lc1-lc8) 与 SH-08《林冲·梁山终局》(l21-l28)，十六幕一镜到底，
补全林冲从东京教头到六和寺病逝的完整弧光。旧的两部（SH-01、SH-08）保留不动。
用法:
    python _finish_sh_linchong_all.py            # 全链路
    python _finish_sh_linchong_all.py --force    # 覆盖已有待发箱
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

KEY = "sh_linchong_all"
NAME = "林冲·全传"
DIRNAME = "SH-09-林冲·全传"
SILENT = os.path.join(VERIFY, "linchong_all_silent.mp4")
LINES = os.path.join(ROOT, "data", "lines_sh_linchong_all.json")

INFO = {
    "cover_time": 29.3,
    "cover_note": "l22 梁山聚义（27.8–30.8s）：替天行道大旗展开，一百单八将排座次——林冲为马军五虎将之首、天罡星第六位「豹子头」",
    "title": "林冲 · 全传：从禁军教头到六和寺",
    "sub": "版画动画 · 50秒看完豹子头一生",
    "desc": """版画线描版《林冲·全传》，50 秒一镜到底，讲完豹子头的一生。

东京八十万禁军枪棒教头，妻被高衙内觊觎，高俅设局使其持刀误入白虎节堂，刺面加枷、发配沧州三千里；道经野猪林，董超薛霸受陆谦嘱托加害，鲁智深一杖飞来留得性命；至沧州守草料场，风雪夜沽酒，草厅被雪压塌，夜宿山神庙，闻陆谦、富安、差拨放火之谋，忍无可忍手刃三人，踏雪投奔梁山。

上了梁山，林冲火并王伦，迎晁盖坐镇 → 梁山聚义，替天行道旗展，一百单八将排座次，林冲为马军五虎将之首、天罡星第六位「豹子头」→ 随宋江受招安，北征辽国，南讨方腊，枪下屡立战功，然兄弟渐凋零 → 班师杭州，林冲染患风瘫，留养六和寺 → 武松伴护榻前，半年，钱塘潮信几度起落 → 风瘫难起，林冲病逝，追封忠武郎 → 豹子头之名，长留忠义堂上。

（考据说明：林冲为《大宋宣和遗事》与宋元话本累积而成的文学形象，正史无对应人物；「火并王伦」「征方腊」「六和寺风瘫病逝」依《水浒传》百回本，不采索隐。）

本片与《林冲》《鲁智深》《武松》同一套宋元版画线描与焦墨语法：冷白宣纸、铁线描、排线明暗、焦墨块，全片仅朱砂一味（只用于旗、枪缨、钤印与那一笔不直绘的血）。末幕落雪呼应开篇的雪——一个人物，一生收束。配音与字幕为 AI 合成。""",
    "tags": ["#水浒传", "#林冲", "#豹子头", "#禁军教头", "#误入节堂", "#野猪林", "#风雪山神庙",
             "#火并王伦", "#梁山聚义", "#替天行道", "#受招安", "#征方腊", "#六和寺", "#风瘫",
             "#忠武郎", "#武松", "#名著", "#历史", "#版画动画", "#AI动画", "#知识分享"],
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
        "spec": {"w": 1920, "h": 1080, "dur": 49.6, "orientation": "横屏"},
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
