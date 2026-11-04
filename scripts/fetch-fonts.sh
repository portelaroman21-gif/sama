#!/usr/bin/env bash
# Descarga Montserrat (woff2, subset latin) para self-host (Módulo 1).
# Pesos: 400 Regular, 600 SemiBold, 700 Bold, 900 Black.
# Reproducible: bash scripts/fetch-fonts.sh
set -euo pipefail
DEST="public/assets/fonts"
mkdir -p "$DEST"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
CSS_URL="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap"

CSS=$(curl -s -A "$UA" "$CSS_URL")

# Recorre bloques @font-face y baja el primer woff2 (subset latin) de cada peso.
python3 - "$CSS" "$DEST" <<'PY'
import re, sys, urllib.request
css, dest = sys.argv[1], sys.argv[2]
names = {"400":"montserrat-regular","600":"montserrat-semibold","700":"montserrat-bold","900":"montserrat-black"}
blocks = css.split("@font-face")
ua = {"User-Agent":"Mozilla/5.0"}
saved = {}
for b in blocks:
    wght = re.search(r"font-weight:\s*(\d+)", b)
    url  = re.search(r"url\((https://[^)]+\.woff2)\)", b)
    rng  = re.search(r"unicode-range:\s*([^;]+)", b)
    if not (wght and url): continue
    w = wght.group(1)
    if w not in names: continue
    # preferimos el subset 'latin' (incluye acentos del español)
    is_latin = rng and "U+0000" in rng.group(1)
    if w in saved and not is_latin: continue
    fname = f"{names[w]}.woff2"
    req = urllib.request.Request(url.group(1), headers=ua)
    data = urllib.request.urlopen(req).read()
    open(f"{dest}/{fname}","wb").write(data)
    saved[w] = fname
    print(f"  ✓ {fname} ({len(data)//1024} KB)")
print(f"Descargados {len(saved)}/4 pesos en {dest}")
PY
