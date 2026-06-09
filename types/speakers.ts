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