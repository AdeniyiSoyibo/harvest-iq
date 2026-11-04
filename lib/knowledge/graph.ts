import 'server-only'

export type Entity = {
  id: string
  label: string
  type: 'crop' | 'pest' | 'disease' | 'practice' | 'input' | 'symptom' | 'condition' | 'nutrient'
  aliases: string[]
}

export type GraphFact = {
  from: string
  rel: string
  to: string
  docId: string
}

export const entities: Entity[] = [
  // Crops
  { id: 'corn', label: 'Corn', type: 'crop', aliases: ['maize', 'field corn', 'Iowa corn'] },
  { id: 'soybean', label: 'Soybean', type: 'crop', aliases: ['beans', 'soybeans', 'rotation crop'] },

  // Nutrients
  { id: 'nitrogen', label: 'Nitrogen', type: 'nutrient', aliases: ['N', 'nitrate', 'ammonium', 'urea', 'UAN', 'anhydrous ammonia'] },
  { id: 'potassium', label: 'Potassium', type: 'nutrient', aliases: ['K', 'potash', 'K deficiency'] },
  { id: 'sulfur', label: 'Sulfur', type: 'nutrient', aliases: ['S', 'sulfate', 'sulphur'] },
  { id: 'phosphorus', label: 'Phosphorus', type: 'nutrient', aliases: ['P', 'phosphate'] },

  // Diseases
  { id: 'southern-rust', label: 'Southern rust', type: 'disease', aliases: ['Puccinia polysora', 'southern corn rust', 'rust pustules'] },
  { id: 'gray-leaf-spot', label: 'Gray leaf spot', type: 'disease', aliases: ['GLS', 'Cercospora zeae-maydis', 'gray lesion'] },
  { id: 'nclb', label: 'Northern corn leaf blight', type: 'disease', aliases: ['NCLB', 'Setosphaeria turcica', 'cigar lesion'] },
  { id: 'tar-spot', label: 'Tar spot', type: 'disease', aliases: ['Phyllachora maydis', 'black spots', 'fish-eye'] },
  { id: 'bacterial-leaf-streak', label: 'Bacterial leaf streak', type: 'disease', aliases: ['BLS', 'Xanthomonas vasicola', 'wavy lesions'] },

  // Pests
  { id: 'corn-rootworm', label: 'Corn rootworm', type: 'pest', aliases: ['rootworm', 'Diabrotica virgifera', 'rootworm beetle'] },
  { id: 'corn-aphid', label: 'Corn aphid', type: 'pest', aliases: ['aphid', 'Rhopalosiphum maidis', 'aphids'] },
  { id: 'black-cutworm', label: 'Black cutworm', type: 'pest', aliases: ['cutworm', 'Agrotis ipsilon', 'cutting'] },
  { id: 'japanese-beetle', label: 'Japanese beetle', type: 'pest', aliases: ['JB', 'silk clipping', 'Popillia japonica'] },
  { id: 'waterhemp', label: 'Waterhemp', type: 'pest', aliases: ['Amaranthus tuberculatus', 'waterhemp weed'] },

  // Conditions / symptoms
  { id: 'n-deficiency', label: 'Nitrogen deficiency', type: 'symptom', aliases: ['yellow V', 'lower leaf yellow', 'N deficiency'] },
  { id: 'wet-feet', label: 'Wet feet / saturated soil', type: 'condition', aliases: ['saturated', 'flooded roots', 'poor drainage'] },
  { id: 'compaction', label: 'Soil compaction', type: 'condition', aliases: ['hardpan', 'plow pan', 'restricted roots'] },
  { id: 'lodging', label: 'Lodging', type: 'symptom', aliases: ['goose-necking', 'stalk lodging', 'fallen corn'] },

  // Practices / inputs
  { id: 'psnt', label: 'Pre-sidedress nitrate test (PSNT)', type: 'practice', aliases: ['PSNT', 'late spring nitrate test', 'LSNT'] },
  { id: 'sidedress', label: 'Sidedress nitrogen', type: 'practice', aliases: ['sidedress', 'in-season N', 'V4 nitrogen'] },
  { id: 'pre-em', label: 'Pre-emergent herbicide', type: 'practice', aliases: ['pre-emergence', 'residual herbicide', 'Group 15'] },
  { id: 'fungicide', label: 'Fungicide', type: 'input', aliases: ['triazole', 'strobilurin', 'SDHI', 'disease spray'] },
  { id: 'cover-crop', label: 'Cover crop', type: 'practice', aliases: ['cereal rye', 'radish', 'cover crops'] },
]

