import api from './axios'

export async function getMyBouquets(params = {}) {
  const { data } = await api.get('/bouquets/my', { params })
  return data
}

export async function getBouquetDetail(id) {
  const { data } = await api.get(`/bouquets/${id}`)
  return data
}

export async function getAppliedBouquets(params = {}) {
  const { data } = await api.get('/bouquets/applied', { params })
  return data
}

export async function recommendBouquet(payload) {
  const { data } = await api.post('/bouquets/recommend', payload)
  return data
}

export async function getRecommendResult(id) {
  const { data } = await api.get(`/bouquets/recommend/${id}`)
  return data
}

