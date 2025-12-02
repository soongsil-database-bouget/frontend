import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BouquetList from '../components/BouquetList'
import BouquetCard from '../components/BouquetCard'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { getBouquets } from '../api/bouquet'
import { getRecommendationHistory } from '../api/recommendations'
import { extractCategoryTags, RAW_TO_KO_LABEL, getTagChipClasses } from '../utils/tagLabels'
import { getVirtualFittingHistory } from '../api/virtualFittings'

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M20 2H4C2.897 2 2 2.897 2 4v14c0 1.103.897 2 2 2h3v3.586L12.586 20H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z"/>
    </svg>
  )
}

const mockItems = []

const mockMyReceived = [
  { id: 101, imageUrl: 'https://images.unsplash.com/photo-1622658641558-235f26dd270b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', title: '추천 부케 1', tags: ['로맨틱'] },
  { id: 102, imageUrl: 'https://picsum.photos/seed/myr2/600/400', title: '추천 부케 2', tags: ['내추럴'] },
  { id: 103, imageUrl: 'https://picsum.photos/seed/myr3/600/400', title: '추천 부케 3', tags: ['모던'] }
]

// Removed mockApplied; now loading from API

export default function Main() {
  const navigate = useNavigate()
  const [previewBouquets, setPreviewBouquets] = useState([])
  const [loadingPreview, setLoadingPreview] = useState(true)
  const [latestSession, setLatestSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [appliedPreview, setAppliedPreview] = useState([])
  const [loadingApplied, setLoadingApplied] = useState(true)
  const [selectedBouquet, setSelectedBouquet] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoadingPreview(true)
        const res = await getBouquets({ page: 1, size: 4 })
        const list = res?.bouquets ?? []
        if (!cancelled) {
          const mapped = list.slice(0, 4).map((b) => {
            const rawTags = (b.categories || []).flatMap((c) => [
              c.season,
              c.dressMood,
              c.dressSilhouette,
              c.weddingColor,
              c.bouquetAtmosphere,
              c.usage,
            ]).filter(Boolean)
            const displayTags = extractCategoryTags(b.categories)
            return {
            id: b.id,
            imageUrl: b.imageUrl,
            title: b.name,
            tags: displayTags,
            price: b.price,
          }
          })
          setPreviewBouquets(mapped)
        }
      } finally {
        if (!cancelled) setLoadingPreview(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoadingSession(true)
        const res = await getRecommendationHistory({ page: 1, size: 1 })
        const s = res?.items?.[0] || null
        if (!cancelled) setLatestSession(s)
      } finally {
        if (!cancelled) setLoadingSession(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoadingApplied(true)
        const res = await getVirtualFittingHistory({ page: 1, size: 4 })
        const list = res?.items ?? []
        if (!cancelled) {
          const mapped = list.slice(0, 4).map((v) => ({
            id: v.id,
            imageUrl: v.genImageUrl || v.srcImageUrl || v.bouquet?.imageUrl,
            bouquetImageUrl: v.bouquet?.imageUrl,
            title: v.bouquet?.name || `적용 #${v.id}`,
            tags: extractCategoryTags(v.bouquet?.categories),
            price: v.bouquet?.price ?? null,
          }))
          setAppliedPreview(mapped)
        }
      } finally {
        if (!cancelled) setLoadingApplied(false)
      }
    })()
    return () => { cancelled = true }
  }, [])
  return (
    <div className="min-h-full bg-gray-50">
      <section className="relative min-h-[450px] grid items-center bg-black overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="/웨딩배너3.avif"
          alt="웨딩 배너"
        />
        <div className="absolute inset-0 bg-black/25" />
        
        {/* 히어로 콘텐츠 */}
        <div className="relative text-white text-center max-w-md mx-auto px-4 py-16 z-10">
          <h1 className="m-0 text-3xl md:text-4xl font-black leading-tight mb-3 text-white drop-shadow-lg">
            어떤 부케가 잘 어울릴지
            <br />
            고민이신가요?
          </h1>
          <p className="mt-3 text-white/95 text-sm font-medium mb-6 drop-shadow-md">
            눌러서 부케 추천받기
          </p>
          <button
            onClick={() => navigate('/recommend')}
            className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 active:opacity-80 shadow-md hover:shadow-lg"
            style={{ backgroundColor: 'rgba(255, 105, 147, 1)' }}
          >
            부케 추천받기
          </button>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-end justify-between gap-3 mb-6">
            <h2 className="m-0 text-xl font-bold text-black">전체 부케</h2>
            <Link to="/bouquets" className="text-sm text-black font-semibold hover:text-gray-700 transition-colors">전체 보기</Link>
          </div>
          {loadingPreview ? (
            <div className="py-12 text-center text-gray-500">불러오는 중…</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {previewBouquets.map((item) => (
                <BouquetCard
                  key={item.id}
                  imageUrl={item.imageUrl}
                  title={item.title}
                  tags={item.tags}
                  price={item.price}
                  to={`/bouquets/${item.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-end justify-between gap-3 mb-6">
            <h2 className="m-0 text-xl font-bold text-black">내가 추천받은 부케 묶음</h2>
            <Link to="/recommendations" className="text-sm text-black font-semibold hover:text-gray-700 transition-colors">전체 보기</Link>
          </div>
          {loadingSession ? (
            <div className="py-8 text-center text-gray-500">불러오는 중…</div>
          ) : latestSession ? (() => {
            const season = latestSession.season
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
            return (
              <div className="overflow-hidden bg-white">
                {/* 옵션 강조 섹션 */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center flex-wrap gap-2">
                    {[
                      latestSession.season && RAW_TO_KO_LABEL[latestSession.season],
                      latestSession.dressMood && RAW_TO_KO_LABEL[latestSession.dressMood],
                      latestSession.weddingColor && RAW_TO_KO_LABEL[latestSession.weddingColor],
                      latestSession.bouquetAtmosphere && RAW_TO_KO_LABEL[latestSession.bouquetAtmosphere],
                    ].filter(Boolean).map((label, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-gray-600"
                      >
                        #{label}
                      </span>
                    ))}
                  </div>
                </div>
                {/* 부케 카드 섹션 */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {(latestSession.items || []).slice(0, 4).map((it) => {
                      const b = it?.bouquet || {}
                      const displayTags = extractCategoryTags(b.categories)
                      const bouquetPrice = b?.price ?? null
                      return (
                        <BouquetCard
                          key={it.id}
                          imageUrl={b.imageUrl}
                          title={b.name}
                          tags={displayTags}
                          price={bouquetPrice}
                          onClick={() => {
                            setSelectedBouquet({
                              id: b.id,
                              bouquetId: it.bouquetId || b.id, // 부케 상세 조회용 bouquetId
                              imageUrl: b.imageUrl,
                              title: b.name,
                              description: b.description || '',
                              tags: displayTags,
                            })
                            setModalOpen(true)
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })() : (
            <div className="py-12 text-center text-gray-500">추천 내역이 없습니다.</div>
          )}
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-end justify-between gap-3 mb-6">
            <h2 className="m-0 text-xl font-bold text-black">적용해본 부케</h2>
            <Link to="/applied/list" className="text-sm text-black font-semibold hover:text-gray-700 transition-colors">전체 보기</Link>
          </div>
          {loadingApplied ? (
            <div className="py-12 text-center text-gray-500">불러오는 중…</div>
          ) : appliedPreview.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                  <path d="M20 7h-4m-2-2v4m2-2l-3 3m3-3l3 3M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m6 0h4a2 2 0 0 1 2 2v4m0 6v4a2 2 0 0 1-2 2h-4m-6 0H5a2 2 0 0 1-2-2v-4m0-6V5a2 2 0 0 1 2-2h4" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">적용해본 부케가 없습니다</p>
              <p className="text-gray-400 text-xs mt-1">부케를 적용해보시면 여기에 표시됩니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {appliedPreview.map(item => (
                <Link key={item.id} to={`/applied/${item.id}`} className="group overflow-hidden bg-white hover:opacity-90 transition-opacity duration-150">
                  <div className="aspect-[4/3] overflow-hidden relative bg-gray-100 rounded-[12px]">
                    <img className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200 rounded-[12px]" src={item.imageUrl} alt={item.title} />
                    {item.bouquetImageUrl && (
                      <div className="absolute top-2 right-2">
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm bg-white">
                          <img className="w-full h-full object-cover" src={item.bouquetImageUrl} alt={`${item.title} 사용 부케`} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-white pt-3 space-y-1.5">
                    <div className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">{item.title}</div>
                    {item.price !== null && item.price !== undefined && (
                      <div>
                        <span className="text-base font-bold text-black leading-none">{new Intl.NumberFormat('ko-KR').format(item.price)}원</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 pt-0.5">
                      {item.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-xs text-gray-500 leading-relaxed">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* <section className="py-10">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="m-0 text-xl font-extrabold">다른 사람이 추천 받은 부케</h2>
            <Link to="/others/list" className="text-sm text-pink-600 font-semibold hover:underline">전체 보기</Link>
          </div>
          <BouquetList items={mockItems} itemLinkBase="/others" />
        </div>
      </section> */}

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
    </div>
  )
}

