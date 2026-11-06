// Motion layer: smooth scrolling (Lenis) and scroll entrances (GSAP).
// Everything here is progressive: if it fails or the visitor prefers reduced
// motion, the page is fully visible and scrolls natively.

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// What fades and slides in. Edit this list to change what animates.
// (Hero blocks are hidden by CSS from the first paint; see motion.css.)
const REVEAL = [
  ".hero .content > *", // home and music hero
  ".wrap .content > *", // 404 page
  ".panel .head", // section number and title
  ".prose > *", // About
  ".project, .list > .more", // Projects
  ".group-title, .entry", // Career and education list
  ".tl, .linear-wrap", // Career timeline
  ".grid > .group", // Skills
  ".resume", // Resume
  ".stack > p, .cards > li", // Contact
  ".stub .container > *", // placeholder sections
].join(",");

let lenis = null;

function startSmoothScroll() {
  if (lenis) return;
  lenis = new Lenis({ lerp: 0.12 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function reveal(els) {
  gsap.to(els, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "expo.out",
    stagger: 0.08,
    overwrite: true,
    onStart: () => els.forEach((el) => el.setAttribute("data-animating", "")),
    onComplete: () =>
      els.forEach((el) => {
        // Hand control back to CSS so hover effects work again
        el.setAttribute("data-revealed", "");
        el.removeAttribute("data-animating");
        gsap.set(el, { clearProps: "opacity,transform" });
      }),
  });
}

function initPage() {
  if (reduceMotion.matches || root.classList.contains("motion-off")) return;

  try {
    startSmoothScroll();
    lenis.resize();

    document
      .querySelectorAll(REVEAL)
      .forEach((el) => el.setAttribute("data-reveal", ""));

    ScrollTrigger.batch("[data-reveal]:not([data-revealed])", {
      start: "top 90%",
      once: true,
      interval: 0.1,
      onEnter: reveal,
    });

    root.classList.add("motion-ready");
    ScrollTrigger.refresh();
  } catch (error) {
    console.error("Motion failed, showing the page without it.", error);
    root.classList.add("motion-off");
  }
}

// In-page links (nav, hero buttons) scroll smoothly and stop below the nav.
function onLinkClick(e) {
  if (!lenis || e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  const link = e.target.closest && e.target.closest("a[href]");
  if (!link) return;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  if (url.pathname !== window.location.pathname || !url.hash) return;

  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;

  e.preventDefault();
  // Lenis already respects the section's scroll-margin-top (the nav height)
  lenis.scrollTo(target, { duration: 1.2 });
  window.history.replaceState(window.history.state, "", url.hash);
}

window.addEventListener("click", onLinkClick, { capture: true });

// Page transitions: clean up old triggers and carry the root classes
// (js, motion-ready, lenis) over to the incoming page.
document.addEventListener("astro:before-swap", (e) => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  root.classList.forEach((c) => e.newDocument.documentElement.classList.add(c));
});

document.addEventListener("astro:page-load", initPage);

// If the visitor changes their motion setting while the site is open,
// reload so the right version loads.
reduceMotion.addEventListener("change", () => window.location.reload());
