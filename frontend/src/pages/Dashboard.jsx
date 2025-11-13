import React, { useEffect, useState } from 'react'
import { useApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const api = useApi()
  const { user } = useAuth()
  const [stats, setStats] = useState({ equipments: 0, activeLoans: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [equipmentsRes, loansRes] = await Promise.all([
          api.get('/equipments'),
          api.get('/loans'),
        ])
        setStats({
          equipments: equipmentsRes.data.equipments.length,
          activeLoans: loansRes.data.loans.filter((l) => l.status === 'active').length,
        })
      } catch (err) {
        console.error('Failed to load stats', err)
      }
    }

    fetchStats()
  }, [api])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Welcome back, {user?.name}</h1>
        <p className="text-sm text-slate-500">Quick overview of your equipment inventory and loans.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total equipments</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.equipments}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Active loans</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.activeLoans}</p>
        </div>
      </div>
    </div>
  )
}
