// Pulls my released music from Apple Music when the site is built, so the
// timeline updates on its own as I release more. It uses Apple's free public
// iTunes lookup (no account or key needed): the artist id lives in site.js.
//
// If Apple can't be reached, the build does not fail. It falls back to
// releases.fallback.json (empty by default, or paste in a saved copy).

import fallback from "./releases.fallback.json";
import { site } from "./site.js";
import { extraReleases } from "./content.js";

const env = globalThis.process?.env ?? {};
const API = env.ITUNES_API_BASE || "https://itunes.apple.com";

function kindOf(name) {
  if (/ - single$/i.test(name)) return "Single";
  if (/ - ep$/i.test(name)) return "EP";
  return "Album";
}

function normalize(item) {
  const raw = item.collectionName || "";
  return {
    id: String(item.collectionId),
    title: raw.replace(/ - (single|ep)$/i, ""),
    kind: kindOf(raw),
    date: String(item.releaseDate || "").slice(0, 10),
    art: (item.artworkUrl100 || "").replace("100x100bb", "200x200bb"),
    url: (item.collectionViewUrl || "").split("?")[0],
  };
}

async function fromApple(artistId) {
  const url = `${API}/lookup?id=${artistId}&entity=album&limit=200&sort=recent`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Apple Music lookup returned ${res.status}`);
  const data = await res.json();
  return (data.results || [])
    .filter((r) => r.wrapperType === "collection" && r.collectionId)
    .map(normalize);
}

export async function getReleases(now = new Date()) {
  let list = [];
  if (site.appleMusicArtistId) {
    try {
      list = await fromApple(site.appleMusicArtistId);
    } catch (error) {
      console.warn(`[releases] ${error.message}. Using the saved list.`);
      list = fallback;
    }
  }

  const extras = extraReleases.map((r, i) => ({
    id: `extra-${i}`,
    title: r.title,
    kind: r.kind || "Single",
    date: r.date,
    art: "",
    url: r.url || "",
  }));

  const today = now.toISOString().slice(0, 10);
  const seen = new Set();
  return [...list, ...extras]
    .filter((r) => r.title && /^\d{4}-\d{2}-\d{2}$/.test(r.date))
    .filter((r) => r.date <= today) // upcoming releases appear once they are out
    .filter((r) => !seen.has(r.id) && seen.add(r.id))
    .sort((a, b) => b.date.localeCompare(a.date));
}
