"use client"

import React from 'react'

type Props = {
  children: React.ReactNode
  gap?: number
  axis?: 'vertical' | 'horizontal'
  className?: string
}

export default function Stack({ children, gap = 4, axis = 'vertical', className = '' }: Props) {
  const gapClass = `gap-${gap}`

  return (
    <div className={`${axis === 'vertical' ? 'flex flex-col' : 'flex flex-row'} ${gapClass} ${className}`}>
      {children}
    </div>
  )
}
