import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY
  // Prefer runtime origin to avoid bundling localhost redirect into dist
  const runtimeRedirect = `${window.location.origin}/auth/kakao/callback`
  const redirectUri =
    (import.meta.env.VITE_KAKAO_REDIRECT_URI && !import.meta.env.VITE_KAKAO_REDIRECT_URI.includes('localhost'))
      ? import.meta.env.VITE_KAKAO_REDIRECT_URI
      : runtimeRedirect

  // If token exists, go to home immediately
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (token) {
      navigate('/', { replace: true })
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

