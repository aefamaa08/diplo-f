
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { demoProducts } from '../data/demoData'

const AppContext = createContext(null)

const readStore = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

const writeStore = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value))

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [cart, setCart] = useState(() => readStore('sc_cart', []))
  const [orders, setOrders] = useState(() => readStore('sc_orders', []))
  const [products, setProducts] = useState(() => readStore('sc_products', demoProducts))
  const [loading, setLoading] = useState(true)

  // Сохранение корзины
  useEffect(() => {
    writeStore('sc_cart', cart)
  }, [cart])

  // Сохранение заказов в демо-режиме
  useEffect(() => {
    if (!isSupabaseConfigured) {
      writeStore('sc_orders', orders)
    }
  }, [orders])

  // Сохранение меню в демо-режиме
  useEffect(() => {
    if (!isSupabaseConfigured) {
      writeStore('sc_products', products)
    }
  }, [products])

  // Загрузка профиля
  async function loadProfile(authUser) {
    setUser(authUser)

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    setProfile(
      data || {
        id: authUser.id,
        full_name: authUser.email,
        role: 'student'
      }
    )
  }

  // Первоначальная загрузка приложения и авторизации
  useEffect(() => {
    let active = true
    let subscription

    async function init() {
      try {
        if (!isSupabaseConfigured) {
          const demoUser = readStore('sc_user', null)

          if (active && demoUser) {
            setUser(demoUser)
            setProfile(demoUser)
          }

          return
        }

        const { data: menuData, error: menuError } = await supabase
          .from('products')
          .select('*')
          .order('created_at')

        if (menuError) throw menuError

        if (active) {
          setProducts(menuData || [])
        }

        const {
          data: { session }
        } = await supabase.auth.getSession()

        if (session?.user && active) {
          await loadProfile(session.user)
        }

        const { data } = supabase.auth.onAuthStateChange(
          (_event, nextSession) => {
            if (!active) return

            if (nextSession?.user) {
              loadProfile(nextSession.user)
            } else {
              setUser(null)
              setProfile(null)
            }
          }
        )

        subscription = data.subscription
      } catch (error) {
        console.error('Ошибка загрузки приложения:', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    init()

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [])

  // АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ МЕНЮ ЧЕРЕЗ REALTIME
  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true

    const channel = supabase
      .channel('menu-live-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        async () => {
          if (!active) return

          try {
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .order('created_at')

            if (error) throw error

            if (active) {
              setProducts(data || [])
            }
          } catch (error) {
            console.error('Ошибка автоматического обновления меню:', error)
          }
        }
      )
      .subscribe((status) => {
        console.log('Статус обновления меню:', status)
      })

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [])

  // Авторизация
  async function signIn(email, password) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      await loadProfile(data.user)
      return
    }

    const demoAccounts = [
      {
        id: 'demo-admin',
        full_name: 'Администратор',
        class_name: '',
        email: 'admin@smartcanteen.uz',
        password: 'admin123',
        role: 'admin'
      },
      {
        id: 'demo-staff',
        full_name: 'Работник столовой',
        class_name: '',
        email: 'staff@smartcanteen.uz',
        password: 'staff123',
        role: 'staff'
      }
    ]

    const saved = readStore('sc_accounts', [])

    const account = [...demoAccounts, ...saved].find(
      a =>
        a.email.toLowerCase() === email.toLowerCase() &&
        a.password === password
    )

    if (!account) throw new Error('Неверный email или пароль')

    setUser(account)
    setProfile(account)
    writeStore('sc_user', account)
  }

  // Регистрация
  async function signUp({ fullName, className, email, password }) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            class_name: className
          }
        }
      })

      if (error) throw error

      if (data.user && !data.session) {
        return { confirmation: true }
      }

      if (data.user) await loadProfile(data.user)
      return
    }

    const accounts = readStore('sc_accounts', [])

    if (accounts.some(a => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Этот email уже зарегистрирован')
    }

    const account = {
      id: crypto.randomUUID(),
      full_name: fullName,
      class_name: className,
      email,
      password,
      role: 'student'
    }

    writeStore('sc_accounts', [...accounts, account])
    writeStore('sc_user', account)

    setUser(account)
    setProfile(account)
  }

  // Выход
  async function signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      writeStore('sc_user', null)
    }

    setUser(null)
    setProfile(null)
    setCart([])
  }

  // Добавление в корзину
  function addToCart(product, portion = 'full') {
    const unitPrice =
      portion === 'half' ? product.half_price : product.price

    const cartKey = `${product.id}-${portion}`

    setCart(current => {
      const found = current.find(item => item.cartKey === cartKey)

      return found
        ? current.map(item =>
            item.cartKey === cartKey
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...current,
            {
              ...product,
              id: cartKey,
              product_id: product.id,
              cartKey,
              portion,
              price: unitPrice,
              quantity: 1
            }
          ]
    })
  }

  // Изменение количества
  function updateQuantity(id, quantity) {
    setCart(current =>
      quantity <= 0
        ? current.filter(i => i.cartKey !== id)
        : current.map(i =>
            i.cartKey === id ? { ...i, quantity } : i
          )
    )
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Создание заказа
  async function placeOrder(pickupSlot, studentName, className) {
    if (!user) throw new Error('Сначала войдите в аккаунт')
    if (!cart.length) throw new Error('Корзина пуста')

    if (isSupabaseConfigured) {
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          student_name: studentName,
          class_name: className || '',
          pickup_slot: pickupSlot,
          total: cartTotal
        })
        .select()
        .single()

      if (error) throw error

      const rows = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: `${item.name_ru}${
          item.portion === 'half' ? ' (0,5 порции)' : ''
        }`,
        quantity: item.quantity,
        unit_price: item.price
      }))

      const { error: itemError } = await supabase
        .from('order_items')
        .insert(rows)

      if (itemError) throw itemError

      setCart([])
      return order
    }

    const order = {
      id: crypto.randomUUID(),
      order_number: Math.floor(1000 + Math.random() * 9000),
      user_id: user.id,
      user_name: studentName,
      student_name: studentName,
      class_name: className || user.class_name || '',
      pickup_slot: pickupSlot,
      status: 'pending',
      total: cartTotal,
      items: cart.map(i => ({
        product_name: `${i.name_ru}${
          i.portion === 'half' ? ' (0,5 порции)' : ''
        }`,
        quantity: i.quantity,
        unit_price: i.price
      })),
      created_at: new Date().toISOString()
    }

    setOrders(current => [order, ...current])
    setCart([])

    return order
  }

  // Получение заказов
  async function getOrders() {
    if (!isSupabaseConfigured) return orders

    const query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })

    if (profile?.role === 'student') {
      query.eq('user_id', user.id)
    }

    const { data, error } = await query

    if (error) throw error

    return data || []
  }

  // Изменение статуса заказа
  async function updateOrderStatus(orderId, status) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error
    } else {
      setOrders(current =>
        current.map(o =>
          o.id === orderId ? { ...o, status } : o
        )
      )
    }
  }

  // Загрузка меню вручную
  async function loadProducts() {
    if (!isSupabaseConfigured) return products

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at')

    if (error) throw error

    setProducts(data || [])

    return data || []
  }

  // Добавление и редактирование блюда
  async function saveProduct(product) {
    if (isSupabaseConfigured) {
      const { error } = product.id
        ? await supabase
            .from('products')
            .update(product)
            .eq('id', product.id)
        : await supabase
            .from('products')
            .insert(product)

      if (error) throw error

      await loadProducts()
    } else {
      setProducts(current =>
        product.id
          ? current.map(p =>
              p.id === product.id ? { ...p, ...product } : p
            )
          : [
              ...current,
              {
                ...product,
                id: crypto.randomUUID(),
                available: true
              }
            ]
      )
    }
  }

  // Удаление блюда
  async function deleteProduct(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      await loadProducts()
    } else {
      setProducts(current =>
        current.filter(product => product.id !== id)
      )
    }
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      cart,
      cartTotal,
      orders,
      products,
      addToCart,
      updateQuantity,
      signIn,
      signUp,
      signOut,
      placeOrder,
      getOrders,
      updateOrderStatus,
      loadProducts,
      saveProduct,
      deleteProduct,
      isSupabaseConfigured
    }),
    [user, profile, loading, cart, cartTotal, orders, products]
  )

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
