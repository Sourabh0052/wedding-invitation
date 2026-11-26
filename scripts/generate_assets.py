#!/usr/bin/env python3
"""
Generates the fallback couple silhouette (public/images/couple.webp, transparent).

The Indian background, link-preview image, favicon and film from scripts/indian_art.py (npm run indian).

Replace any of these with your own files — nothing here is required at runtime.
Requirements: python3 + numpy + Pillow, ffmpeg (with librsvg, libx264, libmp3lame).
Run:  npm run assets
"""
import math
import random
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
ART = ROOT / "scripts" / "art"
FONTS = ROOT / "scripts" / "fonts"
BUILD = ROOT / "scripts" / ".build"

BRIDE, GROOM = "Ananya", "Arjun"
DATE_TEXT = "14 · 02 · 2027"

for d in (ART, BUILD, PUBLIC / "images", PUBLIC / "audio", PUBLIC / "videos"):
    d.mkdir(parents=True, exist_ok=True)


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


# ─────────────────────────────────────────────────────────────── SVG helpers ──
def petal_path(length, width):
    L, W = length, width
    return (
        f"M0,0 C{-W:.1f},{-L * .35:.1f} {-W * .8:.1f},{-L:.1f} {-W * .2:.1f},{-L:.1f} "
        f"L0,{-L * .84:.1f} L{W * .2:.1f},{-L:.1f} C{W * .8:.1f},{-L:.1f} {W:.1f},{-L * .35:.1f} 0,0 Z"
    )


def blossom(cx, cy, r, fill="#ffd6e4", center="#e8799e", rot=0.0, opacity=1.0):
    petals = "".join(
        f'<path d="{petal_path(r, r * .62)}" transform="rotate({rot + i * 72:.1f})"/>' for i in range(5)
    )
    dots = "".join(
        f'<circle cx="{math.cos(math.radians(rot + i * 72 + 36)) * r * .32:.1f}" '
        f'cy="{math.sin(math.radians(rot + i * 72 + 36)) * r * .32:.1f}" r="{r * .07:.1f}" fill="#e2b04f"/>'
        for i in range(5)
    )
    return (
        f'<g transform="translate({cx:.1f},{cy:.1f})" opacity="{opacity}">'
        f'<g fill="{fill}">{petals}</g><circle r="{r * .22:.1f}" fill="{center}"/>{dots}</g>'
    )


