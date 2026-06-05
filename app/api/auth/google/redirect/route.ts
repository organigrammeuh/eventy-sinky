import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ??
    process.env.GOOGLE_CALLBACK_URL ??
    `${origin}/api/auth/google/callback`;

  if (!process.env.GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      {
        error: "CONFIGURATION_ERROR",
        message: "Missing Google client ID",
      },
      { status: 500 },
    );
  }

  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state, // state for google
    access_type: "offline",
  });

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );

  // Store the state in a cookie to validate it in the callback
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });

  return response;
}
