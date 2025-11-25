import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { RAW_TO_KO_LABEL } from '../utils/tagLabels'
import { createRecommendationSession } from '../api/recommendations'

// Color mapping for cards - 통일된 중성 색상 기본, 선택 시에만 색상 강조
const RAW_TO_COLOR = {
  // 기본 상태: 모두 동일한 중성 색상
  // 선택 상태: 각 카테고리별 색상
  SPRING: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-emerald-50 border-emerald-400 text-emerald-700' 
  },
  SUMMER: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-sky-50 border-sky-400 text-sky-700' 
  },
  FALL: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-amber-50 border-amber-400 text-amber-700' 
  },
  WINTER: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-slate-50 border-slate-400 text-slate-700' 
  },
  BOHEMIAN: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-lime-50 border-lime-400 text-lime-700' 
  },
  LACE: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-rose-50 border-rose-400 text-rose-700' 
  },
  SIMPLE: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-gray-100 border-gray-400 text-gray-800' 
  },
  LUXURY: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-violet-50 border-violet-400 text-violet-700' 
  },
  A_LINE: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-pink-50 border-pink-400 text-pink-700' 
  },
  BALL_GOWN: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-fuchsia-50 border-fuchsia-400 text-fuchsia-700' 
  },
  MERMAID: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-cyan-50 border-cyan-400 text-cyan-700' 
  },
  SHEATH: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-stone-100 border-stone-400 text-stone-700' 
  },
  CLASSIC: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-indigo-50 border-indigo-400 text-indigo-700' 
  },
  PASTEL: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-rose-50 border-rose-400 text-rose-700' 
  },
  NEUTRAL: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-stone-100 border-stone-400 text-stone-700' 
  },
  VIVID: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-orange-50 border-orange-400 text-orange-700' 
  },
  ROMANTIC_GARDEN: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-rose-50 border-rose-400 text-rose-700' 
  },
  CLASSIC_ELEGANCE: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-purple-50 border-purple-400 text-purple-700' 
  },
  MODERN_MINIMAL: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-slate-50 border-slate-400 text-slate-700' 
  },
  NATURAL_BOHEMIAN: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-lime-50 border-lime-400 text-lime-700' 
  },
}

function OptionCard({ option, selected, onSelect }) {
  const colors = RAW_TO_COLOR[option.value] || { 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200', 
    selected: 'bg-gray-100 border-gray-400 text-gray-800' 
  }
  const isSelected = selected === option.value
  
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`
        group relative p-5 rounded-2xl border-2 transition-all duration-300 text-left
        transform hover:scale-[1.02] active:scale-[0.98]
        ${isSelected 
          ? `${colors.selected} shadow-lg ring-2 ring-offset-2 ring-purple-300 scale-[1.02]` 
          : `${colors.bg} ${colors.border} hover:bg-gray-100 hover:shadow-md hover:border-gray-300`
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
        overflow-hidden
      `}
    >
      {/* 선택 시 배경 애니메이션 */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className={`font-bold text-base transition-colors ${isSelected ? colors.text : 'text-gray-700'}`}>
            {option.label}
          </div>
          {isSelected && (
            <div className="flex-shrink-0 ml-2 w-6 h-6 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        {!isSelected && (
          <div className="mt-2 text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
            클릭하여 선택
          </div>
        )}
      </div>
    </button>
  )
}

