import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLang } from '../context/LanguageContext'
import { formatMoney } from '../data/demoData'

export default function Cart() {
  const {cart,updateQuantity,cartTotal} = useApp()
  const {t} = useLang()
  return <div className="container-app py-12">
    <h1 className="text-3xl font-extrabold">{t('cart')}</h1>
    {!cart.length ? <div className="soft-card mt-8 flex flex-col items-center py-16 text-center"><ShoppingBag size={42} className="text-forest-300"/><h2 className="mt-4 text-xl font-extrabold">{t('emptyCart')}</h2><p className="mt-2 text-sm text-slate-500">Добавьте блюда из меню, чтобы оформить заказ.</p><Link to="/menu" className="btn-primary mt-6">Перейти в меню</Link></div> :
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-3">{cart.map(item=><div key={item.id} className="soft-card flex gap-4 p-4"><img src={item.image_url} className="h-24 w-24 rounded-xl object-cover" alt={item.name_ru}/><div className="min-w-0 flex-1"><h3 className="font-extrabold">{item.name_ru}</h3><p className="mt-1 text-sm text-slate-500">{formatMoney(item.price)}</p><div className="mt-3 flex items-center gap-3"><button onClick={()=>updateQuantity(item.id,item.quantity-1)} className="rounded-lg border p-1.5"><Minus size={14}/></button><b>{item.quantity}</b><button onClick={()=>updateQuantity(item.id,item.quantity+1)} className="rounded-lg border p-1.5"><Plus size={14}/></button></div></div><button onClick={()=>updateQuantity(item.id,0)} className="self-start text-slate-400 hover:text-red-500"><Trash2 size={18}/></button></div>)}</div>
        <div className="soft-card h-fit p-6"><h2 className="text-lg font-extrabold">Ваш заказ</h2><div className="mt-5 flex justify-between text-sm text-slate-500"><span>Позиций</span><b>{cart.reduce((s,i)=>s+i.quantity,0)}</b></div><div className="mt-3 flex justify-between border-t pt-4"><b>Итого</b><b className="text-xl text-forest-700">{formatMoney(cartTotal)}</b></div><Link to="/checkout" className="btn-primary mt-6 w-full">{t('checkout')}</Link></div>
      </div>}
  </div>
}
