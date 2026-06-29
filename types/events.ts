import { Session } from "./sessions"
import { Location } from "./location"

export interface EventCreation {
    title : string,
    description : string,
    startDate : Date,
    endDate : Date,
    idLocation : string
};

export interface EventUpdate {
    title ?: string,
    description ?: string,
    startDate ?: Date,
    endDate ?: Date,
    idLocation ?: string
};

export interface Event {
    id: string,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    idLocation: string,
    location?: Location,
    sessions ?: Session[]
}

export interface EventPagination {
    events : Event[],
    total : number
}

export interface EventFiltering {
    title ?: string,
    idLocation ?: string,
    start_date ?: string,
    end_date ?: string
}