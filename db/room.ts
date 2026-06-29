import { Session } from "@/types/sessions";
import { findEventById } from "./events";
import { findEventSession, findSessionById } from "./session";
import { Room, RoomCreation, RoomFiltering, RoomPagination, RoomSessions } from "@/types/room";
import { pool } from "@/lib/db";
import { AppError } from "@/lib/errors/AppError";

export const findSessionByRoom = async(
    eventId : string
): Promise<RoomSessions[]> => {

    await findEventById(eventId);
            
    const eventSessions :  Session[] = await findEventSession(eventId);

    const roomMap = new Map<string, { room: Room; sessions: Session[] }>();

    for (const sess of eventSessions) {
        const key = sess.room.id;
        if (!roomMap.has(key)) {
            roomMap.set(key, { room: sess.room, sessions: [] });
        }
        roomMap.get(key)!.sessions.push(sess);
    }

    return Array.from(roomMap.values()).map(({ room, sessions }) => ({
        id: room.id,
        name: room.name,
        idLocation: room.idLocation,
        sessions,
    }));
};

export const findRoomById = async (roomId: string): Promise<Room> => {
    const { rows } = await pool.query(
        "SELECT id, name, id_location FROM room WHERE id = $1",
        [roomId]
    );

    if(rows.length == 0){
        throw new AppError(
            `Room with id={${roomId}} not found.`,
            404
        );
    }

    return {
        id: rows[0].id,
        name: rows[0].name,
        idLocation: rows[0].id_location,
    };
}

export const findSessionsByRoomId = async (roomId: string): Promise<Session[]> => {
    const {rows} = await pool.query(
        `SELECT
                s.id
            FROM session s
            WHERE s.id_room = $1
            ORDER BY s.start_date ASC`,
        [roomId]
    );

    const sessions : Session[] = [];

    for(const row of rows){
        const session = await findSessionById(row.id);
        sessions.push(session);
    }

    return sessions;

}

export const findAllRooms = async (
    range?: number[],
    filter?: RoomFiltering,
    sort?: string[]
): Promise<RoomPagination> => {
    const conditions: string[] = [];
    const values: any[] = [];

    if (filter?.name) {
        conditions.push(`r.name ilike $${values.length + 1}`);
        values.push(`%${filter.name}%`);
    }
    if (filter?.idLocation) {
        conditions.push(`r.id_location = $${values.length + 1}`);
        values.push(filter.idLocation);
    }

    let query = 'SELECT r.id FROM room r';
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const allowedDirections = ['asc', 'desc', 'ASC', 'DESC'];
    if (sort && sort.length > 0 && allowedDirections.includes(sort[1])) {
        query += ` ORDER BY ${sort[0]} ${sort[1]}`;
    }

    const { rows } = await pool.query(query, values);
    const toFind = range?.length ? rows.slice(range[0], range[1] + 1) : rows;

    const rooms: Room[] = [];
    for (const row of toFind) {
        const room = await findRoomById(row.id);
        rooms.push(room);
    }

    return { rooms, total: rows.length };
}

export const createRoom = async(
    name : string,
    idLocation: string
) : Promise<Room> => {

    const {rows} = await pool.query(
        `INSERT INTO room
            (name, id_location)
        VALUES ($1, $2)
        RETURNING id;`, [
            name,
            idLocation
        ]
    );

    return {
        id : rows[0].id,
        name : name,
        idLocation,
    };
}

export const updateRoom = async (roomId: string, name: string, idLocation?: string): Promise<Room> => {
    const { rows } = await pool.query(
        'UPDATE room SET name = $1, id_location = COALESCE($2, id_location) WHERE id = $3 RETURNING id, name, id_location',
        [name, idLocation ?? null, roomId]
    );
    if (rows.length === 0) {
        throw new AppError(`Room with id={${roomId}} not found.`, 404);
    }
    return {
        id: rows[0].id,
        name: rows[0].name,
        idLocation: rows[0].id_location,
    };
};

export const deleteRoom = async (roomId: string): Promise<void> => {
    const { rowCount } = await pool.query('DELETE FROM room WHERE id = $1', [roomId]);
    if (rowCount === 0) {
        throw new AppError(`Room with id={${roomId}} not found.`, 404);
    }
};

export const getRoomLocationId = async (roomId: string): Promise<string> => {
    const { rows } = await pool.query(
        "SELECT id_location FROM room WHERE id = $1",
        [roomId]
    );
    if (rows.length === 0) {
        throw new AppError(`Room with id={${roomId}} not found.`, 404);
    }
    return rows[0].id_location;
};
