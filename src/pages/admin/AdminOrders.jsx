
import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  RefreshCw,
  Search,
  UserRound,
  Clock,
  ShoppingBag,
  CheckCircle2,
  ChefHat,
  XCircle,
} from 'lucide-react'

import { useApp } from '../../context/AppContext'
import { formatMoney } from '../../data/demoData'
import Status from '../../components/Status'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

const next = {
  pending: 'accepted',
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'collected',
}

const action = {
  pending: 'Принять',
  accepted: 'Начать готовить',
  preparing: 'Отметить готовым',
  ready: 'Подтвердить выдачу',
}

const filters = [
  { value: 'all', label: 'Все заказы' },
  { value: 'pending', label: 'Новые' },
  { value: 'accepted', label: 'Принятые' },
  { value: 'preparing', label: 'Готовятся' },
  { value: 'ready', label: 'Готовы' },
  { value: 'collected', label: 'Выданы' },
  { value: 'cancelled', label: 'Отменены' },
]

function formatDate(date) {
  if (!date) return 'Дата не указана'

  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminOrders() {
  const { getOrders, updateOrderStatus } = useApp()

  const [orders, setOrders] = useState([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  // Загрузка заказов
  const refresh = useCallback(async () => {
    try {
      setLoading(true)

      const data = await getOrders()

      setOrders(data)
      setError('')
    } catch (e) {
      setError(e.message || 'Не удалось загрузить заказы')
    } finally {
      setLoading(false)
    }
  }, [getOrders])

  // Первоначальная загрузка
  useEffect(() => {
    refresh()
  }, [refresh])

  // Автоматическое обновление заказов через Realtime
  useEffect(() => {
    if (!isSupabaseConfigured) return

    const channel = supabase
      .channel('admin-orders-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          refresh()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items',
        },
        () => {
          refresh()
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          setError('Ошибка подключения к обновлениям заказов')
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [refresh])

  // Изменение статуса
  async function update(id, status) {
    try {
      setUpdatingId(id)
      setError('')

      await updateOrderStatus(id, status)
      await refresh()
    } catch (e) {
      setError(e.message || 'Не удалось изменить статус')
    } finally {
      setUpdatingId(null)
    }
  }

  // Статистика
  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(
      o => o.status === 'accepted' || o.status === 'preparing'
    ).length,
    ready: orders.filter(o => o.status === 'ready').length,
    collected: orders.filter(o => o.status === 'collected').length,
  }), [orders])

  // Поиск и фильтрация
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const searchText = `
        ${o.student_name || o.user_name || ''}
        ${o.class_name || ''}
        ${o.order_number || ''}
        ${o.id || ''}
      `.toLowerCase()

      const matchesSearch = searchText.includes(query.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || o.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, query, statusFilter])

  return (
    <div className="space-y-6">

      {/* Заголовок */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">
            Заказы
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Управление заказами учеников столовой.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="btn-secondary"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Обновить
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">

        <div className="soft-card p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <ShoppingBag size={18} />
            <span className="text-xs">Всего</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold">
            {stats.total}
          </p>
        </div>

        <div className="soft-card p-4">
          <div className="flex items-center gap-2 text-amber-600">
            <Clock size={18} />
            <span className="text-xs">Новые</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold">
            {stats.pending}
          </p>
        </div>

        <div className="soft-card p-4">
          <div className="flex items-center gap-2 text-blue-600">
            <ChefHat size={18} />
            <span className="text-xs">Готовятся</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold">
            {stats.preparing}
          </p>
        </div>

        <div className="soft-card p-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 size={18} />
            <span className="text-xs">Готовы</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold">
            {stats.ready}
          </p>
        </div>

        <div className="soft-card p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <XCircle size={18} />
            <span className="text-xs">Выданы</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold">
            {stats.collected}
          </p>
        </div>

      </div>

      {/* Поиск */}
      <div className="soft-card space-y-4 p-4">

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-10"
            placeholder="Поиск по имени, классу или номеру заказа..."
          />
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                statusFilter === filter.value
                  ? 'bg-forest-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
              {filter.value === 'all'
                ? ` (${stats.total})`
                : ''}
            </button>
          ))}
        </div>

      </div>

      {/* Ошибка */}
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Список заказов */}
      <div className="space-y-3">

        {filtered.map((o) => {
          const items = o.order_items || o.items || []

          return (
            <div
              key={o.id}
              className="soft-card flex flex-col justify-between gap-4 p-5 lg:flex-row lg:items-center"
            >

              {/* Информация */}
              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-3">
                  <b className="text-lg">
                    Заказ #{o.order_number || o.id.slice(0, 6)}
                  </b>

                  <Status status={o.status} />
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-forest-800">
                  <UserRound size={16} />

                  {o.student_name || o.user_name || 'Имя не указано'}

                  {o.class_name ? ` · ${o.class_name}` : ''}
                </p>

                <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={14} />
                  {formatDate(o.created_at)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Время получения: {o.pickup_slot || 'Не указано'}
                </p>

                {/* Состав заказа */}
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-bold text-slate-600">
                    Состав заказа:
                  </p>

                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <p
                        key={item.id || index}
                        className="text-xs text-slate-500"
                      >
                        {item.product_name || 'Блюдо'} × {item.quantity}
                        {' — '}
                        {formatMoney(item.unit_price * item.quantity)}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">
                      Состав заказа не указан.
                    </p>
                  )}
                </div>

              </div>

              {/* Цена и кнопки */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 lg:border-0 lg:pt-0">

                <div>
                  <p className="text-xs text-slate-400">
                    Итого
                  </p>

                  <b className="text-lg">
                    {formatMoney(o.total)}
                  </b>
                </div>

                {next[o.status] && (
                  <button
                    type="button"
                    disabled={updatingId === o.id}
                    onClick={() => update(o.id, next[o.status])}
                    className="btn-primary !py-2.5 text-xs disabled:opacity-50"
                  >
                    {updatingId === o.id
                      ? 'Обновление...'
                      : action[o.status]}
                  </button>
                )}

              </div>

            </div>
          )
        })}

        {/* Пустой список */}
        {!filtered.length && (
          <div className="soft-card py-14 text-center text-slate-400">
            {query || statusFilter !== 'all'
              ? 'Заказы по выбранным условиям не найдены.'
              : 'Заказов пока нет.'}
          </div>
        )}

      </div>

    </div>
  )
}
