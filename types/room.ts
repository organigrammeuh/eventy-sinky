import { Session } from "./sessions"

export interface RoomCreation {
    name : string
};

export interface Room extends RoomCreation {
    id : string
}

export interface RoomSessions extends Room {
    sessions : Session[]
}

export interface RoomPagination {
    rooms: Room[],
    total: number
}

export interface RoomFiltering {
    name?: string
}