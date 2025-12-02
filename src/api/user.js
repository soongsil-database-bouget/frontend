import api from './axios'

// YAML: POST /auth/kakao/login
export async function loginWithKakao(payload) {
  const { data } = await api.post('/auth/kakao/login', payload)
  return data
}

// Backward-compatible alias if existing code imported `login`
export const login = loginWithKakao

// YAML: POST /auth/logout (204 No Content expected)
// security: bearerAuth 필요
export async function logout() {
  await api.post('/auth/logout')
  // 로그아웃 성공 시 토큰 삭제
  localStorage.removeItem('accessToken')
}

// YAML: GET /users/me
export async function getMe() {
  const { data } = await api.get('/users/me')
  return data
}

