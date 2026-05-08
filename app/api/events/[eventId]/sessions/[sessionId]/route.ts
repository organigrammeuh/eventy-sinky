import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { SessionCreation, Session } from "@/lib/types";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string; sessionId: string }> }
) {
    const { eventId, sessionId } = await params;
    const toUpdate: Partial<SessionCreation> = await req.json();

    try {
        const checkResult = await pool.query(
            `SELECT id FROM session WHERE id = $1 AND id_event = $2`,
            [sessionId, eventId]
        );
        if (checkResult.rowCount === 0) {
            return NextResponse.json(
                { message: "Session not found" },
                { status: 404 }
            );
        }

        let roomId: string | undefined;
        if (toUpdate.room) {
            const roomResult = await pool.query(
                `SELECT id FROM room WHERE name = $1`,
                [toUpdate.room]
            );
            if (roomResult.rowCount === 0) {
                return NextResponse.json(
                    { message: "Room not found" },
                    { status: 404 }
                );
            }
            roomId = roomResult.rows[0].id;
        }

        const updateQuery = `
            UPDATE session
            SET
                title       = COALESCE($1, title),
                description = COALESCE($2, description),
                start_date  = COALESCE($3, start_date),
                end_date    = COALESCE($4, end_date),
                capacity    = COALESCE($5, capacity),
                id_room     = COALESCE($6, id_room)
            WHERE id = $7 AND id_event = $8
            RETURNING
                id, title, description, start_date, end_date,
                capacity, id_event, id_room
        `;

        const result = await pool.query(updateQuery, [
            toUpdate.title ?? null,
            toUpdate.description ?? null,
            toUpdate.startTime ?? null,
            toUpdate.endTime ?? null,
            toUpdate.capacity ?? null,
            roomId ?? null,
            sessionId,
            eventId,
        ]);

        const updated = result.rows[0];

        const session: Session = {
            id: updated.id,
            title: updated.title,
            description: updated.description,
            startTime: updated.start_date,
            endTime: updated.end_date,
            capacity: updated.capacity,
            room: toUpdate.room,
        };

        return NextResponse.json(session, { status: 200 });

    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { message: "Error when updating the session", error: err.message },
            { status: 500 }
        );
    }
}