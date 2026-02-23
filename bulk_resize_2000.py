#!/usr/bin/env python3
"""Batch-convert images to 2000x2000 pixels.

Usage:
  python bulk_resize_2000.py ./input ./output --mode pad
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageOps

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}
TARGET_SIZE = (2000, 2000)


def iter_images(input_dir: Path) -> Iterable[Path]:
    for path in sorted(input_dir.rglob("*")):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            yield path


def convert_image(src: Path, dst: Path, mode: str, background: tuple[int, int, int]) -> None:
    with Image.open(src) as img:
        img = ImageOps.exif_transpose(img).convert("RGB")

        if mode == "crop":
            converted = ImageOps.fit(img, TARGET_SIZE, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        elif mode == "stretch":
            converted = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        else:  # pad
            converted = ImageOps.pad(
                img,
                TARGET_SIZE,
                method=Image.Resampling.LANCZOS,
                color=background,
                centering=(0.5, 0.5),
            )

        dst.parent.mkdir(parents=True, exist_ok=True)
        converted.save(dst, quality=95)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Batch resize images to 2000x2000 pixels")
    parser.add_argument("input_dir", type=Path, help="Directory containing source images")
    parser.add_argument("output_dir", type=Path, help="Directory for converted images")
    parser.add_argument(
        "--mode",
        choices=("pad", "crop", "stretch"),
        default="pad",
        help="pad=keep ratio with border, crop=fill frame by center-crop, stretch=force exact resize",
    )
    parser.add_argument(
        "--background",
        default="255,255,255",
        help="RGB background color used only in pad mode, e.g. 255,255,255",
    )
    return parser.parse_args()


def parse_rgb(value: str) -> tuple[int, int, int]:
    try:
        parts = tuple(int(p.strip()) for p in value.split(","))
        if len(parts) != 3 or any(p < 0 or p > 255 for p in parts):
            raise ValueError
        return parts
    except Exception as exc:  # noqa: BLE001
        raise argparse.ArgumentTypeError("--background must be like 255,255,255") from exc


def main() -> None:
    args = parse_args()
    background = parse_rgb(args.background)

    if not args.input_dir.exists() or not args.input_dir.is_dir():
        raise SystemExit(f"입력 폴더를 찾을 수 없습니다: {args.input_dir}")

    image_paths = list(iter_images(args.input_dir))
    if not image_paths:
        raise SystemExit("변환할 이미지가 없습니다.")

    converted_count = 0
    for src in image_paths:
        relative = src.relative_to(args.input_dir)
        dst = (args.output_dir / relative).with_suffix(".jpg")
        convert_image(src, dst, args.mode, background)
        converted_count += 1

    print(f"완료: {converted_count}개 이미지를 {TARGET_SIZE[0]}x{TARGET_SIZE[1]}로 변환했습니다.")


if __name__ == "__main__":
    main()
