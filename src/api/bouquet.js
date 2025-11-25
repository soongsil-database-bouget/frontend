import api from './axios'

// YAML: GET /bouquets
export async function getBouquets(params = {}) {
  const { data } = await api.get('/bouquets', { params })
  return data
}

// YAML: GET /bouquets/{bouquetId}
export async function getBouquetDetail(bouquetId) {
  const { data } = await api.get(`/bouquets/${bouquetId}`)
  return data
}

