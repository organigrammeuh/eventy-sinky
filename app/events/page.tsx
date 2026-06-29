import ExpandableText from "@/components/ExpandableText";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiArrowRight, FiSliders, FiPlus } from "react-icons/fi";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

type Event = {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location?: string;
    sessions?: unknown[];
};

const fetchAllEvents = async (): Promise<Event[]> => {
    try {
        const res = await fetch(`${BASE_URL}/api/events`, { cache: "no-store" });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
};

function formatDateRange(startDate: string, endDate: string) {
    const months = [
        "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
        "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec.",
    ];
    const s = new Date(startDate);
    const e = new Date(endDate);

    if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
        if (s.getDate() === e.getDate()) {
            return `${s.getDate()} ${months[s.getMonth()]} ${s.getFullYear()}`;
        }
        return `${s.getDate()} - ${e.getDate()} ${months[s.getMonth()]}`;
    }
    return `${s.getDate()} ${months[s.getMonth()]} - ${e.getDate()} ${months[e.getMonth()]}`;
}

export default async function EventsPage() {
    const events: Event[] = await fetchAllEvents();

    return (
        <div className="w-screen min-h-screen relative backdrop-blur-[2px] overflow-hidden text-foreground px-6 py-16 lg:py-24 md:px-16 lg:px-24">

            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[130px] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">

                <div className="lg:col-span-5 flex flex-col gap-12 lg:h-[75vh] lg:sticky lg:top-24">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-primary-muted text-primary text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6 border border-primary/10">
                            <FiSliders size={12} />
                            <span>Overview</span>
                        </div>

                        <h1 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl text-white lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.05]">
                            Discover all <br />
                            <span className="gradient-brand-text">our events</span>
                        </h1>

                        <p className="text-white/70 leading-relaxed text-sm max-w-sm">
                            Browse all upcoming gatheringsBrowse all upcoming gatherings and workshops. Select an event to explore its dedicated sessions. and workshops. Select an event to explore its dedicated sessions.
                        </p>
                    </div>

                    <div className="mt-0 lg:mt-0 flex items-center gap-4 border-t border-card-border/40 pt-6">
                        <div className="text-xs font-bold uppercase tracking-wider bg-muted/50 text-foreground/80 px-4 py-2 rounded-xl border border-card-border/40">
                            Total : {events.length} events
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-4">
                    {events.length === 0 ? (
                        <div className="glass rounded-2xl p-12 text-center border border-card-border/40">
                            <p className="text-muted-foreground text-sm">No events available.</p>
                        </div>
                    ) : (
                        events.map((e) => (
                            <Link href={`/events/${e.id}`} key={e.id} className="no-underline group block">
                                <div
                                    className="
                                        glass
                                        rounded-2xl
                                        p-5
                                        flex
                                        items-center
                                        justify-between
                                        gap-5
                                        border
                                        border-card-border/40
                                        hover:border-primary/40
                                        transition-all
                                        duration-300
                                        hover:translate-x-1
                                        shadow-sm
                                    "
                                >
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className="w-11 h-11 rounded-xl bg-muted/60 border border-card-border/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 flex items-center justify-center shrink-0 transition-colors duration-300">
                                            <FiCalendar size={18} />
                                        </div>

                                        <div className="min-w-0 flex-1 pr-2">
                                            <div className="flex items-center gap-2 mb-1 justify-between">
                                                <h2 className="font-[family-name:var(--font-syne)] text-xl font-extrabold gradient-brand-text tracking-tight truncate max-w-[70%] group-hover:text-primary transition-colors">
                                                    {e.title}
                                                </h2>
                                                <span className="text-[10px] font-bold text-primary bg-muted px-2 py-0.5 rounded-md border border-primary shrink-0">
                                                    {formatDateRange(e.startDate, e.endDate)}
                                                </span>
                                            </div>

                                            <div className="text-xs text-muted-foreground/80 line-clamp-1 leading-relaxed text-pretty">
                                                <ExpandableText text={e.description || "No description."} />
                                            </div>

                                            {e.location && (
                                                <div className="text-[10px] font-bold text-card-foreground tracking-wide uppercase mt-1 flex items-center gap-1">
                                                    <FiMapPin size={10} />
                                                    <span className="truncate">{e.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-8 h-8 rounded-full border border-card-border/40 text-muted-foreground/50 group-hover:text-primary group-hover:border-primary/30 flex items-center justify-center shrink-0 transition-all duration-300 transform group-hover:translate-x-0.5">
                                        <FiArrowRight size={14} />
                                    </div>

                                </div>
                            </Link>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}