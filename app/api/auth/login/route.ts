import { getUserByEmail } from "@/db/auth";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validators/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Invalid request body",
        },
        { status: 400 },
      );
    }

    const { email, password } = result.data;

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        {
          error: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    if (user.auth_provider !== "local") {
      return NextResponse.json(
        {
          error: "WRONG_AUTH_PROVIDER",
          message: `This account uses ${user.auth_provider} to sign in`,
        },
        { status: 401 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        {
          error: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

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
    console.log(error);

    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
