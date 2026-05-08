export interface Speaker {
    id: string;
    fullName: string;
    profilePicture?: string;
}

export interface Session {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    room: string;
    capacity?: number;
    speakers: Speaker[];
    isLive?: boolean;
}
