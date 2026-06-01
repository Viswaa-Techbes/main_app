import { notFound } from "next/navigation";
import { CctvServiceDetail } from "@/components/cctv/cctv-service-detail";
import { cctvApi } from "@/lib/cctv-api";

export default async function CctvDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const service = await cctvApi.subcategory(slug);
    return <CctvServiceDetail service={service} />;
  } catch {
    notFound();
  }
}
