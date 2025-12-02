import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithKakao } from '../api/user'

/**
 * 카카오 인가 코드 유효성 검증
 * @param {string} code - 카카오 인가 코드
 * @returns {{ isValid: boolean, error?: string }}
 */
function validateKakaoCode(code) {
  if (!code) {
    return { isValid: false, error: '인가 코드가 없습니다.' }
  }

  // 코드가 비어있는지 확인
  if (code.trim().length === 0) {
    return { isValid: false, error: '인가 코드가 비어있습니다.' }
  }

  // 카카오 인가 코드는 일반적으로 최소 20자 이상
  if (code.length < 20) {
    return { isValid: false, error: '인가 코드 형식이 올바르지 않습니다. (너무 짧음)' }
  }

  // 카카오 인가 코드는 영문자, 숫자, 일부 특수문자로 구성
  // 일반적으로 알파벳, 숫자, 언더스코어, 하이픈 등이 포함됨
  const codePattern = /^[A-Za-z0-9_-]+$/
  if (!codePattern.test(code)) {
    return { isValid: false, error: '인가 코드 형식이 올바르지 않습니다. (잘못된 문자 포함)' }
  }

  return { isValid: true }
}

export default function KakaoCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [validationStatus, setValidationStatus] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const errorParam = params.get('error')
    const errorDescription = params.get('error_description')
    
    // 카카오에서 에러를 반환한 경우
    if (errorParam) {
      setError(`카카오 로그인 중 오류가 발생했습니다: ${errorDescription || errorParam}`)
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 3000)
      return
    }
    
    // 코드가 없는 경우
    if (!code) {
      setError('인가 코드를 받지 못했습니다. 다시 로그인해주세요.')
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
      return
    }

    // 코드 형식 검증
    const validation = validateKakaoCode(code)
    if (!validation.isValid) {
      setError(validation.error || '인가 코드가 유효하지 않습니다.')
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
      return
    }

    setValidationStatus({ isValid: true, message: '인가 코드 형식 검증 완료' })

    // 카카오 redirectUri 가져오기 (Login 페이지와 동일한 로직)
    const runtimeRedirect = `${window.location.origin}/auth/kakao/callback`
    const redirectUri =
      (import.meta.env.VITE_KAKAO_REDIRECT_URI && !import.meta.env.VITE_KAKAO_REDIRECT_URI.includes('localhost'))
        ? import.meta.env.VITE_KAKAO_REDIRECT_URI
        : runtimeRedirect

    const requestPayload = {
      authorizationCode: code,
      redirectUri: redirectUri
    }

    // 백엔드로 인가 코드 전송
    loginWithKakao(requestPayload)
      .then((response) => {
        // 응답 데이터 검증
        if (!response || typeof response !== 'object') {
          setError('서버 응답이 올바르지 않습니다.')
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 2000)
          return
        }

        // userId가 있는지 확인
        if (!response.userId) {
          setError('로그인 정보를 받지 못했습니다.')
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 2000)
          return
        }

        // 토큰 기반 인증: 응답에서 받은 토큰을 localStorage에 저장
        const token = response.accessToken || response.token
        if (token) {
          localStorage.setItem('accessToken', token)
        } else {
          setError('토큰을 받지 못했습니다.')
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 2000)
          return
        }
        navigate('/', { replace: true })
      })
      .catch((err) => {
        // 에러 타입별 메시지 설정
        let errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.'
        
        if (err.response) {
          const status = err.response.status
          
          if (status === 400) {
            errorMessage = '인가 코드 또는 리다이렉트 URI가 올바르지 않습니다.'
          } else if (status === 401) {
            errorMessage = '인증에 실패했습니다. 인가 코드가 만료되었거나 유효하지 않을 수 있습니다.'
          } else if (status === 500) {
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          }
        } else if (err.request) {
          errorMessage = '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.'
        }
        
        setError(errorMessage)
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      })
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center text-gray-600">카카오 로그인 처리중...</div>
    </div>
  )
}

