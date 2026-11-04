export type ValidationStatus = 'validated' | 'pending'
export type Topic =
  | 'nitrogen'
  | 'replant'
  | 'disease'
  | 'weeds'
  | 'planting'
  | 'pests'
  | 'harvest'
  | 'economics'
  | 'cover-crops'
  | 'soil'

export interface KnowledgeDocument {
  id: string
  title: string
  topic: Topic
  region: string
  source: string
  validatedBy: string
  validatedOn: string
  status: ValidationStatus
  tags: string[]
  body: string
}

export const documents: KnowledgeDocument[] = [

  // ── NITROGEN & YELLOWING ────────────────────────────────────────────────────

  {
    id: 'KB-N-LOSS',
    title: 'Nitrogen loss after heavy rain',
    topic: 'nitrogen',
    region: 'Iowa, USA',
    source: 'ISU Extension "Wet, Yellow, and Worried About Nitrogen"',
    validatedBy: 'ISU Extension Agronomist / USDA-ARS',
    validatedOn: '2026-04-01',
    status: 'validated',
    tags: ['nitrogen loss', 'denitrification', 'leaching', 'rescue N', 'raining', 'lost nitrogen', 'apply more nitrogen', 'wet soil', 'supplemental nitrogen'],
    body: `Yes, heavy rain can wash nitrogen out of your field — but don't panic yet. There are two ways rain takes nitrogen away: it can float off as a gas when soil stays flooded (that's called denitrification), or it can wash down past the roots (leaching). Sandy soils lose nitrogen faster. Tight clay soils hold it better but tile-drained fields can still lose some.

Here's the good news: wait until your soil dries out and watch your corn for 5 to 7 days. If the plants green back up and start growing strong, your nitrogen is probably fine. Many fields recover on their own without any extra fertilizer.

If the lower leaves stay yellow with a V-shape yellowing after the soil dries, that's a sign you may have lost too much nitrogen. At that point, pull a soil sample and get a PSNT (late spring nitrate test) done — it will tell you for sure whether you need to apply more. Don't apply rescue nitrogen before you have that answer. Spending money on nitrogen you don't need is just waste. Your ISU Extension office can help with the test.`,
  },

  {
    id: 'KB-N-YELLOW',
    title: 'Yellow corn after rain: nitrogen problem or just wet roots?',
    topic: 'nitrogen',
    region: 'Iowa, USA',
    source: 'ISU Extension nitrogen decision framework',
    validatedBy: 'ISU Extension Plant & Soil Scientist',
    validatedOn: '2026-04-10',
    status: 'validated',
    tags: ['yellow corn', 'yellowing', 'N deficiency', 'wet feet', 'saturated soil', 'root activity', 'nitrogen deficiency', 'wet roots', 'pale corn'],
    body: `Yellow corn after a big rain is very common, and most of the time it's not a nitrogen problem — it's just wet roots. When soil stays soaked, the roots shut down because they can't breathe. The plant can't pull up water or nutrients even if they're right there in the soil. This makes the whole plant look pale and stressed.

How to tell the difference: nitrogen-deficient corn turns yellow starting at the tip of the bottom leaves, with a yellow V-shape pointing toward the stalk. Wet-feet corn turns yellow more evenly across the plant and often turns a little purple at the base of the stalk.

The best advice: wait 5 to 7 days after the soil drains. If the corn greens up and starts growing again, you had wet roots — no action needed. If the bottom leaves stay yellow with that V-shape after the soil dries out, your corn may actually be short on nitrogen. Get a PSNT soil test before you spend money on extra fertilizer.`,
  },

  {
    id: 'KB-N-RATE',
    title: 'How much nitrogen does your Iowa corn really need?',
    topic: 'nitrogen',
    region: 'Iowa, USA',
    source: 'ISU nitrogen rate trials / USDA-ARS Corn Belt N research',
    validatedBy: 'ISU Extension Agronomist',
    validatedOn: '2026-03-15',
    status: 'validated',
    tags: ['nitrogen rate', 'N rate', 'optimum N', 'yield goal', 'N per bushel', 'how much nitrogen', 'fertilizer rate', 'MRTN'],
    body: `The old rule of thumb — 1.2 pounds of nitrogen per bushel of corn you want to grow — usually over-applies nitrogen and wastes money. ISU Extension recommends using the Maximum Return to Nitrogen (MRTN) method instead. It figures out the most profitable rate based on what nitrogen costs and what corn is selling for.

For most Iowa fields, that works out to somewhere between 140 and 200 pounds of nitrogen per acre. Fields that had soybeans the year before need less — usually 140 to 160 pounds. Corn grown after corn needs more — usually 160 to 200 pounds. Fields with a lot of organic matter in the soil can often get by with less because the soil itself releases nitrogen as it warms up.

Don't forget to count all your nitrogen sources: starter fertilizer, anhydrous ammonia, UAN, and any manure you put on. The free ISU Corn Nitrogen Rate Calculator at corn.agron.iastate.edu can help you dial in the right rate for your specific situation and prices.`,
  },

  {
    id: 'KB-N-SIDEDRESS',
    title: 'Sidedress nitrogen timing: PSNT and LSNT',
    topic: 'nitrogen',
    region: 'Iowa, USA',
    source: 'ISU "In-Season Nitrogen Management" / ISU CROP 3140',
    validatedBy: 'ISU Extension Soil Fertility Specialist',
    validatedOn: '2026-04-20',
    status: 'validated',
    tags: ['sidedress', 'sidedress timing', 'PSNT', 'LSNT', 'late spring nitrate test', 'in-season nitrogen', 'when to sidedress', 'tissue testing', 'nitrogen tools', 'supplemental N'],
    body: `Sidedress nitrogen is applied when corn is about knee-high (V4 to V6 growth stage). It's a smart strategy because by then you can see what the field looks like and decide if you actually need it.

The best tool to decide is the Pre-Sidedress Nitrate Test, or PSNT. You pull a 12-inch soil sample in early June when corn is at V4 to V6. If the result comes back above 25 ppm, you have plenty of nitrogen — skip the sidedress and save the money. If it's below 20 ppm, apply nitrogen. If it's between 20 and 25 ppm, it's a judgment call.

You can also look at the corn itself. Pull a stalk sample and send it to a lab — that tells you what the plant is actually seeing, not just what's in the soil. Your eyes help too, but a soil or tissue test is always more reliable when the decision is close. Don't guess on nitrogen — it's one of your biggest input costs.`,
  },

  {
    id: 'KB-N-DEFICIENCY-VISUAL',
    title: 'Spotting nutrient problems by looking at your corn leaves',
    topic: 'nitrogen',
    region: 'Iowa, USA',
    source: 'ISU IPM nitrogen deficiency page / ISU potassium and sulfur deficiency articles',
    validatedBy: 'ISU Extension Plant Pathologist / Agronomist',
    validatedOn: '2026-03-20',
    status: 'validated',
    tags: ['yellow leaves', 'leaf midrib', 'lower leaves', 'N deficiency', 'nitrogen deficiency', 'potassium deficiency', 'leaf margins', 'sulfur deficiency', 'interveinal chlorosis', 'new leaves', 'green veins', 'sulfur', 'twisted whorl', 'pale yellow'],
    body: `Your corn leaves are telling you something — here's how to read them.

Nitrogen shortage: the bottom leaves turn yellow starting at the tip, with a yellow V-shape that points toward the stalk. It shows on the old leaves first because nitrogen moves out of old leaves to feed new growth. If you see this on the lower leaves after the soil has dried out, nitrogen may be limiting your yield.

Potassium shortage: the edges of the lower leaves turn yellow and then brown, like they've been scorched. The middle of the leaf stays green. This shows on older leaves first too.

Sulfur shortage: the new, upper leaves look striped — yellow between the veins but the veins stay green. This is different from nitrogen because sulfur problems show on the youngest leaves first, not the bottom ones.

Twisted or pale new leaves: if the corn whorl looks twisted or tangled and the new leaves came out pale, that's usually from a temperature swing — warm then suddenly cold. It's not a nutrient problem. The plant will straighten out on its own as it grows through it. No action needed.`,
  },

  {
    id: 'KB-N-SAMPLING',
    title: 'How often should you pull soil samples for nitrogen?',
    topic: 'nitrogen',
    region: 'Iowa, USA',
    source: 'FarmProgress agronomist Q&A / ISU Extension soil sampling guide',
    validatedBy: 'Certified Crop Adviser (CCA)',
    validatedOn: '2026-04-05',
    status: 'validated',
    tags: ['soil sampling', 'soil samples', 'sampling frequency', 'four years', 'N recommendation', 'soil test', 'phosphorus', 'potassium', 'pH'],
    body: `For phosphorus, potassium, and soil pH, pulling soil samples every four years is enough for most Iowa corn fields. If your fields have a lot of variation, or you're putting on manure, sample more often — every two years gives you better data to work with.

Nitrogen is different. A fall or winter soil test will NOT reliably tell you how much nitrogen your corn will need next summer. Nitrogen moves around too much with rainfall and temperature to predict months ahead. The right tool for nitrogen is the PSNT — a soil test you pull in early June when corn is at V4 to V6. That test tells you what nitrogen is actually available right when your corn needs it most.

When you pull samples, go 0 to 6 inches deep for phosphorus and potassium, and 0 to 12 inches deep for the PSNT. Pull samples from the same spots every time so you can track trends year over year.`,
  },

  // ── REPLANT & STAND ASSESSMENT ─────────────────────────────────────────────

  {
    id: 'KB-REPLANT-DECISION',
    title: 'Should you replant your corn? How to decide',
    topic: 'replant',
    region: 'Iowa, USA',
    source: 'ISU regional crop update / Pioneer stand evaluation guide / FarmProgress',
    validatedBy: 'ISU Extension Corn Specialist',
    validatedOn: '2026-05-01',
    status: 'validated',
    tags: ['replant', 'replant threshold', 'stand count', 'replant economics', 'yield potential', 'stand uniformity', 'should I replant', 'poor stand', 'emergence', 'stand evaluation', 'replant factors', 'plant health', 'replant costs'],
    body: `Replanting costs real money — seed, extra passes, herbicide, and you lose time. Before you pull the trigger, walk the field and honestly answer four questions.

First: how many plants do you have per acre? Stands above 28,000 to 30,000 plants per acre almost never benefit from replanting. Stands between 20,000 and 27,000 will lose some yield — maybe 5 to 10 percent — but the replant cost often eats up that gain. Stands below 20,000 are worth a serious look at replanting.

Second: how even is the stand? Big gaps hurt more than an even thin stand. A field with 24,000 plants spread evenly will outyield the same count with long empty stretches.

Third: are the surviving plants healthy? Dig up 10 to 20 plants from the problem spots. If the growing point — the little cream-colored nub below ground — is firm and white, those plants will make it. Brown or mushy means they're gone.

Fourth: what's the date? Every day after May 15th costs you about half a bushel to a full bushel per acre in replanted corn. A replant after May 25th rarely catches up to the original stand. Partial replanting of just the bad spots — wet draws, low areas — is usually smarter than replanting the whole field.`,
  },

  {
    id: 'KB-STAND-COUNT',
    title: 'How to count your corn stand (1/1000 acre method)',
    topic: 'replant',
    region: 'Iowa, USA',
    source: 'ISU "Evaluation of Crop Stand after Emergence" / Renk Seed EARFULL',
    validatedBy: 'ISU Extension Agronomist',
    validatedOn: '2026-05-05',
    status: 'validated',
    tags: ['stand count', '1/1000 acre', 'row spacing', 'count plants', 'how to count', 'plants per acre', 'emergence percentage', 'replant trigger', '24 plants', '31 plants'],
    body: `Here's the quick way to count your stand in 30-inch rows. Measure out 17 feet and 5 inches of row. Count every plant in that length. The number you count equals roughly your plants per thousand square feet — multiply by 1,000 and you have plants per acre.

So if you count 28 plants in that 17-foot-5-inch stretch, you have about 28,000 plants per acre. That's a solid stand. If you count 24 plants, you're at 24,000 — thin but often still worth keeping. If you count fewer than 20 plants, start thinking seriously about whether to replant.

Count at least 3 to 5 different spots in the field and average them together. Make sure you check both the good areas and the bad areas — don't just count where it looks worst or best. A stand of 24 to 27 plants that's fairly even across the field is usually worth keeping, especially if it's past May 10th and replanting would push you into late-planted territory.`,
  },

  {
    id: 'KB-REPLANT-MISC',
    title: 'Replant questions answered: insurance, hail, flooding, GDUs, starter fertilizer',
    topic: 'replant',
    region: 'Iowa, USA',
    source: 'Beck\'s Hybrids FAQ / ISU / JenREESources / NewAgTalk / ISU regional crop update',
    validatedBy: 'ISU Extension / Certified Crop Adviser',
    validatedOn: '2026-05-08',
    status: 'validated',
    tags: ['starter fertilizer', 'replant starter', 'crop insurance', 'replant clause', 'partial replant', 'seed rot', 'draws', 'seeps', 'GDU', 'imbibitional chilling', 'cool wet', 'April planting', 'hail', 'hail recovery', 'growing point', 'flooding', 'flood', 'under water', 'herbicide residual', 'kill existing stand'],
    body: `Starter fertilizer on a replant: if you already put starter fertilizer in the ground on the first planting, you don't need to re-apply a full rate. The nutrients are still there. A lighter rate or no in-furrow starter is fine if your soil test is decent.

Crop insurance and replanting: call your crop insurance agent BEFORE you destroy the stand. Most policies have a replant payment, but you usually have to get an adjuster out first. Destroying the stand without calling first can cost you that payment.

Hail damage: the best advice is wait 7 to 10 days before making any replant decision after a hailstorm. Corn is tougher than it looks. Split a lower stalk with a knife — if the growing point inside is firm and cream-colored, the plant will recover. A brown, soft, or foul-smelling growing point means the plant is dead.

Flooding: corn can survive 2 to 3 days under water if temperatures are below 77°F. When water recedes, give it 5 to 7 days before you decide anything. Check the growing points — same test as hail.

Slow emergence after a cool, wet April: corn needs about 100 to 120 heat units (GDUs) to emerge after planting. Cold rain after planting slows things down but doesn't mean the seed is dead. Dig up 5 to 10 seeds and check — if the seed is swollen and the small white shoot is moving, it will come up when things warm up.

Seed rotted in wet draws: replant those patches if they're big enough to justify a pass. For scattered small spots, it's usually not worth the cost.`,
  },

  // ── DISEASE & FUNGICIDE ─────────────────────────────────────────────────────

  {
    id: 'KB-DIS-SOUTHERN-RUST',
    title: 'Southern rust: what it looks like and when to spray',
    topic: 'disease',
    region: 'Iowa, USA',
    source: 'ISU southern rust article / Crop Protection Network / ISU plant pathology',
    validatedBy: 'ISU Extension Plant Pathologist / USDA-ARS',
    validatedOn: '2026-07-01',
    status: 'validated',
    tags: ['southern rust', 'rust', 'fungicide', 'fungicide timing', 'R3 milk stage', 'spray timing', 'every year', 'epidemiology', 'overwintering', 'spore movement', 'VG-E rating', 'fungicide efficacy', 'residual', 'too late', 'second application', 'ROI', 'upper canopy'],
    body: `Southern rust blows up from the South on storm systems every summer — it doesn't survive Iowa winters, so every year starts fresh. It shows up as tiny, bright orange-tan pustules on the top surface of the leaves. They're smaller and rounder than common rust, and they pack together densely. A bad case can cause leaves to die early and cut your yield noticeably.

The best time to spray a fungicide for southern rust is at tassel to silking (VT to R1). That protects the ear leaf and the canopy right when grain fill starts — that's where your yield comes from. A good fungicide at that timing gives you 35 to 42 days of protection.

If it's already R3 (the milk stage, when kernels are filled with milky liquid), spraying is marginal. Most of the grain fill window has already passed. It might still pay if prices are high and disease pressure is severe, but the return on investment drops a lot compared to spraying at VT-R1.

Southern rust doesn't hit every Iowa field every year — in some years spores never make it this far north. Scout your fields and confirm the disease before you spend the money. Don't spray just because your neighbor did.`,
  },

  {
    id: 'KB-DIS-FOLIAR',
    title: 'Telling corn diseases apart: gray leaf spot, NCLB, tar spot, bacterial leaf streak',
    topic: 'disease',
    region: 'Iowa, USA',
    source: 'ISU corn disease identification guide / ISU disease field guide / ISU tar spot resources',
    validatedBy: 'ISU Extension Plant Pathologist',
    validatedOn: '2026-07-10',
    status: 'validated',
    tags: ['gray leaf spot', 'GLS', 'northern corn leaf blight', 'NCLB', 'cigar-shaped', 'tar spot', 'Phyllachora maydis', 'bacterial leaf streak', 'brown spots', 'rings', 'long gray lesions', 'black spots', 'wavy lesions', 'backlit', 'halo', 'fungicide response', '5% threshold', 'Forcivo', 'modes of action', 'MOA'],
    body: `It really matters which disease you have before you spray — because one of them won't respond to fungicide at all.

Gray leaf spot: rectangular tan-to-gray spots with straight sides running between the veins. They look like little bricks. Common in warm, humid nights. Starts on the lower leaves and moves up.

Northern corn leaf blight (NCLB): big cigar-shaped gray-green lesions, 3 to 6 inches long. Hard to miss. Worse in cool, cloudy, wet weather.

Bacterial leaf streak: looks a lot like gray leaf spot but the edges of the lesions are wavy, not straight. If you hold the leaf up to sunlight, you'll see a yellow halo around the edge. This one is caused by bacteria — fungicides will not help. Save your money if this is what you have.

Tar spot: flat, shiny black spots pressed into the leaf surface. They cannot be rubbed off with your finger, unlike rust pustules. Often surrounded by a tan or brown ring. This disease can be devastating in a bad year. If you see tar spot on 5 percent or more of your upper leaves at or before tasseling, that's your cue to spray. Use a fungicide with two or three modes of action — a single active ingredient won't cut it for tar spot.`,
  },

  {
    id: 'KB-DIS-FUNGICIDE-PROGRAM',
    title: 'Should you spray a fungicide on your corn? How to decide',
    topic: 'disease',
    region: 'Iowa, USA',
    source: 'ISU "Before Applying Fungicides to Corn" / ISU fungicide scouting guide / FarmProgress',
    validatedBy: 'ISU Extension Plant Pathologist / Crop Economist',
    validatedOn: '2026-06-20',
    status: 'validated',
    tags: ['fungicide profitability', 'hybrid resistance', 'susceptible hybrid', 'scouting', 'before tasseling', 'ear leaf', 'fungicide timing', 'VT', 'R1', 'ROI', 'fungicide cost', 'grain price', 'does fungicide pay'],
    body: `A fungicide pass costs $15 to $30 per acre. To make that money back at $4.50 corn, you need at least 3 to 5 extra bushels per acre. That doesn't happen every year, so it's worth asking three questions before you spray.

First: is your hybrid susceptible to disease? If your seed tag shows a good disease resistance rating, fungicide rarely pencils out. Susceptible hybrids can respond 5 to 15 bushels per acre in a bad disease year.

Second: is disease already in your field before tasseling? Walk into the field around V14 to VT and look at the ear leaf and the leaves just above and below it. If gray leaf spot, NCLB, southern rust, or tar spot has already reached that zone at 5 percent or more coverage on a susceptible hybrid, the economics for spraying are in your favor.

Third: do the numbers work? At $4 to $5 corn, you need that 3 to 5 bushel response to break even. In a low-disease year with a resistant hybrid, that response often doesn't show up. Spraying after R3 rarely pays at today's corn prices. The sweet spot is always VT to R1 with confirmed disease present.`,
  },

  // ── WEEDS & HERBICIDE ───────────────────────────────────────────────────────

  {
    id: 'KB-WEED-WATERHEMP',
    title: 'Waterhemp in Iowa corn: getting control when it keeps escaping',
    topic: 'weeds',
    region: 'Iowa, USA',
    source: 'ISU waterhemp management / ISU herbicide resistance perspectives / AGDAILY',
    validatedBy: 'ISU Weed Science Extension Specialist',
    validatedOn: '2026-05-15',
    status: 'validated',
    tags: ['waterhemp', 'herbicide resistance', 'pre-emergence', 'escape', 'control waterhemp', 'metabolic resistance', 'late emergence', 'second application', 'low-tier program', 'herbicide program diversity', 'Palmer amaranth', 'pigweed', 'identification', 'waterhemp vs Palmer'],
    body: `Waterhemp is the toughest weed in Iowa corn because it has developed resistance to most of the herbicides farmers use. If it keeps escaping your program year after year, here's how to figure out why.

If escapes are different sizes and scattered across the field, timing is probably the problem — later flushes of waterhemp emerged after your residual wore off. If the escapes are all roughly the same size and look completely healthy, you likely have resistant plants that the herbicide can't kill regardless of timing. Send samples to the ISU weed lab to confirm.

The single most important step: never skip a pre-emergence residual. A Group 15 herbicide (acetochlor, s-metolachlor, or pyroxasulfone) applied at or before planting controls waterhemp for 4 to 6 weeks. Without it, post-emerge programs struggle badly. Think of the pre-em as your foundation — everything else is built on top of it.

Spray waterhemp before it reaches 4 inches tall — about the size of a pop can. Above that size, control drops off fast. If it got too big before you could spray, your options are limited and a perfect kill is unlikely.

Palmer amaranth versus waterhemp: look at the leaf stalk. On Palmer, the leaf stalk is as long as or longer than the leaf. On waterhemp, it's shorter. Palmer is a regulated weed in Iowa — report new infestations.`,
  },

  {
    id: 'KB-WEED-APPLICATION',
    title: 'Getting better results from your herbicide applications',
    topic: 'weeds',
    region: 'Iowa, USA',
    source: 'ISU spray application guide / EPA label / ISU weed guide',
    validatedBy: 'ISU Extension Weed Scientist',
    validatedOn: '2026-05-20',
    status: 'validated',
    tags: ['spray volume', 'carrier volume', 'droplet size', 'adjuvant', 'herbicide coverage', 'burndown', 'tank mix', 'dicamba', 'glyphosate', 'pre-emergence', 'weed height', 'post-emergence timing', 'volunteer corn', 'dropped ears'],
    body: `Coverage matters as much as which herbicide you choose. For post-emerge applications on small broadleaf weeds like waterhemp, use 15 to 20 gallons of water per acre. Going lower saves time but misses small plants.

Always use the right additive. With glyphosate, add ammonium sulfate (AMS) to the tank. With contact herbicides like Group 14 products, add a crop oil concentrate or methylated seed oil. Read the label — the additive makes a real difference in how well the product sticks and absorbs.

For a burndown before corn emerges, dicamba mixed with glyphosate knocks down winter weeds effectively. Use only dicamba products labeled for corn preplant. Do not apply within a week of corn emergence.

Timing is everything: spray weeds smaller than 4 inches for best results. Waterhemp at 6 inches is very hard to kill cleanly with any post-emerge program.

Volunteer corn from the previous year's dropped ears cannot be controlled with corn herbicides — no product registered for use in corn will kill corn. Your only good options are rotating to soybeans (where grass herbicides will take it out), mechanical cultivation, or hand-pulling problem areas.`,
  },

  // ── PLANTING & EMERGENCE ────────────────────────────────────────────────────

  {
    id: 'KB-PLANT-TIMING',
    title: 'When to plant corn in Iowa: soil temperature, timing, and hybrid maturity',
    topic: 'planting',
    region: 'Iowa, USA',
    source: 'ISU planting date studies / ISU "Soil Temperature and Planting Conditions" / Latham Seeds',
    validatedBy: 'ISU Extension Corn Agronomist',
    validatedOn: '2026-04-01',
    status: 'validated',
    tags: ['50°F', 'soil temperature', 'planting date', 'imbibitional chilling', 'warming trend', 'late planting', 'yield penalty', 'May 15', 'May 20', 'May 31', 'June 1', 'hybrid maturity', 'relative maturity', 'RM', 'earlier hybrid', 'no-till slow', 'residue', 'soil warming', 'early planting'],
    body: `The magic number for planting corn is 50°F soil temperature at 2-inch depth — but the direction things are moving matters just as much as the number. If soils are at 50°F and warming, go ahead and plant. If soils are at 50°F but a cold rain is coming, wait. Cold water hitting seed that just started to absorb moisture — called imbibitional chilling — can injure or kill the seed. Check the ISU Mesonet at mesonet.agron.iastate.edu for current Iowa soil temperatures before you start.

The best planting window in Iowa is April 20 to May 10. That's when your yield potential is highest. After May 15, you start losing about half a bushel to a full bushel per acre per day. After June 1, those losses accelerate.

If you're planting after May 20, think about switching to an earlier-maturing hybrid. Drop your relative maturity (RM) by 5 to 7 days for every 5-day delay after May 20. That gets the crop to maturity before fall frost. After May 31, step down at least 5 RM units.

No-till fields warm up slower than tilled ground — often 2 to 5°F cooler — because the residue shades the soil. Be patient and let the soil warm rather than planting into cold, wet no-till ground. A few extra days of patience pays off in more even emergence.`,
  },

  {
    id: 'KB-PLANT-DEPTH',
    title: 'Planting depth and row cleaners in Iowa corn',
    topic: 'planting',
    region: 'Iowa, USA',
    source: 'ISU planting depth guidance / NewAgTalk equipment discussion',
    validatedBy: 'ISU Extension Precision Ag Specialist',
    validatedOn: '2026-04-15',
    status: 'validated',
    tags: ['planting depth', 'dry spring', 'wet spring', 'emergence uniformity', 'row cleaners', 'residue management', 'soil warming', 'no-till', 'seed depth'],
    body: `Plant corn 1.5 to 2 inches deep in most Iowa conditions. That puts the seed in firm, moist soil and gives you even emergence. In a dry spring, go a little deeper — 2 to 2.5 inches — to reach moisture. In a wet, cold spring, stay at 1.5 inches. Planting deeper than 2.5 inches in cold, wet soil slows emergence and raises the chance of seedling disease.

Always check your actual planting depth in the field early on — pull up seeds from a few planter units and measure. Don't just trust the gauge wheel setting.

Row cleaners on no-till planters really do help. By sweeping 2 to 4 inches of residue off the row, you let sunlight hit the soil surface directly. That warms the planting zone 1 to 3°F faster than leaving residue in place, which means more even, faster emergence in cool springs. Don't over-adjust them — clearing too wide a strip can create residue wads and cause problems.`,
  },

  // ── PESTS & SCOUTING ────────────────────────────────────────────────────────

  {
    id: 'KB-PEST-APHID',
    title: 'Corn aphids: when to spray and when to leave them alone',
    topic: 'pests',
    region: 'Iowa, USA',
    source: 'ISU regional crop update / ISU insect threshold guide / The Daily Scoop',
    validatedBy: 'ISU Extension Entomologist',
    validatedOn: '2026-08-01',
    status: 'validated',
    tags: ['corn aphid', 'aphid', 'threshold', 'late season', 'treatment', 'spray aphids', 'insecticide', 'fungicide pass', 'brown silk', 'hard dent', '500 per plant', 'worth treating'],
    body: `Corn aphids build up fast in late summer, but most populations never reach the point where spraying pays. Before you spray, count what you actually have.

The action threshold is 500 or more aphids per plant, at least half the plants in the field are infested, AND you're seeing them between tasseling and the dough stage (R4). If you spot ladybugs, lacewings, or parasitic wasps working the field, they'll often knock the population down on their own — hold off and check again in a few days.

Once corn reaches hard dent (R5) or beyond, aphids have almost no impact on yield. The grain is basically done filling. Spraying at that point is just money out the window.

If you're planning a fungicide pass at VT to R1, you can add an insecticide to the tank if aphid counts justify it at that time — but don't add insecticide just as a precaution. It kills the beneficial insects that would have controlled aphids for free.`,
  },

  {
    id: 'KB-PEST-ROOTWORM',
    title: 'Corn rootworm: scouting beetles and protecting next year\'s crop',
    topic: 'pests',
    region: 'Iowa, USA',
    source: 'ISU rootworm management / FarmProgress',
    validatedBy: 'ISU Extension Entomologist',
    validatedOn: '2026-07-15',
    status: 'validated',
    tags: ['corn rootworm', 'rootworm beetle', 'beetle counts', 'rotation', 'lodging', 'rootworm damage', 'stalk strength', 'next year', 'economic threshold', 'rotation resistance'],
    body: `Rootworm beetles emerge in late July and August. Adult beetles can clip silks and mess up pollination when populations are high — but the real damage happened underground months earlier when larvae fed on the roots.

Goose-necked corn — plants bent at the base in a curved shape — in late summer is the classic sign of rootworm root damage. If you're seeing a lot of it in a corn-after-corn field, plan on using a soil insecticide or a Bt rootworm trait next year.

To decide whether to treat next year, count beetles in August. Walk the field and count beetles on silks from 25 plants across 5 locations. If you average 0.75 or more beetles per plant in a corn-after-corn field, a soil insecticide or rootworm-traited hybrid is justified for next season. Below 0.5 beetles per plant, treatment usually doesn't pay.

One heads-up for Iowa: some western corn rootworm populations have figured out crop rotation. If you're seeing significant root damage in first-year corn following soybeans, you may have rotation-resistant rootworm in that field. Talk to your seed dealer or ISU Extension about management options.`,
  },

  {
    id: 'KB-PEST-OTHER',
    title: 'Black cutworm and Japanese beetle in Iowa corn',
    topic: 'pests',
    region: 'Iowa, USA',
    source: 'ISU moth trapping network / ISU insect threshold guide',
    validatedBy: 'ISU Extension Entomologist',
    validatedOn: '2026-05-20',
    status: 'validated',
    tags: ['black cutworm', 'moth trapping', 'migratory pest', 'cutworm', 'Japanese beetle', 'silk clipping', 'pollination', 'beetle threshold', 'silks'],
    body: `Black cutworm moths ride storm systems north from the South in late March and April, lay eggs in fields with weedy cover, and their caterpillars cut off young corn plants at or below the soil surface in May. ISU runs a statewide moth trapping network to predict when cutting will start — about 30 or more days after the peak moth flight. If you're in a high-risk area (low spots, fields with winter annuals), scout V1 to V5 corn in late April through May. If 3 percent or more plants are cut, treatment is warranted.

Japanese beetles can become a problem on corn silks during pollination. They clip the silks short, which prevents pollen from reaching the ear. Count beetles on 25 ears across the field. If you're averaging 3 or more beetles per ear, silks are being clipped to less than half an inch, and pollen is still actively shedding, treatment makes sense. If pollen shed is more than halfway done, leave them alone — the damage is done and the beetles are just feeding on spent silks at that point.`,
  },

  // ── HARVEST & STORAGE ───────────────────────────────────────────────────────

  {
    id: 'KB-HARVEST-STORAGE',
    title: 'Iowa corn harvest and storage: moisture, drying, shrink, and winter care',
    topic: 'harvest',
    region: 'Iowa, USA',
    source: 'ISU "Grain Drying Considerations" / ISU Field & Feedlot guide / ISU grain storage recommendations',
    validatedBy: 'ISU Extension Grain Systems Specialist',
    validatedOn: '2026-09-01',
    status: 'validated',
    tags: ['harvest moisture', 'artificial drying', 'drying cost', 'field drydown', '30% moisture', 'safe storage', '15% moisture', 'aeration', 'winter storage', 'frost risk', 'black layer', 'combine settings', 'concave', 'rotor speed', 'shrink', 'shrink factor', 'when to harvest', 'dry down', '18% corn'],
    body: `The sweet spot for harvesting Iowa corn is around 18 to 22 percent moisture. That's dry enough to handle well but not so dry that you've left yield in the field from stalk lodging or ear drop. Drying from 20 percent down to 15 percent costs roughly 17 to 18 cents per bushel in propane. Waiting for the field to do that work costs you nothing in energy but risks stalk quality and weather delays.

Harvesting at 30 percent is possible but expensive. Drying from 30 to 15 percent costs 45 to 60 cents per bushel — that's a big number. Only makes sense if lodging risk is high or fall prices are significantly better than spring prices.

Shrink: every point of moisture you dry out costs you about 1.35 percent of the weight of that grain. Drying 3,000 bushels from 18 to 15 percent (3 points) costs you about 120 bushels of weight. That's real money — factor it into your harvest timing decision.

Safe storage moisture is 15 percent for corn you'll hold through summer, and 14 percent for longer storage. Anything wetter than 15 percent in winter storage needs close watching. Run your aeration fans in October and November to cool the grain core down to 20 to 30°F — cold grain stays in much better condition.

Frost before black layer: a hard freeze (28°F for several hours) before the kernel tip turns black can stop grain fill early. The corn will dry down fast in the field, but test weight may be lower and mold risk goes up. Check a few ears 5 to 7 days after frost — if the black layer is already there, grain fill was complete and you're fine.

Combine settings for high-moisture corn: slow the rotor or cylinder speed down to 300 to 400 rpm. Open the concave wider than your dry settings. High-moisture corn cracks easily at standard settings and you'll leave quality on the table.`,
  },

  // ── ECONOMICS & DECISIONS ──────────────────────────────────────────────────

  {
    id: 'KB-ECON',
    title: 'Iowa corn economics: breakeven, input returns, and rotation decisions',
    topic: 'economics',
    region: 'Iowa, USA',
    source: 'ISU corn enterprise budgets / FarmProgress / ISU rotation economics / NewAgTalk',
    validatedBy: 'ISU Extension Farm Management Specialist',
    validatedOn: '2026-04-01',
    status: 'validated',
    tags: ['cost of production', 'breakeven', 'margin', 'losing money', 'corn prices', 'input ROI', 'yield response', 'partial budget', 'nitrogen ROI', 'fungicide ROI', 'crop rotation', 'corn after corn', 'soybean rotation', 'yield penalty', 'breakeven price'],
    body: `Iowa corn costs roughly $700 to $950 per acre all-in (cash costs plus land and equipment). At a 200-bushel yield, a $700 cash cost means you need about $3.50 corn to cover your variable costs. At $915 per acre total cost and 220 bushels, you need around $4.15 corn to break even on everything.

When corn is at $4.00 to $4.50 per bushel, most Iowa farms are running right at or just below breakeven on corn. At $3.50 corn, cash flow gets tight for most operations.

Where do extra dollars come from? ISU research shows the best bang for your buck in this order: getting your hybrid right for the field, hitting the correct nitrogen rate (not over-applying), and having a solid pre-emergent weed program. Fungicides, extra nitrogen above the MRTN, and additional passes have the lowest return on investment in most years.

Corn after corn: growing corn on the same ground year after year costs you 10 to 15 bushels per acre on average from rootworm pressure, residue diseases, and nitrogen inefficiency. Add a soil insecticide and you add $20 to $30 per acre in cost. Meanwhile, soybeans have been returning more than corn on most Iowa cash-rented ground since 2020.

If you're losing money at current prices, the first place to look is land cost and input rates — not yield. Cutting nitrogen, fungicide, or seed to the bone often makes things worse, not better.`,
  },

  // ── COVER CROPS & COMPACTION ────────────────────────────────────────────────

  {
    id: 'KB-COVER-CROP',
    title: 'Cover crops before corn: when to terminate and what to watch for',
    topic: 'cover-crops',
    region: 'Iowa, USA',
    source: 'ISU "Terminating cover crops ahead of corn" / Iowa Soybean Association',
    validatedBy: 'ISU Extension Agronomist',
    validatedOn: '2026-04-10',
    status: 'validated',
    tags: ['cover crop', 'terminate', 'termination timing', '10 days before planting', 'planting green', 'dry spring', 'moisture', 'shorter season corn', 'herbicide corn'],
    body: `Kill your cover crop at least 10 to 14 days before you plant corn. That gives it time to die and start breaking down, which means less competition for moisture and less chance of allelopathic effects on germinating corn. Apply your burndown herbicide when the cover crop is actively growing — a green, growing cereal rye takes a glyphosate application much better than a dormant one.

In a dry spring, terminate earlier — 14 to 21 days before planting. A living cover crop in a drought spring is using 0.1 to 0.3 inches of water per day. That's water your corn seed needs to germinate. ISU data shows 5 to 15 bushels per acre yield loss when cover crops are terminated within a week of planting in dry conditions.

Planting green — keeping the cover crop alive until you plant or right at planting — works best in wet springs when extra moisture consumption is a benefit rather than a problem. In a dry spring, it's risky.

If you want to get a fall cover crop established after corn harvest, consider planting a shorter-season corn hybrid — 5 to 7 RM units earlier than your normal hybrid. That gives you 10 to 14 extra days before first frost to get cereal rye or radish going. You'll give up 3 to 7 bushels per acre in yield, but cover crop establishment improves a lot.`,
  },

  {
    id: 'KB-COMPACTION',
    title: 'Dealing with soil compaction in Iowa corn fields',
    topic: 'soil',
    region: 'Iowa, USA',
    source: 'ISU "Didn\'t get fall tillage completed" / No-Till Farmer / DTN',
    validatedBy: 'ISU Extension Soil & Tillage Specialist',
    validatedOn: '2026-04-05',
    status: 'validated',
    tags: ['compaction', 'spring tillage', 'no-till compaction', 'axle weight', 'yield drop', 'compaction depth', 'no-till causes compaction', 'fix compaction', '30-40% yield', '5-10% yield', 'tillage fix'],
    body: `Compaction in Iowa corn fields most often shows up as a hardpan 3 to 6 inches deep — right where tillage equipment runs year after year, or where harvest equipment drove through wet soil. Corn roots hit that hard layer and flatten out sideways instead of going deep. In severe cases you can lose 30 to 40 percent of your yield potential. More commonly it's a 10 to 20 percent drag.

No-till does not cause more compaction than conventional tillage — that's a myth. It often causes less surface compaction because you're not making as many passes. What no-till can do is let compaction build up from wheel traffic if you're running heavy equipment on wet soil repeatedly.

To check if you have compaction, push a penetrometer into the soil. Readings above 300 PSI at 2 to 4 inches signal a restricting layer.

Spring tillage can break a shallow pan — but only if the soil is dry enough to crumble, not ribbon, when you work it. Tilling wet soil smears the layers together and can make things worse. For deep compaction below 6 inches, you need a subsoiler or deep ripper — a normal chisel plow won't reach it.`,
  },

  // ── PENDING ─────────────────────────────────────────────────────────────────
  {
    id: 'KB-DRAFT-COVER',
    title: 'Cover crop seeding dates by hybrid maturity — draft',
    topic: 'cover-crops',
    region: 'Iowa, USA',
    source: 'Draft — awaiting ISU review',
    validatedBy: '–',
    validatedOn: '–',
    status: 'pending',
    tags: ['cover crop', 'establishment', 'seeding dates'],
    body: 'Draft content awaiting expert review. Not used for answers until validated.',
  },
]

export const validatedDocuments = documents.filter((d) => d.status === 'validated')

export function getDocument(id: string) {
  return documents.find((d) => d.id === id)
}
