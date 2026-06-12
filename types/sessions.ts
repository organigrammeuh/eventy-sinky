import { GetQuestion } from "./question"
import { Room } from "./room"
import { Speaker } from "./speakers"

export interface SessionCreation {
    title : string,
    description : string,
    startTime : Date,
    endTime : Date,
    room : Room,
    capacity: number
}

export interface Session extends SessionCreation {
    id : string,
    eventId ?: string,
    speakers ?: Speaker[],
    questions ?: GetQuestion[],
    isLive ?: boolean
}