import type { Beat, Track, Playlist, Artist, FeatureVector, VideoProject, PricingPlan } from "./types";

// ── Beats (20 genres) ─────────────────────────────────────────────────────────
export const MOCK_BEATS: Beat[] = [
  { id:"b1", title:"Midnight Orbit",    bpm:140, key:"Am",  genre:"Trap",        mood:"Dark",      duration:187, price:29.99, createdAt:"2026-10-01",
    waveform:Array.from({length:64},(_,i)=>0.3+0.6*Math.abs(Math.sin(i*0.4))),
    stems:[{id:"s1",name:"808 Drums",type:"drums",volume:85,muted:false,solo:false,color:"#38bdf8"},{id:"s2",name:"808 Sub",type:"bass",volume:90,muted:false,solo:false,color:"#0284c7"},{id:"s3",name:"Melody Lead",type:"melody",volume:75,muted:false,solo:false,color:"#7c5cd8"},{id:"s4",name:"Atmospheric",type:"harmony",volume:60,muted:false,solo:false,color:"#10b981"},{id:"s5",name:"FX Layer",type:"fx",volume:40,muted:false,solo:false,color:"#f59e0b"}]},
  { id:"b2", title:"Solar Drift",       bpm:93,  key:"F#m", genre:"Lo-Fi",       mood:"Chill",     duration:214, price:19.99, createdAt:"2026-10-12",
    waveform:Array.from({length:64},(_,i)=>0.2+0.5*Math.abs(Math.sin(i*0.25))),
    stems:[{id:"s6",name:"Vinyl Drums",type:"drums",volume:70,muted:false,solo:false,color:"#38bdf8"},{id:"s7",name:"Warm Bass",type:"bass",volume:80,muted:false,solo:false,color:"#0284c7"},{id:"s8",name:"Jazz Piano",type:"melody",volume:85,muted:false,solo:false,color:"#7c5cd8"},{id:"s9",name:"Strings",type:"harmony",volume:65,muted:false,solo:false,color:"#10b981"}]},
  { id:"b3", title:"Neon Cathedral",    bpm:128, key:"Dm",  genre:"House",       mood:"Euphoric",  duration:302, price:24.99, createdAt:"2026-10-20",
    waveform:Array.from({length:64},()=>0.4+0.55*Math.random()),
    stems:[{id:"s10",name:"4-on-Floor",type:"drums",volume:90,muted:false,solo:false,color:"#38bdf8"},{id:"s11",name:"Sidechain",type:"bass",volume:85,muted:false,solo:false,color:"#0284c7"},{id:"s12",name:"Supersaw",type:"melody",volume:80,muted:false,solo:false,color:"#7c5cd8"},{id:"s13",name:"Chord Stabs",type:"harmony",volume:70,muted:false,solo:false,color:"#10b981"},{id:"s14",name:"Vox Chop",type:"fx",volume:55,muted:false,solo:false,color:"#f59e0b"}]},
  { id:"b4", title:"Lagos Motion",      bpm:105, key:"E",   genre:"Afrobeats",   mood:"Uplifting", duration:248, price:34.99, createdAt:"2026-10-22",
    waveform:Array.from({length:64},(_,i)=>0.35+0.55*Math.abs(Math.sin(i*0.45))),
    stems:[{id:"s15",name:"Afro Perc",type:"drums",volume:88,muted:false,solo:false,color:"#38bdf8"},{id:"s16",name:"Kora Bass",type:"bass",volume:82,muted:false,solo:false,color:"#0284c7"},{id:"s17",name:"Guitar Riff",type:"melody",volume:78,muted:false,solo:false,color:"#7c5cd8"},{id:"s18",name:"Talking Drum",type:"fx",volume:65,muted:false,solo:false,color:"#f59e0b"}]},
  { id:"b5", title:"Velvet Frequency",  bpm:92,  key:"Bbm", genre:"R&B",         mood:"Smooth",    duration:234, price:39.99, createdAt:"2026-10-24",
    waveform:Array.from({length:64},(_,i)=>0.25+0.55*Math.abs(Math.sin(i*0.35))),
    stems:[{id:"s19",name:"R&B Kit",type:"drums",volume:80,muted:false,solo:false,color:"#38bdf8"},{id:"s20",name:"Fender Bass",type:"bass",volume:85,muted:false,solo:false,color:"#0284c7"},{id:"s21",name:"Falsetto",type:"vocals",volume:90,muted:false,solo:false,color:"#7c5cd8"},{id:"s22",name:"Rhodes",type:"harmony",volume:75,muted:false,solo:false,color:"#10b981"}]},
  { id:"b6", title:"Orbital Zen",       bpm:68,  key:"C",   genre:"Ambient",     mood:"Peaceful",  duration:380, price:14.99, createdAt:"2026-10-26",
    waveform:Array.from({length:64},(_,i)=>0.15+0.35*Math.abs(Math.sin(i*0.15))),
    stems:[{id:"s23",name:"Soft Perc",type:"drums",volume:40,muted:false,solo:false,color:"#38bdf8"},{id:"s24",name:"Pad Layer 1",type:"harmony",volume:85,muted:false,solo:false,color:"#7c5cd8"},{id:"s25",name:"Pad Layer 2",type:"melody",volume:70,muted:false,solo:false,color:"#10b981"},{id:"s26",name:"Drone",type:"fx",volume:55,muted:false,solo:false,color:"#f59e0b"}]},
  { id:"b7", title:"Drill Protocol",    bpm:142, key:"Cm",  genre:"Drill",       mood:"Menacing",  duration:196, price:27.99, createdAt:"2026-10-28",
    waveform:Array.from({length:64},(_,i)=>0.4+0.58*Math.abs(Math.sin(i*0.6))),
    stems:[{id:"s27",name:"Sliding 808",type:"drums",volume:92,muted:false,solo:false,color:"#38bdf8"},{id:"s28",name:"Drill Bass",type:"bass",volume:88,muted:false,solo:false,color:"#0284c7"},{id:"s29",name:"Dark Sample",type:"melody",volume:70,muted:false,solo:false,color:"#7c5cd8"},{id:"s30",name:"Stab FX",type:"fx",volume:50,muted:false,solo:false,color:"#f59e0b"}]},
  { id:"b8",  title:"Jungle Protocol",   bpm:165, key:"Gm",  genre:"Jungle",      mood:"Frantic",   duration:212, price:22.99, createdAt:"2026-10-29",
    waveform:Array.from({length:64},()=>0.35+0.6*Math.random()),
    stems:[{id:"s31",name:"Amen Break",type:"drums",volume:93,muted:false,solo:false,color:"#38bdf8"},{id:"s32",name:"Reese Bass",type:"bass",volume:87,muted:false,solo:false,color:"#0284c7"},{id:"s33",name:"Siren",type:"fx",volume:65,muted:false,solo:false,color:"#f59e0b"},{id:"s34",name:"Vocal Chop",type:"vocals",volume:55,muted:false,solo:false,color:"#7c5cd8"}]},

  // ── New Regional / Commercially Recognised Genres ─────────────────────────
  { id:"b9",  title:"Kingston Flex",     bpm:90,  key:"Bb",  genre:"Dancehall",   mood:"Hype",      duration:198, price:31.99, createdAt:"2026-10-30",
    waveform:Array.from({length:64},(_,i)=>0.35+0.60*Math.abs(Math.sin(i*0.55))),
    stems:[{id:"s35",name:"Riddim Drums",type:"drums",volume:91,muted:false,solo:false,color:"#38bdf8"},{id:"s36",name:"Steppers Bass",type:"bass",volume:86,muted:false,solo:false,color:"#0284c7"},{id:"s37",name:"Organ Skank",type:"melody",volume:78,muted:false,solo:false,color:"#7c5cd8"},{id:"s38",name:"Deejay Vox",type:"vocals",volume:88,muted:false,solo:false,color:"#f59e0b"}]},
  { id:"b10", title:"Roots Uprising",    bpm:76,  key:"Gm",  genre:"Reggae",      mood:"Conscious", duration:274, price:26.99, createdAt:"2026-10-30",
    waveform:Array.from({length:64},(_,i)=>0.2+0.45*Math.abs(Math.sin(i*0.3))),
    stems:[{id:"s39",name:"One Drop",    type:"drums",  volume:82,muted:false,solo:false,color:"#38bdf8"},{id:"s40",name:"Reggae Bass",  type:"bass",   volume:88,muted:false,solo:false,color:"#0284c7"},{id:"s41",name:"Rhythm Guitar",type:"melody", volume:80,muted:false,solo:false,color:"#7c5cd8"},{id:"s42",name:"Toasting Vox",type:"vocals",volume:75,muted:false,solo:false,color:"#10b981"}]},
  { id:"b11", title:"Carnival Riddim",   bpm:126, key:"D",   genre:"Soca",        mood:"Festive",   duration:221, price:28.99, createdAt:"2026-10-31",
    waveform:Array.from({length:64},(_,i)=>0.4+0.55*Math.abs(Math.sin(i*0.5))),
    stems:[{id:"s43",name:"Power Soca Kit",type:"drums",volume:92,muted:false,solo:false,color:"#38bdf8"},{id:"s44",name:"Soca Bass",    type:"bass",  volume:85,muted:false,solo:false,color:"#0284c7"},{id:"s45",name:"Brass Stab",   type:"harmony",volume:80,muted:false,solo:false,color:"#7c5cd8"},{id:"s46",name:"Soca Vocal",  type:"vocals",volume:90,muted:false,solo:false,color:"#f59e0b"}]},
  { id:"b12", title:"Boom Bap Blueprint", bpm:88, key:"Fm",  genre:"Hip-Hop",     mood:"Raw",       duration:209, price:33.99, createdAt:"2026-10-31",
    waveform:Array.from({length:64},(_,i)=>0.3+0.55*Math.abs(Math.sin(i*0.42))),
    stems:[{id:"s47",name:"Boom Bap Kit",type:"drums",volume:88,muted:false,solo:false,color:"#38bdf8"},{id:"s48",name:"Funk Bass",   type:"bass",  volume:82,muted:false,solo:false,color:"#0284c7"},{id:"s49",name:"Vinyl Sample",type:"melody",volume:78,muted:false,solo:false,color:"#7c5cd8"},{id:"s50",name:"Scratch FX",  type:"fx",    volume:60,muted:false,solo:false,color:"#f59e0b"}]},
  { id:"b13", title:"Cumbia Digital",    bpm:100, key:"Am",  genre:"Cumbia",      mood:"Festive",   duration:238, price:24.99, createdAt:"2026-10-31",
    waveform:Array.from({length:64},(_,i)=>0.3+0.50*Math.abs(Math.sin(i*0.38))),
    stems:[{id:"s51",name:"Cumbia Perc",type:"drums",volume:86,muted:false,solo:false,color:"#38bdf8"},{id:"s52",name:"Tuba Bass",   type:"bass",  volume:84,muted:false,solo:false,color:"#0284c7"},{id:"s53",name:"Accordion",   type:"melody",volume:85,muted:false,solo:false,color:"#7c5cd8"},{id:"s54",name:"Guiro FX",    type:"fx",    volume:55,muted:false,solo:false,color:"#f59e0b"}]},
  { id:"b14", title:"Amapiano Yard",     bpm:112, key:"Ab",  genre:"Amapiano",    mood:"Soulful",   duration:263, price:36.99, createdAt:"2026-11-01",
    waveform:Array.from({length:64},(_,i)=>0.25+0.55*Math.abs(Math.sin(i*0.28))),
    stems:[{id:"s55",name:"Logarbeat",  type:"drums",volume:90,muted:false,solo:false,color:"#38bdf8"},{id:"s56",name:"Piano Log",   type:"melody",volume:92,muted:false,solo:false,color:"#7c5cd8"},{id:"s57",name:"Bassline",    type:"bass",  volume:87,muted:false,solo:false,color:"#0284c7"},{id:"s58",name:"Flute Loop",  type:"fx",    volume:70,muted:false,solo:false,color:"#10b981"}]},
  { id:"b15", title:"Highlife Reborn",   bpm:118, key:"G",   genre:"Highlife",    mood:"Joyful",    duration:246, price:29.99, createdAt:"2026-11-01",
    waveform:Array.from({length:64},(_,i)=>0.3+0.50*Math.abs(Math.sin(i*0.35))),
    stems:[{id:"s59",name:"Highlife Kit",type:"drums",volume:83,muted:false,solo:false,color:"#38bdf8"},{id:"s60",name:"Guitar Lead",  type:"melody",volume:88,muted:false,solo:false,color:"#7c5cd8"},{id:"s61",name:"Brass Section",type:"harmony",volume:80,muted:false,solo:false,color:"#0284c7"},{id:"s62",name:"Call & Resp.", type:"vocals",volume:72,muted:false,solo:false,color:"#f59e0b"}]},
  { id:"b16", title:"Baile Favela",      bpm:130, key:"Dm",  genre:"Baile Funk",  mood:"Wild",      duration:194, price:21.99, createdAt:"2026-11-01",
    waveform:Array.from({length:64},()=>0.4+0.58*Math.random()),
    stems:[{id:"s63",name:"Funk Carioca",type:"drums",volume:94,muted:false,solo:false,color:"#38bdf8"},{id:"s64",name:"150 BPM Bass",type:"bass",  volume:89,muted:false,solo:false,color:"#0284c7"},{id:"s65",name:"MC Vocal",    type:"vocals",volume:88,muted:false,solo:false,color:"#7c5cd8"},{id:"s66",name:"Sirene FX",   type:"fx",    volume:65,muted:false,solo:false,color:"#f59e0b"}]},
];

