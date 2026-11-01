// Single source of truth for site-wide details. Edit here, not in components.
// A link with an empty string is skipped, so it only appears once you fill it in.
//
// Resume: the PDF lives in `public/Resume.pdf`. The Resume section shows the
// download button whenever `resume` below is filled in. Note that the file has
// to be committed to git for the live site to serve it.

export const site = {
  name: "Sahil Sheth",
  tagline: "Software, design, and music",
  description:
    "Sahil Sheth: software and design with an AI/ML focus, plus music production. Projects, career, skills, and music.",
  resume: "/Resume.pdf",
  links: {
    github: "https://github.com/SahilSheth1",
    linkedin: "https://www.linkedin.com/in/sahil-sheth1",
  },
  nav: [
    { label: "About", href: "/#about", section: "about" },
    { label: "Projects", href: "/#projects", section: "projects" },
    { label: "Career", href: "/#career", section: "career" },
    { label: "Skills", href: "/#skills", section: "skills" },
    { label: "Resume", href: "/#resume", section: "resume" },
    { label: "Contact", href: "/#contact", section: "contact" },
    { label: "Music", href: "/music", page: "/music" },
  ],
};