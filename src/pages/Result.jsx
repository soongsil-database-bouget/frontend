import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getRecommendationDetail, getRecommendationHistory } from '../api/recommendations'
import { RAW_TO_KO_LABEL, getTagChipClasses, extractCategoryTags } from '../utils/tagLabels'
import BackBar from '../components/BackBar'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function Result() {
  const q = useQuery()
  const sessionIdFromQuery = q.get('sessionId')
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        let sid = sessionIdFromQuery
        if (!sid) {
          const hist = await getRecommendationHistory({ page: 1, size: 1 })
          sid = hist?.items?.[0]?.id
        }
        if (!sid) {
          if (!cancelled) {
            setSession(null)
            setError('추천 내역이 없습니다.')
          }
          return
        }
        const detail = await getRecommendationDetail(sid)
        if (!cancelled) setSession(detail)
      } catch (e) {
        if (!cancelled) setError('추천 결과를 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [sessionIdFromQuery])

  const items = useMemo(() => {
    if (!session) return []
    return (session.items || []).slice(0, 3).map((it) => {
      const b = it.bouquet || {}
      return {
        id: b.id,
        imageUrl: b.imageUrl,
        title: b.name,
        description: b.description || '',
        tags: extractCategoryTags(b.categories),
      }
    })
  }, [session])

  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  const optionChips = useMemo(() => {
    if (!session) return []
    return [
      session.season && RAW_TO_KO_LABEL[session.season],
      session.dressMood && RAW_TO_KO_LABEL[session.dressMood],
      session.weddingColor && RAW_TO_KO_LABEL[session.weddingColor],
      session.bouquetAtmosphere && RAW_TO_KO_LABEL[session.bouquetAtmosphere],
    ].filter(Boolean)
  }, [session])

  const currentItem = items[currentIndex] || null

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 바 */}
      <BackBar title="추천받기" />

      {/* 메인 콘텐츠 */}
      <div className="max-w-md mx-auto px-4 py-8">
        {loading && (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">추천 결과를 불러오는 중…</p>
          </div>
        )}
        
        {error && !loading && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 text-lg font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && currentItem && (
          <div className="space-y-8">
            {/* 부케 카드 */}
            <div className="relative">
              {/* 좌우 화살표 버튼 */}
              {items.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: 'rgba(255, 244, 246, 1)' }}
                    aria-label="이전 부케"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 105, 147, 1)" strokeWidth="2.5">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: 'rgba(255, 244, 246, 1)' }}
                    aria-label="다음 부케"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 105, 147, 1)" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}

              {/* 부케 카드 */}
              <div className="max-w-xs mx-auto rounded-2xl border-2 overflow-hidden bg-white" style={{ borderColor: 'rgba(255, 192, 203, 0.4)' }}>
                <div className="bg-white p-4 aspect-square flex items-center justify-center">
                  <div className="w-full h-full aspect-square">
                    <img
                      src={currentItem.imageUrl}
                      alt={currentItem.title}
                      className="w-full h-full object-cover rounded-xl border border-gray-100"
                    />
                  </div>
                </div>
                <div className="bg-white px-4 pt-3 pb-5 text-center">
                  <h2 className="text-lg font-bold text-gray-900 mb-2.5 leading-tight">
                    {currentItem.title}
                  </h2>
                  {currentItem.description && (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 leading-relaxed">{currentItem.description.split('\n')[0] || currentItem.description}</p>
                      {currentItem.description.split('\n')[1] && (
                        <p className="text-sm text-gray-500 leading-relaxed">{currentItem.description.split('\n')[1]}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 페이지네이션 도트 */}
              {items.length > 1 && (
                <div className="flex justify-center gap-2.5 mt-5">
                  {items.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`rounded-full transition-all duration-200 ${
                        index === currentIndex 
                          ? 'w-2.5 h-2 bg-pink-500' 
                          : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`${index + 1}번째 부케로 이동`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 하단 버튼 */}
            <div className="space-y-3 pt-2 pb-6">
              <button
                onClick={() => navigate('/recommendations')}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:opacity-80 bg-white border"
                style={{ 
                  borderColor: 'rgba(255, 192, 203, 0.5)',
                  color: 'rgba(255, 105, 147, 1)'
                }}
              >
                추천받은 부케 목록 보러가기
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 active:opacity-80 shadow-sm hover:shadow-md"
                style={{ backgroundColor: 'rgba(255, 105, 147, 1)' }}
              >
                완료하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

