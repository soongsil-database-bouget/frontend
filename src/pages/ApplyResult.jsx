import React, { useCallback, useEffect, useState } from 'react'
import BackBar from '../components/BackBar'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { addAppliedHistory } from '../utils/appliedHistory'

export default function ApplyResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const userImage = location.state?.userImage
  const bouquetImage = location.state?.bouquetImage
  const bouquetTitle = location.state?.bouquetTitle || '선택한 부케'
  const bouquetDescription = location.state?.bouquetDescription || '부케 설명 정보가 없습니다'
  const vendorName = location.state?.vendorName || '업체 정보'
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (bouquetImage) {
      addAppliedHistory({ imageUrl: bouquetImage, title: '적용 부케' })
    }
  }, [bouquetImage])

  const handleDownload = useCallback(async () => {
    if (!userImage || !bouquetImage) return
    try {
      setIsDownloading(true)
      const baseImg = await loadImage(userImage)
      const overlayImg = await loadImage(bouquetImage)
      const width = baseImg.naturalWidth || 1200
      const height = baseImg.naturalHeight || 900
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(baseImg, 0, 0, width, height)
      // Overlay at bottom-right with padding and scale
      const padding = Math.round(Math.min(width, height) * 0.03)
      const overlayW = Math.round(width * 0.28)
      const aspect = overlayImg.naturalWidth && overlayImg.naturalHeight
        ? overlayImg.naturalHeight / overlayImg.naturalWidth
        : 1
      const overlayH = Math.round(overlayW * aspect)
      const x = width - overlayW - padding
      const y = height - overlayH - padding
      ctx.drawImage(overlayImg, x, y, overlayW, overlayH)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'apply-result.jpg'
      document.body.appendChild(a)
      a.click()
      a.remove()
    } finally {
      setIsDownloading(false)
    }
  }, [userImage, bouquetImage])

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.crossOrigin = 'anonymous'
      img.src = src
    })
  }

  return (
    <>
      <BackBar title="적용 결과" />
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 상단: 부케 정보 카드, 하단: 합성 결과 프리뷰 */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-3 max-w-xl">
              <div className="flex items-center gap-3">
                <div className="w-24 h-16 md:w-28 md:h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                  {bouquetImage ? (
                    <img className="w-full h-full object-cover" src={bouquetImage} alt={bouquetTitle} />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-gray-400 text-xs">부케 이미지</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">{bouquetTitle}</div>
                  <div className="text-xs text-gray-600 mt-0.5 break-words">{bouquetDescription}</div>
                  <div className="text-xs text-gray-400 mt-1">{vendorName}</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
              <div className="aspect-[4/3] relative">
                {userImage ? (
                  <img src={userImage} alt="내 사진" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-gray-400">내 사진</div>
                )}
              </div>
            </div>
          </div>

          {/* 우측: 액션 및 정보(간단) */}
          <div>
            <h1 className="text-2xl font-extrabold">적용 결과</h1>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button className="h-11 px-5" onClick={() => navigate(-1)}>다시 적용</Button>
              <Button
                variant="outline"
                className="h-11 px-5 disabled:opacity-50"
                disabled={isDownloading}
                onClick={async () => {
                  // 공유하기: 캔버스 합성 후 클립보드 복사
                  if (!userImage || !bouquetImage) return
                  try {
                    setIsDownloading(true)
                    const baseImg = await loadImage(userImage)
                    const overlayImg = await loadImage(bouquetImage)
                    const width = baseImg.naturalWidth || 1200
                    const height = baseImg.naturalHeight || 900
                    const canvas = document.createElement('canvas')
                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(baseImg, 0, 0, width, height)
                    const padding = Math.round(Math.min(width, height) * 0.03)
                    const overlayW = Math.round(width * 0.28)
                    const aspect = overlayImg.naturalWidth && overlayImg.naturalHeight
                      ? overlayImg.naturalHeight / overlayImg.naturalWidth
                      : 1
                    const overlayH = Math.round(overlayW * aspect)
                    const x = width - overlayW - padding
                    const y = height - overlayH - padding
                    ctx.drawImage(overlayImg, x, y, overlayW, overlayH)
                    await new Promise((resolve, reject) => {
                      canvas.toBlob(async (blob) => {
                        if (!blob) return reject(new Error('blob error'))
                        try {
                          await navigator.clipboard.write([
                            new window.ClipboardItem({ [blob.type]: blob })
                          ])
                          resolve()
                        } catch (err) {
                          reject(err)
                        }
                      }, 'image/png', 0.92)
                    })
                    alert('이미지가 클립보드에 복사되었어요. 원하는 곳에 붙여넣기 하세요.')
                  } catch {
                    alert('클립보드 복사에 실패했어요. HTTPS 환경에서 다시 시도해주세요.')
                  } finally {
                    setIsDownloading(false)
                  }
                }}
              >
                {isDownloading ? '공유 준비...' : '공유하기'}
              </Button>
              <Button variant="outline" className="h-11 px-5" onClick={() => navigate('/')}>메인으로</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

