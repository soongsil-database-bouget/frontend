import React from 'react'
import BouquetCard from '../BouquetCard'

export default function BouquetList({ items = [], itemLinkBase = '/others' }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <BouquetCard
          key={item.id}
          imageUrl={item.imageUrl}
          title={item.title}
          tags={item.tags}
          to={`${itemLinkBase}/${item.id}`}
        />
      ))}
    </div>
  )
}

