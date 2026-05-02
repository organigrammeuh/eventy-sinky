import { pool } from "@/lib/db";
import { getQuestions } from "@/types/question";

export async function getQuestionsBySession(
  sessionId: string
): Promise<getQuestions[]> {
  const result = await pool.query(
    `select q.id, q.content, q.name, q.id_session as "sessionId", q.creation_datetime as "createdAt", q.upvotes
    from question q where q.id_session = $1
    order by q.creation_datetime desc`, [sessionId]
  )

  return result.rows
}
