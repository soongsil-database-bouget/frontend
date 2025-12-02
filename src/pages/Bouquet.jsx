import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import BouquetDetail from '../components/BouquetDetail'
import { getBouquetDetail } from '../api/bouquet'
import { extractCategoryTags } from '../utils/tagLabels'
import BackBar from '../components/BackBar'

export default function Bouquet() {
  const { id } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await getBouquetDetail(id)
        if (!cancelled) setDetail(res)
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  const mapped = useMemo(() => {
    if (!detail) return null
    const displayTags = extractCategoryTags(detail.categories)
    return {
      id: detail.id,
      imageUrl: detail.imageUrl,
      title: detail.name,
      description: detail.description,
      price: detail.price,
      tags: displayTags,
      vendor: detail.store
        ? {
            name: detail.store.storeName,
            address: detail.store.storeUrl,
            instagram: detail.store.instagramId,
          }
        : undefined,
    }
  }, [detail])

  if (loading) {
    return (
      <>
        <BackBar title="부케 상세" />
        <div className="py-16 text-center text-gray-500">불러오는 중…</div>
      </>
    )
  }
  if (error) {
    return (
      <>
        <BackBar title="부케 상세" />
        <div className="py-16 text-center text-red-600">상세를 불러오지 못했습니다.</div>
      </>
    )
  }
  if (!mapped) return null

  return (
    <>
      <BackBar title="부케 상세" />
      <BouquetDetail item={mapped} mode="others" />
    </>
  )
}


