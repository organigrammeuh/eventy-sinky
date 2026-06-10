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

    const rooms: Set<Room> = new Set();

    for(const sess of eventSessions){
        rooms.add(sess.room);
    }

    const sessionPerRoom : RoomSessions[] = []

    for(const room of rooms){

        const roomSessions = [];

        for(const session of eventSessions){
            if(session.room.id == room.id){
                roomSessions.push(session);
            }
        }

        sessionPerRoom.push({
            id: room.id,
            name: room.name,
            sessions : roomSessions
        });
    }

    return sessionPerRoom;
}

export const findRoomById = async(
    roomId : string
): Promise<Room> => {
    const {rows} = await pool.query(
        'select id, name from room where id = $1',
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

export const findSessionsByRoomId = async(
    roomId : string
) => {

    const {rows} = await pool.query(
        `SELECT
                s.id,
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