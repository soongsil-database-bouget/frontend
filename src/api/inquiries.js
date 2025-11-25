import api from './axios'

// YAML: POST /inquiries
export async function createInquiry(payload) {
  const { data } = await api.post('/inquiries', payload)
  return data
}

// YAML: GET /inquiries/my
export async function getMyInquiries(params = {}) {
  const { data } = await api.get('/inquiries/my', { params })
  return data
}


