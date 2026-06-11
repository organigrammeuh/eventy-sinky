import { pool } from "@/lib/db";
import { Speaker, Session } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
    const sessions: Session[] = [];

    const findSessionQuery = `
        SELECT
            s.id, s.title, s.description,
            s.start_date, s.end_date, s.capacity,
            r.name as room_name
        FROM session s
        JOIN room r on s.id_room = r.id
    `;

    const findSpeakerQuery = `
        SELECT
            id, full_name, profile_picture_url, biography
        FROM speaker s
        JOIN session_speaker ss
            ON ss.id_speaker = s.id
        WHERE ss.id_session = $1
    `;

    const findSpeakerLinksQuery = `
        SELECT 
            url
        FROM link
        WHERE id_speaker = $1
    `;

    try {

        const findSessionResult = await pool.query(findSessionQuery);


        for (const row of findSessionResult.rows) {

            let session: Session = {
                id: row.id,
                description: row.description,
                startTime: row.start_date,
                endTime: row.end_date,
                capacity: row.capacity,
                room: row.room_name,
                title: row.title,
                speakers: []
            };

            const findSpeakerResult = await pool.query(findSpeakerQuery, [session.id]);

            for (const speakerRow of findSpeakerResult.rows) {

                let speaker: Speaker = {
                    id: speakerRow.id,
                    fullName: speakerRow.full_name,
                    profilePicture: speakerRow.profile_picture_url || undefined,
                    bio: speakerRow.biography || undefined,
                    socialLinks: []
                };

                const findSpeakerLinksResult = await pool.query(findSpeakerLinksQuery, [speaker.id]);

                speaker.socialLinks = findSpeakerLinksResult.rows.map(linkRow => linkRow.url);

                session.speakers?.push(speaker);
            }

            sessions.push(session);
        }

        return NextResponse.json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}