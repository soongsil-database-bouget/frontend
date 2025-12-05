import React, { useEffect, useMemo, useState } from 'react'
import BouquetList from '../components/BouquetList'
import { getBouquets } from '../api/bouquet'
import { extractCategoryTags } from '../utils/tagLabels'
import { getProxiedImageUrl } from '../utils/imageUrl'
import BackBar from '../components/BackBar'

const CACHE_KEY = 'bouquets_all_data'
const CACHE_EXPIRY = 30 * 60 * 1000 // 30분

export default function Bouquets() {
  const [allBouquets, setAllBouquets] = useState([]) // 전체 부케 데이터 (원본)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFilterSection, setShowFilterSection] = useState(false)

  // Filters
  const [season, setSeason] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [usage, setUsage] = useState('')

  const SEASONS = [
    { value: '', label: '전체' },
    { value: 'SPRING', label: '봄' },
    { value: 'SUMMER', label: '여름' },
    { value: 'FALL', label: '가을' },
    { value: 'WINTER', label: '겨울' }
  ]

  const PRICE_RANGES = [
    { value: '', label: '전체' },
    { value: '100000', label: '10만원대' },
    { value: '200000', label: '20만원대' },
    { value: '300000', label: '30만원~' }
  ]

  const USAGES = [
    { value: '', label: '전체' },
    { value: 'WEDDING_PHOTO', label: '촬영용' },
    { value: 'WEDDING_CEREMONY', label: '예식용' }
  ]

  // 전체 부케 데이터 로드 (병렬 요청 + 캐싱)
  const loadAllBouquets = async () => {
    // 캐시 확인
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        const now = Date.now()
        if (now - timestamp < CACHE_EXPIRY) {
          setAllBouquets(data)
          setLoading(false)
          return
        }
      }
    } catch (e) {
      console.error('캐시 읽기 실패:', e)
    }

    setLoading(true)
    setError(null)

    try {
      // 전체 부케를 병렬로 가져오기 (55개를 12개씩 나누면 약 5페이지)
      // 또는 size를 크게 설정하여 한 번에 가져오기
      // 먼저 전체 개수 확인
      const firstPage = await getBouquets({ page: 1, size: 12 })
      const totalCount = firstPage?.totalCount || 0
      
      if (totalCount === 0) {
        setAllBouquets([])
        setLoading(false)
        return
      }

      // 전체 페이지 수 계산
      const pageSize = 12
      const totalPages = Math.ceil(totalCount / pageSize)
      
      // 모든 페이지를 병렬로 요청
      const pagePromises = []
      for (let page = 1; page <= totalPages; page++) {
        pagePromises.push(getBouquets({ page, size: pageSize }))
      }

      const responses = await Promise.all(pagePromises)
      
      // 모든 부케 데이터 합치기
      const allBouquetsData = []
      responses.forEach((res) => {
        if (res?.bouquets && Array.isArray(res.bouquets)) {
          allBouquetsData.push(...res.bouquets)
        }
      })

      // 캐시에 저장
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
          data: allBouquetsData,
          timestamp: Date.now()
        }))
      } catch (e) {
        console.error('캐시 저장 실패:', e)
      }

      setAllBouquets(allBouquetsData)
    } catch (e) {
      console.error('부케 로드 실패:', e)
      setError('부케 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 초기 로드
  useEffect(() => {
    loadAllBouquets()
  }, [])

  // 클라이언트 사이드 필터링 (season, usage, priceRange 모두)
  const filteredItems = useMemo(() => {
    if (allBouquets.length === 0) return []

    let filtered = [...allBouquets]

    // season 필터링
    if (season) {
      filtered = filtered.filter((b) => {
        const categories = b.categories || []
        return categories.some((cat) => cat.season === season)
      })
    }

    // usage 필터링
    if (usage) {
      filtered = filtered.filter((b) => {
        const categories = b.categories || []
        return categories.some((cat) => cat.usage === usage)
      })
    }

    // priceRange 필터링
    if (priceRange) {
      filtered = filtered.filter((b) => {
        const price = b.price || 0
        if (priceRange === '100000') {
          return price >= 100000 && price < 200000
        } else if (priceRange === '200000') {
          return price >= 200000 && price < 300000
        } else if (priceRange === '300000') {
          return price >= 300000
        }
        return true
      })
    }

    // 매핑된 아이템으로 변환
    return filtered.map((b) => {
      const displayTags = extractCategoryTags(b.categories || [])
      return {
        id: b.id,
        imageUrl: getProxiedImageUrl(b.imageUrl),
        title: b.name,
        price: b.price,
        vendor: b.store ? { name: b.store.storeName } : undefined,
        tags: displayTags,
      }
    })
  }, [allBouquets, season, usage, priceRange])


  const body = useMemo(() => {
    if (error) {
      return (
        <div className="py-16 text-center text-red-600">
          목록을 불러오지 못했습니다.
        </div>
      )
    }
    if (loading) {
      return (
        <div className="py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">부케 목록을 불러오는 중...</p>
        </div>
      )
    }
    if (filteredItems.length === 0) {
      return (
        <div className="py-16 text-center text-gray-500">표시할 부케가 없습니다.</div>
      )
    }
    return (
      <BouquetList items={filteredItems} itemLinkBase="/bouquets" />
    )
  }, [loading, error, filteredItems])

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 바 */}
      <BackBar title="전체 부케" />

      {/* 메인 콘텐츠 */}
      <div className="max-w-md mx-auto px-4 py-4">
        {/* 서브 헤더: 총 개수 + 필터 버튼 */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-black">
            총 <span style={{ color: 'rgba(255, 105, 147, 1)' }}>{filteredItems.length}</span>개
            {(season || usage || priceRange) && allBouquets.length > 0 && (
              <span className="text-gray-500 ml-1">(전체 {allBouquets.length}개)</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilterSection(!showFilterSection)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-black hover:bg-gray-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M7 12h10M11 18h2" />
            </svg>
            필터
          </button>
        </div>

        {/* 필터 섹션 */}
        {showFilterSection && (
          <div 
            className="mb-4 p-6"
            style={{ backgroundColor: 'rgba(255, 244, 246, 1)' }}
          >
            {/* 계절 */}
        <div className="mb-6">
              <h3 className="text-base font-bold text-black mb-3">계절</h3>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((option) => {
                  const isSelected = season === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSeason(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'text-white'
                          : 'bg-white border border-gray-300 text-gray-700'
                      }`}
                      style={isSelected ? { backgroundColor: 'rgba(255, 105, 147, 1)' } : {}}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 가격대 */}
            <div className="mb-6">
              <h3 className="text-base font-bold text-black mb-3">가격대</h3>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((option) => {
                  const isSelected = priceRange === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriceRange(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'text-white'
                          : 'bg-white border border-gray-300 text-gray-700'
                      }`}
                      style={isSelected ? { backgroundColor: 'rgba(255, 105, 147, 1)' } : {}}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 사용 용도 */}
            <div className="mb-4">
              <h3 className="text-base font-bold text-black mb-3">사용 용도</h3>
              <div className="flex flex-wrap gap-2">
                {USAGES.map((option) => {
                  const isSelected = usage === option.value
                  return (
              <button
                      key={option.value}
                type="button"
                      onClick={() => setUsage(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'text-white'
                          : 'bg-white border border-gray-300 text-gray-700'
                      }`}
                      style={isSelected ? { backgroundColor: 'rgba(255, 105, 147, 1)' } : {}}
              >
                      {option.label}
              </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {body}
      </div>
    </div>
  )
}


