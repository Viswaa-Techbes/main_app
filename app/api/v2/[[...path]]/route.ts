import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/core/auth/session";
import { getBackendUrl } from "@/core/api/backend-url";

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(request, params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(request, params.path);
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(request, params.path);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(request, params.path);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(request, params.path);
}

async function handleProxy(request: NextRequest, pathSegments: string[]) {
  const session = await getServerSession();
  const path = `/${pathSegments.join("/")}`;
  const backendUrl = getBackendUrl(`/api/v2${path}${request.nextUrl.search}`);

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (session?.backendToken) {
    headers.set("Authorization", `Bearer ${session.backendToken}`);
  }

  const method = request.method;
  const body = method !== "GET" && method !== "HEAD" ? await request.text() : undefined;

  try {
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`[Proxy Error] ${method} ${path}:`, error);
    return NextResponse.json({ message: "Backend service unavailable" }, { status: 502 });
  }
}
