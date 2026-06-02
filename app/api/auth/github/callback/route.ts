import { pool } from "@/lib/db";
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

    const upsertUser = await pool.query(
      `
      INSERT INTO "user"
        (full_name, email, password, role, auth_provider, avatar_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE
      SET
        full_name = EXCLUDED.full_name,
        auth_provider = EXCLUDED.auth_provider,
        avatar_url = EXCLUDED.avatar_url
      RETURNING
        id,
        full_name,
        email,
        role,
        auth_provider,
        avatar_url,
        created_at
      `,
      [fullName, email, null, "attendee", "github", profile.avatar_url ?? null],
    );

    const user = upsertUser.rows[0];

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      role: user.role,
    });

    return NextResponse.json(
      {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          avatarUrl: user.avatar_url,
          role: user.role,
          authProvider: user.auth_provider,
          createdAt: user.created_at,
        },
      },
      { status: 200 },
    );
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
