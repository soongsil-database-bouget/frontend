import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 120000, // 120초로 증가 (이미지 합성 작업 대응)
})

api.interceptors.request.use((config) => {
  // 토큰을 헤더에 자동 추가
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
)

export default api

