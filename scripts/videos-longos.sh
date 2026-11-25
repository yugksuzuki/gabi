#!/usr/bin/env bash
# Versões longas dos vídeos das obras (docs/14).
#
# O bruto fica fora do git (90–530 MB, repositório público). Baixe da pasta GAB
# do Drive para uma pasta qualquer e passe o caminho:
#
#   bash scripts/videos-longos.sh <pasta-com-os-brutos>
#
# Espera, nessa pasta:
#   caminhos.mov     ← GAB/Encontro 11.230/IMG_6561.MOV   (1:38, 4K vertical)
#   instante.mov     ← GAB/IMG_7031.MOV                   (1:34, 4K vertical)
#   desabrochar.mov  ← GAB/copy_CAE78986-….mov            (1:02, 1080×1920)
#
# Saída: public/obras/<slug>/video-longo.{mp4,webm} e poster-longo.jpg.
# 720×1280, 24 fps, sem áudio (o som é o ambiente do celular, não é trilha;
# e vídeo que toca sozinho precisa estar mudo). H.264 com faststart para o
# Safari/iOS começar a tocar antes de baixar tudo; VP9 para o resto.
# Teto de ~1 Mbps (regra 4): sem ele, o travelling 4K de Caminhos saía com
# 44 MB em CRF 23. Com o teto, ~10 MB por 1:30 — e só desce quando a pessoa
# chega ao vídeo (preload="none").
# O corte curto (video.{mp4,webm}) continua: é o que passa por cima da foto
# na home, onde 1:30 de vídeo em cada cartão não se paga.
set -euo pipefail

ORIGEM="${1:?passe a pasta com os brutos}"
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"

for slug in caminhos instante desabrochar; do
  bruto="$ORIGEM/$slug.mov"
  destino="$RAIZ/public/obras/$slug"
  [ -f "$bruto" ] || { echo "falta $bruto" >&2; exit 1; }

  # O ffmpeg já aplica a rotação do iPhone (−90°) por padrão.
  filtro="scale=720:1280:flags=lanczos,fps=24,format=yuv420p"

  ffmpeg -v error -y -i "$bruto" -map 0:v:0 -an -vf "$filtro" \
    -c:v libx264 -preset slow -crf 24 -maxrate 1M -bufsize 2M -profile:v high -level 4.0 \
    -movflags +faststart "$destino/video-longo.mp4"

  # VP9 em DUAS passadas: em uma só, o libvpx estoura o alvo (Caminhos saía
  # com 15 MB, maior que o MP4 — e o Chrome baixa o WebM primeiro).
  vp9="-c:v libvpx-vp9 -b:v 700k -row-mt 1 -deadline good -cpu-used 2"
  log="$(mktemp -d)/vp9"
  # shellcheck disable=SC2086
  ffmpeg -v error -y -i "$bruto" -map 0:v:0 -an -vf "$filtro" $vp9 \
    -pass 1 -passlogfile "$log" -f webm /dev/null
  # shellcheck disable=SC2086
  ffmpeg -v error -y -i "$bruto" -map 0:v:0 -an -vf "$filtro" $vp9 \
    -pass 2 -passlogfile "$log" "$destino/video-longo.webm"

  # Pôster = primeiro quadro, o mesmo que o navegador mostra antes do play.
  ffmpeg -v error -y -i "$destino/video-longo.mp4" -frames:v 1 -q:v 3 \
    "$destino/poster-longo.jpg"

  echo "$slug: $(du -h "$destino/video-longo.mp4" | cut -f1) mp4 · $(du -h "$destino/video-longo.webm" | cut -f1) webm"
done
