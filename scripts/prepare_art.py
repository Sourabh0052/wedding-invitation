#!/usr/bin/env python3
"""
Turns the illustrations in img/ into web-ready files in public/images/.

  img/3.jpeg → images/couple-varmala.webp       couple illustration, white background removed
             → images/couples-two.webp          both couples side by side (couple 1 in blush rose,
                                                couple 2 mirrored in peach), soft pastel outfits
  img/5.png  → images/events/lagan-sagai.webp   Lagan-Sagai event card (ring ceremony)
  img/1.jpeg → images/events/shaadi.webp        Shaadi event card
  img/2.jpeg → images/celebration.webp          countdown & closing background

Run:  npm run art      (needs Python 3 with Pillow, numpy and scipy)
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "img"
OUT = ROOT / "public" / "images"


def load(name):
    with Image.open(SRC / name) as im:
        return ImageOps.exif_transpose(im).convert("RGB")


def save_photo(name, dest, max_side):
    im = load(name)
    im.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    dest = OUT / dest
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=82, method=6)
    print(f"✓ {name} → {dest.relative_to(ROOT)}  ({im.width}×{im.height}, {dest.stat().st_size // 1024} KB)")


def cut_out_white(name, dest, scale=1.6):
    """Remove a plain white background, keeping white details (e.g. jasmine) inside the figure."""
    im = load(name)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.Resampling.LANCZOS)
    rgb = np.asarray(im).astype(np.float32)
    lo, hi = rgb.min(axis=2), rgb.max(axis=2)
    near_white = (lo > 238) & (hi - lo < 14)

    # Background = near-white regions that touch the border, plus big enclosed pockets of paper.
    labels, n = ndimage.label(near_white)
    sizes = ndimage.sum(near_white, labels, index=np.arange(1, n + 1))
    border = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    pocket_min = 0.0012 * near_white.size
    keep_bg = [i + 1 for i, s in enumerate(sizes) if (i + 1) in border or s > pocket_min]
    bg = np.isin(labels, keep_bg)

    # Soft, fringe-free edge: pixels next to the background fade by how white they are.
    alpha = np.where(bg, 0.0, 1.0)
    edge = ndimage.binary_dilation(bg, iterations=2) & ~bg
    alpha[edge] = np.clip((252 - lo[edge]) / 60, 0, 1)
    alpha = ndimage.gaussian_filter(alpha, 0.6) * (~bg) + 0 * bg
    a = alpha[..., None]
    colour = np.where(a > 0.02, (rgb - (1 - a) * 255) / np.maximum(a, 0.02), 0)
    rgba = np.dstack([np.clip(colour, 0, 255), alpha * 255]).astype(np.uint8)

    out = Image.fromarray(rgba)
    box = out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    pad = 12
    out = out.crop((max(box[0] - pad, 0), max(box[1] - pad, 0), min(box[2] + pad, out.width), min(box[3] + pad, out.height)))
    save_rgba(out, dest, name)
    return out


def save_rgba(im, dest, label):
    dest = OUT / dest
    im.save(dest, "WEBP", quality=90, method=6, exact=False)
    print(f"✓ {label} → {dest.relative_to(ROOT)}  ({im.width}×{im.height}, transparent, {dest.stat().st_size // 1024} KB)")


def _rgb_to_hsv(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx, mn = rgb.max(-1), rgb.min(-1)
    d = mx - mn
    safe = np.where(d == 0, 1, d)
    h = np.where(mx == r, ((g - b) / safe) % 6, np.where(mx == g, (b - r) / safe + 2, (r - g) / safe + 4)) / 6
    h = np.where(d == 0, 0, h)
    s = np.where(mx == 0, 0, d / np.where(mx == 0, 1, mx))
    return h, s, mx


def _hsv_to_rgb(h, s, v):
    i = np.floor(h * 6) % 6
    f = h * 6 - np.floor(h * 6)
    p, q, t = v * (1 - s), v * (1 - f * s), v * (1 - (1 - f) * s)
    choices = [(v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q)]
    out = np.zeros(h.shape + (3,), np.float32)
    for k, (a, b, c) in enumerate(choices):
        m = i == k
        out[m] = np.stack([a[m], b[m], c[m]], -1)
    return out


def recolour_reds(im, hue, sat=0.5, floor=0.6):
    """Re-dye the saturated reds (lehenga, dupatta, turban, roses) to a soft pastel; skin and gold stay."""
    rgba = np.asarray(im).astype(np.float32) / 255
    rgb, alpha = rgba[..., :3], rgba[..., 3:]
    h, s, v = _rgb_to_hsv(rgb)
    # red hues only (not the orange/brown of skin & mehendi), and only clearly coloured pixels
    redness = np.clip((0.04 - np.minimum(h, 1 - h)) / 0.025, 0, 1) * np.clip((s - 0.3) / 0.2, 0, 1)
    new = _hsv_to_rgb(np.full_like(h, hue), s * sat, floor + (1 - floor) * v)  # lighter, softer, same shading
    mixed = rgb * (1 - redness[..., None]) + new * redness[..., None]
    return Image.fromarray((np.dstack([np.clip(mixed, 0, 1), alpha]) * 255).astype(np.uint8))


def two_couples(single, dest, overlap=0.02):
    """Couple 1 as drawn, couple 2 mirrored so the pairs face each other symmetrically, equal size."""
    one = recolour_reds(single, hue=0.955, sat=0.52, floor=0.58)  # blush rose
    two = ImageOps.mirror(recolour_reds(single, hue=0.045, sat=0.58, floor=0.6))  # peach
    w, h = single.size
    gap = round(w * overlap)
    canvas = Image.new("RGBA", (w * 2 - gap, h), (0, 0, 0, 0))
    canvas.alpha_composite(one, (0, 0))
    canvas.alpha_composite(two, (w - gap, 0))
    save_rgba(canvas, dest, "two couples")


if __name__ == "__main__":
    couple = cut_out_white("3.jpeg", "couple-varmala.webp")
    two_couples(couple, "couples-two.webp")
    save_photo("5.png", "events/lagan-sagai.webp", 1280)
    save_photo("1.jpeg", "events/shaadi.webp", 1024)
    save_photo("2.jpeg", "celebration.webp", 1600)
