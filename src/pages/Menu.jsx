import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import FoodCard from '../components/FoodCard'
import { demoCategories, demoProducts } from '../data/demoData'
import { useLang } from '../context/LanguageContext'
import { useApp } from '../context/AppContext'

export default function Menu() {
  const [category,setCategory] = useState('Все блюда')
  const [search,setSearch] = useState('')
  const {lang,t} = useLang()
  const {products} = useApp()
  const list = products.length ? products : demoProducts
  const filtered = useMemo(()=>list.filter(p=>(category==='Все блюда'||p.category===category) && `${p.name_ru} ${p.name_uz}`.toLowerCase().includes(search.toLowerCase())),[list,category,search])
  return <div className="container-app py-12">
    <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-widest text-forest-600">Smart menu</p><h1 className="mt-2 text-4xl font-extrabold">{t('allMenu')}</h1><p className="mt-3 text-slate-500">Выбирай любимые блюда заранее — мы подготовим их к выбранной перемене.</p></div>
    <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">{demoCategories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`rounded-full px-4 py-2.5 text-sm font-extrabold ${category===c?'bg-forest-700 text-white':'border border-green-100 bg-white text-slate-600 hover:bg-forest-50'}`}>{c}</button>)}</div>
      <div className="relative w-full lg:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input className="input pl-10" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Найти блюдо..."/></div>
    </div>
    <p className="mb-5 mt-8 text-sm font-bold text-slate-400">{filtered.length} блюд</p>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(p=><FoodCard key={p.id} product={p}/>)}</div>
    {!filtered.length && <div className="soft-card py-16 text-center text-slate-500">Ничего не найдено. Попробуйте изменить поиск.</div>}
  </div>
}
