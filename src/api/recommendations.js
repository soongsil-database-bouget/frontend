import api from './axios'

// YAML: POST /recommendations
export async function createRecommendationSession(payload) {
  const { data } = await api.post('/recommendations', payload)
  return data
}

// YAML: GET /recommendations
export async function getRecommendationHistory(params = {}) {
  const { data } = await api.get('/recommendations', { params })
  return data
}

// YAML: GET /recommendations/{sessionId}
export async function getRecommendationDetail(sessionId) {
  const { data } = await api.get(`/recommendations/${sessionId}`)
  return data
}


