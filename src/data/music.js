// Content for the Music page. Edit here, not in the page.

export const musicLinks = {
  appleMusic: "https://music.apple.com/us/artist/sahil-sheth/1816990873",
  spotify: "https://open.spotify.com/artist/6ziH1pXJ7ptHVYpWGFAWYx",
  youtubeMusic: "https://music.youtube.com/channel/UCkkw__OyWnbP-ZCtpoi_hog",
};

// The Spotify artist id, for the player on the page
export const spotifyArtistId = "6ziH1pXJ7ptHVYpWGFAWYx";

// Featured track. Paste a link to the song you want featured. Use either one,
// or both (the page then shows both play buttons):
//   Apple Music: open the song, Share > Copy Link
//     appleTrack: "https://music.apple.com/us/album/song-name/1234567890?i=1234567891"
//   Spotify: open the song, Share > Copy link
//     spotifyTrack: "https://open.spotify.com/track/xxxxxxxxxxxxxxxxxxxxxx"
// Spotify does not share your "Artist Pick" with websites, so it has to be pasted.
// While both are empty, the page features your newest release from Apple Music.
export const featured = {
  appleTrack:
    "https://music.apple.com/us/album/stay-cold/1885107052?i=1885107053",
  spotifyTrack: "",
  // The song itself, hosted on this site, for the visualizer. Put the MP3 in
  // public/audio/. Leave `audio` empty to hide the visualizer.
  audio: "/audio/stay-cold.mp3",
  audioTitle: "Stay Cold",
};

// The story, in order. `when` is optional: add a year or a month and year
// (for example "2020" or "Apr 2020") and it shows on the step.
export const journey = [
  {
    title: "Violin",
    when: "",
    text: "Violin is how I got into music.",
  },
  {
    title: "GarageBand on my phone",
    when: "",
    text: "During covid lockdown I started making beats on my phone.",
  },
  {
    title: "GarageBand on iPad",
    when: "",
    text: "Then I moved up to the iPad.",
  },
  {
    title: "GarageBand on Mac",
    when: "",
    text: "Then to the Mac.",
  },
  {
    title: "Logic Pro",
    when: "",
    text: "Then Logic Pro, which is what I use now. I produce, mix, and master everything myself.",
  },
];
