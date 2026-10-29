# Personal Portfolio Website: Final Plan

A premium, interactive portfolio site covering software and design (AI/ML focus) plus a music production page. Built as a beginner project to learn git and GitHub.

---

## 1. Project Overview

**Goal:** A fast, sleek, "expensive-feeling" site that clearly shows who I am, what I build, and my music, with a few memorable interactive features.

**Audience:** Recruiters, hiring managers, collaborators, and music listeners.

**Success test:** A first-time visitor understands who I am and finds Projects, Resume, and Music within 5 seconds, even if they never touch the interactive features.

### Pages and sections

| Page | Sections |
|---|---|
| `index.astro` (main) | Intro (hero), About, Projects, Career, Education, Skills, Resume, GitHub and LinkedIn links, Contact |
| `music.astro` | Production journey timeline, featured track, Spotify and Apple Music embeds, profile links, audio visualizer |

### Interactive features (one home each)

| Feature | Location |
|---|---|
| Playable pad/keyboard | Hero, main page |
| Skills as a mixing board | Skills section |
| Career timeline as DAW tracks | Career and Education section |
| Audio visualizer | Music page, tied to featured track |
| Cursor-reactive background | Site-wide, subtle |
| Hidden terminal | Easter egg (keyboard shortcut or `>_` icon) |

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Astro (static output) |
| Language | JavaScript (TypeScript optional later) |
| Styling | Plain CSS with variables (design tokens) |
| Scroll and animation | Lenis (smooth scroll) + GSAP (ScrollTrigger, timelines) |
| Pad and sounds | Web Audio API, samples exported from Logic Pro |
| Visualizer | Web Audio `AnalyserNode` + Canvas 2D |
| Background | Canvas 2D (WebGL only if needed later) |
| Mixer, timeline, terminal | Vanilla JS with pointer events |
| Fonts | Fontsource (self-hosted) |
| Icons | Lucide or Phosphor (pick one) |
| Music embeds | Spotify and Apple Music iframes, lazy-loaded |
| Hosting and CI | GitHub Pages + GitHub Actions |
| Tooling | Git, GitHub, Figma, VS Code, Prettier, ESLint, Lighthouse |

**Fallback:** If Astro feels like too much at the start, use plain HTML/CSS/JS with the same libraries and migrate later.

---

## 3. Design Principles

**Visual style (shared by both pages):** "Studio meets software." Dark, layered, Logic Pro inspired.

- **Color:** Near-black background (e.g. `#0A0A0B`), off-white text, one main accent (a second used sparingly). Layered surfaces, 1px low-opacity borders, soft glows.
- **Type:** One display font, one body font, one mono font. Large confident headings with tight tracking; calm body text at 16-18px, line-height ~1.6, lines 60-75 characters.
- **Spacing:** Multiples of 4 or 8px, generous whitespace, consistent grid and max content width.
- **Motion:** Purposeful. Easing like `cubic-bezier(0.16, 1, 0.3, 1)`, durations 200-600ms, animate only `transform` and `opacity`.
- **Details:** Hover and active states on everything clickable, custom focus rings, subtle grain texture, custom favicon and Open Graph image, designed 404 page.
- **Imagery:** Real project screenshots, studio photos, album art. No placeholder images on the live site.

**Rules that keep it fancy and usable:**

1. Content first, effects second. Everything important works without JavaScript or without touching the toys.
2. Normal behavior stays normal: predictable nav, natural-feeling scroll.
3. No required discovery: resume, links, and contact never hide behind a feature.
4. Fast beats flashy: simplify any effect that drops frames on a mid-range phone.
5. Respect user settings: `prefers-reduced-motion`, a visible mute control, no autoplaying sound.

---

## 4. Quality Standards (checked before every merge)

