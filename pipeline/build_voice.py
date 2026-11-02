#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""六连专用配音 + 字幕（HQ 版）—— 在 build_voice_winrt.py 基础上叠加四维提质中的「配音/字幕」项
=====================================================================

与通用版 build_voice_winrt.py 的差异（2026-10-25 六连质量基准）：
  配音：
   1. 逐句 RMS 归一（目标 0.16）——部与部、句与句音量一致（原版只做全曲峰值兜底）
   2. 句间气口 250ms（原版 100ms）——start = 幕首+0.12s，end cap = 下句 t0-0.25s
   3. 软限幅 -1dBFS（0.89）逐句生效；终版再过 alimiter，杜绝破音
  字幕：
   4. 字幕比语音提前 120ms 出现（观看习惯：先见字后闻声）
   5. 字号随句长自适应（≤10 字 58 / 11-14 字 50 / >14 字 44）+ Outline 2 + Shadow 1 + MarginV 60（底部安全区）
   6. 句内句号剥除（一句一行惯例），保留冒号与问号

其余机制（worker 子进程合成、RIFF 头剥离、去直流/淡入淡出、atempo 压拍、覆盖写轨）
全部继承通用版，坑与注释不重复，改动以 diff 思维维护。

用法
----
  python build_voice_hq.py --lines lines_zhangliao.json \
      --video ../_渲染_张辽/zhangliao.mp4 \
      --outdir ../_配音_张辽 \
      --final ../_视频号待发箱/2026-10-25-张辽/张辽.mp4
