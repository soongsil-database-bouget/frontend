// Tailwind styles are applied via global index.css
import React from 'react'
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AppRouter from './routes/AppRouter'

function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const hideHeader =
    /^\/(my|applied|others)\/\d+/.test(location.pathname) ||
    location.pathname === '/mypage' ||
    location.pathname === '/login' ||
    location.pathname.startsWith('/auth/') ||
    location.pathname === '/recent/list' ||
    location.pathname === '/my/list' ||
    location.pathname === '/applied/list' ||
    location.pathname === '/others/list' ||
    location.pathname === '/recommendations'
  const clearToken = () => {
    try {
      localStorage.removeItem('accessToken')
    } finally {
      navigate('/login', { replace: true })
    }
  }
  return (
    <div className="min-h-full flex flex-col">
      {!hideHeader && <Header />}
      <AppRouter />
      <button
        type="button"
        onClick={clearToken}
        className="fixed right-4 bottom-5 z-50 px-7 py-3 rounded-xl text-sm font-bold bg-red-600 text-white shadow-lg ring-2 ring-red-300/60 hover:bg-red-700 hover:shadow-xl transition-all"
        title="테스트용: 토큰 삭제"
      >
        카카오 토큰 삭제
        <br></br>
        개발용
      </button>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
