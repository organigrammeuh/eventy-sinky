import { pool } from "@/lib/db";
import { Session, Speaker, SpeakerCreation } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";



async function getSpeakerById(id: string): Promise<Speaker | null> {
    const findSpeakerQuery = `
        SELECT id, full_name, profile_picture_url, biography
        FROM speaker 
        WHERE id = $1
    `;

    const result = await pool.query(findSpeakerQuery, [id]);

    if (result.rows.length === 0) return null;

    const speakerRow = result.rows[0];

    const linksResult = await pool.query(
        `SELECT url FROM link WHERE id_speaker = $1`,
        [id]
    );

    const sessionsResult = await pool.query(
        `SELECT s.id, s.title, s.description,
                s.start_date, s.end_date, s.capacity,
                r.name AS room_name
         FROM session s
         JOIN room r ON s.id_room = r.id
         JOIN session_speaker ss ON ss.id_session = s.id
         WHERE ss.id_speaker = $1`,
        [id]
    );

    return {
        id: speakerRow.id,
        fullName: speakerRow.full_name,
        profilePicture: speakerRow.profile_picture_url,
        bio: speakerRow.biography,
        socialLinks: linksResult.rows.map(l => l.url),
        sessions: sessionsResult.rows.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            startTime: s.start_date,
            endTime: s.end_date,
            capacity: s.capacity,
            room: s.room_name
        }))
    };
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        const speaker = await getSpeakerById(id);

        if (!speaker) {
            return NextResponse.json(
                { error: "Speaker not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(speaker, { status: 200 });
    } catch (error) {
        console.error("ERREUR GET /speakers/:id", error);
        return NextResponse.json(

            { error: "Error when fetching all the speakers" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const toUpdate: SpeakerCreation = await req.json();

    const checkSpeakerQuery = `
        SELECT id, full_name, profile_picture_url, biography
        FROM speaker  
        WHERE id = $1
    `;

    const updateSpeakerQuery = `
        UPDATE speaker
        SET
            full_name = $1,
            profile_picture_url = $2,
            biography = $3
        WHERE id = $4
    `;



    const postLinkQuery = `
        INSERT INTO link (url, id_speaker)
        VALUES ($1, $2)
    `;

    try {
        const checkResult = await pool.query(checkSpeakerQuery, [id]);

        if (checkResult.rows.length === 0) {
            return NextResponse.json(
                { error: "Speaker not found" },
                { status: 404 }
            );
        }

        const existing = checkResult.rows[0];

        await pool.query(updateSpeakerQuery, [
            toUpdate.fullName ?? existing.full_name,
            toUpdate.profilePicture ?? existing.profile_picture_url,
            toUpdate.bio ?? existing.biography,
            id
        ]);


        if (toUpdate.socialLinks != undefined) {
            const deleteLinksQuery = `
                DELETE FROM link WHERE id_speaker = $1
            `;
            await pool.query(deleteLinksQuery, [id]);
            for (const url of toUpdate.socialLinks) {
                await pool.query(postLinkQuery, [url, id]);
            }
            console.log(123)
        }
        const speaker = await getSpeakerById(id);

        return NextResponse.json(speaker, { status: 200 });


    } catch (error) {
        console.error("ERREUR PUT /speakers/:id", error);
        return NextResponse.json(
            { error: "Erreur serveur", message: String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const check = await getSpeakerById(id);

        if (!check) {
            return NextResponse.json(
                { error: "Speaker not found" },
                { status: 404 }
            );
        }


        await pool.query(
            `DELETE FROM session_speaker WHERE id_speaker = $1`,
            [id]
        );

        await pool.query(
            `DELETE FROM link WHERE id_speaker = $1`,
            [id]
        );

        await pool.query(
            `DELETE FROM speaker WHERE id = $1`,
            [id]
        );

        return new NextResponse(null, { status: 204 });

    } catch (error) {

        console.error("ERREUR DELETE /speakers/:id", error);

        return NextResponse.json(
            { error: "Erreur serveur", message: String(error) },
            { status: 500 }
        );
    }
}