# Project Notes: Personal Portfolio Website

Living context file. Source of truth for the full plan is `PLAN.md`; this file captures the context, decisions, and working agreements so any session can pick up where we left off.

_Created: 2026-10-27_

---

## 1. What this is

A fast, sleek, "expensive-feeling" personal portfolio covering **software and design (AI/ML focus)** plus a **music production** page. It is also a **beginner project to learn git and GitHub**, so the git workflow is part of the deliverable, not an afterthought.

- **Audience:** recruiters, hiring managers, collaborators, music listeners.
- **Success test:** a first-time visitor understands who I am and finds Projects, Resume, and Music within 5 seconds, even without touching any interactive feature.

## 2. Pages

| Page          | Sections                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `index.astro` | Hero, About, Projects, Career, Education, Skills, Resume, GitHub/LinkedIn links, Contact                   |
| `music.astro` | Production journey timeline, featured track, Spotify + Apple Music embeds, profile links, audio visualizer |
| 404           | Designed 404 page                                                                                          |

## 3. Interactive features (one home each)

| Feature                       | Location                           |
| ----------------------------- | ---------------------------------- |
| Playable pad/keyboard         | Hero (main page)                   |
| Skills as a mixing board      | Skills section                     |
| Career timeline as DAW tracks | Career and Education               |
| Audio visualizer              | Music page, tied to featured track |
| Cursor-reactive background    | Site-wide, subtle                  |
| Hidden terminal               | Easter egg (shortcut or `>_` icon) |

## 4. Tech stack

- **Framework:** Astro (static output). Fallback: plain HTML/CSS/JS, migrate later.
- **Language:** JavaScript (TypeScript optional later)
- **Styling:** plain CSS with variables (design tokens in `tokens.css`)
- **Motion:** Lenis (smooth scroll) + GSAP (ScrollTrigger, timelines)
- **Audio:** Web Audio API; samples exported from Logic Pro; visualizer via `AnalyserNode` + Canvas 2D
- **Background:** Canvas 2D (WebGL only if needed later)
- **Mixer, timeline, terminal:** vanilla JS with pointer events
- **Fonts:** Fontsource (self-hosted); one display, one body, one mono
- **Icons:** Lucide or Phosphor (pick one)
- **Embeds:** Spotify + Apple Music iframes, lazy-loaded
- **Hosting/CI:** GitHub Pages + GitHub Actions
- **Tooling:** Git, GitHub, Figma, VS Code, Prettier, ESLint, Lighthouse

## 5. Design principles

**Style:** "Studio meets software." Dark, layered, Logic Pro inspired.

- Near-black background (e.g. `#0A0A0B`), off-white text, one main accent (second used sparingly), 1px low-opacity borders, soft glows, subtle grain.
- Large confident headings with tight tracking; body 16-18px, line-height ~1.6, 60-75 character lines.
- Spacing in multiples of 4/8px, consistent grid and max width.
- Motion: purposeful, `cubic-bezier(0.16, 1, 0.3, 1)`, 200-600ms, animate only `transform` and `opacity`.
- Hover/active states on everything clickable, custom focus rings, custom favicon + OG image.
- Real imagery only on the live site (no placeholders).

**Five rules:**

1. Content first, effects second; everything important works without JS or the toys.
2. Normal behavior stays normal (predictable nav, natural scroll).
3. No required discovery: resume, links, contact never hide behind a feature.
4. Fast beats flashy: simplify anything that drops frames on a mid-range phone.
5. Respect user settings: `prefers-reduced-motion`, visible mute control, no autoplaying sound.

## 6. Quality bar (checked before every merge)

- Lighthouse 90+ for performance and accessibility; LCP under 2.5s
- Keyboard navigable, contrast passes, alt text, semantic HTML
- Tested at 375 / 768 / 1280 / 1920px and on a real phone
- 60fps scroll and animation; 44px minimum touch targets
- Reduced motion calms animations; nothing autoplays; mute control present

## 7. Git workflow (working agreement)

