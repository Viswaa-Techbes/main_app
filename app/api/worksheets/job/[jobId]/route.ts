import { NextRequest } from "next/server";
import { proxyUserRequest } from "@/app/api/user/_proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  // Wait, Next.js params can sometimes be a promise or direct depending on Next version.
  // We can await it just in case, or access it directly. Let's await it to be compatible with Next 15+.
  const { jobId } = await params;
  return proxyUserRequest(`/api/v2/worksheets/job/${jobId}`);
}
