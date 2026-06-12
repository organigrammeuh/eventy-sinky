import Link from "next/link";
import { FiCalendar, FiClock, FiMapPin, FiFolder, FiArrowRight } from "react-icons/fi";

type Speaker = { id: string; fullName: string; profilePicture?: string };

export type SessionCardData = {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    room?: string;
    speakers?: Speaker[];
    eventId?: string;
    eventTitle?: string;
};

function fmt(d: string) {
    return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function isLive(s: SessionCardData) {
    const now = new Date();
    return new Date(s.startTime) <= now && new Date(s.endTime) >= now;
}

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

type Props = {
    session: SessionCardData;
    href?: string;
    showEvent?: boolean;
    variant?: "default" | "compact";
};

export function SessionCard({ session: s, href, showEvent, variant = "default" }: Props) {
    const live = isLive(s);
    const dest = href ?? (s.eventId ? `/sessions/${s.eventId}` : "#");

    return (
        <Link href={dest} className="no-underline group block h-full">
            <article
                className={`
                    card-hover 
                    glass 
                    rounded-2xl 
                    p-5 
                    flex 
                    flex-col 
                    h-[325px] 
                    relative 
                    transition-all 
                    duration-300
                    ${live
                    ? "border-live shadow-[0_0_20px_rgba(var(--live),0.12)] bg-live/5"
                    : "hover:border-primary/40 shadow-sm"
                }
                `}
            >
                <div className="flex items-center justify-between w-full mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                        live ? "bg-live text-white" : "bg-primary-muted text-primary group-hover:bg-primary/20"
                    }`}>
                        {live ? (
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                        ) : (
                            <FiCalendar size={15} />
                        )}
                    </div>

                    <div className="text-[11px] font-bold text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full border border-card-border/40 flex items-center gap-1.5">
                        <FiClock size={12} className="text-muted-foreground/60" />
                        {fmt(s.startTime)} – {fmt(s.endTime)}
                    </div>
                </div>

                <div className="flex flex-col flex-1 min-w-0 text-left">
                    <h3 className="font-[family-name:var(--font-syne)] text-[15px] font-extrabold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {s.title}
                    </h3>

                    <div className="mt-auto pt-3 flex flex-col gap-2">
                        <div className="flex flex-col items-center justify-between text-[10px] font-bold tracking-wide uppercase text-accent">
                            {showEvent && s.eventTitle && (
                                <span className="text-base text-primary flex gap-1 truncate justify-end">
                                    {s.eventTitle}
                                </span>
                            )}
                            {s.room && (
                                <span className="flex items-center gap-1 truncate">
                                    <FiMapPin size={11} className="shrink-0" />
                                    {s.room}
                                </span>
                            )}
                        </div>

                        {s.speakers && s.speakers.length > 0 && (
                            <div className="flex flex-col items-center gap-2 overflow-hidden border-t border-card-border/20 pt-2">
                                <div className="flex -space-x-1.5 overflow-hidden">
                                    {s.speakers.slice(0, 2).map((sp) => (
                                        sp.profilePicture ? (
                                            <img
                                                key={sp.id}
                                                src={sp.profilePicture}
                                                alt={sp.fullName}
                                                className="w-5.5 h-5.5 rounded-full object-cover ring-2 ring-background shrink-0"
                                            />
                                        ) : (
                                            <div
                                                key={sp.id}
                                                className="w-5.5 h-5.5 rounded-full bg-primary-muted text-primary border border-background flex items-center justify-center text-[8px] font-black shrink-0"
                                                title={sp.fullName}
                                            >
                                                {getInitials(sp.fullName)}
                                            </div>
                                        )
                                    ))}
                                </div>
                                <span className="text-[10px] font-medium text-muted-foreground/70 ">
                                    {s.speakers[0].fullName} {s.speakers.length > 1 && `+${s.speakers.length - 1}`}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 w-full">
                    <div className="w-full flex items-center justify-center gap-1.5 text-center py-2 rounded-xl text-xs font-bold text-foreground bg-muted/60 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 border border-card-border/40 shadow-inner">
                        <span>{live ? "Join live" : "Learn more"}</span>
                        <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                </div>
            </article>
        </Link>
    );
}

export function SessionCardSkeleton() {
    return (
        <div className="glass rounded-2xl p-5 flex flex-col h-[325px] relative">
            <div className="flex items-center justify-between w-full mb-4">
                <div className="skeleton w-8 h-8 rounded-lg" />
                <div className="skeleton h-5 w-20 rounded-full" />
            </div>
            <div className="flex flex-col flex-1 gap-2">
                <div className="skeleton h-4 w-5/6 rounded" />
                <div className="skeleton h-3 w-full rounded mt-1" />
                <div className="skeleton h-3 w-4/5 rounded" />
            </div>
            <div className="skeleton h-8 w-full rounded-xl mt-auto" />
        </div>
    );
}