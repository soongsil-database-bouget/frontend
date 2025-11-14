import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function KakaoCallback() {
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) {
      navigate('/login', { replace: true })
      return
    }
    // NOTE: 실제 구현에서는 backend로 code를 전달하여 토큰을 교환합니다.
    // 여기서는 데모용으로 localStorage에 임시 토큰을 저장하고 홈으로 이동합니다.
    const demoToken = `kakao_code_${code}`
    localStorage.setItem('accessToken', demoToken)

    // 만약 백엔드가 있다면:
    // fetch(`${apiBase || ''}/auth/kakao/callback?code=${encodeURIComponent(code)}`, { credentials: 'include' })
    //   .then(r => r.json())
    //   .then(({ accessToken }) => {
    //     localStorage.setItem('accessToken', accessToken)
    //     navigate('/', { replace: true })
    //   })
    //   .catch(() => navigate('/login', { replace: true }))

    navigate('/', { replace: true })
  }, [navigate, apiBase])

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center text-gray-600">카카오 로그인 처리중...</div>
    </div>
  )
}

