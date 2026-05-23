"use client"

import React from 'react'

type Props = {
  variant?: 'lead' | 'body' | 'muted' | 'small'
  className?: string
  children: React.ReactNode
}

export default function Text({ variant = 'body', className = '', children }: Props) {
  const cls =
    variant === 'lead'
      ? 'text-[18px] text-[var(--text-900)]'
      : variant === 'muted'
      ? 'text-sm text-[var(--text-700)]'
      : variant === 'small'
      ? 'text-sm text-[var(--text-700)]'
      : 'ds-body'

  return <p className={`${cls} ${className}`}>{children}</p>
}
