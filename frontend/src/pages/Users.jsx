import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useApi } from '../services/api'

// --- CONSTANTES ---
const roleOptions = ['admin', 'teacher', 'student']
const INITIAL_FORM_STATE = { name: '', email: '', password: '', role: 'teacher' }

// --- ICONOS SVG ---
const IconUser = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
)
const IconMail = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
)
const IconLock = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
)
const IconTag = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM10 10l5 5m0 0l-5 5" /></svg>
)
const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
)
const IconSearch = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
)
const IconSpinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)
const IconInbox = () => (
  <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0l-2 2m-2-2l-2-2m-2 2l-2 2m7-2l3-3m-3 3l-3 3m-4-4l-3-3m3 3l-3 3" /></svg>
)

// --- COMPONENTE: Avatar ---
// Muestra las iniciales del usuario en un círculo
function Avatar({ name }) {
  const initials = useMemo(() => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }, [name])

  return (
    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
      {initials}
    </div>
  )
}

// --- COMPONENTE: RoleBadge ---
// Un badge de color para cada rol
function RoleBadge({ role }) {
  const styles = useMemo(() => {
    switch (role) {
      case 'admin':
        return 'bg-indigo-100 text-indigo-800'
      case 'teacher':
        return 'bg-blue-100 text-blue-800'
      case 'student':
        return 'bg-slate-100 text-slate-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }, [role])

  return (
    <span className={`inline-flex items-center capitalize rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {role}
    </span>
  )
}

// --- COMPONENTE: InputWithIcon ---
// Un input de formulario con un icono dentro
function InputWithIcon({ icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {React.cloneElement(icon, { className: 'w-5 h-5 text-slate-400' })}
      </div>
      <input
        {...props}
        className="block w-full pl-10 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

// --- COMPONENTE: CreateUserForm ---
// El formulario de creación, ahora como un componente separado
function CreateUserForm({ onUserCreated }) {
  const api = useApi()
  const [form, setForm] = useState(INITIAL_FORM_STATE)
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
      // Asumimos que la API retorna el usuario recién creado
      const { data } = await api.post('/users', form)
      setForm(INITIAL_FORM_STATE) // Limpiar formulario
      onUserCreated(data.user) // Notificar al padre para actualizar la UI
    } catch (err) {
      console.error('Failed to create user', err)
      setError(err.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 mb-3">Create new user</h2>
      {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
          <InputWithIcon
            icon={<IconUser />}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
          <InputWithIcon
            icon={<IconMail />}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
          <InputWithIcon
            icon={<IconLock />}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IconTag className="w-5 h-5 text-slate-400" />
            </div>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="block w-full pl-10 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r} className="capitalize">
                  {/* Capitalizamos para el display */}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? <IconSpinner /> : <IconPlus />}
          {loading ? 'Creating...' : 'Create user'}
        </button>
      </form>
    </div>
  )
}

// --- COMPONENTE: TableSkeleton ---
// Un esqueleto de carga para la tabla
function TableSkeletonRow() {
  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
          <div className="space-y-1.5">
            <div className="h-4 w-24 rounded bg-slate-200 animate-pulse"></div>
            <div className="h-3 w-32 rounded bg-slate-200 animate-pulse"></div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-20 rounded-full bg-slate-200 animate-pulse"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-16 rounded-full bg-slate-200 animate-pulse"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-12 rounded-md bg-slate-200 animate-pulse"></div>
      </td>
    </tr>
  )
}

// --- COMPONENTE: EmptyState ---
function EmptyState({ message }) {
  return (
    <tr>
      <td colSpan={4} className="text-center p-10">
        <IconInbox />
        <p className="text-sm font-medium text-slate-500 mt-2">{message}</p>
      </td>
    </tr>
  )
}


// --- COMPONENTE PRINCIPAL: Users ---
export default function Users() {
  const api = useApi()
  const [users, setUsers] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadUsers = useCallback(async () => {
    setPageLoading(true)
    setLoadError(null)
    try {
      const { data } = await api.get('/users')
      setUsers(data.users)
    } catch (err) {
      console.error('Failed to load users', err)
      setLoadError('Failed to load users')
    } finally {
      setPageLoading(false)
    }
  }, [api]) // useCallback para estabilizar la función

  useEffect(() => {
    loadUsers()
  }, [loadUsers]) // Depende de la función estabilizada

  // Filtrado de usuarios con useMemo para optimización
  const filteredUsers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase()
    if (!lowerSearch) return users

    return users.filter(user =>
      user.name.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch)
    )
  }, [users, searchTerm])

  // Callback para actualizar la UI al crear un usuario (Optimistic Update)
  const handleUserCreated = (newUser) => {
    setUsers(currentUsers => [newUser, ...currentUsers])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-base text-slate-500">Manage administrators, teachers and students.</p>
        </div>
      </div>
      
      {/* --- Barra de Búsqueda --- */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <IconSearch />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by name or email..."
          className="block w-full lg:w-1/3 pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {loadError && (
        <p className="text-sm text-red-600">Error: {loadError}</p>
      )}
      
      {/* --- Contenido Principal (Tabla y Formulario) --- */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)]">
        
        {/* --- Columna Izquierda: Tabla de Usuarios --- */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                
              </tr>
            </thead>
            <tbody>
              {pageLoading ? (
                // --- Estado de Carga ---
                <>
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                  <TableSkeletonRow />
                </>
              ) : filteredUsers.length === 0 ? (
                // --- Estado Vacío ---
                <EmptyState message={users.length === 0 ? "No users found." : "No users match your search."} />
              ) : (
                // --- Estado con Datos ---
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} />
                        <div>
                          <p className="font-semibold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-medium text-slate-600">Active</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Columna Derecha: Formulario "Sticky" --- */}
        <div className="sticky top-6 self-start">
          <CreateUserForm onUserCreated={handleUserCreated} />
        </div>
      </div>
    </div>
  )
}