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

export async function SessionSection() {
    const events = await fetchEvents();

    const sessions: (SessionCardData & { eventTitle: string })[] = events.flatMap((e) =>
        (e.sessions ?? []).slice(0, 2).map((s) => ({
            ...s,
            eventId: e.id,
            eventTitle: e.title,
            room: typeof (s as any).room === "object" ? (s as any).room?.name : s.room,
        }))
    ).slice(0, 8);

    return (
        <section className="relative overflow-hidden backdrop-blur-[2px]">
            <div className="homepage-section-inner relative z-10">
                <div className="section-header items-end mb-8 border-b border-card-border/40 pb-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
                            View our planning
                        </span>
                        <h2 className="section-atitle text-2xl md:text-3xl font-extrabold tracking-tight">
                            Recent sessions
                        </h2>
                    </div>
                    <Link href="/sessions" className="section-link group flex items-center gap-1 font-semibold transition-colors hover:text-accent">
                        View all
                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>

                {sessions.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <SessionCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {sessions.map((s) => (
                            <SessionCard
                                key={s.id}
                                session={s}
                                href={`/sessions/${s.id}`}
                                showEvent
                                variant="default"
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}