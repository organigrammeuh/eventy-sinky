import { upsertOAuthUser, findUserByEmail } from "@/db/auth";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import {
  GithubEmailRecord,
  GithubTokenResponse,
  GithubUserProfile,
} from "@/types/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        {
          error: "INVALID_REQUEST",
          message: "Missing GitHub authorization code",
        },
        { status: 400 },
      );
    }

    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      return NextResponse.json(
        {
          error: "CONFIGURATION_ERROR",
          message: "GitHub OAuth client configuration is missing",
        },
        { status: 500 },
      );
    }

    const redirectUri =
      process.env.GITHUB_REDIRECT_URI ??
      `${url.origin}/api/auth/github/callback`;

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      },
    );

    const tokenData = (await tokenResponse.json()) as GithubTokenResponse;

    if (!tokenResponse.ok || !tokenData.access_token) {
      return NextResponse.json(
        {
          error: "OAUTH_TOKEN_ERROR",
          message:
            tokenData.error_description ||
            tokenData.error ||
            "Failed to exchange GitHub code for access token",
        },
        { status: 401 },
      );
    }

    const profileResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!profileResponse.ok) {
      return NextResponse.json(
        {
          error: "GITHUB_PROFILE_ERROR",
          message: "Unable to fetch GitHub user profile",
        },
        { status: 502 },
      );
    }

    const profile = (await profileResponse.json()) as GithubUserProfile;
    let email = profile.email;

    if (!email) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (emailsResponse.ok) {
        const emails = (await emailsResponse.json()) as GithubEmailRecord[];
        const primaryEmail = emails.find(
          (item) => item.primary && item.verified,
        );
        email =
          primaryEmail?.email ??
          emails.find((item) => item.verified)?.email ??
          null;
      }
    }

    if (!email) {
      return NextResponse.json(
        {
          error: "EMAIL_REQUIRED",
          message: "GitHub account does not expose an email address",
        },
        { status: 401 },
      );
    }

    const fullName = profile.name || profile.login;

    const existingUser = await findUserByEmail(email);
    if (existingUser && existingUser.auth_provider !== "github") {
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
      fullName,
      email,
      authProvider: "github",
      avatarUrl: profile.avatar_url ?? null,
    });

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
    console.error("GitHub OAuth callback error:", error);

    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
