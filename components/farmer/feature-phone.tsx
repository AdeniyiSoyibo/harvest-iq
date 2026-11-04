'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, MessageSquare, Mic, Phone, Send, Hash } from 'lucide-react'
import type { Channel, Language, Message } from '@/lib/store'
import { SPEECH_LOCALE } from '@/lib/channels'
import { cn } from '@/lib/utils'

interface Props {
  messages: Message[]
  pending: Channel | null
  error: string | null
  language: Language
  selectedId: string | null
  onSelect: (id: string) => void
  onSms: (text: string) => Promise<{ reply: string } | null>
  onVoice: (transcript: string) => Promise<{ reply: string } | null>
  onPhoto: (file: File, caption: string) => Promise<{ reply: string } | null>
  onUssd: (text: string) => Promise<{ reply: string } | null>
}

const modes: { id: Channel | 'ussd'; label: string; icon: typeof Phone }[] = [
  { id: 'sms', label: 'SMS', icon: MessageSquare },
  { id: 'voice', label: 'Call', icon: Phone },
  { id: 'photo', label: 'Photo', icon: Camera },
  { id: 'ussd', label: 'USSD', icon: Hash },
]

const channelTag: Record<string, string> = { sms: 'SMS', voice: 'CALL', photo: 'PIC', ussd: 'USSD' }

function speak(text: string, language: Language) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = SPEECH_LOCALE[language] ?? 'en-GB'
  u.rate = 0.92
  window.speechSynthesis.speak(u)
}

export function FeaturePhone(props: Props) {
  const { messages, pending, error, language, selectedId, onSelect } = props
  const [mode, setMode] = useState<Channel | 'ussd'>('sms')
  const screenRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const el = screenRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, pending])

  return (
    <section aria-label="Feature phone simulator" className="mx-auto w-full max-w-xs">
      <div className="flex flex-col gap-4 rounded-[2rem] bg-neutral-800 p-4 pb-6 text-neutral-100 shadow-xl">

        {/* Status bar */}
        <div className="flex items-center justify-between px-2 font-mono text-xs opacity-70">
          <span>HARVEST IQ</span>
          <span aria-hidden="true" className="flex h-2 w-10 rounded-full bg-neutral-100/20" />
          <span>2G</span>
        </div>

        {/* LCD Screen */}
        <div className="flex h-96 flex-col overflow-hidden rounded-md border-4 border-neutral-100/10 bg-green-950 font-mono text-green-300">
          <div className="flex items-center justify-between border-b border-green-300/30 px-2 py-1 text-xs">
            <span className="flex items-end gap-0.5" aria-label="Signal strength 3 of 4">
              {[1, 2, 3, 4].map((b) => (
                <span key={b} className={cn('w-1 bg-green-300', b === 4 && 'opacity-25')} style={{ height: b * 3 }} />
              ))}
            </span>
            <span className="font-semibold">HARVEST IQ</span>
            <span>{channelTag[mode]}</span>
          </div>

          {/* Message list */}
          <ol
            ref={screenRef}
            className="flex flex-1 flex-col gap-2 overflow-y-auto p-2 text-sm leading-snug"
            aria-live="polite"
          >
            {messages.length === 0 && (
              <li className="m-auto text-center text-xs opacity-70">
                {'Press Enter or Send to ask.\nNo smartphone needed.'}
              </li>
            )}
            {messages.map((m, i) => (
              <li key={m.id ?? i} className={cn('flex flex-col', m.direction === 'in' ? 'items-end' : 'items-start')}>
                <span className="text-[11px] uppercase opacity-60">
                  {m.direction === 'in'
                    ? `> ${m.channel ? channelTag[m.channel] : ''}`
                    : m.author === 'advisor'
                    ? '< ADVISOR'
                    : '< HARVEST IQ'}
                </span>
                {m.trace ? (
                  <button
                    type="button"
                    onClick={() => onSelect(m.id ?? '')}
                    aria-pressed={selectedId === m.id}
                    className={cn(
                      'max-w-[92%] text-left',
                      m.trace.status === 'escalated' && 'border-l-2 border-green-300 pl-1',
                      selectedId === m.id && 'bg-green-300 text-green-950',
                    )}
                  >
                    {(() => {
                      const srcMatch = m.text.match(/^([\s\S]*?)\s*\[Src:[^\]]+\]$/)
                      const body = srcMatch ? srcMatch[1] : m.text
                      const src = m.trace.sources?.[0]
                      return (
                        <>
                          <span>{body}</span>
                          {src && (
                            <span className="mt-1 block text-[10px] opacity-60">
                              📚 {src.source}{src.validatedBy ? ` · ${src.validatedBy}` : ''}
                            </span>
                          )}
                        </>
                      )
                    })()}
                  </button>
                ) : (
                  <span
                    className={cn(
                      'max-w-[92%]',
                      m.direction === 'in' && 'text-right',
                      m.author === 'advisor' && 'font-semibold',
                    )}
                  >
                    {m.text}
                  </span>
                )}
              </li>
            ))}
            {pending && (
              <li className="animate-pulse text-xs">
                {pending === 'voice' ? 'Harvest IQ is thinking…' : 'Receiving…'}
              </li>
            )}
          </ol>

          {error && (
            <p className="border-t border-green-300/30 px-2 py-1 text-xs" role="alert">
              {`ERR: ${error}`}
            </p>
          )}
        </div>

        {/* Channel tabs */}
        <div className="grid grid-cols-4 gap-1.5" role="tablist" aria-label="Channel">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors',
                mode === m.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-neutral-100/10 hover:bg-neutral-100/20',
              )}
            >
              <m.icon className="size-3.5" aria-hidden="true" />
              {m.label}
            </button>
          ))}
        </div>

        {/* Composers */}
        {mode === 'sms' && <SmsComposer disabled={pending !== null} onSend={props.onSms} />}
        {mode === 'voice' && (
          <VoiceComposer disabled={pending !== null} language={language} onSend={props.onVoice} />
        )}
        {mode === 'photo' && <PhotoComposer disabled={pending !== null} onSend={props.onPhoto} />}
        {mode === 'ussd' && <UssdComposer disabled={pending !== null} onSend={props.onUssd} />}

        {/* Universal Enter = Send hint */}
        <p className="text-center font-mono text-[10px] opacity-50">
          ↵ Enter key = Send on any phone
        </p>
      </div>
    </section>
  )
}

