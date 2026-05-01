import { pool } from "@/lib/db";
import { Session, Speaker } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const findSpeakerQuery = `
        SELECT
            id, full_name, profile_picture_url, biography
        FROM speaker 
        WHERE id = $1
    `;

    console.log("id recu:" + id)


    const findSpeakerLinksQuery = `
    SELECT 
            url
        FROM link
        WHERE id_speaker = $1
    `;

    const findSessionQuery = `
        SELECT
            s.id, s.title, s.description,
            s.start_date, s.end_date, s.capacity,
            r.name AS room_name
        FROM session s
        JOIN room r on s.id_room = r.id
        JOIN session_speaker ss
        ON ss.id_session = s.id
        WHERE ss.id_speaker = $1
        `;

    try {
        const findSpeakerResult = await pool.query(findSpeakerQuery, [id]);

        if (findSpeakerResult.rows.length == 0) {
            return NextResponse.json(
                { error: "Speaker not found" },
                { status: 404 }
            )
        }

        const result = findSpeakerResult.rows[0];

        const findSessionResult = await pool.query(
            findSessionQuery, [id]
        );
        const sessions: Session[] = [];

        for (const session of findSessionResult.rows) {
            sessions.push(
                {
                    id: session.id,
                    capacity: session.capacity,
                    description: session.description,
                    endTime: session.end_date,
                    room: session.room_name,
                    startTime: session.start_date,
                    title: session.title
                }
            );
        }

        let links: string[] = [];

        const getSpeakerLinkResult = await pool.query(
            findSpeakerLinksQuery, [id]
        );

        for (const linkRow of getSpeakerLinkResult.rows) {
            links.push(linkRow.url);
        }

        const speaker: Speaker = {
            id: result.id,
            fullName: result.full_name,
            profilePicture: result.profile_picture_url,
            bio: result.biography,
            links: links,
            sessions: sessions
        };
        return NextResponse.json(speaker, { status: 200 })
    } catch (error) {
        console.error("ERREUR GET /speakers/:id", error);
        return NextResponse.json(

            { error: "Error when fetching all the speakers" },
            { status: 500 }
        );
    }
}