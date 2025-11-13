import React, { useEffect, useState } from 'react'
import { useApi } from '../services/api'

export default function LoanRequests() {
  const api = useApi()
  const [loans, setLoans] = useState([])
  const [users, setUsers] = useState([])
  const [equipments, setEquipments] = useState([])
  const [form, setForm] = useState({ user_id: '', equipment_id: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadLoans = async () => {
    try {
      const { data } = await api.get('/loans')
      setLoans(data.loans)
    } catch (err) {
      console.error('Failed to load loans', err)
      setError('Failed to load loans')
    }
  }

  const loadUsersAndEquipments = async () => {
    try {
      const [usersRes, eqRes] = await Promise.all([
        api.get('/users'),
        api.get('/equipments?status=available'),
      ])
      setUsers(usersRes.data.users)
      setEquipments(eqRes.data.equipments)
    } catch (err) {
      console.error('Failed to load options', err)
    }
  }

  useEffect(() => {
    loadLoans()
    loadUsersAndEquipments()
  }, [api])

  const handleClose = async (loanId) => {
    try {
      await api.post(`/loans/${loanId}/close`)
      setLoans((prev) => prev.map((l) => (l.id === loanId ? { ...l, status: 'returned' } : l)))
    } catch (err) {
      console.error('Failed to close loan', err)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleCreateLoan = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/loans', form)
      setForm({ user_id: '', equipment_id: '' })
      await Promise.all([loadLoans(), loadUsersAndEquipments()])
    } catch (err) {
      console.error('Failed to create loan', err)
      setError(err.response?.data?.message || 'Failed to create loan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Loan Requests</h1>
          <p className="text-sm text-slate-500">Manage active and returned equipment loans.</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
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
            {loans.map((loan) => (
              <tr key={loan.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-700">#{loan.id}</td>
                <td className="px-4 py-3 text-slate-600">
                  {loan.user_name ? `${loan.user_name} (#${loan.user_id})` : loan.user_id}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {loan.equipment_name ? `${loan.equipment_name} (#${loan.equipment_id})` : loan.equipment_id}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {loan.loan_date ? new Date(loan.loan_date).toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      loan.status === 'active'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {loan.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {loan.status === 'active' && (
                    <button
                      onClick={() => handleClose(loan.id)}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Mark returned
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {loans.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-500" colSpan={6}>
                  No loans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Create loan</h2>
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
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create loan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
