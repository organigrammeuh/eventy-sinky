import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminUrl = process.env.ADMIN_URL;

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set(
    "Access-Control-Allow-Origin",
    adminUrl!
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH", 
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export const config = {
  matcher: "/api/:path*",
};