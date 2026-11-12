// Streaming players on the Music page: one at a time.
// The Spotify and Apple Music players are iframes from other sites, which a page
// can't pause directly. So only one iframe is ever loaded, tabs switch between
// them, and starting the track above unloads whichever one is showing.
// Clicking into a player pauses the track. Without this script, both players
// are simply listed.

const SOUND = "sound:start";

function setup(root) {
  root.setAttribute("data-ready", "");

  const tabs = [...root.querySelectorAll("[data-tab]")];
  const panels = new Map(
    [...root.querySelectorAll("[data-panel]")].map((p) => [p.dataset.panel, p]),
  );
  let current = "spotify";

  const frame = (panel) => panel.querySelector("iframe");
  const note = (panel) => panel.querySelector("[data-note]");

  function load(panel) {
    const f = frame(panel);
    if (f.dataset.src) f.src = f.dataset.src;
    f.hidden = false;
    note(panel).hidden = true;
  }

  // about:blank ends playback and frees the player
  function unload(panel) {
    const f = frame(panel);
    if (f.src !== "about:blank") f.dataset.src = f.src;
    f.src = "about:blank";
  }

  function show(name) {
    current = name;
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((panel, key) => {
      if (key === name) {
        panel.hidden = false;
        if (frame(panel).src === "about:blank") load(panel);
      } else {
        panel.hidden = true;
        unload(panel);
      }
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => show(tab.dataset.tab));
    tab.addEventListener("keydown", (e) => {
      const next = {
        ArrowRight: i + 1,
        ArrowLeft: i - 1,
        Home: 0,
        End: tabs.length - 1,
      }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      const target = tabs[(next + tabs.length) % tabs.length];
      target.focus();
      show(target.dataset.tab);
    });
  });

  // Apple Music: choose any release
  const pick = root.querySelector("[data-release]");
  pick?.addEventListener("change", () => {
    const panel = panels.get("apple");
    const f = frame(panel);
    f.height = pick.selectedOptions[0].dataset.height;
    f.dataset.src = pick.value;
    f.src = pick.value;
  });

  // The track above started: stop the player that is showing
  document.addEventListener(SOUND, (e) => {
    if (e.detail?.from !== "track" || !root.isConnected) return;
    const panel = panels.get(current);
    unload(panel);
    frame(panel).hidden = true;
    note(panel).hidden = false;
  });

  root
    .querySelectorAll("[data-reload]")
    .forEach((btn) =>
      btn.addEventListener("click", () => load(panels.get(current))),
    );

  // Only the first tab is loaded to begin with
  panels.forEach((panel, key) => {
    if (key !== current) {
      panel.hidden = true;
      unload(panel);
    }
  });
}

// Clicking inside an iframe moves focus to it. That is the only signal a page
// gets that an embedded player may have started, so pause the track.
window.addEventListener("blur", () => {
  setTimeout(() => {
    const active = document.activeElement;
    if (active?.tagName === "IFRAME" && active.closest("[data-listen]")) {
      document.dispatchEvent(
        new CustomEvent(SOUND, { detail: { from: "embed" } }),
      );
    }
  }, 0);
});

function init() {
  document.querySelectorAll("[data-listen]:not([data-ready])").forEach(setup);
}

document.addEventListener("astro:page-load", init);
if (document.readyState !== "loading") init();
