import { useEffect, useState } from 'react'
import { RefreshCw, UserRound } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Status from '../components/Status'
import { formatMoney } from '../data/demoData'

export default function Orders() {
  const {getOrders,isSupabaseConfigured} = useApp()
  const [orders,setOrders] = useState([])
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(true)
  async function refresh() { setLoading(true); setError(''); try { setOrders(await getOrders()) } catch(e) { setError(e.message) } finally { setLoading(false) } }
  useEffect(()=>{refresh()},[])
  return <div className="container-app py-12"><div className="flex items-center justify-between"><div><p className="text-xs font-extrabold uppercase tracking-widest text-forest-600">История</p><h1 className="mt-2 text-3xl font-extrabold">Мои заказы</h1></div><button onClick={refresh} className="btn-secondary"><RefreshCw size={16}/> Обновить</button></div>
    {loading?<p className="py-16 text-center text-slate-400">Загрузка...</p>:error?<p className="mt-8 text-red-600">{error}</p>:!orders.length?<div className="soft-card mt-8 py-16 text-center text-slate-500">У вас пока нет заказов.</div>:
    <div className="mt-7 grid gap-4">{orders.map(o=><article key={o.id} className="soft-card flex flex-col gap-5 p-5 md:flex-row md:items-center"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h3 className="text-lg font-extrabold">Заказ #{o.order_number || o.id.slice(0,6)}</h3><Status status={o.status}/></div><p className="mt-2 text-sm text-slate-500">Получатель: {o.student_name || o.user_name || 'Ученик'} {o.class_name ? `· ${o.class_name}` : ''} · Получение: {o.pickup_slot} · {formatMoney(o.total)}</p><p className="mt-2 text-xs text-slate-400">{(o.order_items||o.items||[]).map(i=>`${i.product_name} × ${i.quantity}`).join(', ')}</p></div><div className="flex items-center gap-3 rounded-xl bg-forest-50 p-4"><UserRound className="text-forest-700"/><div><b className="block text-sm text-forest-900">{o.student_name || o.user_name || 'Ученик'}</b><span className="text-xs text-slate-500">Назовите имя или №{o.order_number}</span></div></div></article>)}</div>}
  </div>
}
