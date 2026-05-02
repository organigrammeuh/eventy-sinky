import { getQuestionsBySession } from "@/db/questions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = await params

  if (!sessionId) {
    return NextResponse.json(
      { error: 'sessionId is required' },
      { status: 400 }
    )
  }

  try {
    // call result query for get connection
    const questions = await getQuestionsBySession(sessionId)
    return NextResponse.json(questions)
  } catch (error) {
    console.error('Failed to fetch questions', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
