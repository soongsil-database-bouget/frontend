import React from 'react'
import BackBar from '../components/BackBar'
import BouquetDetail from '../components/BouquetDetail'

export default function OthersDetail() {
  const item = {
    title: '내추럴 그린 부케',
    imageUrl: 'https://images.unsplash.com/photo-1477506350614-fcdc29a3b157?q=80&w=1600&auto=format&fit=crop',
    tags: ['보태니컬'],
    description: '자연스러운 그린 포인트가 돋보이는 내추럴 부케',
    vendor: {
      name: '트로피컬 가든',
      address: '제주도 서귀포시',
      instagram: '@tropical_garden_jeju'
    }
  }
  return (
    <>
      <BackBar />
      <BouquetDetail item={item} mode="others" />
    </>
  )
}

