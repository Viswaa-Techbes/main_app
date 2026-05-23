"use client"

import React from 'react'

type SectionProps = {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export default function Section({ title, description, children, className = '' }: SectionProps) {
  return (
    <section className={`mx-auto max-w-7xl px-6 py-12 sm:py-16 ${className}`}>
      {title && (
        <div className="mb-6">
          <h2 className="ds-heading">{title}</h2>
          {description && <p className="ds-body mt-2 text-[var(--text-700)]">{description}</p>}
        </div>
      )}

      <div>{children}</div>
    </section>
  )
}

export type { SectionProps }
