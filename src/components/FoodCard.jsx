import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLang } from '../context/LanguageContext'
import { formatMoney } from '../data/demoData'
export default function FoodCard({ product }) {
  const { addToCart } = useApp()
  const { lang, t } = useLang()
  const [portion, setPortion] = useState('full')
  const [name] = lang === 'uz' ? [product.name_uz] : [product.name_ru]
  const price = portion === 'half' && product.half_price ? product.half_price : product.price
  return <article className="group overflow-hidden rounded-[22px] border border-green-100 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
    <div className="relative h-44 overflow-hidden bg-forest-50">
      <img src={product.image_url} alt={name} className="h-full w-full object-cover" onError={e=>{e.currentTarget.src='https://images.unsplash.com/photo-1547592180-85f173990554?w=900'}}/>
      <span className="absolute left-3 top-3 badge bg-white/90 text-forest-800">{product.category}</span>
    </div>
    <div className="p-5">
      <div className="min-h-[50px]"><h3 className="font-extrabold text-slate-900">{name}</h3><p className="mt-1 text-xs text-slate-500">{product.description_ru}</p></div>
      {product.half_price && <div className="mt-3 flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
        <button onClick={()=>setPortion('half')} className={`flex-1 rounded-lg px-2 py-2 ${portion==='half'?'bg-white text-forest-800 shadow-sm':''}`}>0,5 порции</button>
        <button onClick={()=>setPortion('full')} className={`flex-1 rounded-lg px-2 py-2 ${portion==='full'?'bg-white text-forest-800 shadow-sm':''}`}>1 порция</button>
      </div>}
      <div className="mt-4 flex items-center justify-between gap-2">
        <b className="text-lg text-forest-800">{formatMoney(price)}</b>
        <button disabled={!product.available} onClick={()=>addToCart(product,portion)} className="btn-primary !px-3 !py-2.5 text-xs disabled:opacity-40"><Plus size={15}/>{t('add')}</button>
      </div>
    </div>
  </article>
}