| Standard | Target |
|---|---|
| Performance | Lighthouse 90+; Largest Contentful Paint under 2.5s |
| Accessibility | Lighthouse 90+; keyboard navigable; contrast passes; alt text; semantic HTML |
| Responsive | Tested at 375px, 768px, 1280px, 1920px and on a real phone |
| Smoothness | 60fps while scrolling and animating |
| Touch targets | 44px minimum |
| Reduced motion | Animations calm down; site still fully usable |
| Sound | Nothing autoplays; mute control present; volumes balanced |

---

## 5. Git Workflow

- `main` is always deployable. Never commit directly to it after Phase 0.
- One branch per task: `feature/<name>`, `fix/<name>`, `chore/<name>`.
- Small commits with clear messages in the imperative: `Add hero section markup`.
- Every branch merges through a pull request, even as the only contributor. Use the PR description to summarize what changed and tick the quality checklist.
- Delete merged branches. Tag milestones (`v0.1`, `v0.2` ...).

---

## 6. Development Phases

Each phase ends with something working and merged. Do them in order, and don't start the next until the current "Done when" list is met.

### Phase 0: Setup and Git Foundations
**Branch:** `main` (initial commit), then `chore/setup`
**Git skills:** `init`, `add`, `commit`, remote, `push`, `.gitignore`, README

- [ ] Install Node.js, Git, VS Code (with Astro extension)
- [ ] Create GitHub repo and configure git name and email
- [ ] Scaffold the Astro project; first commit; push to GitHub
- [ ] Add `.gitignore` and a basic `README.md`
- [ ] Add this `PLAN.md` to the repo
- [ ] Set up Prettier and ESLint
- [ ] Add GitHub Actions workflow to build and deploy to GitHub Pages

**Done when:** A blank Astro site is live at `yourusername.github.io` (or the repo URL), and pushing to `main` redeploys it.

### Phase 1: Design Spec and Visual Foundation
**Branch:** `feature/design-system`
**Git skills:** branching, pull requests, merging

- [ ] Collect 5-10 reference sites and note what you like about each (font, spacing, hover, motion)
- [ ] Write a design spec: palette, fonts, spacing scale, radii, shadows, motion timings
- [ ] Mock up the hero, nav, and one section in Figma
- [ ] Create `tokens.css` with all design tokens as CSS variables
- [ ] Install and configure self-hosted fonts and the icon set
- [ ] Build base styles (reset, typography, buttons, links, focus rings, grain texture)

**Done when:** A style guide page (or section) shows every token, text style, and button state, and it looks right on desktop and mobile.

### Phase 2: Layout Shell and Navigation
**Branch:** `feature/layout-shell`

- [ ] Create `Layout.astro` with shared head, meta tags, favicon, Open Graph image
- [ ] Build the sticky nav (Home, About, Projects, Career, Education, Skills, Music) with active-section highlighting
- [ ] Build the mobile menu (touch-friendly, keyboard accessible)
- [ ] Build the footer with GitHub, LinkedIn, and email links
- [ ] Create empty `index.astro` and `music.astro` using the layout
- [ ] Add Astro view transitions between pages
- [ ] Add a designed 404 page

**Done when:** Both pages exist, nav works on all screen sizes, and moving between pages feels smooth.

### Phase 3: Core Content (Static, No Effects Yet)
**Branches:** one per section (`feature/hero`, `feature/about`, `feature/projects`, `feature/career-education`, `feature/skills-static`, `feature/resume-contact`)

- [ ] Hero: name, one-line value statement, resume button, social links
- [ ] About: short, specific, personal
- [ ] Projects: 3-4 cards (include at least 1-2 AI/ML projects and 1-2 design pieces), each with description, tools, repo link, and live link; use real screenshots
- [ ] Career: roles, dates, and impact-focused bullets
- [ ] Education: schools, degrees, relevant coursework or achievements
- [ ] Skills: grouped list (Languages, ML/AI, Design, Tools, Music), static for now
- [ ] Resume: download button in hero and near the bottom (PDF)
- [ ] Contact: email and social links

