
import { Navigate, Route, Routes } from 'react-router-dom'

import { Layout, AdminLayout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import Providers from './components/Providers'

import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import Orders from './pages/Orders'
import Queue from './pages/Queue'
import Profile from './pages/Profile'

import Dashboard from './pages/admin/Dashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminMenu from './pages/admin/AdminMenu'
import AdminQueue from './pages/admin/AdminQueue'
import Analytics from './pages/admin/Analytics'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/login" element={<Auth />} />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Личный кабинет ученика */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Панель администратора */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin', 'staff']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="queue" element={<AdminQueue />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Неизвестные страницы */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  )
}
