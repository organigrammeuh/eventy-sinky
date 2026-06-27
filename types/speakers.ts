import { Session } from "./sessions"

export interface SpeakerCreation {
    fullName : string,
    profilePicture: string,
    bio : string,
    socialLinks ?: string[]
};

export interface Speaker extends SpeakerCreation {
    id : string,
    sessions?: Session[]
}

export interface SpeakerUpdate {
    fullName ?: string,
    profilePicture ?: string,
    bio ?: string,
};

export interface SpeakerFiltering {
    full_name?: string
}

export interface SpeakerPagination {
    speakers: Speaker[],
    total: number
};