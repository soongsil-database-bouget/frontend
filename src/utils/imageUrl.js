/**
 * 이미지 URL을 프록시를 통해 요청하도록 변환
 * 절대 URL (http://, https://)로 시작하면 그대로 사용
 * 상대 경로면 /api를 앞에 붙여서 프록시를 통해 요청
 * 
 * @param {string} url - 이미지 URL
 * @returns {string} 프록시를 통한 이미지 URL
 */
export function getProxiedImageUrl(url) {
  if (!url) return ''
  
  // 절대 URL이면 그대로 반환
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

