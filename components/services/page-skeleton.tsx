"use client";

import Skeleton from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="w-44">
            <Skeleton height={36} radius={12} />
          </div>
          <Skeleton height={42} radius={8} className="w-full" />
          <Skeleton height={18} radius={6} className="w-3/4" />
          <div className="flex gap-3 mt-4">
            <Skeleton height={44} radius={999} className="w-1/2" />
            <Skeleton height={44} radius={999} className="w-1/3" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Skeleton height={64} radius={12} />
            <Skeleton height={64} radius={12} />
            <Skeleton height={64} radius={12} />
            <Skeleton height={64} radius={12} />
          </div>
        </div>

        <div>
          <Skeleton height={300} radius={20} className="w-full" />
        </div>
      </section>

      <section className="mt-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-4">
              <Skeleton height={160} radius={12} className="w-full" />
              <div className="mt-4 space-y-2">
                <Skeleton height={16} radius={6} className="w-3/4" />
                <Skeleton height={12} radius={6} className="w-1/2" />
                <div className="mt-3 flex gap-2"><Skeleton height={36} radius={999} className="w-1/2" /><Skeleton height={36} radius={999} className="w-1/3" /></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default PageSkeleton;

