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

function checkIsLive(startTime: string, endTime: string): boolean {
    const now = new Date();
    return new Date(startTime) <= now && new Date(endTime) >= now;
}

function fmtDuration(start: string, end: string): string {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60) {
        return `${diffMins} min`;
    }

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
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

    const liveSessions = filteredSessions.filter((s) => checkIsLive(s.startTime, s.endTime));
    const upcomingAndPastSessions = filteredSessions.filter((s) => !checkIsLive(s.startTime, s.endTime));

    const sortedStandardSessions = [...upcomingAndPastSessions].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const groupedStandardByDay = sortedStandardSessions.reduce((acc, session) => {
        const day = fmtDay(session.startTime);
        if (!acc[day]) acc[day] = [];
        acc[day].push(session);
        return acc;
    }, {} as Record<string, Session[]>);

    return (
        <main className="w-screen min-h-screen relative backdrop-blur-[2px] text-foreground px-4 sm:px-6 py-24 md:px-16 lg:px-24 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-accent/5 roun            {/* Effets visuels d'arrière-plan */}ded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10 flex flex-col gap-10">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-card-border/40 pb-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-black uppercase tracking-widest text-primary">
                            Timeline & Tracks
                        </span>
                        <h1 className="font-[family-name:var(--font-syne)] text-4xl gradient-brand-text font-extrabold tracking-tight">
                            Schedule
                        </h1>
                    </div>
                    <div className="shrink-0">
                        <EventFilter events={events} selectedEventId={selectedEventId} />
                    </div>
                </header>

                {liveSessions.length === 0 && Object.keys(groupedStandardByDay).length === 0 ? (
                    <div className="rounded-2xl p-12 text-center border border-card-border/30 bg-card/20 backdrop-blur-md max-w-md mx-auto w-full shadow-sm">
                        <FiActivity size={28} className="mx-auto text-muted-foreground/30 mb-4 animate-pulse" />
                        <h3 className="text-white font-bold text-base mb-1">No sessions scheduled</h3>
                        <p className="text-muted-foreground text-xs font-medium">Try updating your event filter preferences above.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">

                        {liveSessions.length > 0 && (
                            <div className="flex flex-col gap-5 bg-live/5 border border-live/20 p-6 rounded-3xl backdrop-blur-md shadow-[0_12px_40px_rgba(239,68,68,0.04)]">
                                <div className="inline-flex items-center gap-2 self-start bg-live text-[10px] font-black uppercase tracking-widest text-white px-3 py-1.5 rounded-full shadow-md ">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                                    <span>Live Now</span>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {liveSessions.map((s) => (
                                        <Link href={`/sessions/${s.id}`} key={s.id} className="no-underline group block w-full">
                                            <div className="flex gap-3 items-start md:gap-6 w-full text-left">
                                                <div className="w-16 pt-4 flex flex-col items-end gap-0.5 shrink-0 text-right">
                                                    <span className="text-sm font-black tracking-tight font-[family-name:var(--font-syne)] text-live">
                                                        {fmt(s.startTime)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted-foreground tracking-tight">
                                                        {fmt(s.endTime)}
                                                    </span>
                                                </div>

                                                <div className="flex-1 rounded-2xl p-5 border backdrop-blur-md transition-all duration-300 shadow-sm relative overflow-hidden bg-gradient-to-r from-live/40 to-card/10 border-live/40 hover:border-live/60">
                                                    <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-live" />

                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <h3 className="font-[family-name:var(--font-syne)] text-lg font-extrabold text-white transition-colors tracking-tight line-clamp-1">
                                                            {s.title}
                                                        </h3>

                                                        {s.room && (
                                                            <span className="text-[9px] font-black tracking-wider uppercase bg-live/20 text-white border border-live/30 px-2 py-1 rounded-full flex items-center gap-1 shrink-0 shadow-sm">
                                                                <FiMapPin size={9} />
                                                                <span>{s.room.name}</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mb-4">
                                                        {s.description || "No track description entered for this schedule block entry segment."}
                                                    </p>

                                                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-live/20">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                                                            <FiClock size={13} />
                                                            <span>Duration: {fmtDuration(s.startTime, s.endTime)}</span>
                                                        </div>

                                                        {s.speakers && s.speakers.length > 0 && (
                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                <div className="flex -space-x-1.5 overflow-hidden">
                                                                    {s.speakers.map((sp) => (
                                                                        <div
                                                                            key={sp.id}
                                                                            title={sp.fullName}
                                                                            className="w-7 h-7 rounded-full bg-live text-white border border-live flex items-center justify-center text-[12px] font-black shrink-0 "
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
                        )}

                        {Object.entries(groupedStandardByDay).map(([day, daySessions]) => (
                            <div key={day} className="flex flex-col gap-6">
                                <div className="sticky top-24 z-20 self-start bg-muted/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-primary border border-primary/30 px-3 py-1.5 rounded-full shadow-sm">
                                    {day}
                                </div>

                                <div className="flex flex-col gap-5">
                                    {daySessions.map((s) => (
                                        <Link href={`/sessions/${s.id}`} key={s.id} className="no-underline group block w-full">
                                            <div className="flex gap-3 items-start md:gap-6 w-full text-left">
                                                <div className="w-16 pt-4 flex flex-col items-end gap-0.5 shrink-0 text-right">
                                                    <span className="text-sm font-black tracking-tight font-[family-name:var(--font-syne)] text-white/80 group-hover:text-primary transition-colors">
                                                        {fmt(s.startTime)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted-foreground tracking-tight">
                                                        {fmt(s.endTime)}
                                                    </span>
                                                </div>

                                                <div className="flex-1 rounded-2xl p-5 border backdrop-blur-md transition-all duration-300 shadow-sm relative overflow-hidden bg-card/40 border-card-border/40 hover:border-primary/40 hover:bg-card/60 hover:scale-[1.005]">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <h3 className="font-[family-name:var(--font-syne)] text-lg font-extrabold text-foreground/80 group-hover:text-primary transition-colors tracking-tight line-clamp-1">
                                                            {s.title}
                                                        </h3>

                                                        {s.room && (
                                                            <span className="text-[9px] font-black tracking-wider uppercase bg-muted/60 text-accent/90 border border-card-border px-2 py-1 rounded-full flex items-center gap-1 shrink-0 shadow-sm">
                                                                <FiMapPin size={9} />
                                                                <span>{s.room.name}</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-xs text-card-foreground/80 line-clamp-2 leading-relaxed mb-4">
                                                        {s.description || "No track description entered for this schedule block entry segment."}
                                                    </p>

                                                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-card-border/40">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-card-foreground/50">
                                                            <FiClock size={13} className="text-primary" />
                                                            <span>Duration : {fmtDuration(s.startTime, s.endTime)}</span>
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