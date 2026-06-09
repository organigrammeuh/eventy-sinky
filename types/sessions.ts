import { Speaker } from "./speakers"

export interface SessionCreation {
    title : string,
    description : string,
    startTime : Date,
    endTime : Date,
    room : string,
    capacity: number
}

export interface Session extends SessionCreation {
    id : string,
    speakers ?: Speaker[]
}