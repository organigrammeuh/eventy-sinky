import { Event, EventCreation, EventFiltering, EventPagination, EventUpdate } from "@/types/events";
import { pool } from "@/lib/db";
import { deleteSession, findEventSession } from "./session";
import { AppError } from "@/lib/errors/AppError";
import { Session } from "@/types/sessions";
import { findLocationById } from "./location";

export const createEvent = async (
    toSave : EventCreation
) : Promise<Event> => {

    const query = `
        INSERT INTO event
        (title, description, start_date, end_date, id_location)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
    `;

    const queryResult = await pool.query(
        query, [
            toSave.title,
            toSave.description,
            toSave.startDate,
            toSave.endDate,
            toSave.idLocation
        ]
    );

    const createdEventId : string = queryResult.rows[0].id;

    return  {
        description: toSave.description,
        endDate: toSave.endDate,
        startDate: toSave.startDate,
        id: createdEventId,
        idLocation: toSave.idLocation,
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
        if (filter.idLocation) {
            conditions.push(`e.id_location = $${values.length + 1}`);
            values.push(filter.idLocation);
        }
        if (filter.end_date) {
            conditions.push(`e.end_date < $${values.length + 1}`);
            values.push(filter.end_date);
        }
        if (filter.start_date) {
            conditions.push(`e.start_date > $${values.length + 1}`);
            values.push(filter.start_date);
        }
        if (filter.title) {
            conditions.push(`e.title ilike $${values.length + 1}`);
            values.push(`%${filter.title}%`);
        }
    }

    let findEventsQuery = `select e.id from event e`;

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
            e.id, e.title, e.description, e.start_date, e.end_date, e.id_location,
            l.id as loc_id, l.name as loc_name, l.country as loc_country, l.city as loc_city
        FROM event e
        LEFT JOIN location l ON e.id_location = l.id
        WHERE e.id = $1
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
        idLocation: rows[0].id_location,
        location: rows[0].loc_id ? {
            id: rows[0].loc_id,
            name: rows[0].loc_name,
            country: rows[0].loc_country,
            city: rows[0].loc_city,
        } : undefined,
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

    if(udpatedData.idLocation){
        if(updateParams.length != 0){
            updateQuery += ','
        }
        updateParams.push(udpatedData.idLocation);
        updateQuery += ` id_location = $${updateParams.length}`;
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
    const sessions : Session[] = await findEventSession(eventId);
    for(const session of sessions){
        await deleteSession(session.id);
    }
    const deleteQuery = 'DELETE FROM event WHERE id = $1';
    await pool.query(deleteQuery, [eventId]);
}