// ── Shared styles ────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-md border border-neutral-100/10 bg-neutral-700 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-primary'

function isComposing(e: React.KeyboardEvent) {
  return e.nativeEvent.isComposing || e.keyCode === 229
}

function handleEnterSubmit(e: React.KeyboardEvent, submit: () => void) {
  if (e.key === 'Enter' && !isComposing(e) && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}

// ── SMS Composer ──────────────────────────────────────────────────────────────

function SmsComposer({ disabled, onSend }: { disabled: boolean; onSend: Props['onSms'] }) {
  const [text, setText] = useState('')
  const submit = async () => {
    const t = text.trim()
    if (!t || disabled) return
    setText('')
    await onSend(t)
  }
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <label htmlFor="sms-input" className="sr-only">SMS message — press Enter or Send to submit</label>
      <input
        id="sms-input"
        value={text}
        maxLength={300}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => handleEnterSubmit(e, submit)}
        placeholder="Type question → press Enter"
        className={inputClass}
        autoComplete="off"
        inputMode="text"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="rounded-md bg-primary px-3 text-primary-foreground disabled:opacity-40"
        aria-label="Send (Enter)"
      >
        <Send className="size-4" aria-hidden="true" />
      </button>
    </form>
  )
}

// ── Voice Composer ────────────────────────────────────────────────────────────

type Recognition = {
  lang: string
  interimResults: boolean
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void
  onend: () => void
  start: () => void
  stop: () => void
}

