import React from 'react'
import { Link } from 'react-router-dom'

export default function BouquetCard({ imageUrl, title, tags = [], price, to, onClick }) {
  const formatPrice = (price) => {
    if (!price) return null
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const CardInner = (
    <>
      <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
        <img className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200" src={imageUrl} alt={title} />
      </div>
      <div className="bg-white pt-3 space-y-1.5">
        <h3 className="m-0 font-medium text-gray-900 text-sm leading-tight line-clamp-2">{title}</h3>
        {price !== null && price !== undefined && (
          <div>
            <span className="text-base font-bold text-black leading-none">{formatPrice(price)}원</span>
          </div>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 pt-0.5">
            {tags.slice(0, 2).map((t, idx) => (
              <span key={idx} className="text-xs text-gray-500 leading-relaxed">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="group overflow-hidden bg-white block hover:opacity-90 transition-opacity duration-150">
        {CardInner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className="group text-left overflow-hidden bg-white w-full hover:opacity-90 transition-opacity duration-150">
      {CardInner}
    </button>
  )
}

