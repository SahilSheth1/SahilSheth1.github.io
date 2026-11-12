// Makes the amber dot in the nav pulse with whatever is playing.
// Anything that makes sound registers its analyser here with pulse.set(id, analyser)
// and removes it with pulse.set(id, null). While at least one is registered,
// <html data-audio="playing"> is set and --audio-level (0 to 1) updates on the
// brand dot (see Nav.astro).

const root = document.documentElement;
const sources = new Map(); // id -> { analyser, data }
let frame = 0;
let level = 0;

function rms(source) {
  const { analyser, data } = source;
  analyser.getByteTimeDomainData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const x = (data[i] - 128) / 128;
    sum += x * x;
  }
  return Math.sqrt(sum / data.length);
}

function tick() {
  let loudest = 0;
  sources.forEach((s) => (loudest = Math.max(loudest, rms(s))));
  level = Math.max(loudest * 2.5, level * 0.86);
  document
    .querySelector(".brand")
    ?.style.setProperty("--audio-level", Math.min(1, level).toFixed(3));
  frame = requestAnimationFrame(tick);
}

function update() {
  if (sources.size > 0) {
    root.setAttribute("data-audio", "playing");
    if (!frame) frame = requestAnimationFrame(tick);
  } else {
    cancelAnimationFrame(frame);
    frame = 0;
    level = 0;
    root.removeAttribute("data-audio");
    document.querySelector(".brand")?.style.removeProperty("--audio-level");
  }
}

// A page transition swaps in a new document, which loses the attribute
document.addEventListener("astro:after-swap", () => {
  if (sources.size > 0) root.setAttribute("data-audio", "playing");
});

export const pulse = {
  set(id, analyser) {
    if (analyser) {
      sources.set(id, {
        analyser,
        data: new Uint8Array(analyser.fftSize),
      });
    } else {
      sources.delete(id);
    }
    update();
  },
};
