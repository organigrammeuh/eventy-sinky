import Link from "next/link";
import { EventFilter } from "@/components/EventFilter";
import { FiClock, FiMapPin, FiActivity } from "react-icons/fi";

type Speaker = { id: string; fullName: string };
type Room = { id: string; name: string };
type EventRef = { id: string; title: string };
type Session = {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    room?: Room;
    speakers: Speaker[];
    event?: EventRef;
    isLive?: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

async function fetchSessions(): Promise<Session[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/sessions`, { cache: "no-store" });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

async function fetchEvents() {
    try {
        const res = await fetch(`${BASE_URL}/api/events`, { cache: "no-store" });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

function fmt(d: string) {
    return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function fmtDay(d: string) {
    return new Date(d).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

type SearchParams = Promise<{ eventId?: string }>;

export default async function SessionsPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const selectedEventId = params.eventId;

    const [allSessions, events] = await Promise.all([
        fetchSessions(),
        fetchEvents(),
    ]);

    const filteredSessions = selectedEventId && selectedEventId !== "all"
        ? allSessions.filter((s) => s.event?.id === selectedEventId)
        : allSessions;

    const sortedSessions = [...filteredSessions].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const groupedByDay = sortedSessions.reduce((acc, session) => {
        const day = fmtDay(session.startTime);
        if (!acc[day]) acc[day] = [];
        acc[day].push(session);
        return acc;
    }, {} as Record<string, Session[]>);

    return (
        <main className="w-screen mt-6 min-h-screen relative backdrop-blur-[2px] text-foreground px-6 py-16 md:px-16 lg:px-24">
            <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10 flex flex-col gap-10">

                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-card-border/60 pb-6">
                    <div>
                        <h1 className="font-[family-name:var(--font-syne)] text-4xl gradient-brand-text font-extrabold tracking-tight">
                            Schedule
                        </h1>
                    </div>
                    <div className="shrink-0">
                        <EventFilter events={events} selectedEventId={selectedEventId} />
                    </div>
                </header>

                {Object.keys(groupedByDay).length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center border border-card-border/40 max-w-md mx-auto w-full">
                        <FiActivity size={24} className="mx-auto text-muted-foreground/40 mb-3" />
                        <p className="text-muted-foreground text-sm font-medium">No sessions scheduled for this selection.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">
                        {Object.entries(groupedByDay).map(([day, daySessions]) => (
                            <div key={day} className="flex flex-col gap-6">

                                <div className="sticky top-4 z-20 self-start bg-muted/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-primary border border-primary/50 px-3 py-1 rounded-md shadow-sm">
                                    {day}
                                </div>

                                <div className="flex flex-col gap-4">
                                    {daySessions.map((s) => (
                                        <Link href={`/sessions/${s.id}`} key={s.id} className="no-underline group block w-full">
                                            <div className="flex gap-4 items-start md:gap-6 w-full text-left">

                                                <div className="w-16 pt-5 flex flex-col items-end gap-0.5 shrink-0 text-right">
                                                    <span className="text-sm font-extrabold tracking-tight text-white/80 font-[family-name:var(--font-syne)]">
                                                        {fmt(s.startTime)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted-foreground tracking-tight">
                                                        {fmt(s.endTime)}
                                                    </span>
                                                </div>

                                                <div className="flex-1 glass rounded-2xl p-5 border border-card-border/40 hover:border-primary/40 group-hover:translate-x-0.5 transition-all duration-300 shadow-sm relative overflow-hidden">

                                                    {s.isLive && (
                                                        <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-live" />
                                                    )}

                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <h3 className="font-[family-name:var(--font-syne)] text-lg font-extrabold text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">
                                                            {s.title}
                                                        </h3>

                                                        {s.room && (
                                                            <span className="text-[9px] font-black tracking-wider uppercase bg-muted/60 text-accent/90 border border-card-border px-2 py-0.5 rounded rounded-xl flex items-center gap-1 shrink-0">
                                                                <FiMapPin size={9} />
                                                                <span>{s.room.name}</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                                                        {s.description || "No full track synopsis description detail details entered inside this schedule block entry segment."}
                                                    </p>

                                                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-card-border">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                            <FiClock size={15} className="text-primary" />
                                                            <span>Duration Block</span>
                                                        </div>

                                                        {s.speakers && s.speakers.length > 0 && (
                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                <div className="flex -space-x-1.5 overflow-hidden">
                                                                    {s.speakers.map((sp) => (
                                                                        <div
                                                                            key={sp.id}
                                                                            title={sp.fullName}
                                                                            className="w-7 h-7 rounded-full bg-primary-muted text-primary border border-primary flex items-center justify-center text-[12px] font-black shrink-0 ring-1 ring-card-border/30"
                                                                        >
                                                                            {getInitials(sp.fullName)}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>

                                            </div>
                                        </Link>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}