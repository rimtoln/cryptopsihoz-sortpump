# How SortPump works

The whole app is one HTML file: markup, styles and ~200 lines of JavaScript on Canvas 2D. No libraries, no build step, no network requests.

## 1. Time and loop

- Animation runs on `requestAnimationFrame`, but everything is computed from **time in seconds**, not frame count, so the speed is the same on 60, 120 and 144 Hz screens.
- Loop length is `LOOP = 32` s. Every frame is a pure function `render(t)` with `t = t mod 32`. Frames at `t = 0` and `t = 32` match pixel for pixel (measured difference ≈ 0.12 of 255), so the video loops with no seam.
- Ring rotations are whole turns per loop, and wire dash offsets are multiples of the dash length.

## 2. Token stream

| Parameter | Value |
|---|---|
| Mints per loop | 40 (`N`) |
| Spawn interval | 0.8 s |
| Trash share | ~64% |
| Fail inside | ~30% of scanner passes |
| Time in ring | 3.6–5.2 s |
| Stay in WATCHLIST | 12 s |
| Stay in RUG BIN | 16 s |

Each token is deterministic: type, ticker, verdict reason and bin position come from `hash(i)`. There is no per-frame randomness, so nothing jitters.

Tickers are built from two parts (`PEPE` + `CAT` → `$PEPECAT`).

## 3. Route of one token

`tokState(token, t)` returns position and phase from the token age `a = t − spawn`:

| Phase | Age | What happens |
|---|---|---|
| `pipe` | 0–1.0 s | falls down the NEW MINTS wire |
| `scan` | 1.0–1.4 s | sits in the scanner and turns green or red |
| `wire` | 1.4–2.4 s | travels along a Bézier curve to its ring |
| `ring` | 2.4 s + 3.6–5.2 s | orbits the ring through 4 checkpoints |
| `out` | 1 s | leaves for the tray, the bin or the FAILED INSIDE wire |
| `tray` / `bin` | 12 / 16 s | rests in WATCHLIST, or drops into RUG BIN with a bounce, then fades |

`flip` tokens turn red halfway through the ring, get a `FAIL · DEV SOLD` tag and leave for the bin on a separate wire.

## 4. Diagram nodes

- **SCANNER.** The needle eases toward the ring the current token is heading to. The CLEAN or RUG lamp lights up.
- **QUALITY / TRASH.** Rings with rotating segments, a tick scale and a dotted track. `INSIDE` is the actual number of tokens on the track at that moment.
- **Checkpoints** `LP · DEV · HOLD · BNDL` flash when a token passes them.
- **WATCHLIST · PASSED** and **RUG BIN · BLOCKED** count arrivals over the last 20 s. It is a sliding window, so it loops without a seam too.
- **TRADERS.** Three lamps blink when a clean token reaches the tray.

## 5. Camera

The camera scales and pans the whole diagram. Zoom is interpolated logarithmically, and the pan is matched to it so each move reads as one continuous push-in.

| Time | Shot |
|---|---|
| 0–5 s | overview |
| 6.3–9.2 s | scanner, ×1.9 |
| 10.5–15.2 s | QUALITY ring, ×1.7 |
| 16.5–20.6 s | TRASH ring, ×1.7 |
| 21.8–25.2 s | RUG BIN, ×1.9 |
| 26.8–32 s | overview |

## 6. Captions

Six captions with colored keywords and a progress bar. Each fades in and out over 0.35 s.

## 7. Stat panels

| Panel | Shows |
|---|---|
| LAST VERDICT | latest token out of the scanner, its verdict and reason |
| IN CHECK NOW | tokens currently in the rings |
| AVG CHECK TIME | average scanner + ring time |
| PASS RATE · 20s | share of passes over 20 s, with a fill bar |

## 8. Performance

- The grid background is drawn once into an offscreen canvas.
- `devicePixelRatio` is respected up to 3×, so text stays sharp.
- Measured: 60 fps, ~0.6 ms per frame.

## 9. Hooks

```js
window.__sortpump.pause(true);   // stop the clock
window.__sortpump.render(12.5);  // draw the frame at 12.5 s
```
