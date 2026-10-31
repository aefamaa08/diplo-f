
import { useEffect, useState } from 'react'
import {
  UserRound,
  Mail,
  GraduationCap,
  ShoppingBag,
  Clock,
  RefreshCw,
  LogOut,
  CheckCircle2,
  ChefHat
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const formatMoney = value =>
  `${Number(value || 0).toLocaleString('ru-RU')} сум`

const statusInfo = {
  pending: {
    label: 'Ожидает подтверждения',
    color: 'bg-amber-100 text-amber-800'
  },
  accepted: {
    label: 'Принят',
    color: 'bg-blue-100 text-blue-800'
  },
  preparing: {
    label: 'Готовится',
    color: 'bg-violet-100 text-violet-800'
  },
  ready: {
    label: 'Готов к выдаче',
    color: 'bg-green-100 text-green-800'
  },
  collected: {
    label: 'Получен',
    color: 'bg-slate-100 text-slate-700'
  },
  cancelled: {
    label: 'Отменён',
    color: 'bg-red-100 text-red-800'
  }
}

const progressSteps = [
  { value: 'pending', label: 'Принят' },
  { value: 'accepted', label: 'Подтверждён' },
  { value: 'preparing', label: 'Готовится' },
  { value: 'ready', label: 'Готов' },
  { value: 'collected', label: 'Получен' }
]

const progressIndex = {
  pending: 0,
  accepted: 1,
  preparing: 2,
  ready: 3,
  collected: 4
}

function formatDate(value) {
  if (!value) return 'Дата не указана'

  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function Profile() {
  const { user, profile, getOrders, signOut } = useApp()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState('')

  async function loadOrders() {
    setLoadingOrders(true)
    setError('')

    try {
      const data = await getOrders()
      setOrders(data || [])
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err)
      setError('Не удалось загрузить заказы. Попробуйте обновить список.')
    } finally {
      setLoadingOrders(false)
    }
  }

  // Первоначальная загрузка заказов
  useEffect(() => {
    loadOrders()
  }, [])

  // Автоматическое обновление при изменении статуса заказа
  useEffect(() => {
    if (!isSupabaseConfigured || !user?.id) return

    const channel = supabase
      .channel(`student-orders-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadOrders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  const name = profile?.full_name || user?.email || 'Ученик'
  const email = user?.email || profile?.email || 'Не указан'
  const className = profile?.class_name || 'Не указан'
  const role = profile?.role || 'student'

  // Последний заказ, который ещё не получен и не отменён
  const currentOrder = [...orders]
    .filter(order =>
      ['pending', 'accepted', 'preparing', 'ready'].includes(order.status)
    )
    .sort(
      (a, b) =>
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
    )[0]

  const currentStatus = currentOrder
    ? statusInfo[currentOrder.status]
    : null

  const currentStep = currentOrder
    ? progressIndex[currentOrder.status] ?? 0
    : 0

  return (
    <div className="container-app py-8">
      <div className="mb-8">
        <p className="text-sm font-bold text-forest-600">
          SMART CANTEEN
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-forest-900">
          Личный кабинет
        </h1>

        <p className="mt-2 text-slate-500">
          Управляйте своим профилем и следите за заказами.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Данные ученика */}
        <aside className="soft-card h-fit p-6">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-forest-100 text-forest-700">
            <UserRound size={32} />
          </div>

          <h2 className="text-xl font-extrabold text-forest-900">
            {name}
          </h2>

          <span className="mt-2 inline-block rounded-full bg-forest-50 px-3 py-1 text-xs font-bold text-forest-700">
            {role === 'admin'
              ? 'Администратор'
              : role === 'staff'
                ? 'Сотрудник'
                : 'Ученик'}
          </span>

          <div className="mt-6 grid gap-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 text-forest-600" size={18} />

              <div>
                <p className="text-xs text-slate-400">
                  Электронная почта
                </p>
                <p className="break-all text-sm font-semibold text-slate-700">
                  {email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="mt-1 text-forest-600" size={18} />

              <div>
                <p className="text-xs text-slate-400">Класс</p>
                <p className="text-sm font-semibold text-slate-700">
                  {className}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-secondary mt-7 flex w-full items-center justify-center gap-2"
          >
            <LogOut size={17} />
            Выйти из аккаунта
          </button>
        </aside>

        {/* Заказы */}
        <section className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-forest-900">
                Мои заказы
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Следите за приготовлением ваших заказов.
              </p>
            </div>

            <button
              onClick={loadOrders}
              disabled={loadingOrders}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw
                size={16}
                className={loadingOrders ? 'animate-spin' : ''}
              />
              Обновить
            </button>
          </div>

          {loadingOrders ? (
            <div className="soft-card p-8 text-center text-slate-500">
              Загружаем заказы...
            </div>
          ) : error ? (
            <div className="soft-card p-8 text-center">
              <p className="mb-4 text-red-600">{error}</p>

              <button onClick={loadOrders} className="btn-primary">
                Попробовать снова
              </button>
            </div>
          ) : (
            <>
              {/* Текущий заказ */}
              {currentOrder && (
                <div className="soft-card mb-6 overflow-hidden p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-forest-700">
                        <ChefHat size={20} />
                        <span className="text-sm font-bold">
                          ТЕКУЩИЙ ЗАКАЗ
                        </span>
                      </div>

                      <h3 className="mt-2 text-xl font-extrabold text-forest-900">
                        Заказ #{currentOrder.order_number || String(currentOrder.id).slice(0, 8)}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(currentOrder.created_at)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${currentStatus?.color || ''}`}
                    >
                      {currentStatus?.label}
                    </span>
                  </div>

                  {/* Этапы заказа */}
                  <div className="mt-7">
                    <div className="flex items-start">
                      {progressSteps.map((step, index) => {
                        const completed = index <= currentStep
                        const active = index === currentStep

                        return (
                          <div
                            key={step.value}
                            className="relative flex flex-1 flex-col items-center"
                          >
                            {index > 0 && (
                              <div
                                className={`absolute right-1/2 top-3 h-1 w-full ${
                                  index <= currentStep
                                    ? 'bg-green-500'
                                    : 'bg-slate-200'
                                }`}
                              />
                            )}

                            <div
                              className={`relative z-10 grid h-7 w-7 place-items-center rounded-full ${
                                completed
                                  ? 'bg-green-500 text-white'
                                  : 'bg-slate-200 text-slate-400'
                              }`}
                            >
                              {completed ? (
                                <CheckCircle2 size={17} />
                              ) : (
                                <span className="text-xs font-bold">
                                  {index + 1}
                                </span>
                              )}
                            </div>

                            <span
                              className={`mt-2 text-center text-[10px] sm:text-xs ${
                                active
                                  ? 'font-extrabold text-green-700'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-forest-50 p-4">
                    <p className="text-sm font-bold text-forest-900">
                      {currentOrder.status === 'pending' &&
                        'Ваш заказ отправлен и ожидает подтверждения сотрудником.'}

                      {currentOrder.status === 'accepted' &&
                        'Ваш заказ принят. Скоро начнётся приготовление.'}

                      {currentOrder.status === 'preparing' &&
                        'Ваш заказ готовится. Пожалуйста, ожидайте.'}

                      {currentOrder.status === 'ready' &&
                        'Ваш заказ готов! Можно подходить за получением.'}
                    </p>

                    {currentOrder.pickup_slot && (
                      <p className="mt-2 text-sm text-forest-700">
                        Время получения: <b>{currentOrder.pickup_slot}</b>
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
                    <span className="font-bold text-slate-600">
                      Сумма заказа
                    </span>

                    <span className="text-lg font-extrabold text-forest-800">
                      {formatMoney(currentOrder.total)}
                    </span>
                  </div>
                </div>
              )}

              {!currentOrder && orders.length > 0 && (
                <div className="soft-card mb-6 p-5 text-center">
                  <CheckCircle2
                    className="mx-auto mb-2 text-green-600"
                    size={32}
                  />

                  <h3 className="font-bold text-forest-900">
                    Нет активных заказов
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Все ваши заказы завершены или отменены.
                  </p>
                </div>
              )}

              {/* История заказов */}
              <h2 className="mb-4 text-xl font-extrabold text-forest-900">
                История заказов
              </h2>

              {orders.length === 0 ? (
                <div className="soft-card p-10 text-center">
                  <ShoppingBag
                    className="mx-auto mb-4 text-slate-300"
                    size={42}
                  />

                  <h3 className="text-lg font-bold text-forest-900">
                    У вас пока нет заказов
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Выберите блюда в меню и оформите первый заказ.
                  </p>

                  <button
                    onClick={() => navigate('/menu')}
                    className="btn-primary mt-5"
                  >
                    Перейти в меню
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {orders.map(order => {
                    const status = statusInfo[order.status] || {
                      label: order.status || 'Неизвестен',
                      color: 'bg-slate-100 text-slate-700'
                    }

                    const items = order.order_items || order.items || []

                    return (
                      <article key={order.id} className="soft-card p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-slate-400">
                              Номер заказа
                            </p>

                            <h3 className="mt-1 font-extrabold text-forest-900">
                              #{order.order_number || String(order.id).slice(0, 8)}
                            </h3>

                            <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                              <Clock size={13} />
                              {formatDate(order.created_at)}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <div className="my-4 border-t border-slate-100" />

                        <div className="grid gap-2">
                          {items.map((item, index) => (
                            <div
                              key={item.id || index}
                              className="flex justify-between gap-3 text-sm"
                            >
                              <span className="text-slate-600">
                                {item.product_name || item.name_ru || 'Блюдо'} × {item.quantity}
                              </span>

                              <span className="whitespace-nowrap font-semibold text-slate-700">
                                {formatMoney(
                                  Number(item.unit_price || item.price || 0) *
                                  Number(item.quantity || 1)
                                )}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.pickup_slot && (
                          <p className="mt-4 text-sm text-slate-500">
                            Время получения: <b>{order.pickup_slot}</b>
                          </p>
                        )}

                        <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
                          <span className="font-bold text-slate-600">
                            Итого
                          </span>

                          <span className="text-lg font-extrabold text-forest-800">
                            {formatMoney(order.total)}
                          </span>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
