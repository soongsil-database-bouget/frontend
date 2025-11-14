import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function BackBar({ title }) {
  const navigate = useNavigate()
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="relative h-14 max-w-screen-2xl mx-auto flex items-center gap-2 px-2">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
          <span className="text-sm font-medium">뒤로</span>
        </button>
        {title && (
          <div className="absolute inset-x-0 text-center pointer-events-none">
            <div className="text-base font-extrabold text-gray-900">{title}</div>
          </div>
        )}
      </div>
    </div>
  )
}

