import { Clock3, Users, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { demoSlots } from '../data/demoData'
import { useApp } from '../context/AppContext'

export default function Queue() {
  const {getOrders} = useApp()
  const [orders,setOrders] = useState([])
  useEffect(()=>{getOrders().then(setOrders).catch(console.error)},[])
  const counts = demoSlots.map(slot=>({slot,count:orders.filter(o=>o.pickup_slot===slot&&!['collected','cancelled'].includes(o.status)).length}))
  return <div className="container-app py-12"><div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-widest text-forest-600">Live queue</p><h1 className="mt-2 text-4xl font-extrabold">Загруженность столовой</h1><p className="mt-3 text-slate-500">Выбирай менее загруженный интервал, чтобы получить заказ быстрее.</p></div>
    <div className="mt-8 grid gap-4 md:grid-cols-2">{counts.map((item,i)=>{const level=item.count>10?'Высокая':item.count>6?'Средняя':'Низкая';const color=item.count>10?'bg-amber-400':item.count>6?'bg-blue-400':'bg-forest-500';return <div key={item.slot} className="soft-card p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-400">ВРЕМЯ ПОЛУЧЕНИЯ</p><h2 className="mt-1 text-2xl font-extrabold">{item.slot}</h2></div><span className={`badge ${item.count>10?'bg-amber-50 text-amber-700':item.count>6?'bg-blue-50 text-blue-700':'bg-forest-50 text-forest-700'}`}>{level}</span></div><div className="mt-6 flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-slate-500"><Users size={16}/> Ожидают заказ</span><b>{item.count} заказов</b></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{width:`${Math.min(item.count*6,100)}%`}}/></div><p className="mt-4 flex items-center gap-2 text-xs text-slate-400"><Clock3 size={14}/> Ожидание зависит от загрузки кухни</p></div>})}</div>
    <div className="mt-6 flex gap-3 rounded-2xl bg-blue-50 p-5 text-sm text-blue-800"><Info className="shrink-0" size={19}/><p>Показаны активные заказы, загруженные из системы. Фактическое время ожидания зависит от скорости приготовления и текущей работы кухни.</p></div>
  </div>
}
