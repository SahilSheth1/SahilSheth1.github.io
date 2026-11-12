// Sound engine for the hero pad (Web Audio API).
//
// Sound is off until the visitor turns it on or hits a pad. Nothing plays by
// itself. Placeholder sounds are drawn into buffers in code; real files from
// data/pad.js are downloaded only once the visitor shows interest in the pad.
//
// While anything is playing, <html data-audio="playing"> is set and the
// brand dot in the nav pulses with the volume (see Nav.astro).

import { pads } from "../data/pad.js";
import { pulse } from "./pulse.js";

const SR = 44100;
const MAX_VOICES = 32;
const byId = new Map(pads.map((p) => [p.id, p]));
const listeners = new Set();

const supported =
  typeof OfflineAudioContext !== "undefined" &&
  Boolean(window.AudioContext || window.webkitAudioContext);

const state = {
  ctx: null,
  bus: null,
  master: null,
  analyser: null,
  enabled: false,
  volume: 0.8,
  buffers: new Map(), // id -> Promise<AudioBuffer>
  ready: new Map(), // id -> AudioBuffer, once decoded
  voices: [], // { src, choke }
  playing: false,
  idleTimer: null,
};

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
const loudness = (v) => v * v * 0.9;

// ---------- Placeholder sounds ----------

function render(seconds, build) {
  const ctx = new OfflineAudioContext(1, Math.ceil(SR * seconds), SR);
  build(ctx);
  return ctx.startRendering().then((buffer) => {
    // Even out the loudness of every placeholder
    const data = buffer.getChannelData(0);
    let peak = 0;
    for (let i = 0; i < data.length; i++)
      peak = Math.max(peak, Math.abs(data[i]));
    if (peak > 0) for (let i = 0; i < data.length; i++) data[i] *= 0.85 / peak;
    return buffer;
  });
}

