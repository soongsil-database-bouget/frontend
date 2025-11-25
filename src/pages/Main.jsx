import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BouquetList from '../components/BouquetList'
import BouquetCard from '../components/BouquetCard'
import Button from '../components/Button'
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

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoadingPreview(true)
        const res = await getBouquets({ page: 1, size: 3 })
        const list = res?.bouquets ?? []
        if (!cancelled) {
          const mapped = list.slice(0, 3).map((b) => {
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
        const res = await getVirtualFittingHistory({ page: 1, size: 3 })
        const list = res?.items ?? []
        if (!cancelled) {
          const mapped = list.slice(0, 3).map((v) => ({
            id: v.id,
            imageUrl: v.genImageUrl || v.srcImageUrl || v.bouquet?.imageUrl,
            bouquetImageUrl: v.bouquet?.imageUrl,
            title: v.bouquet?.name || `적용 #${v.id}`,
            tags: extractCategoryTags(v.bouquet?.categories),
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
    <div className="min-h-full">
      <section className="relative min-h-[520px] grid items-center isolate">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="/웨딩배너3.avif"
          alt=""
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative text-white text-center max-w-screen-xl mx-auto px-4">
          <h1 className="m-0 text-3xl md:text-4xl font-black leading-snug">
            어떤 부케가 잘 어울릴지
            <br />
            고민이신가요?
          </h1>
          <p className="mt-2 text-gray-100 font-medium">
            눌러서 부케 추천받기
            <br />
            아무데서 클릭!
          </p>
        </div>
        <button
          className="absolute inset-0 bg-transparent border-0 cursor-pointer"
          aria-label="부케 추천 받기"
          onClick={() => navigate('/recommend')}
        ></button>
      </section>

      <section className="py-9">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="m-0 text-lg font-bold">전체 부케</h2>
            <Link to="/bouquets" className="text-sm text-pink-600 font-semibold hover:underline">전체 보기</Link>
          </div>
          {loadingPreview ? (
            <div className="py-8 text-center text-gray-500">불러오는 중…</div>
          ) : (
            <BouquetList items={previewBouquets} itemLinkBase="/bouquets" />
          )}
        </div>
      </section>

      <section className="py-9">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-end justify-between gap-3 mb-6">
            <h2 className="m-0 text-lg font-bold">내가 추천받은 부케 묶음</h2>
            <Link to="/recommendations" className="text-sm text-pink-600 font-semibold hover:underline">전체 보기</Link>
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
            const colors = seasonColors[season] || seasonColors.SPRING
            return (
              <div className="rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100 relative">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.bar}`}></div>
                {/* 옵션 강조 섹션 */}
                <div className="bg-white p-4 sm:p-5">
                  <div className="flex items-center flex-wrap gap-3 pl-4">
                    {[
                      latestSession.season && RAW_TO_KO_LABEL[latestSession.season],
                      latestSession.dressMood && RAW_TO_KO_LABEL[latestSession.dressMood],
                      latestSession.weddingColor && RAW_TO_KO_LABEL[latestSession.weddingColor],
                      latestSession.bouquetAtmosphere && RAW_TO_KO_LABEL[latestSession.bouquetAtmosphere],
                    ].filter(Boolean).map((label, idx) => (
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
                    {(latestSession.items || []).slice(0, 3).map((it) => {
                      const b = it?.bouquet || {}
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
          })() : (
            <div className="py-8 text-center text-gray-500">추천 내역이 없습니다.</div>
          )}
        </div>
      </section>

      <section className="py-9 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="m-0 text-lg font-bold">적용해본 부케</h2>
            <Link to="/applied/list" className="text-sm text-pink-500 font-semibold hover:underline">전체 보기</Link>
          </div>
          {loadingApplied ? (
            <div className="py-8 text-center text-gray-500">불러오는 중…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {appliedPreview.map(item => (
                <Link key={item.id} to={`/applied/${item.id}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" src={item.imageUrl} alt={item.title} />
                    {item.bouquetImageUrl && (
                      <div className="absolute top-2 right-2">
                        <div className="w-16 h-16 rounded-lg overflow-hidden ring-2 ring-white shadow-md border border-gray-200 bg-white">
                          <img className="w-full h-full object-cover" src={item.bouquetImageUrl} alt={`${item.title} 사용 부케`} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-gray-900">{item.title}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className={getTagChipClasses(t)}>
                          {t}
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
    </div>
  )
}

