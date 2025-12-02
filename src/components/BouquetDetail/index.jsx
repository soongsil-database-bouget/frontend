import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../Modal'
import Button from '../Button'
import { addRecentlyViewed } from '../../utils/recentlyViewed'

export default function BouquetDetail({ item, mode = 'others' }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

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
            disabled
            className="w-full py-4 rounded-xl font-semibold text-base text-white transition-all duration-200 shadow-sm opacity-50 cursor-not-allowed"
            style={{ backgroundColor: 'rgba(255, 105, 147, 1)' }}
          >
            적용하기
          </button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
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
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                {item.title}
              </h3>
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

          {/* 버튼 그룹 */}
          <div className="flex flex-col gap-3">
            <button
              className="w-full h-12 rounded-xl font-semibold text-base text-white transition-all duration-200 shadow-sm opacity-50 cursor-not-allowed"
              style={{ backgroundColor: 'rgba(255, 105, 147, 1)' }}
              disabled
            >
              적용하기
            </button>
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold"
              onClick={() => setOpen(false)}
            >
              닫기
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}


