// Simple localStorage helper for recently viewed bouquets
const STORAGE_KEY = 'recentlyViewedBouquets'
const MAX_ITEMS = 50

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function addRecentlyViewed(entry) {
  // entry: { imageUrl, title }
  if (!entry || !entry.imageUrl) return
  const now = Date.now()
  const current = getRecentlyViewed()
  const withoutDup = current.filter(it => it.imageUrl !== entry.imageUrl)
  const next = [{ imageUrl: entry.imageUrl, title: entry.title || '', viewedAt: now }, ...withoutDup]
  const limited = next.slice(0, MAX_ITEMS)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited))
  } catch {
    // ignore quota errors
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // no-op
  }
}


