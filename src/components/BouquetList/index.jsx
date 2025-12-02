import React from 'react'
import BouquetCard from '../BouquetCard'

export default function BouquetList({ items = [], itemLinkBase = '/others' }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <BouquetCard
          key={item.id}
          imageUrl={item.imageUrl}
          title={item.title}
          tags={item.tags}
          price={item.price}
          vendor={item.vendor}
          to={`${itemLinkBase}/${item.id}`}
        />
      ))}
    </div>
  )
}