- `main` is always deployable. After Phase 0, never commit directly to it.
- One branch per task: `feature/<name>`, `fix/<name>`, `chore/<name>`.
- Small commits, imperative messages (`Add hero section markup`).
- Every branch merges via pull request (summary + quality checklist in the description).
- Delete merged branches; tag milestones (`v0.1`, `v0.2`, ... `v1.0`).
- Don't commit large raw audio/video; compress first.
- **Because this is a learning project:** explain each git command briefly when we run it, and say why.

## 8. Phases and status

Do in order; don't start the next until "Done when" is met.

| #   | Phase                              | Branch                                         | Status      |
| --- | ---------------------------------- | ---------------------------------------------- | ----------- |
| 0   | Setup and Git Foundations          | `main`, `chore/setup`                          | **Next up** |
| 1   | Design Spec and Visual Foundation  | `feature/design-system`                        | Not started |
| 2   | Layout Shell and Navigation        | `feature/layout-shell`                         | Not started |
| 3   | Core Content (static)              | one per section                                | Not started |
| 4   | Motion Layer                       | `feature/motion`                               | Not started |
| 5   | Skills Mixing Board                | `feature/skills-mixer`                         | Not started |
| 6   | Career/Education DAW Timeline      | `feature/career-timeline`                      | Not started |
| 7   | Hero Pad / Keyboard                | `feature/hero-pad`                             | Not started |
| 8   | Music Page                         | `feature/music-page`, `-embeds`, `-visualizer` | Not started |
| 9   | Cursor-Reactive Background         | `feature/background`                           | Not started |
| 10  | Hidden Terminal                    | `feature/terminal`                             | Not started |
| 11  | Polish, Performance, Accessibility | `chore/polish`                                 | Not started |
| 12  | Launch and Maintenance             | `chore/launch`                                 | Not started |

### Phase 0 checklist (current)

- [ ] Install Node.js, Git, VS Code (with Astro extension)
- [ ] Create GitHub repo; configure git name and email
- [ ] Scaffold Astro project; first commit; push
- [ ] Add `.gitignore` and basic `README.md`
- [ ] Add `PLAN.md` (and these notes) to the repo
- [ ] Set up Prettier and ESLint
- [ ] GitHub Actions workflow to build and deploy to GitHub Pages

**Done when:** a blank Astro site is live at `yourusername.github.io` (or repo URL) and pushing to `main` redeploys it.

## 9. Inputs still needed from me

| Item                                                                                           | Needed by |
| ---------------------------------------------------------------------------------------------- | --------- |
| Accent color(s), artist name/brand, reference sites                                            | Phase 1   |
| Headshot and studio photos                                                                     | Phase 3   |
| Project details, screenshots, repo + live links (3-4 projects, incl. 1-2 AI/ML and 1-2 design) | Phase 3   |
| Career and education details, resume PDF                                                       | Phase 3   |
| Skills list with honest proficiency levels                                                     | Phase 5   |
| Logic Pro sample exports for the pad (8-16, compressed)                                        | Phase 7   |
| Music story, milestones, album art, Spotify + Apple Music links                                | Phase 8   |
| Featured track audio (self-hosted, rights cleared)                                             | Phase 8   |

## 10. Pitfalls to avoid

- Too many fonts, colors, or animation styles
- Heavy effects hurting performance or readability
- Placeholder or low-res images on the live site
- Inconsistent spacing/alignment
- Novel features hiding key information
- Adding all six interactive features before content and foundation are solid
- Committing large raw audio/video to git

## 11. Optional future additions

In-browser AI/ML demo (Transformers.js or Hugging Face Space), Formspree contact form, blog/build notes, TypeScript migration, WebGL background, light/dark toggle.

## 12. Decisions log

| Date       | Decision                                                                         |
| ---------- | -------------------------------------------------------------------------------- |
| 2026-10-27 | Plan finalized in `PLAN.md`; starting at Phase 0. Context captured in this file. |

_Update the status table and decisions log as each phase completes._
