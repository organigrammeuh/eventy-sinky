import { Session } from "./sessions"

export interface EventCreation {
    title : string,
    description : string,
    startDate : Date,
    endDate : Date,
    location : string
};

export interface EventUpdate {
    title ?: string,
    description ?: string,
    startDate ?: Date,
    endDate ?: Date,
    location ?: string
};

export interface Event extends EventCreation {
    id: string,
    sessions ?: Session[]
}