import React from 'react'
import { Link } from 'react-router-dom'

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 12c2.761 0 5-2.462 5-5.5S14.761 1 12 1 7 3.462 7 6.5 9.239 12 12 12Zm0 2c-4.418 0-8 2.91-8 6.5 0 .828.672 1.5 1.5 1.5h13c.828 0 1.5-.672 1.5-1.5 0-3.59-3.582-6.5-8-6.5Z"/>
    </svg>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto h-[72px] flex items-center justify-between px-6">
        <a href="/" className="text-pink-500 font-black text-2xl tracking-wide">bouget</a>
        <Link to="/mypage" aria-label="마이페이지로 이동" className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-600 bg-white shadow-sm hover:bg-gray-50">
          <UserIcon />
        </Link>
      </div>
    </header>
  )
}

