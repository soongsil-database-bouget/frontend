import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BackBar from '../components/BackBar'
import { getMe } from '../api/user'
import { getVirtualFittingHistory } from '../api/virtualFittings'

export default function MyPage() {
  const [userInfo, setUserInfo] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [appliedPreview, setAppliedPreview] = useState([])
  const [loadingApplied, setLoadingApplied] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoadingUser(true)
        const user = await getMe()
        if (!cancelled) {
          setUserInfo(user)
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        if (!cancelled) {
          setUserInfo(null)
        }
      } finally {
        if (!cancelled) setLoadingUser(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoadingApplied(true)
        const res = await getVirtualFittingHistory({ page: 1, size: 4 })
        const list = res?.items ?? []
        if (!cancelled) {
          const mapped = list.map((v) => ({
            id: v.id,
            imageUrl: v.genImageUrl || v.srcImageUrl || v.bouquet?.imageUrl,
            title: v.bouquet?.name || `적용 #${v.id}`,
          }))
          setAppliedPreview(mapped)
        }
      } catch (error) {
        console.error('Failed to fetch applied bouquets:', error)
        if (!cancelled) {
          setAppliedPreview([])
        }
      } finally {
        if (!cancelled) setLoadingApplied(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <BackBar title="마이페이지" />
      <div className="max-w-screen-2xl px-6 py-6">
        <section className="rounded-2xl border border-pink-100 bg-gradient-to-r from-rose-50 to-pink-50 p-6">
          <div className="flex items-center gap-4">
            {userInfo?.profileImageUrl ? (
              <img 
                src={userInfo.profileImageUrl} 
                alt={userInfo.name || '프로필'} 
                className="w-16 h-16 rounded-full ring-2 ring-pink-100 object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/70 ring-2 ring-pink-100 grid place-items-center text-pink-500">
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M12 12c2.761 0 5-2.462 5-5.5S14.761 1 12 1 7 3.462 7 6.5 9.239 12 12 12Zm0 2c-4.418 0-8 2.91-8 6.5 0 .828.672 1.5 1.5 1.5h13c.828 0 1.5-.672 1.5-1.5 0-3.59-3.582-6.5-8-6.5Z"/>
                </svg>
              </div>
            )}
            <div>
              {loadingUser ? (
                <div className="text-xl font-extrabold text-gray-400">로딩 중...</div>
              ) : (
                <>
                  <div className="text-xl font-extrabold text-gray-900">
                    {userInfo?.name || '사용자님'}
                  </div>
                  {userInfo?.email && (
                    <div className="text-sm text-gray-500">{userInfo.email}</div>
                  )}
                </>
              )}
              <div className="text-gray-600 mt-1">
                <span className="text-pink-500 font-semibold">bouget</span>과 함께하는 특별한 순간
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <Link to="/applied/list" className="block rounded-2xl border border-gray-200 hover:border-pink-300 bg-white">
            <div className="px-4 py-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-bold text-gray-900">적용해본 부케</div>
                <div className="text-gray-500 text-sm">부케를 적용한 사진들을 확인하세요</div>
                <div className="mt-3 grid grid-cols-4 gap-2 overflow-hidden">
                  {loadingApplied ? (
                    <div className="col-span-4 text-sm text-gray-400">불러오는 중...</div>
                  ) : appliedPreview.length === 0 ? (
                    <div className="col-span-4 text-sm text-gray-400">적용해본 부케가 없어요</div>
                  ) : (
                    appliedPreview.slice(0, 4).map((it, idx) => (
                      <div key={it.id || idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
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