function pluck(param, t, peak, attack, decay) {
  param.setValueAtTime(0.0001, t);
  param.linearRampToValueAtTime(peak, t + attack);
  param.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function noise(ctx) {
  const buffer = ctx.createBuffer(1, ctx.length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.start(0);
  return src;
}

function filter(ctx, type, frequency, q = 1) {
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = frequency;
  f.Q.value = q;
  return f;
}

const FORMANTS = {
  ah: [
    [800, 1],
    [1150, 0.55],
    [2900, 0.25],
  ],
  oh: [
    [450, 1],
    [800, 0.5],
    [2830, 0.2],
  ],
};

const recipes = {
  kick: () =>
    render(0.6, (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(170, 0);
      osc.frequency.exponentialRampToValueAtTime(48, 0.14);
      pluck(gain.gain, 0, 1, 0.002, 0.45);
      osc.connect(gain).connect(ctx.destination);
      osc.start(0);
    }),

  snare: () =>
    render(0.4, (ctx) => {
      const hiss = noise(ctx);
      const hissGain = ctx.createGain();
      pluck(hissGain.gain, 0, 0.8, 0.001, 0.18);
      hiss
        .connect(filter(ctx, "highpass", 1500))
        .connect(hissGain)
        .connect(ctx.destination);

      const body = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      body.type = "triangle";
      body.frequency.setValueAtTime(200, 0);
      body.frequency.exponentialRampToValueAtTime(140, 0.1);
      pluck(bodyGain.gain, 0, 0.6, 0.001, 0.1);
      body.connect(bodyGain).connect(ctx.destination);
      body.start(0);
    }),

  hat: ({ decay }) =>
    render(decay + 0.1, (ctx) => {
      const gain = ctx.createGain();
      pluck(gain.gain, 0, 0.5, 0.001, decay);
      noise(ctx)
        .connect(filter(ctx, "highpass", 7000))
        .connect(gain)
        .connect(ctx.destination);
    }),

  bass: ({ note }) =>
    render(1.3, (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const shaper = ctx.createWaveShaper();
      // Soft clipping adds harmonics so it is audible on phone speakers
      const curve = new Float32Array(1024);
      for (let i = 0; i < curve.length; i++)
        curve[i] = Math.tanh(2.5 * (i / 512 - 1));
      shaper.curve = curve;
      osc.frequency.setValueAtTime(hz(note) * 2.2, 0);
      osc.frequency.exponentialRampToValueAtTime(hz(note), 0.05);
      pluck(gain.gain, 0, 0.9, 0.003, 1.0);
      osc.connect(gain).connect(shaper).connect(ctx.destination);
      osc.start(0);
    }),

  vox: ({ vowel, note }) =>
    render(0.6, (ctx) => {
      const f0 = hz(note);
      const osc = ctx.createOscillator();
      const out = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f0 * 0.96, 0);
      osc.frequency.linearRampToValueAtTime(f0, 0.05);
      out.gain.setValueAtTime(0.0001, 0);
      out.gain.linearRampToValueAtTime(1, 0.015);
      out.gain.setValueAtTime(1, 0.14);
      out.gain.exponentialRampToValueAtTime(0.0001, 0.5);
      FORMANTS[vowel].forEach(([freq, level]) => {
        const band = filter(ctx, "bandpass", freq, 9);
        const g = ctx.createGain();
        g.gain.value = level;
        osc.connect(band).connect(g).connect(out);
      });
      out.connect(ctx.destination);
      osc.start(0);
    }),

  chord: ({ notes }) =>
    render(1.5, (ctx) => {
      const tone = filter(ctx, "lowpass", 4000, 0.8);
      tone.frequency.exponentialRampToValueAtTime(1400, 0.6);
      const gain = ctx.createGain();
      pluck(gain.gain, 0, 0.35, 0.006, 1.1);
      tone.connect(gain).connect(ctx.destination);
      notes.forEach((n) =>
        [-7, 7].forEach((cents) => {
          const osc = ctx.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.value = hz(n);
          osc.detune.value = cents;
          osc.connect(tone);
          osc.start(0);
        }),
      );
    }),
};

async function decodeFile(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  const data = await res.arrayBuffer();
  return new OfflineAudioContext(1, 1, SR).decodeAudioData(data);
}

function loadPad(pad) {
  if (!state.buffers.has(pad.id)) {
    const load = pad.file
      ? decodeFile(pad.file).catch((error) => {
          console.warn(
            `[pad] ${error.message}. Using the placeholder for "${pad.id}".`,
          );
          return recipes[pad.synth.type](pad.synth);
        })
      : recipes[pad.synth.type](pad.synth);
    state.buffers.set(
      pad.id,
      load.then((buffer) => {
        state.ready.set(pad.id, buffer);
        return buffer;
      }),
    );
  }
  return state.buffers.get(pad.id);
}

// Start preparing every sound. Called when the visitor first shows interest.
function prime() {
  if (supported) pads.forEach(loadPad);
}

// ---------- Playback ----------

function ensureContext() {
  if (state.ctx) return state.ctx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -14;
  compressor.knee.value = 8;
  compressor.ratio.value = 6;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.2;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  // pads -> compressor (stops clipping when many pads overlap) -> volume -> out
  compressor.connect(master);
  master.connect(analyser);
  analyser.connect(ctx.destination);
  Object.assign(state, { ctx, bus: compressor, master, analyser });
  return ctx;
}

function emit() {
  listeners.forEach((fn) => fn());
}

function setEnabled(on) {
  if (!supported) return;
  if (on) {
    try {
      const ctx = ensureContext();
      if (ctx.state !== "running") ctx.resume();
    } catch (error) {
      console.warn("[pad] Could not start audio.", error);
      return;
    }
    state.enabled = true;
    state.master.gain.setTargetAtTime(
      loudness(state.volume),
      state.ctx.currentTime,
      0.015,
    );
    prime();
  } else {
    state.enabled = false;
    if (state.master)
      state.master.gain.setTargetAtTime(0, state.ctx.currentTime, 0.015);
    state.voices.forEach((v) => {
      try {
        v.src.stop();
      } catch {
        /* already stopped */
      }
    });
  }
  emit();
}

function setVolume(v) {
  state.volume = Math.min(1, Math.max(0, v));
  if (state.enabled) {
    state.master.gain.setTargetAtTime(
      loudness(state.volume),
      state.ctx.currentTime,
      0.015,
    );
  }
  emit();
}

// ---------- The brand dot pulses with the sound (see pulse.js) ----------

function setPlaying(on) {
  if (on === state.playing) return;
  state.playing = on;
  pulse.set("pad", on ? state.analyser : null);
}

function voiceEnded(voice) {
  state.voices = state.voices.filter((v) => v !== voice);
  if (state.voices.length === 0) {
    clearTimeout(state.idleTimer);
    state.idleTimer = setTimeout(() => {
      if (state.voices.length === 0) setPlaying(false);
    }, 250);
  }
}

function play(pad, buffer) {
  if (!state.enabled) return;
  const ctx = state.ctx;

  // A closed hi-hat cuts off an open one, and so on
  if (pad.choke) {
    state.voices
      .filter((v) => v.choke === pad.choke)
      .forEach((v) => {
        try {
          v.src.stop();
        } catch {
          /* already stopped */
        }
      });
  }
  if (state.voices.length >= MAX_VOICES) {
    try {
      state.voices[0].src.stop();
    } catch {
      /* already stopped */
    }
  }

  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buffer;
  gain.gain.value = pad.gain ?? 1;
  src.connect(gain).connect(state.bus);

  const voice = { src, choke: pad.choke };
  state.voices.push(voice);
  clearTimeout(state.idleTimer);
  setPlaying(true);
  src.onended = () => voiceEnded(voice);
  src.start();
}

function trigger(id) {
  const pad = byId.get(id);
  if (!pad || !supported) return;
  if (!state.enabled) setEnabled(true);
  if (!state.enabled) return;

  const ready = state.ready.get(id);
  if (ready) play(pad, ready);
  else loadPad(pad).then((buffer) => play(pad, buffer));
}

export const engine = {
  supported,
  get enabled() {
    return state.enabled;
  },
  get volume() {
    return state.volume;
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  setEnabled,
  toggle: () => setEnabled(!state.enabled),
  setVolume,
  prime,
  trigger,
  // iOS only lets audio start from certain events. This is called again on release.
  unlock() {
    if (state.ctx && state.ctx.state !== "running") state.ctx.resume();
  },
};
