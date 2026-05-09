import { pool } from "@/lib/db";
import { GetQuestion, Question, QuestionCreation } from "@/types/question";

// query to get all questions using sessionId
export async function getQuestionsBySession(
  sessionId: string
): Promise<GetQuestion[]> {
  const result = await pool.query(
    `select q.id, q.content, q.name, q.id_session as "sessionId", q.creation_datetime as "createdAt", q.upvotes
    from question q where q.id_session = $1
    order by q.creation_datetime desc`, [sessionId]
  )

  return result.rows
}

// query to create question by sessionId
export async function createQuestionBySession(
  question: QuestionCreation
): Promise<Question> {
  const result = await pool.query<Question>(
    `insert into question (content, name, id_session, creation_datetime)
    values ($1, $2, $3, $4)
    returning id, content, name, id_session as "sessionId", creation_datetime as "createdAt", upvotes`,
    [question.content, question.name ?? null, question.sessionId, question.createdAt ?? new Date().toISOString()]
  )

  return result.rows[0]
}

// query to upvote question
export async function upvoteQuestion(
  questionId: string
): Promise<Question | null> {
  const upvotedResult = await pool.query<Question>(
    `update question set upvotes = upvotes + 1 where id = $1
returning id, content, name, id_session as "sessionId", creation_datetime as "createdAt", upvotes`,
    [questionId]
  )
  return upvotedResult.rows[0] ?? null
}
