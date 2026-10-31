const labels = { pending:'Ожидает', accepted:'Принят', preparing:'Готовится', ready:'Готов', collected:'Выдан', cancelled:'Отменён' }
const styles = { pending:'bg-amber-50 text-amber-700', accepted:'bg-blue-50 text-blue-700', preparing:'bg-violet-50 text-violet-700', ready:'bg-green-100 text-green-800', collected:'bg-slate-100 text-slate-600', cancelled:'bg-red-50 text-red-700' }
export default function Status({status}) { return <span className={`badge ${styles[status] || styles.pending}`}>{labels[status] || status}</span> }
