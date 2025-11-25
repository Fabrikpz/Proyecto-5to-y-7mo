import React, { useEffect, useState } from 'react'
import { useApi } from '../services/api'

export default function LoanHistory() {
  const api = useApi()
  const [loans, setLoans] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await api.get('/loans/me')
        setLoans(data.loans)
      } catch (err) {
        console.error('Failed to load loan history', err)
        setError(err.response?.data?.message || 'Failed to load loan history')
      }
    }

    loadHistory()
  }, [api])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Loan History</h1>
          <p className="text-sm text-slate-500">Your equipment loan requests and their status.</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Equipment</th>
              <th className="px-4 py-3">Request date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-700">{loan.equipment_name || `#${loan.equipment_id}`}</td>
                <td className="px-4 py-3 text-slate-600">
                  {loan.loan_date ? new Date(loan.loan_date).toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      loan.status === 'pending'
                        ? 'bg-amber-50 text-amber-700'
                        : loan.status === 'active'
                        ? 'bg-blue-50 text-blue-700'
                        : loan.status === 'rejected'
                        ? 'bg-red-50 text-red-700'
                        : loan.status === 'returned'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {loan.status}
                  </span>
                </td>
              </tr>
            ))}
            {loans.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-500" colSpan={3}>
                  No loan history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
