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

export const experience = [
  {
    label: "Jun 2026 - Present",
    current: true,
    org: "Texas Instruments",
    roles: [
      {
        title: "Software Engineer (AI & Automation)",
        period: "Sept 2026 - Present",
      },
      { title: "Software Engineer Intern", period: "Jun 2026 - Aug 2026" },
    ],
    summary: "",
    bullets: [
      "Built a supervised AI prediction model to reduce customer returns.",
      "Built an unsupervised AI classification model to speed up lot disposition.",
      "Building an interface to improve and speed up manual wafer review.",
    ],
  },
  {
    label: "Jun 2025 - Dec 2025",
    current: false,
    org: "Tyler Technologies",
    roles: [{ title: "Software Engineer Intern", period: "" }],
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
    label: "In progress",
    current: true,
    school: "The University of Texas at Austin",
    degree: "Master's in Artificial Intelligence",
    details: [],
  },
  {
    label: "Aug 2022 - May 2026",
    current: false,
    school: "The University of Texas at Dallas",
    degree: "B.S. in Computer Science",
    details: ["Minor in Business Analytics", "Data Science certificate"],
  },
  {
    label: "Graduated",
    current: false,
    school: "Allen High School",
    degree: "High school diploma",
    details: [],
  },
];

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
