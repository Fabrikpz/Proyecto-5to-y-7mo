import React from 'react'

export default function EquipmentCard({ equipment }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{equipment.name}</h3>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            equipment.status === 'available'
              ? 'bg-green-50 text-green-700'
              : equipment.status === 'loaned'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {equipment.status}
        </span>
      </div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{equipment.type}</p>
      {equipment.description && (
        <p className="text-sm text-slate-600 line-clamp-2">{equipment.description}</p>
      )}
    </div>
  )
}
