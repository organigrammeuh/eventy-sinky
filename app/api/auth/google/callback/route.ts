import { upsertOAuthUser, findUserByEmail } from "@/db/auth";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { GoogleTokenResponse, GoogleUserProfile } from "@/types/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        {
          error: "INVALID_REQUEST",
          message: "Missing Google authorization code",
        },
        { status: 400 },
      );
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        {
          error: "CONFIGURATION_ERROR",
          message: "Google OAuth client configuration is missing",
        },
        { status: 500 },
      );
    }

    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ??
      process.env.GOOGLE_CALLBACK_URL ??
      `${url.origin}/api/auth/google/callback`;
    console.log("redirect_uri envoyé:", redirectUri);

    // Exchange the code with access token
    const tokenEndpoint = "https://oauth2.googleapis.com/token";
    const tokenParams = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const abortController = new AbortController();
    const timeoutMs = 15000;
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    let tokenResponse: Response;
    try {
      tokenResponse = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: tokenParams.toString(),
        signal: abortController.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Google token fetch failed:", fetchError);

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          {
            error: "OAUTH_TOKEN_TIMEOUT",
            message: "Google token exchange timed out",
          },
          { status: 504 },
        );
      }

      return NextResponse.json(
        {
          error: "OAUTH_TOKEN_FETCH_FAILED",
          message:
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to fetch Google token endpoint",
        },
        { status: 502 },
      );
    } finally {
      clearTimeout(timeoutId);
    }

    const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

    if (!tokenResponse.ok || !tokenData.access_token) {
      return NextResponse.json(
        {
          error: "OAUTH_TOKEN_ERROR",
          message:
            tokenData.error_description ||
            tokenData.error ||
            "Failed to exchange Google code for access token",
        },
        { status: 401 },
      );
    }

    // Retrieve the profil (email included directly — without second call)
    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    if (!profileResponse.ok) {
      return NextResponse.json(
        {
          error: "GOOGLE_PROFILE_ERROR",
          message: "Unable to fetch Google user profile",
        },
        { status: 502 },
      );
    }

    const profile = (await profileResponse.json()) as GoogleUserProfile;
    console.log("Google profile:", JSON.stringify(profile, null, 2));

    // Verify existing user account
    const existingUser = await findUserByEmail(profile.email);
    if (existingUser && existingUser.auth_provider !== "google") {
      return NextResponse.json(
        {
          error: "ACCOUNT_EXISTS",
          message:
            "An account with this email already exists with a different sign-in method.",
          authProvider: existingUser.auth_provider,
        },
        { status: 409 },
      );
    }

    const user = await upsertOAuthUser({
      fullName: profile.name,
      email: profile.email,
      authProvider: "google",
      avatarUrl: profile.picture ?? null,
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      role: user.role,
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const redirectUrl = new URL("/login", frontendUrl);
    redirectUrl.searchParams.set("accessToken", accessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);
    redirectUrl.searchParams.set(
      "user",
      JSON.stringify({
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        avatarUrl: user.avatar_url,
        role: user.role,
        authProvider: user.auth_provider,
        createdAt: user.created_at,
      }),
    );

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Something went wrong",
        cause: error instanceof Error ? String(error.cause) : undefined,
      },
      { status: 500 },
    );
  }
}
