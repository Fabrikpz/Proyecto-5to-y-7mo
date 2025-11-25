import React from 'react'

export default function EquipmentCard({ equipment, canRequestLoan = false, onRequestLoan }) {
  const statusLabel =
    equipment.status === 'available'
      ? 'Available'
      : equipment.status === 'loaned'
      ? 'Loaned'
      : equipment.status === 'pending'
      ? 'Pending'
      : 'Under maintenance'

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{equipment.name}</h3>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            equipment.status === 'available'
              ? 'bg-green-50 text-green-700'
              : equipment.status === 'loaned'
              ? 'bg-emerald-50 text-emerald-700'
              : equipment.status === 'pending'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{equipment.type}</p>
      {equipment.description && (
        <p className="text-sm text-slate-600 line-clamp-2">{equipment.description}</p>
      )}
      {canRequestLoan && equipment.status === 'available' && (
        <button
          type="button"
          onClick={() => onRequestLoan && onRequestLoan(equipment)}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Request loan
        </button>
      )}
    </div>
  )
}
