# Social cards

The Open Graph images in `public/img/` are HTML, screenshotted. Keeping the source here is the point:
`og.png` was made without one, so the next card had to reconstruct its style by eye.

Fonts come from Google Fonts at render time (`display=block`, so nothing is shot before they load),
and the colours are copied from `app/assets/css/main.css` - a card that drifts from the site is worse
than no card.

```bash
google-chrome --headless --disable-gpu --hide-scrollbars \
  --window-size=1200,630 --virtual-time-budget=6000 \
  --screenshot=public/img/og-benchmark.png \
  "file://$PWD/og/benchmark.html"
```

| source           | output                        | used by          |
| ---------------- | ----------------------------- | ---------------- |
| `benchmark.html` | `public/img/og-benchmark.png` | `/benchmark`     |
| -                | `public/img/og.png`           | every other page |

The numbers on the benchmark card are not live - they are typed from `app/data/benchmark.json`. Re-run
the card after a benchmark run, or it will claim a margin that is no longer measured.
