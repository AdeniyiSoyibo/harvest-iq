# Perpetual Flow — Beta v0.5 Complete
# ─────────────────────────────────────────────────────────────────────────────
# SINGLE COMMAND TO DEPLOY (run in PowerShell):
#
#   Copy-Item -Path "C:\Users\bekog\Downloads\New folder\perpetual-flow-patches\*" `
#             -Destination "C:\Users\bekog\OneDrive\Desktop\Harvest IQ\Code-MVP Version" `
#             -Recurse -Force
#
# Then:
#   cd "C:\Users\bekog\OneDrive\Desktop\Harvest IQ\Code-MVP Version"
#   npm install
#   npm run dev
#
# Open: http://localhost:3000
# ─────────────────────────────────────────────────────────────────────────────

## COMPLETE FILE MANIFEST (75 files)

### Root config
package.json · tailwind.config.ts · next.config.ts · postcss.config.js · tsconfig.json

### App pages (9 routes)
/ · /streaming · /dj · /anr · /video · /pricing · /marketplace · /download

### API routes (5 endpoints)
/api/dj/transition · /api/production/analyze · /api/streaming/playlist
/api/video/sync · /api/anr/artists

### Lib (5 files)
types.ts · data.ts · store.ts · utils.ts · userContext.tsx

### Components (39 files across 8 folders)
ui/ · auth/ · layout/ · production/ · streaming/ · dj/ · anr/ · video/

## WHAT'S IN THE BETA

### Modes
- Production Studio — beat library, waveform editor, stem mixer, AI mix advisor, sound selector
- Streaming — flow-optimized playlists, crossfade player, flow queue
- DJ Mode — audio decks, crossfader, 9-D feature vectors, genre-conditioned regression model,
             hardware MIDI signals, set builder
- YouTube Video Mixer — 2 video decks, crossfader, 8 presets, paste any YouTube URL/ID
- A&R Discovery — 14 artists, market-fit scoring, talent matching, label CRM
- Video Editor — timeline, clip bin, AV sync points
- Beat Marketplace — genre filter, cart, sell CTA
- Pricing — 4 tiers + 6 revenue streams
- Download — Win/Mac/Linux download + 6-layer self-learning AI security

### Genre Coverage (30+ genres, 3 demographic tiers)
GLOBAL COMMERCIAL:  Hip-Hop · Trap · R&B · Electronic · House · Techno · Afrobeats · Afropop
CARIBBEAN/REGIONAL: Reggae · Dancehall · Soca · Amapiano · Highlife · Afro House
LATIN/S.AMERICAN:   Cumbia · Baile Funk · Dembow · Bossa Nova
UK/CLUB:            Drum & Bass · Jungle · Drill · Grime · Synthwave · Lo-Fi · Ambient
EAST ASIAN:         K-Trap · K-R&B
OTHER:              Nu-Jazz · Neo-Classical · Soul · World · Experimental

### Algorithm
14 genre-conditioned weight profiles in the 9-D regression model
Each profile is tuned to the BPM norms, key preferences, and perceptual priorities
of its regional demographic:
  "Bb" → Dancehall (JM)   "D"  → Soca (TT)       "G"  → Highlife/Cumbia
  "Ab" → Amapiano (ZA)    "Fm" → Boom Bap (US)    "F"  → Dembow/Bossa
  "Dm" → House/Techno     "Am" → Trap/Hip-Hop      "Gm" → Reggae/DnB
  "Cm" → Drill/Grime      "Bbm"→ R&B/Dancehall     "E"  → Afrobeats
  "C"  → Ambient/Lo-Fi    "F#m"→ Nu-Jazz

### Color
Background: #f0f4f8 (light grey) · Accent: #38bdf8 (sky blue) — locked throughout

### Security (Download page)
1. Self-Learning Threat Engine (federated ML, no data leaves device)
2. Zero-Trust Code Sandbox (syscall filtering)
3. Immutable Core Binary (Ed25519 HSM signing + hash manifest)
4. On-Device ML Security Model (5 MB ONNX, auto-improves)
5. Encrypted Peer Telemetry Network (gossip protocol)
6. Auto-Healing Binary Patches (Merkle proof, background apply)
