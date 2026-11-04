'use client'

import { useState } from 'react'
import useSWR from 'swr'
import type { Channel, Farmer, Language, Message } from '@/lib/store'
import { SUPPORTED_LANGUAGES } from '@/lib/channels'
import { farmers } from '@/lib/store'
import { FeaturePhone } from './feature-phone'
import { TracePanel } from './trace-panel'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/**
 * Iowa corn MVP sample questions — covers all 15 query clusters.
 */
const samples: Partial<Record<Language, { label: string; text: string }[]>> = {
  en: [
    { label: 'N loss after rain', text: "It's been raining — have I lost nitrogen, and do I need to apply more?" },
    { label: 'Yellow corn (N vs wet feet)', text: 'My corn is yellow after all this rain. Is it nitrogen deficiency or just wet feet?' },
    { label: 'Should I replant?', text: 'My stand is about 24–28 plants per 17-foot row. Should I replant?' },
    { label: 'Southern rust timing', text: 'Is it too late to apply a fungicide for southern rust at R3?' },
    { label: 'Waterhemp escaping', text: 'How do I control waterhemp that keeps escaping my herbicide program?' },
    { label: 'Soil temp for planting', text: 'What soil temperature do I need to plant corn, and should I watch the forecast?' },
    { label: 'Corn aphids', text: 'Are corn aphids worth spraying for this late in the season?' },
    { label: 'Harvest moisture', text: 'Should I pick 30% moisture corn or wait for it to dry down?' },
    { label: 'Am I losing money?', text: 'Am I losing money at these corn prices?' },
    { label: 'Sidedress timing', text: 'Should I sidedress nitrogen now or wait for the PSNT?' },
    { label: 'Hail damage', text: 'How long should I wait after hail before I decide to replant corn?' },
    { label: 'Tar spot', text: 'What is tar spot, and should I spray for it?' },
    { label: 'Cover crop termination', text: 'How early do I need to terminate my cover crop before planting corn?' },
    { label: 'Compaction', text: 'My no-till fields are compacted — will spring tillage fix it?' },
    { label: 'Rootworm lodging', text: 'Why is my corn lodging? Did rootworm cause it?' },
  ],
}