**Done when:** The full main page reads clearly and completely with zero animation. Content is final-quality, with no placeholder text or images.

### Phase 4: Motion Layer
**Branch:** `feature/motion`

- [ ] Add Lenis smooth scrolling, tuned so it feels natural
- [ ] Add GSAP ScrollTrigger entrance animations for every section
- [ ] Add hover, active, and focus micro-interactions (card lift, button glow, link underlines)
- [ ] Add an optional short intro or loading moment (skippable)
- [ ] Wire up `prefers-reduced-motion` to tone everything down

**Done when:** Scrolling feels smooth at 60fps, every section has an entrance, and reduced-motion users get a calm version.

### Phase 5: Skills Mixing Board
**Branch:** `feature/skills-mixer`

- [ ] Design the channel-strip UI (fader, level meter, label, LED) in Figma first
- [ ] Build faders with pointer events (mouse, touch, and keyboard arrow support)
- [ ] Each fader maps to a skill and its proficiency; animate meters on scroll-in
- [ ] Add subtle sound or haptic-style feedback (optional, muted by default)
- [ ] Provide a plain-text list fallback for screen readers and no-JS

**Done when:** Faders drag smoothly on desktop and phone, are keyboard accessible, and the skills remain readable if the mixer fails to load.

### Phase 6: Career and Education DAW Timeline
**Branch:** `feature/career-timeline`

- [ ] Design the track-lane layout: each role or school is a clip on a timeline
- [ ] Build horizontal scroll or drag with a playhead
- [ ] Clicking a clip reveals details (role, dates, highlights)
- [ ] Make it work on touch devices; fall back to a vertical list on small screens if needed
- [ ] Ensure the same information is available in accessible, linear markup

**Done when:** The timeline is smooth, readable, and every detail is reachable by keyboard and on mobile.

### Phase 7: Hero Pad / Keyboard
**Branch:** `feature/hero-pad`

- [ ] Export 8-16 short, well-mixed samples from Logic Pro (kicks, snares, hats, chords, vocal chops)
- [ ] Compress audio files (small file sizes) and lazy-load them after first interaction
- [ ] Build the pad grid with Web Audio API; map to keyboard keys and touch
- [ ] Add visual feedback on hit (glow, ripple) with sub-100ms response
- [ ] Add a clear mute/volume control and a "tap to enable sound" prompt
- [ ] Keep sound off by default; handle browsers' autoplay rules

**Done when:** Pads trigger instantly on click, tap, and keyboard, nothing plays without user action, and the hero still communicates my intro clearly.

### Phase 8: Music Page
**Branches:** `feature/music-page`, `feature/music-embeds`, `feature/visualizer`

- [ ] Write the production journey: when I started, Logic Pro, genres (hip-hop, R&B, pop), milestones
- [ ] Build the journey timeline (first beat, first release, gear upgrades, collaborations)
- [ ] Add featured track section with album art
- [ ] Add Spotify and Apple Music embeds (lazy-loaded) plus large, prominent "Listen" and "Follow" buttons to my artist profiles
- [ ] Build the audio visualizer (`AnalyserNode` + canvas) driven by a self-hosted featured track
- [ ] Add play/pause and mute controls; handle mobile performance with a lighter visual
- [ ] Check Spotify for Artists and Apple Music for Artists to see how embed plays appear in stats

**Done when:** The page feels atmospheric but matches the main site's style, embeds load without slowing the page, and the visualizer runs smoothly.

### Phase 9: Cursor-Reactive Background
**Branch:** `feature/background`

- [ ] Build a lightweight canvas animation (particles or shapes) that reacts to the cursor
- [ ] Pause it when the tab is hidden or when reduced motion is on
- [ ] Reduce particle count or disable on mobile and low-power devices
- [ ] Ensure text contrast stays strong over the background

