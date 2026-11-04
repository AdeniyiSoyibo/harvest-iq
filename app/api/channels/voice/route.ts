import { runAdvisor } from '@/lib/agent'
import { MAX_QUESTION, normalisePhone, parseLanguage, twiml, escapeXml, SPEECH_LOCALE } from '@/lib/channels'
import type { Language } from '@/lib/store-legacy'

/**
 * POST /api/channels/voice
 *
 * Accepts JSON: { phone, transcript, language? }
 * Also accepts Twilio-compatible TwiML webhooks: From=, SpeechResult=
 *
 * For basic phones with no data: this route is called by an IVR system
 * (Twilio, Africa's Talking, etc.) that converts the farmer's spoken words
 * to text, passes them here, and reads the reply back aloud via TTS.
 */
export async function POST(req: Request) {
  let phone: string | null = null
  let transcript = ''
  let language: Language | undefined = undefined
  let isTwiml = false

  const ct = req.headers.get('content-type') ?? ''
  if (ct.includes('application/x-www-form-urlencoded')) {
    isTwiml = true
    const form = await req.formData()
    phone = normalisePhone(form.get('From') ?? form.get('phone'))
    transcript = String(form.get('SpeechResult') ?? form.get('transcript') ?? '').slice(0, MAX_QUESTION)
    language = parseLanguage(form.get('lang') ?? form.get('language'))
  } else {
    const body = await req.json().catch(() => ({}))
    phone = normalisePhone(body.phone)
    transcript = String(body.transcript ?? '').slice(0, MAX_QUESTION)
    language = parseLanguage(body.language)
  }

  if (!phone) {
    if (isTwiml) return twiml('<Say>Sorry, we could not identify your phone number. Please call again.</Say>')
    return Response.json({ error: 'phone is required' }, { status: 400 })
  }
  if (!transcript.trim()) {
    if (isTwiml) return twiml('<Gather input="speech" timeout="5" speechTimeout="2"><Say>Please speak your farming question after the tone.</Say></Gather>')
    return Response.json({ error: 'transcript is required' }, { status: 400 })
  }

  try {
    const result = await runAdvisor({ phone, channel: 'voice', question: transcript, language })
    if (isTwiml) {
      const locale = SPEECH_LOCALE[language ?? 'en']
      const safeReply = escapeXml(result.reply)
      return twiml(`<Say language="${locale}">${safeReply}</Say><Pause length="1"/><Gather input="speech" timeout="5" speechTimeout="2"><Say language="${locale}">Do you have another question?</Say></Gather>`)
    }
    return Response.json({ reply: result.reply, status: result.trace.status })
  } catch (e) {
    console.error('[voice route]', e)
    if (isTwiml) return twiml('<Say>Sorry, the adviser is unavailable. Please try again shortly.</Say>')
    return Response.json({ error: 'Adviser unavailable. Please try again shortly.' }, { status: 500 })
  }
}
