import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../Modal'
import UploadDropzone from '../UploadDropzone'
import Button from '../Button'
import { addRecentlyViewed } from '../../utils/recentlyViewed'

export default function BouquetDetail({ item, mode = 'others' }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [userImage, setUserImage] = useState(null)

  useEffect(() => {
    addRecentlyViewed({ imageUrl: item.imageUrl, title: item.title })
    // run once per item
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.imageUrl])

  const formatPrice = (price) => {
    if (!price) return null
    return new Intl.NumberFormat('ko-KR').format(price) + '원'
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* 부케 이미지 */}
        <div className="w-full aspect-square bg-gray-50">
          <img 
            className="w-full h-full object-cover" 
            src={item.imageUrl} 
            alt={item.title} 
          />
        </div>

        {/* 상품 정보 섹션 */}
        <div className="max-w-md mx-auto px-4 pt-6 pb-8">
          {/* 가게명 */}
          {item.vendor?.name && (
            <div className="mb-2">
              <div className="text-sm text-gray-600 font-medium">
                {item.vendor.name}
              </div>
            </div>
          )}

          {/* 부케 이름 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {item.title}
          </h1>

          {/* 해시태그 */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 mb-5">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium"
                  style={{ color: 'rgba(255, 105, 147, 0.75)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 가격 */}
          {item.price && (
            <div className="text-2xl font-bold text-gray-900 mb-7">
              {formatPrice(item.price)}
            </div>
          )}

          {/* 상품 설명 */}
          {item.description && (
            <div className="mb-8">
              <div className="text-xs text-gray-400 mb-2.5 font-medium">
                상품 설명
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* 적용하기 버튼 */}
          <button
            onClick={() => setOpen(true)}
            className="w-full py-4 rounded-xl font-semibold text-base text-white transition-all duration-200 hover:opacity-90 active:opacity-80 shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'rgba(255, 105, 147, 1)' }}
          >
            적용하기
          </button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
              <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
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
                navigate('/apply/result', { state: { userImage, bouquetImage: item.imageUrl } })
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


