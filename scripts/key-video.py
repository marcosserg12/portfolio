"""Turn a white-background clip into a transparent WebM (VP9 + alpha) and a transparent poster.

usage: python -I scripts/key-video.py <in.mp4> <out-basename> [--width 1280] [--crop-bottom 0.074] [--pingpong]

White counts as background when it touches the frame border, or when it forms a large enclosed pocket
(between an arm and the body); small pockets such as eye whites are kept.
"""
import argparse
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("out")
ap.add_argument("--width", type=int, default=1280)
ap.add_argument("--crop-bottom", type=float, default=0.0)
ap.add_argument("--pingpong", action="store_true")
ap.add_argument("--fps", type=int, default=24)
ap.add_argument("--keep-center", action="store_true")
args = ap.parse_args()

tmp = Path(tempfile.mkdtemp())
frames = tmp / "f"
frames.mkdir()
keyed = tmp / "k"
keyed.mkdir()
subprocess.run(["ffmpeg", "-v", "error", "-i", args.src, "-vf", f"fps={args.fps},scale={args.width}:-2", str(frames / "%04d.png")], check=True)

BORDER_T = 236   # min channel for border-connected background
POCKET_T = 250   # min channel for enclosed pockets (eye whites are never pure white)
POCKET_MIN = 30
LOW_T = 190       # pocket threshold in the lower part of the frame
LOW_FROM = 0.55   # fraction of the height where the lower part starts


def key(im: Image.Image) -> Image.Image:
    w, h = im.size
    if args.crop_bottom:
        h = round(h * (1 - args.crop_bottom))
        im = im.crop((0, 0, w, h))
    r, g, b = im.split()
    mn = ImageChops.darker(ImageChops.darker(r, g), b)
    mask = mn.point(lambda v: 255 if v >= BORDER_T else 0)
    for x in range(0, w, 4):
        for y in (0, h - 1):
            if mask.getpixel((x, y)) == 255:
                ImageDraw.floodfill(mask, (x, y), 128)
    for y in range(0, h, 4):
        for x in (0, w - 1):
            if mask.getpixel((x, y)) == 255:
                ImageDraw.floodfill(mask, (x, y), 128)
    # enclosed pockets: only very white ones, and only when large
    pocket = mn.point(lambda v: 255 if v >= POCKET_T else 0)
    # below the face (hands, laptop, arms) shadowed white pockets count too; eyes live in the upper half
    mx = ImageChops.lighter(ImageChops.lighter(r, g), b)
    neutral = ImageChops.subtract(mx, mn).point(lambda v: 255 if v <= 16 else 0)  # skin is warm, background is grey
    low = ImageChops.multiply(mn.point(lambda v: 255 if v >= LOW_T else 0), neutral)
    low.paste(0, (0, 0, w, int(h * LOW_FROM)))
    if args.keep_center:  # the laptop lid with its stickers and logo stays untouched
        low.paste(0, (int(w * 0.39), 0, int(w * 0.61), h))
    pocket = ImageChops.lighter(pocket, low)
    pocket = ImageChops.multiply(pocket, mask.point(lambda v: 255 if v == 255 else 0))
    for y in range(0, h, 8):
        for x in range(0, w, 8):
            if pocket.getpixel((x, y)) == 255:
                ImageDraw.floodfill(pocket, (x, y), 200)
                area = dict((c, n) for n, c in pocket.getcolors(256) or []).get(200, 0)
                ImageDraw.floodfill(pocket, (x, y), 100 if area >= POCKET_MIN else 50)
    bg = ImageChops.lighter(mask.point(lambda v: 255 if v == 128 else 0), pocket.point(lambda v: 255 if v == 100 else 0))
    alpha = ImageChops.invert(bg).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.0))
    out = im.convert("RGBA")
    out.putalpha(alpha)
    return out


files = sorted(frames.glob("*.png"))
for i, f in enumerate(files):
    key(Image.open(f).convert("RGB")).save(keyed / f"{i:04d}.png")
n = len(files)
if args.pingpong:
    for j, i in enumerate(range(n - 2, 0, -1)):
        shutil.copy(keyed / f"{i:04d}.png", keyed / f"{n + j:04d}.png")

out = Path(args.out)
out.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(args.fps), "-i", str(keyed / "%04d.png"),
                "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "34", "-row-mt", "1", "-auto-alt-ref", "0",
                str(out) + ".webm"], check=True)
Image.open(keyed / "0000.png").save(str(out) + "-poster.webp", quality=88, method=6)
print("frames", n, "->", str(out) + ".webm")
shutil.rmtree(tmp)
