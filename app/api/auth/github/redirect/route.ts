import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const redirectUri =
    process.env.GITHUB_REDIRECT_URI ?? `${origin}/api/auth/github/callback`;

  if (!process.env.GITHUB_CLIENT_ID) {
    return NextResponse.json(
      {
        error: "CONFIGURATION_ERROR",
        message: "Missing GitHub client ID",
      },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    allow_signup: "true",
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`,
  );
}