// ── Tracks (20 across 20 genres) ──────────────────────────────────────────────
export const MOCK_TRACKS: Track[] = [
  { id:"t1",  title:"Gravity Pull",      artist:"NOVO",        album:"Deep Space",    coverUrl:"", duration:218, bpm:124, energy:0.81, valence:0.62, danceability:0.87, key:"Gm"  },
  { id:"t2",  title:"Phase Loop",        artist:"Sable",       album:"Algorithms",    coverUrl:"", duration:195, bpm:128, energy:0.76, valence:0.54, danceability:0.91, key:"Am"  },
  { id:"t3",  title:"Ember Signal",      artist:"Kira Vault",  album:"Thermal",       coverUrl:"", duration:241, bpm:140, energy:0.92, valence:0.44, danceability:0.83, key:"Cm"  },
  { id:"t4",  title:"Lucid Hours",       artist:"ZERO.7",      album:"Haze",          coverUrl:"", duration:267, bpm:85,  energy:0.38, valence:0.71, danceability:0.55, key:"F#m" },
  { id:"t5",  title:"Renegade Pulse",    artist:"Axiom",       album:"Surge",         coverUrl:"", duration:184, bpm:145, energy:0.95, valence:0.50, danceability:0.78, key:"Dm"  },
  { id:"t6",  title:"Still Waters",      artist:"Meld",        album:"Quiet",         coverUrl:"", duration:298, bpm:72,  energy:0.22, valence:0.85, danceability:0.40, key:"C"   },
  { id:"t7",  title:"Urban Folklore",    artist:"Demi Nox",    album:"Fracture",      coverUrl:"", duration:213, bpm:95,  energy:0.58, valence:0.63, danceability:0.68, key:"E"   },
  { id:"t8",  title:"Binary Rain",       artist:"NOVO",        album:"Deep Space",    coverUrl:"", duration:229, bpm:130, energy:0.79, valence:0.45, danceability:0.88, key:"Bbm" },
  { id:"t9",  title:"Golden Frequency",  artist:"Afro.V",      album:"Lagos Sound",   coverUrl:"", duration:244, bpm:108, energy:0.74, valence:0.88, danceability:0.92, key:"E"   },
  { id:"t10", title:"Phantom Chords",    artist:"Lyric Ghost", album:"Ethereal",      coverUrl:"", duration:262, bpm:76,  energy:0.31, valence:0.79, danceability:0.45, key:"Dbm" },
  { id:"t11", title:"Drill Doctrine",    artist:"ShotClock",   album:"Block Tape",    coverUrl:"", duration:178, bpm:142, energy:0.89, valence:0.33, danceability:0.71, key:"Bbm" },
  { id:"t12", title:"Bossa Algorithm",   artist:"ZERO.7",      album:"Nu-Soul",       coverUrl:"", duration:251, bpm:88,  energy:0.42, valence:0.82, danceability:0.61, key:"F"   },
  { id:"t13", title:"Jungle Static",     artist:"Axiom",       album:"Rainforest",    coverUrl:"", duration:196, bpm:162, energy:0.88, valence:0.48, danceability:0.82, key:"Cm"  },
  { id:"t14", title:"Synthwave Cruiser", artist:"Kira Vault",  album:"Neon Drive",    coverUrl:"", duration:287, bpm:118, energy:0.67, valence:0.71, danceability:0.76, key:"Am"  },
  { id:"t15", title:"Samba Nova",        artist:"Afro.V",      album:"Pan American",  coverUrl:"", duration:231, bpm:96,  energy:0.65, valence:0.90, danceability:0.87, key:"G"   },
  { id:"t16", title:"Grime Sessions",    artist:"ShotClock",   album:"Urban Canvas",  coverUrl:"", duration:194, bpm:138, energy:0.86, valence:0.35, danceability:0.74, key:"Cm"  },
  { id:"t17", title:"Nu-Jazz Corridor",  artist:"ZERO.7",      album:"Verve City",    coverUrl:"", duration:273, bpm:94,  energy:0.44, valence:0.77, danceability:0.58, key:"Eb"  },
  { id:"t18", title:"Afropop Summer",    artist:"Afro.V",      album:"Continental",   coverUrl:"", duration:218, bpm:112, energy:0.79, valence:0.93, danceability:0.95, key:"A"   },
  { id:"t19", title:"Techno Construct",  artist:"Sable",       album:"Machine Room",  coverUrl:"", duration:386, bpm:136, energy:0.91, valence:0.30, danceability:0.85, key:"Dm"  },
  { id:"t20", title:"Soul Revival",      artist:"Demi Nox",    album:"Golden Era",    coverUrl:"", duration:241, bpm:82,  energy:0.52, valence:0.80, danceability:0.64, key:"Ab"  },
  // ── Regional / Commercial Genre Expansion ─────────────────────────────────
  { id:"t21", title:"One Drop Wisdom",   artist:"Rootical",    album:"Zion Gates",    coverUrl:"", duration:264, bpm:76,  energy:0.40, valence:0.82, danceability:0.61, key:"Gm"  },
  { id:"t22", title:"Summer Blaze",      artist:"Vybz Corridor",album:"Riddim Season",coverUrl:"", duration:202, bpm:89,  energy:0.78, valence:0.90, danceability:0.93, key:"Bb"  },
  { id:"t23", title:"Fete All Night",    artist:"Carnival.X",  album:"Port of Spain", coverUrl:"", duration:218, bpm:128, energy:0.86, valence:0.94, danceability:0.96, key:"D"   },
  { id:"t24", title:"Street Gospel",     artist:"Demi Nox",    album:"Block Canon",   coverUrl:"", duration:196, bpm:88,  energy:0.62, valence:0.55, danceability:0.72, key:"Fm"  },
  { id:"t25", title:"La Cumbia Moderna", artist:"Cumbia Core",  album:"Barranquilla",  coverUrl:"", duration:231, bpm:100, energy:0.61, valence:0.86, danceability:0.89, key:"Am"  },
  { id:"t26", title:"Logarbeat Session", artist:"Amapiano.SA",  album:"Soweto Sunrise",coverUrl:"", duration:286, bpm:113, energy:0.66, valence:0.80, danceability:0.90, key:"Ab"  },
  { id:"t27", title:"Highlife Revival",  artist:"Afro.V",       album:"West Coast Gold",coverUrl:"",duration:244, bpm:117, energy:0.63, valence:0.88, danceability:0.84, key:"G"   },
  { id:"t28", title:"Favela Frequency",  artist:"Baile.RJ",     album:"Carioca Bass",  coverUrl:"", duration:188, bpm:130, energy:0.87, valence:0.72, danceability:0.91, key:"Dm"  },
  { id:"t29", title:"Dembow Digital",    artist:"Urbano.DR",    album:"Caribe Urban",  coverUrl:"", duration:213, bpm:122, energy:0.80, valence:0.84, danceability:0.92, key:"F"   },
  { id:"t30", title:"K-Trap Seoul",      artist:"808 Seoul",    album:"Han River",     coverUrl:"", duration:198, bpm:138, energy:0.85, valence:0.48, danceability:0.82, key:"Cm"  },
];

