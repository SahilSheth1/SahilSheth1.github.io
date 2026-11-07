// The hero sound pad. Everything about the pads lives here.
//
// Right now every pad plays a placeholder sound made in the browser. To use a
// real sound, export it from Logic Pro, put the file in `public/audio/`, and
// set `file` for that pad, for example:  file: "/audio/kick.mp3"
// A pad with an empty `file` keeps its placeholder. Nothing else needs to change.
//
// Tips for the exports: 120 BPM, C major, short (under 2 seconds), peaks around
// -1 dB, and similar loudness across pads. MP3 or M4A keeps the files small.
//
// `key` is the keyboard key (only active once sound is on).
// `gain` trims a pad's volume (1 = unchanged). `choke` pads cut each other off,
// like a real hi-hat.
// `synth.note` values are MIDI numbers (60 = middle C).

export const padMeta = { bpm: 120, key: "C major" };

export const pads = [
  // Top row: chords (C, Am, F, G all fit together)
  {
    id: "chord-c",
    label: "C",
    name: "C major chord",
    key: "q",
    file: "",
    gain: 0.85,
    synth: { type: "chord", notes: [60, 64, 67] },
  },
  {
    id: "chord-am",
    label: "Am",
    name: "A minor chord",
    key: "w",
    file: "",
    gain: 0.85,
    synth: { type: "chord", notes: [57, 60, 64] },
  },
  {
    id: "chord-f",
    label: "F",
    name: "F major chord",
    key: "e",
    file: "",
    gain: 0.85,
    synth: { type: "chord", notes: [53, 57, 60] },
  },
  {
    id: "chord-g",
    label: "G",
    name: "G major chord",
    key: "r",
    file: "",
    gain: 0.85,
    synth: { type: "chord", notes: [55, 59, 62] },
  },

  // Middle row: 808 bass and vocal chops
  {
    id: "bass-c",
    label: "808 C",
    name: "808 bass, C",
    key: "a",
    file: "",
    gain: 0.65,
    synth: { type: "bass", note: 36 },
  },
  {
    id: "bass-g",
    label: "808 G",
    name: "808 bass, G",
    key: "s",
    file: "",
    gain: 0.65,
    synth: { type: "bass", note: 43 },
  },
  {
    id: "vox-1",
    label: "Vox 1",
    name: "Vocal chop 1",
    key: "d",
    file: "",
    gain: 0.85,
    synth: { type: "vox", vowel: "ah", note: 55 },
  },
  {
    id: "vox-2",
    label: "Vox 2",
    name: "Vocal chop 2",
    key: "f",
    file: "",
    gain: 0.85,
    synth: { type: "vox", vowel: "oh", note: 52 },
  },

  // Bottom row: drums
  {
    id: "kick",
    label: "Kick",
    name: "Kick drum",
    key: "z",
    file: "",
    gain: 1,
    synth: { type: "kick" },
  },
  {
    id: "snare",
    label: "Snare",
    name: "Snare drum",
    key: "x",
    file: "",
    gain: 0.9,
    synth: { type: "snare" },
  },
  {
    id: "hat-closed",
    label: "Hat",
    name: "Closed hi-hat",
    key: "c",
    file: "",
    gain: 0.7,
    choke: "hat",
    synth: { type: "hat", decay: 0.05 },
  },
  {
    id: "hat-open",
    label: "Open",
    name: "Open hi-hat",
    key: "v",
    file: "",
    gain: 0.7,
    choke: "hat",
    synth: { type: "hat", decay: 0.35 },
  },
];
