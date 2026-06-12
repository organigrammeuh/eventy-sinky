import { Session } from "@/types/sessions";
import EventSessionList from "@/components/EventSessionsList";

type EventProps = {
    params: Promise<{ eventId: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function formatDateRange(startDate: string, endDate: string) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    const s = new Date(startDate);
    const e = new Date(endDate);
    const start = `${s.getDate()} ${months[s.getMonth()]} ${s.getFullYear()}`;
    const end = `${e.getDate()} ${months[e.getMonth()]} ${e.getFullYear()}`;
    return `${start} - ${end}`;
}

export default async function EventPage({ params }: EventProps) {
    const { eventId } = await params;

    const [eventRes, sessionRes] = await Promise.all([
        fetch(`${BASE_URL}/api/events/${eventId}`, { cache: "no-store" }),
        fetch(`${BASE_URL}/api/events/${eventId}/sessions`, { cache: "no-store" }),
    ]);

    const event = await eventRes.json();
    const sessions: Session[] = await sessionRes.json();

    return (
        <div className="w-screen h-screen">
            <div className="p-3 border-b">
                <p className="text-2xl mb-2">{event.title}</p>
                <p className="font-extralight">
                    {formatDateRange(event.startDate, event.endDate)} / {event.location}
                </p>
            </div>

            <EventSessionList sessions={sessions} />
        </div>
    );
}