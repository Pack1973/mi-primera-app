import { NextResponse } from "next/server";

export async function GET() {
  const tenantId = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID;
  return NextResponse.json({
    tenantId,
    tenantIdLength: tenantId?.length,
    tenantIdFirst8: tenantId?.substring(0, 8),
    tenantIdLast4: tenantId?.substring(tenantId.length - 4),
    authUrl: process.env.AUTH_URL,
    nodeEnv: process.env.NODE_ENV,
    clientIdFirst8: process.env.AUTH_MICROSOFT_ENTRA_ID_ID?.substring(0, 8),
  });
}