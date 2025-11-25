import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import BackBar from '../components/BackBar'
import Modal from '../components/Modal'
import UploadDropzone from '../components/UploadDropzone'
import { getVirtualFittingDetail } from '../api/virtualFittings'
import { extractCategoryTags, getTagChipClasses } from '../utils/tagLabels'

export default function AppliedDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [open, setOpen] = useState(false)
  const [userImage, setUserImage] = useState(null)
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await getVirtualFittingDetail(id)
        if (!cancelled) setDetail(res)
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  const item = useMemo(() => {
    if (!detail) return null
    const b = detail.bouquet || {}
    return {
      id: detail.id,
      title: b.name || `적용 #${detail.id}`,
      resultImageUrl: detail.genImageUrl || detail.srcImageUrl,
      bouquetImageUrl: b.imageUrl,
      bouquetTitle: b.name,
      bouquetDescription: b.description,
      vendorName: b.stores?.[0]?.storeName,
      tags: extractCategoryTags(b.categories),
      appliedAt: detail.createdAt,
    }
  }, [detail])

  const handleShare = async () => {
    try {
      const blob = await fetch(item.resultImageUrl, { mode: 'cors' }).then(r => r.blob())
      await navigator.clipboard.write([new window.ClipboardItem({ [blob.type]: blob })])
      alert('이미지가 클립보드에 복사되었어요. 원하는 곳에 붙여넣기 하세요.')
    } catch {
      alert('클립보드 복사에 실패했어요. HTTPS 환경에서 다시 시도해주세요.')
    }
  }

  const handleDelete = () => {
    // 실제 구현에서는 확인 모달 및 삭제 API 연동
    if (confirm('이 적용 결과를 삭제할까요?')) {
      navigate('/applied/list', { replace: true })
    }
  }

  return (
    <>
      <BackBar title="적용 상세" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/30">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {loading && (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">불러오는 중…</p>
            </div>
          )}
          {error && (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-red-600 text-lg font-medium">상세를 불러오지 못했습니다.</p>
            </div>
          )}
          {!loading && !error && item && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* 왼쪽: 합성 결과 이미지 (강조) */}
              <div className="lg:col-span-2">
                <div className="relative rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100">
                  <div className="aspect-[4/3] lg:aspect-auto">
                    <img
                      className="w-full h-full object-contain lg:object-cover"
                      src={item.resultImageUrl}
                      alt={`${item.title} 합성 결과`}
                    />
                  </div>
                  {/* 이미지 하단 그라데이션 오버레이 */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* 오른쪽: 부케 정보 및 액션 */}
              <div className="space-y-6">
                {/* 부케 정보 카드 */}
                <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-5">
                  <div className="mb-4">
                    <h2 className="text-lg font-extrabold text-gray-900 mb-1">사용한 부케</h2>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                  </div>
                  
                  {/* 모바일: 가로 레이아웃, 데스크톱: 세로 레이아웃 */}
                  <div className="flex gap-4 lg:flex-col lg:gap-4">
                    {/* 부케 이미지 */}
                    <div className="flex-shrink-0 lg:w-full">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-full lg:h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          className="w-full h-full object-cover"
                          src={item.bouquetImageUrl}
                          alt={item.bouquetTitle}
                        />
                      </div>
                    </div>

                    {/* 부케 정보 */}
                    <div className="flex-1 min-w-0 lg:flex-none">
                      <h3 className="text-base font-bold text-gray-900 mb-1 lg:truncate">{item.bouquetTitle}</h3>
                      {item.bouquetDescription && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-2 lg:mb-3 line-clamp-2 lg:line-clamp-none">{item.bouquetDescription}</p>
                      )}
                      {item.vendorName && (
                        <p className="text-xs text-gray-500 mb-2 lg:mb-3 truncate">📍 {item.vendorName}</p>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className={getTagChipClasses(t)}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="space-y-3">
                  <Button
                    className="w-full h-12 px-5 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    onClick={() => setOpen(true)}
                  >
                    다시 적용하기
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-11 px-4 font-semibold"
                      onClick={handleShare}
                    >
                      공유하기
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 px-4 font-semibold text-red-600 border-red-300 hover:bg-red-50"
                      onClick={handleDelete}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 재적용 모달 (다른 상세페이지와 동일 UX) */}
      <Modal open={open} onClose={() => setOpen(false)}>
        {item && (
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                <img src={item.bouquetImageUrl} alt={item.bouquetTitle || '사용 부케'} className="w-full h-40 object-cover" />
              </div>
              <div className="text-2xl text-gray-400">+</div>
              <div className="flex-1 rounded-xl border border-dashed border-gray-300 bg-gray-50 grid place-items-center h-40 overflow-hidden">
                {userImage ? (
                  <img src={userImage} alt="내 사진" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-gray-400 text-sm">내 사진</div>
                )}
              </div>
            </div>

            <div className="mt-5">
              <UploadDropzone onFileSelected={(dataUrl) => setUserImage(dataUrl)} />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" className="h-10 px-4" onClick={() => setOpen(false)}>닫기</Button>
              <Button
                className="h-10 px-5 disabled:opacity-50"
                disabled={!userImage}
                onClick={() => {
                  navigate('/apply/result', { state: { userImage, bouquetImage: item.bouquetImageUrl } })
                }}
              >
                적용하기
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

