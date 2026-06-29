import Link from "next/link";
import { FiClock, FiMapPin, FiArrowRight, FiActivity } from "react-icons/fi";
import { Session } from "@/types/sessions";

function fmtTime(d: string) {
    return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function checkIsLive(startTime: string, endTime: string): boolean {
    const now = new Date();
    return new Date(startTime) <= now && new Date(endTime) >= now;
}

export default function EventSessionList({ sessions }: { sessions: Session[] }) {
    const sortedSessions = [...sessions].sort((a, b) => {
        const aLive = checkIsLive(a.startTime, a.endTime);
        const bLive = checkIsLive(b.startTime, b.endTime);
        if (aLive && !bLive) return -1;
        if (!aLive && bLive) return 1;
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    return (
        <div className="flex flex-col gap-3.5 w-full">
            {sortedSessions.map((s) => {
                const isLive = checkIsLive(s.startTime, s.endTime);

                return (
                    <Link href={`/sessions/${s.id}`} key={s.id} className="no-underline group block w-full">
                        <div
                            className={`
                                rounded-2xl
                                p-5
                                flex
                                items-center
                                justify-between
                                gap-5
                                border
                                transition-all
                                duration-300
                                hover:translate-x-1
                                shadow-sm
                                ${isLive
                                ? "border-live/60 bg-card/90 hover:border-live shadow-xl shadow-live/10"
                                : "glass border-card-border/40 hover:border-primary/40"
                            }
                            `}
                        >
                            <div className="flex items-center gap-4 min-w-0 flex-1 text-left">
                                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-colors duration-300 ${
                                    isLive
                                        ? "bg-live/20 text-live border-live/30"
                                        : "bg-muted/60 border-card-border/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
                                }`}>
                                    <FiActivity size={18} className={isLive ? "animate-pulse" : ""} />
                                </div>

                                <div className="min-w-0 flex-1 pr-2">
                                    <div className="flex items-center justify-between gap-2.5 mb-1 flex-wrap">
                                        <h4 className={`font-[family-name:var(--font-syne)] text-sm font-extrabold text-foreground tracking-tight truncate max-w-[70%] transition-colors 
                                            ${isLive ? "group-hover:text-live ": "group-hover:text-primary"}`}>
                                            {s.title}
                                        </h4>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {isLive && (
                                                <span className="inline-flex items-center gap-1 bg-live text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded animate-pulse">
                                                    Live
                                                </span>
                                            )}
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 flex items-center gap-1 ${
                                                isLive
                                                    ? "text-primary bg-primary/10 border-primary/20"
                                                    : "text-primary bg-muted/50 border-card-primary"
                                            }`}>
                                                <FiClock size={10} />
                                                {fmtTime(s.startTime)} - {fmtTime(s.endTime)}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground/80 line-clamp-1 leading-relaxed">
                                        {s.description || "No track session snippet detail text provided."}
                                    </p>

                                    {s.room && (
                                        <div className="text-[10px] font-bold text-accent tracking-wide uppercase mt-1 flex items-center gap-1">
                                            <FiMapPin size={10} />
                                            <span>{typeof s.room === "object" ? (s.room as any).name : s.room}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 transform group-hover:translate-x-0.5 ${
                                isLive
                                    ? "border-live/30 text-live bg-live/5"
                                    : "border-card-border/40 text-muted-foreground/40 group-hover:text-primary group-hover:border-primary/30"
                            }`}>
                                <FiArrowRight size={14} />
                            </div>

                        </div>
                    </Link>
                );
            })}
        </div>
    );
}