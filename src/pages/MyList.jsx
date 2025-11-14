import React from 'react'
import BackBar from '../components/BackBar'
import BouquetList from '../components/BouquetList'

const mockItems = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  imageUrl: `https://picsum.photos/seed/my${i}/600/400`,
  title: `내 추천 부케 ${i + 1}`,
  tags: i % 2 ? ['로맨틱'] : ['내추럴']
}))

export default function MyList() {
  return (
    <>
      <BackBar title="내가 추천받은 부케" />
      <div className="max-w-screen-2xl mx-auto px-6 py-10">
        <BouquetList items={mockItems} />
      </div>
    </>
  )
}

