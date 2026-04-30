import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: { roomId: string } }
) {
    const { roomId } = params;

    const result = await pool.query(
        `SELECT
             s.id,
             s.title,
             s.description,
             s.start_date,
             s.end_date,
             s.capacity,
             s.id_event,
             s.id_room
         FROM session s
         WHERE s.id_room = $1
         ORDER BY s.start_date ASC`,
        [roomId]
    );

    const now = new Date();

    const sessions = result.rows.map((s: { start_date: string | number | Date; end_date: string | number | Date; }) => ({
        ...s,
        isLive: now >= new Date(s.start_date) && now <= new Date(s.end_date)
    }));

    return NextResponse.json(sessions);
}