// Looks up an Apple Music song (or album) link when the site builds, using the
// same free public lookup as releases.js. Gives the title, cover and player.

const env = globalThis.process?.env ?? {};
const API = env.ITUNES_API_BASE || "https://itunes.apple.com";

export async function appleTrack(link) {
  let url;
  try {
    url = new URL(link);
  } catch {
    return null;
  }

  // A song link ends in ?i=<song id>. An album or single link ends in the album id.
  const id =
    url.searchParams.get("i") || (url.pathname.match(/(\d+)\/?$/) || [])[1];
  if (!id) return null;

  url.search = url.searchParams.get("i") ? `?i=${id}` : "";
  const track = {
    url: url.toString(),
    embed: url
      .toString()
      .replace("https://music.apple.com", "https://embed.music.apple.com"),
    height: 175,
    title: "",
    art: "",
  };

  try {
    const res = await fetch(`${API}/lookup?id=${id}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Apple Music lookup returned ${res.status}`);
    const data = await res.json();
    const item = (data.results || []).find(
      (r) => r.wrapperType === "track" || r.wrapperType === "collection",
    );
    if (item) {
      track.title = (item.trackName || item.collectionName || "").replace(
        / - (single|ep)$/i,
        "",
      );
      track.art = (item.artworkUrl100 || "").replace("100x100bb", "600x600bb");
    }
  } catch (error) {
    console.warn(
      `[apple] ${error.message}. Showing the player without a cover.`,
    );
  }
  return track;
}
