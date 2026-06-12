import ExpandableText from "@/components/ExpandableText";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

type Event = {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location?: string;
};

const fetchAllEvents = async (): Promise<Event[]> => {
    const res = await fetch(`${BASE_URL}/api/events`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
};

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

export default async function EventsPage() {
    const events: Event[] = await fetchAllEvents();

    return (
        <div className="w-screen min-h-screen flex flex-col p-3 items-center py-10 gap-5 backdrop-blur-[3px]">
            <p className="text-3xl">Events</p>

            <div className="flex gap-5 w-4/5 justify-center flex-wrap border p-5">
                {events.length === 0 ? (
                    <p className="text-muted-foreground">No events yet.</p>
                ) : (
                    events.map((e) => (
                        <div
                            key={e.id}
                            className="flex flex-col gap-3 rounded-2xl border p-5 w-80"
                        >
                            <p className="font-bold text-2xl">{e.title}</p>
                            <ExpandableText text={e.description} />
                            <hr />
                            <p>{formatDateRange(e.startDate, e.endDate)}</p>
                            <p>{e.location}</p>
                            <Link href={`/events/${e.id}`}>
                                <button className="bg-green-300 p-2 rounded-2xl cursor-pointer w-full">
                                    View planning
                                </button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}