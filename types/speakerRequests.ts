export type SpeakerRequestStatus = 'pending' | 'approved' | 'rejected';

export type SpeakerRequestLink = {
    id: string;
    url: string;
    type: string | null;
    id_speaker_request: string;
};

export type SpeakerRequestLinkInput = {
    url: string;
    type?: string | null;
};

export type SpeakerRequest = {
    id: string;
    full_name: string;
    biography: string | null;
    profile_picture_url: string | null;
    status: SpeakerRequestStatus;
    created_at: string;
    links: SpeakerRequestLink[];
};

export type SpeakerRequestCreation = {
    fullName: string;
    biography?: string | null;
    profilePictureUrl?: string | null;
    links?: SpeakerRequestLinkInput[];
};

export type SpeakerRequestFiltering = {
    status?: SpeakerRequestStatus;
    full_name?: string;
};

export type SpeakerRequestPagination = {
    speakerRequests: SpeakerRequest[];
    total: number;
};