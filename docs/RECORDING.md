# Record your own video

Two options. Pick the first for a quick clip and the second for a clean, frame-perfect master.

---

## Option 1: Screen recording with OBS

**You need:** [OBS Studio](https://obsproject.com/) (free) and Chrome or Edge.

1. Open https://rimtoln.github.io/cryptopsihoz-sortpump/ or your local `index.html`.
2. Press `F` for fullscreen.
3. In OBS add a **Display Capture** source for that monitor.
4. Crop to the frame. On a 1920×1080 monitor the frame is 864×1080, starting at x = 528.
   In OBS: right-click the source → **Transform → Edit Transform** → Crop left `528`, right `528`.
5. **Settings → Video:** set the canvas and output resolution to `864×1080` and FPS to `60`.
6. **Settings → Output:** set the recording format to `mp4` and the encoder to hardware (NVENC/AMF/QSV) or x264.
7. Start recording, wait at least 32 s for one full loop, then stop.

The loop is seamless, so you can trim any 32 s window and it will repeat cleanly.

---

## Option 2: Frame-perfect render (recommended)

This renders every frame for an exact timestamp, so there are no dropped frames, no stutter and the output is exactly 1080×1350. The video in `media/` was made this way.

**You need:** Python 3, [ffmpeg](https://ffmpeg.org/download.html) on `PATH`, and Chrome or Edge.

### 1. Start the capture server

From the repository root:

```bash
python tools/capture/cap_server.py 8796 .
```

It serves the project and saves every frame the page sends it into `tools/capture/frames/`.

### 2. Render the frames

1. Open http://127.0.0.1:8796/index.html
2. Open DevTools (`F12`) → **Console**.
3. Paste the contents of [`tools/capture/capture.js`](../tools/capture/capture.js) and press Enter.
4. Wait until the console prints `done`. 960 JPEG frames will be written to `tools/capture/frames/`.

Edit `FPS` and `SECONDS` at the top of `capture.js` for a different frame rate or several loops.

### 3. Encode

MP4 (for X, Instagram, TikTok):

```bash
ffmpeg -framerate 30 -i tools/capture/frames/f%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 20 -preset slow -movflags +faststart media/sortpump-overview.mp4
```

GIF preview (for README or Telegram):

```bash
ffmpeg -framerate 30 -i tools/capture/frames/f%04d.jpg -vf "fps=12,scale=432:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" media/sortpump-overview-preview.gif
```

Longer clip (3 loops ≈ 96 s, without re-rendering):

```bash
ffmpeg -stream_loop 2 -i media/sortpump-overview.mp4 -c copy media/sortpump-96s.mp4
```

Stop the server with `Ctrl+C`. The `frames/` folder is git-ignored.

---

## Tips

- 9:16 for Reels/TikTok: pad the 4:5 video onto a 1080×1920 canvas:
  `ffmpeg -i media/sortpump-overview.mp4 -vf "pad=1080:1920:0:285:color=0x050a08" -c:a copy reels.mp4`
- If you change the code, check the seam: `__sortpump.render(0)` and `__sortpump.render(31.9999)` should look the same.
