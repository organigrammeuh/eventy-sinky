import { Session } from "@/types/sessions";
import { findEventById } from "./events";
import { findEventSession, findSessionById } from "./session";
import { Room, RoomFiltering, RoomPagination, RoomSessions } from "@/types/room";
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
        sessions,
    }));
};

export const findRoomById = async (roomId: string): Promise<Room> => {
    const { rows } = await pool.query(
        "SELECT id, name FROM room WHERE id = $1",
        [roomId]
    );

    if(rows.length == 0){
        throw new AppError(
            `Room with id={${roomId}} not found.`,
            404
        );
    }

    return rows[0] as Room;
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
        conditions.push(`name ilike $${values.length + 1}`);
        values.push(`%${filter.name}%`);
    }

    let query = 'select id from room';
    if (conditions.length > 0) {
        query += ` where ${conditions.join(' and ')}`;
    }

    const allowedDirections = ['asc', 'desc', 'ASC', 'DESC'];
    if (sort && sort.length > 0 && allowedDirections.includes(sort[1])) {
        query += ` order by ${sort[0]} ${sort[1]}`;
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
    name : string
) : Promise<Room> => {

    const {rows} = await pool.query(
        `INSERT INTO room
            (name)
        VALUES ($1)
        RETURNING id;`, [
            name
        ]
    );

    return {
        id : rows[0].id,
        name : name
    };
}

export const updateRoom = async (roomId: string, name: string): Promise<Room> => {
    const { rows } = await pool.query(
        'UPDATE room SET name = $1 WHERE id = $2 RETURNING id, name',
        [name, roomId]
    );
    if (rows.length === 0) {
        throw new AppError(`Room with id={${roomId}} not found.`, 404);
    }
    return rows[0] as Room;
};

export const deleteRoom = async (roomId: string): Promise<void> => {
    const { rowCount } = await pool.query('DELETE FROM room WHERE id = $1', [roomId]);
    if (rowCount === 0) {
        throw new AppError(`Room with id={${roomId}} not found.`, 404);
    }
};