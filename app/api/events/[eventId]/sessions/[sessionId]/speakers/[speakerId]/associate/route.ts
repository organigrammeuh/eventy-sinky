import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { findSessionById } from "@/db/session";

export async function PATCH(
    _req: NextRequest,
    { params }: { params: Promise<{ eventId: string; sessionId: string; speakerId: string }> }
) {
    const { eventId, sessionId, speakerId } = await params;

    try {
        await findSessionById(sessionId, eventId);

        const speakerCheck = await pool.query(
            `SELECT id FROM speaker WHERE id = $1`,
            [speakerId]
        );
        if (speakerCheck.rowCount === 0) {
            return NextResponse.json(
                { message: "Speaker not found" },
                { status: 404 }
            );
        }

        const alreadyLinked = await pool.query(
            `SELECT 1 FROM session_speaker WHERE id_session = $1 AND id_speaker = $2`,
            [sessionId, speakerId]
        );
        if (alreadyLinked.rowCount && alreadyLinked.rowCount > 0) {
            return NextResponse.json(
                { message: "Speaker already associated to this session" },
                { status: 409 }
            );
        }

        await pool.query(
            `INSERT INTO session_speaker (id_session, id_speaker) VALUES ($1, $2)`,
            [sessionId, speakerId]
        );

        return NextResponse.json(
            { message: "Speaker associated successfully" },
            { status: 200 }
        );

    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { message: "Error when associating speaker", error: err.message },
            { status: 500 }
        );
    }
}