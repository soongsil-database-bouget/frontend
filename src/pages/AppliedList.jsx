import React from 'react'
import BackBar from '../components/BackBar'
import BouquetList from '../components/BouquetList'

const mockItems = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  imageUrl: `https://picsum.photos/seed/applied${i}/600/400`,
  title: `적용해본 부케 ${i + 1}`,
  tags: i % 2 ? ['보태니컬'] : ['모던']
}))

export default function AppliedList() {
  return (
    <>
      <BackBar title="적용해본 부케" />
      <div className="max-w-screen-2xl mx-auto px-6 py-10">
        <BouquetList items={mockItems} />
      </div>
    </>
  )
}

