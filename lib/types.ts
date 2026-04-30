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

export interface SpeakerCreation {
    fullName : string,
    profilePicture: string,
    bio : string,
    links ?: string[]
};

export interface Speaker extends SpeakerCreation {
    id : string,
    sessions?: Session[]
}

export interface RoomCreation {
    name : string
};

export interface Room extends RoomCreation {
    id : string
}

export interface RoomSessions extends Room {
    sessions : Session[]
}