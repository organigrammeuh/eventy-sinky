import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const sessionRes = await pool.query(
    `SELECT
             s.id,
             s.title,
             s.description,
             s.start_date,
             s.end_date,
             s.capacity,
             s.id_event,
             s.id_room,
             r.name AS room_name
         FROM session s
                  JOIN room r ON r.id = s.id_room
         WHERE s.id = $1`,
    [sessionId]
  );

  if (sessionRes.rowCount === 0) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const speakersRes = await pool.query(
    `SELECT
             sp.id,
             sp.full_name,
             sp.profile_picture_url,
             sp.biography
         FROM speaker sp
                  JOIN session_speaker ss ON ss.id_speaker = sp.id
         WHERE ss.id_session = $1`,
    [sessionId]
  );

  const questionsRes = await pool.query(
    `SELECT
             q.id,
             q.content,
             q.name,
             q.upvotes,
             q.creation_datetime,
             q.id_session
         FROM question q
         WHERE q.id_session = $1
         ORDER BY q.upvotes DESC`,
    [sessionId]
  );

  const session = sessionRes.rows[0];
  const now = new Date();

  return NextResponse.json({
    ...session,
    isLive: now >= new Date(session.start_date) && now <= new Date(session.end_date),
    speakers: speakersRes.rows,
    questions: questionsRes.rows,
  });
}
