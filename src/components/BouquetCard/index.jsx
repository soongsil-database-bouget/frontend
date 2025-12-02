import React from 'react'
import { Link } from 'react-router-dom'

export default function BouquetCard({ imageUrl, title, tags = [], price, vendor, to, onClick }) {
  const formatPrice = (price) => {
    if (!price) return null
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const CardInner = (
    <>
      <div className="aspect-square overflow-hidden relative bg-gray-100 rounded-[12px]">
        <img className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200 rounded-[12px]" src={imageUrl} alt={title} />
      </div>
      <div className="bg-white pt-3 space-y-1">
        <h3 className="m-0 font-bold text-black text-sm leading-tight line-clamp-2">{title}</h3>
        {vendor?.name && (
          <p className="m-0 text-xs text-gray-500 leading-relaxed">{vendor.name}</p>
        )}
        {price !== null && price !== undefined && (
          <div className="pt-1">
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

