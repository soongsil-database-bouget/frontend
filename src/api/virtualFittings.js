import api from './axios'

// YAML: POST /virtual-fittings (multipart/form-data)
// Caller constructs FormData with keys: bouquet_id (number), user_image (File), optional session_id (number)
export async function createVirtualFitting(formData) {
  const { data } = await api.post('/virtual-fittings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
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


