import { runAdvisor } from '@/lib/agent'
import { MAX_QUESTION, normalisePhone, parseLanguage } from '@/lib/channels'

/**
 * POST /api/channels/sms
 *
 * Accepts JSON body: { phone, text, language? }
 * Also accepts application/x-www-form-urlencoded Twilio-style webhooks:
 *   From=<phone>&Body=<text>&lang=<language>
 *
 * The farmer presses Enter/Send on their phone — this is the universal
 * trigger for all basic/feature phone interactions.
 */
export async function POST(req: Request) {
  let phone: string | null = null
  let text = ''
  let language = undefined

  const ct = req.headers.get('content-type') ?? ''
  if (ct.includes('application/x-www-form-urlencoded')) {
    const form = await req.formData()
    phone = normalisePhone(form.get('From') ?? form.get('phone'))
    text = String(form.get('Body') ?? form.get('text') ?? '').slice(0, MAX_QUESTION)
    language = parseLanguage(form.get('lang') ?? form.get('language'))
  } else {
    const body = await req.json().catch(() => ({}))
    phone = normalisePhone(body.phone)
    text = String(body.text ?? '').slice(0, MAX_QUESTION)
    language = parseLanguage(body.language)
  }

  if (!phone) return Response.json({ error: 'phone is required' }, { status: 400 })
  if (!text.trim()) return Response.json({ error: 'text is required' }, { status: 400 })

  try {
    const result = await runAdvisor({ phone, channel: 'sms', question: text, language })
    return Response.json({ reply: result.reply, status: result.trace.status })
  } catch (e) {
    console.error('[sms route ERROR]', e)
    return Response.json({ error: 'Adviser unavailable. Please try again.' }, { status: 500 })
  }
}
