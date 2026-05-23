"use client"

import React from 'react'

type Props = {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  className?: string
  children: React.ReactNode
}

export default function Heading({ as = 'h2', className = '', children }: Props) {
  const Tag = as as any

  const base =
    as === 'h1'
      ? 'ds-hero'
      : as === 'h2'
      ? 'ds-heading'
      : 'text-lg font-semibold text-[var(--text-900)]'

  return <Tag className={`${base} ${className}`}>{children}</Tag>
}
