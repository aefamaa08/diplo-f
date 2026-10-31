import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { demoSlots } from '../../data/demoData'
export default function AdminQueue(){
 const {getOrders}=useApp();const [orders,setOrders]=useState([])
 useEffect(()=>{getOrders().then(setOrders).catch(console.error)},[])
 return <div><h1 className="text-3xl font-extrabold">Управление очередью</h1><p className="mt-2 text-sm text-slate-500">Количество активных заказов по временным интервалам.</p><div className="mt-6 grid gap-4 sm:grid-cols-2">{demoSlots.map(slot=>{const n=orders.filter(o=>o.pickup_slot===slot&&!['collected','cancelled'].includes(o.status)).length;return <div key={slot} className="soft-card p-6"><p className="text-sm text-slate-400">Временной интервал</p><b className="mt-1 block text-2xl">{slot}</b><p className="mt-4 text-3xl font-extrabold text-forest-700">{n}</p><p className="text-sm text-slate-500">активных заказов</p></div>})}</div></div>
}
