import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
}