# ────────────────────────────────────────────────────────────── couple.svg ──
def couple_svg(scale=2):
    rng = random.Random(7)
    w, h = 600, 760
    embroidery = "".join(
        f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rng.uniform(1.4, 2.6):.1f}"/>'
        for x, y in (
            (rng.uniform(350 - (yy - 400) * .156, 362 + (yy - 400) * .3), yy)
            for yy in (rng.uniform(460, 690) for _ in range(70))
        )
    )

    def branch(flip):
        g = ['<path d="M-10,140 C60,110 120,60 250,50" stroke="#7a4a58" stroke-width="7" fill="none" stroke-linecap="round"/>',
             '<path d="M110,92 C130,70 150,58 175,30" stroke="#7a4a58" stroke-width="4" fill="none" stroke-linecap="round"/>']
        for x, y, r in [(250, 50, 17), (215, 58, 14), (175, 30, 15), (150, 72, 13), (95, 100, 16), (60, 118, 12), (232, 28, 10), (195, 82, 10), (128, 50, 11), (30, 128, 13)]:
            g.append(blossom(x, y, r, fill=rng.choice(["#ffd3e1", "#fbb8cf", "#ffe6ee"]), rot=rng.uniform(0, 72)))
        tf = f"translate({w},0) scale(-1,1)" if flip else ""
        return f'<g transform="{tf}">{"".join(g)}</g>'

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w * scale}" height="{h * scale}" viewBox="0 0 {w} {h}">
  <defs>
    <radialGradient id="halo" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#fffaf0"/><stop offset=".45" stop-color="#ffe7c6"/>
      <stop offset=".85" stop-color="#fbc3d2"/><stop offset="1" stop-color="#f6a9c2" stop-opacity=".0"/>
    </radialGradient>
    <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#83405f"/><stop offset="1" stop-color="#4a2238"/></linearGradient>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbb6cc" stop-opacity=".85"/><stop offset="1" stop-color="#f48fb1" stop-opacity=".25"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d58f"/><stop offset="1" stop-color="#c8963b"/></linearGradient>
  </defs>
  <circle cx="300" cy="330" r="262" fill="url(#halo)"/>
  <circle cx="300" cy="330" r="226" fill="none" stroke="url(#gold)" stroke-width="2.5" opacity=".75"/>
  <circle cx="300" cy="330" r="240" fill="none" stroke="url(#gold)" stroke-width="1" stroke-dasharray="2 9" opacity=".7"/>
  <ellipse cx="300" cy="724" rx="190" ry="14" fill="#c98aa5" opacity=".35"/>
  <!-- veil -->
  <path fill="url(#veil)" stroke="url(#gold)" stroke-width="1.5" d="M326,226 C370,192 440,200 500,242 C542,272 560,336 546,404 C536,466 514,548 464,648 C446,600 434,520 414,450 C394,380 386,300 364,266 Z"/>
  <g fill="url(#sil)">
    <!-- groom -->
    <circle cx="264" cy="234" r="33"/>
    <path d="M295,231 L306,246 L295,250 Z"/>
    <path d="M296,236 L302,226 L289,231 C293,206 276,192 258,193 C238,194 224,206 222,226 L210,232 L223,238 L214,254 L229,246 L231,262 L240,240 Z"/>
    <path d="M253,258 L277,258 L276,302 L254,302 Z"/>
    <path d="M216,304 C228,292 290,290 304,304 L310,340 L304,420 L313,600 L209,600 L216,420 L210,340 Z"/>
    <path d="M292,306 C312,326 318,372 320,410 L331,426 L320,437 L308,420 C304,384 296,352 284,334 Z"/>
    <path d="M222,598 L226,712 L248,712 L250,600 Z"/><path d="M262,600 L264,712 L286,712 L292,598 Z"/>
    <ellipse cx="238" cy="716" rx="20" ry="6"/><ellipse cx="278" cy="716" rx="20" ry="6"/>
    <!-- bride -->
    <circle cx="340" cy="252" r="30"/>
    <path d="M312,255 L302,266 L313,270 Z"/>
    <path d="M311,248 C308,222 328,212 346,214 C366,216 377,234 374,254 L381,278 L367,268 Z"/>
    <circle cx="371" cy="232" r="16"/>
    <path d="M334,276 L352,276 L352,306 L334,306 Z"/>
    <path d="M326,310 C336,298 366,298 378,310 L373,362 L368,404 L342,404 L334,362 Z"/>
    <path d="M332,312 C320,338 316,384 318,420 L310,435 L304,426 L310,416 C306,380 312,334 324,308 Z"/>
    <path d="M342,400 L370,400 C392,470 424,570 466,720 L292,720 C310,600 326,480 342,400 Z"/>
  </g>
  <!-- gold details -->
  <g fill="url(#gold)">
    {''.join(f'<circle cx="260" cy="{y}" r="3"/>' for y in range(322, 590, 34))}
    <circle cx="314" cy="238" r="3.5"/><circle cx="371" cy="232" r="5" opacity=".9"/>
    <path d="M302,140 C292,126 272,130 274,148 C276,162 302,176 302,176 C302,176 328,162 330,148 C332,130 312,126 302,140 Z"/>
  </g>
  <path d="M298,308 L222,470" stroke="url(#gold)" stroke-width="5" opacity=".8" stroke-linecap="round"/>
  <g fill="#f3d58f" opacity=".85">{embroidery}</g>
  <path d="M296,708 L462,708" stroke="url(#gold)" stroke-width="3"/>
  <path d="M300,694 Q320,684 340,694 T380,694 T420,694 T458,694" stroke="url(#gold)" stroke-width="1.6" fill="none"/>
  <path d="M342,402 L370,402" stroke="url(#gold)" stroke-width="3"/>
  <path d="M210,600 L312,600" stroke="url(#gold)" stroke-width="3"/>
  {branch(False)}{branch(True)}
</svg>"""


def unpremultiply(path):
    """ffmpeg's librsvg decoder emits premultiplied alpha; convert to straight alpha."""
    a = np.asarray(Image.open(path).convert("RGBA")).astype(np.float32)
    alpha = a[..., 3:4]
    a[..., :3] = np.where(alpha > 0, np.clip(a[..., :3] * 255.0 / np.maximum(alpha, 1), 0, 255), 0)
    Image.fromarray(a.astype(np.uint8)).save(path)


def render_svg(svg_text, svg_name, png_path, width=None):
    src = ART / svg_name
    src.write_text(svg_text)
    vf = ["-vf", f"scale={width}:-1:flags=lanczos"] if width else []
    ffmpeg("-i", str(src), *vf, "-frames:v", "1", str(png_path))
    unpremultiply(png_path)


def main():
    print("• drawing couple")
    (ART / "couple.svg").write_text(couple_svg(1))
    render_svg(couple_svg(2), "couple@2x.svg", BUILD / "couple-full.png")
    couple = Image.open(BUILD / "couple-full.png").convert("RGBA")
    couple = couple.resize((900, 1140), Image.Resampling.LANCZOS)
    couple.save(PUBLIC / "images" / "couple.webp", quality=88, method=6)

    print("done.")


if __name__ == "__main__":
    main()