"""

import argparse
import json
import os
import re
import subprocess
import sys
import wave

import numpy as np

FF = os.environ.get("FFMPEG_BIN") or "ffmpeg"
PY = sys.executable
SR = 44100

DEFAULT_VOICE = r"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech_OneCore\Voices\Tokens\MSTTS_V110_zhCN_KangkangM"
LANG = "zh-CN"
RAW_SR = 16000

# 字幕样式：KaiTi，米白底框（&H50B8DCEE，BGR 序），描边 2 + 投影 1，底部安全区 MarginV 60
ASS_STYLE = (
    "Style: 字幕,KaiTi,58,&H00141414,&H00141414,&H50B8DCEE,&H00000000,"
    "1,0,0,0,100,100,1,0,3,4,0,2,60,60,60,1"
)

RMS_TARGET = 0.16        # 逐句 RMS 目标（32767 满幅的相对值）
PEAK_CEIL = 0.89         # -1dBFS 软限幅
LEAD = 0.12              # 语音起点 = 幕首 + 0.12s
GAP = 0.25               # 句间气口 250ms
SUB_LEAD = 0.12          # 字幕比语音提前 120ms


# ---------------------------------------------------------------- 合成（worker 模式）
def strip_wav_header(data):
    """剥掉 OneCore 流自带的 RIFF/WAVE 头（44 字节）。"""
    if data[:4] != b"RIFF":
        return data
    i = data.find(b"data")
    if i < 0 or i > 1024:
        return data
    return data[i + 8:]


async def _worker_async(voice_id, text, raw_path, rate):
    from winrt.windows.media.speechsynthesis import SpeechSynthesizer
    from winrt.windows.storage.streams import Buffer, InputStreamOptions

    s = SpeechSynthesizer()
    for v in SpeechSynthesizer.all_voices:
        if v.id == voice_id:
            s.voice = v
            break

    esc = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    ssml = (
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="%s">'
        '<voice name="%s"><prosody rate="%s">%s</prosody></voice></speak>'
    ) % (LANG, voice_id, rate, esc)

    st = await s.synthesize_ssml_to_stream_async(ssml)
    buf = Buffer(st.size)
    ib = await st.read_async(buf, buf.capacity, InputStreamOptions.READ_AHEAD)
    data = strip_wav_header(bytes(memoryview(ib)))
    with open(raw_path, "wb") as f:
        f.write(data)
    return len(data)


def synth_one(text, raw_path, voice_id, rate):
    """单独进程合成一句（规避同进程多次 COM/WinRT 调用被杀）。"""
    subprocess.run(
        [PY, os.path.abspath(__file__), "--worker",
         "--voice", voice_id, "--text", text, "--raw", raw_path, "--rate", rate],
        check=True, timeout=180,
    )


# ---------------------------------------------------------------- 音频处理
def raw_to_wav(raw, wav, raw_sr=RAW_SR):
    subprocess.run(
        [FF, "-y", "-loglevel", "error",
         "-f", "s16le", "-ar", str(raw_sr), "-ac", "1", "-i", raw,
         "-ar", str(SR), "-ac", "2", wav],
        check=True,
    )


def load_wav(p):
    with wave.open(p, "rb") as w:
        n, ch, fr = w.getnframes(), w.getnchannels(), w.getframerate()
        raw = w.readframes(n)
    x = np.frombuffer(raw, dtype=np.int16).astype(np.int32)
    mono = (x[0::2] + x[1::2]) // 2 if ch == 2 else x
    return mono.astype(np.int16), fr


def trim_tail(samples, fr, thr=300, pad=0.12):
    mag = np.abs(samples.astype(np.int32))
    nz = np.where(mag > thr)[0]
    if len(nz):
        samples = samples[: min(len(samples), nz[-1] + int(pad * fr))]
    return samples


def resample(samples, fr, target=SR):
    if fr == target:
        return samples
    n = int(len(samples) * target / fr)
    idx = np.linspace(0, len(samples) - 1, n)
    return np.interp(idx, np.arange(len(samples)), samples.astype(np.float64)).astype(np.int16)


def to_stereo(samples):
    st = np.zeros((len(samples), 2), dtype=np.int16)
    st[:, 0] = samples
    st[:, 1] = samples
    return st


def polish(samples, sr=SR):
    """去直流 + 头部 6ms 淡入 + 尾部 10ms 淡出。"""
    if not len(samples):
        return samples
    x = samples.astype(np.float64)
    x -= x.mean()
    n_in, n_out = int(0.006 * sr), int(0.010 * sr)
    if len(x) > n_in + n_out:
        x[:n_in] *= 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, n_in))
        x[-n_out:] *= 0.5 - 0.5 * np.cos(np.linspace(np.pi, 0, n_out))
    return np.clip(x, -32768, 32767).astype(np.int16)


def norm_rms(samples, target=RMS_TARGET, ceil=PEAK_CEIL):
    """逐句 RMS 归一（提质 1）：音量不再忽大忽小；增益上限 +12dB 防静音段噪声抬升。"""
    if not len(samples):
        return samples
    x = samples.astype(np.float64)
    rms = float(np.sqrt((x ** 2).mean()))
    if rms < 1e-6:
        return samples
    g = min(target * 32767 / rms, 4.0)
    x = x * g
    peak = float(np.abs(x).max())
    if peak > ceil * 32767:
        x = x * (ceil * 32767 / peak)
    return np.clip(x, -32768, 32767).astype(np.int16)


def write_wav(p, arr, sr=SR):
    with wave.open(p, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(arr.tobytes())


def ts(t):
    h = int(t // 3600)
    m = int(t % 3600 // 60)
    s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"


def sub_fs(text):
    """字幕字号随句长自适应（提质 5），剥句内句号（提质 6）。"""
    t = text.rstrip("。")
    n = len(re.sub(r"[，。：、？！]", "", t))
    fs = 58 if n <= 10 else (50 if n <= 14 else 44)
    return fs, t


# ---------------------------------------------------------------- 主流程
def main():
    ap = argparse.ArgumentParser(description="六连 HQ 配音 + 字幕烧录")
    ap.add_argument("--lines", help="台词表 JSON")
    ap.add_argument("--video", help="无声成片")
    ap.add_argument("--outdir")
    ap.add_argument("--final", help="终版输出路径")
    ap.add_argument("--rate", default="+0%", help='SSML 语速，如 "+10%"')
    ap.add_argument("--voice", default=DEFAULT_VOICE, help="OneCore voice token")
    ap.add_argument("--raw-sr", type=int, default=RAW_SR)
    ap.add_argument("--no-burn", action="store_true", help="只出音轨和字幕，不烧录")
    ap.add_argument("--worker", action="store_true")
    ap.add_argument("--text")
    ap.add_argument("--raw")
    a = ap.parse_args()

    if a.worker:
        import asyncio
        n = asyncio.run(_worker_async(a.voice, a.text, a.raw, a.rate))
        print(f"  worker ok {n} bytes", flush=True)
        return

    for k, v in (("--lines", a.lines), ("--video", a.video),
                 ("--outdir", a.outdir)):
        if not v:
            ap.error(f"缺少 {k}")

    cfg = json.load(open(a.lines, encoding="utf-8"))
    video = os.path.abspath(a.video)
    outdir = os.path.abspath(a.outdir)
    os.makedirs(outdir, exist_ok=True)
    final = os.path.abspath(a.final) if a.final else None

    total = float(cfg.get("total") or 0)
    if total <= 0:
        r = subprocess.run([FF, "-i", video], capture_output=True, text=True,
                           encoding="utf-8", errors="ignore")
        m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r.stderr or "")
        total = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))

    vname = a.voice.rsplit("\\", 1)[-1]
    print(f"片长 {total:.2f}s · {vname}（rate {a.rate}）· {len(cfg['lines'])} 句 · HQ 模式", flush=True)

    track = np.zeros((int(total * SR), 2), dtype=np.int16)
    sched, subs = [], []
    prev_end = 0

    def _stretch(seg, target_len):
        """用 ffmpeg atempo 把单句压到目标时长（变速不变调）。"""
        if abs(len(seg) - target_len) <= int(0.03 * SR):
            return seg
        tempo = len(seg) / float(target_len)
        tempo = min(max(tempo, 0.5), 2.0)
        ti = os.path.join(outdir, "_stretch_in.wav")
        to = os.path.join(outdir, "_stretch_out.wav")
        write_wav(ti, to_stereo(seg))
        subprocess.run([FF, "-y", "-loglevel", "error", "-i", ti,
                        "-af", f"atempo={tempo:.4f}", to], check=True)
        s2, _ = load_wav(to)
        return s2

    lines = [l for l in cfg["lines"] if l.get("text")]

    for i, ln in enumerate(lines):
        t0, t1 = float(ln["t0"]), float(ln["t1"])
        budget = (t1 - t0) - LEAD - GAP - 0.08   # HQ 口径：起点提前 LEAD + 句间气口 GAP + 0.08 尾余量
        raw = os.path.join(outdir, f"line_{i}_raw.pcm")
        wav = os.path.join(outdir, f"line_{i}.wav")
        mp3 = os.path.join(outdir, f"line_{i}.mp3")

        synth_one(ln["text"], raw, a.voice, a.rate)
        raw_to_wav(raw, wav, a.raw_sr)
        seg, fr = load_wav(wav)
        seg = trim_tail(seg, fr)
        seg = resample(seg, fr)
        seg = polish(seg)
        seg = norm_rms(seg)                       # 提质 1：逐句响度归一

        # —— 非重叠顺序排布（提质 2：气口 250ms）——
        desired = int((t0 + LEAD) * SR)
        start = max(desired, prev_end)
        next_t0 = lines[i + 1]["t0"] if i + 1 < len(lines) else total
        allowed_end = min(int(next_t0 * SR) - int(GAP * SR), len(track))
        max_dur = max(allowed_end - start, int(0.5 * SR))
        if len(seg) > max_dur:
            seg = _stretch(seg, max_dur)
        seg = to_stereo(seg)

        write_wav(wav, seg)
        subprocess.run([FF, "-y", "-loglevel", "error", "-i", wav,
                        "-c:a", "libmp3lame", "-b:a", "192k", mp3], check=True)

        end = min(start + len(seg), len(track))
        track[start:end] = seg[: end - start]
        d = len(seg) / SR
        prev_end = end

        fs, clean = sub_fs(ln["text"])            # 提质 5/6
        sched.append(dict(id=ln.get("id", f"L{i}"), text=clean, t0=t0, t1=t1,
                          start=start / SR, dur=d, rate=f"winrt{a.rate}",
                          end_cap=ln.get("end_cap")))
        flag = "" if d <= budget else "  ⚠️ 超预算"
        print(f"  {ln.get('id', 'L' + str(i)):>12} {d:5.2f}s / 预算 {budget:4.2f}s  @{start / SR:6.2f}s{flag}", flush=True)

    # 提质 3：整体仅兜底（逐句已归一 + 软限幅）
    peak = np.abs(track).max()
    if peak > 29000:
        track = (track.astype(np.float64) * (29000 / peak)).astype(np.int16)
    vp = os.path.join(outdir, "voice.wav")
    write_wav(vp, track)
    print(f"配音轨 -> {vp} ({len(track) / SR:.2f}s)", flush=True)

    # 提质 4：字幕比语音提前 120ms
    for s in sched:
        sub_start = max(0.0, s["start"] - SUB_LEAD)
        e = min(s["start"] + s["dur"] + 0.15, s["t1"])
        if s["end_cap"] is not None:
            e = min(e, float(s["end_cap"]))
        fs, _ = sub_fs(s["text"])
        subs.append(f"Dialogue: 0,{ts(sub_start)},{ts(e)},字幕,,0,0,0,,{{\\fs{fs}}}{s['text']}")

    ass = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
""" + ASS_STYLE + """

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" + "\n".join(subs) + "\n"

    apath = os.path.join(outdir, "sub.ass")
    with open(apath, "w", encoding="utf-8-sig") as f:
        f.write(ass)
    json.dump(sched, open(os.path.join(outdir, "sched.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(f"字幕 -> {apath}", flush=True)

    if a.no_burn or not final:
        print("（--no-burn：跳过烧录）", flush=True)
        return

    g = 0.0
    peak = np.abs(track).max()
    if peak < 20000:
        g = round(20 * np.log10(28000 / max(peak, 1)), 1)
    af = f"volume={g}dB,alimiter=limit=0.89" if g > 0 else "alimiter=limit=0.89"
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", video, "-i", vp,
                    "-vf", "subtitles=sub.ass", "-af", af,
                    "-c:v", "libx264", "-crf", "18", "-preset", "medium",
                    "-c:a", "aac", "-b:a", "192k", "-shortest",
                    "-movflags", "+faststart", final],
                   cwd=outdir, check=True)
    print(f"终版 -> {final}（增益 {g}dB + alimiter）", flush=True)


if __name__ == "__main__":
    main()
