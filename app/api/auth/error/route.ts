import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get("error");

  return NextResponse.json({
    error,
    env: {
      AUTH_URL: process.env.AUTH_URL,
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
      NODE_ENV: process.env.NODE_ENV,
      hasClientId: !!process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      hasClientSecret: !!process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      hasTenantId: !!process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
      clientIdLength: process.env.AUTH_MICROSOFT_ENTRA_ID_ID?.length,
      clientSecretLength: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET?.length,
      tenantIdLength: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID?.length,
      authSecretLength: process.env.AUTH_SECRET?.length,
    },
    timestamp: new Date().toISOString(),
  });
}