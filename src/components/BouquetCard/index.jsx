import React from 'react'
import { Link } from 'react-router-dom'

export default function BouquetCard({ imageUrl, title, tags = [], to, onClick }) {
  const CardInner = (
    <>
      <div className="aspect-[4/3] overflow-hidden">
        <img className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" src={imageUrl} alt={title} />
      </div>
      <div className="p-4">
        <h3 className="m-0 font-bold text-gray-900">{title}</h3>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((t, idx) => (
              <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-pink-50 text-pink-600 border border-pink-200">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm block">
        {CardInner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className="group text-left overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm w-full">
      {CardInner}
    </button>
  )
}

