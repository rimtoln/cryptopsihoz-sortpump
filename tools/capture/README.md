# Запись видео

Видео в `media/` снято не записью экрана, а покадровым рендером: каждый кадр рисуется для точного времени `t`, поэтому ролик идеально ровный и зацикленный.

## Шаги

1. Запусти сервер, который отдаёт сайт и принимает кадры:

   ```bash
   python tools/capture/cap_server.py 8796 .
   ```

2. Открой `http://127.0.0.1:8796/index.html`, открой DevTools → Console и вставь содержимое `capture.js`.
   Кадры (960 штук, 1080×1350) появятся в `tools/capture/frames/`.

3. Собери MP4 и GIF:

   ```bash
   ffmpeg -framerate 30 -i tools/capture/frames/f%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 20 -preset slow -movflags +faststart media/sortpump-overview.mp4

   ffmpeg -framerate 30 -i tools/capture/frames/f%04d.jpg -vf "fps=12,scale=432:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" media/sortpump-preview.gif
   ```

Папка `frames/` в git не попадает (см. `.gitignore`).
