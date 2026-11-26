#!/usr/bin/env python3
"""
Draws the traditional Indian (Hindu) artwork for the invitation:

  img/ganesh-mangalmurti.jpg → images/ganesh.webp   Shri Ganesh ("Shri Mangalmurti", Raja Ravi Varma Press,
                                                     public domain — via Wikimedia Commons)
  images/background.webp     welcome scene: mandir on a lotus lake seen through a carved arch,
                             marigold ladis, diyas on the ghat
  images/og-image.jpg        1200×630 link preview (WhatsApp etc.): Ganesh ji, names and dates
  videos/wedding-invitation.mp4   film: Ganesh vandana, then the couples. If img/ganesh-mantra.mp3
                             (any audio format) exists, the Vakratunda chant plays over Ganesh ji
                             and the scene lasts as long as the chant.
  favicon.svg / favicon.ico  marigold

Edit NAMES / DATES / VENUE below if they change (they are baked into the film and link preview).
Needs: python3 + Pillow + numpy, ffmpeg built with librsvg. Fonts are read from scripts/fonts.
Run:  npm run indian
"""
import base64
import io
import math
import os
import random
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "img"
PUBLIC = ROOT / "public"
IMAGES = PUBLIC / "images"
FONTS = ROOT / "scripts" / "fonts"
ART = ROOT / "scripts" / "art"
BUILD = ROOT / "scripts" / ".build"

NAMES = ["Gaurav &amp; Sheetal", "Sourav &amp; Komal"]  # groom first, as on the site
DATES = "LAGAN-SAGAI · 7 DEC 2026    ✦    SHAADI · 11 DEC 2026"
VENUE = "Near Laxminarayan Mandir, Pelak, Palwal"
INVOCATION = "॥ श्री गणेशाय नमः ॥"
SHLOKA = ["वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।", "निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥"]
SHLOKA_MEANING = "O Lord Ganesha, remove every obstacle from all our endeavours, always."
SHUBH_VIVAH = "शुभ विवाह"

DEVA = "Tiro Devanagari Hindi"
SCRIPT = "Great Vibes"
SERIF = "Cormorant Garamond"

for d in (ART, BUILD, IMAGES, PUBLIC / "videos"):
    d.mkdir(parents=True, exist_ok=True)


# ─────────────────────────────────────────────────────────────── helpers ──
def font_env():
    """Point fontconfig (used by librsvg inside ffmpeg) at scripts/fonts as well as the system fonts."""
    conf = BUILD / "fonts.conf"
    conf.write_text(
        '<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>'
        '<include ignore_missing="yes">/etc/fonts/fonts.conf</include>'
        f"<dir>{FONTS}</dir><cachedir>{BUILD / 'fc-cache'}</cachedir></fontconfig>"
    )
    return {**os.environ, "FONTCONFIG_FILE": str(conf)}


ENV = font_env()


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], check=True, env=ENV)


def render(svg_text, name):
    """SVG → PNG through ffmpeg's librsvg decoder (straight alpha)."""
    src, png = BUILD / f"{name}.svg", BUILD / f"{name}.png"
    src.write_text(svg_text, encoding="utf-8")
    ffmpeg("-i", str(src), "-frames:v", "1", str(png))
    a = np.asarray(Image.open(png).convert("RGBA")).astype(np.float32)
    alpha = a[..., 3:4]
    a[..., :3] = np.where(alpha > 0, np.clip(a[..., :3] * 255.0 / np.maximum(alpha, 1), 0, 255), 0)
    Image.fromarray(a.astype(np.uint8)).save(png)
    return png


def data_uri(im):
    buf = io.BytesIO()
    if im.mode == "RGBA":
        im.save(buf, "PNG", optimize=True)
        mime = "png"
    else:
        im.convert("RGB").save(buf, "JPEG", quality=92)
        mime = "jpeg"
    return f"data:image/{mime};base64,{base64.b64encode(buf.getvalue()).decode()}"


def bezier(p0, p1, p2, p3, t):
    u = 1 - t
    return tuple(u ** 3 * a + 3 * u * u * t * b + 3 * u * t * t * c + t ** 3 * d for a, b, c, d in zip(p0, p1, p2, p3))


