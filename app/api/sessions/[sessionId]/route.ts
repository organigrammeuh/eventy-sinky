import { NextRequest, NextResponse } from "next/server";
import { findSessionById } from "@/db/session";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const session = await findSessionById(sessionId);

  return NextResponse.json(session)
}
