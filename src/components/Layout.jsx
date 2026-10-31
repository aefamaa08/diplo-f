
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  UserRound,
  LogOut,
  LayoutDashboard,
  UtensilsCrossed
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useLang } from '../context/LanguageContext'

export function Layout() {
  const { cart, user, profile, signOut } = useApp()
  const { t, lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const links = [
    { to: '/', label: t('home') },
    { to: '/menu', label: t('menu') },
    { to: '/queue', label: t('queue') }
  ]

  async function logout() {
    await signOut()
    setOpen(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-green-100 bg-white/90 backdrop-blur-xl">
        <div className="container-app flex h-[76px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-700 text-white">
              <UtensilsCrossed size={22} />
            </span>
            <span className="leading-tight">
              <b className="block text-lg tracking-tight text-forest-900">
                Smart Canteen
              </b>
              <small className="text-xs text-slate-500">
                Умная столовая
              </small>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-bold transition ${
                    isActive
                      ? 'text-forest-700'
                      : 'text-slate-500 hover:text-forest-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => setLang(lang === 'ru' ? 'uz' : 'ru')}
              className="btn-secondary !px-3 !py-2 text-xs"
            >
              {lang.toUpperCase()} / {lang === 'ru' ? 'UZ' : 'RU'}
            </button>

            <Link
              to="/cart"
              className="relative rounded-xl border border-green-100 p-3 text-forest-800 hover:bg-forest-50"
            >
              <ShoppingBag size={19} />
              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-forest-600 px-1 text-[10px] font-extrabold text-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="btn-secondary !py-2">
                  <UserRound size={16} />
                  Личный кабинет
                </Link>

                {(profile?.role === 'admin' || profile?.role === 'staff') && (
                  <Link to="/admin" className="btn-secondary !py-2">
                    <LayoutDashboard size={16} />
                    Панель
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="btn-secondary !py-2"
                  title="Выйти"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary !py-3">
                <UserRound size={16} />
                {t('login')}
              </Link>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Открыть меню"
          >
            {open ? <X /> : <MenuIcon />}
          </button>
        </div>

        {open && (
          <div className="container-app grid gap-3 border-t border-green-100 py-4 md:hidden">
            {links.map(link => (
              <Link
                onClick={() => setOpen(false)}
                key={link.to}
                to={link.to}
                className="py-2 font-bold"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="font-bold"
            >
              Корзина ({cart.length})
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-2 font-bold text-forest-700"
                >
                  <UserRound size={17} />
                  Личный кабинет
                </Link>

                {(profile?.role === 'admin' || profile?.role === 'staff') && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 py-2 font-bold"
                  >
                    <LayoutDashboard size={17} />
                    Панель управления
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-2 py-2 text-left font-bold"
                >
                  <LogOut size={17} />
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="py-2 font-bold"
              >
                Войти
              </Link>
            )}
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-green-100 bg-white py-9">
        <div className="container-app flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <b className="text-forest-900">Smart Canteen</b>
            <p className="mt-1 text-sm text-slate-500">
              Меньше очередей — больше времени на обед.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Smart Canteen · Учебный проект
          </p>
        </div>
      </footer>
    </div>
  )
}

export function AdminLayout() {
  const links = [
    ['/admin', 'Обзор'],
    ['/admin/orders', 'Заказы'],
    ['/admin/menu', 'Меню'],
    ['/admin/queue', 'Очередь'],
    ['/admin/analytics', 'Аналитика']
  ]

  return (
    <div className="container-app grid gap-6 py-8 lg:grid-cols-[230px_1fr]">
      <aside className="soft-card h-fit p-4">
        <p className="px-3 pb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Управление
        </p>

        <nav className="grid gap-1">
          {links.map(([to, label]) => (
            <NavLink
              end={to === '/admin'}
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-3 text-sm font-bold ${
                  isActive
                    ? 'bg-forest-50 text-forest-800'
                    : 'text-slate-500 hover:bg-slate-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  )
}
