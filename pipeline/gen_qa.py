#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""生成活气 QA 脚本：_qa_sh_<key>.py（判据为「相邻帧灰度差>8 的像素占比」）。

用法: python _gen_qa.py <key(不带 sh_ 前缀)> <total> <dur1,dur2,...>
  例: python _gen_qa.py husanniang 29.2 3.2,3.0,3.4,3.0,3.2,3.4,3.0,3.4,3.6
"""
import os, sys

TPL = '''#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""{name}（{num}）活气 QA（活气像素占比版）：0.2s 起每 0.4s 抽全片帧 → 相邻帧「灰度差>8 的像素占比」。
判据（避开水浒版画大片留白+慢动作的平均差误报）：
  · 占比 < 0.10% 记死帧嫌疑（真·趋零帧）
  · 占比 > 32%  记跳变嫌疑（除转场边界外；动作戏火/浪/箭雨可持续 ~28%，不误报；真故障/转场 >34%）
转场边界（各幕 dur 末段 ~0.6s 窗口）豁免。
"""
import os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "_审片", "qa_sh_{key}", "sparse")
PY = sys.executable

os.makedirs(OUT, exist_ok=True)
times = [round(0.2 + i * 0.4, 2) for i in range(int(({total} - 0.2) / 0.4) + 1)]
print(f"抽帧 {{len(times)}} 个时刻（0.2s 起，0.4s 间隔）")

r = subprocess.run(
    [PY, os.path.join(ROOT, "render.py"), "--film", "sh_{key}",
     "--stills", ",".join(str(t) for t in times), "--out", OUT],
    capture_output=True, text=True, encoding="utf-8", errors="ignore")
print(r.stdout.strip()[-200:] or r.stderr.strip()[-500:])
if "pageerror" in (r.stderr or "") or "报错" in (r.stdout or ""):
    print("!! 渲染有 page error，QA 终止")
    sys.exit(1)

durs = [{durs}]
bounds, acc = [], 0.0
for d in durs[:-1]:
    acc += d
    bounds.append(round(acc, 2))
def in_transition(t):
    for b in bounds:
        if b - 0.6 <= t <= b + 0.7:
            return True
    return False

TH_DEAD = 0.0010
TH_JUMP = 0.32
prev, prev_t, dead, jump, ratios = None, None, [], [], []
for t in times:
    p = os.path.join(OUT, f"t{{t:06.2f}}.png")
    if not os.path.exists(p):
        continue
    im = np.asarray(Image.open(p).convert("L"), dtype=np.float32)
    if prev is not None:
        frac = float((np.abs(im - prev) > 8).mean())
        ratios.append((prev_t, t, frac))
        flag = ""
        if frac < TH_DEAD and not in_transition(t):
            dead.append((prev_t, t, frac)); flag = "  <== 死帧嫌疑"
        elif frac > TH_JUMP and not in_transition(t):
            jump.append((prev_t, t, frac)); flag = "  <== 跳变嫌疑"
        print(f"  {{prev_t:5.2f}} -> {{t:5.2f}}  活气占比 {{frac*100:6.3f}}%{{flag}}")
    prev, prev_t = im, t

inbody = [f for (a, b, f) in ratios if not in_transition(b)]
if inbody:
    print(f"\\n幕内活气占比：最小 {{min(inbody)*100:.3f}}%  最大 {{max(inbody)*100:.3f}}%")
else:
    print("\\n幕内样本为空（异常）")
print(f"死帧嫌疑 {{len(dead)}} 处；跳变嫌疑 {{len(jump)}} 处")
if dead: print("死帧:", dead)
if jump: print("跳变:", jump)
ok = len(dead) == 0 and len(jump) == 0 and bool(inbody)
print("QA 结论:", "PASS" if ok else "需人工复核")
'''


def main():
    key = sys.argv[1]
    total = float(sys.argv[2])
    durs = sys.argv[3].split(",")
    num = {"husanniang": "SH-22", "qinming": "SH-23", "lijun": "SH-24", "chaijin": "SH-25",
           "huyanzhuo": "SH-26", "daizong": "SH-27", "shiqian": "SH-28", "zhangqing": "SH-29",
           "gaoqiu": "SH-30"}.get(key, "SH-?")
    name = {"husanniang": "扈三娘", "qinming": "秦明", "lijun": "李俊", "chaijin": "柴进",
            "huyanzhuo": "呼延灼", "daizong": "戴宗", "shiqian": "时迁", "zhangqing": "张清",
            "gaoqiu": "高俅"}.get(key, key)
    s = TPL.format(key=key, name=name, num=num, total=total, durs=",".join(durs))
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_qa_sh_%s.py" % key)
    open(out, "w", encoding="utf-8").write(s)
    print("wrote", out)


main()
