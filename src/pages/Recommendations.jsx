import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getRecommendationHistory } from '../api/recommendations'
import { extractCategoryTags, RAW_TO_KO_LABEL } from '../utils/tagLabels'
import { getProxiedImageUrl } from '../utils/imageUrl'
import BackBar from '../components/BackBar'
import Modal from '../components/Modal'
import Button from '../components/Button'

export default function Recommendations() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const sentinelRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const containerRef = useRef(null)
  const [selectedBouquet, setSelectedBouquet] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  // 세션별로 그룹화된 부케 리스트 생성
  const groupedSessions = useMemo(() => {
    return sessions
      .filter((session) => session.items && session.items.length > 0)
      .map((session) => {
        const sessionTags = [
          session.season && RAW_TO_KO_LABEL[session.season],
          session.dressMood && RAW_TO_KO_LABEL[session.dressMood],
          session.weddingColor && RAW_TO_KO_LABEL[session.weddingColor],
          session.bouquetAtmosphere && RAW_TO_KO_LABEL[session.bouquetAtmosphere],
        ].filter(Boolean)

        const bouquets = session.items.map((item) => {
          const bouquet = item.bouquet || {}
          return {
            id: item.id || bouquet.id,
            bouquetId: item.bouquetId || bouquet.id, // 부케 상세 조회용 bouquetId
            imageUrl: getProxiedImageUrl(bouquet.imageUrl),
            title: bouquet.name || '부케',
            description: bouquet.description || '',
            tags: extractCategoryTags(bouquet.categories || []),
            sessionId: session.id,
          }
        })

        return {
          sessionId: session.id,
          sessionTags,
          bouquets,
        }
      })
  }, [sessions])

  // 모든 부케를 평탄화하여 페이지네이션 계산
  const allBouquets = useMemo(() => {
    const bouquets = []
    groupedSessions.forEach((group) => {
      bouquets.push(...group.bouquets)
    })
    return bouquets
  }, [groupedSessions])

  const totalPages = Math.ceil(allBouquets.length / itemsPerPage)
  const currentBouquets = allBouquets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // 현재 페이지의 부케들이 속한 세션 그룹 찾기
  const currentSessionGroups = useMemo(() => {
    if (currentBouquets.length === 0) return []
    
    const groups = []
    const processedSessionIds = new Set()
    
    currentBouquets.forEach((bouquet) => {
      if (!processedSessionIds.has(bouquet.sessionId)) {
        const group = groupedSessions.find((g) => g.sessionId === bouquet.sessionId)
        if (group) {
          // 현재 페이지에 있는 부케들만 필터링
          const bouquetsInPage = group.bouquets.filter((b) =>
            currentBouquets.some((cb) => cb.id === b.id)
          )
          if (bouquetsInPage.length > 0) {
            groups.push({
              ...group,
              bouquets: bouquetsInPage,
            })
            processedSessionIds.add(bouquet.sessionId)
          }
        }
      }
    })
    
    return groups
  }, [currentBouquets, groupedSessions])

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages))
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1))
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && totalPages > 1) {
      handleNext()
    }
    if (isRightSwipe && totalPages > 1) {
      handlePrev()
    }
  }

  async function loadMore() {
    if (loading || !hasMore) return
    setLoading(true)
    setError(null)
    try {
      const res = await getRecommendationHistory({ page, size: 5 })
      const items = res?.items || []
      setSessions((prev) => [...prev, ...items])
      const total = res?.totalCount ?? 0
      const loaded = (page) * 5
      setHasMore(loaded < total)
      setPage((p) => p + 1)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  // first load
  useEffect(() => {
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) loadMore()
      })
    }, { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinelRef.current, page, hasMore, loading])

  return (
    <>
      <BackBar title="추천 받은 부케 목록" />
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-6">
          {allBouquets.length === 0 && !loading && !error && (
            <div className="py-20 text-center">
              <p className="text-gray-500">추천받은 부케가 없습니다.</p>
            </div>
          )}

          {currentSessionGroups.length > 0 && (
            <div
              ref={containerRef}
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* 세션 그룹별 부케 카드 리스트 */}
              <div className="space-y-6">
                {currentSessionGroups.map((group, groupIdx) => (
                  <div key={group.sessionId || groupIdx} className="space-y-3">
                    {/* 세션 태그 - 배경 박스 스타일 */}
                    {group.sessionTags && group.sessionTags.length > 0 && (
                      <div 
                        className="px-4 py-2.5 rounded-lg"
                        style={{
                          backgroundColor: 'rgba(255, 244, 246, 0.5)',
                          border: '1px solid rgba(248, 180, 202, 0.25)',
                        }}
                      >
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {group.sessionTags.map((tag, idx) => (
                        <span
                          key={idx}
                              className="text-sm font-semibold"
                              style={{ color: 'rgba(255, 105, 147, 1)' }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 부케 카드들 */}
                    <div className="space-y-4">
                      {group.bouquets.map((bouquet) => (
                        <div
                          key={bouquet.id}
                          onClick={() => {
                            setSelectedBouquet(bouquet)
                            setModalOpen(true)
                          }}
                          className="cursor-pointer rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-all duration-200 hover:border-gray-300"
                        >
                          <div className="flex gap-4 p-4">
                            {/* 왼쪽 이미지 */}
                            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={bouquet.imageUrl}
                                alt={bouquet.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* 오른쪽 텍스트 */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <h3 className="text-base font-bold text-gray-900 mb-1.5 line-clamp-1">
                                {bouquet.title}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2 line-clamp-2 leading-relaxed">
                                {bouquet.description || '아름다운 부케입니다.'}
                              </p>
                              {/* 해시태그 - 회색 스타일 */}
                              {bouquet.tags && bouquet.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {bouquet.tags.slice(0, 3).map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs text-gray-400 font-medium"
                                    >
                                      #{tag}
                        </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                    </div>
                  </div>
          )}

          {/* 하단 네비게이션: 좌우 버튼 및 페이지네이션 도트 */}
          {totalPages > 1 && (
            <div className="relative flex justify-between items-center mt-6 mb-4">
              {/* 좌측 화살표 버튼 */}
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 244, 246, 1)' }}
                aria-label="이전 페이지"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 105, 147, 1)" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              
              {/* 페이지네이션 도트 - 중앙 고정 */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`rounded-full transition-all duration-200 ${
                      pageNum === currentPage
                        ? 'w-2.5 h-2.5 bg-pink-500'
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`${pageNum}페이지로 이동`}
                  />
                ))}
          </div>

              {/* 우측 화살표 버튼 */}
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 244, 246, 1)' }}
                aria-label="다음 페이지"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 105, 147, 1)" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}

          {error && (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-red-600 text-lg font-medium">목록을 불러오지 못했어요.</p>
            </div>
          )}
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">불러오는 중…</p>
            </div>
          )}
          <div ref={sentinelRef} />
        </div>
      </div>

      {/* 부케 선택 모달 */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedBouquet && (
          <div className="p-6">
            {/* 헤더 */}
            <div className="mb-5 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-1.5">부케 선택</h2>
              <p className="text-sm text-gray-500">원하는 작업을 선택해주세요</p>
            </div>
            
            {/* 부케 카드 */}
            <div className="mb-6 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-purple-50">
                <img
                  src={selectedBouquet.imageUrl}
                  alt={selectedBouquet.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {selectedBouquet.title}
                </h3>
                {selectedBouquet.tags && selectedBouquet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBouquet.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: 'rgba(255, 244, 246, 1)',
                          color: 'rgba(255, 105, 147, 1)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex flex-col gap-3">
              <button
                className="w-full h-12 rounded-xl font-semibold text-base text-white transition-all duration-200 hover:opacity-90 active:opacity-80 shadow-sm hover:shadow-md"
                style={{ backgroundColor: 'rgba(255, 105, 147, 1)' }}
                onClick={() => {
                  navigate('/apply', { state: { bouquetId: selectedBouquet.bouquetId } })
                  setModalOpen(false)
                }}
              >
                적용하기
              </button>
              <Button
                variant="outline"
                className="w-full h-12 text-base font-semibold"
                onClick={() => {
                  navigate(`/bouquets/${selectedBouquet.bouquetId}`)
                  setModalOpen(false)
                }}
              >
                상세보기
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}


