import { pool } from "@/lib/db";
import { Session, SessionCreation } from "@/types/sessions";
import { findSessionSpeaker } from "./speakers";
import { AppError } from "@/lib/errors/AppError";
import { getQuestionsBySession } from "./questions";

export const findEventSession = async(
    eventId : string
) : Promise<Session[]> => {
    const findSessionQuery = `
        SELECT
            s.id, s.title, s.description,
            s.start_date, s.end_date, s.capacity,
            r.name
        FROM session s
        JOIN room r on s.id_room = r.id
        WHERE
            id_event = $1
    `;

    let eventSessions : Session[] = [];

    const findSessionResult = await pool.query(
        findSessionQuery, [eventId]
    );

    for(const session of findSessionResult.rows){
        let fetchedSession : Session = {
            id: session.id,
            capacity: session.capacity,
            description: session.description,
            endTime: session.end_date,
            room: session.name,
            startTime: session.start_date,
            title: session.title
        };

        fetchedSession.speakers = await findSessionSpeaker(session.id);

        eventSessions.push(fetchedSession)
    }

    return eventSessions;
}

export const findSessionById = async(
    sessionId : string,
    eventId ?: string
) : Promise<Session> => {

    let findSessionQuery = `
        SELECT
            s.id, s.title, s.description,
            s.start_date, s.end_date, s.capacity,
            r.name
        FROM session s
        JOIN room r on s.id_room = r.id
        WHERE
            s.id = $1
    `;

    if(eventId){
        findSessionQuery += 'AND s.id_event = $2'
    }

    const params = eventId ? [sessionId, eventId] : [sessionId];

    const {rows} = await pool.query(
        findSessionQuery, params
    );

    if(rows.length == 0){
        throw new AppError(
            `Session with id={${sessionId}} not found.`,
            404
        );
    }

    const session = rows[0];

    let fetchedSession : Session = {
        id: session.id,
        capacity: session.capacity,
        description: session.description,
        endTime: session.end_date,
        room: session.name,
        startTime: session.start_date,
        title: session.title
    };

    fetchedSession.speakers = await findSessionSpeaker(session.id);
    fetchedSession.questions = await getQuestionsBySession(sessionId);

    const now = new Date();
    fetchedSession.isLive = now >= new Date(fetchedSession.startTime) && now <= new Date(fetchedSession.endTime);

    return fetchedSession;
}

export const createEventSession = async(
    eventId : string,
    toSave : SessionCreation
) : Promise<Session> => {

    let roomId: string | null = null;

    if (toSave.room) {
        const roomResult = await pool.query(
            `SELECT id FROM room WHERE name = $1`,
            [toSave.room]
        );
        if (roomResult.rowCount === 0) {
            throw new AppError(
                `Room ${toSave.room} not found`,
                404
            );
        }
        roomId = roomResult.rows[0].id;
    }

    const query = `
        INSERT INTO session
            (title, description, start_date, 
            end_date, capacity, id_event, id_room)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
    `;

    const {rows} = await pool.query(query, [
        toSave.title,
        toSave.description ?? null,
        toSave.startTime,
        toSave.endTime,
        toSave.capacity ?? null,
        eventId,
        roomId,
    ]);

    const sessionId = rows[0].id;

    return await findSessionById(sessionId, eventId);


}

export const updateSession = async (
    sessionId : string,
    eventId : string,
    toUpdate: Partial<SessionCreation>
) : Promise<Session> => {

    let roomId: string | undefined;
            
    if (toUpdate.room) {

        const roomResult = await pool.query(
            `SELECT id FROM room WHERE name = $1`,
            [toUpdate.room]
        );

        if (roomResult.rowCount === 0) {
            throw new AppError(
                `Room ${toUpdate.room} not found`,
                404
            )
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
            id
    `;

    const {rows} = await pool.query(updateQuery, [
        toUpdate.title ?? null,
        toUpdate.description ?? null,
        toUpdate.startTime ?? null,
        toUpdate.endTime ?? null,
        toUpdate.capacity ?? null,
        roomId ?? null,
        sessionId,
        eventId,
    ]);

    return await findSessionById(
        rows[0].id,
        eventId
    );

}