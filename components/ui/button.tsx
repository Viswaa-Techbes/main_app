import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "ds-body inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.99]",
  {
    variants: {
      variant: {
        primary: 'btn-primary bg-[var(--color-primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-soft)] hover:brightness-95',
        secondary: 'bg-[var(--color-secondary)] text-white shadow-sm hover:brightness-95',
        ghost: 'bg-transparent text-[var(--text-900)] hover:bg-[var(--bg-soft)]',
        outline: 'bg-transparent border text-[var(--text-900)] border-[var(--border)] hover:bg-[var(--bg-soft)]',
        destructive: 'bg-[var(--destructive)] text-white hover:opacity-95',
        link: 'text-[var(--color-primary)] underline-offset-4 hover:underline',
      },
      size: {
        md: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 rounded-xl px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'
  const isDisabled = disabled || loading

  return (
    <Comp
      data-slot="button"
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin size-4 mr-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      ) : null}
      {/* Ensure Slot receives a single element child when asChild is true */}
      {/* If the direct child is itself a React element with multiple children, clone it and wrap its children */}
      {/* @ts-ignore */}
      {(() => {
        const ch = (props as any).children;
        if (asChild && React.isValidElement(ch)) {
          const inner = (ch.props as any).children;
          if (React.Children.count(inner) !== 1) {
            return React.cloneElement(ch, { ...(ch.props || {}), children: <span>{inner}</span> });
          }
          return ch;
        }

        if (asChild && React.Children.count(ch) !== 1) {
          return <span>{ch}</span>;
        }

        return ch;
      })()}
    </Comp>
  )
}

export { Button, buttonVariants }
