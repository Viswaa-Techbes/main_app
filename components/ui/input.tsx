import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, variant = 'default', ...props }: React.ComponentProps<'input'> & { variant?: 'default' | 'glass' | 'premium' }) {
  const base = 'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-10 w-full min-w-0 rounded-[var(--radius-sm)] px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'

  const variantClass = variant === 'glass'
    ? 'bg-white/6 border-white/6 text-white placeholder-white/70'
    : variant === 'premium'
    ? 'bg-[var(--input)] text-[var(--text-900)] placeholder:text-[var(--text-700)] border-transparent shadow-sm'
    : 'bg-[var(--input)] border border-border'

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(base, variantClass, 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className)}
      {...props}
    />
  )
}

export { Input }