export const MOCK_PLAYLISTS: Playlist[] = [
  { id:"pl1", name:"Peak Hour",        description:"High-energy club sequence",                tracks:[MOCK_TRACKS[0],MOCK_TRACKS[2],MOCK_TRACKS[4],MOCK_TRACKS[7],MOCK_TRACKS[12]],          flowScore:94 },
  { id:"pl2", name:"Late Afternoon",   description:"Mellow downtempos for focus",              tracks:[MOCK_TRACKS[3],MOCK_TRACKS[5],MOCK_TRACKS[6],MOCK_TRACKS[9]],                           flowScore:88 },
  { id:"pl3", name:"Rise & Flow",      description:"Gradient build from ambient to peak",      tracks:[MOCK_TRACKS[5],MOCK_TRACKS[9],MOCK_TRACKS[3],MOCK_TRACKS[1],MOCK_TRACKS[0]],           flowScore:91 },
  { id:"pl4", name:"Global Sounds",    description:"Afrobeats, Bossa, Highlife & Amapiano",    tracks:[MOCK_TRACKS[8],MOCK_TRACKS[11],MOCK_TRACKS[14],MOCK_TRACKS[17],MOCK_TRACKS[26],MOCK_TRACKS[25]], flowScore:92 },
  { id:"pl5", name:"Drill & Grime",    description:"Street intensity — UK & Chicago",          tracks:[MOCK_TRACKS[10],MOCK_TRACKS[15],MOCK_TRACKS[7],MOCK_TRACKS[4]],                        flowScore:86 },
  { id:"pl6", name:"Techno & House",   description:"Four-to-the-floor journey",                tracks:[MOCK_TRACKS[18],MOCK_TRACKS[4],MOCK_TRACKS[1],MOCK_TRACKS[0]],                         flowScore:93 },
  { id:"pl7", name:"Caribbean Vibes",  description:"Reggae · Dancehall · Soca — island heat", tracks:[MOCK_TRACKS[20],MOCK_TRACKS[21],MOCK_TRACKS[22]],                                       flowScore:91 },
  { id:"pl8", name:"Latin Heat",       description:"Cumbia · Baile Funk · Dembow",             tracks:[MOCK_TRACKS[24],MOCK_TRACKS[27],MOCK_TRACKS[28]],                                       flowScore:90 },
  { id:"pl9", name:"Hip-Hop Essentials",description:"Boom Bap · Trap · Drill — street to suite",tracks:[MOCK_TRACKS[23],MOCK_TRACKS[6],MOCK_TRACKS[10],MOCK_TRACKS[7]],                      flowScore:88 },
  { id:"pl10",name:"Global Urban",     description:"K-Pop Trap · Amapiano · Afropop · Soca",  tracks:[MOCK_TRACKS[29],MOCK_TRACKS[25],MOCK_TRACKS[17],MOCK_TRACKS[22]],                       flowScore:89 },
];

