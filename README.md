# Sahil Sheth: Portfolio

A fast, dark, "studio meets software" portfolio covering software and design (AI/ML focus) plus a music production page. It is also a learning project for git and GitHub.

**Live site:** https://SahilSheth1.github.io

> Status: in development. See [PLAN.md](PLAN.md) for the full roadmap and [PROJECT_NOTES.md](PROJECT_NOTES.md) for context and progress.

## Pages

- **Main page:** hero, about, projects, career, education, skills, resume, contact
- **Music page:** production journey, featured track, streaming embeds, audio visualizer

## Tech stack

- [Astro](https://astro.build) (static output)
- Plain CSS with design tokens
- Lenis + GSAP for scroll and animation
- Web Audio API and Canvas 2D for the pad and visualizer
- GitHub Pages + GitHub Actions for hosting and deploys

## Run locally

Requires Node.js 22 or newer.

```bash
git clone https://github.com/SahilSheth1/SahilSheth1.github.io.git
cd SahilSheth1.github.io
npm install
npm run dev
```

Then open the URL printed in the terminal.

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the local dev server           |
| `npm run build`   | Build the production site to `dist/` |
| `npm run preview` | Preview the production build locally |

## Workflow

`main` is always deployable. Work happens on `feature/*`, `fix/*` and `chore/*` branches and merges through pull requests. Pushing to `main` redeploys the site.
