// The hero pad: buttons, keyboard keys, and the sound on/volume controls.
// The sound itself lives in audio.js.

import { engine } from "./audio.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function flash(key) {
  const flashEl = key.querySelector(".flash");
  const ring = key.querySelector(".ripple");
  flashEl.animate([{ opacity: 0.5 }, { opacity: 0 }], {
    duration: 380,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });
  if (!reduceMotion.matches) {
    ring.animate(
      [
        { transform: "scale(0.3)", opacity: 0.8 },
        { transform: "scale(1.5)", opacity: 0 },
      ],
      { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  }
}

function hit(key) {
  key.setAttribute("data-down", "");
  flash(key);
  engine.trigger(key.dataset.padId);
}

function release(key) {
  key.removeAttribute("data-down");
}

function setup(root) {
  root.setAttribute("data-ready", "");

  const soundBtn = root.querySelector("[data-sound]");
  const volume = root.querySelector("[data-volume]");
  const status = root.querySelector("[data-status]");
  const keys = [...root.querySelectorAll("[data-pad-id]")];
  let announce = false;

  keys.forEach((key) => {
    key.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      hit(key);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((type) =>
      key.addEventListener(type, () => {
        release(key);
        engine.unlock();
      }),
    );

    // Space and Enter on a focused pad
    key.addEventListener("keydown", (e) => {
      if ((e.key !== " " && e.key !== "Enter") || e.repeat) return;
      e.preventDefault();
      hit(key);
    });
    key.addEventListener("keyup", () => release(key));
    key.addEventListener("blur", () => release(key));
  });

  // Start preparing the sounds once the visitor shows interest
  const warm = () => engine.prime();
  ["pointerenter", "focusin", "touchstart"].forEach((type) =>
    root.addEventListener(type, warm, { once: true, passive: true }),
  );

  soundBtn.addEventListener("click", () => {
    announce = true;
    engine.toggle();
  });
  volume.addEventListener("input", () => engine.setVolume(volume.value / 100));

  const sync = () => {
    if (!root.isConnected) {
      off();
      return;
    }
    const on = engine.enabled;
    soundBtn.setAttribute("aria-pressed", String(on));
    soundBtn.textContent = on ? "Sound on" : "Tap to enable sound";
    volume.disabled = !on;
    volume.value = Math.round(engine.volume * 100);
    if (announce) status.textContent = on ? "Sound on" : "Sound off";
  };
  const off = engine.subscribe(sync);

  if (!engine.supported) {
    soundBtn.disabled = true;
    soundBtn.textContent = "Sound isn't supported in this browser";
  }
  sync();
}

// Keyboard keys play the pads, but only after sound has been turned on
const padFor = (e) =>
  document.querySelector(`[data-pad-id][data-key="${e.key.toLowerCase()}"]`);

document.addEventListener("keydown", (e) => {
  if (!engine.enabled || e.repeat) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target;
  if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
    return;
  const key = padFor(e);
  if (key) hit(key);
});
document.addEventListener("keyup", (e) => {
  const key = padFor(e);
  if (key) release(key);
});

function init() {
  document.querySelectorAll("[data-pad]:not([data-ready])").forEach(setup);
}

document.addEventListener("astro:page-load", init);
if (document.readyState !== "loading") init();
