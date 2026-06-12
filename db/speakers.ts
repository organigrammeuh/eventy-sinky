import { pool } from "@/lib/db";
import { AppError } from "@/lib/errors/AppError";
import { Session } from "@/types/sessions";
import { Speaker, SpeakerCreation, SpeakerPagination, SpeakerUpdate } from "@/types/speakers";
import { findSessionById } from "./session";

export const findSessionSpeaker = async (
    sessionId : string
) : Promise<Speaker[]> => {

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


    const findSpeakerResult = await pool.query(
        findSpeakerQuery , [sessionId]
    );
    
    const speakers : Speaker[] = [];

    for(const speaker of findSpeakerResult.rows){
        
        let thisSpeaker : Speaker = {
            id: speaker.id,
            bio: speaker.biography,
            fullName: speaker.full_name,
            profilePicture: speaker.profile_picture_url
        };

        let links : string[] = [];

        const getSpeakerLinkResult = await pool.query(
            findSpeakerLinksQuery , [speaker.id]
        );

        for(const linkRow of getSpeakerLinkResult.rows){
            links.push(linkRow.url);
        }

        thisSpeaker.socialLinks = links;
        
        speakers.push(thisSpeaker);

    }

    return speakers;

}

export const findSpeakerSessions = async(
    speakerId : string,
    eventId ?: string
) : Promise<Session[]> => {
    
    const query = eventId ? `
        select ss.id_session 
        from session_speaker ss
        join session s
        on ss.id_session = s.id
        where ss.id_speaker = $1
        and s.id_event = $2
    ` : `
        select id_session 
        from session_speaker
        where id_speaker = $1
    `;

    const params = eventId ? [speakerId, eventId] : [speakerId];

    const {rows} = await pool.query(query, params);

    const sessions : Session[] = [];

    for(const row of rows) {
        const session = await findSessionById(row.id_session);
        sessions.push(session);
    }

    return sessions;
}

export const findSpeakerById = async(
    speakerId : string
) : Promise<Speaker> => {

    const speakerInfo = await pool.query(
        `SELECT
            id, full_name, profile_picture_url, biography
        FROM speaker
        WHERE  id  = $1` ,[
            speakerId
        ]
    );

    if(speakerInfo.rowCount == 0){
        throw new AppError(
            `Speaker with id={${speakerId}} not found`,
            404
        );
    }

    const speakerUrls = await pool.query(
       `
        SELECT 
                url
            FROM link
            WHERE id_speaker = $1
        ` , [
            speakerId
        ]
    );

    const urls : string[] = speakerUrls.rows.map(row => row.url);
    const sessions = await findSpeakerSessions(speakerId);

    return {
        id : speakerInfo.rows[0].id,
        fullName : speakerInfo.rows[0].full_name,
        profilePicture: speakerInfo.rows[0].profile_picture_url,
        bio: speakerInfo.rows[0].biography,
        socialLinks : urls,
        sessions : sessions
    }

}

export const updateSpeaker = async(
    speakerId : string,
    updateData : SpeakerUpdate
) : Promise<Speaker> => {

    let query = 'update speaker set';
    let params : string[] = [];

    if(updateData.bio){
        params.push(updateData.bio);
        query += ` biography = ${params.length}`
    }

    if(updateData.fullName){
        params.push(updateData.fullName);
        query += ` full_name = ${params.length}`
    }

    if(updateData.profilePicture){
        params.push(updateData.profilePicture);
        query += ` profile_picture_url = ${params.length}`
    }

    params.push(speakerId);
    query += ' where id = ' + params.length;

    await pool.query(query, params);

    return await findSpeakerById(speakerId);

}

export const findAllSpeaker = async(
    range?: number[]
) : Promise<SpeakerPagination> => {
    const {rows} = await pool.query('select id from speaker');

    const toFind = range?.length ? rows.slice(range[0], range[1] + 1) : rows;

    const speakers: Speaker[] = [];
    for (const row of toFind) {
        speakers.push(await findSpeakerById(row.id));
    }

    return {speakers, total: rows.length};
}

export const createSpeaker = async(
    speaker : SpeakerCreation
) : Promise<Speaker> => {

    const creatingSpeakerInfo = await pool.query(
        `INSERT INTO speaker (full_name, profile_picture_url, biography)
        VALUES ($1, $2, $3)
        RETURNING id`, [
            speaker.fullName,
            speaker.profilePicture ?? '',
            speaker.bio ?? ''
        ]
    );

    if(speaker.socialLinks ) {
        for (const link of speaker.socialLinks) {
            await pool.query(
                `
                INSERT INTO link (url, id_speaker)
                VALUES ($1, $2)
                ` ,[
                    link,
                    creatingSpeakerInfo.rows[0].id
                ]
            )
        }
    }

    return await findSpeakerById(creatingSpeakerInfo.rows[0].id);
}

export const associateSpeakerToSession = async(
    sessionId: string,
    speakerId: string,
    eventId: string
) : Promise<void> => {
    await findSessionById(sessionId, eventId);

    const speakerResult = await pool.query(
        `SELECT id FROM speaker WHERE id = $1`,
        [speakerId]
    );

    if (speakerResult.rowCount === 0) {
        throw new AppError(
            `Speaker with id={${speakerId}} not found`,
            404
        );
    }

    const existingLink = await pool.query(
        `SELECT id_session FROM session_speaker WHERE id_session = $1 AND id_speaker = $2`,
        [sessionId, speakerId]
    );

    if (existingLink.rowCount && existingLink.rowCount > 0) {
        throw new AppError(
            "Speaker already associated to this session",
            409
        );
    }

    await pool.query(
        `INSERT INTO session_speaker (id_session, id_speaker) VALUES ($1, $2)`,
        [sessionId, speakerId]
    );
};

export const dissociateSpeakerFromSession = async(
    sessionId: string,
    speakerId: string,
    eventId: string
) : Promise<void> => {
    await findSessionById(sessionId, eventId);

    const speakerResult = await pool.query(
        `SELECT id FROM speaker WHERE id = $1`,
        [speakerId]
    );

    if (speakerResult.rowCount === 0) {
        throw new AppError(
            `Speaker with id={${speakerId}} not found`,
            404
        );
    }

    const existingLink = await pool.query(
        `SELECT id_session FROM session_speaker WHERE id_session = $1 AND id_speaker = $2`,
        [sessionId, speakerId]
    );

    if (!existingLink.rowCount || existingLink.rowCount === 0) {
        throw new AppError(
            "Speaker not associated to this session",
            409
        );
    }

    await pool.query(
        `DELETE FROM session_speaker WHERE id_session = $1 AND id_speaker = $2`,
        [sessionId, speakerId]
    );
};

export const deleteSpeaker = async(
    speakerId : string
) : Promise<void> => {
    
    await Promise.all([
        
        await pool.query(
            `DELETE FROM session_speaker WHERE id_speaker = $1`,
            [speakerId]
        ),

        await pool.query(
            `DELETE FROM link WHERE id_speaker = $1`,
            [speakerId]
        ),

        await pool.query(
            `DELETE FROM speaker WHERE id = $1`,
            [speakerId]
        )

    ]);


}