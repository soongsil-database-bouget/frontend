import React from 'react'
import { Link } from 'react-router-dom'

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="w-full h-[72px] flex items-center justify-between px-4">
        <a href="/" className="text-black font-black text-2xl tracking-wide">Bloomfit</a>
        <Link to="/mypage" aria-label="마이페이지로 이동" className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-600 bg-white shadow-sm hover:bg-gray-50">
          <UserIcon />
        </Link>
      </div>
    </header>
  )
}

