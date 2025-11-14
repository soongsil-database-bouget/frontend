import React from 'react'
import { Link } from 'react-router-dom'
import BackBar from '../components/BackBar'
import { getRecentlyViewed } from '../utils/recentlyViewed'
import { getAppliedHistory } from '../utils/appliedHistory'

export default function MyPage() {
  const recent = getRecentlyViewed().slice(0, 5)
  const applied = getAppliedHistory().slice(0, 5)
  return (
    <>
      <BackBar title="마이페이지" />
      <div className="max-w-screen-2xl px-6 py-6">
        <section className="rounded-2xl border border-pink-100 bg-gradient-to-r from-rose-50 to-pink-50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/70 ring-2 ring-pink-100 grid place-items-center text-pink-500">
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 12c2.761 0 5-2.462 5-5.5S14.761 1 12 1 7 3.462 7 6.5 9.239 12 12 12Zm0 2c-4.418 0-8 2.91-8 6.5 0 .828.672 1.5 1.5 1.5h13c.828 0 1.5-.672 1.5-1.5 0-3.59-3.582-6.5-8-6.5Z"/>
              </svg>
            </div>
            <div>
              <div className="text-xl font-extrabold text-gray-900">사용자님</div>
              <div className="text-gray-600">
                <span className="text-pink-500 font-semibold">bouget</span>과 함께하는 특별한 순간
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-3">
          <Link to="/recent/list" className="block rounded-2xl border border-gray-200 hover:border-pink-300 bg-white">
            <div className="px-4 py-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-bold text-gray-900">최근 본 부케</div>
                <div className="text-gray-500 text-sm">최근에 본 부케를 확인하세요</div>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {recent.length === 0 ? (
                    <div className="col-span-5 text-sm text-gray-400">최근 본 부케가 없어요</div>
                  ) : (
                    recent.map((it, idx) => (
                      <div key={it.imageUrl || idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img className="w-full h-full object-cover" src={it.imageUrl} alt={it.title || `recent-${idx}`} />
                      </div>
                    ))
                  )}
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-400" aria-hidden="true">
                <path fill="currentColor" d="m10 17 5-5-5-5v10z"/>
              </svg>
            </div>
          </Link>

          <Link to="/applied/list" className="block rounded-2xl border border-gray-200 hover:border-pink-300 bg-white">
            <div className="px-4 py-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-bold text-gray-900">적용해본 부케</div>
                <div className="text-gray-500 text-sm">부케를 적용한 사진들을 확인하세요</div>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {applied.length === 0 ? (
                    <div className="col-span-5 text-sm text-gray-400">적용해본 부케가 없어요</div>
                  ) : (
                    applied.map((it, idx) => (
                      <div key={it.imageUrl || idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img className="w-full h-full object-cover" src={it.imageUrl} alt={it.title || `applied-${idx}`} />
                      </div>
                    ))
                  )}
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-400" aria-hidden="true">
                <path fill="currentColor" d="m10 17 5-5-5-5v10z"/>
              </svg>
            </div>
          </Link>
        </section>
      </div>
    </>
  )
}

