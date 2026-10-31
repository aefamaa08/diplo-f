import { Link } from 'react-router-dom'
import { ArrowRight, Clock3, UserRound, ShoppingBasket, Timer, TrendingDown, CheckCircle2 } from 'lucide-react'
import { demoProducts, formatMoney } from '../data/demoData'
import FoodCard from '../components/FoodCard'
import { useLang } from '../context/LanguageContext'

export default function Home() {
  const { t, lang } = useLang()
  return <div>
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 text-white">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-green-400/10 blur-3xl"/>
      <div className="container-app grid items-center gap-10 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
        <div className="relative z-10">
          <span className="badge border border-white/20 bg-white/10 text-green-100">{t('heroTag')}</span>
          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">{t('heroTitle')}</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-green-100/80">{t('heroText')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/menu" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-extrabold text-forest-900 transition hover:bg-green-50">{t('viewMenu')} <ArrowRight size={18}/></Link>
            <a href="#how" className="rounded-xl border border-white/25 px-6 py-3.5 font-bold text-white hover:bg-white/10">{t('howItWorks')}</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-green-100/80">
            <span className="flex items-center gap-2"><CheckCircle2 size={17}/> Предзаказ за минуту</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17}/> Получение по имени</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-[36px] bg-green-300/10 blur-2xl"/>
          <div className="relative overflow-hidden rounded-[30px] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur">
            <img className="h-[330px] w-full rounded-[22px] object-cover md:h-[420px]" src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1200" alt="Вкусный обед"/>
            <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between rounded-2xl bg-white p-4 text-slate-900 shadow-xl">
              <div><p className="text-xs font-bold text-slate-400">ЗАКАЗ #1024</p><b className="mt-1 block">Ваш обед почти готов</b><span className="text-xs text-green-700">Можно забрать в 12:30</span></div>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-50 text-forest-700"><UserRound size={25}/></span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="container-app py-14">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          [Clock3, 'Экономия времени', 'Выбирай еду до перемены и не трать время на длинную очередь.'],
          [UserRound, 'Получение по имени', 'Назови своё имя или номер заказа и забери готовый обед.'],
          [TrendingDown, 'Меньше ожидания', 'Работник быстро находит заказ по имени ученика.']
        ].map(([Icon,title,desc])=><div key={title} className="soft-card p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-50 text-forest-700"><Icon size={23}/></span><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p></div>)}
      </div>
    </section>
    <section className="container-app py-10">
      <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-widest text-forest-600">{lang==='uz'?'Tavsiya etamiz':'Рекомендуем'}</p><h2 className="mt-2 text-3xl font-extrabold">{t('popular')}</h2></div><Link to="/menu" className="hidden items-center gap-2 font-extrabold text-forest-700 sm:flex">{t('allMenu')} <ArrowRight size={17}/></Link></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{demoProducts.slice(0,3).map(p=><FoodCard key={p.id} product={p}/>)}</div>
    </section>
    <section id="how" className="container-app py-16">
      <div className="rounded-[28px] bg-forest-50 p-8 md:p-12">
        <div className="max-w-xl"><p className="text-xs font-extrabold uppercase tracking-widest text-forest-600">Всего 3 шага</p><h2 className="mt-2 text-3xl font-extrabold text-forest-950">Обед без лишнего ожидания</h2></div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">{[[ShoppingBasket,'Выбери блюдо','Посмотри меню и добавь любимые блюда в корзину.'],[Timer,'Выбери время','Забронируй удобный интервал получения.'],[UserRound,'Забери заказ','Назови имя или номер заказа и получи готовый обед.']].map(([Icon,title,desc],i)=><div key={title} className="rounded-2xl bg-white p-6"><span className="text-xs font-extrabold text-forest-500">0{i+1}</span><Icon className="my-4 text-forest-700" size={28}/><h3 className="font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p></div>)}</div>
      </div>
    </section>
  </div>
}
