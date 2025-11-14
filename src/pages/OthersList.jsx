import React from 'react'
import BackBar from '../components/BackBar'
import BouquetList from '../components/BouquetList'

const mockItems = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  imageUrl: `https://picsum.photos/seed/others${i}/600/400`,
  title: `다른 사람 부케 ${i + 1}`,
  tags: i % 3 === 0 ? ['유니크'] : ['클래식']
}))

export default function OthersList() {
  return (
    <>
      <BackBar title="다른 사람이 추천 받은 부케" />
      <div className="max-w-screen-2xl mx-auto px-6 py-10">
        <BouquetList items={mockItems} />
      </div>
    </>
  )
}

