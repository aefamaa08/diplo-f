
import { useEffect, useState } from 'react'
import {
  Plus,
  Save,
  Pencil,
  Trash2,
  X,
  Search,
  Eye,
  EyeOff,
  Utensils,
} from 'lucide-react'

import { useApp } from '../../context/AppContext'
import { formatMoney } from '../../data/demoData'

const blank = {
  name_ru: '',
  name_uz: '',
  description_ru: '',
  description_uz: '',
  price: '',
  half_price: '',
  category: 'Основные блюда',
  image_url: '',
  available: true,
}

const categories = [
  'Все категории',
  'Супы',
  'Основные блюда',
  'Салаты',
  'Гарниры',
]

export default function AdminMenu() {
  const {
    products,
    saveProduct,
    loadProducts,
    deleteProduct,
  } = useApp()

  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Все категории')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProducts().catch((err) => {
      setError(err.message || 'Не удалось загрузить блюда')
    })
  }, [])

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function resetForm() {
    setForm(blank)
    setEditingId(null)
    setError('')
  }

  function editProduct(product) {
    setEditingId(product.id)

    setForm({
      name_ru: product.name_ru || '',
      name_uz: product.name_uz || '',
      description_ru: product.description_ru || '',
      description_uz: product.description_uz || '',
      price: String(product.price ?? ''),
      half_price: product.half_price == null
        ? ''
        : String(product.half_price),
      category: product.category || 'Основные блюда',
      image_url: product.image_url || '',
      available: product.available ?? true,
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')

    if (!form.name_ru.trim() || !form.name_uz.trim()) {
      setError('Заполните названия блюда на русском и узбекском.')
      return
    }

    if (form.price === '' || Number(form.price) < 0) {
      setError('Укажите корректную цену.')
      return
    }

    if (
      form.half_price !== '' &&
      Number(form.half_price) < 0
    ) {
      setError('Цена половины порции не может быть отрицательной.')
      return
    }

    setLoading(true)

    try {
      await saveProduct({
        ...(editingId ? { id: editingId } : {}),
        ...form,
        name_ru: form.name_ru.trim(),
        name_uz: form.name_uz.trim(),
        price: Number(form.price),
        half_price: form.half_price === ''
          ? null
          : Number(form.half_price),
      })

      await loadProducts()
      resetForm()
    } catch (err) {
      setError(err.message || 'Не удалось сохранить блюдо.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleAvailability(product) {
    setError('')

    try {
      await saveProduct({
        ...product,
        available: !product.available,
      })

      await loadProducts()
    } catch (err) {
      setError(err.message || 'Не удалось изменить доступность блюда.')
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Удалить блюдо «${product.name_ru}»?`
    )

    if (!confirmed) return

    setError('')

    try {
      await deleteProduct(product.id)
      await loadProducts()

      if (editingId === product.id) {
        resetForm()
      }
    } catch (err) {
      setError(err.message || 'Не удалось удалить блюдо.')
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name_ru?.toLowerCase().includes(search.toLowerCase()) ||
      product.name_uz?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      categoryFilter === 'Все категории' ||
      product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">
          Управление меню
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Добавляйте, редактируйте и удаляйте блюда столовой.
        </p>
      </div>

      {/* Форма добавления и редактирования */}
      <form
        onSubmit={handleSave}
        className="soft-card grid gap-4 p-5 md:grid-cols-2"
      >
        <div className="flex items-center justify-between md:col-span-2">
          <h2 className="font-extrabold text-lg">
            {editingId ? 'Редактирование блюда' : 'Добавить блюдо'}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500"
            >
              <X size={16} />
              Отмена
            </button>
          )}
        </div>

        <input
          className="input"
          required
          placeholder="Название на русском"
          value={form.name_ru}
          onChange={(e) => updateForm('name_ru', e.target.value)}
        />

        <input
          className="input"
          required
          placeholder="Название на узбекском"
          value={form.name_uz}
          onChange={(e) => updateForm('name_uz', e.target.value)}
        />

        <textarea
          className="input min-h-20"
          placeholder="Описание на русском"
          value={form.description_ru}
          onChange={(e) => updateForm('description_ru', e.target.value)}
        />

        <textarea
          className="input min-h-20"
          placeholder="Описание на узбекском"
          value={form.description_uz}
          onChange={(e) => updateForm('description_uz', e.target.value)}
        />

        <div>
          <label className="mb-1 block text-sm font-medium">
            Цена полной порции (сум)
          </label>
          <input
            className="input"
            type="number"
            min="0"
            step="1"
            required
            placeholder="Например, 25000"
            value={form.price}
            onChange={(e) => updateForm('price', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Цена половины порции (сум)
          </label>
          <input
            className="input"
            type="number"
            min="0"
            step="1"
            placeholder="Необязательно"
            value={form.half_price}
            onChange={(e) => updateForm('half_price', e.target.value)}
          />
        </div>

        <select
          className="input"
          value={form.category}
          onChange={(e) => updateForm('category', e.target.value)}
        >
          {categories.slice(1).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Ссылка на фотографию"
          value={form.image_url}
          onChange={(e) => updateForm('image_url', e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => updateForm('available', e.target.checked)}
          />
          Блюдо доступно для заказа
        </label>

        {error && (
          <p className="text-sm text-red-600 md:col-span-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 md:col-span-2"
        >
          {editingId ? <Save size={17} /> : <Plus size={17} />}
          {loading
            ? 'Сохранение...'
            : editingId
              ? 'Сохранить изменения'
              : 'Добавить блюдо'}
        </button>
      </form>

      {/* Поиск и фильтры */}
      <div className="soft-card space-y-4 p-5">
        <h2 className="font-extrabold text-lg">
          Блюда в меню ({products.length})
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              className="input pl-10"
              placeholder="Поиск блюда..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Список блюд */}
        <div className="divide-y">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-center gap-3 py-4"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name_ru}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <Utensils size={25} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <b className="block truncate">
                  {product.name_ru}
                </b>

                <p className="text-xs text-slate-400">
                  {product.category}
                </p>

                <p className="mt-1 text-sm font-bold">
                  {formatMoney(product.price)}
                </p>

                {product.half_price != null && (
                  <p className="text-xs text-slate-500">
                    Половина: {formatMoney(product.half_price)}
                  </p>
                )}

                <span
                  className={`mt-1 inline-block text-xs ${
                    product.available
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
                  {product.available ? 'Доступно' : 'Нет в наличии'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title={product.available ? 'Скрыть блюдо' : 'Сделать доступным'}
                  onClick={() => toggleAvailability(product)}
                  className="rounded-xl bg-slate-100 p-2 hover:bg-slate-200"
                >
                  {product.available
                    ? <Eye size={17} />
                    : <EyeOff size={17} />}
                </button>

                <button
                  type="button"
                  title="Редактировать"
                  onClick={() => editProduct(product)}
                  className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                >
                  <Pencil size={17} />
                </button>

                <button
                  type="button"
                  title="Удалить"
                  onClick={() => handleDelete(product)}
                  className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              Блюда не найдены.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
