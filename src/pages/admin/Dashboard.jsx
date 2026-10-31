import { useEffect, useState } from 'react'
import { ShoppingBag, Clock3, CheckCircle2, Wallet, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatMoney } from '../../data/demoData'
import Status from '../../components/Status'

export default function Dashboard() {
  const {getOrders} = useApp()
  const [orders,setOrders] = useState([])
  useEffect(()=>{getOrders().then(setOrders).catch(console.error)},[])
  const active=orders.filter(o=>!['collected','cancelled'].includes(o.status))
  const revenue=orders.filter(o=>o.status==='collected').reduce((s,o)=>s+o.total,0)
  const stats=[[ShoppingBag,'Всего заказов',orders.length],[Clock3,'Ожидают выдачи',active.length],[CheckCircle2,'Выдано',orders.filter(o=>o.status==='collected').length],[Wallet,'Выручка',formatMoney(revenue)]]
  return <div><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-widest text-forest-600">Smart Canteen admin</p><h1 className="mt-2 text-3xl font-extrabold">Обзор столовой</h1><p className="mt-2 text-sm text-slate-500">Сводка заказов и активности.</p></div><Link to="/admin/orders" className="btn-primary">Открыть заказы <ArrowUpRight size={16}/></Link></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([Icon,label,value])=><div key={label} className="soft-card p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-forest-50 text-forest-700"><Icon size={21}/></span><p className="mt-4 text-sm text-slate-500">{label}</p><b className="mt-1 block text-2xl font-extrabold">{value}</b></div>)}</div>
    <div className="soft-card mt-6 p-6"><div className="flex justify-between"><h2 className="font-extrabold">Последние заказы</h2><Link to="/admin/orders" className="text-sm font-bold text-forest-700">Все заказы</Link></div>{orders.slice(0,5).length? <div className="mt-4 divide-y">{orders.slice(0,5).map(o=><div key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><b>#{o.order_number || o.id.slice(0,6)}</b><p className="mt-1 text-xs text-slate-400">{o.user_name || 'Ученик'} · {o.pickup_slot}</p></div><div className="flex items-center gap-3"><b>{formatMoney(o.total)}</b><Status status={o.status}/></div></div>)}</div>:<p className="py-10 text-center text-sm text-slate-400">Пока нет заказов. Создайте тестовый заказ на пользовательской странице.</p>}</div>
  </div>
}
