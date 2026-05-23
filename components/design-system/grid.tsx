"use client"

import React from 'react'

type Props = {
  children: React.ReactNode
  cols?: string
  className?: string
}

export default function Grid({ children, cols = 'grid-cols-3', className = '' }: Props) {
  return <div className={`grid ${cols} gap-4 ${className}`}>{children}</div>
}
