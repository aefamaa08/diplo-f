import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Clock3, UserRound } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { demoSlots, formatMoney } from '../data/demoData'

export default function Checkout() {
  const {cart,cartTotal,placeOrder,user,profile} = useApp()
  const [slot,setSlot] = useState(demoSlots[2])
  const [studentName,setStudentName] = useState(profile?.full_name || user?.full_name || '')
  const [className,setClassName] = useState(profile?.class_name || user?.class_name || '')
  const [error,setError] = useState('')
  const [done,setDone] = useState(null)
  async function submit() {
    setError('')
    try { const order = await placeOrder(slot,studentName.trim(),className.trim()); setDone(order) }
    catch(e) { setError(e.message) }
  }
  if (!cart.length && !done) return <div className="container-app py-20 text-center"><h2 className="text-2xl font-extrabold">Корзина пуста</h2><Link className="btn-primary mt-5" to="/menu">В меню</Link></div>
  if (done) return <div className="container-app max-w-xl py-20 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest-50 text-forest-700"><CheckCircle2 size={34}/></span><h1 className="mt-5 text-3xl font-extrabold">Заказ оформлен!</h1><p className="mt-2 text-slate-500">Заказ №{done.order_number}. Назови работнику столовой имя: <b>{done.student_name || studentName}</b>.</p><div className="soft-card mt-5 p-5"><p className="text-sm text-slate-500">Запомни также номер заказа</p><b className="text-3xl text-forest-800">#{done.order_number}</b></div><Link to="/orders" className="btn-primary mt-7">Посмотреть заказ</Link></div>
  return <div className="container-app max-w-3xl py-12">
    <h1 className="text-3xl font-extrabold">Оформление заказа</h1>
    {!user && <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Для оформления заказа необходимо <Link className="font-extrabold underline" to="/login">войти в аккаунт</Link>.</div>}
    <div className="soft-card mt-7 p-6"><h2 className="flex items-center gap-2 font-extrabold"><UserRound size={18}/> Кто забирает заказ?</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold">Имя и фамилия<input className="input" required value={studentName} onChange={e=>setStudentName(e.target.value)} placeholder="Например, Бехруз Азатов"/></label><label className="grid gap-2 text-sm font-bold">Класс / группа<input className="input" value={className} onChange={e=>setClassName(e.target.value)} placeholder="Например, 10-А"/></label></div><p className="mt-3 text-xs text-slate-500">Работник столовой найдёт заказ по имени и номеру заказа.</p></div>
    <div className="soft-card mt-5 p-6"><h2 className="font-extrabold">Выберите время получения</h2><p className="mt-1 text-sm text-slate-500">Выберите интервал, в который вам удобно забрать заказ.</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{demoSlots.map(s=><button key={s} onClick={()=>setSlot(s)} className={`rounded-xl border p-4 text-left ${slot===s?'border-forest-600 bg-forest-50 text-forest-800':'border-slate-200'}`}><Clock3 size={18}/><b className="mt-2 block text-lg">{s}</b><span className="text-xs text-slate-500">Перемена</span></button>)}</div></div>
    <div className="soft-card mt-5 p-6"><div className="flex justify-between"><span className="text-slate-500">Итого к оплате</span><b className="text-xl text-forest-700">{formatMoney(cartTotal)}</b></div><p className="mt-2 text-xs text-slate-400">Оплата производится в столовой при получении заказа.</p>{error&&<p className="mt-4 text-sm text-red-600">{error}</p>}<button disabled={!user || !studentName.trim()} onClick={submit} className="btn-primary mt-6 w-full disabled:opacity-40">Подтвердить заказ</button></div>
  </div>
}
