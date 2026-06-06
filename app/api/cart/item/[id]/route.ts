import { proxyUserRequest } from "@/app/api/user/_proxy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyUserRequest(`/api/v2/cart/item/${id}`, { method: "DELETE" });
}
