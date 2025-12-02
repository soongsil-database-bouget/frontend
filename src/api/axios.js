import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 120000, // 120초로 증가 (이미지 합성 작업 대응)
})

api.interceptors.request.use((config) => {
  // 토큰을 헤더에 자동 추가
  const token = localStorage.getItem('accessToken')
  if (token && token.trim() !== '' && token !== 'session_active') {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // 401 Unauthorized 에러 발생 시 토큰만 삭제
    // 리다이렉트는 ProtectedRoute나 각 컴포넌트에서 처리하도록 함
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken')
    }
    return Promise.reject(err)
  }
)

export default api

