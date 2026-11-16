// The hidden terminal. Opens with ` (backtick), Ctrl+K or Cmd+K, or any
// element with data-terminal-open. Everything it prints comes from the data
// files, so it never drifts from the rest of the site.

import { navigate } from "astro:transitions/client";
import { site } from "../data/site.js";
import {
  about,
  projects,
  experience,
  education,
  skills,
} from "../data/content.js";
import { period } from "../data/timeline-data.js";
import { terminal as text } from "../data/terminal.js";

const PAGES = {
  home: "/",
  about: "/#about",
  projects: "/#projects",
  career: "/#career",
  skills: "/#skills",
  resume: "/#resume",
  contact: "/#contact",
  music: "/music",
};

const history = [];
let historyAt = 0;
let welcomed = false;

const $ = (sel) => document.querySelector(sel);

// ---- output helpers -------------------------------------------------------

function line(content = "", cls = "") {
  const log = $("[data-terminal-log]");
  const el = document.createElement("div");
  if (cls) el.className = cls;
  if (typeof content === "string") el.textContent = content;
  else el.append(content);
  log.append(el);
  return el;
}

function linkLine(prefix, label, href) {
  const wrap = document.createDocumentFragment();
  wrap.append(prefix);
  const a = document.createElement("a");
  a.href = href;
  a.textContent = label;
  a.rel = "noopener noreferrer";
  if (/^https?:/.test(href)) a.target = "_blank";
  wrap.append(a);
  line(wrap);
}

function scrollDown() {
  const screen = $("[data-terminal-screen]");
  screen.scrollTop = screen.scrollHeight;
}

// ---- navigation -----------------------------------------------------------