# ─────────────────────────────────────────────────────────────── Ganesh ──
def ganesh():
    with Image.open(SRC / "ganesh-mangalmurti.jpg") as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
    # keep crown → lap (4:5), drop the printed border and caption strip
    crop = im.crop((24, 14, 484, 589))
    dest = IMAGES / "ganesh.webp"
    crop.save(dest, "WEBP", quality=88, method=6)
    print(f"✓ ganesh → {dest.relative_to(ROOT)}  ({crop.width}×{crop.height}, {dest.stat().st_size // 1024} KB)")
    return crop


def ganesh_frame(uri, cx, top, width, uid="g"):
    """Ganesh ji in a temple-arch window with a golden border and a soft halo."""
    r, h = width / 2, width * 1.25
    x0, x1, bottom = cx - r, cx + r, top + h
    arch = f"M{x0},{bottom} L{x0},{top + r} A{r},{r} 0 0 1 {x1},{top + r} L{x1},{bottom} Z"
    o = 11
    outer = f"M{x0 - o},{bottom + o} L{x0 - o},{top + r} A{r + o},{r + o} 0 0 1 {x1 + o},{top + r} L{x1 + o},{bottom + o} Z"
    dots = "".join(
        f'<circle cx="{cx + math.cos(math.radians(a)) * (r + o + 9):.1f}" cy="{top + r - math.sin(math.radians(a)) * (r + o + 9):.1f}" r="2.6" fill="#d4a85a"/>'
        for a in range(10, 171, 16)
    )
    return f"""
  <defs>
    <clipPath id="{uid}clip"><path d="{arch}"/></clipPath>
    <radialGradient id="{uid}halo"><stop offset="0" stop-color="#fff3c4" stop-opacity=".95"/>
      <stop offset=".55" stop-color="#ffd98a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
  </defs>
  <circle cx="{cx}" cy="{top + r}" r="{r * 2.1:.0f}" fill="url(#{uid}halo)"/>
  <path d="{outer}" fill="#fff8ec" stroke="#e7c98c" stroke-width="3"/>
  <image href="{uri}" x="{x0}" y="{top}" width="{width}" height="{h}" preserveAspectRatio="xMidYMin slice" clip-path="url(#{uid}clip)"/>
  <path d="{arch}" fill="none" stroke="#c99a3e" stroke-width="5"/>
  {dots}
  <circle cx="{cx}" cy="{top - o - 16}" r="6" fill="#f2b24a" stroke="#f8d27a" stroke-width="4" stroke-dasharray="2.4 1.6"/>"""


# ─────────────────────────────────────────────────────────── background ──
def marigold(x, y, r, tone):
    fill, ruffle, inner, centre = tone
    return (
        f'<g transform="translate({x:.1f},{y:.1f})">'
        f'<circle r="{r:.1f}" fill="{fill}" stroke="{ruffle}" stroke-width="{r * .55:.1f}" stroke-dasharray="{r * .26:.1f} {r * .16:.1f}"/>'
        f'<circle r="{r * .62:.1f}" fill="{inner}" stroke="{ruffle}" stroke-width="{r * .2:.1f}" stroke-dasharray="{r * .17:.1f} {r * .12:.1f}"/>'
        f'<circle r="{r * .25:.1f}" fill="{centre}"/></g>'
    )


MARIGOLDS = [
    ("#f8c27a", "#fbd79c", "#fde2b4", "#e0943e"),  # soft marigold
    ("#f8cfb4", "#fbe0cc", "#fde7d6", "#dc9b74"),  # peach
    ("#f5c1cc", "#fad6de", "#fbe0e6", "#cf8197"),  # blush
]


