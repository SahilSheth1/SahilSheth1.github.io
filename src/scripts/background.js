// Cursor-reactive background: a quiet grid of dots (like a DAW grid) that
// pushes away from the cursor and glows amber near it. Clicking sends out a
// small wave. While music plays, the whole grid brightens with the volume.
//
// It only draws while something is moving, so a still page costs nothing.
// It is switched to a static grid for reduced motion, touch screens and
// low-power devices, and stops when the tab is hidden.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarse = window.matchMedia("(pointer: coarse)");
const root = document.documentElement;

// Everything you might want to tune
const SETTINGS = {
  spacing: 44, // px between dots
  maxDots: 1400, // spacing grows on huge screens to stay under this
  radius: 150, // how far the cursor reaches
  push: 16, // how far dots slide away (px)
  baseAlpha: 0.1, // resting dot brightness
  glowAlpha: 0.07, // soft light under the cursor
  spring: 0.1,
  damping: 0.8,
};

// Phones, small laptops and anyone who asked for less motion get a still grid
const isLight = () =>
  reduceMotion.matches ||
  coarse.matches ||
  (navigator.hardwareConcurrency || 8) <= 2 ||
  (navigator.deviceMemory || 8) <= 2;

let current = null;

function create() {
  current?.destroy();

  const canvas = document.createElement("canvas");
  canvas.className = "bg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  // Styled here instead of in a stylesheet: page transitions swap stylesheets,
  // and without these the canvas would drop into the page and push it down.
  canvas.style.cssText =
    "position:fixed;inset:0;z-index:-1;width:100%;height:100%;pointer-events:none;";
  document.body.prepend(canvas);
  const g = canvas.getContext("2d");

  const css = getComputedStyle(root);
  const amber = css.getPropertyValue("--accent").trim() || "#ff9f1c";

  let dots = [];
  let width = 0;
  let height = 0;
  let spacing = SETTINGS.spacing;
  let raf = 0;
  let still = isLight();
  const cursor = { x: -9999, y: -9999, on: false };
  let waves = []; // click ripples: { x, y, t }

  function build() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    spacing = Math.max(
      still ? SETTINGS.spacing * 1.4 : SETTINGS.spacing,
      Math.sqrt((width * height) / SETTINGS.maxDots),
    );
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;
    const x0 = (width - (cols - 1) * spacing) / 2;
    const y0 = (height - (rows - 1) * spacing) / 2;

    dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          hx: x0 + c * spacing,
          hy: y0 + r * spacing,
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
          t: 0,
        });
      }
    }
    draw(0);
  }

  // How loud the music is right now (0 to 1), from the nav dot's variable
  function audioLevel() {
    if (root.getAttribute("data-audio") !== "playing") return 0;
    const v = document
      .querySelector(".brand")
      ?.style.getPropertyValue("--audio-level");
    return Math.min(1, parseFloat(v) || 0);
  }

  function draw(level) {
    g.clearRect(0, 0, width, height);

    if (cursor.on && !still) {
      const glow = g.createRadialGradient(
        cursor.x,
        cursor.y,
        0,
        cursor.x,
        cursor.y,
        SETTINGS.radius * 1.8,
      );
      glow.addColorStop(0, `rgba(255, 159, 28, ${SETTINGS.glowAlpha})`);
      glow.addColorStop(1, "rgba(255, 159, 28, 0)");
      g.fillStyle = glow;
      g.fillRect(0, 0, width, height);
    }

    // Resting dots, all in one colour
    g.fillStyle = `rgba(237, 234, 228, ${SETTINGS.baseAlpha + level * 0.1})`;
    for (const d of dots) {
      if (d.t < 0.02) g.fillRect(d.hx + d.ox - 1, d.hy + d.oy - 1, 2, 2);
    }

    // Dots near the cursor: bigger and amber
    g.fillStyle = amber;
    for (const d of dots) {
      if (d.t < 0.02) continue;
      g.globalAlpha = Math.min(1, 0.15 + d.t * 0.85);
      const size = 2 + d.t * 2.4;
      g.fillRect(d.hx + d.ox - size / 2, d.hy + d.oy - size / 2, size, size);
    }
    g.globalAlpha = 1;
  }

  function step() {
    raf = 0;
    if (document.hidden) return;

    const { radius, push, spring, damping } = SETTINGS;
    const now = performance.now();
    waves = waves.filter((w) => now - w.t < 700);
    let moving = waves.length > 0;

    for (const d of dots) {
      let tx = 0;
      let ty = 0;
      let heat = 0;

      if (cursor.on) {
        const dx = d.hx - cursor.x;
        const dy = d.hy - cursor.y;
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          const f = 1 - dist / radius;
          heat = f * f;
          const k = (heat * push) / (dist || 1);
          tx += dx * k;
          ty += dy * k;
        }
      }

      // Click ripples travel outward as a ring
      for (const w of waves) {
        const age = (now - w.t) / 700;
        const ring = age * 320;
        const dx = d.hx - w.x;
        const dy = d.hy - w.y;
        const dist = Math.hypot(dx, dy);
        const near = 1 - Math.min(1, Math.abs(dist - ring) / 46);
        if (near > 0) {
          const k = (near * (1 - age) * 14) / (dist || 1);
          tx += dx * k;
          ty += dy * k;
          heat = Math.max(heat, near * (1 - age));
        }
      }

      d.vx = (d.vx + (tx - d.ox) * spring) * damping;
      d.vy = (d.vy + (ty - d.oy) * spring) * damping;
      d.ox += d.vx;
      d.oy += d.vy;
      d.t += (heat - d.t) * 0.2;

      // Keep going only while something is still travelling or fading. A
      // resting cursor over a settled grid costs nothing.
      if (
        Math.abs(d.vx) + Math.abs(d.vy) > 0.02 ||
        Math.abs(tx - d.ox) + Math.abs(ty - d.oy) > 0.05 ||
        Math.abs(heat - d.t) > 0.01
      ) {
        moving = true;
      }
    }

    const level = audioLevel();
    draw(level);
    if (moving || level > 0 || root.getAttribute("data-audio") === "playing") {
      raf = requestAnimationFrame(step);
    }
  }

  const kick = () => {
    if (!raf && !still) raf = requestAnimationFrame(step);
  };

  // ---- Input ----
  const onMove = (e) => {
    if (still || e.pointerType === "touch") return;
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    cursor.on = true;
    kick();
  };
  const onLeave = (e) => {
    if (e.relatedTarget) return;
    cursor.on = false;
    kick();
  };
  const onDown = (e) => {
    if (still || e.pointerType === "touch" || e.button !== 0) return;
    waves.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    kick();
  };
  const onVisible = () => {
    if (!document.hidden) kick();
  };
  const onResize = () => {
    still = isLight();
    build();
    kick();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("mouseout", onLeave);
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisible);
  reduceMotion.addEventListener("change", onResize);

  // Music started: wake up so the grid can pulse with it
  const watch = new MutationObserver(kick);
  watch.observe(root, { attributes: true, attributeFilter: ["data-audio"] });

  build();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      watch.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisible);
      reduceMotion.removeEventListener("change", onResize);
      canvas.remove();
    },
  };
}

// A page transition replaces the whole body, so the canvas is rebuilt each time
document.addEventListener("astro:before-swap", () => {
  current?.destroy();
  current = null;
});
document.addEventListener("astro:page-load", () => {
  current = create();
});
if (document.readyState !== "loading" && !current) current = create();
