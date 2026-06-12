import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminUrl = process.env.ADMIN_URL;

export default function proxy(request: NextRequest) {
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
    "*"
  );
  response.headers.set(
    "Access-Control-Expose-Headers",
    "Content-Range"
  );

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
