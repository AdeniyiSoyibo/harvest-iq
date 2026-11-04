import { runAdvisor, describePhoto } from '@/lib/agent'
import { normalisePhone, parseLanguage } from '@/lib/channels'

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

/**
 * POST /api/channels/photo
 *
 * Accepts multipart/form-data: { phone, image (File), caption?, language? }
 *
 * Workflow:
 * 1. Receive image from the farmer (via WhatsApp, web upload, or MMS gateway).
 * 2. Run vision model to extract observable symptoms (no diagnosis).
 * 3. Pass observations + farmer caption to the RAG agent as context.
 * 4. Return the grounded, cited reply.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null)
  if (!form) return Response.json({ error: 'Multipart form required' }, { status: 400 })

  const phone = normalisePhone(form.get('phone'))
  const caption = String(form.get('caption') ?? '').slice(0, 300)
  const language = parseLanguage(form.get('language'))
  const imageFile = form.get('image')

  if (!phone) return Response.json({ error: 'phone is required' }, { status: 400 })
  if (!(imageFile instanceof File)) return Response.json({ error: 'image file is required' }, { status: 400 })
  if (imageFile.size > MAX_BYTES) return Response.json({ error: 'Image too large (max 5 MB)' }, { status: 413 })

  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  const mediaType = imageFile.type || 'image/jpeg'
  if (!allowed.includes(mediaType)) return Response.json({ error: 'Unsupported image type' }, { status: 415 })

  const imageBytes = new Uint8Array(await imageFile.arrayBuffer())

  // Step 1: Vision — describe what is visually wrong (no diagnosis).
  let observations = caption
  try {
    const vision = await describePhoto(imageBytes, mediaType)
    if (!vision.usable) {
      return Response.json({
        reply: 'The photo was too dark or blurry to read. Please send a clearer photo taken in daylight.',
        status: 'refused',
      })
    }
    observations = vision.observations
      ? `${vision.subject}: ${vision.observations}${caption ? ` (farmer says: ${caption})` : ''}`
      : caption
  } catch {
    // Vision failed — fall back to caption-only mode, still grounded via RAG.
    observations = caption || 'No observations available'
  }

  // Step 2: RAG agent — grounded, cited answer based on visual observations.
  try {
    const result = await runAdvisor({ phone, channel: 'photo', question: caption, language, observations })
    return Response.json({ reply: result.reply, status: result.trace.status })
  } catch (e) {
    console.error('[photo route]', e)
    return Response.json({ error: 'Adviser unavailable. Please try again shortly.' }, { status: 500 })
  }
}
