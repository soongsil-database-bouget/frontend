// Tailwind styles are applied via global index.css
import React from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AppRouter from './routes/AppRouter'

function Layout() {
  const location = useLocation()
  const hideHeader =
    /^\/(my|applied|others)\/\d+/.test(location.pathname) ||
    /^\/bouquets\/\d+$/.test(location.pathname) ||
    location.pathname === '/bouquets' ||
    location.pathname === '/mypage' ||
    location.pathname === '/login' ||
    location.pathname.startsWith('/auth/') ||
    location.pathname === '/recent/list' ||
    location.pathname === '/my/list' ||
    location.pathname === '/applied/list' ||
    location.pathname === '/others/list' ||
    location.pathname === '/recommendations' ||
    location.pathname === '/recommend' ||
    location.pathname === '/result' ||
    location.pathname === '/apply' ||
    location.pathname === '/apply/result'
  return (
    <div className="min-h-full flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        {!hideHeader && <Header />}
        <AppRouter />
        <Footer />
      </div>
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
