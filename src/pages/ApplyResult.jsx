import React, { useEffect, useState, useRef } from 'react'
import BackBar from '../components/BackBar'
import { useLocation, useNavigate } from 'react-router-dom'
import { addAppliedHistory } from '../utils/appliedHistory'
import { createVirtualFitting, getVirtualFittingDetail } from '../api/virtualFittings'
import { getProxiedImageUrl } from '../utils/imageUrl'

export default function ApplyResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const userImage = location.state?.userImage
  const bouquetId = location.state?.bouquetId
  const [resultImage, setResultImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const pollingIntervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const startTimeRef = useRef(null)
  const isCompletedRef = useRef(false)
  const hasRequestStartedRef = useRef(false)

  useEffect(() => {
    if (!userImage || !bouquetId) {
      setError('이미지 또는 부케 정보가 없습니다.')
      setLoading(false)
      return
    }

    // 뒤로가기/앞으로가기로 돌아온 경우 중복 요청 방지
    // sessionStorage에 저장된 요청 키 생성 (userImage와 bouquetId 기반)
    const requestKey = `apply_result_${bouquetId}_${userImage.substring(0, 50)}`
    const hasProcessed = sessionStorage.getItem(requestKey)
    
    if (hasProcessed === 'processing' || hasProcessed === 'completed') {
      // 이미 처리 중이거나 완료된 경우 요청하지 않음
      // 단, 완료된 경우 결과 이미지를 복원할 수 있지만, 
      // 현재는 location.state가 없으면 복원 불가능하므로 에러 표시
      if (hasProcessed === 'completed') {
        setError('이미 처리된 요청입니다. 처음부터 다시 시도해주세요.')
      } else {
        setError('이미 처리 중인 요청입니다.')
      }
      setLoading(false)
      return
    }

    // 이미 이 컴포넌트에서 요청이 시작되었는지 확인
    if (hasRequestStartedRef.current) {
      return
    }
    
    hasRequestStartedRef.current = true
    sessionStorage.setItem(requestKey, 'processing')

    // API 호출하여 합성 이미지 생성
    const generateResult = async () => {
      try {
        setLoading(true)
        setError(null)
        startTimeRef.current = Date.now()
        isCompletedRef.current = false
        
        // userImage를 File로 변환
        const response = await fetch(userImage)
        const blob = await response.blob()
        const file = new File([blob], 'user-image.jpg', { type: 'image/jpeg' })
        
        const formData = new FormData()
        formData.append('bouquet_id', bouquetId)
        formData.append('user_image', file)
        
        // 합성 요청 생성
        const result = await createVirtualFitting(formData)
        const applyImageId = result?.id
        
        if (!applyImageId) {
          setError('합성 요청을 생성하지 못했습니다.')
          setLoading(false)
          return
        }

        // 폴링 함수: 상태 확인
        const pollStatus = async () => {
          try {
            const detail = await getVirtualFittingDetail(applyImageId)
            const status = detail?.status
            const genImageUrl = detail?.genImageUrl

            if (isCompletedRef.current) {
              return // 이미 완료된 경우 중복 처리 방지
            }

            if (status === 'DONE' && genImageUrl) {
              // 합성 완료
              isCompletedRef.current = true
              clearInterval(pollingIntervalRef.current)
              clearTimeout(timeoutRef.current)
              const proxiedImageUrl = getProxiedImageUrl(genImageUrl)
              setResultImage(proxiedImageUrl)
              setLoading(false)
              sessionStorage.setItem(requestKey, 'completed')
              addAppliedHistory({ 
                imageUrl: proxiedImageUrl, 
                title: '적용 결과',
                bouquetId: bouquetId
              })
            } else if (status === 'FAILED') {
              // 합성 실패
              isCompletedRef.current = true
              clearInterval(pollingIntervalRef.current)
              clearTimeout(timeoutRef.current)
              setError('이미지 합성에 실패했습니다.')
              setLoading(false)
              sessionStorage.removeItem(requestKey) // 실패한 경우 제거하여 재시도 가능하게
            } else if (status === 'PENDING') {
              // 아직 진행 중, 계속 폴링
              // 타임아웃 체크는 setTimeout에서 처리
            }
          } catch (err) {
            console.error('상태 확인 실패:', err)
            // 폴링 중 에러가 발생해도 계속 시도
          }
        }

        // 첫 번째 상태 확인 (즉시)
        await pollStatus()

        // 3초마다 상태 확인 (폴링)
        pollingIntervalRef.current = setInterval(pollStatus, 3000)

        // 최대 3분 후 타임아웃
        timeoutRef.current = setTimeout(() => {
          if (!isCompletedRef.current) {
            isCompletedRef.current = true
            clearInterval(pollingIntervalRef.current)
            setError('합성 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.')
            setLoading(false)
            sessionStorage.removeItem(requestKey) // 타임아웃 시 제거하여 재시도 가능하게
          }
        }, 180000)

      } catch (err) {
        console.error('합성 실패:', err)
        setError('이미지 합성에 실패했습니다.')
        setLoading(false)
        sessionStorage.removeItem(requestKey) // 에러 시 제거하여 재시도 가능하게
        hasRequestStartedRef.current = false
      }
    }

    generateResult()

    // cleanup: 컴포넌트 언마운트 시 폴링 중단
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // 언마운트 시에는 sessionStorage는 유지 (뒤로가기로 돌아올 수 있으므로)
      // 단, 완료/실패/타임아웃 시에만 제거하거나 완료로 표시
    }
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

