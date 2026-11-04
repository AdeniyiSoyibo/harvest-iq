import type { MarketplaceBeat } from "./types";

export const MARKETPLACE_BEATS: MarketplaceBeat[] = [
  {
    id: "mb1", title: "Phantom Grid", producer: "NOVO", genre: "Trap", mood: "Dark",
    bpm: 142, key: "Am", duration: 195, status: "available",
    waveform: Array.from({ length: 64 }, (_, i) => 0.3 + 0.6 * Math.abs(Math.sin(i * 0.4))),
    plays: 12400, likes: 843, tags: ["dark", "drill", "808"], createdAt: "2026-10-05",
    licenses: [
      { type: "basic",     price: 29.99,  streams: "100K",       copies: 2500,       includes: ["MP3 file", "Non-exclusive", "No radio"] },
      { type: "premium",   price: 79.99,  streams: "500K",       copies: 10000,      includes: ["MP3 + WAV", "Non-exclusive", "Radio rights", "Music video"] },
      { type: "exclusive", price: 499.99, streams: "unlimited",  copies: "unlimited", includes: ["Trackout stems", "Exclusive rights", "Full commercial use", "Broadcasting"] },
    ],
  },
  {
    id: "mb2", title: "Amber Haze", producer: "SolarBeat", genre: "Lo-Fi", mood: "Chill",
    bpm: 88, key: "F#m", duration: 220, status: "available",
    waveform: Array.from({ length: 64 }, (_, i) => 0.2 + 0.5 * Math.abs(Math.sin(i * 0.25))),
    plays: 8200, likes: 621, tags: ["lofi", "chill", "study"], createdAt: "2026-10-10",
    licenses: [
      { type: "basic",     price: 19.99,  streams: "100K",       copies: 2500,       includes: ["MP3 file", "Non-exclusive"] },
      { type: "premium",   price: 59.99,  streams: "500K",       copies: 10000,      includes: ["MP3 + WAV", "Non-exclusive", "Music video"] },
      { type: "exclusive", price: 349.99, streams: "unlimited",  copies: "unlimited", includes: ["Trackout stems", "Exclusive rights"] },
    ],
  },
  {
    id: "mb3", title: "Neon Cathedral", producer: "Kira Vault", genre: "House", mood: "Energetic",
    bpm: 128, key: "Dm", duration: 310, status: "available",
    waveform: Array.from({ length: 64 }, () => 0.45 + 0.5 * Math.random()),
    plays: 22100, likes: 1840, tags: ["house", "club", "four-on-floor"], createdAt: "2026-10-14",
    licenses: [
      { type: "basic",     price: 34.99,  streams: "100K",       copies: 2500,       includes: ["MP3 file", "Non-exclusive"] },
      { type: "premium",   price: 99.99,  streams: "500K",       copies: 10000,      includes: ["MP3 + WAV", "Non-exclusive", "Club DJ rights"] },
      { type: "exclusive", price: 799.99, streams: "unlimited",  copies: "unlimited", includes: ["Trackout stems", "Exclusive rights", "Sync licensing"] },
    ],
  },
  {
    id: "mb4", title: "Liquid Static", producer: "Axiom", genre: "DnB", mood: "Intense",
    bpm: 174, key: "Cm", duration: 268, status: "available",
    waveform: Array.from({ length: 64 }, (_, i) => 0.35 + 0.6 * Math.abs(Math.cos(i * 0.3))),
    plays: 9800, likes: 712, tags: ["dnb", "liquid", "bass"], createdAt: "2026-10-16",
    licenses: [
      { type: "basic",     price: 24.99,  streams: "100K",       copies: 2500,       includes: ["MP3 file", "Non-exclusive"] },
      { type: "premium",   price: 74.99,  streams: "500K",       copies: 10000,      includes: ["MP3 + WAV", "Non-exclusive"] },
      { type: "exclusive", price: 449.99, streams: "unlimited",  copies: "unlimited", includes: ["Trackout stems", "Exclusive rights"] },
    ],
  },
  {
    id: "mb5", title: "Velvet Frequency", producer: "Demi Nox", genre: "R&B", mood: "Smooth",
    bpm: 92, key: "Bbm", duration: 234, status: "available",
    waveform: Array.from({ length: 64 }, (_, i) => 0.25 + 0.55 * Math.abs(Math.sin(i * 0.35))),
    plays: 31500, likes: 2340, tags: ["rnb", "smooth", "soul"], createdAt: "2026-10-18",
    licenses: [
      { type: "basic",     price: 39.99,  streams: "100K",       copies: 2500,       includes: ["MP3 file", "Non-exclusive"] },
      { type: "premium",   price: 99.99,  streams: "500K",       copies: 10000,      includes: ["MP3 + WAV", "Non-exclusive", "Music video"] },
      { type: "exclusive", price: 699.99, streams: "unlimited",  copies: "unlimited", includes: ["Trackout stems", "Exclusive rights", "Full sync"] },
    ],
  },
  {
    id: "mb6", title: "Orbital Zen", producer: "Meld", genre: "Ambient", mood: "Peaceful",
    bpm: 68, key: "C", duration: 380, status: "available",
    waveform: Array.from({ length: 64 }, (_, i) => 0.15 + 0.35 * Math.abs(Math.sin(i * 0.15))),
    plays: 4100, likes: 389, tags: ["ambient", "meditation", "drone"], createdAt: "2026-10-20",
    licenses: [
      { type: "basic",     price: 14.99,  streams: "100K",       copies: 2500,       includes: ["MP3 file", "Non-exclusive"] },
      { type: "premium",   price: 44.99,  streams: "500K",       copies: 10000,      includes: ["MP3 + WAV", "Non-exclusive", "Podcast use"] },
      { type: "exclusive", price: 249.99, streams: "unlimited",  copies: "unlimited", includes: ["Trackout stems", "Exclusive rights"] },
    ],
  },
  {
    id: "mb7", title: "Street Oracle", producer: "NOVO", genre: "Hip-Hop", mood: "Hard",
    bpm: 97, key: "Gm", duration: 212, status: "available",
    waveform: Array.from({ length: 64 }, (_, i) => 0.3 + 0.65 * Math.abs(Math.sin(i * 0.5))),
    plays: 18700, likes: 1120, tags: ["hiphop", "boom-bap", "hard"], createdAt: "2026-10-22",
    licenses: [
      { type: "basic",     price: 29.99,  streams: "100K",       copies: 2500,       includes: ["MP3 file", "Non-exclusive"] },
      { type: "premium",   price: 89.99,  streams: "500K",       copies: 10000,      includes: ["MP3 + WAV", "Non-exclusive", "Music video"] },
      { type: "exclusive", price: 599.99, streams: "unlimited",  copies: "unlimited", includes: ["Trackout stems", "Exclusive rights"] },
    ],
  },
  {
    id: "mb8", title: "Lagos Motion", producer: "Afro.V", genre: "Afrobeats", mood: "Uplifting",
    bpm: 105, key: "E", duration: 248, status: "available",
    waveform: Array.from({ length: 64 }, (_, i) => 0.35 + 0.55 * Math.abs(Math.sin(i * 0.45))),
    plays: 27300, likes: 2100, tags: ["afrobeats", "dance", "uptempo"], createdAt: "2026-10-25",
    licenses: [
      { type: "basic",     price: 34.99,  streams: "100K",       copies: 2500,       includes: ["MP3 file", "Non-exclusive"] },
      { type: "premium",   price: 94.99,  streams: "500K",       copies: 10000,      includes: ["MP3 + WAV", "Non-exclusive", "Music video"] },
      { type: "exclusive", price: 649.99, streams: "unlimited",  copies: "unlimited", includes: ["Trackout stems", "Exclusive rights", "Sync rights"] },
    ],
  },
];
