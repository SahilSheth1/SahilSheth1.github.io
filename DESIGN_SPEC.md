# Design Spec: "Signal Amber"

Owner: Sahil Sheth (artist name: Sahil Sheth)
Style: "Studio meets software." Dark, layered, hardware-warm. Shared by the main page and the music page.

Every value here lives as a CSS variable in `src/styles/tokens.css`. If a value changes, change it there and update this file.

---

## 1. Color

| Token             | Value       | Use                                                  |
| ----------------- | ----------- | ---------------------------------------------------- |
| `--bg`            | `#0A0A0B`   | Page background                                      |
| `--surface-1`     | `#121214`   | Cards, sections                                      |
| `--surface-2`     | `#19191C`   | Raised elements, inputs                              |
| `--surface-3`     | `#212125`   | Hover surfaces, popovers                             |
| `--text`          | `#EDEAE4`   | Headings, primary text (off-white, warm)             |
| `--text-muted`    | 64% of text | Body copy, secondary text                            |
| `--text-subtle`   | 52% of text | Captions, metadata (never for essential info)        |
| `--accent`        | `#FF9F1C`   | Primary buttons, active nav, meters, focus rings     |
| `--accent-hover`  | `#FFB247`   | Accent hover                                         |
| `--accent-press`  | `#E88D0C`   | Accent pressed                                       |
| `--accent-ink`    | `#0A0A0B`   | Text on accent fills                                 |
| `--secondary`     | `#3DDBC4`   | Sparingly: meter peaks, active states, small details |
| `--border`        | white 8%    | Default 1px hairline                                 |
| `--border-strong` | white 16%   | Hover and emphasis                                   |
| `--danger`        | `#FF5C5C`   | Errors only                                          |

Rules:

- Accent appears on at most one primary action per view, plus small indicators.
- Secondary teal never fills a large area.
- Body text must keep at least 4.5:1 contrast against its background.

## 2. Typography

| Role               | Font                      | Notes                                |
| ------------------ | ------------------------- | ------------------------------------ |
| Display / headings | Space Grotesk (variable)  | Tight tracking, confident            |
| Body               | Inter (variable)          | 17px, line-height 1.6, 60-75ch lines |
| Mono               | JetBrains Mono (variable) | Labels, meta, terminal, readouts     |

All self-hosted via Fontsource.

| Style      | Size (fluid)       | Line height | Tracking |
| ---------- | ------------------ | ----------- | -------- |
| Display    | 3rem to 6.5rem     | 1.05        | -0.04em  |
| H1         | 2.25rem to 4rem    | 1.1         | -0.03em  |
| H2         | 1.75rem to 2.75rem | 1.15        | -0.02em  |
| H3         | 1.5rem             | 1.2         | -0.01em  |
| Body       | 1.0625rem          | 1.6         | 0        |
| Small      | 0.875rem           | 1.5         | 0        |
| Mono label | 0.8125rem          | 1.4         | 0.02em   |

Weights: 400 body, 500 UI and headings, 600 only for display if needed.

## 3. Spacing and layout

- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px (`--space-1` to `--space-10`).
- Max content width: 1200px. Side gutter: fluid, 16px to 32px.
- Reading measure: 68ch.
- Section padding: 96px vertical on desktop, 64px on mobile.
- Nav height: 64px.

## 4. Radii and borders

| Token           | Value | Use                   |
| --------------- | ----- | --------------------- |
| `--radius-sm`   | 6px   | Chips, small controls |
| `--radius-md`   | 10px  | Buttons, inputs       |
| `--radius-lg`   | 16px  | Cards                 |
| `--radius-pill` | 999px | Tags, toggles         |

Borders are always 1px, low-opacity white. Layer depth with surfaces, not heavy shadows.

## 5. Shadows and glow

- `--shadow-sm`, `--shadow-md`, `--shadow-lg`: soft black shadows for raised layers.
- `--glow-accent`: a soft amber glow for hover and active states on primary elements and meters. Use sparingly.

## 6. Motion

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out`).
- Durations: 200ms (fast), 400ms (base), 600ms (slow).
- Animate only `transform` and `opacity`.
- `prefers-reduced-motion`: transitions and animations collapse to near-instant; smooth scroll off.

## 7. Components (base set)

- **Buttons:** primary (amber fill), secondary (outlined), ghost (text). Minimum 44px tall. States: default, hover, active, focus-visible, disabled.
- **Links:** underline grows in from the left on hover.
- **Focus ring:** 2px amber outline, 3px offset, on every interactive element.
- **Cards:** `--surface-1`, 1px border, 16px radius, lift 2px on hover.
- **Grain:** very subtle noise overlay at about 4% opacity.

## 8. Reference sites (skipped for now; fill in anytime)

| Site | What I like (font, spacing, hover, motion) |
| ---- | ------------------------------------------ |
|      |                                            |
|      |                                            |
|      |                                            |

## 9. Open decisions

- Icon set: Lucide (install in Phase 2 when the nav needs its first icon; confirm the Astro-friendly package then).
- Figma mockup: skipped. This spec and the `/styleguide` page are the visual reference.
- Favicon and Open Graph image: design in Figma during Phase 2.
- Logo or wordmark: plain "Sahil Sheth" in Space Grotesk until decided otherwise.
