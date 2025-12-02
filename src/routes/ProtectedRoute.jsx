import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getMe } from '../api/user'

/**
 * 토큰 형식이 유효한지 확인 (기본 검증)
 * @param {string|null} token - localStorage에서 가져온 토큰
 * @returns {boolean} 토큰 형식이 유효하면 true
 */
function isValidTokenFormat(token) {
  if (!token) return false
  if (typeof token !== 'string') return false
  if (token.trim() === '') return false
  // 이전 세션 기반 인증 값 제외
  if (token === 'session_active') return false
  // 최소 길이 체크 (JWT 토큰은 보통 최소 20자 이상)
  if (token.length < 10) return false
  return true
}

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const checkAuth = async () => {
      // 1단계: 토큰 형식 검증
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      if (!isValidTokenFormat(token)) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
        }
        if (!cancelled) {
          setIsAuthenticated(false)
          setIsLoading(false)
        }
        return
      }

      // 2단계: 실제 서버에서 사용자 인증 상태 확인
      try {
        await getMe()
        // 인증 성공
        if (!cancelled) {
          setIsAuthenticated(true)
          setIsLoading(false)
        }
      } catch (error) {
        // 401 Unauthorized 또는 기타 인증 에러
        if (error?.response?.status === 401 || !error?.response) {
          // 토큰이 무효하거나 만료됨
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken')
          }
        }
        if (!cancelled) {
          setIsAuthenticated(false)
          setIsLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      cancelled = true
    }
  }, [])

  // 로딩 중일 때는 아무것도 렌더링하지 않음 (또는 로딩 UI 표시)
  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center text-gray-600">인증 확인 중...</div>
      </div>
    )
  }

  // 인증되지 않았으면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 인증 성공 시 자식 컴포넌트 렌더링
  return <>{children}</>
}

