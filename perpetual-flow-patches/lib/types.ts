// ── Shared platform types ──────────────────────────────────────────────────────

export type PlatformMode = "production" | "streaming" | "dj" | "anr" | "video";

export interface Beat {
  id: string; title: string; bpm: number; key: string; genre: string; mood: string;
  duration: number; waveform: number[]; stems: Stem[]; createdAt: string; price?: number;
}

export interface Stem {
  id: string; name: string; type: "drums"|"bass"|"melody"|"harmony"|"fx"|"vocals";
  volume: number; muted: boolean; solo: boolean; color: string;
}

export interface MixRecommendation { parameter: string; current: number; suggested: number; reason: string; }

export interface Track {
  id: string; title: string; artist: string; album?: string; coverUrl: string;
  duration: number; bpm: number; energy: number; valence: number; danceability: number; key: string;
}

export interface Playlist { id: string; name: string; description: string; tracks: Track[]; flowScore: number; }

export interface FeatureVector {
  bpm: number; key: number; mode: number; energy: number; spectralCentroid: number;
  rmsLoudness: number; onset: number; brightness: number; danceability: number;
}

export interface TransitionScore {
  trackAId: string; trackBId: string; score: number; confidence: number;
  computedMs: number; signals: HardwareSignal[];
}

export interface HardwareSignal { channel: number; cc: number; value: number; label: string; }

export interface Artist {
  id: string; name: string; genre: string[]; subgenre: string; location: string;
  monthlyListeners: number; growthRate: number; marketFitScore: number;
  portfolioUrl?: string; tracks: Track[]; socialLinks: Record<string,string>;
  labelInterest: string[]; bio: string; avatarUrl: string;
}

export interface TalentMatch { artistId: string; labelId: string; score: number; reasons: string[]; }

export interface VideoProject {
  id: string; title: string; trackId?: string; clips: VideoClip[];
  duration: number; syncPoints: SyncPoint[];
}

export interface VideoClip { id: string; src: string; startTime: number; endTime: number; label: string; }

export interface SyncPoint { time: number; type: "beat"|"drop"|"phrase"|"custom"; confidence: number; }

export type PricingTier = "free"|"producer_pro"|"listener_premium"|"anr_enterprise";

export interface PricingPlan {
  id: PricingTier; name: string; price: number; annualPrice: number;
  features: string[]; highlight?: boolean;
}
