import { Channel } from '../types';

export const CHANNELS: Channel[] = [
  {
    id: 1,
    name: "NASA TV",
    category: "Science",
    url: "https://ntv1.akamaized.net/hls/live/2013530/NASA-NTV1-HLS/master.m3u8"
  },
  {
    id: 2,
    name: "DW English",
    category: "News",
    url: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/master.m3u8"
  },
  {
    id: 3,
    name: "Al Jazeera",
    category: "News",
    url: "https://live-hls-web-aja.getaj.net/AJA/03.m3u8"
  },
  {
    id: 4,
    name: "France 24",
    category: "International",
    url: "https://static.france24.com/live/F24_EN_HI_HLS/master_web.m3u8"
  },
  {
    id: 5,
    name: "NHK World",
    category: "Japan",
    url: "https://nhkworld.webcdn.stream.ne.jp/www11/nhkworld-tv/global/2003458/live.m3u8"
  },
  {
    id: 6,
    name: "Bloomberg TV",
    category: "Finance",
    url: "https://liveproduction.global.ssl.fastly.net/us/playlist.m3u8"
  },
  {
    id: 7,
    name: "Red Bull TV",
    category: "Sports",
    url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8"
  },
  {
    id: 8,
    name: "Sky News",
    category: "UK News",
    url: "https://skynewsau-live.akamaized.net/hls/live/2002689/skynewsau-extra1/master.m3u8"
  },
  {
    id: 9,
    name: "Test Signal",
    category: "Test",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" // Big Buck Bunny loop
  }
];

export const getChannelById = (id: number): Channel | undefined => {
  return CHANNELS.find(c => c.id === id);
};
