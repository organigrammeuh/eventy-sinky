import { pool } from "@/lib/db";
import { Session, Speaker } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {

    let speakers: Speaker[] = [];

    const findSpeakerQuery = `
        SELECT
            id, full_name, profile_picture_url, biography
        FROM speaker 
    `;

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
        const findSpeakerResult = await pool.query(findSpeakerQuery);

        for (const row of findSpeakerResult.rows) {

            const findSessionResult = await pool.query(
                findSessionQuery, [row.id]
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
                findSpeakerLinksQuery, [row.id]
            );

            for (const linkRow of getSpeakerLinkResult.rows) {
                links.push(linkRow.url);
            }

            speakers.push({
                id: row.id,
                fullName: row.full_name,
                profilePicture: row.profile_picture_url,
                bio: row.profile_picture_url,
                links: links,
                sessions: sessions
            });
        }
        return NextResponse.json(speakers, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "Error when fetching all the speakers" },
            { status: 500 }
        );
    }
}