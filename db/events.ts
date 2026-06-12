import { Event, EventCreation, EventPagination, EventUpdate } from "@/types/events";
import { pool } from "@/lib/db";
import { findEventSession } from "./session";
import { AppError } from "@/lib/errors/AppError";

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

export const findAllEvent = async(
    range ?: number[],
    sort ?: string[]
) : Promise<EventPagination> => {

    let findEventsQuery = `
        select id from event
    `;

    if(sort){
        findEventsQuery += ` order by ${sort[0]} ${sort[1]}`
    }

    const events : Event[] = [];

    const {rows} = await pool.query(findEventsQuery);

    const toFind = range ? rows.slice(range[0], range[1] + 1) : rows;

    for(const eventId of toFind){
        const event = await findEventById(eventId.id);
        events.push(event);
    }

    return {events, total : rows.length}
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

    if(rows.length == 0){
        throw new AppError(
            `Event with id={${eventId}} not found.`,
            404
        )
    }
    

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

export const updateEvent = async(
    eventId : string,
    udpatedData : EventUpdate
) => {

    let updateQuery = `
        UPDATE event
        SET
    `;

    let updateParams : any[] = [];

    if(udpatedData.description){
        updateQuery += ' description = $1';
        updateParams.push(udpatedData.description);
    }

    if(udpatedData.endDate){
        if(updateParams.length != 0){
            updateQuery += ','
        }
        updateParams.push(udpatedData.endDate);
        updateQuery += ` end_date = $${updateParams.length}`;
    }

    if(udpatedData.startDate){
        if(updateParams.length != 0){
            updateQuery += ','
        }
        updateParams.push(udpatedData.startDate);
        updateQuery += ` start_date = $${updateParams.length}`;
    }

    if(udpatedData.location){
        if(updateParams.length != 0){
            updateQuery += ','
        }
        updateParams.push(udpatedData.location);
        updateQuery += ` place = $${updateParams.length}`;
    }

    if(udpatedData.title){
        if(updateParams.length != 0){
            updateQuery += ','
        }
        updateParams.push(udpatedData.title);
        updateQuery += ` title = $${updateParams.length}`;
    };

    updateParams.push(eventId);
    updateQuery += ` WHERE id = $${updateParams.length}`;

    await pool.query(
        updateQuery, updateParams
    );

    return await findEventById(eventId);
}

export const deleteEvent = async(
    eventId : string
) : Promise<void> => {
    const deleteQuery = 'DELETE FROM event WHERE id = $1';
    await pool.query(deleteQuery, [eventId]);
}