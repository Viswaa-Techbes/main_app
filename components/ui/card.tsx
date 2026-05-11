import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, variant = 'default', ...props }: React.ComponentProps<'div'> & { variant?: 'default' | 'glass' | 'premium' }) {
  const base = 'text-card-foreground flex flex-col gap-6 rounded-[24px] border py-6'
  const variantClass = variant === 'glass'
    ? 'glass-card border-white/6 bg-white/6'
    : variant === 'premium'
    ? 'bg-gradient-to-br from-[rgba(79,70,229,0.06)] via-transparent to-[rgba(249,115,22,0.04)] border-transparent shadow-[0_30px_80px_-30px_rgba(16,24,40,0.45)]'
    : 'bg-card'

  return (
    <div
      data-slot="card"
      className={cn(base, variantClass, className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
