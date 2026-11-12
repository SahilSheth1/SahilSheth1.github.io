// Audio visualizer for a track hosted on this site.
// The page has a normal <audio controls> player. This script swaps it for a
// custom one (play, seek, mute) with a frequency display drawn from the
// Web Audio API's AnalyserNode. If it never runs, the plain player still works.

import { pulse } from "./pulse.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const instances = [];

// Phones, small laptops, and anyone who asked for less motion get a lighter version
const isLight = () =>
  reduceMotion.matches ||
  window.matchMedia("(pointer: coarse)").matches ||
  (navigator.hardwareConcurrency || 8) <= 4;

const fmt = (s) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

function setup(root) {
  const audio = root.querySelector("[data-audio-el]");
  const canvas = root.querySelector("[data-canvas]");
  const playBtn = root.querySelector("[data-play]");
  const muteBtn = root.querySelector("[data-mute]");
  const scrub = root.querySelector("[data-scrub]");
  const time = root.querySelector("[data-time]");
  const status = root.querySelector("[data-status]");
  const title = root.dataset.title;

  audio.controls = false;
  root.setAttribute("data-ready", "");

  const g = canvas.getContext("2d");
  const css = getComputedStyle(document.documentElement);
  const colors = {
    bar: css.getPropertyValue("--accent").trim() || "#ff9f1c",
    peak: css.getPropertyValue("--secondary").trim() || "#3ddbc4",
    base:
      css.getPropertyValue("--border-strong").trim() ||
      "rgba(255,255,255,0.16)",
  };

  let ctx = null;
  let gain = null;
  let muted = false;
  let analyser = null;
  let bins = null;
  let ranges = [];
  let values = [];
  let peaks = [];
  let bars = 0;
  let width = 0;
  let height = 0;
  let raf = 0;
  let last = 0;
  let onScreen = true;
  let seeking = false;

  // ---- Canvas sizing and the bar layout ----
  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, isLight() ? 1.5 : 2);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    bars = isLight() ? 32 : width > 700 ? 96 : 64;
    values = new Array(bars).fill(0);
    peaks = new Array(bars).fill(0);
    mapBins();
    draw();
  }

  // Spread the bars evenly by pitch (log scale), not by raw frequency
  function mapBins() {
    if (!analyser) return;
    const nyquist = ctx.sampleRate / 2;
    const lo = 40;
    const hi = Math.min(14000, nyquist);
    ranges = [];
    for (let i = 0; i < bars; i++) {
      const f0 = lo * (hi / lo) ** (i / bars);
      const f1 = lo * (hi / lo) ** ((i + 1) / bars);
      const a = Math.floor((f0 / nyquist) * analyser.frequencyBinCount);
      const b = Math.max(
        a + 1,
        Math.ceil((f1 / nyquist) * analyser.frequencyBinCount),
      );
      ranges.push([a, b]);
    }
  }

  function draw() {
    g.clearRect(0, 0, width, height);
    const gap = width > 700 ? 3 : 2;
    const bw = (width - gap * (bars - 1)) / bars;
    const pad = 8;
    const room = height - pad * 2;

    for (let i = 0; i < bars; i++) {
      const v = values[i];
      const h = Math.max(2, v * room);
      const x = i * (bw + gap);
      g.globalAlpha = 0.3 + 0.7 * v;
      g.fillStyle = v > 0.01 ? colors.bar : colors.base;
      g.fillRect(x, height - pad - h, bw, h);

      // A small teal cap that hangs at the recent peak
      if (peaks[i] > 0.04) {
        g.globalAlpha = 1;
        g.fillStyle = colors.peak;
        g.fillRect(x, height - pad - peaks[i] * room - 3, bw, 2);
      }
    }
    g.globalAlpha = 1;
  }

  // ---- Animation loop: runs only while there is something to animate ----
  function step(now) {
    raf = 0;
    if (document.hidden || !onScreen) {
      if (playing()) raf = requestAnimationFrame(step); // keep time while hidden, draw nothing
      return;
    }

    const interval = reduceMotion.matches ? 90 : isLight() ? 33 : 0;
    if (now - last < interval) {
      raf = requestAnimationFrame(step);
      return;
    }
    last = now;

    if (analyser && playing()) analyser.getByteFrequencyData(bins);
    const release = reduceMotion.matches ? 0.06 : 0.14;
    let busy = false;

    for (let i = 0; i < bars; i++) {
      let target = 0;
      if (analyser && playing()) {
        const [a, b] = ranges[i];
        let sum = 0;
        for (let k = a; k < b; k++) sum += bins[k];
        target = (sum / (b - a) / 255) ** 1.5;
      }
      // Rise quickly, fall slowly
      values[i] += (target - values[i]) * (target > values[i] ? 0.5 : release);
      peaks[i] = Math.max(values[i], peaks[i] - 0.012);
      if (values[i] > 0.005 || peaks[i] > 0.04) busy = true;
    }

    draw();
    if (busy || playing()) raf = requestAnimationFrame(step);
  }

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(step);
  };
  const playing = () => !audio.paused && !audio.ended;

  // ---- Web Audio setup (needs a click first) ----
  function ensureAudio() {
    if (ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    ctx = new Ctx();
    const source = ctx.createMediaElementSource(audio);
    // Mute with a gain node placed before the analyser. The element's own
    // `muted` flag is not honoured the same way in every browser once the
    // audio is routed through Web Audio, and this also calms the bars.
    gain = ctx.createGain();
    gain.gain.value = muted ? 0 : 1;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;
    bins = new Uint8Array(analyser.frequencyBinCount);
    source.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);
    mapBins();
  }

  async function toggle() {
    status.textContent = "";
    if (playing()) {
      audio.pause();
      return;
    }
    try {
      ensureAudio();
      if (ctx.state !== "running") await ctx.resume();
      if (audio.ended) audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.warn("[viz] Could not play.", error);
      status.textContent =
        "Couldn't play the track here. Try the players above.";
    }
  }

  playBtn.addEventListener("click", toggle);

  muteBtn.addEventListener("click", () => {
    muted = !muted;
    if (gain) gain.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.02);
    muteBtn.setAttribute("aria-pressed", String(muted));
    muteBtn.setAttribute("aria-label", muted ? "Unmute" : "Mute");
  });

  // ---- Progress and seeking ----
  function showTime() {
    const d = audio.duration;
    time.textContent = `${fmt(audio.currentTime)} / ${fmt(d)}`;
    if (!seeking && Number.isFinite(d) && d > 0) {
      scrub.value = Math.round((audio.currentTime / d) * 1000);
    }
    scrub.setAttribute(
      "aria-valuetext",
      `${fmt(audio.currentTime)} of ${fmt(d)}`,
    );
  }

  scrub.addEventListener("input", () => {
    seeking = true;
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (scrub.value / 1000) * audio.duration;
    }
    showTime();
  });
  scrub.addEventListener("change", () => {
    seeking = false;
  });

  ["timeupdate", "loadedmetadata", "durationchange", "seeked"].forEach((e) =>
    audio.addEventListener(e, showTime),
  );

  audio.addEventListener("play", () => {
    root.setAttribute("data-playing", "");
    playBtn.setAttribute("aria-label", `Pause ${title}`);
    if (analyser) pulse.set("track", analyser);
    // Tells the Spotify and Apple Music players to stop (see players.js)
    document.dispatchEvent(
      new CustomEvent("sound:start", { detail: { from: "track" } }),
    );
    kick();
  });

  // Someone pressed play inside a streaming player: pause the track
  const quiet = new AbortController();
  document.addEventListener(
    "sound:start",
    (e) => {
      if (e.detail?.from === "embed" && playing()) audio.pause();
    },
    { signal: quiet.signal },
  );
  const stopped = () => {
    root.removeAttribute("data-playing");
    playBtn.setAttribute("aria-label", `Play ${title}`);
    pulse.set("track", null);
    kick(); // lets the bars settle
  };
  audio.addEventListener("pause", stopped);
  audio.addEventListener("ended", stopped);
  audio.addEventListener("error", () => {
    status.textContent = "Couldn't load the track. Try the players above.";
  });

  // Lock screen and media keys
  if ("mediaSession" in navigator) {
    audio.addEventListener("play", () => {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: root.dataset.artist,
        artwork: root.dataset.cover ? [{ src: root.dataset.cover }] : [],
      });
    });
  }

  // Skip drawing while the visualizer is off screen
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) kick();
  }).observe(canvas);

  new ResizeObserver(layout).observe(canvas);
  reduceMotion.addEventListener("change", layout);

  showTime();
  layout();

  instances.push({
    stop() {
      quiet.abort();
      audio.pause();
      cancelAnimationFrame(raf);
      pulse.set("track", null);
      ctx?.close().catch(() => {});
    },
  });
}

// Leaving the page stops the track and frees the audio
document.addEventListener("astro:before-swap", () => {
  instances.splice(0).forEach((i) => i.stop());
});

function init() {
  document.querySelectorAll("[data-viz]:not([data-ready])").forEach(setup);
}

document.addEventListener("astro:page-load", init);
if (document.readyState !== "loading") init();
