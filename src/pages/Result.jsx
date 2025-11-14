import React from 'react'
import BouquetList from '../components/BouquetList'

const mockResults = [
  { id: 101, imageUrl: 'https://picsum.photos/seed/r1/600/400', title: '추천 부케 A', tags: ['로맨틱'] },
  { id: 102, imageUrl: 'https://picsum.photos/seed/r2/600/400', title: '추천 부케 B', tags: ['모던'] },
  { id: 103, imageUrl: 'https://picsum.photos/seed/r3/600/400', title: '추천 부케 C', tags: ['내추럴'] }
]

export default function Result() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold mb-6">추천 결과</h1>
      <BouquetList items={mockResults} />
    </div>
  )
}