export default function Recommend() {
  const navigate = useNavigate()
  const [season, setSeason] = useState('')
  const [dressMood, setDressMood] = useState('')
  const [dressSilhouette, setDressSilhouette] = useState('')
  const [weddingColor, setWeddingColor] = useState('')
  const [bouquetAtmosphere, setBouquetAtmosphere] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const SEASONS = useMemo(() => (
    ['SPRING', 'SUMMER', 'FALL', 'WINTER'].map(v => ({ value: v, label: RAW_TO_KO_LABEL[v] }))
  ), [])
  const DRESS_MOODS = useMemo(() => (
    ['SIMPLE', 'LACE', 'BOHEMIAN', 'LUXURY'].map(v => ({ value: v, label: RAW_TO_KO_LABEL[v] }))
  ), [])
  const DRESS_SILHOUETTES = useMemo(() => (
    ['A_LINE', 'BALL_GOWN', 'MERMAID', 'SHEATH'].map(v => ({ value: v, label: RAW_TO_KO_LABEL[v] }))
  ), [])
  const WEDDING_COLORS = useMemo(() => (
    ['NEUTRAL', 'PASTEL', 'CLASSIC', 'VIVID'].map(v => ({ value: v, label: RAW_TO_KO_LABEL[v] }))
  ), [])
  const BOUQUET_ATMOSPHERES = useMemo(() => (
    ['ROMANTIC_GARDEN', 'MODERN_MINIMAL', 'NATURAL_BOHEMIAN', 'CLASSIC_ELEGANCE'].map(v => ({ value: v, label: RAW_TO_KO_LABEL[v] }))
  ), [])

  const canSubmit = season && dressMood && dressSilhouette && weddingColor && bouquetAtmosphere && !submitting
  
  // 선택 카운터 계산
  const selectedCount = [season, dressMood, dressSilhouette, weddingColor, bouquetAtmosphere].filter(Boolean).length
  const totalCount = 5

  async function onSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await createRecommendationSession({
        season,
        dressMood,
        dressSilhouette,
        weddingColor,
        bouquetAtmosphere,
      })
      const sid = res?.id
      if (sid) {
        navigate(`/result?sessionId=${sid}`)
      } else {
        navigate('/recommendations')
      }
    } catch (err) {
      setError('추천을 생성하지 못했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="max-w-screen-lg mx-auto px-4 py-10">
        {/* Sticky 상단바 */}
        <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 backdrop-blur-md bg-opacity-95 pb-4 pt-2 -mx-4 px-4 border-b border-gray-200/50 mb-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              부케 추천받기
            </h1>
            <p className="mt-2 text-gray-600 text-base">나에게 딱 맞는 부케를 찾아보세요</p>
            
            {/* 진행 바 */}
            <div className="max-w-sm mx-auto mb-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${(selectedCount / totalCount) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* 단계 표시 */}
            <div className="flex items-center justify-center gap-1.5 text-xs flex-wrap">
              <span className={`px-2.5 py-1 rounded-full transition-all duration-300 ${season ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                1. 계절감 {season && '✓'}
              </span>
              <span className="text-gray-300">→</span>
              <span className={`px-2.5 py-1 rounded-full transition-all duration-300 ${dressMood ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                2. 드레스 {dressMood && '✓'}
              </span>
              <span className="text-gray-300">→</span>
              <span className={`px-2.5 py-1 rounded-full transition-all duration-300 ${dressSilhouette ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                3. 실루엣 {dressSilhouette && '✓'}
              </span>
              <span className="text-gray-300">→</span>
              <span className={`px-2.5 py-1 rounded-full transition-all duration-300 ${weddingColor ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                4. 색감 {weddingColor && '✓'}
              </span>
              <span className="text-gray-300">→</span>
              <span className={`px-2.5 py-1 rounded-full transition-all duration-300 ${bouquetAtmosphere ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                5. 무드 {bouquetAtmosphere && '✓'}
              </span>
            </div>
          </div>
        </div>

        <form className="space-y-8" onSubmit={onSubmit}>
          {/* 계절감 */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              계절감 <span className="text-sm font-normal text-gray-500">(필수)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SEASONS.map(option => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={season}
                  onSelect={setSeason}
                />
              ))}
            </div>
          </div>

          {/* 드레스 무드 */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              드레스 무드 <span className="text-sm font-normal text-gray-500">(필수)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DRESS_MOODS.map(option => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={dressMood}
                  onSelect={setDressMood}
                />
              ))}
            </div>
          </div>

          {/* 드레스 실루엣 */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              드레스 실루엣 <span className="text-sm font-normal text-gray-500">(필수)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DRESS_SILHOUETTES.map(option => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={dressSilhouette}
                  onSelect={setDressSilhouette}
                />
              ))}
            </div>
          </div>

          {/* 전체 웨딩 색감 */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              전체 웨딩 색감 <span className="text-sm font-normal text-gray-500">(필수)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {WEDDING_COLORS.map(option => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={weddingColor}
                  onSelect={setWeddingColor}
                />
              ))}
            </div>
          </div>

          {/* 부케 무드 */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              부케 무드 <span className="text-sm font-normal text-gray-500">(필수)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BOUQUET_ATMOSPHERES.map(option => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={bouquetAtmosphere}
                  onSelect={setBouquetAtmosphere}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="pt-8 pb-4">
            <Button 
              className={`w-full h-16 text-lg font-bold transition-all duration-300 transform ${
                canSubmit 
                  ? 'hover:scale-[1.02] hover:shadow-2xl' 
                  : 'disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
              disabled={!canSubmit}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>추천 중...</span>
                </span>
              ) : canSubmit ? (
                <span className="flex items-center justify-center gap-2">
                  <span>✨</span>
                  <span>부케 추천받기</span>
                  <span className="text-sm opacity-80">({selectedCount}/{totalCount})</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>📝</span>
                  <span>모든 항목을 선택해주세요 ({selectedCount}/{totalCount})</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

