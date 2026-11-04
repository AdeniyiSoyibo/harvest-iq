import { runAdvisor } from '@/lib/agent'
import { normalisePhone, parseLanguage } from '@/lib/channels'

/**
 * POST /api/channels/ussd
 *
 * USSD gateway handler — compatible with Africa's Talking / Twilio USSD format.
 * USSD works on EVERY mobile phone — no internet, no data plan, no smartphone.
 * The farmer dials a short code (e.g. *384#) and uses the phone keypad.
 * Pressing Enter/Send on any phone submits the message.
 *
 * Iowa corn MVP menu structure:
 *   1 → Nitrogen & yellowing
 *   2 → Replant & stand
 *   3 → Disease & fungicide
 *   4 → Weeds & herbicide
 *   5 → Planting & soil
 *   6 → Pests & harvest
 *   7 → Economics
 *   8 → Type your own question
 *
 * Body (Africa's Talking format):
 *   sessionId, phoneNumber, serviceCode, text (accumulated USSD input)
 */
export async function POST(req: Request) {
  const ct = req.headers.get('content-type') ?? ''

  let phoneNumber = ''
  let text = ''
  let language = undefined

  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    const form = await req.formData().catch(() => null)
    if (!form) return ussdResponse('END Something went wrong. Please try again.', false)
    phoneNumber = String(form.get('phoneNumber') ?? form.get('phone') ?? '')
    text = String(form.get('text') ?? '')
    language = parseLanguage(form.get('language'))
  } else {
    const body = await req.json().catch(() => ({}))
    phoneNumber = String(body.phoneNumber ?? body.phone ?? '')
    text = String(body.text ?? '')
    language = parseLanguage(body.language)
  }

  const phone = normalisePhone(phoneNumber)
  if (!phone) return ussdResponse('END Could not identify your number. Please try again.', false)

  const steps = text.split('*').filter(Boolean)

  // ── Main menu (first press or empty) ────────────────────────────────────────
  if (steps.length === 0 || text === '') {
    return ussdResponse(
      'CON Harvest IQ — Iowa Corn Adviser\n' +
      '1. Nitrogen & yellowing\n' +
      '2. Replant & stand\n' +
      '3. Disease & fungicide\n' +
      '4. Weeds & herbicide\n' +
      '5. Planting & soil\n' +
      '6. Pests & harvest\n' +
      '7. Economics\n' +
      '8. Type your question',
      true,
    )
  }

  const first = steps[0]

  // ── Sub-menus (second press) ─────────────────────────────────────────────────
  if (steps.length === 1) {
    if (first === '1') {
      return ussdResponse(
        'CON Nitrogen & Yellowing:\n1. Lost N after rain?\n2. Yellow corn — N or wet feet?\n3. How much N do I need?\n4. Sidedress now or wait?\n5. Type my question',
        true,
      )
    }
    if (first === '2') {
      return ussdResponse(
        'CON Replant & Stand:\n1. Should I replant?\n2. How to count my stand\n3. Hail — wait to decide?\n4. Flooding — will it survive?\n5. Type my question',
        true,
      )
    }
    if (first === '3') {
      return ussdResponse(
        'CON Disease & Fungicide:\n1. Southern rust — spray timing\n2. Tar spot — what is it?\n3. Gray leaf spot vs NCLB\n4. Does fungicide pay?\n5. Type my question',
        true,
      )
    }
    if (first === '4') {
      return ussdResponse(
        'CON Weeds & Herbicide:\n1. Waterhemp escaping\n2. Weed too big to spray\n3. Palmer vs waterhemp ID\n4. Burndown before emergence\n5. Type my question',
        true,
      )
    }
    if (first === '5') {
      return ussdResponse(
        'CON Planting & Soil:\n1. Soil temp to plant corn\n2. How late can I plant?\n3. Cover crop termination\n4. Compaction — spring tillage?\n5. Type my question',
        true,
      )
    }
    if (first === '6') {
      return ussdResponse(
        'CON Pests & Harvest:\n1. Corn aphids — spray?\n2. Rootworm & lodging\n3. Harvest moisture timing\n4. Safe storage moisture\n5. Type my question',
        true,
      )
    }
    if (first === '7') {
      return ussdResponse(
        'CON Economics:\n1. Am I losing money?\n2. Best input ROI\n3. Corn after corn or rotate?\n4. Does late fungicide pay?\n5. Type my question',
        true,
      )
    }
    if (first === '8') {
      return ussdResponse('CON Type your corn question.\nPress Enter or Send when done.', true)
    }
    // Free-text question typed directly
    const result = await runAdvisor({ phone, channel: 'sms', question: first, language })
    return ussdResponse(`END ${result.reply}`, false)
  }

  // ── Map shortcut selections to real questions (third press) ─────────────────
  const second = steps[1]

  const questionMap: Record<string, Record<string, string>> = {
    '1': {
      '1': "It's been raining — have I lost nitrogen and do I need to apply more?",
      '2': 'My corn is yellow after all this rain. Is it nitrogen deficiency or just wet feet?',
      '3': 'How much nitrogen do I really need to grow this corn crop?',
      '4': 'Should I sidedress nitrogen now or wait for the PSNT soil test?',
      '5': '', // free text
    },
    '2': {
      '1': 'My stand is about 24 to 28 plants per 17-foot row. Should I replant?',
      '2': 'How do I measure 1/1000th of an acre to count my corn stand?',
      '3': 'How long should I wait after hail before I decide to replant corn?',
      '4': 'My corn was under water for days — will it survive or do I need to replant?',
      '5': '',
    },
    '3': {
      '1': 'Is it too late to apply a fungicide for southern rust at R3 milk stage?',
      '2': 'What is tar spot and should I spray for it?',
      '3': 'I have long gray-brown lesions on the leaves. Is it northern corn leaf blight?',
      '4': 'Do I really need to spray a fungicide or is my hybrid resistant enough?',
      '5': '',
    },
    '4': {
      '1': 'How do I control waterhemp that keeps escaping my herbicide program?',
      '2': 'My waterhemp got too big before I could spray — what do I do now?',
      '3': 'Is my pigweed Palmer amaranth or just waterhemp? How do I tell?',
      '4': 'Can I tank-mix dicamba with glyphosate for a burndown before corn comes up?',
      '5': '',
    },
    '5': {
      '1': 'What soil temperature do I need before I plant corn and should I watch the forecast?',
      '2': 'How late can I plant corn in Iowa and still get a decent yield?',
      '3': 'How early do I need to terminate my cover crop before planting corn?',
      '4': 'My no-till fields are compacted — will spring tillage fix it?',
      '5': '',
    },
    '6': {
      '1': 'Are corn aphids worth spraying for this late in the season?',
      '2': 'I saw rootworm beetles in my corn. Do I need to treat next year?',
      '3': 'Should I pick 30 percent moisture corn or wait for it to dry down?',
      '4': 'What moisture should I store corn at to avoid spoilage?',
      '5': '',
    },
    '7': {
      '1': 'Am I losing money at these corn prices?',
      '2': 'What is the cheapest way to get a few more bushels — more N, more fungicide, or better seed?',
      '3': 'Should I plant corn after corn or rotate to soybeans next year?',
      '4': "Does a late fungicide application actually pay at today's grain prices?",
      '5': '',
    },
  }

  const question = questionMap[first]?.[second]

  // Free-text option selected — prompt for input
  if (question === '' && steps.length === 2) {
    return ussdResponse('CON Type your corn question.\nPress Enter or Send when done.', true)
  }

  // User typed their own question after selecting free-text
  if ((question === '' || question === undefined) && steps.length >= 3) {
    const userQuestion = steps.slice(2).join(' ')
    const result = await runAdvisor({ phone, channel: 'sms', question: userQuestion, language })
    return ussdResponse(`END ${result.reply}`, false)
  }

  if (!question) return ussdResponse('END Invalid selection. Please dial *384# and try again.', false)

  const result = await runAdvisor({ phone, channel: 'sms', question, language })
  return ussdResponse(`END ${result.reply}`, false)
}

/** Africa's Talking / plain USSD response */
function ussdResponse(body: string, _cont: boolean) {
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
