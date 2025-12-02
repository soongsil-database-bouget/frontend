import React, { useEffect, useState } from 'react'
import BackBar from '../components/BackBar'
import { useLocation, useNavigate } from 'react-router-dom'
import { addAppliedHistory } from '../utils/appliedHistory'
import { createVirtualFitting } from '../api/virtualFittings'

export default function ApplyResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const userImage = location.state?.userImage
  const bouquetId = location.state?.bouquetId
  const [resultImage, setResultImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userImage || !bouquetId) {
      setError('이미지 또는 부케 정보가 없습니다.')
      setLoading(false)
      return
    }

    // API 호출하여 합성 이미지 생성
    const generateResult = async () => {
      try {
        setLoading(true)
        // userImage를 File로 변환
        const response = await fetch(userImage)
        const blob = await response.blob()
        const file = new File([blob], 'user-image.jpg', { type: 'image/jpeg' })
        
        const formData = new FormData()
        formData.append('bouquet_id', bouquetId)
        formData.append('user_image', file)
        
        const result = await createVirtualFitting(formData)
        if (result?.genImageUrl) {
          setResultImage(result.genImageUrl)
          addAppliedHistory({ 
            imageUrl: result.genImageUrl, 
            title: '적용 결과',
            bouquetId: bouquetId
          })
        } else {
          setError('합성 결과를 받지 못했습니다.')
        }
      } catch (err) {
        console.error('합성 실패:', err)
        setError('이미지 합성에 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    generateResult()
  }, [userImage, bouquetId])

  return (
    <>
      <BackBar title="적용 결과" />
      <div className="min-h-screen bg-white pb-24">
        <div className="max-w-md mx-auto px-4 pt-6">
          {/* 제목 */}
          <h1 className="text-2xl font-bold text-black mb-2">
            완성되었습니다!
          </h1>
          
          {/* 설명 */}
          <p className="text-base text-black mb-6">
            부케가 적용된 모습을 확인해보세요
          </p>

          {/* 결과 이미지 */}
          {loading ? (
            <div className="w-full aspect-[3/3] rounded-xl border-2 flex items-center justify-center mb-6"
              style={{ borderColor: 'rgba(255, 105, 147, 1)' }}
            >
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600">합성 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full aspect-[3/3] rounded-xl border-2 flex items-center justify-center mb-6 bg-gray-50"
              style={{ borderColor: 'rgba(255, 105, 147, 1)' }}
            >
              <p className="text-red-600">{error}</p>
            </div>
          ) : resultImage ? (
            <div className="w-full aspect-[3/3] rounded-xl border-2 overflow-hidden mb-6 relative"
              style={{ borderColor: 'rgba(255, 105, 147, 1)' }}
            >
              <img 
                src={resultImage} 
                alt="적용 결과" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}

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
        </div>
      </div>
    </>
  )
}

