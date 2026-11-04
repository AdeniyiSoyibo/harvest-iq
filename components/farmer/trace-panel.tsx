import { BookCheck, CircleSlash, Network, ShieldAlert, Wrench } from 'lucide-react'
import type { Message } from '@/lib/store-legacy'
import { cn } from '@/lib/utils'

const statusCopy = {
  answered: { label: 'Answered from verified source', icon: BookCheck, cls: 'border-primary text-primary-foreground' },
  refused: { label: 'Refused — no verified source', icon: CircleSlash, cls: 'border-secondary text-secondary-foreground' },
  escalated: { label: 'Escalated to human advisor', icon: ShieldAlert, cls: 'border-accent text-accent-foreground' },
} as const

export function TracePanel({ message }: { message: Message | null }) {
  return (
    <section aria-labelledby="trace-heading" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 id="trace-heading" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Answer trace
        </h2>
        {message?.trace && <span className="font-mono text-xs text-muted-foreground">{message.trace.latencyMs} ms</span>}
      </div>

      {!message?.trace && (
        <p className="text-sm text-muted-foreground">Select a message to see its trace.</p>
      )}

      {message?.trace && (
        <>
          {/* Status */}
          {(() => {
            const s = statusCopy[message.trace.status as keyof typeof statusCopy]
            if (!s) return null
            const Icon = s.icon
            return (
              <div className={cn('flex items-center gap-2 rounded border p-2 text-sm', s.cls)}>
                <Icon className="h-4 w-4 shrink-0" />
                <span>{s.label}</span>
              </div>
            )
          })()}

          {/* Tool calls */}
          {(message.trace.toolCalls?.length ?? 0) > 0 && (
            <div>
              <p className="mb-1 font-mono text-xs text-muted-foreground">Tool calls</p>
              <ul className="flex flex-col gap-1">
                {message.trace.toolCalls?.map((tc: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5 font-mono text-xs">
                    <Wrench className="h-3 w-3 shrink-0 text-muted-foreground" />
                    {tc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources */}
          {(message.trace.sources?.length ?? 0) > 0 && (
            <div>
              <p className="mb-1 font-mono text-xs text-muted-foreground">Sources cited</p>
              <ul className="flex flex-col gap-1">
                {message.trace.sources?.map((srcRaw: unknown) => {
                  const src = srcRaw as { id?: string; title?: string; source?: string; validatedBy?: string };
                  return (
                  <li key={src.id} className="flex flex-col gap-0.5 rounded border p-2 text-xs">
                    <span className="font-medium">{src.title}</span>
                    <span className="text-muted-foreground">{src.source}</span>
                    {src.validatedBy && (
                      <span className="text-muted-foreground">Validated by: {src.validatedBy}</span>
                    )}
                  </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Graph facts */}
          {message.trace.graphFacts && message.trace.graphFacts.length > 0 && (
            <div>
              <p className="mb-1 font-mono text-xs text-muted-foreground">Knowledge graph</p>
              <ul className="flex flex-col gap-1">
                {message.trace.graphFacts.map((fRaw: unknown, i: number) => {
                  const f = fRaw as { from?: string; rel?: string; to?: string };
                  return (
                  <li key={i} className="flex items-center gap-1 font-mono text-xs">
                    <Network className="h-3 w-3 shrink-0 text-muted-foreground" />
                    {f.from} →<span className="italic">{f.rel}</span>→ {f.to}
                  </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Photo observations */}
          {message.trace.observations && (
            <div>
              <p className="mb-1 font-mono text-xs text-muted-foreground">Photo observations</p>
              <p className="text-xs">{message.trace.observations}</p>
            </div>
          )}

          {/* Escalation */}
          {message.trace.escalationId && (
            <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs">
              <span className="font-medium text-amber-800">Escalation ID: </span>
              <span className="font-mono text-amber-700">{message.trace.escalationId}</span>
            </div>
          )}
        </>
      )}
    </section>
  )
}
