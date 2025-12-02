import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function BackBar({ title }) {
  const navigate = useNavigate()
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="relative h-14 max-w-screen-2xl mx-auto flex items-center gap-2 px-4">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        {title && (
          <div className="absolute inset-x-0 text-center pointer-events-none">
            <div className="text-base font-bold text-black">{title}</div>
          </div>
        )}
      </div>
    </div>
  )
}

