import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

// --- CONSTANTES ---
const EQUIPMENT_STATUS = {
  PENDING: 'pending',
  AVAILABLE: 'available',
  LOANED: 'loaned',
  MAINTENANCE: 'under_maintenance',
}

const USER_ROLES = {
  ADMIN: 'admin',
}

// --- ICONOS SVG ---
// He añadido iconos como componentes para no tener dependencias externas
const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const IconSpinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

const IconInbox = () => (
  <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0l-2 2m-2-2l-2-2m-2 2l-2 2m7-2l3-3m-3 3l-3 3m-4-4l-3-3m3 3l-3 3" />
  </svg>
)

// --- COMPONENTE: StatusTag ---
// Un componente dedicado para mostrar el estado con colores
function StatusTag({ status }) {
  const statusStyles = useMemo(() => {
    switch (status) {
      case EQUIPMENT_STATUS.AVAILABLE:
        return 'bg-green-100 text-green-800'
      case EQUIPMENT_STATUS.LOANED:
        return 'bg-yellow-100 text-yellow-800'
      case EQUIPMENT_STATUS.PENDING:
        // --- CAMBIO APLICACO ---
        // Ahora es naranja
        return 'bg-orange-100 text-orange-800'
      // --- FIN DEL CAMBIO ---
      case EQUIPMENT_STATUS.MAINTENANCE:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }, [status])

  const statusText = useMemo(() => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
  }, [status])

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles}`}>
      {statusText}
    </span>
  )
}

// --- COMPONENTE: EquipmentCard ---
// La tarjeta de equipo rediseñada
function EquipmentCard({ equipment, canRequestLoan, onRequestLoan, isLoading }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 transition-all duration-200 hover:shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-base font-bold text-slate-800">{equipment.name}</h3>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{equipment.type}</p>
          </div>
          <StatusTag status={equipment.status} />
        </div>
        <p className="text-sm text-slate-600 min-h-[40px]">
          {equipment.description || <span className="italic text-slate-400">Sin descripción</span>}
        </p>
        
        {canRequestLoan && (
          <button
            onClick={() => onRequestLoan(equipment)}
            disabled={isLoading}
            className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <IconSpinner />
                Solicitando...
              </>
            ) : (
              'Solicitar préstamo'
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// --- COMPONENTE: EmptyState ---
// Un "placeholder" gráfico para cuando no hay items en una lista
function EmptyState({ message }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
      <IconInbox />
      <p className="text-sm text-slate-500 mt-2">{message}</p>
    </div>
  )
}

// --- COMPONENTE: EquipmentSkeleton ---
// La tarjeta de carga "fantasma"
function EquipmentSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
        </div>
        <div className="h-5 bg-slate-200 rounded-full w-20"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-full mt-3"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mt-2"></div>
      
      <div className="h-9 bg-slate-200 rounded-md w-full mt-4"></div>
    </div>
  )
}

// --- COMPONENTE: AddEquipmentForm ---
// El formulario, como un componente separado para limpieza
function AddEquipmentForm({ onEquipmentAdded }) {
  const api = useApi()
  const [form, setForm] = useState({ name: '', type: 'laptop', status: 'available', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/equipments', form)
      setForm({ name: '', type: 'laptop', status: 'available', description: '' }) // Reset form
      onEquipmentAdded(data.equipment) // Callback al padre
    } catch (err) {
      console.error('Failed to create equipment', err)
      setError(err.response?.data?.message || 'Failed to create equipment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 mb-3">Add equipment</h2>
      {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="laptop">Laptop</option>
            <option value="projector">Projector</option>
            <option value="tablet">Tablet</option>
            <option value="camera">Camera</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="available">Available</option>
            <option value="loaned">Loaned</option>
            <option value="under_maintenance">Under maintenance</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60">
          {loading ? (
            <>
              <IconSpinner />
              Adding...
            </>
          ) : (
            <>
              <IconPlus />
              Add equipment
            </>
          )}
        </button>
      </form>
    </div>
  )
}

// --- COMPONENTE PRINCIPAL: EquipmentList ---
export default function EquipmentList() {
  const api = useApi()
  const { user } = useAuth()
  const [equipments, setEquipments] = useState([])
  const [pageLoading, setPageLoading] = useState(true) // Estado de carga para la página
  const [loadError, setLoadError] = useState(null)
  const [loanError, setLoanError] = useState(null)
  const [loanLoadingId, setLoanLoadingId] = useState(null)
  
  const loadEquipments = useCallback(async () => {
    setPageLoading(true)
    try {
      setLoadError(null)
      const { data } = await api.get('/equipments')
      setEquipments(data.equipments)
    } catch (err) {
      console.error('Failed to load equipments', err)
      setLoadError('Failed to load equipments. Please try refreshing.')
    } finally {
      setPageLoading(false)
    }
  }, [api])

  useEffect(() => {
    loadEquipments()
  }, [loadEquipments])

  // Optimización de filtros con useMemo
  const categorizedEquipments = useMemo(() => {
    const pending = []
    const available = []
    const loaned = []
    const maintenance = []

    for (const eq of equipments) {
      switch (eq.status) {
        case EQUIPMENT_STATUS.PENDING: pending.push(eq); break;
        case EQUIPMENT_STATUS.AVAILABLE: available.push(eq); break;
        case EQUIPMENT_STATUS.LOANED: loaned.push(eq); break;
        case EQUIPMENT_STATUS.MAINTENANCE: maintenance.push(eq); break;
        default: break;
      }
    }
    return { pending, available, loaned, maintenance }
  }, [equipments])

  // Manejador para añadir equipo (actualización local)
  const handleEquipmentAdded = (newEquipment) => {
    setEquipments((current) => [...current, newEquipment])
  }

  // Manejador para solicitar préstamo (actualización local)
  const handleRequestLoan = useCallback(async (equipmentToLoan) => {
    if (!user) return
    setLoanError(null)
    setLoanLoadingId(equipmentToLoan.id)
    try {
      await api.post('/loans', { user_id: user.id, equipment_id: equipmentToLoan.id })
      
      setEquipments((current) =>
        current.map((eq) =>
          eq.id === equipmentToLoan.id
            ? { ...eq, status: EQUIPMENT_STATUS.PENDING }
            : eq
        )
      )
    } catch (err) {
      console.error('Failed to request loan', err)
      setLoanError(err.response?.data?.message || 'Failed to request loan')
    } finally {
      setLoanLoadingId(null)
    }
  }, [api, user])

  const isAdmin = user?.role === USER_ROLES.ADMIN
  const canRequestLoan = !!user && !isAdmin

  // Renderiza el grid de Skeletons mientras carga
  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <EquipmentSkeleton key={i} />)}
    </div>
  )

  // Renderiza una sección (título + grid)
  const renderEquipmentSection = (title, items, emptyMessage, showLoanButton = false) => (
    <section>
      <h2 className="text-xl font-semibold text-slate-800 mb-3 pb-3 border-b border-slate-200">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((eq) => (
          <EquipmentCard
            key={eq.id}
            equipment={eq}
            canRequestLoan={showLoanButton}
            onRequestLoan={handleRequestLoan}
            isLoading={loanLoadingId === eq.id}
          />
        ))}
        {items.length === 0 && <EmptyState message={emptyMessage} />}
      </div>
    </section>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Equipments</h1>
          <p className="text-base text-slate-500">All laptops, projectors, tablets and cameras.</p>
        </div>
      </div>
      
      {loadError && <p className="text-base text-red-600 font-medium">{loadError}</p>}
      {loanError && <p className="text-xs text-red-600">{loanError}</p>}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-8">
          {pageLoading ? (
            renderLoadingSkeletons()
          ) : (
            <>
              {renderEquipmentSection('Pending', categorizedEquipments.pending, 'No pending requests.')}
              {renderEquipmentSection('Available', categorizedEquipments.available, 'No available equipments.', canRequestLoan)}
              {renderEquipmentSection('Loaned', categorizedEquipments.loaned, 'No loaned equipments.')}
              {renderEquipmentSection('Under Maintenance', categorizedEquipments.maintenance, 'No equipments under maintenance.')}
            </>
          )}
        </div>
        
        {isAdmin && (
          <div className="sticky top-6 self-start">
            <AddEquipmentForm onEquipmentAdded={handleEquipmentAdded} />
          </div>
        )}
      </div>
    </div>
  )
}