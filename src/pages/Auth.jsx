import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLang } from '../context/LanguageContext'

export default function Auth() {
  const [params] = useSearchParams()
  const [mode,setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'login')
  const [form,setForm] = useState({fullName:'',className:'',email:'',password:''})
  const [error,setError] = useState('')
  const [message,setMessage] = useState('')
  const [busy,setBusy] = useState(false)
  const {signIn,signUp} = useApp()
  const {t} = useLang()
  const navigate = useNavigate()
  function change(e) { setForm({...form,[e.target.name]:e.target.value}) }
  async function submit(e) {
    e.preventDefault(); setError(''); setMessage(''); setBusy(true)
    try {
      if(mode==='login') { await signIn(form.email,form.password); navigate('/') }
      else {
        const result = await signUp(form)
        if(result?.confirmation) setMessage('Аккаунт создан. Проверьте почту и подтвердите email, затем войдите.')
        else navigate('/')
      }
    } catch(err) { setError(err.message || 'Не удалось выполнить действие') }
    finally { setBusy(false) }
  }
  return <div className="container-app grid min-h-[70vh] items-center gap-10 py-12 md:grid-cols-2">
    <div className="hidden rounded-[28px] bg-forest-900 p-10 text-white md:block"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10"><UtensilsCrossed size={28}/></span><h1 className="mt-8 text-4xl font-extrabold leading-tight">Меньше очередей.<br/>Больше времени.</h1><p className="mt-5 max-w-sm leading-7 text-green-100/75">Создай аккаунт Smart Canteen, чтобы заказывать обед заранее и получать его по имени и номеру заказа.</p><div className="mt-12 overflow-hidden rounded-2xl"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=900" className="h-56 w-full object-cover" alt="Еда"/></div></div>
    <div className="mx-auto w-full max-w-md"><p className="text-xs font-extrabold uppercase tracking-widest text-forest-600">Smart Canteen account</p><h2 className="mt-2 text-3xl font-extrabold">{mode==='login'?t('signIn'):t('signUp')}</h2><p className="mt-2 text-sm text-slate-500">{mode==='login'?'Войдите, чтобы продолжить.':'Заполните данные для создания аккаунта.'}</p>
      <form onSubmit={submit} className="mt-7 grid gap-4">
        {mode==='signup'&&<><label className="grid gap-2 text-sm font-bold">{t('fullName')}<input required name="fullName" value={form.fullName} onChange={change} className="input" placeholder="Например, Али"/></label><label className="grid gap-2 text-sm font-bold">{t('className')}<input name="className" value={form.className} onChange={change} className="input" placeholder="Например, 10-А"/></label></>}
        <label className="grid gap-2 text-sm font-bold">{t('email')}<input required type="email" name="email" value={form.email} onChange={change} className="input" placeholder="name@example.com"/></label>
        <label className="grid gap-2 text-sm font-bold">{t('password')}<input required minLength={6} type="password" name="password" value={form.password} onChange={change} className="input" placeholder="Минимум 6 символов"/></label>
        {error&&<p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message&&<p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}
        <button disabled={busy} className="btn-primary mt-2 w-full disabled:opacity-50">{busy?'Подождите...':mode==='login'?t('login'):t('register')}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">{mode==='login'?t('noAccount'):t('haveAccount')} <button onClick={()=>{setMode(mode==='login'?'signup':'login');setError('');setMessage('')}} className="font-extrabold text-forest-700">{mode==='login'?t('register'):t('login')}</button></p>
    </div>
  </div>
}
