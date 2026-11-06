// Turns the career data and the release list into positions on the timeline.
// All positions are in months from the start of the axis, so the component
// only has to multiply by one scale (--mo in Career.astro).

import { experience, education, music } from "./content.js";

export const AXIS_START = "2018-07"; // a month before high school starts
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

// Release markers closer together than this are merged into one. If that still
// leaves too many markers, the merge distance grows (month -> quarter -> year).
const PX_PER_MONTH = (22 * 16) / 12;
const MERGE_STEPS_PX = [44, 88, 176, 352];
const MAX_MARKERS = 24;

const [START_Y, START_M] = AXIS_START.split("-").map(Number);

function monthIndex(ym) {
  const [y, m] = ym.split("-").map(Number);
  return (y - START_Y) * 12 + (m - START_M);
}

function dateIndex(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const days = new Date(y, m, 0).getDate();
  return monthIndex(`${y}-${m}`) + (d - 1) / days;
}

export function monthLabel(ym) {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

export function period(start, end) {
  return `${monthLabel(start)} - ${end ? monthLabel(end) : "Present"}`;
}

export function dateLabel(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function clip(lane, item, title, nowIdx, total) {
  const s = monthIndex(item.start);
  // An end month is inclusive, so the clip runs to the end of that month.
  // Ongoing clips run on into the spare room at the right edge (`shown`).
  const e = item.end ? monthIndex(item.end) + 1 : nowIdx;
  const shown = item.end ? e : total;
  return {
    id: item.id,
    lane,
    name: item.short,
    sub: item.sub,
    label: `${title}, ${period(item.start, item.end)}`,
    start: s,
    end: e,
    shown,
    mid: (s + e) / 2,
    current: !item.end,
  };
}

function cluster(releases) {
  const items = releases
    .map((r) => ({ ...r, at: dateIndex(r.date) }))
    .sort((a, b) => a.at - b.at);

  let groups = [];
  for (const px of MERGE_STEPS_PX) {
    const gap = px / PX_PER_MONTH;
    groups = [];
    for (const r of items) {
      const last = groups[groups.length - 1];
      if (last && r.at - last.items[0].at < gap) last.items.push(r);
      else groups.push({ items: [r] });
    }
    if (groups.length <= MAX_MARKERS) break;
  }

  return groups.map((g, i) => {
    const at = g.items.reduce((n, r) => n + r.at, 0) / g.items.length;
    const first = g.items[0];
    const last = g.items[g.items.length - 1];
    const newestFirst = [...g.items].reverse();
    return {
      id: `release-${i}`,
      lane: "music",
      marker: true,
      count: g.items.length,
      releases: newestFirst,
      name: g.items.length === 1 ? first.title : `${g.items.length} releases`,
      label:
        g.items.length === 1
          ? `${first.title}, released ${dateLabel(first.date)}`
          : `${g.items.length} releases, ${dateLabel(first.date)} to ${dateLabel(last.date)}`,
      range:
        g.items.length === 1
          ? dateLabel(first.date)
          : `${dateLabel(first.date)} to ${dateLabel(last.date)}`,
      start: at,
      end: at,
      shown: at,
      mid: at,
    };
  });
}

export function buildTimeline(releases, now = new Date()) {
  const nowIso = now.toISOString().slice(0, 10);
  const nowIdx = dateIndex(nowIso);
  const total = Math.ceil(nowIdx) + 6; // spare room so ongoing clips have a readable width

  const work = experience.map((e) =>
    clip("work", e, `${e.title}, ${e.org}`, nowIdx, total),
  );
  const school = education.map((e) =>
    clip("education", e, `${e.degree}, ${e.school}`, nowIdx, total),
  );
  const studio = [
    clip("music", music, music.title, nowIdx, total),
    ...cluster(releases),
  ];

  const ticks = [];
  for (let y = START_Y; y <= START_Y + Math.ceil(total / 12) + 1; y++) {
    const at = Math.max(0, monthIndex(`${y}-01`));
    if (at <= total) ticks.push({ year: y, at });
  }

  return {
    total,
    nowIdx,
    axisStart: AXIS_START,
    ticks,
    lanes: [
      { id: "work", label: "Work", clips: work },
      { id: "education", label: "School", clips: school },
      { id: "music", label: "Music", clips: studio },
    ],
  };
}

export function byYear(releases) {
  const years = new Map();
  for (const r of releases) {
    const y = r.date.slice(0, 4);
    if (!years.has(y)) years.set(y, []);
    years.get(y).push(r);
  }
  return [...years].map(([year, list]) => ({ year, list }));
}
