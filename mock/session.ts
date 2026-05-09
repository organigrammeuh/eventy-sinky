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

const D = "2026-05-09";

export const MOCK_SESSIONS: Session[] = [
    {
        id: "s1",
        title: "Opening Keynote — The Future of Tech",
        description: "Opening presentation of the Tech Madagascar conference.",
        startTime: `${D}T09:00:00`,
        endTime: `${D}T10:00:00`,
        room: "Room A",
        capacity: 300,
        speakers: [{ id: "sp1", fullName: "Aina Rakoto" }, { id: "sp2", fullName: "Marie Dupont" }],
        isLive: false,
    },
    {
        id: "s2",
        title: "Generative AI — Real-World Use Cases",
        description: "Discover how generative AI is transforming industries.",
        startTime: `${D}T10:15:00`,
        endTime: `${D}T11:15:00`,
        room: "Room A",
        capacity: 200,
        speakers: [{ id: "sp4", fullName: "Sophie Martin" }],
        isLive: true,
    },
    {
        id: "s3",
        title: "Workshop — Intro to Next.js 15",
        description: "Hands-on workshop on the latest Next.js features.",
        startTime: `${D}T09:00:00`,
        endTime: `${D}T10:30:00`,
        room: "Room B",
        capacity: 50,
        speakers: [{ id: "sp3", fullName: "Jean Rakotoarisoa" }],
        isLive: false,
    },
    {
        id: "s4",
        title: "Panel — Tech Startups in Africa",
        description: "Roundtable with founders from African tech startups.",
        startTime: `${D}T11:30:00`,
        endTime: `${D}T12:30:00`,
        room: "Room A",
        capacity: 250,
        speakers: [
            { id: "sp6", fullName: "Noro Rasoamahenina" },
            { id: "sp7", fullName: "Thierry Blanc" },
            { id: "sp8", fullName: "Avel Randria" },
        ],
        isLive: false,
    },
    {
        id: "s5",
        title: "Cybersecurity for SMEs",
        description: "How to protect your business on a limited budget.",
        startTime: `${D}T11:30:00`,
        endTime: `${D}T12:15:00`,
        room: "Room C",
        capacity: 80,
        speakers: [{ id: "sp9", fullName: "Fara Ranaivo" }],
        isLive: false,
    },
    {
        id: "s6",
        title: "Design Systems at Scale",
        description: "How to build and maintain a design system in a product team.",
        startTime: `${D}T14:00:00`,
        endTime: `${D}T15:00:00`,
        room: "Room B",
        capacity: 70,
        speakers: [{ id: "sp10", fullName: "Clara Petit" }],
        isLive: false,
    },
    {
        id: "s7",
        title: "Advanced PostgreSQL",
        description: "Query optimization and advanced patterns.",
        startTime: `${D}T14:00:00`,
        endTime: `${D}T15:30:00`,
        room: "Room C",
        capacity: 60,
        speakers: [{ id: "sp11", fullName: "Omar Diallo" }],
        isLive: false,
    },
    {
        id: "s8",
        title: "Closing Keynote — Tech & Social Impact",
        description: "How technology can solve social challenges in Madagascar.",
        startTime: `${D}T16:00:00`,
        endTime: `${D}T17:00:00`,
        room: "Room A",
        capacity: 300,
        speakers: [{ id: "sp1", fullName: "Aina Rakoto" }, { id: "sp12", fullName: "Hery Rajoelison" }],
        isLive: false,
    },
];