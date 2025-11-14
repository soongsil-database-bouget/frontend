import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BouquetList from '../components/BouquetList'
import Button from '../components/Button'

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M20 2H4C2.897 2 2 2.897 2 4v14c0 1.103.897 2 2 2h3v3.586L12.586 20H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z"/>
    </svg>
  )
}

const mockItems = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop', title: '핑크 로즈 부케', tags: ['로맨틱', '핑크'] },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1470093851219-69951fcbb533?q=80&w=1200&auto=format&fit=crop', title: '화이트 튤립 부케', tags: ['미니멀', '화이트'] },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1477506350614-fcdc29a3b157?q=80&w=1200&auto=format&fit=crop', title: '내추럴 그린 부케', tags: ['보태니컬'] }
]

const mockMyReceived = [
  { id: 101, imageUrl: 'https://images.unsplash.com/photo-1622658641558-235f26dd270b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', title: '추천 부케 1', tags: ['로맨틱'] },
  { id: 102, imageUrl: 'https://picsum.photos/seed/myr2/600/400', title: '추천 부케 2', tags: ['내추럴'] },
  { id: 103, imageUrl: 'https://picsum.photos/seed/myr3/600/400', title: '추천 부케 3', tags: ['모던'] }
]

const mockApplied = [
  {
    id: 11,
    imageUrl: 'https://picsum.photos/seed/applied1/900/675', // 합성된 결과
    bouquetImageUrl: 'https://images.unsplash.com/photo-1470093851219-69951fcbb533?q=80&w=1200&auto=format&fit=crop', // 사용한 부케
    title: '적용부케 1',
    tags: ['모던']
  },
  {
    id: 12,
    imageUrl: 'https://picsum.photos/seed/applied2/900/675',
    bouquetImageUrl: 'https://images.unsplash.com/photo-1477506350614-fcdc29a3b157?q=80&w=1200&auto=format&fit=crop',
    title: '적용부케 2',
    tags: ['내추럴']
  },
  {
    id: 13,
    imageUrl: 'https://picsum.photos/seed/applied3/900/675',
    bouquetImageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
    title: '적용부케 3',
    tags: ['클래식']
  }
]

export default function Main() {
  const navigate = useNavigate()
  return (
    <div className="min-h-full">
      <section className="relative min-h-[520px] grid items-center isolate">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1800&auto=format&fit=crop"
          alt=""
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative text-white text-center max-w-screen-xl mx-auto px-4">
          <h1 className="m-0 text-3xl md:text-4xl font-black leading-snug">
            어떤 부케가 잘 어울릴지
            <br />
            고민이신가요?
          </h1>
          <p className="mt-2 text-gray-100 font-medium">
            눌러서 부케 추천받기
            <br />
            아무데서 클릭!
          </p>
        </div>
        <button
          className="absolute inset-0 bg-transparent border-0 cursor-pointer"
          aria-label="부케 추천 받기"
          onClick={() => navigate('/recommend')}
        ></button>
      </section>

      <section className="py-9">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="m-0 text-lg font-bold">내가 추천받은 부케</h2>
            <Link to="/my/list" className="text-sm text-pink-600 font-semibold hover:underline">전체 보기</Link>
          </div>
          <BouquetList items={mockMyReceived} itemLinkBase="/my" />
        </div>
      </section>

      <section className="py-9 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="m-0 text-lg font-bold">적용해본 부케</h2>
            <Link to="/applied/list" className="text-sm text-pink-500 font-semibold hover:underline">전체 보기</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockApplied.map(item => (
              <Link key={item.id} to={`/applied/${item.id}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" src={item.imageUrl} alt={item.title} />
                  {item.bouquetImageUrl && (
                    <div className="absolute top-2 right-2">
                      <div className="w-16 h-16 rounded-lg overflow-hidden ring-2 ring-white shadow-md border border-gray-200 bg-white">
                        <img className="w-full h-full object-cover" src={item.bouquetImageUrl} alt={`${item.title} 사용 부케`} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-bold text-gray-900">{item.title}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.tags.map((t, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-pink-50 text-pink-600 border border-pink-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="m-0 text-xl font-extrabold">다른 사람이 추천 받은 부케</h2>
            <Link to="/others/list" className="text-sm text-pink-600 font-semibold hover:underline">전체 보기</Link>
          </div>
          <BouquetList items={mockItems} itemLinkBase="/others" />
        </div>
      </section>
    </div>
  )
}

