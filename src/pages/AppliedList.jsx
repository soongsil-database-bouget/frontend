import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackBar from '../components/BackBar'
import { getVirtualFittingHistory } from '../api/virtualFittings'
import { extractCategoryTags } from '../utils/tagLabels'

export default function AppliedList() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await getVirtualFittingHistory({ page: 1, size: 30 })
        const list = res?.items ?? []
        if (!cancelled) {
          const mapped = list.map((v) => {
            const b = v.bouquet || {}
            return {
              id: v.id,
              imageUrl: v.genImageUrl || v.srcImageUrl || b.imageUrl,
              bouquetImageUrl: b.imageUrl,
              title: b.name || `적용 #${v.id}`,
              tags: extractCategoryTags(b.categories),
            }
          })
          setItems(mapped)
        }
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const handlePrev = () => {
    setImageLoading(true)
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
  }

  const handleNext = () => {
    setImageLoading(true)
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleItemClick = () => {
    if (items[currentIndex]) {
      navigate(`/applied/${items[currentIndex].id}`)
    }
  }

  const currentItem = items[currentIndex] || null

  const body = useMemo(() => {
    if (loading) return <div className="py-12 text-center text-gray-500">불러오는 중…</div>
    if (error) return <div className="py-12 text-center text-red-600">목록을 불러오지 못했습니다.</div>
    if (items.length === 0) return <div className="py-12 text-center text-gray-500">표시할 항목이 없습니다.</div>
    
    return (
      <div className="space-y-6">
        {/* 메인 이미지 영역 */}
        <div className="relative flex items-center gap-2">
          {/* 좌측 화살표 버튼 */}
          {items.length > 1 && (
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
              style={{ backgroundColor: 'rgba(255, 244, 246, 1)' }}
              aria-label="이전 이미지"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 105, 147, 1)" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          
          <div 
            className="flex-1 max-w-sm mx-auto aspect-[3/4] rounded-xl border-2 overflow-hidden relative cursor-pointer"
            style={{ borderColor: 'rgba(255, 105, 147, 1)' }}
            onClick={handleItemClick}
          >
            {currentItem && (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
                  </div>
                )}
                <img 
                  className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  src={currentItem.imageUrl} 
                  alt={currentItem.title}
                  onLoad={handleImageLoad}
                  onError={handleImageLoad}
                />
                
                {/* 하단 우측 작은 원형 이미지 (부케 이미지) */}
                {currentItem.bouquetImageUrl && (
                  <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full overflow-hidden ring-2 ring-white shadow-lg">
                    <img 
                      className="w-full h-full object-cover" 
                      src={currentItem.bouquetImageUrl} 
                      alt={`${currentItem.title} 사용 부케`} 
                    />
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* 우측 화살표 버튼 */}
          {items.length > 1 && (
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
              style={{ backgroundColor: 'rgba(255, 244, 246, 1)' }}
              aria-label="다음 이미지"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 105, 147, 1)" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
        
        {/* 페이지네이션 도트 */}
        {items.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`rounded-full transition-all duration-200 ${
                  idx === currentIndex
                    ? 'w-2.5 h-2.5 bg-pink-500'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`${idx + 1}번째 이미지로 이동`}
              />
            ))}
          </div>
        )}
        
        {/* 제품명 */}
        {currentItem && (
          <div className="text-center">
            <h2 className="text-lg font-bold text-black">{currentItem.title}</h2>
          </div>
        )}
      </div>
    )
  }, [loading, error, items, currentIndex, currentItem, imageLoading])

  // currentIndex가 변경될 때 이미지 로딩 상태 초기화
  useEffect(() => {
    setImageLoading(true)
  }, [currentIndex])

  return (
    <>
      <BackBar title="사진 확인하기" />
      <div className="min-h-screen bg-white pb-24">
        <div className="max-w-md mx-auto px-4 pt-6">
          {body}
          
          {/* 하단 버튼 */}
          <div className="mt-8">
            <button
              onClick={() => navigate('/')}
              className="w-full h-12 rounded-xl font-semibold text-base text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: 'rgba(255, 105, 147, 1)' }}
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

