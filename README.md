# 2000x2000 이미지 일괄 변환기

폴더에 있는 사진들을 한 번에 `2000 x 2000` 픽셀 JPG로 변환하는 간단한 프로그램입니다.

## 설치

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 사용법

```bash
python bulk_resize_2000.py ./input ./output
```

### 옵션

- `--mode pad` (기본값): 비율 유지 + 여백 채우기
- `--mode crop`: 비율 유지 + 가운데 크롭
- `--mode stretch`: 비율 무시하고 강제 리사이즈
- `--background 255,255,255`: `pad` 모드에서 여백 색상 지정

예시:

```bash
python bulk_resize_2000.py ./input ./output --mode crop
python bulk_resize_2000.py ./input ./output --mode pad --background 0,0,0
```

## 지원 확장자

`.jpg`, `.jpeg`, `.png`, `.bmp`, `.tiff`, `.webp`
