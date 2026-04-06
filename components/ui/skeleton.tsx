import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-xl bg-[linear-gradient(90deg,rgba(226,232,240,0.8),rgba(241,245,249,1),rgba(226,232,240,0.8))]', className)}
      {...props}
    />
  )
}

export { Skeleton }
