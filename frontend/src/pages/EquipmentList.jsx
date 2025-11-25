import React, { useEffect, useState } from 'react'
import { useApi } from '../services/api'
import EquipmentCard from '../components/EquipmentCard'
import { useAuth } from '../context/AuthContext'

export default function EquipmentList() {
  const api = useApi()
  const { user } = useAuth()
  const [equipments, setEquipments] = useState([])
  const [form, setForm] = useState({ name: '', type: 'laptop', status: 'available', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loanError, setLoanError] = useState(null)
  const [loanLoadingId, setLoanLoadingId] = useState(null)

  const loadEquipments = async () => {
    try {
      const { data } = await api.get('/equipments')
      setEquipments(data.equipments)
    } catch (err) {
      console.error('Failed to load equipments', err)
      setError('Failed to load equipments')
    }
  }

  useEffect(() => {
    loadEquipments()
  }, [api])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/equipments', form)
      setForm({ name: '', type: 'laptop', status: 'available', description: '' })
      await loadEquipments()
    } catch (err) {
      console.error('Failed to create equipment', err)
      setError(err.response?.data?.message || 'Failed to create equipment')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestLoan = async (equipment) => {
    if (!user) return
    setLoanError(null)
    setLoanLoadingId(equipment.id)
    try {
      await api.post('/loans', { user_id: user.id, equipment_id: equipment.id })
      // Reload equipments so the user immediately sees the equipment move to Pending.
      await loadEquipments()
    } catch (err) {
      console.error('Failed to request loan', err)
      setLoanError(err.response?.data?.message || 'Failed to request loan')
    } finally {
      setLoanLoadingId(null)
    }
  }

  const pendingEquipments = equipments.filter((eq) => eq.status === 'pending')
  const availableEquipments = equipments.filter((eq) => eq.status === 'available')
  const loanedEquipments = equipments.filter((eq) => eq.status === 'loaned')
  const maintenanceEquipments = equipments.filter((eq) => eq.status === 'under_maintenance')

  const isAdmin = user?.role === 'admin'
  const canRequestLoan = !!user && !isAdmin

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Equipments</h1>
          <p className="text-sm text-slate-500">All laptops, projectors, tablets and cameras.</p>
        </div>
      </div>
      {loanError && <p className="text-xs text-red-600">{loanError}</p>}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Pending</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingEquipments.map((eq) => (
                <EquipmentCard key={eq.id} equipment={eq} />
              ))}
              {pendingEquipments.length === 0 && (
                <p className="text-sm text-slate-500 col-span-full">No pending requests.</p>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Available</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableEquipments.map((eq) => (
                <EquipmentCard
                  key={eq.id}
                  equipment={eq}
                  canRequestLoan={canRequestLoan}
                  onRequestLoan={handleRequestLoan}
                />
              ))}
              {availableEquipments.length === 0 && (
                <p className="text-sm text-slate-500 col-span-full">No available equipments.</p>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Loaned</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loanedEquipments.map((eq) => (
                <EquipmentCard key={eq.id} equipment={eq} />
              ))}
              {loanedEquipments.length === 0 && (
                <p className="text-sm text-slate-500 col-span-full">No loaned equipments.</p>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Under Maintenance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {maintenanceEquipments.map((eq) => (
                <EquipmentCard key={eq.id} equipment={eq} />
              ))}
              {maintenanceEquipments.length === 0 && (
                <p className="text-sm text-slate-500 col-span-full">No equipments under maintenance.</p>
              )}
            </div>
          </section>
        </div>
        {isAdmin && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Add equipment</h2>
            {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="laptop">Laptop</option>
                  <option value="projector">Projector</option>
                  <option value="tablet">Tablet</option>
                  <option value="camera">Camera</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="loaned">Loaned</option>
                  <option value="under_maintenance">Under maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Adding...' : 'Add equipment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
