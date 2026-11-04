import 'server-only'
import { type Conversation, type Escalation, getConversation, getEscalations } from '@/lib/store-legacy'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const phone = url.searchParams.get('phone')
  if (phone) {
    const conv = getConversation(phone)
    return Response.json(conv ?? { messages: [] })
  }
  // Return all conversations (advisor view)
  const { getAllConversations } = await import('@/lib/store')
  return Response.json(getAllConversations())
}
