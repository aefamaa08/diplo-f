import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
export function ProtectedRoute({ children, roles }) {
  const { user, profile, loading } = useApp()
  if (loading) return <div className="container-app py-24 text-center text-slate-500">Загрузка...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(profile?.role)) return <Navigate to="/" replace />
  return children
}
