import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../api/user'

export default function Login() {
  const navigate = useNavigate()
  const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY
  // Prefer runtime origin to avoid bundling localhost redirect into dist
  const runtimeRedirect = `${window.location.origin}/auth/kakao/callback`
  const redirectUri =
    (import.meta.env.VITE_KAKAO_REDIRECT_URI && !import.meta.env.VITE_KAKAO_REDIRECT_URI.includes('localhost'))
      ? import.meta.env.VITE_KAKAO_REDIRECT_URI
      : runtimeRedirect

  // 실제 인증 상태 확인 후 메인으로 이동
  useEffect(() => {
    let cancelled = false

    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      
      // 토큰 형식 검증
      if (!token || typeof token !== 'string' || token.trim() === '' || token === 'session_active' || token.length < 10) {
        return
      }

      // 실제 서버에서 인증 상태 확인
      try {
        await getMe()
        // 인증 성공 시에만 메인으로 이동
        if (!cancelled) {
          navigate('/', { replace: true })
        }
      } catch (error) {
        // 인증 실패 시 토큰 삭제하고 로그인 페이지에 머물기
        if (error?.response?.status === 401 || !error?.response) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken')
          }
        }
        // 로그인 페이지에 머물기 (아무것도 하지 않음)
      }
    }

    checkAuth()

    return () => {
      cancelled = true
    }
  }, [navigate])

  const handleKakaoLogin = () => {
    if (!clientId || !redirectUri) {
      alert('Kakao 설정이 없습니다. .env에 VITE_KAKAO_REST_API_KEY, VITE_KAKAO_REDIRECT_URI를 설정하세요.')
      return
    }
    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
    window.location.href = authUrl
  }

  return (
    <div className="min-h-screen grid place-items-center bg-white">
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="text-center mb-8">
          <div className="text-pink-500 font-black text-3xl">Bloomfit</div>
          <p className="mt-2 text-gray-600">부케 추천을 받으려면 카카오로 로그인하세요</p>
        </div>
        <button
          type="button"
          onClick={handleKakaoLogin}
          className="w-full h-12 rounded-xl font-bold"
          style={{ backgroundColor: '#FEE500', color: '#000000' }}
        >
          카카오 로그인
        </button>
        <p className="mt-4 text-xs text-gray-500 text-center">
          로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  )
}

