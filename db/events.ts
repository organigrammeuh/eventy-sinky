import { Event, EventCreation } from "@/types/events";
import { pool } from "@/lib/db";

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