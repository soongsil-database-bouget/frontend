import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BackBar from '../components/BackBar'
import { getVirtualFittingHistory } from '../api/virtualFittings'
import { extractCategoryTags } from '../utils/tagLabels'

export default function AppliedList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const body = useMemo(() => {
    if (loading) return <div className="py-12 text-center text-gray-500">불러오는 중…</div>
    if (error) return <div className="py-12 text-center text-red-600">목록을 불러오지 못했습니다.</div>
    if (items.length === 0) return <div className="py-12 text-center text-gray-500">표시할 항목이 없습니다.</div>
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(item => (
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
                  <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-pink-50 text-pink-600 border border-pink-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }, [loading, error, items])

  return (
    <>
      <BackBar title="적용해본 부케" />
      <div className="max-w-screen-2xl mx-auto px-6 py-10">
        {body}
      </div>
    </>
  )
}

