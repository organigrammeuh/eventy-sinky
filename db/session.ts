import { pool } from "@/lib/db";
import { Session, SessionCreation, SessionFiltering, SessionPagination } from "@/types/sessions";
import { findSessionSpeaker } from "./speakers";
import { AppError } from "@/lib/errors/AppError";
import { getQuestionsBySession } from "./questions";

export const findEventSession = async(
    eventId : string
) : Promise<Session[]> => {
    
    const {rows} = await pool.query(
        'select id from session where id_event = $1',
        [eventId]
    );

    const eventSessions : Session[] = [];

    for(const row of rows){
        const session = await findSessionById(row.id);
        eventSessions.push(session);
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
            r.name as room_name, r.id as room_id,
            e.id as event_id, e.title as event_title
        FROM session s
        JOIN room r on s.id_room = r.id
        JOIN event e on s.id_event = e.id
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
        room: {
            id: session.room_id,
            name : session.room_name
        },
        startTime: session.start_date,
        title: session.title,
        event: {
            id: session.event_id,
            title: session.event_title
        }
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

export const findAllSessions = async(
    range?: number[],
    filter?: SessionFiltering
) : Promise<SessionPagination> => {

    const conditions: string[] = [];
    const values: any[] = [];

    if (filter?.title) {
        conditions.push(`title ilike $${values.length + 1}`);
        values.push(`%${filter.title}%`);
    }
    if (filter?.event_id) {
        conditions.push(`id_event = $${values.length + 1}`);
        values.push(filter.event_id);
    }

    //TODO: migration, adding time zone to the start_date and end_date
    if (filter?.start_date) {
        conditions.push(`start_date > $${values.length + 1}`);
        values.push(filter.start_date);
    }
    if (filter?.end_date) {
        conditions.push(`end_date < $${values.length + 1}`);
        values.push(filter.end_date);
    }

    let query = 'select id from session';
    if (conditions.length > 0) {
        query += ` where ${conditions.join(' and ')}`;
    }
    
    console.log(query,values)

    const {rows} = await pool.query(query, values);

    const toFind = range?.length ? rows.slice(range[0], range[1] + 1) : rows;

    const sessions: Session[] = [];
    for (const row of toFind) {
        sessions.push(await findSessionById(row.id));
    }

    return {sessions, total: rows.length};
}