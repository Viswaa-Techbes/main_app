import { PageSkeleton } from "@/components/services/page-skeleton";
import MagneticInit from "@/components/ui/magnetic-init";

export default function Loading() {
  return (
    <>
      <MagneticInit />
      <PageSkeleton />
    </>
  );
}
