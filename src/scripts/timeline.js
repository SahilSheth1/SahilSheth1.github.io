// Career timeline: drag the playhead, scroll sideways, pick a clip for details.
// The plain list (see Career.astro) is always in the page. This script only
// shows the timeline on wide screens and folds the list away.

import gsap from "gsap";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const wide = window.matchMedia("(min-width: 48rem)");

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const roots = [];

function setup(root) {
  root.setAttribute("data-ready", "");

  const viewport = root.querySelector("[data-viewport]");
  const canvas = root.querySelector("[data-canvas]");
  const ruler = root.querySelector("[data-ruler]");
  const handle = root.querySelector("[data-handle]");
  const flag = root.querySelector("[data-flag]");
  const readout = root.querySelector("[data-readout]");
  const linear = root.querySelector("[data-linear]");
  const details = [...root.querySelectorAll("[data-detail]")];
  const clips = [...root.querySelectorAll("[data-clip]")].map((el) => ({
    el,
    id: el.dataset.id,
    name: el.dataset.name,
    start: Number(el.dataset.start),
    end: Number(el.dataset.end),
    mid: Number(el.dataset.mid),
    lane: el.closest("[data-lane]"),
  }));

  const [y0, m0] = canvas.dataset.start.split("-").map(Number);
  const total = Number(canvas.dataset.total);
  const nowAt = Number(canvas.dataset.nowAt);
  const state = { p: nowAt };

  // Width of one month in pixels (the scale is set in CSS)
  const monthPx = () => canvas.getBoundingClientRect().width / total;

  function dateOf(p) {
    const month = Math.floor(p);
    const abs = y0 * 12 + (m0 - 1) + month;
    return `${MONTHS[abs % 12]} ${Math.floor(abs / 12)}`;
  }

  function render() {
    const p = clamp(state.p, 0, nowAt);
    canvas.style.setProperty("--p", p.toFixed(3));

    const label = dateOf(p);
    flag.textContent = label;

    const under = clips.filter(
      (c) => !c.el.classList.contains("marker") && c.start <= p && p < c.end,
    );
    clips.forEach((c) => {
      if (under.includes(c)) c.el.setAttribute("data-under", "");
      else c.el.removeAttribute("data-under");
    });

    const names = under.map((c) => c.name).join(", ");
    readout.textContent = names ? `${label}: ${names}` : label;
    handle.setAttribute("aria-valuenow", Math.round(p));
    handle.setAttribute("aria-valuetext", names ? `${label}. ${names}` : label);
  }

  function movePlayhead(p, animate) {
    gsap.killTweensOf(state);
    const target = clamp(p, 0, nowAt);
    if (!animate || reduceMotion.matches) {
      state.p = target;
      render();
      return;
    }
    gsap.to(state, {
      p: target,
      duration: 0.6,
      ease: "expo.out",
      onUpdate: render,
    });
  }

  function scrollToMonth(at, animate) {
    const left = at * monthPx() - viewport.clientWidth / 2;
    viewport.scrollTo({
      left,
      behavior: animate && !reduceMotion.matches ? "smooth" : "auto",
    });
  }

  // ---- Selecting a clip ----
  function select(clip, { move = true } = {}) {
    clips.forEach((c) => c.el.setAttribute("aria-pressed", String(c === clip)));
    details.forEach((d) => {
      d.hidden = d.dataset.detail !== clip.id;
    });
    if (move) {
      movePlayhead(clip.mid, true);
      scrollToMonth(clip.mid, true);
    }
  }

  clips.forEach((c) => {
    c.el.addEventListener("click", () => select(c));

    // Arrow keys hop between clips: left and right along a lane, up and down across lanes
    c.el.addEventListener("keydown", (e) => {
      const lanes = [...root.querySelectorAll("[data-lane]")];
      const here = lanes.indexOf(c.lane);
      let next;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const sibs = clips
          .filter((o) => o.lane === c.lane)
          .sort((a, b) => a.mid - b.mid);
        next = sibs[sibs.indexOf(c) + (e.key === "ArrowRight" ? 1 : -1)];
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const lane = lanes[here + (e.key === "ArrowDown" ? 1 : -1)];
        const pool = clips.filter((o) => o.lane === lane);
        next = pool.sort(
          (a, b) => Math.abs(a.mid - c.mid) - Math.abs(b.mid - c.mid),
        )[0];
      } else return;
      if (!next) return;
      e.preventDefault();
      next.el.focus({ preventScroll: true });
      next.el.scrollIntoView({ inline: "nearest", block: "nearest" });
    });
  });

  details.forEach((d) => {
    const more = d.querySelector("[data-more]");
    if (!more) return;
    more.addEventListener("click", () => {
      d.querySelectorAll("[data-extra]").forEach((li) => (li.hidden = false));
      more.remove();
    });
  });

  // ---- Playhead: drag it, click the ruler, or use the arrow keys ----
  const pFromPointer = (e) =>
    (e.clientX - canvas.getBoundingClientRect().left) / monthPx();
  let dragId = null;

  [ruler, handle].forEach((el) => {
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      gsap.killTweensOf(state);
      dragId = e.pointerId;
      el.setPointerCapture(e.pointerId);
      state.p = clamp(pFromPointer(e), 0, nowAt);
      render();
    });

    el.addEventListener("pointermove", (e) => {
      if (e.pointerId !== dragId) return;
      state.p = clamp(pFromPointer(e), 0, nowAt);
      render();
      // Nudge the view when the playhead reaches an edge
      const rect = viewport.getBoundingClientRect();
      if (e.clientX > rect.right - 48) viewport.scrollLeft += 14;
      else if (e.clientX < rect.left + 48) viewport.scrollLeft -= 14;
    });

    const endDrag = (e) => {
      if (e.pointerId === dragId) dragId = null;
    };
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
  });

  handle.addEventListener("keydown", (e) => {
    const steps = {
      ArrowRight: 1,
      ArrowUp: 1,
      ArrowLeft: -1,
      ArrowDown: -1,
      PageUp: 12,
      PageDown: -12,
    };
    let next;
    if (e.key in steps) next = Math.round(state.p) + steps[e.key];
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = nowAt;
    else return;
    e.preventDefault();
    movePlayhead(next, false);
    const x = state.p * monthPx();
    if (
      x < viewport.scrollLeft + 40 ||
      x > viewport.scrollLeft + viewport.clientWidth - 40
    ) {
      scrollToMonth(state.p, false);
    }
  });

  // ---- Scrolling the timeline ----
  // Mouse: drag empty space to pan. Touch and trackpad already scroll natively.
  let pan = null;
  viewport.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if (e.target.closest("[data-clip], [data-ruler], [data-handle]")) return;
    pan = { id: e.pointerId, x: e.clientX, left: viewport.scrollLeft };
    viewport.setPointerCapture(e.pointerId);
    viewport.setAttribute("data-dragging", "");
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!pan || e.pointerId !== pan.id) return;
    viewport.scrollLeft = pan.left - (e.clientX - pan.x);
  });
  const endPan = (e) => {
    if (!pan || e.pointerId !== pan.id) return;
    pan = null;
    viewport.removeAttribute("data-dragging");
  };
  viewport.addEventListener("pointerup", endPan);
  viewport.addEventListener("pointercancel", endPan);

  root.querySelector("[data-now]").addEventListener("click", () => {
    movePlayhead(nowAt, true);
    scrollToMonth(nowAt, true);
  });

  // ---- Start state ----
  const first =
    clips.find((c) => c.el.hasAttribute("data-default")) || clips[0];
  select(first, { move: false });
  render();

  const sync = () => {
    // Wide: timeline shows, the list folds away. Narrow: the list is the timeline.
    linear.open = !wide.matches;
    if (wide.matches) viewport.scrollLeft = viewport.scrollWidth;
  };
  root.sync = sync;
  sync();
  roots.push(root);
}

function init() {
  document.querySelectorAll("[data-career]:not([data-ready])").forEach(setup);
}

wide.addEventListener("change", () => {
  roots.filter((r) => r.isConnected).forEach((r) => r.sync());
});

document.addEventListener("astro:page-load", init);
if (document.readyState !== "loading") init();
