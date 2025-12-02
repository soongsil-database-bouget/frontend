import React, { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BackBar from '../components/BackBar'

export default function Apply() {
  const navigate = useNavigate()
  const location = useLocation()
  const bouquetId = location.state?.bouquetId
  const [selectedImage, setSelectedImage] = useState(null)

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const handleApply = () => {
    if (selectedImage) {
      navigate('/apply/result', { 
        state: { 
          userImage: selectedImage,
          bouquetId 
        } 
      })
    }
  }

  return (
    <>
      <BackBar title="사진 업로드" />
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 pt-6 pb-6">
          {/* 제목 */}
          <h1 className="text-2xl font-bold text-black mb-4">
            사진을 업로드해주세요
          </h1>
          
          {/* 설명 */}
          <div className="mb-6">
            <p className="text-base text-black mb-1">
              부케와 합성할 사진을 선택해주세요.
            </p>
            <p className="text-base text-black">
              얼굴이 잘 보이는 사진을 권장합니다.
            </p>
          </div>

          {/* 업로드 영역 - 정사각형 */}
          <div
            className="border-2 border-dashed rounded-xl aspect-square w-full text-center cursor-pointer transition-colors flex flex-col items-center justify-center relative overflow-hidden mb-6"
            style={{ 
              borderColor: 'rgba(255, 105, 147, 1)',
              backgroundColor: selectedImage ? 'transparent' : 'transparent',
              aspectRatio: '1 / 1'
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {selectedImage ? (
              <>
                <img 
                  src={selectedImage} 
                  alt="선택된 사진" 
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage(null)
                  }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-medium text-white z-10"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                >
                  다른 사진 선택하기
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                {/* 카메라 아이콘 */}
                <div 
                  className="w-20 h-20 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 105, 147, 0.3)' }}
                >
                  <svg 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="rgba(255, 105, 147, 1)" 
                    strokeWidth="2"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                
                {/* 사진 선택하기 텍스트 */}
                <p 
                  className="text-base font-medium mb-2"
                  style={{ color: 'rgba(255, 105, 147, 1)' }}
                >
                  사진 선택하기
                </p>
                
                {/* 파일 형식 안내 */}
                <p className="text-sm text-gray-500">
                  JPG, PNG 파일을 업로드할 수 있습니다
                </p>
              </div>
            )}
            
            <input
              id="file-input"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* 하단 적용하기 버튼 */}
          <button
            onClick={handleApply}
            disabled={!selectedImage}
            className="w-full h-12 rounded-xl font-semibold text-base text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ 
              backgroundColor: selectedImage ? 'rgba(255, 105, 147, 1)' : 'rgba(156, 163, 175, 1)'
            }}
          >
            적용하기
          </button>
        </div>
      </div>
    </>
  )
}

