import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkBase =
  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100'

export default function Sidebar() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <aside className="hidden w-56 border-r border-slate-200 bg-white p-4 md:block">
      <nav className="space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/equipments"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`
          }
        >
          Equipments
        </NavLink>
        {user.role === 'admin' && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`
            }
          >
            Users
          </NavLink>
        )}
        {(user.role === 'admin' || user.role === 'teacher') && (
          <NavLink
            to="/loans"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`
            }
          >
            Loan Requests
          </NavLink>
        )}
      </nav>
    </aside>
  )
}
