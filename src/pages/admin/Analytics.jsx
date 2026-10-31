import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../../context/AppContext'
import { formatMoney } from '../../data/demoData'
export default function Analytics(){
 const {getOrders}=useApp();const [orders,setOrders]=useState([])
 useEffect(()=>{getOrders().then(setOrders).catch(console.error)},[])
 const slots=['10:20','11:10','12:00','12:50','13:40']
 const data=slots.map(slot=>({slot,orders:orders.filter(o=>o.pickup_slot===slot).length}))
 const total=orders.reduce((s,o)=>s+o.total,0)
 return <div><h1 className="text-3xl font-extrabold">Аналитика</h1><p className="mt-2 text-sm text-slate-500">Показатели на основе доступных заказов.</p><div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="soft-card p-5"><p className="text-sm text-slate-500">Всего заказов</p><b className="mt-2 block text-3xl">{orders.length}</b></div><div className="soft-card p-5"><p className="text-sm text-slate-500">Сумма заказов</p><b className="mt-2 block text-2xl">{formatMoney(total)}</b></div><div className="soft-card p-5"><p className="text-sm text-slate-500">Средний чек</p><b className="mt-2 block text-2xl">{formatMoney(orders.length?Math.round(total/orders.length):0)}</b></div></div><div className="soft-card mt-6 p-6"><h2 className="font-extrabold">Заказы по переменам</h2><div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="slot"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="orders" fill="#168343" radius={[7,7,0,0]}/></BarChart></ResponsiveContainer></div></div><p className="mt-4 text-xs text-slate-400">Данные являются демонстрационными до подключения реальной базы и накопления заказов.</p></div>
}
