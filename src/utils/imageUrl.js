/**
 * 이미지 URL을 프록시를 통해 요청하도록 변환
 * 백엔드 서버의 절대 URL도 프록시를 통해 요청하도록 변환
 * 외부 URL (unsplash, picsum 등)은 그대로 사용
 * 
 * @param {string} url - 이미지 URL
 * @returns {string} 프록시를 통한 이미지 URL
 */
export function getProxiedImageUrl(url) {
  if (!url) return ''
  
  // 백엔드 서버 URL인 경우 프록시 경로로 변환
  const backendUrl = 'http://52.78.57.66:8080'
  if (url.startsWith(backendUrl)) {
    // 백엔드 서버 URL에서 경로 부분만 추출하여 /api 추가
    const path = url.replace(backendUrl, '')
    return `/api${path}`
  }
  
  // 다른 절대 URL (외부 이미지 등)은 그대로 반환
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 상대 경로면 /api를 앞에 붙임
  // 이미 /api로 시작하면 그대로 반환
  if (url.startsWith('/api/')) {
    return url
  }
  
  // /로 시작하는 상대 경로면 /api 추가
  if (url.startsWith('/')) {
    return `/api${url}`
  }
  
  // 상대 경로면 /api/ 추가
  return `/api/${url}`
}

