export type Track = {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: number;
  /** Fallback seconds. 0 = ask the YouTube player for the real duration. */
  duration: number;
  /**
   * YouTube video id. EMPTY ON PURPOSE.
   *
   * Every song below is a commercial label release (T-Series, Zee Music, Sony
   * Music India, Saregama, Worldwide Records, …). Only paste an id here if it
   * is the RIGHTS HOLDER'S OWN upload and embedding is enabled on it — open
   * the video, confirm the channel is the label/artist, and confirm it plays
   * on a third-party site. Tracks with an empty videoId are skipped by the
   * player, so it is safe to leave rows blank.
   */
  videoId: string;
};

export type Playlist = { id: string; name: string; tagline: string; tracks: Track[] };

// Adding a song = one line in the right array.
export const PLAYLISTS: Playlist[] = [
  {
    id: "aankhon-mein-kajal",
    name: "Aankhon Mein Kajal",
    tagline: "C & G major · the golden ones",
    tracks: [
      { id: "a1", title: "Kesariya", artist: "Arijit Singh", film: "Brahmastra", year: 2022, duration: 0, videoId: "BddP6PYo2gs" },
      { id: "a2", title: "Kesariya Dance", artist: "Arijit Singh", film: "Brahmastra", year: 2022, duration: 0, videoId: "K3B8-klo5xc" },
     
      // { id: "a1", title: "Kajal Kajal Teri Aankhon Ka", artist: "Amit Kumar", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "a2", title: "Mera Kajal", artist: "Falguni Pathak", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "a3", title: "Kajal", artist: "Munawar", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "a4", title: "Aankhon Mein Kajal Hai", artist: "Lata Mangeshkar", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "a5", title: "Aankhon Ka Kajal", artist: "Udit Narayan", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "a6", title: "Sun O Hasina Kajal Wali", artist: "Jolly Mukherjee", film: "", year: 0, duration: 0, videoId: "" },
      
      // { id: "a8", title: "Mere Haath Mein", artist: "Sonu Nigam", film: "Fanaa", year: 2006, duration: 0, videoId: "" },
      // { id: "a9", title: "Hum Tum", artist: "Alka Yagnik", film: "Hum Tum", year: 2004, duration: 0, videoId: "" },
      // { id: "a10", title: "Choudhary (Naina Kajal Ke)", artist: "Ruchika Jangid", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "a11", title: "Kajal Wali (Title Track)", artist: "Neha Kakkar", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "a12", title: "Aankhon Mein Teri Kajal", artist: "A. K. Arya", film: "", year: 0, duration: 0, videoId: "" },
    ],
  },
  {
    id: "kajal-ki-siyahi",
    name: "Kajal Ki Siyahi",
    tagline: "D & A major · cassette-shop hours",
    tracks: [
      // { id: "b1", title: "Teri Aankhon Ka Kajal", artist: "Gulshan Kumar", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "b2", title: "Kajal Ki Siyahi Se", artist: "Pritam", film: "Brahmastra", year: 2022, duration: 0, videoId: "" },
      // { id: "b3", title: "Nazar Na Lage (Kajal Lagake)", artist: "Shafqat Amanat Ali", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "b4", title: "Tu Hi Meri Kajal", artist: "Kumar Sanu", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "b5", title: "Kajal Re", artist: "Shailendra Singh", film: "Bobby", year: 1973, duration: 0, videoId: "" },
      // { id: "b6", title: "Nakhon Mein Kajal", artist: "Hariharan", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "b7", title: "Kajal Na Dil Ma Rehjo", artist: "Kajal Maheriya", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "b8", title: "Mora Kajal", artist: "Kinjal Dave", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "b9", title: "Kajal Katariya (Title Track)", artist: "Kajal Katariya", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "b10", title: "Ankhiyaan Da Kajal", artist: "Rahat Fateh Ali Khan", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "b11", title: "Kajal Lagake (Reprise)", artist: "Neha Kakkar", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "b12", title: "Tor Naina Ma Kajal", artist: "Sunil Soni", film: "", year: 0, duration: 0, videoId: "" },
    ],
  },
  {
    id: "kajal-raat",
    name: "Kajal Raat",
    tagline: "E & B minor · after the shutters come down",
    tracks: [
      // { id: "c1", title: "Kajal Ankhiyaan", artist: "Pawan Singh", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "c2", title: "Kajal Lagelu", artist: "Khesari Lal Yadav", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "c3", title: "Kajal Wali Akhiyaan", artist: "Arvind Akela Kallu", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "c4", title: "Kajal Laga Ke", artist: "Nilkamal Singh", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "c5", title: "Tor Kajal", artist: "Kumar Pritam", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "c6", title: "Kajal Re Kajal", artist: "Human Sagar", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "c7", title: "Kajal (Rab Se Hai Dua)", artist: "Arijit Singh", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "c8", title: "Naina Da Kajal", artist: "Guru Randhawa", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "c9", title: "Kajal (Haryanvi)", artist: "Masoom Sharma", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "c10", title: "Kajal Tera", artist: "Sukhe", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "c11", title: "Kajal Wale Naina", artist: "Tony Kakkar", film: "", year: 0, duration: 0, videoId: "" },
      // { id: "c12", title: "Kajal (Lo-fi Mix)", artist: "Nikhil D'Souza", film: "", year: 0, duration: 0, videoId: "" },
    ],
  },
];
