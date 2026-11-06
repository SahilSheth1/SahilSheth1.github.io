// Page content lives here so copy can be edited without touching components.
// Only include facts that are true. Leave a field empty and it is not shown.

export const about = {
  lead: "I'm a creative person who likes to build things and make things.",
  paragraphs: [
    "On the software side, I build full workflows and systems, with a focus on AI and automation.",
    "On the music side, I start from scratch and do all of it myself: producing, mixing, and mastering every track.",
  ],
};

export const projects = [
  {
    kind: "Web / Design",
    title: "Personal portfolio",
    description:
      "This site. A fast, dark, studio-inspired portfolio for my software, design, and music work, built with Astro and deployed with GitHub Actions. It is also how I'm learning git and GitHub properly: branches, pull requests, and automated deploys.",
    tags: ["Astro", "JavaScript", "CSS", "GitHub Actions", "GitHub Pages"],
    links: [
      {
        label: "View code",
        href: "https://github.com/SahilSheth1/SahilSheth1.github.io",
      },
    ],
  },
];

// Dates are "YYYY-MM". An empty end means "present". The timeline and the
// plain list both read from these, so edit once here.
// `short` and `sub` are the labels shown on the timeline clips.

export const experience = [
  {
    id: "ti-full-time",
    org: "Texas Instruments",
    title: "Software Engineer (AI & Automation)",
    short: "AI & Automation",
    sub: "Texas Instruments",
    start: "2026-09",
    end: "",
    summary: "",
    bullets: [
      "Building an interface to improve and speed up manual wafer review.",
    ],
  },
  {
    id: "ti-intern",
    org: "Texas Instruments",
    title: "Software Engineer Intern",
    short: "Intern",
    sub: "TI",
    start: "2026-06",
    end: "2026-08",
    summary: "",
    bullets: [
      "Built a supervised AI prediction model to reduce customer returns.",
      "Built an unsupervised AI classification model to speed up lot disposition.",
    ],
  },
  {
    id: "tyler",
    org: "Tyler Technologies",
    title: "Software Engineer Intern",
    short: "Tyler Technologies",
    sub: "Intern",
    start: "2025-06",
    end: "2025-12",
    summary:
      "Modernized the UI of a public-facing product to improve usability and visual consistency.",
    bullets: [
      "Built a feature for saving search filters, with a DynamoDB backend and supporting API endpoints.",
      "Updated the Tyler Authentication system design and configured it for individual client needs.",
      "Integrated a new component library to speed up UI development across the product.",
      "Built API endpoints for saved filters and for model-based frontend actions.",
    ],
  },
];

export const education = [
  {
    id: "ut-austin",
    school: "The University of Texas at Austin",
    degree: "Master's in Artificial Intelligence",
    short: "UT Austin",
    sub: "MS, AI",
    start: "2026-08",
    end: "",
    details: [],
  },
  {
    id: "utd",
    school: "The University of Texas at Dallas",
    degree: "Bachelor of Science in Computer Science",
    short: "UT Dallas",
    sub: "BS, Computer Science",
    start: "2022-08",
    end: "2026-05",
    details: [
      "Minor in Business Analytics and Intelligence",
      "Undergraduate certificate in Data Science",
    ],
  },
  {
    id: "allen-hs",
    school: "Allen High School",
    degree: "High school diploma",
    short: "Allen High School",
    sub: "Diploma",
    start: "2018-08",
    end: "2022-06",
    details: [],
  },
];

// The music lane. Releases are not listed here: they are pulled from Apple
// Music when the site builds (see releases.js). Add `extraReleases` below for
// anything that is not on Apple Music.
export const music = {
  id: "music",
  title: "Music production",
  short: "Music production",
  sub: "Since May 2021",
  start: "2021-05",
  end: "",
  summary:
    "I started making music in May 2021. I do all of it myself: producing, mixing, and mastering every track from scratch in Logic Pro.",
};

// Optional: { title: "Song name", kind: "Single", date: "2026-03-14", url: "https://..." }
export const extraReleases = [];

export const skills = [
  {
    title: "AI and automation",
    items: [
      "Python",
      "Machine learning",
      "Supervised and unsupervised learning",
      "Predictive modeling",
      "LLMs and prompt engineering",
      "Workflow automation",
      "Data science",
      "Business analytics",
    ],
  },
  {
    title: "Full stack",
    items: [
      "JavaScript",
      "HTML and CSS",
      "Node.js",
      "Astro",
      "SQL",
      "DynamoDB",
      "REST APIs",
      "Component libraries",
    ],
  },
  {
    title: "Git and GitHub",
    items: [
      "Git",
      "GitHub",
      "Branches and pull requests",
      "GitHub Actions",
      "GitHub Pages",
    ],
  },
  {
    title: "Music",
    items: ["Logic Pro", "Production", "Mixing", "Mastering"],
  },
];
