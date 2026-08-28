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

// Key = page slug. /kajal plays STATIONS.kajal only.
// Add a person: new key + app/<slug>/page.tsx with <Radio station="slug" />.
// Add a song: one line in that person's array.
export const STATIONS = {
  kajal: [
    { id: "k1", title: "Kesariya", artist: "Arijit Singh", film: "Brahmastra", year: 2022, duration: 0, videoId: "BddP6PYo2gs" },
    { id: "k2", title: "Kesariya Dance", artist: "Arijit Singh", film: "Brahmastra", year: 2022, duration: 0, videoId: "K3B8-klo5xc" },
    { id: "k3", title: "Kashish", artist: "Kashish", film: "Brahmastra", year: 2022, duration: 0, videoId: "nwXAkF8OFCc" },
    // { id: "k4", title: "Kajal Kajal Teri Aankhon Ka", artist: "Amit Kumar", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k5", title: "Mera Kajal", artist: "Falguni Pathak", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k6", title: "Kajal", artist: "Munawar", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k7", title: "Aankhon Mein Kajal Hai", artist: "Lata Mangeshkar", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k8", title: "Aankhon Ka Kajal", artist: "Udit Narayan", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k9", title: "Sun O Hasina Kajal Wali", artist: "Jolly Mukherjee", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k10", title: "Mere Haath Mein", artist: "Sonu Nigam", film: "Fanaa", year: 2006, duration: 0, videoId: "" },
    // { id: "k11", title: "Hum Tum", artist: "Alka Yagnik", film: "Hum Tum", year: 2004, duration: 0, videoId: "" },
    // { id: "k12", title: "Choudhary (Naina Kajal Ke)", artist: "Ruchika Jangid", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k13", title: "Kajal Wali (Title Track)", artist: "Neha Kakkar", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k14", title: "Aankhon Mein Teri Kajal", artist: "A. K. Arya", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k15", title: "Teri Aankhon Ka Kajal", artist: "Gulshan Kumar", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k16", title: "Kajal Ki Siyahi Se", artist: "Pritam", film: "Brahmastra", year: 2022, duration: 0, videoId: "" },
    // { id: "k17", title: "Nazar Na Lage (Kajal Lagake)", artist: "Shafqat Amanat Ali", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k18", title: "Tu Hi Meri Kajal", artist: "Kumar Sanu", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k19", title: "Kajal Re", artist: "Shailendra Singh", film: "Bobby", year: 1973, duration: 0, videoId: "" },
    // { id: "k20", title: "Nakhon Mein Kajal", artist: "Hariharan", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k21", title: "Kajal Na Dil Ma Rehjo", artist: "Kajal Maheriya", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k22", title: "Mora Kajal", artist: "Kinjal Dave", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k23", title: "Kajal Katariya (Title Track)", artist: "Kajal Katariya", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k24", title: "Ankhiyaan Da Kajal", artist: "Rahat Fateh Ali Khan", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k25", title: "Kajal Lagake (Reprise)", artist: "Neha Kakkar", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k26", title: "Tor Naina Ma Kajal", artist: "Sunil Soni", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k27", title: "Kajal Ankhiyaan", artist: "Pawan Singh", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k28", title: "Kajal Lagelu", artist: "Khesari Lal Yadav", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k29", title: "Kajal Wali Akhiyaan", artist: "Arvind Akela Kallu", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k30", title: "Kajal Laga Ke", artist: "Nilkamal Singh", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k31", title: "Tor Kajal", artist: "Kumar Pritam", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k32", title: "Kajal Re Kajal", artist: "Human Sagar", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k33", title: "Kajal (Rab Se Hai Dua)", artist: "Arijit Singh", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k34", title: "Naina Da Kajal", artist: "Guru Randhawa", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k35", title: "Kajal (Haryanvi)", artist: "Masoom Sharma", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k36", title: "Kajal Tera", artist: "Sukhe", film: "", year: 0, duration: 0, videoId: "" },
    // { id: "k37", title: "Kajal Wale Naina", artist: "Tony Kakkar", film: "", year: 0, duration: 0, videoId: "" },
    //     { id: "k38", title: "Kajal (Lo-fi Mix)", artist: "Nikhil D'Souza", film: "", year: 0, duration: 0, videoId: "" },
  ],
  shamili: [
    { id: "s1", title: "Ekla Cholo Re", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "-d9QOzkxMKU" },
    { id: "s2", title: "Halkat Jawani", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "PzcSrkMKDdk" },
    { id: "s3", title: "Ik Kudi", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "mfX7ynqrq2k" },
    { id: "s4", title: "Bebo", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "6VgBHZJggkA" },
    { id: "s5", title: "Laavan", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "WuvLbnFG8yg" },
    { id: "s6", title: "Khwaab Dekhe", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "kCQ6zaHDXj4" },
    { id: "s7", title: "Radha", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "52deq20h6Q4" },
  ],
  shreshth: [
    { id: "sh1", title: "Starboy", artist: "Shreshth", film: "", year: 0, duration: 0, videoId: "34Na4j8AVgA" },
    { id: "sh2", title: "Gucci Ravi Kishan", artist: "Shreshth", film: "", year: 0, duration: 0, videoId: "F9_b9yTjdWY" },
    { id: "sh3", title: "Kalyani", artist: "Shreshth", film: "", year: 0, duration: 0, videoId: "xvT1jH8B9AM" },
  ],
  shamili2: [
    { id: "s1", title: "Ekla Cholo Re", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "-d9QOzkxMKU" },
    { id: "s2", title: "Halkat Jawani", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "PzcSrkMKDdk" },
    { id: "s3", title: "Ik Kudi", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "mfX7ynqrq2k" },
    { id: "s4", title: "Bebo", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "6VgBHZJggkA" },
    { id: "s5", title: "Laavan", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "WuvLbnFG8yg" },
    { id: "s6", title: "Khwaab Dekhe", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "kCQ6zaHDXj4" },
    { id: "s7", title: "Radha", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "52deq20h6Q4" },
  ],
  abhishek: [
    { id: "a1", title: "Volume 1", artist: "Abhishek", film: "", year: 0, duration: 0, videoId: "SRNZSzjPioc" },
    // Add songs here, one line each:
    // { id: "a1", title: "", artist: "", film: "", year: 0, duration: 0, videoId: "" },
  ],
  shalu: [
    // Add songs here, one line each:
    // { id: "s1", title: "", artist: "", film: "", year: 0, duration: 0, videoId: "" },
    { id: "s2", title: "Tu hai wahi", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "yBahBBAHs04" },
    { id: "s1", title: "It's raining men", artist: "Shamili", film: "", year: 0, duration: 0, videoId: "l5aZJBLAu1E" },
  ],
  "sid-after-dark": [
    { id: "sad1", title: "Still Yours", artist: "Sid", film: "", year: 0, duration: 0, videoId: "nK9EPzALN9k" },
    // Add songs here, one line each:
    // { id: "sad1", title: "", artist: "", film: "", year: 0, duration: 0, videoId: "" },
  ],
  shreshth2: [
    { id: "sh1", title: "Starboy", artist: "Shreshth", film: "", year: 0, duration: 0, videoId: "34Na4j8AVgA" },
    { id: "sh2", title: "Gucci Ravi Kishan", artist: "Shreshth", film: "", year: 0, duration: 0, videoId: "F9_b9yTjdWY" },
    { id: "sh3", title: "Kalyani", artist: "Shreshth", film: "", year: 0, duration: 0, videoId: "xvT1jH8B9AM" },
    // Add songs here, one line each:
    // { id: "sh31", title: "", artist: "", film: "", year: 0, duration: 0, videoId: "" },
  ],
  sid: [
    // Add songs here, one line each:
    // { id: "s1", title: "", artist: "", film: "", year: 0, duration: 0, videoId: "" },
  ],
  "sharath-jharna": [
    { id: "sj1", title: "until I found you", artist: "Sharath", film: "", year: 0, duration: 0, videoId: "GxldQ9eX2wo" },
    // Add songs here, one line each:
    // { id: "sj1", title: "", artist: "", film: "", year: 0, duration: 0, videoId: "" },
  ],
} satisfies Record<string, Track[]>;

export type StationId = keyof typeof STATIONS;
