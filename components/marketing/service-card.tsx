"use client"

import React from 'react'

type Props = {
  title: string
  price?: string
  duration?: string
  rating?: number
}

export default function ServiceCard({ title, price, duration, rating = 0 }: Props) {
  return (
    <article className="flex items-center gap-4 p-3 rounded-lg border transition-transform duration-200 hover:-translate-y-1 hover:shadow-elevated" style={{borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)'}}>
      <div className="h-14 w-14 rounded-lg bg-[var(--bg-soft)] flex-shrink-0" />

      <div className="flex-1">
        <h4 className="text-[var(--font-card-title-size)] font-semibold text-[var(--text-900)]">{title}</h4>
        <div className="mt-1 text-sm text-[var(--text-700)]">{duration} · {rating} ★</div>
      </div>

      <div className="text-right">
        {price && <div className="text-sm font-semibold text-[var(--text-900)]">{price}</div>}
        <button className="mt-2 btn-primary text-xs">Book</button>
      </div>
    </article>
  )
}
