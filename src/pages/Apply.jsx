import React from 'react'
import Button from '../components/Button'

export default function Apply() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold">나에게 적용해보기</h1>
      <p className="mt-2 text-gray-600">내 사진을 업로드하고 다양한 부케를 적용해보세요.</p>
      <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-500">이미지 드래그 앤 드롭 또는 클릭하여 업로드</p>
        <Button variant="outline" className="mt-4 h-11 px-6">이미지 선택</Button>
      </div>
    </div>
  )
}