def ladi(x, y, length, rng):
    """A hanging string of marigolds ending in a rose bud and a little gold bell."""
    beads = int(length // 22)
    out = [f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{x:.1f}" y2="{y + length:.1f}" stroke="#d9bd8a" stroke-width="1.6"/>']
    for i in range(beads):
        out.append(marigold(x, y + 14 + i * 22, 10.5, MARIGOLDS[(i + rng.randint(0, 2)) % 3]))
    end = y + 14 + beads * 22
    out.append(f'<circle cx="{x:.1f}" cy="{end - 2:.1f}" r="6" fill="#f3a9b9" stroke="#f8c6d1" stroke-width="2.4" stroke-dasharray="1.6 1.1"/>')
    out.append(f'<path d="M{x - 6:.1f},{end + 14:.1f} q6,-14 12,0 z" fill="#ecd29e" stroke="#b8955a" stroke-width="1"/>')
    out.append(f'<circle cx="{x:.1f}" cy="{end + 16:.1f}" r="2" fill="#b8955a"/>')
    return "".join(out)


def temple():
    """A pastel Nagara-style mandir: curvilinear shikhara with amalaka, kalash and a saffron flag."""
    wall, shade, win, gold = "#f3d4d6", "#e6bcc5", "#dba5b3", "#d9b46e"

    def arches(x, y, n, w, h, gap):
        return "".join(
            f'<path d="M{x + i * (w + gap)},{y + h} L{x + i * (w + gap)},{y + h * .45} '
            f'Q{x + i * (w + gap)},{y + h * .12} {x + i * (w + gap) + w / 2},{y} '
            f'Q{x + i * (w + gap) + w},{y + h * .12} {x + i * (w + gap) + w},{y + h * .45} '
            f'L{x + i * (w + gap) + w},{y + h} Z" fill="{win}" opacity=".75"/>'
            for i in range(n)
        )

    def kalash(cx, y, s):
        return (
            f'<line x1="{cx}" y1="{y}" x2="{cx}" y2="{y - 34 * s:.1f}" stroke="{gold}" stroke-width="{2.4 * s:.1f}"/>'
            f'<ellipse cx="{cx}" cy="{y - 9 * s:.1f}" rx="{8 * s:.1f}" ry="{7 * s:.1f}" fill="{gold}"/>'
            f'<rect x="{cx - 4 * s:.1f}" y="{y - 19 * s:.1f}" width="{8 * s:.1f}" height="{4 * s:.1f}" fill="{gold}"/>'
            f'<circle cx="{cx}" cy="{y - 24 * s:.1f}" r="{3.6 * s:.1f}" fill="{gold}"/>'
        )

    def shikhara(cx, base, w, h, flag=False):
        tw, top = w * .3, base - h
        left = ((cx - w / 2, base), (cx - w / 2, base - h * .55), (cx - tw * .9, top + h * .18), (cx - tw / 2, top))
        body = (
            f'<path d="M{cx - w / 2},{base} C{cx - w / 2},{base - h * .55} {cx - tw * .9},{top + h * .18} {cx - tw / 2},{top} '
            f'L{cx + tw / 2},{top} C{cx + tw * .9},{top + h * .18} {cx + w / 2},{base - h * .55} {cx + w / 2},{base} Z" fill="url(#dome)"/>'
        )
        bands = []
        for i in range(1, 9):
            px, py = bezier(*left, i / 9)
            bands.append(f'<line x1="{px:.1f}" y1="{py:.1f}" x2="{2 * cx - px:.1f}" y2="{py:.1f}" stroke="{shade}" stroke-width="{max(w * .018, 1.4):.1f}"/>')
        rib = f'<path d="M{cx - w * .11},{base} C{cx - w * .11},{base - h * .6} {cx - tw * .28},{top + h * .2} {cx - tw * .22},{top}" stroke="#fff6f0" stroke-width="{max(w * .03, 2):.1f}" fill="none" opacity=".6"/>'
        amalaka = (
            f'<ellipse cx="{cx}" cy="{top - w * .045:.1f}" rx="{tw * .78:.1f}" ry="{w * .065:.1f}" fill="{wall}" stroke="{shade}" stroke-width="{max(w * .015, 1.2):.1f}"/>'
            + "".join(
                f'<line x1="{cx + k * tw * .18:.1f}" y1="{top - w * .1:.1f}" x2="{cx + k * tw * .18:.1f}" y2="{top + w * .01:.1f}" stroke="{shade}" stroke-width="1.2"/>'
                for k in (-3, -2, -1, 0, 1, 2, 3)
            )
        )
        s = w / 120
        crown = kalash(cx, top - w * .1, s)
        if flag:
            py = top - w * .1 - 34 * s
            crown += (
                f'<line x1="{cx}" y1="{py:.1f}" x2="{cx}" y2="{py - 70:.1f}" stroke="#b8955a" stroke-width="2.5"/>'
                f'<path d="M{cx},{py - 70:.1f} Q{cx + 30},{py - 66:.1f} {cx + 56},{py - 56:.1f} Q{cx + 30},{py - 50:.1f} {cx},{py - 40:.1f} Z" fill="#f4a65f"/>'
            )
        return body + "".join(bands) + rib + amalaka + crown

    def phamsana(x, y, w):
        """Stepped pyramidal mandapa roof."""
        tiers = "".join(
            f'<path d="M{x + i * 9},{y - i * 13} L{x + w - i * 9},{y - i * 13} L{x + w - i * 9 - 7},{y - i * 13 - 11} L{x + i * 9 + 7},{y - i * 13 - 11} Z" fill="{wall if i % 2 else shade}"/>'
            for i in range(5)
        )
        return tiers + kalash(x + w / 2, y - 65, .7)

    return f"""
    <rect x="600" y="740" width="720" height="20" fill="{shade}"/>
    <rect x="620" y="726" width="680" height="16" fill="{wall}"/>
    <rect x="660" y="640" width="190" height="88" fill="{wall}"/>{arches(676, 664, 5, 24, 60, 10)}
    <rect x="1070" y="640" width="190" height="88" fill="{wall}"/>{arches(1086, 664, 5, 24, 60, 10)}
    <rect x="652" y="634" width="206" height="8" fill="{shade}"/><rect x="1062" y="634" width="206" height="8" fill="{shade}"/>
    {phamsana(668, 634, 174)}{phamsana(1078, 634, 174)}
    {shikhara(872, 610, 92, 130)}{shikhara(1048, 610, 92, 130)}
    <rect x="852" y="560" width="216" height="168" fill="{wall}"/>
    <rect x="844" y="552" width="232" height="10" fill="{shade}"/>
    <path d="M928,728 L928,640 Q928,610 960,598 Q992,610 992,640 L992,728 Z" fill="{win}"/>
    <path d="M940,728 L940,646 Q940,624 960,615 Q980,624 980,646 L980,728 Z" fill="#f7e3c6" opacity=".8"/>
    {arches(866, 620, 2, 22, 50, 12)}{arches(1020, 620, 2, 22, 50, 12)}
    {shikhara(960, 554, 196, 230, flag=True)}"""


def lotus(x, y, s, rng):
    back = "".join(
        f'<path d="M0,0 C-10,-8 -8,-26 0,-34 C8,-26 10,-8 0,0 Z" fill="#f2adc0" transform="rotate({a})"/>' for a in (-62, -31, 31, 62)
    )
    front = "".join(
        f'<path d="M0,0 C-10,-8 -8,-26 0,-34 C8,-26 10,-8 0,0 Z" fill="#fbd2dc" transform="rotate({a})"/>' for a in (-40, 0, 40)
    )
    pad = (
        f'<g transform="translate({x + 34 * s:.0f},{y + 6 * s:.0f}) scale({s:.2f})">'
        f'<path d="M0,0 L40,-6 A40,14 0 1 1 30,-12 Z" fill="#bfd6aa"/></g>'
    )
    return (
        f'{pad}<g transform="translate({x:.0f},{y:.0f}) scale({s:.2f})">'
        f'<ellipse cx="0" cy="4" rx="34" ry="8" fill="#b7cfa0"/>{back}{front}'
        f'<circle cy="-6" r="3.5" fill="#f2cf7a"/></g>'
    )


def diya(x, y, s=1.0):
    return f"""<g transform="translate({x},{y}) scale({s})">
      <circle cy="-26" r="46" fill="url(#flameGlow)"/>
      <path d="M-30,-2 Q0,26 30,-2 Q16,-9 0,-9 Q-16,-9 -30,-2 Z" fill="#d98b5f"/>
      <path d="M-30,-2 Q0,6 30,-2" stroke="#f0b98b" stroke-width="2.5" fill="none"/>
      <path d="M-20,6 Q0,18 20,6" stroke="#c2703f" stroke-width="2" fill="none" opacity=".6"/>
      <path d="M0,-34 C-7,-22 -6,-12 0,-9 C6,-12 7,-22 0,-34 Z" fill="#ffc861"/>
      <path d="M0,-26 C-3,-19 -3,-13 0,-11 C3,-13 3,-19 0,-26 Z" fill="#fff4cf"/>
    </g>"""


def palm(x, y, height, lean, rng):
    top = (x + lean, y - height)
    trunk = f'<path d="M{x},{y} Q{x + lean * .2},{y - height * .5} {top[0]},{top[1]}" stroke="#b49a86" stroke-width="12" fill="none" stroke-linecap="round"/>'
    fronds = []
    for a in (-170, -140, -110, -70, -40, -10, 20, 200):
        L = rng.uniform(95, 125)
        ex, ey = top[0] + math.cos(math.radians(a)) * L, top[1] + math.sin(math.radians(a)) * L * .55 + L * .25
        mx, my = top[0] + math.cos(math.radians(a)) * L * .5, top[1] - 26 + math.sin(math.radians(a)) * L * .2
        fronds.append(
            f'<path d="M{top[0]},{top[1]} Q{mx:.0f},{my - 14:.0f} {ex:.0f},{ey:.0f} Q{mx:.0f},{my + 10:.0f} {top[0]},{top[1]} Z" fill="#a9c49a"/>'
        )
    return trunk + "".join(fronds)


def background_svg(w=1920, h=1080):
    rng = random.Random(11122026)
    arch_l = ((170, 430), (170, 215), (600, 140), (960, 58))
    arch_r = ((960, 58), (1320, 140), (1750, 215), (1750, 430))
    arch_d = "M170,1080 L170,430 C170,215 600,140 960,58 C1320,140 1750,215 1750,430 L1750,1080 Z"

    scallops = []
    for curve in (arch_l, arch_r):
        for i in range(1, 15):
            px, py = bezier(*curve, i / 15)
            scallops.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="15" fill="#f8e7d6" stroke="#d9b46e" stroke-width="2.5"/>')
    for yy in range(450, 1060, 34):
        for xx in (170, 1750):
            scallops.append(f'<circle cx="{xx}" cy="{yy}" r="9" fill="#f8e7d6" stroke="#d9b46e" stroke-width="2"/>')

    ladis = []
    for curve, ts, lengths in ((arch_l, (.22, .42, .74), (250, 170, 110)), (arch_r, (.26, .58, .78), (110, 170, 250))):
        for t, L in zip(ts, lengths):
            px, py = bezier(*curve, t)
            ladis.append(ladi(px, py + 10, L, rng))

    trees = []
    for x0, x1 in ((150, 600), (1320, 1780)):
        for _ in range(16):
            x, y, r = rng.uniform(x0, x1), rng.uniform(712, 752), rng.uniform(24, 46)
            trees.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.0f}" fill="{rng.choice(["#cfe0bf", "#bcd3aa", "#dbe8cd"])}"/>')

    petals = "".join(
        f'<g transform="translate({rng.uniform(190, 1730):.0f},{rng.uniform(150, 940):.0f}) rotate({rng.uniform(0, 360):.0f})">'
        f'<ellipse rx="{rng.uniform(5, 9):.1f}" ry="{rng.uniform(3, 4.6):.1f}" fill="{rng.choice(["#f8c27a", "#f5b5c4", "#fbd5c0", "#f2a4b6", "#ffd98a"])}" opacity=".85"/></g>'
        for _ in range(55)
    )
    shimmer = "".join(
        f'<rect x="{rng.uniform(250, 1650):.0f}" y="{rng.uniform(772, 950):.0f}" width="{rng.uniform(40, 140):.0f}" height="2.5" rx="1.2" fill="#fffaf2" opacity=".6"/>'
        for _ in range(26)
    )
    band = "".join(
        f'<path d="M{x},1016 l10,-10 l10,10 l-10,10 z" fill="#e9b8c4"/><circle cx="{x + 30}" cy="1016" r="4" fill="#d9b46e"/>'
        for x in range(0, 1920, 40)
    )
    lotuses = "".join(lotus(x, y, s, rng) for x, y, s in [(330, 880, .9), (560, 935, 1.05), (860, 905, .8), (1080, 948, .95), (1330, 890, .85), (1570, 930, 1.1)])
    diyas = "".join(diya(x, 990, 1.05) for x in (250, 480, 720, 960, 1200, 1440, 1670))
    pal = temple()

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6d3dc"/><stop offset=".38" stop-color="#fde3d6"/><stop offset=".7" stop-color="#fff1de"/>
    </linearGradient>
    <radialGradient id="sun"><stop offset="0" stop-color="#fffbef"/><stop offset=".25" stop-color="#ffeec6" stop-opacity=".9"/>
      <stop offset="1" stop-color="#ffd7b8" stop-opacity="0"/></radialGradient>
    <linearGradient id="dome" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f9e4e4"/><stop offset=".55" stop-color="#f1cfd3"/><stop offset="1" stop-color="#e3b5bf"/></linearGradient>
    <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2c3d4"/><stop offset="1" stop-color="#f4dcdc"/></linearGradient>
    <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdebdf"/><stop offset=".5" stop-color="#f7d6dc"/><stop offset="1" stop-color="#efc5d1"/></linearGradient>
    <linearGradient id="ghat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf0e2"/><stop offset="1" stop-color="#f1d8c0"/></linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6e2d0"/><stop offset=".5" stop-color="#fbeee2"/><stop offset="1" stop-color="#f6e2d0"/></linearGradient>
    <radialGradient id="flameGlow"><stop offset="0" stop-color="#fff1c0" stop-opacity=".95"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
    <filter id="haze"><feGaussianBlur stdDeviation="2.5"/></filter>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="blur"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#sky)"/>
  <circle cx="960" cy="560" r="560" fill="url(#sun)"/>
  <g filter="url(#soft)" fill="#fffaf4" opacity=".9">
    <ellipse cx="520" cy="300" rx="150" ry="34"/><ellipse cx="600" cy="280" rx="90" ry="30"/>
    <ellipse cx="1390" cy="250" rx="170" ry="36"/><ellipse cx="1300" cy="232" rx="90" ry="28"/>
    <ellipse cx="1500" cy="420" rx="120" ry="26"/><ellipse cx="380" cy="470" rx="110" ry="24"/>
  </g>
  <path filter="url(#haze)" fill="url(#ridge)" opacity=".85" d="M0,720 L180,660 L340,690 L520,640 L720,684 L900,662 L1060,690 L1240,650 L1420,688 L1600,656 L1780,690 L1920,670 L1920,780 L0,780 Z"/>
  {''.join(trees)}
  {palm(560, 772, 210, 30, rng)}{palm(1370, 772, 230, -36, rng)}
  <g>{pal}</g>
  <rect y="760" width="1920" height="320" fill="url(#lake)"/>
  <g transform="translate(0,1520) scale(1,-1)" opacity=".28" filter="url(#blur)">{pal}</g>
  {shimmer}
  {lotuses}
  <rect y="972" width="1920" height="108" fill="url(#ghat)"/>
  <rect y="970" width="1920" height="5" fill="#d9b46e"/>
  {band}
  <rect y="1034" width="1920" height="2" fill="#e3c48c"/>
  {diyas}
  {petals}
  {''.join(scallops)}
  <path fill-rule="evenodd" fill="url(#wall)" d="M0,0 H1920 V1080 H0 Z {arch_d}"/>
  <path d="{arch_d}" fill="none" stroke="#d9b46e" stroke-width="6"/>
  <path d="M132,1080 L132,428 C132,190 580,104 960,18 C1340,104 1788,190 1788,428 L1788,1080" fill="none" stroke="#e7cfa0" stroke-width="3"/>
  <g fill="#ecc7cf">{''.join(f'<path d="M{x},{y} l14,-14 l14,14 l-14,14 z"/>' for x in (37, 1855) for y in range(470, 1060, 70))}</g>
  {''.join(ladis)}
</svg>"""


# ─────────────────────────────────────────────────────── title cards ──
def text(x, y, s, size, family, fill, extra=""):
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" fill="{fill}" text-anchor="middle" {extra}>{s}</text>'


def glow_panel(cx, cy, rx, ry, opacity=.82):
    return (
        f'<defs><radialGradient id="panel"><stop offset="0" stop-color="#fffaf1" stop-opacity="{opacity}"/>'
        f'<stop offset=".7" stop-color="#fffaf1" stop-opacity="{opacity * .75:.2f}"/><stop offset="1" stop-color="#fffaf1" stop-opacity="0"/></radialGradient></defs>'
        f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#panel)"/>'
    )


def card_ganesh(g_uri):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  {glow_panel(640, 360, 560, 380)}
  {text(640, 66, INVOCATION, 40, DEVA, "#a3352f")}
  {ganesh_frame(g_uri, 640, 112, 232)}
  {text(640, 470, SHLOKA[0], 33, DEVA, "#5f2f4b")}
  {text(640, 518, SHLOKA[1], 33, DEVA, "#5f2f4b")}
  {text(640, 566, SHLOKA_MEANING, 23, SERIF, "#8f4a6c", 'font-style="italic"')}
</svg>"""


def card_couples(c_uri, c_size):
    ch = 300
    cw = ch * c_size[0] / c_size[1]
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  {glow_panel(640, 330, 600, 400)}
  {text(640, 86, SHUBH_VIVAH, 62, DEVA, "#a3352f")}
  {text(640, 180, NAMES[0], 80, SCRIPT, "#7a2f55")}
  {text(640, 262, NAMES[1], 80, SCRIPT, "#7a2f55")}
  {text(640, 318, DATES, 22, SERIF, "#9c6a2a", 'font-weight="600" letter-spacing="3"')}
  {text(640, 350, VENUE, 21, SERIF, "#8f4a6c", 'font-style="italic"')}
  <image href="{c_uri}" x="{640 - cw / 2:.0f}" y="{712 - ch}" width="{cw:.0f}" height="{ch}"/>
</svg>"""


def card_og(g_uri):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  {glow_panel(600, 315, 640, 360, .86)}
  {text(270, 92, INVOCATION, 30, DEVA, "#a3352f")}
  {ganesh_frame(g_uri, 270, 150, 230)}
  {text(780, 168, SHUBH_VIVAH, 58, DEVA, "#a3352f")}
  {text(780, 262, NAMES[0], 74, SCRIPT, "#7a2f55")}
  {text(780, 344, NAMES[1], 74, SCRIPT, "#7a2f55")}
  {text(780, 410, DATES.replace("    ", "  "), 21, SERIF, "#9c6a2a", 'font-weight="600" letter-spacing="2"')}
  {text(780, 448, VENUE, 22, SERIF, "#8f4a6c", 'font-style="italic"')}
</svg>"""


def favicon_svg():
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="-32 -32 64 64">
  <circle r="31" fill="#fff4e6"/>
  <circle r="19" fill="#f6b04a" stroke="#f8c76a" stroke-width="10" stroke-dasharray="4 2.6"/>
  <circle r="11" fill="#f8c76a" stroke="#e8902a" stroke-width="4" stroke-dasharray="2.6 1.8"/>
  <circle r="4.5" fill="#c9561c"/>
</svg>"""


# ─────────────────────────────────────────────────────── Ganesh mantra ──
CHANT_NAME = "ganesh-mantra"  # img/ganesh-mantra.mp3 (or .m4a .wav .ogg .opus .aac) — a recording of Vakratunda


def find_chant():
    for ext in ("mp3", "m4a", "wav", "ogg", "opus", "aac", "mp4"):
        f = SRC / f"{CHANT_NAME}.{ext}"
        if f.exists():
            return f
    return None


def media_duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True)
    return float(out.stdout.strip())



# ────────────────────────────────────────────────────────────────── main ──
def main():
    g = ganesh()
    g_uri = data_uri(g)

    print("• drawing background")
    (ART / "background.svg").write_text(background_svg(), encoding="utf-8")
    bg4k = render(background_svg(3840, 2160), "background-4k")
    bg = Image.open(bg4k).convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS)
    bg.save(IMAGES / "background.webp", quality=86, method=6)

    print("• link preview")
    og = bg.resize((1200, 675), Image.Resampling.LANCZOS).crop((0, 22, 1200, 652)).convert("RGBA")
    og.alpha_composite(Image.open(render(card_og(g_uri), "og-card")).convert("RGBA"))
    og.convert("RGB").save(IMAGES / "og-image.jpg", quality=86, optimize=True, progressive=True)

    print("• favicon")
    (PUBLIC / "favicon.svg").write_text(favicon_svg())
    fav = render(favicon_svg().replace('viewBox="-32 -32 64 64"', 'width="256" height="256" viewBox="-32 -32 64 64"'), "favicon")
    Image.open(fav).save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

    print("• rendering film")
    with Image.open(IMAGES / "couples-two.webp") as c:
        couples = c.convert("RGBA")
        couples.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
    card_a = render(card_ganesh(g_uri), "card-ganesh")
    card_b = render(card_couples(data_uri(couples), couples.size), "card-couples")
    music = PUBLIC / "audio" / "background-music.mp3"
    chant = find_chant()
    if chant:
        d = media_duration(chant)
        print(f"  with the Ganesh mantra: {chant.relative_to(ROOT)} ({d:.1f} s)")
        lead = 0.8  # chant starts once Ganesh ji has faded in
        ganesh_out = max(4.9, lead + d + 0.6)
    else:
        print(f"  (no mantra recording — add img/{CHANT_NAME}.mp3 to chant Vakratunda over Ganesh ji)")
        ganesh_out = 4.9
    couples_in = ganesh_out + 0.8
    total = round(couples_in + 6.3, 2)
    frames = int(total * 30)

    graph = [
        f"[0:v]zoompan=z='1+0.10*on/{frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s=1280x720:fps=30,format=yuv420p[bg]",
        f"[1:v]format=rgba,fade=t=in:st=0.4:d=1.4:alpha=1,fade=t=out:st={ganesh_out}:d=0.9:alpha=1[ca]",
        f"[2:v]format=rgba,fade=t=in:st={couples_in}:d=1.4:alpha=1[cb]",
        "[bg][ca]overlay=0:0[v1]",
        f"[v1][cb]overlay=0:0,fade=t=in:st=0:d=1:color=white,fade=t=out:st={total - 1}:d=1:color=white[v]",
    ]
    inputs = [
        "-i", str(bg4k),
        "-loop", "1", "-framerate", "30", "-t", str(total), "-i", str(card_a),
        "-loop", "1", "-framerate", "30", "-t", str(total), "-i", str(card_b),
        "-stream_loop", "-1", "-i", str(music),
    ]
    if chant:
        inputs += ["-i", str(chant)]
        chant_end = lead + d
        # music sits softly under the chant, then rises for the couples
        graph += [
            f"[3:a]atrim=0:{total},asetpts=PTS-STARTPTS,volume='0.28+0.72*min(1,max(0,(t-{chant_end:.2f})/1.5))':eval=frame[mus]",
            f"[4:a]aformat=sample_rates=44100:channel_layouts=stereo,loudnorm=I=-16:TP=-1.5,"
            f"adelay={int(lead * 1000)}|{int(lead * 1000)},apad[ch]",
            f"[mus][ch]amix=inputs=2:duration=first:normalize=0,afade=t=in:d=0.6,afade=t=out:st={total - 1.5}:d=1.5[aud]",
        ]
    else:
        graph.append(f"[3:a]atrim=0:{total},asetpts=PTS-STARTPTS,afade=t=in:d=1,afade=t=out:st={total - 1.5}:d=1.5[aud]")
    ffmpeg(
        *inputs,
        "-filter_complex", ";".join(graph), "-map", "[v]", "-map", "[aud]", "-t", str(total),
        "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-profile:v", "main", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-movflags", "+faststart", str(PUBLIC / "videos" / "wedding-invitation.mp4"),
    )
    print(f"✓ film: {total:.1f} s")
    print("done.")


if __name__ == "__main__":
    main()
