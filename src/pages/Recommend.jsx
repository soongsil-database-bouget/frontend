import React from 'react'
import Button from '../components/Button'

export default function Recommend() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold">부케 추천받기</h1>
      <p className="mt-2 text-gray-600">스타일과 색상을 선택하고 나에게 맞는 부케를 추천받으세요.</p>
      <form className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">선호 스타일</label>
          <select className="mt-1 w-full h-11 rounded-xl border border-gray-300 px-3">
            <option>로맨틱</option>
            <option>내추럴</option>
            <option>모던</option>
            <option>클래식</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">선호 색상</label>
          <select className="mt-1 w-full h-11 rounded-xl border border-gray-300 px-3">
            <option>핑크</option>
            <option>화이트</option>
            <option>그린</option>
            <option>옐로우</option>
          </select>
        </div>
        <Button className="h-11 px-6">추천받기</Button>
      </form>
    </div>
  )
}

