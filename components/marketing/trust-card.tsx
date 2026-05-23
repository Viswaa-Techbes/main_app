"use client"

import React from 'react'

type Props = {
  logo?: string
  title: string
  description?: string
}

export default function TrustCard({ logo, title, description }: Props) {
  return (
    <div className="ds-card p-4 flex items-start gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-elevated">
      <div className="h-10 w-10 rounded-lg bg-[var(--bg-soft)] flex-shrink-0" />
      <div>
        <div className="font-semibold text-[var(--text-900)]">{title}</div>
        {description && <div className="text-sm text-[var(--text-700)] mt-1">{description}</div>}
      </div>
    </div>
  )
}