export const MOCK_ARTISTS: Artist[] = [
  { id:"a1",  name:"Kira Vault",    genre:["Electronic","Future Bass","Synthwave"],  subgenre:"Synthwave",    location:"Berlin, DE",          monthlyListeners:127400, growthRate:34, marketFitScore:87, portfolioUrl:"https://example.com/kiravault", tracks:[MOCK_TRACKS[2],MOCK_TRACKS[13]],          socialLinks:{instagram:"#",soundcloud:"#",spotify:"#"},           labelInterest:["Ninja Tune","Mau5trap"],                        bio:"Kira Vault fuses dystopian textures with melodic future bass and synthwave nostalgia, building a cult following across Berlin's underground scene.", avatarUrl:"" },
  { id:"a2",  name:"Axiom",         genre:["Drum & Bass","Jungle","Techno"],         subgenre:"Liquid DnB",   location:"London, UK",          monthlyListeners:89200,  growthRate:21, marketFitScore:79,                                              tracks:[MOCK_TRACKS[4],MOCK_TRACKS[12]],          socialLinks:{instagram:"#",soundcloud:"#"},                       labelInterest:["Hospital Records","Metalheadz"],                bio:"Axiom's precision engineering translates to liquid DnB and jungle with surgical groove and orchestral undercurrents. Residency at Fabric, London.", avatarUrl:"" },
  { id:"a3",  name:"Demi Nox",      genre:["Hip-Hop","R&B","Trap"],                  subgenre:"Alt R&B",      location:"Atlanta, US",         monthlyListeners:213000, growthRate:58, marketFitScore:92,                                              tracks:[MOCK_TRACKS[6],MOCK_TRACKS[19],MOCK_TRACKS[23]], socialLinks:{instagram:"#",tiktok:"#",spotify:"#"},        labelInterest:["RCA","Interscope","Warner"],                    bio:"Demi Nox blends vulnerable lyricism with hazy alt R&B production. Viral growth driven by TikTok (38M views). Features on two gold-certified singles.", avatarUrl:"" },
  { id:"a4",  name:"Meld",          genre:["Ambient","Experimental","Drone"],        subgenre:"Drone Ambient",location:"Portland, US",         monthlyListeners:44300,  growthRate:12, marketFitScore:61,                                              tracks:[MOCK_TRACKS[5],MOCK_TRACKS[9]],           socialLinks:{bandcamp:"#",soundcloud:"#"},                        labelInterest:["Ghostly International"],                       bio:"Meld creates slow-evolving ambient soundscapes. Sync placements in Netflix and Apple TV+.", avatarUrl:"" },
  { id:"a5",  name:"Afro.V",        genre:["Afrobeats","Afropop","Highlife","World"],subgenre:"Afrofusion",   location:"Lagos, NG",           monthlyListeners:318000, growthRate:76, marketFitScore:95,                                              tracks:[MOCK_TRACKS[8],MOCK_TRACKS[14],MOCK_TRACKS[17],MOCK_TRACKS[26]], socialLinks:{instagram:"#",tiktok:"#",youtube:"#",spotify:"#"}, labelInterest:["Def Jam Africa","Sony Music Africa","Columbia"], bio:"Afro.V is the fastest-growing Afrofusion artist of 2026. Afrobeats, Highlife, and Amapiano producer with global reach — debut EP charted in 14 countries.", avatarUrl:"" },
  { id:"a6",  name:"ShotClock",     genre:["Drill","Grime","Hip-Hop"],               subgenre:"UK Drill",     location:"Birmingham, UK",      monthlyListeners:156000, growthRate:44, marketFitScore:83,                                              tracks:[MOCK_TRACKS[10],MOCK_TRACKS[15]],         socialLinks:{instagram:"#",youtube:"#"},                          labelInterest:["Island Records","Columbia UK"],                 bio:"ShotClock leads Birmingham's emerging drill scene. Hard-hitting production, razor-sharp bars, collab with Central Cee in pipeline.", avatarUrl:"" },
  { id:"a7",  name:"ZERO.7",        genre:["Nu-Jazz","Bossa Nova","Soul","Cumbia"],   subgenre:"Nu-Soul",      location:"São Paulo, BR",       monthlyListeners:72400,  growthRate:29, marketFitScore:74,                                              tracks:[MOCK_TRACKS[3],MOCK_TRACKS[11],MOCK_TRACKS[16],MOCK_TRACKS[24]], socialLinks:{instagram:"#",spotify:"#"},                    labelInterest:["Blue Note","Verve"],                            bio:"ZERO.7 revives bossa nova through a modern nu-soul lens with Cumbia crossover experiments. Grammy consideration 2027.", avatarUrl:"" },
  { id:"a8",  name:"Lyric Ghost",   genre:["Ambient","Neo-Classical","Cinematic"],   subgenre:"Neo-Classical",location:"Reykjavik, IS",        monthlyListeners:38100,  growthRate:18, marketFitScore:68,                                              tracks:[MOCK_TRACKS[9]],                          socialLinks:{bandcamp:"#",spotify:"#"},                           labelInterest:["Deutsche Grammophon","Erased Tapes"],           bio:"Lyric Ghost creates cinematic neo-classical compositions for sync licensing, with placements in Apple, Samsung, and HBO campaigns.", avatarUrl:"" },
  // ── New Regional Artists ─────────────────────────────────────────────────────
  { id:"a9",  name:"Rootical",      genre:["Reggae","Roots","Conscious"],            subgenre:"Roots Reggae", location:"Kingston, JM",        monthlyListeners:94500,  growthRate:31, marketFitScore:77,                                              tracks:[MOCK_TRACKS[20]],                         socialLinks:{instagram:"#",youtube:"#",spotify:"#"},              labelInterest:["VP Records","Greensleeves","Island"],           bio:"Rootical carries the torch of authentic roots reggae from Kingston. Deep social commentary, rich Nyahbinghi percussion, and a voice that echoes Marley. Growing streaming footprint across the Caribbean and West Africa.", avatarUrl:"" },
  { id:"a10", name:"Vybz Corridor", genre:["Dancehall","Bashment","Reggaeton"],      subgenre:"Modern Dancehall",location:"Kingston, JM",     monthlyListeners:187000, growthRate:63, marketFitScore:88,                                              tracks:[MOCK_TRACKS[21]],                         socialLinks:{instagram:"#",tiktok:"#",youtube:"#"},               labelInterest:["Atlantic","VP Records","Bad Gyal Records"],     bio:"Vybz Corridor is redefining modern dancehall for the streaming era — merging Jamaican riddim culture with Reggaeton and Afrobeats cross-pollination. Three consecutive #1 riddims in 2026.", avatarUrl:"" },
  { id:"a11", name:"Carnival.X",    genre:["Soca","Chutney Soca","Groovy Soca"],     subgenre:"Power Soca",   location:"Port of Spain, TT",  monthlyListeners:142000, growthRate:52, marketFitScore:82,                                              tracks:[MOCK_TRACKS[22]],                         socialLinks:{instagram:"#",youtube:"#",spotify:"#"},              labelInterest:["Universal Caribbean","Sony Latin"],             bio:"Carnival.X is the #1 Soca powerhouse from Trinidad & Tobago. Back-to-back Road March contenders, massive fete circuits across the Caribbean diaspora, and growing crossover into the UK Carnival and Toronto market.", avatarUrl:"" },
  { id:"a12", name:"Amapiano.SA",   genre:["Amapiano","Afro House","Kwaito"],        subgenre:"Amapiano",     location:"Johannesburg, ZA",   monthlyListeners:261000, growthRate:69, marketFitScore:91,                                              tracks:[MOCK_TRACKS[25]],                         socialLinks:{instagram:"#",tiktok:"#",youtube:"#",spotify:"#"}, labelInterest:["Sony Music Africa","Universal Africa","Platoon"], bio:"Amapiano.SA is at the forefront of the Amapiano global takeover. Log drum sessions from Soweto to London, viral TikTok choreography, and Spotify Africa Chart dominance for 18 consecutive weeks.", avatarUrl:"" },
  { id:"a13", name:"Cumbia Core",   genre:["Cumbia","Cumbia Digital","Tropical"],    subgenre:"Cumbia Digital",location:"Barranquilla, CO",   monthlyListeners:108000, growthRate:41, marketFitScore:79,                                              tracks:[MOCK_TRACKS[24]],                         socialLinks:{instagram:"#",youtube:"#",spotify:"#"},              labelInterest:["Sony Latin","Universal Latin","Nacional Records"], bio:"Cumbia Core modernises Colombia's national rhythm with digital production, 808s, and streaming-era songwriting. Chart presence in 8 Latin American countries and growing US Hispanic market traction.", avatarUrl:"" },
  { id:"a14", name:"808 Seoul",     genre:["K-Trap","K-R&B","Hip-Hop"],              subgenre:"K-Trap",       location:"Seoul, KR",          monthlyListeners:334000, growthRate:82, marketFitScore:94,                                              tracks:[MOCK_TRACKS[29]],                         socialLinks:{instagram:"#",tiktok:"#",youtube:"#",spotify:"#"}, labelInterest:["HYBE","AOMG","Warner Korea"],                    bio:"808 Seoul is leading the K-Trap wave — blending Atlanta Trap production with Korean lyricism and K-Pop visual aesthetics. 82% month-on-month growth driven by TikTok choreography trends and Weverse fan engagement.", avatarUrl:"" },
];

