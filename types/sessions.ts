import { GetQuestion } from "./question"
import { Room } from "./room"
import { Speaker } from "./speakers"

export interface SessionCreation {
    title : string,
    description : string,
    startTime : Date,
    endTime : Date,
    room : Room,
    capacity: number,
    id_room?: string,
}

export interface Session extends SessionCreation {
    id : string,
    eventId ?: string,
    speakers ?: Speaker[],
    questions ?: GetQuestion[],
    isLive ?: boolean,
    event?: { id: string, title: string }
}

export interface SessionPagination {
    sessions: Session[],
    total: number
}

export interface SessionFiltering {
    title?: string,
    event_id?: string,
    start_date?: string,
    end_date?: string
}

export interface SessionSorting {
    title: string
    start_date: string
    end_date: string
    event_title: string
}