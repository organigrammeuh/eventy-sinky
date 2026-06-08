import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { refreshSchema } from "@/lib/validators/auth";
import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = refreshSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Invalid request body",
        },
        { status: 400 },
      );
    }

    const { refreshToken } = result.data;
    let payload: JwtPayload;

    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as jwt.JwtPayload;
    } catch {
      return NextResponse.json(
        {
          error: "INVALID_REFRESH_TOKEN",
          message: "Refresh token invalid or expired",
        },
        { status: 401 },
      );
    }

    const accessToken = generateAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      role: payload.role,
    });

    return NextResponse.json(
      {
        accessToken,
        refreshToken: newRefreshToken,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
