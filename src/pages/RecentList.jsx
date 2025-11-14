import React from 'react'
import BackBar from '../components/BackBar'
import { getRecentlyViewed, clearRecentlyViewed } from '../utils/recentlyViewed'
import BouquetCard from '../components/BouquetCard'

export default function RecentList() {
  const recent = getRecentlyViewed().slice(0, 5)
  const hasItems = recent.length > 0

  return (
    <>
      <BackBar title="최근 본 부케" />
      <div className="max-w-screen-2xl mx-auto px-6 py-10">
      {hasItems ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recent.map((it, idx) => (
            <BouquetCard key={it.imageUrl || idx} imageUrl={it.imageUrl} title={it.title || ''} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          최근 본 부케가 없어요
        </div>
      )}

      <div className="mt-6 text-right">
        <button
          type="button"
          className="text-sm text-gray-400 hover:text-gray-600 underline"
          onClick={() => {
            clearRecentlyViewed()
            window.location.reload()
          }}
          title="최근 본 목록 초기화"
        >
          목록 초기화
        </button>
      </div>
      </div>
    </>
  )
}


