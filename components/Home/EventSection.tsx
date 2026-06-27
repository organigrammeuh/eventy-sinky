import Link from "next/link";
import { EventCard, EventCardSkeleton } from "@/constants/EventCard";

type Event = {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    location?: string;
    sessions?: unknown[];
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

export async function EventSection() {
    const events = await fetchEvents();

    return (
        <section className="homepage-section relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="homepage-section-inner relative z-10">
                <div className="section-header items-end mb-8 border-b border-card-border/40 pb-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
                            Learn through our conferences
                        </span>
                        <h2 className="section-title text-2xl md:text-3xl font-extrabold tracking-tight">
                            Events
                        </h2>
                    </div>
                    <Link href="/events" className="section-link group flex items-center gap-1 font-semibold transition-colors hover:text-primary">
                        View all
                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible scrollbar-none">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="min-w-[280px] md:min-w-0 flex-1">
                                <EventCardSkeleton />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible snap-x snap-mandatory scrollbar-none">
                        {events.slice(0, 3).map((event) => (
                            <div key={event.id} className="min-w-[280px] md:min-w-0 flex-1 snap-start">
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}