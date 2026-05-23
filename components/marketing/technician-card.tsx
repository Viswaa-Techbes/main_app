"use client"

import React from 'react'

type Props = {
  name: string
  role?: string
  rating?: number
}

export default function TechnicianCard({ name, role, rating = 0 }: Props) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border transition-transform duration-200 hover:-translate-y-1 hover:shadow-elevated" style={{borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)'}}>
      <div className="h-12 w-12 rounded-full bg-[var(--bg-soft)] flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-[var(--text-900)]">{name}</div>
            {role && <div className="text-sm text-[var(--text-700)]">{role}</div>}
          </div>

          <div className="text-sm font-medium text-[var(--text-700)]">{rating} ★</div>
        </div>
      </div>
    </div>
  )
}
