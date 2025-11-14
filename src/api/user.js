import api from './axios'

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function getMe() {
  const { data } = await api.get('/users/me')
  return data
}

