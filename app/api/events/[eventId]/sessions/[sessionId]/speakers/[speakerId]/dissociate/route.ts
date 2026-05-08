import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function PATCH(
    _req: NextRequest,
    { params }: { params: Promise<{ eventId: string; sessionId: string; speakerId: string }> }
) {
    const { eventId, sessionId, speakerId } = await params;

    try {
        const sessionCheck = await pool.query(
            `SELECT id FROM session WHERE id = $1 AND id_event = $2`,
            [sessionId, eventId]
        );
        if (sessionCheck.rowCount === 0) {
            return NextResponse.json(
                { message: "Session not found" },
                { status: 404 }
            );
        }

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

        const linked = await pool.query(
            `SELECT 1 FROM session_speaker WHERE id_session = $1 AND id_speaker = $2`,
            [sessionId, speakerId]
        );
        if (!linked.rowCount || linked.rowCount === 0) {
            return NextResponse.json(
                { message: "Speaker not associated to this session" },
                { status: 409 }
            );
        }

        await pool.query(
            `DELETE FROM session_speaker WHERE id_session = $1 AND id_speaker = $2`,
            [sessionId, speakerId]
        );

        return NextResponse.json(
            { message: "Speaker dissociated successfully" },
            { status: 200 }
        );

    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { message: "Error when dissociating speaker", error: err.message },
            { status: 500 }
        );
    }
}