import Link from "next/link";
import { EventFilter } from "@/components/EventFilter";

type Speaker = { id: string; fullName: string };
type Room = { id: string; name: string };
type Session = {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    room?: Room;
    speakers: Speaker[];
    eventId?: string;
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
    return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
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

function isLive(s: Session) {
    const now = new Date();
    return new Date(s.startTime) <= now && new Date(s.endTime) >= now;
}

function groupByDate(sessions: Session[]) {
    const map = new Map<string, Session[]>();
    for (const s of sessions) {
        const key = new Date(s.startTime).toDateString();
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(s);
    }
    return map;
}

function groupByTime(sessions: Session[]) {
    const map = new Map<string, Session[]>();
    for (const s of sessions) {
        const key = fmt(s.startTime);
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(s);
    }
    return map;
}

export default async function SessionsPage({
                                               searchParams,
                                           }: {
    searchParams: Promise<{ event?: string; view?: string }>;
}) {
    const { event: eventId = "all", view = "agenda" } = await searchParams;

    const [sessions, events] = await Promise.all([fetchSessions(), fetchEvents()]);

    const filtered =
        eventId === "all"
            ? sessions
            : sessions.filter((s) => s.eventId === eventId);

    const byDate = groupByDate(filtered);
    const selectedEvent = events.find((e: any) => e.id === eventId);

    return (
        <main className="pt-20 min-h-screen backdrop-blur-[3px]">
            <div className="max-w-[1100px] mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold text-foreground mb-1">
                        Sessions
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {filtered.length} session{filtered.length !== 1 ? "s" : ""}
                        {selectedEvent ? ` · ${selectedEvent.title}` : " · all events"}
                    </p>
                </div>

                <div className="flex gap-3 flex-wrap items-center mb-8">
                    <EventFilter events={events} currentEventId={eventId} />

                    <div className="flex border border-border rounded-xl overflow-hidden">
                        {(["agenda", "list"] as const).map((v) => (
                            <Link
                                key={v}
                                href={`/sessions?event=${eventId}&view=${v}`}
                                className={`px-5 py-2 text-xs font-semibold no-underline transition-colors duration-200 ${
                                    view === v
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {v === "agenda" ? "Agenda" : "List"}
                            </Link>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">No sessions found.</div>
                ) : view === "list" ? (
                    <div className="flex flex-col gap-2.5">
                        {filtered.map((s) => {
                            const live = isLive(s);
                            return (
                                <Link key={s.id} href={`/sessions/${s.id}`} className="no-underline">
                                    <div
                                        className={`flex items-center gap-5 px-5 py-4 bg-card rounded-xl border transition-colors ${
                                            live ? "border-primary" : "border-card-border"
                                        }`}
                                    >
                                        <div className="text-right w-16 shrink-0">
                                            <div className="text-xs font-bold text-primary">
                                                {fmt(s.startTime)}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground">
                                                {fmt(s.endTime)}
                                            </div>
                                        </div>
                                        <div className="w-px h-9 bg-border shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {live && (
                                                    <span className="badge badge-primary">
                            <span className="live-dot" />
                            Live
                          </span>
                                                )}
                                                <span className="font-semibold text-sm text-foreground">
                          {s.title}
                        </span>
                                            </div>
                                            <div className="text-[11px] text-muted-foreground mt-0.5">
                                                {s.room?.name && (
                                                    <span className="text-accent">{s.room.name}</span>
                                                )}
                                                {s.speakers.length > 0 && (
                                                    <span>
                            {s.room?.name ? " · " : ""}
                                                        {s.speakers.map((sp) => sp.fullName).join(", ")}
                          </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground shrink-0">
                      {fmtDay(s.startTime)}
                    </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {Array.from(byDate.entries()).map(([, dateSessions]) => {
                            const slots = groupByTime(dateSessions);
                            return (
                                <div key={dateSessions[0].startTime}>
                                    <div className="flex items-center gap-3 mb-4">
                    <span className="font-[faNo sessions found.mily-name:var(--font-syne)] text-sm font-bold text-foreground shrink-0">
                      {fmtDay(dateSessions[0].startTime)}
                    </span>
                                        <div className="flex-1 h-px bg-border" />
                                        <span className="text-xs text-muted-foreground shrink-0">
                      {dateSessions.length} session
                                            {dateSessions.length !== 1 ? "s" : ""}
                    </span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {Array.from(slots.entries()).map(([time, slotSessions]) => (
                                            <div key={time} className="flex gap-4 items-start">
                                                <div className="w-14 pt-3.5 shrink-0 text-right">
                          <span className="text-xs font-bold text-primary">
                            {time}
                          </span>
                                                </div>
                                                <div className="flex-1 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2">
                                                    {slotSessions.map((s) => {
                                                        const live = isLive(s);
                                                        return (
                                                            <Link
                                                                key={s.id}
                                                                href={`/sessions/${s.id}`}
                                                                className="no-underline"
                                                            >
                                                                <div
                                                                    className="px-4 py-3 rounded-lg"
                                                                    style={{
                                                                        background: live
                                                                            ? "var(--primary-muted)"
                                                                            : "var(--card)",
                                                                        border: `1px solid ${
                                                                            live ? "var(--primary)" : "var(--card-border)"
                                                                        }`,
                                                                        borderLeft: `3px solid ${
                                                                            live ? "var(--primary)" : "var(--accent)"
                                                                        }`,
                                                                    }}
                                                                >
                                                                    {live && (
                                                                        <span className="badge badge-primary mb-1.5 block w-fit">
                                      <span className="live-dot" />
                                      Live
                                    </span>
                                                                    )}
                                                                    <p className="font-semibold text-xs text-foreground mb-1 leading-snug">
                                                                        {s.title}
                                                                    </p>
                                                                    <p className="text-[11px] text-muted-foreground">
                                                                        {s.room?.name && `${s.room.name} · `}
                                                                        {fmt(s.startTime)}–{fmt(s.endTime)}
                                                                    </p>
                                                                    {s.speakers.length > 0 && (
                                                                        <div className="flex gap-1 mt-2">
                                                                            {s.speakers.slice(0, 3).map((sp) => (
                                                                                <div
                                                                                    key={sp.id}
                                                                                    title={sp.fullName}
                                                                                    className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[8px] font-bold shrink-0"
                                                                                >
                                                                                    {getInitials(sp.fullName)}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}