import { Session } from "./sessions"

export interface RoomCreation {
    name : string
    idLocation: string
};

export interface Room {
    id : string
    name: string
    idLocation: string
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
    idLocation?: string
}