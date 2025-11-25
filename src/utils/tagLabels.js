// Maps raw enum values to user-friendly Korean labels
export const RAW_TO_KO_LABEL = {
  // Season
  SPRING: '봄',
  SUMMER: '여름',
  FALL: '가을',
  WINTER: '겨울',

  // DressMood
  BOHEMIAN: '보헤미안',
  LACE: '레이스',
  SIMPLE: '심플&미니멀',
  LUXURY: '럭셔리',

  // DressSilhouette
  A_LINE: 'A라인',
  BALL_GOWN: '볼가운',
  MERMAID: '머메이드',
  SHEATH: '시스&슬림',

  // WeddingColor
  CLASSIC: '클래식',
  PASTEL: '파스텔',
  NEUTRAL: '뉴트럴',
  VIVID: '비비드',

  // BouquetAtmosphere
  ROMANTIC_GARDEN: '로맨틱&가든',
  CLASSIC_ELEGANCE: '클래식&우아함',
  MODERN_MINIMAL: '모던&미니멀',
  NATURAL_BOHEMIAN: '내추럴&보헤미안',

  // Usage (optional nice labels)
  WEDDING_PHOTO: '웨딩 촬영',
  BRIDAL_ROOM: '브라이달 룸',
  WEDDING_CEREMONY: '본식',
}

export function formatCategoryTag(raw) {
  if (!raw) return ''
  return RAW_TO_KO_LABEL[raw] ?? String(raw).replace(/_/g, ' ')
}

export function extractCategoryTags(categories) {
  const rawTags = (categories || []).flatMap((c) => [
    c.season,
    c.dressMood,
    c.dressSilhouette,
    c.weddingColor,
    c.bouquetAtmosphere,
    c.usage,
  ]).filter(Boolean)
  const unique = Array.from(new Set(rawTags))
  return unique.map(formatCategoryTag)
}

// Color styles for tags (Tailwind classes)
const RAW_TO_COLOR = {
  // Season
  SPRING: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  SUMMER: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  FALL: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  WINTER: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },

  // DressMood
  BOHEMIAN: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  LACE: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  SIMPLE: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  LUXURY: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },

  // DressSilhouette
  A_LINE: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  BALL_GOWN: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200' },
  MERMAID: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  SHEATH: { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' },

  // WeddingColor
  CLASSIC: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  PASTEL: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  NEUTRAL: { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' },
  VIVID: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },

  // BouquetAtmosphere
  ROMANTIC_GARDEN: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  CLASSIC_ELEGANCE: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  MODERN_MINIMAL: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  NATURAL_BOHEMIAN: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },

  // Usage
  WEDDING_PHOTO: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  BRIDAL_ROOM: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  WEDDING_CEREMONY: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
}

function resolveRawFromLabel(labelOrRaw) {
  if (!labelOrRaw) return null
  // If exact raw exists in label map, keep it
  if (RAW_TO_KO_LABEL[labelOrRaw]) return labelOrRaw
  // Try reverse lookup label -> raw
  const entry = Object.entries(RAW_TO_KO_LABEL).find(([, ko]) => ko === labelOrRaw)
  return entry ? entry[0] : null
}

export function getTagChipClasses(labelOrRaw) {
  const raw = resolveRawFromLabel(labelOrRaw)
  const style = (raw && RAW_TO_COLOR[raw]) || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
  return `inline-flex items-center px-2.5 py-1 rounded-full text-xs ${style.bg} ${style.text} border ${style.border}`
}


