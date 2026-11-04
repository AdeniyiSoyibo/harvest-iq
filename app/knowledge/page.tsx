import type { Metadata } from 'next'
import { documents } from '@/lib/knowledge/documents'

export const metadata: Metadata = { title: 'Iowa Corn Knowledge Base — Harvest IQ' }

export default function KnowledgePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Iowa Corn Knowledge Base</h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          The only material Harvest IQ may answer from. Sources: ISU Extension, USDA-ARS, CIMMYT, CGIAR, Crop Protection Network, Purdue, and Cornell.
          Every answer is grounded in these documents and cited. If no document covers the question, the system refuses to answer.
        </p>
      </div>

      <p className="text-sm text-muted-foreground">{documents.length} documents</p>

      <ol className="flex flex-col gap-4">
        {documents.map((doc) => (
          <li key={doc.id} className="rounded-lg border p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{doc.id}</span>
              <span className="rounded bg-muted px-2 py-0.5 text-xs">{doc.region}</span>
              <span className="rounded bg-muted px-2 py-0.5 text-xs capitalize">{doc.topic}</span>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${doc.status === 'validated' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {doc.status === 'validated' ? '✓ Validated' : '⏳ Pending'}
              </span>
            </div>
            <h2 className="mb-1 font-medium">{doc.title}</h2>
            <p className="mb-2 text-sm text-muted-foreground line-clamp-3">{doc.body}</p>
            <div className="mb-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>Source: {doc.source}</span>
              {doc.validatedBy && <span>Validated by: {doc.validatedBy}</span>}
            </div>
            {doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {doc.tags.slice(0, 8).map((tag) => (
                  <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
