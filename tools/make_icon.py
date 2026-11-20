"""
Генератор иконки «Калькулятор самогонщика»: реторта со змеевиком.

Единственный источник геометрии: отсюда получаются
  assets/icon.svg       — векторный исходник, править удобно в браузере/Inkscape
  assets/icon-256.png   — превью
  assets/icon-64.png    — превью помельче
  assets/icon.ico       — многоразмерная иконка для ярлыка Windows

Запуск:  python tools/make_icon.py
Правка:  координаты ниже заданы в сетке 256×256, после изменений просто перезапустить.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"

C = 256.0          # координатная сетка
SS = 4             # суперсэмплинг для сглаживания растра

# ---------------------------------------------------------------- палитра
BG = "#141821"
BG_EDGE = "#232a35"
POT = "#c8792f"
POT_LIGHT = "#e09a4e"
COPPER = "#f2b877"
COPPER_DEEP = "#a85f24"
COPPER_DARK = "#7a3f14"
DROP = "#f8dcae"


# ---------------------------------------------------------------- примитивы
def rounded_rect(x0, y0, x1, y1, r):
    return ("rrect", (x0, y0, x1, y1), r)


def ellipse(x0, y0, x1, y1):
    return ("ellipse", (x0, y0, x1, y1))


def circle(cx, cy, r):
    return ("ellipse", (cx - r, cy - r, cx + r, cy + r))


def tube(points, width, color=COPPER, outline=COPPER_DARK, ow=2.5,
         cap_start=True, cap_end=True):
    """Трубка с тёмным контуром — чтобы витки не сливались в пятно."""
    return ("tube", points, width, color, outline, ow, cap_start, cap_end)


def ribbon(pts, h):
    """Полигон вокруг осевой линии — сглаженная «трубка» заданной полуширины."""
    left, right = [], []
    n = len(pts)
    for i, p in enumerate(pts):
        if i == 0:
            dx, dy = pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]
        elif i == n - 1:
            dx, dy = pts[-1][0] - pts[-2][0], pts[-1][1] - pts[-2][1]
        else:
            dx, dy = pts[i + 1][0] - pts[i - 1][0], pts[i + 1][1] - pts[i - 1][1]
        ln = math.hypot(dx, dy) or 1.0
        nx, ny = -dy / ln, dx / ln
        left.append((p[0] + nx * h, p[1] + ny * h))
        right.append((p[0] - nx * h, p[1] - ny * h))
    return left + right[::-1]


def bezier(p0, p1, p2, p3, n=40):
    pts = []
    for i in range(n + 1):
        t = i / n
        mt = 1 - t
        x = mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0]
        y = mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


def spiral(cx, cy, r_start, r_end, turns, start_deg=-90, n=280):
    """Плоская спираль — змеевик."""
    pts = []
    total = turns * 2 * math.pi
    for i in range(n + 1):
        t = i / n
        a = math.radians(start_deg) + total * t
        r = r_start + (r_end - r_start) * t
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


# ---------------------------------------------------------------- композиция
POT_BOX = (32, 170, 130, 232)
DOME_BOX = (44, 126, 118, 206)
RIM_BOX = (44, 158, 118, 182)

COIL_CX, COIL_CY, COIL_R = 200, 146, 42
NECK = (bezier((81, 128), (81, 100), (112, 92), (168, 92), n=36)
        + bezier((168, 92), (198, 92), (COIL_CX, 98), (COIL_CX, COIL_CY - COIL_R + 9), n=28))
COIL = spiral(COIL_CX, COIL_CY, COIL_R - 2, 18, 1.8, start_deg=-90)
OUTLET = []

LAYERS = [
    # подложка
    (rounded_rect(6, 6, 250, 250, 58), {"fill": BG, "outline": BG_EDGE, "w": 2}),
    # купол
    (ellipse(*DOME_BOX), {"fill": POT_LIGHT, "outline": COPPER_DEEP, "w": 3}),
    # корпус
    (rounded_rect(*POT_BOX, 18), {"fill": POT, "outline": COPPER_DEEP, "w": 3}),
    # ободок на стыке купола и корпуса
    (ellipse(*RIM_BOX), {"fill": None, "outline": COPPER, "w": 3}),
    # змеевик
    (tube(COIL, 8, COPPER, COPPER_DARK, 1.8, cap_start=False, cap_end=True), {}),
    # шея поверх змеевика — стык читается как ввод трубки в виток
    (tube(NECK, 12, cap_start=False, cap_end=False), {}),
    # капля
    (circle(COIL_CX, COIL_CY + COIL_R + 7, 8), {"fill": DROP, "outline": COPPER_DEEP, "w": 2}),
]


# ---------------------------------------------------------------- растр
def render_png(size: int) -> Image.Image:
    img = Image.new("RGBA", (size * SS, size * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    k = size * SS / C

    def line(pts, width, color):
        w = max(1, int(round(width * k)))
        xy = [(x * k, y * k) for x, y in pts]
        d.line(xy, fill=color, width=w, joint="curve")
        r = w / 2
        for px, py in (xy[0], xy[-1]):
            d.ellipse([px - r, py - r, px + r, py + r], fill=color)

    for shape, style in LAYERS:
        kind = shape[0]
        if kind == "rrect":
            (x0, y0, x1, y1), r = shape[1], shape[2]
            d.rounded_rectangle(
                [x0 * k, y0 * k, x1 * k, y1 * k], radius=r * k,
                fill=style.get("fill"),
                outline=style.get("outline"),
                width=max(1, int(style.get("w", 0) * k)),
            )
        elif kind == "ellipse":
            x0, y0, x1, y1 = shape[1]
            d.ellipse(
                [x0 * k, y0 * k, x1 * k, y1 * k],
                fill=style.get("fill"),
                outline=style.get("outline"),
                width=max(1, int(style.get("w", 0) * k)),
            )
        elif kind == "tube":
            _, pts, width, color, outline, ow, cap_s, cap_e = shape
            h = width / 2
            outer = ribbon(pts, h + ow)
            inner = ribbon(pts, h)
            d.polygon([(x * k, y * k) for x, y in outer], fill=outline)
            d.polygon([(x * k, y * k) for x, y in inner], fill=color)
            ends = []
            if cap_s:
                ends.append(pts[0])
            if cap_e:
                ends.append(pts[-1])
            for px, py in ends:
                for rr, col in ((h + ow, outline), (h, color)):
                    d.ellipse([(px - rr) * k, (py - rr) * k, (px + rr) * k, (py + rr) * k], fill=col)

    return img.resize((size, size), Image.LANCZOS)


# ---------------------------------------------------------------- SVG
def svg() -> str:
    parts = []
    for shape, style in LAYERS:
        kind = shape[0]
        if kind == "rrect":
            (x0, y0, x1, y1), r = shape[1], shape[2]
            parts.append(
                f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" rx="{r}" '
                f'fill="{style.get("fill") or "none"}" stroke="{style.get("outline") or "none"}" '
                f'stroke-width="{style.get("w", 0)}"/>'
            )
        elif kind == "ellipse":
            x0, y0, x1, y1 = shape[1]
            parts.append(
                f'<ellipse cx="{(x0 + x1) / 2}" cy="{(y0 + y1) / 2}" rx="{(x1 - x0) / 2}" '
                f'ry="{(y1 - y0) / 2}" fill="{style.get("fill") or "none"}" '
                f'stroke="{style.get("outline") or "none"}" stroke-width="{style.get("w", 0)}"/>'
            )
        elif kind == "tube":
            _, pts, width, color, outline, ow, _cs, _ce = shape
            d = "M " + " L ".join(f"{x:.2f} {y:.2f}" for x, y in pts)
            parts.append(
                f'<path d="{d}" fill="none" stroke="{outline}" stroke-width="{width + ow * 2}" '
                f'stroke-linecap="round" stroke-linejoin="round"/>'
            )
            parts.append(
                f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" '
                f'stroke-linecap="round" stroke-linejoin="round"/>'
            )

    body = "\n  ".join(parts)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">\n'
        f"  {body}\n</svg>\n"
    )


def save_ico(sizes=(16, 24, 32, 48, 64, 128, 256)):
    """ICO с PNG-сжатыми кадрами (Windows Vista+)."""
    out = ASSETS / "icon.ico"
    render_png(256).save(out, format="ICO", sizes=[(s, s) for s in sizes])
    return out


def main():
    ASSETS.mkdir(exist_ok=True)
    (ASSETS / "icon.svg").write_text(svg(), encoding="utf-8")
    render_png(256).save(ASSETS / "icon-256.png")
    render_png(64).save(ASSETS / "icon-64.png")
    render_png(32).save(ASSETS / "icon-32.png")
    ico = save_ico()
    for f in ("icon.svg", "icon-256.png", "icon-64.png", "icon-32.png", ico.name):
        p = ASSETS / f
        print(f"{p.name:14} {p.stat().st_size:>7} байт")


if __name__ == "__main__":
    main()
