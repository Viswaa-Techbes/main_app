import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-40 rounded-[36px]" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[320px,1fr]">
        <Skeleton className="h-[38rem] rounded-[32px]" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[24rem] rounded-[28px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
