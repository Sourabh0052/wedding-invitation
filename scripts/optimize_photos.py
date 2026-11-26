#!/usr/bin/env python3
"""
Shrinks your own photos so the invitation stays fast on mobile data.

  1. Put your original photos (JPG / PNG / WebP — straight from the phone is fine)
     into the  my-photos/  folder at the project root.
  2. Run:   npm run photos
  3. Optimised copies appear in  public/images/photos/  (WebP, max 1600 px, ~150–300 KB)
     and the script prints the exact lines to paste into src/config/weddingConfig.js.

Your originals in my-photos/ are never modified. Requires Python 3 + Pillow.
Optional: `pip install pillow-heif` to also read iPhone .HEIC photos.
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

try:  # iPhone HEIC support, if available
    from pillow_heif import register_heif_opener

    register_heif_opener()
    HEIC = True
except ImportError:
    HEIC = False

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / "my-photos"
OUT = ROOT / "public" / "images" / "photos"
MAX_SIDE = 1600
QUALITY = 82
EXTS = {".jpg", ".jpeg", ".png", ".webp"} | ({".heic", ".heif"} if HEIC else set())


def slug(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s or "photo"


def main():
    if not SRC.is_dir():
        SRC.mkdir(parents=True)
        print(f"Created {SRC.relative_to(ROOT)}/ — put your photos there and run again.")
        return
    files = sorted(p for p in SRC.iterdir() if p.suffix.lower() in EXTS)
    skipped = sorted(p.name for p in SRC.iterdir() if p.is_file() and p.suffix.lower() not in EXTS and p.name != "README.txt")
    if not files:
        print(f"No photos found in {SRC}. Supported: {', '.join(sorted(EXTS))}")
        return

    OUT.mkdir(parents=True, exist_ok=True)
    made = []
    for f in files:
        try:
            with Image.open(f) as im:
                im = ImageOps.exif_transpose(im)  # respect phone rotation
                im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") and f.suffix.lower() == ".png" else "RGB")
                im.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
                dest = OUT / f"{slug(f.stem)}.webp"
                im.save(dest, "WEBP", quality=QUALITY, method=6)
                made.append(dest)
                print(f"✓ {f.name:40s} → {dest.relative_to(ROOT)}  ({im.width}×{im.height}, {dest.stat().st_size // 1024} KB)")
        except Exception as e:  # keep going if one file is bad
            print(f"✗ {f.name}: {e}")

    if skipped:
        print(f"\nSkipped (unsupported format): {', '.join(skipped)}")
        if any(n.lower().endswith((".heic", ".heif")) for n in skipped):
            print("  → for iPhone photos run:  pip install pillow-heif   and try again")

    print("\nPaste into src/config/weddingConfig.js:")
    print("  • a couple's portrait →  photo: '/images/photos/<name>.webp',")
    print("  • gallery →  gallery.photos: [")
    for d in made:
        print(f"      {{ src: '/images/photos/{d.name}', caption: '' }},")
    print("    ],")


if __name__ == "__main__":
    main()
