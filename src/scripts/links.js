// Links that leave the site (GitHub, LinkedIn, Spotify, Apple Music) and file
// links (the resume PDF) open in a new tab, so visitors don't lose their place.
// Links to other pages of this site stay in the same tab on purpose: the page
// transitions, the back button and the section anchors all rely on that.

const FILE = /\.(pdf|mp3|m4a|wav|zip)$/i;

function opensNewTab(a) {
  if (a.hasAttribute("download") || a.target) return false;
  const href = a.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  let url;
  try {
    url = new URL(a.href, location.href);
  } catch {
    return false;
  }
  if (!/^https?:$/.test(url.protocol)) return false; // mailto:, tel:
  return url.origin !== location.origin || FILE.test(url.pathname);
}

function tag(a) {
  if (!opensNewTab(a)) return;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
}

// Tag what is on the page now...
function tagAll() {
  document.querySelectorAll("a[href]").forEach(tag);
}
document.addEventListener("astro:page-load", tagAll);
tagAll();

// ...and anything the page adds later (release lists, terminal output)
document.addEventListener(
  "click",
  (e) => {
    const a = e.target.closest?.("a[href]");
    if (a) tag(a);
  },
  true,
);
