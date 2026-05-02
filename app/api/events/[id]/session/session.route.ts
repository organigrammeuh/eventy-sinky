import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const result = await pool.query(
        `SELECT s.id,
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
     WHERE s.id_event = $1
     ORDER BY s.start_date ASC`,
        [id]
    );

    return NextResponse.json(result.rows);
}