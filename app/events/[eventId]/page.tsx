import { Session } from "@/types/sessions";
import EventSessionList from "@/components/EventSessionsList";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiArrowLeft, FiClock, FiActivity } from "react-icons/fi";

type EventProps = {
    params: Promise<{ eventId: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function formatDateRange(startDate: string, endDate: string) {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const s = new Date(startDate);
    const e = new Date(endDate);

    if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
        if (s.getDate() === e.getDate()) {
            return `${s.getDate()} ${months[s.getMonth()]} ${s.getFullYear()}`;
        }
        return `${s.getDate()} - ${e.getDate()} ${months[s.getMonth()]} ${s.getFullYear()}`;
    }
    return `${s.getDate()} ${months[s.getMonth()]} - ${e.getDate()} ${months[e.getMonth()]} ${e.getFullYear()}`;
}

export default async function EventPage({ params }: EventProps) {
    const { eventId } = await params;

    const [eventRes, sessionRes] = await Promise.all([
        fetch(`${BASE_URL}/api/events/${eventId}`, { cache: "no-store" }),
        fetch(`${BASE_URL}/api/events/${eventId}/sessions`, { cache: "no-store" }),
    ]);

    if (!eventRes.ok) {
        return (
            <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
                <p className="text-muted-foreground text-sm mb-4">Event not found or has been removed.</p>
                <Link href="/events" className="text-xs font-bold text-primary flex items-center gap-2">
                    <FiArrowLeft /> Back to all events
                </Link>
            </div>
        );
    }

    const event = await eventRes.json();
    const sessions: Session[] = await sessionRes.json();

    return (
        <div className="w-screen min-h-screen relative overflow-x-hidden backdrop-blur-[2px] text-foreground pb-24 mt-12">
            <div className="absolute top-0 right-1/3 w-[500px] h-[400px] bg-primary/4 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/3 left-1/4 w-[600px] h-[500px] bg-accent/3 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-12 relative z-10">

                <Link href="/events" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-colors mb-8 group no-underline">
                    <FiArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
                    <span>Back to events</span>
                </Link>

                <header className="mb-12 border-b border-card-border pb-12">

                    <h1 className="gradient-brand-text font-[family-name:var(--font-syne)] text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-8 max-w-4xl text-balance">
                        {event.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-muted border border-card-border rounded-xl px-4 py-2 text-xs font-bold text-muted-foreground">
                            <FiCalendar className="text-primary" size={13} />
                            <span>{formatDateRange(event.startDate, event.endDate)}</span>
                        </div>

                        {event.location && (
                            <div className="flex items-center gap-2 bg-muted border border-card-border rounded-xl px-4 py-2 text-xs font-bold text-muted-foreground">
                                <FiMapPin className="text-accent" size={13} />
                                <span className="truncate max-w-[240px]">{event.location.name || `${event.location.city}, ${event.location.country}`}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 bg-primary-muted border border-primary/10 rounded-xl px-4 py-2 text-xs font-bold text-primary">
                            <FiClock size={13} />
                            <span>{sessions.length} Scheduled Sessions</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    <section className="lg:col-span-5 lg:sticky lg:top-24">
                        <h2 className="font-[family-name:var(--font-syne)] text-center text-lg font-extrabold text-white/80 tracking-tight mb-4">
                            About this event
                        </h2>
                        <div className="text-sm text-card-foreground/80 rounded rounded-xl py-6 px-12 glass leading-relaxed text-pretty space-y-4">
                            {event.description ? (
                                <p className="whitespace-pre-line">{event.description}</p>
                            ) : (
                                <p className="italic text-muted-foreground">No full detailed overview summary description was registered for this event item.</p>
                            )}
                        </div>
                    </section>

                    <section className="lg:col-span-7 flex flex-col gap-6">
                            <h3 className="font-[family-name:var(--font-syne)] text-center text-white/80 font-extrabold tracking-tight">
                                Agenda Schedule
                            </h3>

                        {sessions.length === 0 ? (
                            <div className="glass rounded-2xl p-12 text-center border border-card-border/40">
                                <p className="text-muted-foreground text-sm">No specific time sessions are listed inside this tracking block yet.</p>
                            </div>
                        ) : (
                            <EventSessionList sessions={sessions} />
                        )}
                    </section>

                </div>

            </div>
        </div>
    );
}