import 'server-only'
import { getEscalations, resolveEscalation } from '@/lib/store-legacy'

export async function GET() {
  return Response.json(getEscalations())
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { id, advisorReply } = body
  if (!id) return Response.json({ error: 'id is required' }, { status: 400 })
  const updated = resolveEscalation(id, advisorReply ?? '')
  if (!updated) return Response.json({ error: 'escalation not found' }, { status: 404 })
  return Response.json(updated)
}