export const MOCK_VIDEO_PROJECT: VideoProject = {
  id:"vp1", title:"Midnight Orbit — Official Visualizer", trackId:"b1", duration:187,
  clips:[
    {id:"c1",src:"",startTime:0,  endTime:32,  label:"Intro Wide"},
    {id:"c2",src:"",startTime:32, endTime:78,  label:"Drop Sequence A"},
    {id:"c3",src:"",startTime:78, endTime:112, label:"Breakdown Overlay"},
    {id:"c4",src:"",startTime:112,endTime:155, label:"Drop Sequence B"},
    {id:"c5",src:"",startTime:155,endTime:187, label:"Outro Fade"},
  ],
  syncPoints:[
    {time:0,  type:"beat",  confidence:0.99},{time:8,  type:"phrase",confidence:0.94},
    {time:32, type:"drop",  confidence:0.97},{time:64, type:"phrase",confidence:0.91},
    {time:78, type:"phrase",confidence:0.93},{time:96, type:"beat",  confidence:0.88},
    {time:112,type:"drop",  confidence:0.96},{time:140,type:"phrase",confidence:0.90},
    {time:155,type:"phrase",confidence:0.91},{time:170,type:"beat",  confidence:0.85},
  ],
};

// ── Feature vector extraction ─────────────────────────────────────────────────
const camelotKey: Record<string,number> = {
  "C":8,"Am":8,"G":9,"Em":9,"D":10,"Bm":10,"A":11,"F#m":11,"E":12,"C#m":12,
  "B":1,"G#m":1,"F#":2,"D#m":2,"Db":3,"Bbm":3,"Ab":4,"Fm":4,"Eb":5,"Cm":5,
  "Bb":6,"Gm":6,"F":7,"Dm":7,"Dbm":3,
};

