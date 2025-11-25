import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRecommendationHistory } from '../api/recommendations'
import BouquetCard from '../components/BouquetCard'
import { RAW_TO_KO_LABEL, getTagChipClasses } from '../utils/tagLabels'
import BackBar from '../components/BackBar'

export default function Recommendations() {
  const [sessions, setSessions] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const sentinelRef = useRef(null)

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
      <BackBar title="내가 추천받은 부케" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/30">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="space-y-8">
            {sessions.map((session) => {
              const chips = [
                session.season && RAW_TO_KO_LABEL[session.season],
                session.dressMood && RAW_TO_KO_LABEL[session.dressMood],
                session.weddingColor && RAW_TO_KO_LABEL[session.weddingColor],
                session.bouquetAtmosphere && RAW_TO_KO_LABEL[session.bouquetAtmosphere],
              ].filter(Boolean)
              const season = session.season
              const seasonColors = {
                SPRING: {
                  bar: 'bg-gradient-to-b from-pink-500 via-rose-500 to-purple-500',
                  tags: [
                    'bg-gradient-to-r from-pink-500 to-rose-500',
                    'bg-gradient-to-r from-purple-500 to-pink-500',
                    'bg-gradient-to-r from-rose-500 to-pink-500',
                    'bg-gradient-to-r from-pink-500 to-purple-500',
                  ]
                },
                SUMMER: {
                  bar: 'bg-gradient-to-b from-blue-500 via-cyan-500 to-teal-500',
                  tags: [
                    'bg-gradient-to-r from-blue-500 to-cyan-500',
                    'bg-gradient-to-r from-cyan-500 to-teal-500',
                    'bg-gradient-to-r from-teal-500 to-blue-500',
                    'bg-gradient-to-r from-blue-500 to-teal-500',
                  ]
                },
                FALL: {
                  bar: 'bg-gradient-to-b from-orange-500 via-amber-500 to-yellow-500',
                  tags: [
                    'bg-gradient-to-r from-orange-500 to-amber-500',
                    'bg-gradient-to-r from-amber-500 to-yellow-500',
                    'bg-gradient-to-r from-yellow-500 to-orange-500',
                    'bg-gradient-to-r from-orange-500 to-yellow-500',
                  ]
                },
                WINTER: {
                  bar: 'bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500',
                  tags: [
                    'bg-gradient-to-r from-purple-500 to-indigo-500',
                    'bg-gradient-to-r from-indigo-500 to-blue-500',
                    'bg-gradient-to-r from-blue-500 to-purple-500',
                    'bg-gradient-to-r from-purple-500 to-blue-500',
                  ]
                }
              }
              const colors = seasonColors[season] || seasonColors.SPRING
              return (
                <div key={session.id} className="rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100 relative">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.bar}`}></div>
                  {/* 옵션 강조 섹션 */}
                  <div className="bg-white p-4 sm:p-5">
                    <div className="flex items-center flex-wrap gap-3 pl-4">
                      {chips.map((label, idx) => (
                        <span
                          key={idx}
                          className={`px-4 py-2 ${colors.tags[idx % colors.tags.length]} rounded-full text-sm font-semibold text-white shadow-md`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* 부케 카드 섹션 */}
                  <div className="p-6 sm:p-8 pl-7 sm:pl-9">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                      {(session.items || []).slice(0, 3).map((it) => {
                        const b = it.bouquet || {}
                        return (
                          <BouquetCard
                            key={it.id}
                            imageUrl={b.imageUrl}
                            title={b.name}
                            tags={[]}
                            to={`/bouquets/${b.id}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

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
          {!hasMore && !loading && sessions.length > 0 && (
            <div className="py-12 text-center text-gray-400">마지막입니다.</div>
          )}
        </div>
      </div>
    </>
  )
}


