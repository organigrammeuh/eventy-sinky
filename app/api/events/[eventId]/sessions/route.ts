import {NextRequest, NextResponse} from "next/server";
import { pool } from "@/lib/db";
import {Session, SessionCreation} from "@/types/sessions";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await params;

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
        [eventId]
    );

    return NextResponse.json(result.rows);
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await params;
    const toSave: SessionCreation = await req.json();

    if (!toSave.title || !toSave.startTime || !toSave.endTime) {
        return NextResponse.json(
            { message: "Please provide all the required infos about the session" },
            { status: 400 }
        );
    }

    try {
        let roomId: string | null = null;
        if (toSave.room) {
            const roomResult = await pool.query(
                `SELECT id FROM room WHERE name = $1`,
                [toSave.room]
            );
            if (roomResult.rowCount === 0) {
                return NextResponse.json(
                    { message: "Room not found" },
                    { status: 404 }
                );
            }
            roomId = roomResult.rows[0].id;
        }

        const query = `
            INSERT INTO session
                (title, description, start_date, end_date, capacity, id_event, id_room)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

        const result = await pool.query(query, [
            toSave.title,
            toSave.description ?? null,
            toSave.startTime,
            toSave.endTime,
            toSave.capacity ?? null,
            eventId,
            roomId,
        ]);

        const createdSession: Session = {
            id: result.rows[0].id,
            title: toSave.title,
            description: toSave.description,
            startTime: toSave.startTime,
            endTime: toSave.endTime,
            room: toSave.room,
            capacity: toSave.capacity,
            speakers: [],
        };

        return NextResponse.json(createdSession, { status: 201 });

    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { message: "Error when creating the session", error: err.message },
            { status: 500 }
        );
    }
}