function VoiceComposer({
  disabled,
  language,
  onSend,
}: {
  disabled: boolean
  language: Language
  onSend: Props['onVoice']
}) {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const recRef = useRef<Recognition | null>(null)

  const [supported, setSupported] = useState(false)
  useEffect(() => {
    setSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  }, [])

  const toggleListen = () => {
    if (listening) {
      recRef.current?.stop()
      return
    }
    const w = window as unknown as Record<string, new () => Recognition>
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition
    const rec = new Ctor()
    rec.lang = SPEECH_LOCALE[language] ?? 'en-GB'
    rec.interimResults = true
    rec.onresult = (e) =>
      setTranscript(Array.from(e.results).map((r) => r[0].transcript).join(' '))
    rec.onend = () => setListening(false)
    recRef.current = rec
    setListening(true)
    rec.start()
  }

  const submit = async () => {
    const t = transcript.trim()
    if (!t || disabled) return
    setTranscript('')
    const res = await onSend(t)
    if (res) speak(res.reply, language)
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="voice-input" className="sr-only">
        What the farmer says — press Enter or Send to submit
      </label>
      <textarea
        id="voice-input"
        rows={2}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        onKeyDown={(e) => handleEnterSubmit(e, submit)}
        placeholder="Speak or type → press Enter"
        className={cn(inputClass, 'resize-none')}
      />
      <div className="flex gap-2">
        {supported && (
          <button
            type="button"
            onClick={toggleListen}
            aria-pressed={listening}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm',
              listening ? 'bg-accent text-accent-foreground' : 'bg-neutral-100/10',
            )}
          >
            <Mic className="size-4" aria-hidden="true" />
            {listening ? 'Listening…' : 'Speak'}
          </button>
        )}
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !transcript.trim()}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm text-primary-foreground disabled:opacity-40"
        >
          <Phone className="size-4" aria-hidden="true" />
          Send (↵)
        </button>
      </div>
      <p className="text-xs opacity-60">
        Reply is read aloud. Real calls use the Twilio / Africa's Talking IVR webhook.
      </p>
    </div>
  )
}

// ── Photo Composer ────────────────────────────────────────────────────────────

function PhotoComposer({ disabled, onSend }: { disabled: boolean; onSend: Props['onPhoto'] }) {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return setPreview(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const submit = async () => {
    if (!file || disabled) return
    const res = await onSend(file, caption.trim())
    if (res) {
      setFile(null)
      setCaption('')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-center gap-3 rounded-md bg-neutral-100/10 p-2 text-sm hover:bg-neutral-100/20">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Selected crop photo" className="size-12 rounded object-cover" />
        ) : (
          <Camera className="size-5" aria-hidden="true" />
        )}
        <span>{file ? file.name : 'Choose leaf, plant or animal photo'}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <label htmlFor="photo-caption" className="sr-only">Optional caption — press Enter to send</label>
      <input
        id="photo-caption"
        value={caption}
        maxLength={200}
        onChange={(e) => setCaption(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !isComposing(e)) { e.preventDefault(); submit() } }}
        placeholder="Caption (optional) → press Enter"
        className={inputClass}
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || !file}
        className="flex items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm text-primary-foreground disabled:opacity-40"
      >
        <Send className="size-4" aria-hidden="true" />
        Send photo (↵)
      </button>
    </div>
  )
}

// ── USSD Composer ─────────────────────────────────────────────────────────────
// Simulates the USSD menu flow that works on ALL phones — no internet required.
// In production this is powered by Africa's Talking / Twilio USSD gateway.

function UssdComposer({ disabled, onSend }: { disabled: boolean; onSend: Props['onUssd'] }) {
  const [input, setInput] = useState('')
  const [menuHistory, setMenuHistory] = useState<string[]>([])

  const submit = async () => {
    const val = input.trim()
    if (!val || disabled) return
    const next = [...menuHistory, val].filter(Boolean)
    setMenuHistory(next)
    setInput('')
    await onSend(next.join('*'))
  }

  const reset = () => {
    setMenuHistory([])
    setInput('')
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-xs text-neutral-400">
        Dial *384# on any phone. Enter a number or type a question, then press Enter or Send.
      </p>
      {menuHistory.length > 0 && (
        <p className="font-mono text-[10px] text-neutral-500">
          Path: {menuHistory.join(' › ')}
        </p>
      )}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <label htmlFor="ussd-input" className="sr-only">USSD input — press Enter to send</label>
        <input
          id="ussd-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleEnterSubmit(e, submit)}
          placeholder="1, 2, 3… or type question"
          className={inputClass}
          autoComplete="off"
          inputMode="text"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="rounded-md bg-primary px-3 text-primary-foreground disabled:opacity-40"
          aria-label="Send USSD input (Enter)"
        >
          <Send className="size-4" aria-hidden="true" />
        </button>
      </form>
      {menuHistory.length > 0 && (
        <button
          type="button"
          onClick={reset}
          className="text-left font-mono text-[10px] text-neutral-500 underline"
        >
          ← Start over (new session)
        </button>
      )}
      <p className="text-xs opacity-60">
        USSD works on every mobile phone worldwide — no data needed.
      </p>
    </div>
  )
}
