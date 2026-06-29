import Link from "next/link";
import { SessionCard, SessionCardSkeleton, SessionCardData } from "@/constants/SessionCard";

type Event = {
    id: string;
    title: string;
    sessions?: SessionCardData[];
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

async function fetchEvents(): Promise<Event[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/events`, { cache: "no-store" });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

function checkIsLive(startTime: string, endTime: string): boolean {
    const now = new Date();
    return new Date(startTime) <= now && new Date(endTime) >= now;
}

export async function SessionSection() {
    const events = await fetchEvents();

    const allSessions = events.flatMap((e) =>
        (e.sessions ?? []).map((s) => {
            const isLiveNow = checkIsLive(s.startTime, s.endTime);
            return {
                ...s,
                eventId: e.id,
                eventTitle: e.title,
                room: typeof (s as any).room === "object" ? (s as any).room?.name : s.room,
                isLive: isLiveNow,
            };
        })
    );

    const sortedSessions = [
        ...allSessions.filter((s) => s.isLive),
        ...allSessions.filter((s) => !s.isLive)
    ].slice(0, 4);

    return (
        <section className="relative overflow-hidden backdrop-blur-[2px] py-12">
            <div className="homepage-section-inner relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-card-border/40 pb-5">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-black uppercase tracking-widest text-primary block">
                            Agenda & Lineups
                        </span>
                        <h2 className="section-title-too text-2xl md:text-3xl font-extrabold tracking-tight">
                            Recent sessions
                        </h2>
                    </div>
                    <Link href="/sessions" className="section-link group flex items-center gap-1 font-semibold transition-colors hover:text-accent">
                        View all
                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>

                {sortedSessions.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <SessionCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {sortedSessions.map((s) => {
                            if (s.isLive) {
                                return (
                                    <div
                                        key={s.id}
                                        className="relative rounded-2xl border border-live/40 bg-gradient-to-b from-live/10 via-live/5 to-transparent p-1 shadow-[0_8px_32px_-6px_rgba(239,68,68,0.08)] transition-all duration-300 hover:scale-[1.02] hover:border-live/60 group"
                                    >
                                        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-live/90 border border-live px-2.5 py-0.5 rounded-md shadow-sm pointer-events-none">
                                            <span className="live-dot shrink-0" />
                                            <span className="text-[9px] font-black uppercase tracking-wider text-white">LIVE</span>
                                        </div>
                                        <SessionCard
                                            session={s}
                                            href={`/sessions/${s.id}`}
                                            showEvent
                                            variant="default"
                                        />
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={s.id}
                                    className="transition-all duration-300 hover:scale-[1.01]"
                                >
                                    <SessionCard
                                        session={s}
                                        href={`/sessions/${s.id}`}
                                        showEvent
                                        variant="default"
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}