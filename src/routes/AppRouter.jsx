import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from '../pages/Main'
import MyList from '../pages/MyList'
import MyDetail from '../pages/MyDetail'
import AppliedList from '../pages/AppliedList'
import AppliedDetail from '../pages/AppliedDetail'
import OthersList from '../pages/OthersList'
import OthersDetail from '../pages/OthersDetail'
import Apply from '../pages/Apply'
import Recommend from '../pages/Recommend'
import Result from '../pages/Result'
import MyPage from '../pages/MyPage'
import RecentList from '../pages/RecentList'
import Login from '../pages/Login'
import KakaoCallback from '../pages/KakaoCallback'
import Onboarding from '../pages/Onboarding'
import ApplyResult from '../pages/ApplyResult'
import ProtectedRoute from './ProtectedRoute'

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/apply/result" element={<ApplyResult />} />
      <Route path="/my/list" element={<MyList />} />
      <Route path="/my/:id" element={<MyDetail />} />
      <Route path="/applied/list" element={<AppliedList />} />
      <Route path="/applied/:id" element={<AppliedDetail />} />
      <Route path="/others/list" element={<OthersList />} />
      <Route path="/others/:id" element={<OthersDetail />} />
      <Route path="/recent/list" element={<RecentList />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="/recommend" element={<Recommend />} />
      <Route path="/result" element={<Result />} />
      <Route
        path="/mypage"
        element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

