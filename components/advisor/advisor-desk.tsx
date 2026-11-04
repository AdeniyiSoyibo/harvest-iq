'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { CheckCircle2, Phone, MessageSquare, Camera, Hash } from 'lucide-react'
import type { Escalation } from '@/lib/store'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Data {
  escalations: Escalation[]
  stats: { total: number; answered: number; refused: number; escalated: number; openEscalations: number }
}

const channelIcon: Record<string, React.ElementType> = {
  sms: MessageSquare,
  voice: Phone,
  photo: Camera,
  ussd: Hash,
}

const categoryLabel: Record<string, string> = {
  'pesticide-rate': 'Pesticide rate',
  'crop-insurance-specific': 'Crop insurance',
  'human-health': 'Human health',
  'insufficient-sources': 'No source found',
  'agent-requested': 'Agent flagged',
}

export function AdvisorDesk() {
  const { data, mutate } = useSWR<Data>('/api/escalations', fetcher, { refreshInterval: 10_000 })
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [resolving, setResolving] = useState<string | null>(null)

  async function resolve(id: string) {
    setResolving(id)
    await fetch('/api/escalations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, advisorReply: replyText[id] ?? '' }),
    })
    mutate()
    setResolving(null)
  }

  const escalations = data?.escalations ?? []
  const stats = data?.stats

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Advisor desk</h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Questions requiring specific pesticide rates, crop insurance details, or human health concerns land here
          instead of being answered by the model. Reply to send your answer back to the farmer over the same channel
          they used. Harvest IQ serves Iowa corn farmers of all sizes.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Answered', value: stats.answered },
            { label: 'Refused', value: stats.refused },
            { label: 'Escalated', value: stats.escalated },
            { label: 'Open', value: stats.openEscalations },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border p-3">
              <p className="text-2xl font-semibold tabular-nums">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      )}

      {escalations.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">No open escalations</p>
        </div>
      ) : (
        <ol className="flex flex-col gap-4">
          {escalations.map((esc) => {
            const Icon = (esc.channel ? channelIcon[esc.channel] : undefined) ?? MessageSquare
            return (
              <li key={esc.id} className="rounded-lg border p-4">
                <div className="mb-3 flex flex-wrap items-start gap-2">
                  <span className="flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs font-mono">
                    <Icon className="h-3 w-3" />
                    {esc.channel}
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{esc.phone}</span>
                  {esc.country && (
                    <span className="rounded bg-muted px-2 py-0.5 text-xs">{esc.country}</span>
                  )}
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                    {(esc.category ? categoryLabel[esc.category] : undefined) ?? esc.category}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(esc.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="mb-3 whitespace-pre-wrap text-sm">{esc.question}</p>
                <p className="mb-2 text-xs text-muted-foreground">{esc.reason}</p>
                <div className="flex gap-2">
                  <textarea
                    className="min-h-[80px] flex-1 rounded border p-2 text-sm"
                    placeholder="Type your reply to the farmer…"
                    value={replyText[esc.id] ?? ''}
                    onChange={(e) => setReplyText((prev) => ({ ...prev, [esc.id]: e.target.value }))}
                  />
                  <button
                    className={cn(
                      'self-end rounded px-4 py-2 text-sm font-medium transition-colors',
                      'bg-primary text-primary-foreground hover:bg-primary/90',
                      'disabled:opacity-50',
                    )}
                    onClick={() => resolve(esc.id)}
                    disabled={resolving === esc.id}
                  >
                    {resolving === esc.id ? 'Sending…' : 'Resolve'}
                  </button>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
