import { pool } from "@/lib/db";

export type AuthProvider = "google" | "github" | "local";

// interface for oauth user
export interface OAuthUserRecord {
  id: number;
  auth_provider: AuthProvider;
}

// get user by email
export async function getUserByEmail(email: String) {
  const result = await pool.query(
    `
    SELECT id, full_name, email, password, role, auth_provider, avatar_url, created_at
    FROM "user"
    WHERE email = $1
    `,
    [email],
  );
  return result.rows[0] ?? null;
}

// find user by email
export async function findUserByEmail(
  email: string,
): Promise<OAuthUserRecord | null> {
  const result = await pool.query(
    `
    SELECT id, auth_provider
    FROM "user"
    WHERE email = $1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

// upsert user
export async function upsertOAuthUser(params: {
  fullName: string;
  email: string;
  authProvider: AuthProvider;
  avatarUrl: string | null;
}) {
  const { fullName, email, authProvider, avatarUrl } = params;

  const result = await pool.query(
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
    [fullName, email, null, "attendee", authProvider, avatarUrl],
  );

  return result.rows[0];
}