export function FarmerConsole() {
  const [phone, setPhone] = useState(farmers[0].phone)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pending, setPending] = useState<Channel | null>(null)
  const [error, setError] = useState<string | null>(null)
  const farmer = farmers.find((f) => f.phone === phone)!
  const [language, setLanguage] = useState<Language>(farmer.language)

  const { data, mutate } = useSWR<{ messages: Message[] }>(
    `/api/conversations?phone=${encodeURIComponent(phone)}`,
    fetcher,
    { refreshInterval: 4000 },
  )
  const messages = data?.messages ?? []
  const agentMessages = messages.filter((m) => m.trace)
  const selected =
    agentMessages.find((m) => m.id === selectedId) ?? agentMessages[agentMessages.length - 1] ?? null

  async function send(channel: Channel, init: RequestInit & { path: string }) {
    setPending(channel)
    setError(null)
    try {
      const res = await fetch(init.path, init)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Request failed')
      setSelectedId(null)
      await mutate()
      return json as { reply: string }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error')
      return null
    } finally {
      setPending(null)
    }
  }

  const sendSms = (text: string) =>
    send('sms', {
      path: '/api/channels/sms',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, text, language }),
    })

  const sendVoice = (transcript: string) =>
    send('voice', {
      path: '/api/channels/voice',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, transcript, language }),
    })

  const sendPhoto = (file: File, caption: string) => {
    const form = new FormData()
    form.set('phone', phone)
    form.set('image', file)
    form.set('caption', caption)
    form.set('language', language)
    return send('photo', { path: '/api/channels/photo', method: 'POST', body: form })
  }

  const sendUssd = async (text: string): Promise<{ reply: string } | null> => {
    setPending('sms')
    setError(null)
    try {
      const form = new URLSearchParams()
      form.set('phoneNumber', phone)
      form.set('text', text)
      form.set('language', language)
      form.set('sessionId', `web_${phone}_${Date.now()}`)
      const res = await fetch('/api/channels/ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      })
      const reply = await res.text()
      setSelectedId(null)
      await mutate()
      const clean = reply.replace(/^(CON|END)\s*/, '')
      return { reply: clean }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error')
      return null
    } finally {
      setPending(null)
    }
  }

  const currentSamples = samples[language] ?? samples['en'] ?? []

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr]">
      {/* Left panel: farmer selection */}
      <section aria-labelledby="farmer-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-pretty text-2xl font-semibold leading-tight">
            Harvest IQ
          </h1>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Every answer is retrieved from expert-validated ISU Extension, USDA-ARS, CIMMYT, and CGIAR
            sources and cited. No source — no answer. Questions requiring specific herbicide rates or
            crop insurance details go to a certified adviser. Works on any phone — smartphone not required.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            ↵ <strong>Enter</strong> or the <strong>Send</strong> button on any phone submits your question.
          </p>
        </div>

        {/* Farmer selector */}
        <fieldset className="flex flex-col gap-2">
          <legend
            id="farmer-heading"
            className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            Simulate an Iowa corn farmer
          </legend>
          <div className="flex max-h-72 flex-col gap-1.5 overflow-y-auto pr-1">
            {farmers.map((f) => (
              <label
                key={f.phone}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border bg-card p-3 transition-colors',
                  f.phone === phone && 'border-primary ring-1 ring-primary',
                )}
              >
                <input
                  type="radio"
                  name="farmer"
                  value={f.phone}
                  checked={f.phone === phone}
                  onChange={() => {
                    setPhone(f.phone)
                    setLanguage(f.language)
                    setSelectedId(null)
                  }}
                  className="mt-1 accent-primary"
                />
                <span className="flex flex-col">
                  <span className="font-medium">{f.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {f.district}, {f.country} · {f.device}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {SUPPORTED_LANGUAGES[f.language]} · {f.crops.join(', ')}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Language picker */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Reply in</span>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Reply language">
            {(Object.entries(SUPPORTED_LANGUAGES) as [Language, string][]).map(([code, label]) => (
              <button
                key={code}
                type="button"
                aria-pressed={language === code}
                onClick={() => setLanguage(code)}
                className={cn(
                  'rounded px-2 py-1 text-xs',
                  language === code
                    ? 'bg-primary text-primary-foreground'
                    : 'border text-muted-foreground hover:border-primary',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Sample questions */}
        {currentSamples.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Try a question
            </span>
            <div className="flex flex-wrap gap-2">
              {currentSamples.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  disabled={pending !== null}
                  onClick={() => sendSms(s.text)}
                  className="rounded-full border bg-card px-3 py-1.5 text-sm hover:border-primary disabled:opacity-50"
                  title={s.text}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Channel legend */}
        <div className="rounded-lg border bg-card p-3">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2">
            How it reaches a farmer
          </p>
          <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
            <li><strong>SMS</strong> — text to a short code (e.g. 2020) from any phone</li>
            <li><strong>Voice / IVR</strong> — call a number, speak the question, reply read aloud</li>
            <li><strong>Photo / MMS</strong> — WhatsApp Business or MMS gateway</li>
            <li><strong>USSD *384#</strong> — dial code on any mobile, works offline, no data needed</li>
          </ul>
        </div>
      </section>

      {/* Centre: the phone */}
      <FeaturePhone
        messages={messages}
        pending={pending}
        error={error}
        language={language}
        selectedId={selected?.id ?? null}
        onSelect={setSelectedId}
        onSms={sendSms}
        onVoice={sendVoice}
        onPhoto={sendPhoto}
        onUssd={sendUssd}
      />

      {/* Right panel: RAG trace */}
      <TracePanel message={selected} />
    </div>
  )
}
