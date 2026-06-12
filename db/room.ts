import { Session } from "@/types/sessions";
import { findEventById } from "./events";
import { findEventSession, findSessionById } from "./session";
import { Room, RoomSessions } from "@/types/room";
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

export const findAllRooms = async () : Promise<Room[]> => {
    const {rows} = await pool.query('select id, name from room');
    return rows as Room[];
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