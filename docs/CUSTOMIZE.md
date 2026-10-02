# Customize

All settings are constants at the top of the `<script>` in `index.html`.

| What | Where | Example |
|---|---|---|
| Loop length | `LOOP` | `32` |
| Mints per loop | `N` | `40` |
| Trash share | `hash(i*3.1)<.64` | `.5` for half trash |
| Fail-inside share | `hash(i*5.7+2)<.3` | `.15` |
| Ticker parts | `PRE`, `SUF` | your own memes |
| Block reasons | `BAD_WHY` | `'DEV 41% SUPPLY'` |
| Pass reasons | `GOOD_WHY` | `'LP BURNED · DEV 2%'` |
| Checkpoints | `CHECKS` | `[['LP',-20],['DEV',70],…]` (name, angle) |
| Camera plan | `KEYS` | `[time, [x, y, zoom]]` |
| Captions | `CAPS` | `[start, end, [[text, 0/1/2]]]`, 1 = green, 2 = red |
| Colors | `col` | `green`, `red`, `mint`… |
| Handle | in `render()` | `'@cryptopsihoz'` |

After changes, check the seam: `render(0)` and `render(LOOP - 0.0001)` must match.

Save new releases as `versions/SORTPUMP-v02.html` and so on, without overwriting earlier ones.