export const facts: GraphFact[] = [
  // Nitrogen
  { from: 'corn', rel: 'requires', to: 'nitrogen', docId: 'KB-N-RATE' },
  { from: 'nitrogen', rel: 'lost_by', to: 'wet-feet', docId: 'KB-N-LOSS' },
  { from: 'n-deficiency', rel: 'diagnosed_by', to: 'psnt', docId: 'KB-N-SIDEDRESS' },
  { from: 'n-deficiency', rel: 'treated_by', to: 'sidedress', docId: 'KB-N-SIDEDRESS' },
  { from: 'corn', rel: 'shows', to: 'n-deficiency', docId: 'KB-N-YELLOW' },
  { from: 'corn', rel: 'shows', to: 'wet-feet', docId: 'KB-N-YELLOW' },

  // Diseases
  { from: 'corn', rel: 'attacked_by', to: 'southern-rust', docId: 'KB-DIS-SOUTHERN-RUST' },
  { from: 'southern-rust', rel: 'controlled_by', to: 'fungicide', docId: 'KB-DIS-SOUTHERN-RUST' },
  { from: 'corn', rel: 'attacked_by', to: 'gray-leaf-spot', docId: 'KB-DIS-FOLIAR' },
  { from: 'corn', rel: 'attacked_by', to: 'nclb', docId: 'KB-DIS-FOLIAR' },
  { from: 'corn', rel: 'attacked_by', to: 'tar-spot', docId: 'KB-DIS-FOLIAR' },
  { from: 'gray-leaf-spot', rel: 'controlled_by', to: 'fungicide', docId: 'KB-DIS-FOLIAR' },
  { from: 'nclb', rel: 'controlled_by', to: 'fungicide', docId: 'KB-DIS-FOLIAR' },
  { from: 'tar-spot', rel: 'controlled_by', to: 'fungicide', docId: 'KB-DIS-FOLIAR' },
  { from: 'bacterial-leaf-streak', rel: 'not_controlled_by', to: 'fungicide', docId: 'KB-DIS-FOLIAR' },

  // Pests
  { from: 'corn', rel: 'attacked_by', to: 'corn-rootworm', docId: 'KB-PEST-ROOTWORM' },
  { from: 'corn-rootworm', rel: 'causes', to: 'lodging', docId: 'KB-PEST-ROOTWORM' },
  { from: 'corn', rel: 'attacked_by', to: 'corn-aphid', docId: 'KB-PEST-APHID' },
  { from: 'corn', rel: 'attacked_by', to: 'black-cutworm', docId: 'KB-PEST-OTHER' },
  { from: 'corn', rel: 'attacked_by', to: 'japanese-beetle', docId: 'KB-PEST-OTHER' },
  { from: 'corn', rel: 'competed_by', to: 'waterhemp', docId: 'KB-WEED-WATERHEMP' },
  { from: 'waterhemp', rel: 'controlled_by', to: 'pre-em', docId: 'KB-WEED-WATERHEMP' },

  // Soil / compaction
  { from: 'compaction', rel: 'reduces_yield_of', to: 'corn', docId: 'KB-COMPACTION' },
  { from: 'cover-crop', rel: 'planted_before', to: 'corn', docId: 'KB-COVER-CROP' },
  { from: 'soybean', rel: 'rotated_with', to: 'corn', docId: 'KB-ECON' },
]

export function findEntity(query: string): Entity | undefined {
  const q = query.toLowerCase().trim()
  return entities.find(
    (e) => e.id === q || e.label.toLowerCase() === q || e.aliases.some((a) => a.toLowerCase() === q),
  )
}

export function neighbourhood(entityId: string): GraphFact[] {
  return facts.filter((f) => f.from === entityId || f.to === entityId)
}
