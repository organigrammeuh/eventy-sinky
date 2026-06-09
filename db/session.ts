import { pool } from "@/lib/db";
import { Session } from "@/types/sessions";
import { findSessionSpeaker } from "./speakers";

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