import { ReactNode } from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function PageStatus({
  message,
  icon,
  className,
}: {
  message: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-[60vh] items-center justify-center", className)}>
      <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm font-medium text-slate-600 shadow-lg shadow-slate-200/70 backdrop-blur">
        {icon ?? <Spinner className="h-4 w-4" />}
        {message}
      </div>
    </div>
  );
}
