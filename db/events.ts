import { Event, EventCreation } from "@/types/events";
import { pool } from "@/lib/db";
import { findEventSession } from "./session";

export const createEvent = async (
    toSave : EventCreation
) : Promise<Event> => {

    const query = `
        INSERT INTO event
        (title, description, start_date, end_date, place)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
    `;

    const queryResult = await pool.query(
        query, [
            toSave.title,
            toSave.description,
            toSave.startDate,
            toSave.endDate,
            toSave.location
        ]
    );

    const createdEventId : string = queryResult.rows[0].id;

    return  {
        description: toSave.description,
        endDate: toSave.endDate,
        startDate: toSave.startDate,
        id: createdEventId,
        location: toSave.location,
        title: toSave.title
    } as Event;

}

export const findAllEvent = async() : Promise<Event[]> => {
    const findEventsQuery = `
        select id from event
    `;

    const events : Event[] = [];

    const {rows} = await pool.query(findEventsQuery);

    for(const row of rows){
        const event = await findEventById(row.id);
        events.push(event);
    }

    return events;
}

export const findEventById = async(
    eventId : string
) : Promise<Event> => {

    const findEventQuery = `
        SELECT 
            id, title, description, start_date, end_date, place
        FROM event
        WHERE id = $1
    `;

    const {rows} = await pool.query(
        findEventQuery,
        [eventId]
    );

    const event : Event = {
        id: rows[0].id,
        title: rows[0].title,
        description : rows[0].description,
        startDate: rows[0].start_date,
        endDate : rows[0].end_date,
        location: rows[0].place
    };

    event.sessions = await findEventSession(eventId);

    return event;

}