**Done when:** The background adds depth without hurting readability or frame rate.

### Phase 10: Hidden Terminal
**Branch:** `feature/terminal`

- [ ] Build a terminal overlay opened by a shortcut (e.g. `` ` `` or `Ctrl+K`) and a small `>_` icon
- [ ] Implement a command parser: `help`, `about`, `projects`, `skills`, `music`, `resume`, `github`, `linkedin`, `contact`, `clear`
- [ ] Commands navigate or open links; add a couple of playful easter eggs
- [ ] Support history (up arrow), tab completion, and Escape to close
- [ ] Style it in the site's mono font and tokens

**Done when:** It's fun, polished, accessible via keyboard, and never the only route to anything.

### Phase 11: Polish, Performance, and Accessibility Pass
**Branch:** `chore/polish`

- [ ] Run Lighthouse on both pages; fix anything under 90
- [ ] Optimize images (WebP/AVIF), fonts, and audio; lazy-load below the fold
- [ ] Full keyboard-only walkthrough; screen reader spot check
- [ ] Test on real phones and at all breakpoints
- [ ] Verify reduced-motion behavior and sound defaults
- [ ] Proofread all copy; check all links; confirm no placeholder content remains
- [ ] Add page titles, meta descriptions, and Open Graph/Twitter cards
- [ ] Ask 3-5 people for feedback; cut anything that doesn't earn its place

**Done when:** Every quality standard in section 4 passes.

### Phase 12: Launch and Maintenance
**Branch:** `chore/launch`

- [ ] Final review of the README (screenshots, tech stack, how to run locally)
- [ ] Tag `v1.0`
- [ ] (Optional) Buy and connect a custom domain
- [ ] (Optional) Add privacy-friendly analytics (Plausible or Umami)
- [ ] Share the site; add it to GitHub profile, LinkedIn, and resume

**Done when:** The site is live, shareable, and linked from my profiles.

---

## 7. Optional Future Additions

- In-browser AI/ML demo (Transformers.js) or an embedded Hugging Face Space as a centerpiece project
- Contact form through Formspree
- Blog or build notes section
- Migration to TypeScript
- WebGL background (OGL or Three.js)
- Dark/light theme toggle

---

## 8. Inputs I Need to Gather

| Item | Needed by |
|---|---|
| Accent color(s), artist name or brand, reference sites | Phase 1 |
| Headshot and studio photos | Phase 3 |
| Project details, screenshots, repo and live links | Phase 3 |
| Career and education details, resume PDF | Phase 3 |
| Skills list with honest proficiency levels | Phase 5 |
| Logic Pro sample exports for the pad | Phase 7 |
| Music story, milestones, album art, Spotify and Apple Music links | Phase 8 |
| Featured track audio file for the visualizer (self-hosted, with rights to use it) | Phase 8 |

---

## 9. Pitfalls to Avoid

- Too many fonts, colors, or animation styles
- Heavy effects that hurt performance or readability
- Placeholder or low-resolution images on the live site
- Inconsistent spacing and alignment
- Novel features that hide key information
- Adding all six interactive features before the content and foundation are solid
- Committing large raw audio or video files to git (compress them; consider Git LFS only if truly necessary)

---

## 10. Progress Tracker

| Phase | Status |
|---|---|
| 0. Setup and Git Foundations | Not started |
| 1. Design Spec and Visual Foundation | Not started |
| 2. Layout Shell and Navigation | Not started |
| 3. Core Content | Not started |
| 4. Motion Layer | Not started |
| 5. Skills Mixing Board | Not started |
| 6. Career and Education DAW Timeline | Not started |
| 7. Hero Pad / Keyboard | Not started |
| 8. Music Page | Not started |
| 9. Cursor-Reactive Background | Not started |
| 10. Hidden Terminal | Not started |
| 11. Polish, Performance, Accessibility | Not started |
| 12. Launch and Maintenance | Not started |
