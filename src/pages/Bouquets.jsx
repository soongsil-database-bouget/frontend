import React, { useEffect, useMemo, useState } from 'react'
import BouquetList from '../components/BouquetList'
import { getBouquets } from '../api/bouquet'
import { extractCategoryTags, RAW_TO_KO_LABEL } from '../utils/tagLabels'

export default function Bouquets() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [season, setSeason] = useState('')
  const [dressMood, setDressMood] = useState('')
  const [weddingColor, setWeddingColor] = useState('')
  const [bouquetAtmosphere, setBouquetAtmosphere] = useState('')

  const SEASONS = ['SPRING', 'SUMMER', 'FALL', 'WINTER'].map(v => ({ value: v, label: RAW_TO_KO_LABEL[v] }))
  const DRESS_MOODS = ['BOHEMIAN', 'LACE', 'SIMPLE', 'LUXURY'].map(v => ({ value: v, label: RAW_TO_KO_LABEL[v] }))
  const WEDDING_COLORS = ['CLASSIC', 'PASTEL', 'NEUTRAL', 'VIVID'].map(v => ({ value: v, label: RAW_TO_KO_LABEL[v] }))
  const BOUQUET_ATMOSPHERES = ['ROMANTIC_GARDEN', 'CLASSIC_ELEGANCE', 'MODERN_MINIMAL', 'NATURAL_BOHEMIAN'].map(v => ({ value: v, label: RAW_TO_KO_LABEL[v] }))

  async function load() {
    setLoading(true)
    setError(null)
    try {
      // Server-side filters (Prism may ignore; we also filter client-side below)
      const params = {
        page: 1,
        size: 30,
        ...(season ? { season } : {}),
        ...(dressMood ? { dress_mood: dressMood } : {}),
        ...(weddingColor ? { wedding_color: weddingColor } : {}),
        ...(bouquetAtmosphere ? { bouquet_atmosphere: bouquetAtmosphere } : {}),
      }
      const res = await getBouquets(params)
      const list = res?.bouquets ?? []

      // Client-side fallback filter using categories[]
      const filtered = list.filter((b) => {
        const cats = b.categories || []
        const matchSeason = !season || cats.some((c) => c.season === season)
        const matchDress = !dressMood || cats.some((c) => c.dressMood === dressMood)
        const matchColor = !weddingColor || cats.some((c) => c.weddingColor === weddingColor)
        const matchAtmos = !bouquetAtmosphere || cats.some((c) => c.bouquetAtmosphere === bouquetAtmosphere)
        return matchSeason && matchDress && matchColor && matchAtmos
      })

      const mapped = filtered.map((b) => {
        const displayTags = extractCategoryTags(b.categories)
        return {
        id: b.id,
        imageUrl: b.imageUrl,
        title: b.name,
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
  }, [season, dressMood, weddingColor, bouquetAtmosphere])

  const activeFilters = useMemo(() => {
    const arr = []
    if (season) arr.push(RAW_TO_KO_LABEL[season])
    if (dressMood) arr.push(RAW_TO_KO_LABEL[dressMood])
    if (weddingColor) arr.push(RAW_TO_KO_LABEL[weddingColor])
    if (bouquetAtmosphere) arr.push(RAW_TO_KO_LABEL[bouquetAtmosphere])
    return arr
  }, [season, dressMood, weddingColor, bouquetAtmosphere])

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
    <div className="py-10">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="mb-5">
          <h1 className="m-0 text-2xl font-extrabold">전체 부케</h1>
          <p className="m-0 mt-2 text-gray-600">필터를 선택해 원하는 부케를 찾아보세요.</p>
        </div>

        {/* Filters (not sticky) */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <select className="h-11 px-3 rounded-xl border border-gray-300 bg-white shadow-sm hover:border-gray-400"
                value={season} onChange={(e) => setSeason(e.target.value)}>
                <option value="">계절감(전체)</option>
                {SEASONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              <select className="h-11 px-3 rounded-xl border border-gray-300 bg-white shadow-sm hover:border-gray-400"
                value={dressMood} onChange={(e) => setDressMood(e.target.value)}>
                <option value="">드레스 무드(전체)</option>
                {DRESS_MOODS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              <select className="h-11 px-3 rounded-xl border border-gray-300 bg-white shadow-sm hover:border-gray-400"
                value={weddingColor} onChange={(e) => setWeddingColor(e.target.value)}>
                <option value="">전체 웨딩 색감(전체)</option>
                {WEDDING_COLORS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              <select className="h-11 px-3 rounded-xl border border-gray-300 bg-white shadow-sm hover:border-gray-400"
                value={bouquetAtmosphere} onChange={(e) => setBouquetAtmosphere(e.target.value)}>
                <option value="">부케 무드(전체)</option>
                {BOUQUET_ATMOSPHERES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="text-sm text-gray-600 mr-1">총 {items.length}개</div>
            {activeFilters.map((label, idx) => (
              <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                {label}
              </span>
            ))}
            {(season || dressMood || weddingColor || bouquetAtmosphere) && (
              <button
                type="button"
                onClick={() => { setSeason(''); setDressMood(''); setWeddingColor(''); setBouquetAtmosphere('') }}
                className="ml-auto h-8 px-3 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                초기화
              </button>
            )}
          </div>
        </div>

        {body}
      </div>
    </div>
  )
}


