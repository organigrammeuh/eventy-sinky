import { Event, EventCreation, EventFiltering, EventPagination, EventUpdate } from "@/types/events";
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
    sort ?: string[],
    filter ?: EventFiltering
) : Promise<EventPagination> => {

    const conditions: string[] = [];
    const values: any[] = [];

    if (filter) {
        if (filter.location) {
            conditions.push(`place ilike $${values.length + 1}`);
            values.push(`%${filter.location}%`);
        }
        if (filter.end_date) {
            conditions.push(`end_date < $${values.length + 1}`);
            values.push(filter.end_date);
        }
        if (filter.start_date) {
            conditions.push(`start_date > $${values.length + 1}`);
            values.push(filter.start_date);
        }
        if (filter.title) {
            conditions.push(`title ilike $${values.length + 1}`);
            values.push(`%${filter.title}%`);
        }
    }

    let findEventsQuery = `select id from event`;

    if (conditions.length > 0) {
        findEventsQuery += ` where ${conditions.join(' and ')}`;
    }

    const allowedDirections = ['asc', 'desc', 'ASC', 'DESC'];
    if (sort && sort.length > 0 && allowedDirections.includes(sort[1])) {
        findEventsQuery += ` order by ${sort[0]} ${sort[1]}`;
    }

    const {rows} = await pool.query(findEventsQuery, values);

    const toFind = range?.length ? rows.slice(range[0], range[1] + 1) : rows;

    const events: Event[] = [];
    for (const row of toFind) {
        events.push(await findEventById(row.id));
    }

    return {events, total: rows.length};
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