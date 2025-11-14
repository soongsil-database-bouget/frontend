import React from 'react'
import BackBar from '../components/BackBar'
import BouquetDetail from '../components/BouquetDetail'

export default function MyDetail() {
  const item = {
    title: '핑크 로즈 부케',
    imageUrl: 'https://images.unsplash.com/photo-1477506350614-fcdc29a3b157?q=80&w=1600&auto=format&fit=crop',
    tags: ['로맨틱', '핑크'],
    description: '사랑스러운 핑크톤 로즈로 구성된 로맨틱한 부케',
    vendor: {
      name: '트로피컬 가든',
      address: '제주도 서귀포시',
      instagram: '@tropical_garden_jeju'
    }
  }
  return (
    <>
      <BackBar />
      <BouquetDetail item={item} mode="my" />
    </>
  )
}

