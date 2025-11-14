// localStorage helper for applied bouquets
const STORAGE_KEY = 'appliedBouquetHistory'
const MAX_ITEMS = 50

export function getAppliedHistory() {
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

export function addAppliedHistory(entry) {
  // entry: { imageUrl, title }
  if (!entry || !entry.imageUrl) return
  const now = Date.now()
  const current = getAppliedHistory()
  const next = [{ imageUrl: entry.imageUrl, title: entry.title || '', appliedAt: now }, ...current]
  const limited = next.slice(0, MAX_ITEMS)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited))
  } catch {
    // ignore
  }
}

export function clearAppliedHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // no-op
  }
}


