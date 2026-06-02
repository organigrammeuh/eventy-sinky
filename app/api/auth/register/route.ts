import { pool } from "@/lib/db";
import { registerSchema } from "@/lib/validators/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Invalid request body",
        },
        { status: 400 },
      );
    }

    const { fullName, email, password } = result.data;

    // verify if the user exist
    const existingUser = await pool.query(
      `
      SELECT id
      FROM "user"
      WHERE email = $1
      `,
      [email],
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          error: "EMAIL_ALREADY_EXISTS",
          message: "Email already in use",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await pool.query(
      `
      INSERT INTO "user"
      (
        full_name,
        email,
        password,
        role,
        auth_provider
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        full_name,
        email,
        role,
        auth_provider,
        avatar_url,
        created_at
      `,
      [fullName, email, hashedPassword, "attendee", "local"],
    );

    const user = createdUser.rows[0];

    // token
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
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
