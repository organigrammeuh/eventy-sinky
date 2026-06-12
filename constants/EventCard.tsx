import Link from "next/link";
import { FiCalendar, FiMapPin, FiLayers } from "react-icons/fi";

type Event = {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    location?: string;
    sessions?: unknown[];
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function EventCard({ event }: { event: Event }) {
    const sessionCount = event.sessions?.length ?? 0;

    return (
        <Link href={`/events/${event.id}`} className="no-underline group block h-full">
            <article
                className="fr-FR
                    card-hover
                    glass
                    h-[280px]
                    flex
                    flex-col
                    gap-4
                    p-6
                    rounded-2xl
                    overflow-hidden
                    relative
                    hover:border-primary/40
                "
            >
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-brand opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex flex-col gap-2 flex-1 relative z-10">
                    <h3 className="font-[family-name:var(--font-syne)] text-base font-extrabold text-foreground leading-snug line-clamp-2 tracking-tight group-hover:text-primary transition-colors duration-300">
                        {event.title}
                    </h3>
                    {event.description ? (
                        <p className="text-xs text-muted-foreground/90 line-clamp-4 leading-relaxed text-pretty">
                            {event.description}
                        </p>
                    ) : (
                        <p className="text-xs text-muted-foreground/50 italic">
                            No description.
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-card-border/60 relative z-10">
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <FiCalendar size={12} className="text-primary" />
                            {formatDate(event.startDate)}
                        </span>
                        {event.location && (
                            <span className="text-[11px] font-medium text-muted-foreground/70 truncate max-w-[160px] flex items-center gap-1.5">
                                <FiMapPin size={11} className="text-accent shrink-0" />
                                {event.location}
                            </span>
                        )}
                    </div>

                    <span className="badge badge-primary px-3 py-1.5 backdrop-blur-sm border border-primary/5 shadow-sm shrink-0 flex items-center gap-1">
                        <FiLayers size={11} />
                        {sessionCount} {sessionCount !== 1 ? "Sessions" : "Session"}
                    </span>
                </div>
            </article>
        </Link>
    );
}

export function EventCardSkeleton() {
    return (
        <div className="glass h-[280px] flex flex-col gap-4 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-muted/40" />
            <div className="flex flex-col gap-2.5 flex-1">
                <div className="skeleton h-4.5 w-3/4 rounded" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-5/6 rounded" />
            </div>
            <div className="mt-auto pt-4 border-t border-card-border/60 flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                    <div className="skeleton h-3 w-20 rounded" />
                    <div className="skeleton h-2.5 w-24 rounded" />
                </div>
                <div className="skeleton h-6 w-20 rounded-full shrink-0" />
            </div>
        </div>
    );
}