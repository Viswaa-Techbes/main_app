import { proxyUserRequest } from "@/app/api/user/_proxy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  return proxyUserRequest(`/api/v2/user/address/${id}`, { method: "PUT", body });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyUserRequest(`/api/v2/user/address/${id}`, { method: "DELETE" });
}
