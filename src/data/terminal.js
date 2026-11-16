// Text for the hidden terminal. Edit here, not in the script.
// The real content (about, projects, skills, career) is read from content.js,
// so the terminal stays in sync with the rest of the site.

export const terminal = {
  // Printed when the terminal opens
  welcome: [
    "Sahil Sheth, version 1.0",
    "Type help to see what you can do. Esc closes this.",
  ],
  // Fun replies. Add your own: the key is what the visitor types.
  replies: {
    whoami: "a visitor with good taste, probably.",
    pwd: "/home/guest/sahilsheth",
    date: () => new Date().toString(),
    hello: "Hey. Glad you found this.",
    hi: "Hey. Glad you found this.",
    bpm: "120 BPM in C major. The Logic Pro default, and I stuck with it.",
    coffee: "No coffee here, only amber. Try the pad on the home page.",
    vim: "You can leave any time. Type exit.",
    sudo: "Nice try. You are a guest here.",
    "rm -rf /": "Bold. Nothing was harmed, it is a static site.",
    ls: "about  projects  career  skills  resume  contact  music",
  },
};
