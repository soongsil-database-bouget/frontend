import api from './axios'

// YAML: POST /virtual-fittings (multipart/form-data)
// Caller constructs FormData with keys: bouquet_id (number), user_image (File), optional session_id (number)
export async function createVirtualFitting(formData) {
  const { data } = await api.post('/virtual-fittings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000 // 이미지 합성은 시간이 오래 걸릴 수 있으므로 120초로 설정
  })
  return data
}

// YAML: GET /virtual-fittings
export async function getVirtualFittingHistory(params = {}) {
  const { data } = await api.get('/virtual-fittings', { params })
  return data
}

// YAML: GET /virtual-fittings/{id}
export async function getVirtualFittingDetail(id) {
  const { data } = await api.get(`/virtual-fittings/${id}`)
  return data
}