export function extractFeatureVector(track: Track): FeatureVector {
  const isMinor = track.key.includes("m") || track.key.endsWith("m");
  return {
    bpm: track.bpm, key: camelotKey[track.key] ?? 1, mode: isMinor ? 0 : 1,
    energy: track.energy, spectralCentroid: 1200 + track.energy * 3800,
    rmsLoudness: -23 + track.energy * 17, onset: track.danceability * 8,
    brightness: 0.3 + track.energy * 0.65, danceability: track.danceability,
  };
}

// ── Genre-conditioned regression model ───────────────────────────────────────
// Weights order: [bpm, key, mode, energy, spectralCentroid, rmsLoudness, onset, brightness, danceability]
// Genre profiles derived from perceptual research + regional BPM/key norms
const GENRE_WEIGHTS: Record<string, number[]> = {
  // Electronic / Club
  "Dm":    [0.40,0.25,0.05,0.15,0.02,0.03,0.04,0.03,0.03], // House / Techno / Baile Funk — BPM critical
  "Am":    [0.38,0.27,0.05,0.15,0.02,0.03,0.04,0.03,0.03], // Trap / Hip-Hop / K-Trap — key-forward
  "Gm":    [0.38,0.26,0.05,0.16,0.02,0.03,0.04,0.03,0.03], // Jungle / DnB / Reggae — BPM + energy
  "Cm":    [0.36,0.24,0.04,0.20,0.02,0.03,0.05,0.03,0.03], // Drill / Grime — energy-dominant
  "Bbm":   [0.30,0.22,0.05,0.18,0.03,0.04,0.05,0.06,0.07], // R&B / Soul / Dancehall — valence + dance
  "E":     [0.32,0.20,0.04,0.16,0.03,0.04,0.04,0.05,0.12], // Afrobeats / Highlife / Samba — danceability
  "C":     [0.28,0.20,0.05,0.14,0.06,0.06,0.08,0.07,0.06], // Ambient / Lo-Fi — brightness + onset
  "F#m":   [0.30,0.24,0.05,0.14,0.08,0.06,0.05,0.05,0.03], // Lo-Fi / Jazz / Nu-Jazz — spectral centroid
  // Caribbean / Latin Regional
  "Bb":    [0.28,0.22,0.04,0.18,0.03,0.04,0.04,0.05,0.12], // Dancehall — danceability + groove-dominant
  "D":     [0.30,0.20,0.04,0.18,0.03,0.04,0.04,0.05,0.12], // Soca / Power Soca — danceability-max
  "G":     [0.32,0.22,0.04,0.16,0.03,0.04,0.05,0.05,0.09], // Highlife / Bossa / Cumbia — melody-forward
  "Ab":    [0.30,0.22,0.05,0.17,0.03,0.04,0.05,0.05,0.09], // Amapiano / K-R&B — groove + log-drum onset
  "Fm":    [0.35,0.26,0.05,0.15,0.02,0.03,0.05,0.04,0.05], // Boom Bap Hip-Hop — BPM + key-integrity
  "F":     [0.30,0.22,0.05,0.15,0.04,0.04,0.06,0.06,0.08], // Bossa Nova / Dembow / Cumbia
  "default":[0.35,0.25,0.05,0.15,0.05,0.05,0.05,0.03,0.02],
};

