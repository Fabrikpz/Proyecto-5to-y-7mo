import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Manage equipment loans with ease.
          </h1>
          <p className="text-slate-600">
            Centralize laptop, projector, tablet and camera reservations for your institution with a clean,
            scalable web dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/dashboard' : '/equipments'}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Go to {user.role === 'admin' ? 'dashboard' : 'equipments'}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
