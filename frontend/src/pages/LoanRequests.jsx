import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useApi } from '../services/api'

// --- CONSTANTES DE ESTADO ---
const LOAN_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  REJECTED: 'rejected',
  RETURNED: 'returned',
}

// --- ICONOS SVG (Componentizados) ---
const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
)
const IconX = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
)
const IconArchive = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h12" /></svg>
)
const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
)
const IconSearch = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
)
const IconInbox = () => (
  <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0l-2 2m-2-2l-2-2m-2 2l-2 2m7-2l3-3m-3 3l-3 3m-4-4l-3-3m3 3l-3 3" /></svg>
)
// --- NUEVO ICONO ---
const IconUser = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
)
const IconSpinner = ({ className = "w-4 h-4" }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

// --- COMPONENTE: LoanStatusTag ---
function LoanStatusTag({ status }) {
  const styles = useMemo(() => {
    switch (status) {
      case LOAN_STATUS.PENDING:
        return 'bg-orange-100 text-orange-800'
      case LOAN_STATUS.ACTIVE:
        return 'bg-blue-100 text-blue-800'
      case LOAN_STATUS.RETURNED:
        return 'bg-green-100 text-green-800'
      case LOAN_STATUS.REJECTED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }, [status])

  return (
    <span className={`inline-flex items-center capitalize rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  )
}

// --- COMPONENTE: ActionButton ---
function ActionButton({ label, icon, onClick, isLoading, variant = 'primary' }) {
  const styles = useMemo(() => {
    switch (variant) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white'
      case 'primary':
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }, [variant])

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${styles}`}
    >
      {isLoading ? <IconSpinner /> : icon}
      {label}
    </button>
  )
}

// --- COMPONENTE: TableSkeleton ---
function TableSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg shadow border border-slate-200 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-slate-200 rounded w-32 mb-1.5"></div>
              <div className="h-3 bg-slate-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-8 bg-slate-200 rounded-md w-24"></div>
        </div>
      ))}
    </div>
  )
}

// --- COMPONENTE: EmptyState ---
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg border-2 border-dashed border-slate-200">
      <IconInbox />
      <p className="text-sm font-medium text-slate-500 mt-2">{message}</p>
    </div>
  )
}

// --- COMPONENTE: CreateLoanForm ---
function CreateLoanForm({ onLoanCreated, refreshKey }) {
  const api = useApi()
  const [form, setForm] = useState({ user_id: '', equipment_id: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [equipments, setEquipments] = useState([])

  const loadDropdownData = useCallback(async () => {
    try {
      const [usersRes, eqRes] = await Promise.all([
        api.get('/users'),
        api.get('/equipments?status=available'),
      ])
      setUsers(usersRes.data.users)
      setEquipments(eqRes.data.equipments)
    } catch (err) {
      console.error('Failed to load options', err)
      setError('Failed to load form options')
    }
  }, [api])

  // Carga los datos del dropdown al montar y cuando la 'refreshKey' cambia
  useEffect(() => {
    loadDropdownData()
  }, [loadDropdownData, refreshKey])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleCreateLoan = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/loans', form) // Asumimos que la API devuelve el nuevo préstamo
      setForm({ user_id: '', equipment_id: '' }) // Reset form
      onLoanCreated(data.loan) // Notifica al padre del nuevo préstamo
      await loadDropdownData() // Recarga los equipos (el prestado ya no está 'available')
    } catch (err) {
      console.error('Failed to create loan', err)
      setError(err.response?.data?.message || 'Failed to create loan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 mb-3">Create loan</h2>
      {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
      <form onSubmit={handleCreateLoan} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">User</label>
          <select
            name="user_id"
            value={form.user_id}
            onChange={handleFormChange}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Equipment</label>
          <select
            name="equipment_id"
            value={form.equipment_id}
            onChange={handleFormChange}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select equipment</option>
            {equipments.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name} ({eq.type})
              </option>
            ))}
            {equipments.length === 0 && <option disabled>No available equipment</option>}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <IconSpinner className="w-5 h-5" />
              Creating...
            </>
          ) : (
            <>
              <IconPlus />
              Create loan
            </>
          )}
        </button>
      </form>
    </div>
  )
}