export function computeTransitionScore(
  a: Track, b: Track
): { score: number; confidence: number; computedMs: number } {
  const start = performance.now();
  const fvA = extractFeatureVector(a);
  const fvB = extractFeatureVector(b);
  const w = GENRE_WEIGHTS[a.key] ?? GENRE_WEIGHTS.default;
  const vals  = [fvA.bpm,fvA.key,fvA.mode,fvA.energy,fvA.spectralCentroid,fvA.rmsLoudness,fvA.onset,fvA.brightness,fvA.danceability];
  const vals2 = [fvB.bpm,fvB.key,fvB.mode,fvB.energy,fvB.spectralCentroid,fvB.rmsLoudness,fvB.onset,fvB.brightness,fvB.danceability];
  const norms = [200,12,1,1,5000,40,10,1,1];
  let dist = 0;
  for (let i = 0; i < 9; i++) dist += w[i] * Math.abs(vals[i] - vals2[i]) / norms[i];
  const score = Math.min(100, Math.max(0, Math.round(100 - dist * 120)));
  const confidence = Math.max(0.5, 1 - dist * 0.8);
  return { score, confidence, computedMs: Math.round(performance.now() - start) };
}

export function detectSyncPoints(track: Track) {
  const points: {time:number;type:"beat"|"drop"|"phrase"|"custom";confidence:number}[] = [];
  const beatInterval = 60 / track.bpm;
  for (let t = 0; t < track.duration; t += beatInterval * 16)
    points.push({ time: parseFloat(t.toFixed(3)), type: "phrase", confidence: 0.95 });
  points.push({time:parseFloat((track.duration*0.30).toFixed(3)),type:"drop",confidence:0.88});
  points.push({time:parseFloat((track.duration*0.65).toFixed(3)),type:"drop",confidence:0.84});
  return points.sort((a,b)=>a.time-b.time);
}

// ── Pricing ───────────────────────────────────────────────────────────────────
export const PRICING_PLANS: PricingPlan[] = [
  { id:"free",             name:"Free Tier",        price:0,   annualPrice:0,   features:["3 beats per month","Basic waveform editor","2 playlists","5 artist profiles","Community support","Watermarked exports"] },
  { id:"producer_pro",     name:"Producer Pro",     price:19.99,annualPrice:15.99, highlight:true, features:["Unlimited beats & stems","Full stem mixer + EQ","AI mix advisor","Beat marketplace access","20+ genre library","Stem pack export","Priority support"] },
  { id:"listener_premium", name:"Listener Premium", price:9.99, annualPrice:7.99,  features:["Unlimited streaming","Flow-optimized playlists","Offline mode","High-fidelity 320kbps","No ads","Cross-device sync"] },
  { id:"anr_enterprise",   name:"A&R Enterprise",   price:499,  annualPrice:399,   features:["Full artist discovery dashboard","Market-fit scoring API","AI talent matching","Custom label profiles","White-label dashboard","Dedicated account manager","Priority pipeline tools"] },
];
