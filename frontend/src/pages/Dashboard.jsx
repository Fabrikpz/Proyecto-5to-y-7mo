import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

// --- Iconos SVG para el Dashboard ---
const IconBox = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
)
const IconCheckCircle = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const IconUpload = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
)
const IconClock = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const IconArrowRight = () => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
)
const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
)
const IconList = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
)

// --- Componente: StatCard ---
// Una tarjeta de estadística reutilizable con icono y color
function StatCard({ title, value, icon, colorClass }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

// --- Componente: StatCardSkeleton ---
// Placeholder de carga para la StatCard
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-slate-200"></div>
      <div className="mt-4 h-4 rounded bg-slate-200 w-3/4"></div>
      <div className="mt-2 h-8 rounded bg-slate-200 w-1/2"></div>
    </div>
  )
}

export default function Dashboard() {
  const api = useApi()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    activeLoans: 0,
    pendingLoans: 0,
  })
  const [recentPending, setRecentPending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const [equipmentsRes, loansRes] = await Promise.all([
          api.get('/equipments'),
          api.get('/loans'),
        ])

        const allEquipments = equipmentsRes.data.equipments
        const allLoans = loansRes.data.loans

        // Calculamos todas las estadísticas que necesitamos
        const available = allEquipments.filter(e => e.status === 'available').length
        const active = allLoans.filter(l => l.status === 'active').length
        const pendingList = allLoans.filter(l => l.status === 'pending')

        setStats({
          totalEquipment: allEquipments.length,
          availableEquipment: available,
          activeLoans: active,
          pendingLoans: pendingList.length,
        })

        // Guardamos las 5 solicitudes pendientes más recientes para la lista
        // (Asumiendo que la API los devuelve en orden, o usamos .slice(-5).reverse() si vienen los más viejos primero)
        setRecentPending(pendingList.slice(0, 5))

      } catch (err) {
        console.error('Failed to load stats', err)
        // Aquí podrías setear un estado de error
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [api])

  const statCards = useMemo(() => [
    { title: 'Total Equipments', value: stats.totalEquipment, icon: <IconBox />, colorClass: 'bg-blue-100 text-blue-600' },
    { title: 'Available', value: stats.availableEquipment, icon: <IconCheckCircle />, colorClass: 'bg-green-100 text-green-600' },
    { title: 'Active Loans', value: stats.activeLoans, icon: <IconUpload />, colorClass: 'bg-yellow-100 text-yellow-600' },
    { title: 'Pending Requests', value: stats.pendingLoans, icon: <IconClock />, colorClass: 'bg-orange-100 text-orange-600' },
  ], [stats])

  return (
    <div className="space-y-6">
      {/* --- Encabezado --- */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Welcome back, {user?.name}</h1>
        <p className="text-base text-slate-500">Quick overview of your equipment inventory and loans.</p>
      </div>

      {/* --- Grid de Estadísticas (KPIs) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          statCards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
              colorClass={card.colorClass}
            />
          ))
        )}
      </div>

      {/* --- Paneles de Acciones --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Solicitudes Pendientes */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Pending Loan Requests</h2>
            <Link
              to="/loans"
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all
              <IconArrowRight />
            </Link>
          </div>
          {loading ? (
            // Skeleton para la lista
            <div className="p-4 space-y-3 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-5 rounded bg-slate-200 w-1/3"></div>
                <div className="h-8 rounded-md bg-slate-200 w-1/4"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-5 rounded bg-slate-200 w-1/2"></div>
                <div className="h-8 rounded-md bg-slate-200 w-1/4"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-5 rounded bg-slate-200 w-1/4"></div>
                <div className="h-8 rounded-md bg-slate-200 w-1/4"></div>
              </div>
            </div>
          ) : (
            // Lista real
            <div className="divide-y divide-slate-100">
              {recentPending.length > 0 ? (
                recentPending.map((loan) => (
                  <div key={loan.id} className="flex justify-between items-center p-4 hover:bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-800">{loan.equipment_name || 'Equipment'}</p>
                      <p className="text-sm text-slate-500">Requested by: {loan.user_name || 'User'}</p>
                    </div>
                    <Link
                      to="/loans" // Idealmente, esto iría a /loans?filter=pending
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                    >
                      Review
                    </Link>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-slate-500 text-center">No pending requests. 🎉</p>
              )}
            </div>
          )}
        </div>

        {/* Columna Derecha: Acciones Rápidas */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/loans"
                className="flex items-center gap-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <IconList className="text-slate-500" />
                Manage All Loans
              </Link>
              <Link
                to="/equipments"
                className="flex items-center gap-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <IconPlus className="text-slate-500" />
                Add New Equipment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}