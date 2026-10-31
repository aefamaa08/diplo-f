import { createContext, useContext, useState } from 'react'
const dict = {
  ru: { home:'Главная', menu:'Меню', queue:'Очередь', login:'Войти', heroTag:'Умная столовая твоего лицея', heroTitle:'Твоя перемена — твоё время.', heroText:'Заказывай любимые блюда заранее, забирай без долгого ожидания и успевай на всё.', viewMenu:'Посмотреть меню', howItWorks:'Как это работает', popular:'Популярное сегодня', allMenu:'Все меню', add:'В корзину', available:'В наличии', soldOut:'Нет в наличии', cart:'Корзина', emptyCart:'Пока пусто', checkout:'Оформить заказ', price:'Стоимость', pickup:'Время получения', placeOrder:'Подтвердить заказ', myOrders:'Мои заказы', noOrders:'У вас пока нет заказов', signUp:'Создать аккаунт', email:'Электронная почта', password:'Пароль', fullName:'Ваше имя', className:'Класс / группа', haveAccount:'Уже есть аккаунт?', noAccount:'Нет аккаунта?', register:'Зарегистрироваться', signIn:'Войти в аккаунт' },
  uz: { home:'Bosh sahifa', menu:'Menyu', queue:'Navbat', login:'Kirish', heroTag:'Litsey oshxonasining aqlli tizimi', heroTitle:'Tanaffusingiz — o‘z vaqtingiz.', heroText:'Sevimli taomlaringizni oldindan buyurtma qiling, navbatsiz oling va darsga ulguring.', viewMenu:'Menyuni ko‘rish', howItWorks:'Qanday ishlaydi', popular:'Bugungi mashhur taomlar', allMenu:'Barcha menyu', add:'Savatga', available:'Mavjud', soldOut:'Mavjud emas', cart:'Savat', emptyCart:'Hozircha bo‘sh', checkout:'Buyurtma berish', price:'Narxi', pickup:'Olish vaqti', placeOrder:'Buyurtmani tasdiqlash', myOrders:'Buyurtmalarim', noOrders:'Hozircha buyurtmalar yo‘q', signUp:'Hisob yaratish', email:'Elektron pochta', password:'Parol', fullName:'Ismingiz', className:'Sinf / guruh', haveAccount:'Hisobingiz bormi?', noAccount:'Hisobingiz yo‘qmi?', register:'Ro‘yxatdan o‘tish', signIn:'Hisobga kirish' }
}
const Ctx = createContext(null)
export function LanguageProvider({children}) {
  const [lang,setLang] = useState(localStorage.getItem('sc_lang') || 'ru')
  function changeLang(next) { setLang(next); localStorage.setItem('sc_lang', next) }
  const t = key => dict[lang]?.[key] || dict.ru[key] || key
  return <Ctx.Provider value={{lang,setLang:changeLang,t}}>{children}</Ctx.Provider>
}
export const useLang = () => useContext(Ctx)
