import React, { useEffect, useMemo, useState } from 'react'
import BouquetList from '../components/BouquetList'
import { getBouquets } from '../api/bouquet'
import { extractCategoryTags, RAW_TO_KO_LABEL } from '../utils/tagLabels'
import { getProxiedImageUrl } from '../utils/imageUrl'
import BackBar from '../components/BackBar'

export default function Bouquets() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
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

  async function load() {
    setLoading(true)
    setError(null)
    try {
      // Server-side filters
      const params = {
        page: 1,
        size: 30,
        ...(season ? { season } : {}),
        ...(usage ? { usage } : {}),
      }
      const res = await getBouquets(params)
      const list = res?.bouquets ?? []

      // Client-side filter for price range
      const filtered = list.filter((b) => {
        const cats = b.categories || []
        const matchSeason = !season || cats.some((c) => c.season === season)
        const matchUsage = !usage || cats.some((c) => c.usage === usage)
        
        // Price range filter
        let matchPrice = true
        if (priceRange) {
          const price = b.price || 0
          if (priceRange === '100000') {
            matchPrice = price >= 100000 && price < 200000
          } else if (priceRange === '200000') {
            matchPrice = price >= 200000 && price < 300000
          } else if (priceRange === '300000') {
            matchPrice = price >= 300000
          }
        }
        
        return matchSeason && matchUsage && matchPrice
      })

      const mapped = filtered.map((b) => {
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
      setItems(mapped)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await load()
    })()
    return () => {
      cancelled = true
    }
  // re-load when filters change
  }, [season, priceRange, usage])


  const body = useMemo(() => {
    if (loading) {
      return (
        <div className="py-16 text-center text-gray-500">불러오는 중…</div>
      )
    }
    if (error) {
      return (
        <div className="py-16 text-center text-red-600">
          목록을 불러오지 못했습니다.
        </div>
      )
    }
    if (items.length === 0) {
      return (
        <div className="py-16 text-center text-gray-500">표시할 부케가 없습니다.</div>
      )
    }
    return <BouquetList items={items} itemLinkBase="/bouquets" />
  }, [loading, error, items])

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 바 */}
      <BackBar title="전체 부케" />

      {/* 메인 콘텐츠 */}
      <div className="max-w-md mx-auto px-4 py-4">
        {/* 서브 헤더: 총 개수 + 필터 버튼 */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-black">
            총 <span style={{ color: 'rgba(255, 105, 147, 1)' }}>{items.length}</span>개
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


