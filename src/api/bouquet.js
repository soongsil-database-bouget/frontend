import api from './axios'

// YAML: GET /bouquets
export async function getBouquets(params = {}) {
  const { data } = await api.get('/bouquets', { params })
  
  // 응답 받자마자 categories를 배열로 변환
  if (data?.bouquets && Array.isArray(data.bouquets)) {
    data.bouquets = data.bouquets.map((b) => {
      if (b.categories && !Array.isArray(b.categories)) {
        return { ...b, categories: [b.categories] }
      }
      return b
    })
  }
  
  return data
}

// YAML: GET /bouquets/{bouquetId}
export async function getBouquetDetail(bouquetId) {
  const { data } = await api.get(`/bouquets/${bouquetId}`)
  
  // 응답 받자마자 categories를 배열로 변환
  if (data?.categories && !Array.isArray(data.categories)) {
    data.categories = [data.categories]
  }
  
  return data
}

