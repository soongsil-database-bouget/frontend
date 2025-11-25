import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { getRecommendationDetail, getRecommendationHistory } from '../api/recommendations'
import { RAW_TO_KO_LABEL, getTagChipClasses, extractCategoryTags } from '../utils/tagLabels'

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
        tags: extractCategoryTags(b.categories),
      }
    })
  }, [session])

  const optionChips = useMemo(() => {
    if (!session) return []
    return [
      session.season && RAW_TO_KO_LABEL[session.season],
      session.dressMood && RAW_TO_KO_LABEL[session.dressMood],
      session.weddingColor && RAW_TO_KO_LABEL[session.weddingColor],
      session.bouquetAtmosphere && RAW_TO_KO_LABEL[session.bouquetAtmosphere],
    ].filter(Boolean)
  }, [session])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-purple-50/20">
      {/* 상단 헤더 섹션 */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
              당신을 위한 추천 결과
            </h1>
            <p className="text-pink-100 text-sm sm:text-base mb-8">
              선택하신 옵션에 맞춘 특별한 부케를 찾아드렸어요
            </p>
            {optionChips.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                {optionChips.map((label, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-sm font-medium shadow-lg"
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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

        {!loading && !error && items.length > 0 && (
          <div className="space-y-8 sm:space-y-12">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="group relative"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <Link
                  to={`/bouquets/${item.id}`}
                  className="block overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* 이미지 섹션 */}
                    <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[400px] overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src={item.imageUrl}
                        alt={item.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      {/* 순위 배지 */}
                      <div className="absolute top-6 left-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                          <span className="text-xl font-bold text-pink-600">#{index + 1}</span>
                        </div>
                      </div>
                    </div>

                    {/* 정보 섹션 */}
                    <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                      <div className="mb-4">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                          {item.title}
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                      </div>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {item.tags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="px-3 py-1.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto pt-6">
                        <div className="inline-flex items-center text-pink-600 font-semibold group-hover:gap-3 transition-all">
                          <span>자세히 보기</span>
                          <svg
                            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

