import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackBar from '../components/BackBar'
import { RAW_TO_KO_LABEL } from '../utils/tagLabels'
import { createRecommendationSession } from '../api/recommendations'

function OptionButton({ option, selected, onSelect }) {
  const isSelected = selected === option.value
  
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`
        px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
        ${isSelected 
          ? 'text-gray-700 border-2' 
          : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
      style={isSelected ? {
        backgroundColor: 'rgb(255, 244, 246)',
        borderColor: 'rgba(248, 180, 202, 1)'
      } : {}}
    >
      {option.label}
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
  
  // 현재 단계 계산
  const getCurrentStep = () => {
    if (!season) return 1
    if (!dressMood) return 2
    if (!dressSilhouette) return 3
    if (!weddingColor) return 4
    if (!bouquetAtmosphere) return 5
    return 6 // 완료
  }
  
  const currentStep = getCurrentStep()
  
  // 진행도 계산 (0~100%)
  const selectedCount = [season, dressMood, dressSilhouette, weddingColor, bouquetAtmosphere].filter(Boolean).length
  const totalCount = 5
  const progress = (selectedCount / totalCount) * 100

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
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 바 */}
      <BackBar title="추천받기" />
      
      {/* 진행 단계 표시 및 진행도 바 - 상단 고정 */}
      <div className="sticky top-[57px] z-10 bg-white">
        {/* 진행 단계 표시 */}
        <div className="px-4 py-2 border-b border-gray-100 pt-[15px]">
          <div className="flex items-center justify-center gap-1.5 text-xs">
            {[
              { step: 1, label: '계절감', completed: season },
              { step: 2, label: '드레스', completed: dressMood },
              { step: 3, label: '실루엣', completed: dressSilhouette },
              { step: 4, label: '색감', completed: weddingColor },
              { step: 5, label: '무드', completed: bouquetAtmosphere },
            ].map((item, index, array) => {
              const nextItem = array[index + 1]
              const arrowIsPink = item.completed && nextItem
              return (
                <React.Fragment key={item.step}>
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 text-gray-500
                      ${item.completed
                        ? 'bg-pink-100'
                        : 'bg-gray-100'
                      }
                    `}
                  >
                    {item.step}. {item.label}
                  </span>
                  {index < array.length - 1 && (
                    <span className={arrowIsPink ? 'text-pink-300' : 'text-gray-300'}>→</span>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
        
        {/* 진행도 바 */}
        <div className="px-4 py-3 border-gray-100">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 ease-out rounded-full"
              style={{ 
                width: `${progress}%`,
                backgroundColor: 'rgba(255, 105, 147, 1)'
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-6">
        <form className="space-y-8" onSubmit={onSubmit}>
          {/* 계절감 */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              계절감
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SEASONS.map(option => (
                <OptionButton
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
            <label className="block text-base font-semibold text-gray-900 mb-3">
              드레스 무드
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DRESS_MOODS.map(option => (
                <OptionButton
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
            <label className="block text-base font-semibold text-gray-900 mb-3">
              드레스 실루엣
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DRESS_SILHOUETTES.map(option => (
                <OptionButton
                  key={option.value}
                  option={option}
                  selected={dressSilhouette}
                  onSelect={setDressSilhouette}
                />
              ))}
            </div>
          </div>

          {/* 전체 웨딩 무드 */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              전체 웨딩 무드
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WEDDING_COLORS.map(option => (
                <OptionButton
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
            <label className="block text-base font-semibold text-gray-900 mb-3">
              부케 무드
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BOUQUET_ATMOSPHERES.map(option => (
                <OptionButton
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

          {/* 제출 버튼 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`
                w-full py-4 rounded-xl font-bold text-base transition-all duration-200
                ${canSubmit 
                  ? 'text-white hover:opacity-90 active:opacity-80' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
              style={canSubmit ? {
                backgroundColor: 'rgba(255, 105, 147, 1)'
              } : {}}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>추천 중...</span>
                </span>
              ) : (
                canSubmit ? '부케 추천받기' : '모든 항목을 선택해주세요'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

