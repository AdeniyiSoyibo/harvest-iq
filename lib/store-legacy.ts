// ── Legacy HarvestIQ data layer ────────────────────────────────────────────────
export type Language = string;
export type Channel = "sms" | "voice" | "whatsapp" | "ussd" | "photo";
export type AnswerStatus = "answered" | "escalated" | "unanswered" | "refused";

export interface TraceSource {
  id: string; title?: string; source?: string; validatedBy?: string; [k: string]: unknown;
}
export interface TraceGraphFact {
  docId?: string; subject?: string; predicate?: string; object?: string; [k: string]: unknown;
}
export interface Trace {
  step?: string; input?: string; output?: string; toolCall?: string;
  latencyMs?: number; status?: string; risk?: string; sources?: TraceSource[];
  graphFacts?: TraceGraphFact[]; toolCalls?: string[]; observations?: string;
  escalationId?: string; [key: string]: unknown;
}

export interface Message {
  id?: string; role?: "user" | "assistant"; content?: string; text?: string;
  phone?: string; channel?: Channel; language?: Language; timestamp?: string;
  traces?: Trace[]; trace?: Trace; direction?: string; author?: string;
}

export interface Farmer {
  id: string; name: string; phone: string; language: Language; location: string;
  crops: string[]; livestock: string[]; district?: string; country?: string; device?: string;
}

export interface Conversation {
  phone: string; farmerId?: string; messages: Message[];
}

export interface Escalation {
  id: string; phone: string; reason: string; question?: string; category?: string;
  advisorReply?: string; resolved: boolean; createdAt: string;
  channel?: Channel; country?: string; farmerName?: string; district?: string;
}

const _conversations = new Map<string, Conversation>();
const _escalations: Escalation[] = [];

export const farmers: Farmer[] = [
  {
    id: 'f1', name: 'Dave Kowalski', phone: '+15154001001', language: 'en',
    location: 'Ames, IA', crops: ['corn', 'soybeans'], livestock: [],
    district: 'Story County', country: 'United States', device: 'Basic phone (SMS)',
  },
  {
    id: 'f2', name: 'Linda Mertens', phone: '+15154001002', language: 'en',
    location: 'Ames, IA', crops: ['corn'], livestock: [],
    district: 'Story County', country: 'United States', device: 'Feature phone (voice)',
  },
  {
    id: 'f3', name: 'Tom Haugen', phone: '+15154001003', language: 'en',
    location: 'Clear Lake, IA', crops: ['corn', 'soybeans'], livestock: [],
    district: 'Cerro Gordo County', country: 'United States', device: 'Smartphone (photo/app)',
  },
  {
    id: 'f4', name: 'Maria Sanchez', phone: '+15154001004', language: 'en',
    location: 'Marshalltown, IA', crops: ['corn'], livestock: [],
    district: 'Marshall County', country: 'United States', device: 'Basic phone (USSD)',
  },
  {
    id: 'f5', name: 'Rick Bauer', phone: '+15154001005', language: 'en',
    location: 'Ottumwa, IA', crops: ['corn', 'soybeans', 'wheat'], livestock: [],
    district: 'Wapello County', country: 'United States', device: 'Feature phone (SMS)',
  },
];

export function addMessage(phoneOrMsg: string | Message, msg?: Message): void {
  const phone = typeof phoneOrMsg === "string" ? phoneOrMsg : (phoneOrMsg.phone ?? "unknown");
  const message: Message = typeof phoneOrMsg === "string" ? msg! : phoneOrMsg;
  const conv = _conversations.get(phone) ?? { phone, messages: [] };
  conv.messages.push(message);
  _conversations.set(phone, conv);
}

export function getConversation(phone: string): Conversation | undefined { return _conversations.get(phone); }
export function getAllConversations(): Conversation[] { return Array.from(_conversations.values()); }
export function getFarmer(phone: string): Farmer | undefined { return farmers.find((f) => f.phone === phone); }

export function createEscalation(phoneOrObj: string | Partial<Escalation>, reason?: string): Escalation {
  const base = typeof phoneOrObj === "string"
    ? { phone: phoneOrObj, reason: reason ?? "" }
    : phoneOrObj;
  const esc: Escalation = {
    id: crypto.randomUUID(), resolved: false, createdAt: new Date().toISOString(),
    phone: base.phone ?? "unknown", reason: base.reason ?? "",
    ...base,
  };
  _escalations.push(esc);
  return esc;
}

export function getEscalations(): Escalation[] { return _escalations; }

export function resolveEscalation(id: string, advisorReply?: string): Escalation | undefined {
  const esc = _escalations.find((e) => e.id === id);
  if (esc) { esc.resolved = true; if (advisorReply) esc.advisorReply = advisorReply; }
  return esc;
}
