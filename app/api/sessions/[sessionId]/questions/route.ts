import { createQuestionBySession, getQuestionsBySession } from "@/db/questions";
import { QuestionCreation } from "@/types/question";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await props.params

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

// route to post a question
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await props.params

  if (!sessionId) {
    return NextResponse.json(
      { error: 'sessionId is required' },
      { status: 400 }
    )
  }

  try {
    const body = await request.json() as QuestionCreation
    const createQuestion = await createQuestionBySession({
      ...body, sessionId
    });
    return NextResponse.json(createQuestion, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }

}
