import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import BackBar from '../components/BackBar'
import Modal from '../components/Modal'
import UploadDropzone from '../components/UploadDropzone'

export default function AppliedDetail() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [userImage, setUserImage] = useState(null)

  // Mock: 결과 이미지(합성)와 사용한 부케 이미지
  const item = useMemo(() => ({
    id: 11,
    title: '화이트 튤립 with 인물',
    resultImageUrl: 'https://picsum.photos/seed/applied1/1200/900',
    bouquetImageUrl: 'https://images.unsplash.com/photo-1470093851219-69951fcbb533?q=80&w=1600&auto=format&fit=crop',
    bouquetTitle: '화이트 튤립 부케',
    bouquetDescription: '심플하고 세련된 화이트 튤립 부케',
    vendorName: '트로피컬 가든',
    tags: ['미니멀', '화이트'],
    appliedAt: '2025-11-10 14:23'
  }), [])

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
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 프리뷰: 상단(작은 부케 정보 카드) + 하단(큰 합성 결과) */}
          <div className="space-y-4">
            {/* 상단: 가로형 작은 부케 정보 카드 */}
            <div className="rounded-xl border border-gray-200 bg-white p-3 max-w-xl">
              <div className="flex items-center gap-3">
                <div className="w-24 h-16 md:w-28 md:h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                  <img className="w-full h-full object-cover" src={item.bouquetImageUrl} alt={item.bouquetTitle} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">{item.bouquetTitle}</div>
                  <div className="text-xs text-gray-600 mt-0.5 break-words">{item.bouquetDescription}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.vendorName}</div>
                </div>
              </div>
            </div>
            {/* 하단: 큰 합성 결과 */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
              <div className="aspect-[4/3]">
                <img className="w-full h-full object-cover" src={item.resultImageUrl} alt={`${item.title} 합성 결과`} />
              </div>
            </div>
          </div>

          {/* 정보/액션 */}
          <div>
            <h1 className="text-2xl font-extrabold">{item.title}</h1>
            <div className="mt-1 text-sm text-gray-500">적용 일시: {item.appliedAt}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((t, idx) => (
                <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-pink-50 text-pink-600 border border-pink-200">
                  {t}
                </span>
              ))}
            </div>

            {/* 위치 토글 제거됨 */}

            {/* 핵심 액션 */}
            <div className="mt-6 flex flex-wrap gap-2">
            <Button className="h-11 px-5" onClick={() => setOpen(true)}>다시 적용</Button>
            <Button variant="outline" className="h-11 px-5" onClick={handleShare}>공유하기</Button>
              <Button variant="outline" className="h-11 px-5" onClick={handleDelete}>삭제</Button>
            </div>
          </div>
        </div>
      </div>

      {/* 재적용 모달 (다른 상세페이지와 동일 UX) */}
      <Modal open={open} onClose={() => setOpen(false)}>
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
      </Modal>
    </>
  )
}

