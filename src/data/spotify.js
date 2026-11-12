// Looks up a Spotify track's title and cover art when the site builds, using
// Spotify's public oEmbed (no account or key needed). If it fails, the page
// still shows the player, just without the title and cover.

const env = globalThis.process?.env ?? {};
const OEMBED = env.SPOTIFY_OEMBED_BASE || "https://open.spotify.com";

export async function spotifyTrack(url) {
  const id = (url.match(/track\/([A-Za-z0-9]+)/) || [])[1];
  if (!id) return null;

  const track = {
    id,
    url: `https://open.spotify.com/track/${id}`,
    embed: `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`,
    title: "",
    art: "",
  };

  try {
    const res = await fetch(
      `${OEMBED}/oembed?url=${encodeURIComponent(track.url)}`,
      {
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) throw new Error(`Spotify oEmbed returned ${res.status}`);
    const data = await res.json();
    track.title = data.title || "";
    track.art = data.thumbnail_url || "";
  } catch (error) {
    console.warn(
      `[spotify] ${error.message}. Showing the player without a cover.`,
    );
  }
  return track;
}
