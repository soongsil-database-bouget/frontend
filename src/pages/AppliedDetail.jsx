import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import BackBar from '../components/BackBar'
import Modal from '../components/Modal'
import UploadDropzone from '../components/UploadDropzone'
import { getVirtualFittingDetail } from '../api/virtualFittings'
import { extractCategoryTags, getTagChipClasses } from '../utils/tagLabels'
import { getProxiedImageUrl } from '../utils/imageUrl'

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
      resultImageUrl: getProxiedImageUrl(detail.genImageUrl || detail.srcImageUrl),
      bouquetImageUrl: getProxiedImageUrl(b.imageUrl),
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
      <BackBar title="적용 결과" />
      <div className="min-h-screen bg-white pb-24">
        <div className="max-w-md mx-auto px-4 pt-6">
          {loading && (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">불러오는 중…</p>
            </div>
          )}
          {error && (
            <div className="py-20 text-center">
              <p className="text-red-600">상세를 불러오지 못했습니다.</p>
            </div>
          )}
          {!loading && !error && item && (
            <>
              {/* 제목 */}
              <h1 className="text-2xl font-bold text-black mb-2">
                완성되었습니다!
              </h1>
              
              {/* 설명 */}
              <p className="text-base text-black mb-6">
                부케가 적용된 모습을 확인해보세요
              </p>

              {/* 결과 이미지 */}
              <div className="w-full aspect-[3/3] rounded-xl border-2 overflow-hidden mb-6 relative"
                style={{ borderColor: 'rgba(255, 105, 147, 1)' }}
              >
                <img 
                  src={item.resultImageUrl} 
                  alt="적용 결과" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 부케 정보 카드 */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-6">
                <div className="flex items-start gap-4">
                  {/* 부케 이미지 썸네일 */}
                  {item.bouquetImageUrl && (
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        className="w-full h-full object-cover"
                        src={item.bouquetImageUrl}
                        alt={item.bouquetTitle}
                      />
                    </div>
                  )}
                  
                  {/* 부케 정보 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                      {item.bouquetTitle}
                    </h3>
                    {item.bouquetDescription && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                        {item.bouquetDescription}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 3).map((tag, idx) => (
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
              </div>

              {/* 하단 버튼 */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/applied/list')}
                  className="w-full h-12 rounded-xl font-semibold text-base transition-all duration-200 border-2"
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: 'rgba(255, 105, 147, 1)',
                    color: 'rgba(255, 105, 147, 1)'
                  }}
                >
                  적용사진 모두 확인하기
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full h-12 rounded-xl font-semibold text-base text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: 'rgba(255, 105, 147, 1)' }}
                >
                  홈으로 돌아가기
                </button>
              </div>
            </>
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

