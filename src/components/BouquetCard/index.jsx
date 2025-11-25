import React from 'react'
import { Link } from 'react-router-dom'
import { getTagChipClasses } from '../../utils/tagLabels'

export default function BouquetCard({ imageUrl, title, tags = [], to, onClick }) {
  const CardInner = (
    <>
      <div className="aspect-[4/3] overflow-hidden relative">
        <img className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" src={imageUrl} alt={title} />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
      </div>
      <div className="p-4">
        <h3 className="m-0 font-semibold text-gray-900">{title}</h3>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((t, idx) => (
              <span key={idx} className={getTagChipClasses(t)}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm hover:shadow-lg transition-shadow block">
        {CardInner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className="group text-left overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm hover:shadow-lg transition-shadow w-full">
      {CardInner}
    </button>
  )
}

