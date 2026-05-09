import { upvoteQuestion } from "@/db/questions";
import { NextRequest, NextResponse } from "next/server";

// route to upvote question
export async function POST(
  _request: NextRequest,
  props: { params: Promise<{ questionId: string }> }

) {
  const { questionId } = await props.params

  if (!questionId) {
    return NextResponse.json(
      { error: 'questionId is required' },
      { status: 404 }
    )
  }

  try {
    const question = await upvoteQuestion(questionId)

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(question, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