// --- NUEVO COMPONENTE: UserSearchPanel ---
function UserSearchPanel() {
  const api = useApi()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await api.get('/users')
        setUsers(data.users)
      } catch (err) {
        console.error('Failed to load users', err)
        setError('Failed to load users list.')
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [api])

  const filteredUsers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase()
    if (!lowerSearch) return users
    return users.filter(u =>
      u.name.toLowerCase().includes(lowerSearch) ||
      u.email.toLowerCase().includes(lowerSearch)
    )
  }, [users, searchTerm])

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda de usuarios */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <IconSearch />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by name or email..."
          className="block w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Contenedor de la tabla/estado */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-4"><TableSkeleton /></div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 border border-red-200 m-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700 font-medium">#{user.id}</td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600 capitalize">{user.role || 'user'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState message={users.length === 0 ? "No users found." : "No users match your search."} />
        )}
      </div>
    </div>
  )
}


// --- COMPONENTE PRINCIPAL: LoanRequests ---
export default function LoanRequests() {
  const api = useApi()
  const [loans, setLoans] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // Estado para filtros
  const [filterStatus, setFilterStatus] = useState(LOAN_STATUS.PENDING) // Pestaña activa
  const [searchTerm, setSearchTerm] = useState('') // Búsqueda de préstamos

  // Estado para acciones (loading/error por fila)
  const [actionState, setActionState] = useState({ loadingId: null, error: null })

  // Clave para forzar la recarga del formulario
  const [formRefreshKey, setFormRefreshKey] = useState(0)

  // Carga de préstamos
  const loadLoans = useCallback(async () => {
    setPageLoading(true)
    setLoadError(null)
    try {
      const { data } = await api.get('/loans')
      setLoans(data.loans)
    } catch (err) {
      console.error('Failed to load loans', err)
      setLoadError('Failed to load loans')
    } finally {
      setPageLoading(false)
    }
  }, [api])

  useEffect(() => {
    loadLoans()
  }, [loadLoans])

  // --- Lógica de Acciones (Aprobar, Rechazar, Cerrar) ---
  const handleAction = useCallback(async (loanId, actionType) => {
    setActionState({ loadingId: loanId, error: null })
    try {
      let updatedStatus
      if (actionType === 'approve') {
        await api.post(`/loans/${loanId}/approve`)
        updatedStatus = LOAN_STATUS.ACTIVE
      } else if (actionType === 'reject') {
        await api.post(`/loans/${loanId}/reject`)
        updatedStatus = LOAN_STATUS.REJECTED
        setFormRefreshKey(k => k + 1) // Recarga el form
      } else if (actionType === 'close') {
        await api.post(`/loans/${loanId}/close`)
        updatedStatus = LOAN_STATUS.RETURNED
        setFormRefreshKey(k => k + 1) // Recarga el form
      }

      // Actualización local para UI instantánea
      setLoans((prev) => prev.map((l) => (l.id === loanId ? { ...l, status: updatedStatus } : l)))
    } catch (err) {
      console.error(`Failed to ${actionType} loan`, err)
      setActionState({ loadingId: null, error: `Failed to ${actionType} loan #${loanId}` })
    } finally {
      setActionState(prev => ({ ...prev, loadingId: null }))
    }
  }, [api])

  // --- Lógica de Filtrado y Búsqueda ---
  const filteredLoans = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase()
    return loans
      .filter((loan) => {
        // 1. Filtrar por estado
        if (filterStatus === 'all') return true
        return loan.status === filterStatus
      })
      .filter((loan) => {
        // 2. Filtrar por búsqueda
        if (!searchTerm) return true
        const userName = loan.user_name || ''
        const equipmentName = loan.equipment_name || ''
        return (
          userName.toLowerCase().includes(lowerSearch) ||
          equipmentName.toLowerCase().includes(lowerSearch)
        )
      })
  }, [loans, filterStatus, searchTerm])

  // --- Callback para el formulario ---
  const handleLoanCreated = (newLoan) => {
    setLoans((prev) => [newLoan, ...prev])
    setFilterStatus(LOAN_STATUS.PENDING) // Cambia el foco a "Pendientes"
  }

  // --- Renderizado de Pestañas de Filtro ---
  const renderFilterTabs = () => {
    const tabs = [
      { label: 'Pending', status: LOAN_STATUS.PENDING, icon: null },
      { label: 'Active', status: LOAN_STATUS.ACTIVE, icon: null },
      { label: 'Returned', status: LOAN_STATUS.RETURNED, icon: null },
      { label: 'All', status: 'all', icon: null },
      // --- NUEVA PESTAÑA CON ICONO ---
      { label: 'Search Users', status: 'search_users', },
    ]
    return (
      <div className="flex space-x-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.status}
            onClick={() => setFilterStatus(tab.status)}
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              filterStatus === tab.status
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon && <span className="mr-1.5">{React.cloneElement(tab.icon, { className: 'w-4 h-4' })}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    )
  }

  // --- Renderizado de Fila de la Tabla ---
  const renderLoanRow = (loan) => {
    const isLoading = actionState.loadingId === loan.id
    return (
      <tr key={loan.id} className="border-t border-slate-100 hover:bg-slate-50">
        <td className="px-4 py-3 text-slate-700 font-medium">#{loan.id}</td>
        <td className="px-4 py-3 text-slate-600">
          <div className="font-medium">{loan.user_name || 'Unknown User'}</div>
          <div className="text-xs text-slate-500">ID: {loan.user_id}</div>
        </td>
        <td className="px-4 py-3 text-slate-600">
          <div className="font-medium">{loan.equipment_name || 'Unknown Equipment'}</div>
          <div className="text-xs text-slate-500">ID: {loan.equipment_id}</div>
        </td>
        <td className="px-4 py-3 text-slate-600">
          {loan.loan_date ? new Date(loan.loan_date).toLocaleDateString() : '-'}
        </td>
        <td className="px-4 py-3">
          <LoanStatusTag status={loan.status} />
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex justify-end space-x-2">
            {loan.status === LOAN_STATUS.PENDING && (
              <>
                <ActionButton
                  label="Approve"
                  icon={<IconCheck />}
                  onClick={() => handleAction(loan.id, 'approve')}
                  isLoading={isLoading}
                  variant="success"
                />
                <ActionButton
                  label="Reject"
                  icon={<IconX />}
                  onClick={() => handleAction(loan.id, 'reject')}
                  isLoading={isLoading}
                  variant="danger"
                />
              </>
            )}
            {loan.status === LOAN_STATUS.ACTIVE && (
              <ActionButton
                label="Mark returned"
                icon={<IconArchive />}
                onClick={() => handleAction(loan.id, 'close')}
                isLoading={isLoading}
                variant="primary"
              />
            )}
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Loan Requests</h1>
          <p className="text-base text-slate-500">Manage active and returned equipment loans.</p>
        </div>
      </div>

      {/* --- Barra de Filtros y Búsqueda --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex justify-between items-center">
          {renderFilterTabs()}

          {/* --- LÓGICA DE VISIBILIDAD DE BÚSQUEDA --- */}
          {/* Oculta la búsqueda de préstamos si estamos en la pestaña de usuarios */}
          {filterStatus !== 'search_users' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IconSearch />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by user or equipment..."
                className="block w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* --- Error de Acciones --- */}
      {actionState.error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">{actionState.error}</p>
        </div>
      )}

      {/* --- Error de Carga Principal --- */}
      {loadError && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">{loadError}</p>
        </div>
      )}

      {/* --- Contenido Principal (Tabla y Formulario) --- */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)]">
        
        {/* --- CONTENIDO PRINCIPAL (Izquierda) --- */}
        {/* Renderizado condicional: o la tabla de préstamos o el buscador de usuarios */}
        {filterStatus === 'search_users' ? (
          
          <UserSearchPanel /> // Muestra el nuevo panel de búsqueda de usuarios

        ) : (
          
          // Muestra la tabla de préstamos (lógica anterior)
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            {pageLoading ? (
              <div className="p-4"><TableSkeleton /></div>
            ) : (
              <>
                {filteredLoans.length > 0 ? (
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Loan ID</th>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Equipment</th>
                        <th className="px-4 py-3">Loan date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLoans.map(renderLoanRow)}
                    </tbody>
                  </table>
                ) : (
                  <EmptyState message={loans.length === 0 ? "No loans found." : "No loans match your filters."} />
                )}
              </>
            )}
          </div>
        )}

        {/* --- Formulario Sticky (Derecha) --- */}
        <div className="sticky top-6 self-start">
          <CreateLoanForm
            onLoanCreated={handleLoanCreated}
            refreshKey={formRefreshKey}
          />
        </div>
      </div>
    </div>
  )
}