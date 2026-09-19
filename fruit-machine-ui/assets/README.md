# Fruit-machine symbol sprite sheet

`symbols.png` is the generated 2 × 4 symbol atlas used by the fruit-machine UI. It is a single raster image with a warm cream tile background and glossy 2.5D arcade treatment matching the purple-and-gold reference frame.

- **Image size:** 1774 × 887 px (PNG)
- **Grid:** 4 equal columns × 2 equal rows
- **Tile size:** 443.5 × 443.5 px (CSS can use the atlas as a 4 × 2 background grid; when integer source pixels are required, use proportional `object-position`/`background-size` rather than assuming a whole-pixel crop)
- **Generated asset source:** built-in image generation tool, style reference `reference-analysis/frame-003.jpg`
- **Background:** consistent light warm cream; icons include their own soft brown-gold outline and shadow

## Sprite mapping

| Row | Column | Symbol | CSS order | Intended payout tier |
| --- | ---: | --- | ---: | ---: |
| top | 1 | Stacked `BAR` / `BAR` / `BAR` | `0` | jackpot, ×120 |
| top | 2 | Red `77` | `1` | ×40 |
| top | 3 | Gold star | `2` | ×30 |
| top | 4 | Watermelon wedge | `3` | ×20 |
| bottom | 1 | Golden bells with pink flowers | `4` | ×20 |
| bottom | 2 | Lemon | `5` | ×15 |
| bottom | 3 | Orange | `6` | ×10 |
| bottom | 4 | Red apple | `7` | ×5 |

The atlas is intended to be cropped into individual reel cells. Keep the source image intact; the table above is the canonical ordering for code and game outcome IDs.