function go(href, label) {
  line(`Opening ${label}...`, "muted");
  setTimeout(() => {
    close();
    // Same-page anchors scroll, other pages use the site's page transition
    const url = new URL(href, location.origin);
    if (url.pathname === location.pathname && url.hash) {
      document.querySelector(url.hash)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate(href);
  }, 350);
}

function openOutside(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

// ---- commands -------------------------------------------------------------

const commands = {
  help: {
    desc: "list commands",
    run() {
      line("Commands", "head");
      Object.entries(commands)
        .filter(([, c]) => c.desc)
        .forEach(([name, c]) => line(`  ${name.padEnd(10)}${c.desc}`));
      line("Tab completes, the up arrow repeats, Esc closes.", "muted");
    },
  },
  about: {
    desc: "who I am",
    run() {
      line(about.lead);
      about.paragraphs.forEach((p) => line(`\n${p}`));
    },
  },
  projects: {
    desc: "what I've built",
    run() {
      projects.forEach((p) => {
        line(`${p.title}  (${p.kind})`, "head");
        line(p.description);
        if (p.tags?.length) line(p.tags.join(", "), "muted");
        (p.links || []).forEach((l) =>
          linkLine(`${l.label}: `, l.href, l.href),
        );
        line();
      });
    },
  },
  skills: {
    desc: "what I work with",
    run() {
      skills.forEach((g) => {
        line(g.title, "head");
        line(g.items.join(", "));
        line();
      });
    },
  },
  career: {
    desc: "work and school",
    run() {
      line("Work", "head");
      experience.forEach((e) =>
        line(`${period(e.start, e.end)}  ${e.title}, ${e.org}`),
      );
      line("\nSchool", "head");
      education.forEach((e) =>
        line(`${period(e.start, e.end)}  ${e.degree}, ${e.school}`),
      );
    },
  },
  music: {
    desc: "go to the music page",
    run: () => go(PAGES.music, "the music page"),
  },
  resume: {
    desc: "open my resume",
    run() {
      if (!site.resume) return line("No resume is posted yet.", "muted");
      linkLine("Resume: ", site.resume, site.resume);
      openOutside(site.resume);
    },
  },
  github: {
    desc: "open my GitHub",
    run() {
      if (!site.links.github) return line("No link set.", "muted");
      linkLine("GitHub: ", site.links.github, site.links.github);
      openOutside(site.links.github);
    },
  },
  linkedin: {
    desc: "open my LinkedIn",
    run() {
      if (!site.links.linkedin) return line("No link set.", "muted");
      linkLine("LinkedIn: ", site.links.linkedin, site.links.linkedin);
      openOutside(site.links.linkedin);
    },
  },
  contact: {
    desc: "how to reach me",
    run: () => go(PAGES.contact, "the contact section"),
  },
  goto: {
    desc: "jump to a page: goto music",
    run(args) {
      const key = (args[0] || "").toLowerCase().replace(/^\//, "");
      if (!PAGES[key]) {
        return line(`Where? Try: ${Object.keys(PAGES).join(", ")}`, "muted");
      }
      go(PAGES[key], key === "home" ? "home" : `${key}`);
    },
  },
  clear: {
    desc: "clear the screen",
    run() {
      $("[data-terminal-log]").replaceChildren();
    },
  },
  exit: { desc: "close the terminal", run: () => close() },
};

// cd works like goto, since people will try it
commands.cd = { run: (args) => commands.goto.run(args) };

function run(raw) {
  const input = raw.trim();
  const cmdLine = document.createDocumentFragment();
  const prompt = document.createElement("b");
  prompt.textContent = "$ ";
  cmdLine.append(prompt, input);
  line(cmdLine, "cmd");
  if (!input) return;

  const [name, ...args] = input.split(/\s+/);
  const key = name.toLowerCase();
  const reply = text.replies[input.toLowerCase()] ?? text.replies[key];

  if (commands[key]) {
    commands[key].run(args);
  } else if (reply !== undefined) {
    line(typeof reply === "function" ? reply() : reply);
  } else if (key === "echo") {
    line(args.join(" "));
  } else {
    line(`${name}: command not found. Type help.`, "err");
  }
}

// ---- open, close, keys ----------------------------------------------------

function dialog() {
  return $("[data-terminal]");
}

function open() {
  const d = dialog();
  if (!d || d.open) return;
  d.showModal();
  if (!welcomed) {
    text.welcome.forEach((l, i) => line(l, i === 0 ? "head" : "muted"));
    line();
    welcomed = true;
  }
  $("[data-terminal-input]").focus();
  scrollDown();
}

function close() {
  const d = dialog();
  if (d?.open) d.close();
}

function complete(input) {
  const [first, ...rest] = input.split(/\s+/);
  if (rest.length === 0) {
    const names = Object.keys(commands).filter(
      (n) => commands[n].desc && n.startsWith(first.toLowerCase()),
    );
    if (names.length === 1) return names[0] + " ";
    if (names.length > 1) line(names.join("  "), "muted");
  } else if (/^(goto|cd)$/i.test(first) && rest.length === 1) {
    const hit = Object.keys(PAGES).filter((p) =>
      p.startsWith(rest[0].toLowerCase()),
    );
    if (hit.length === 1) return `${first} ${hit[0]}`;
    if (hit.length > 1) line(hit.join("  "), "muted");
  }
  return input;
}

function wire() {
  const d = dialog();
  if (!d || d.dataset.ready) return;
  d.dataset.ready = "true";

  const input = $("[data-terminal-input]");

  $("[data-terminal-form]").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value;
    if (value.trim()) history.push(value);
    historyAt = history.length;
    input.value = "";
    run(value);
    scrollDown();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyAt > 0) input.value = history[--historyAt];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      historyAt = Math.min(historyAt + 1, history.length);
      input.value = history[historyAt] ?? "";
    } else if (e.key === "Tab") {
      e.preventDefault();
      input.value = complete(input.value);
      scrollDown();
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      commands.clear.run();
    }
  });

  // Clicking the dark backdrop closes it
  d.addEventListener("click", (e) => {
    if (e.target === d) close();
  });
  $("[data-terminal-close]").addEventListener("click", close);
}

// Key handler is added once, on document, so page transitions don't stack it
document.addEventListener("keydown", (e) => {
  const t = e.target;
  const typing =
    t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
  const combo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
  const tick = e.key === "`" && !e.ctrlKey && !e.metaKey && !e.altKey;

  if (combo) {
    e.preventDefault();
    dialog()?.open ? close() : open();
  } else if (tick && !typing) {
    e.preventDefault();
    open();
  }
});

// Buttons are re-found on every page, so delegate from the document once
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-terminal-open]")) open();
});

document.addEventListener("astro:page-load", wire);
wire();
