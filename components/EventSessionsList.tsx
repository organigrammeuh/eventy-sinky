import Link from "next/link";
import { FiClock, FiMapPin, FiArrowRight, FiActivity } from "react-icons/fi";
import { Session } from "@/types/sessions";

function fmtTime(d: string) {
    return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function EventSessionList({ sessions }: { sessions: Session[] }) {
    return (
        <div className="flex flex-col gap-3.5 w-full">
            {sessions.map((s) => (
                <Link href={`/sessions/${s.id}`} key={s.id} className="no-underline group block w-full">
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
                        <div className="flex items-center gap-4 min-w-0 flex-1 text-left">
                            <div className="w-11 h-11 rounded-xl bg-muted/60 border border-card-border/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 flex items-center justify-center shrink-0 transition-colors duration-300">
                                <FiActivity size={18} />
                            </div>

                            <div className="min-w-0 flex-1 pr-2">
                                <div className="flex items-center justify-between gap-2.5 mb-1 flex-wrap">
                                    <h4 className="font-[family-name:var(--font-syne)] text-sm font-extrabold text-foreground tracking-tight truncate max-w-[70%] group-hover:text-primary transition-colors">
                                        {s.title}
                                    </h4>

                                    <span className="text-[10px] font-bold text-primary bg-muted/50 px-2 py-0.5 rounded-md border border-card-primary shrink-0 flex items-center gap-1">
                                        <FiClock size={10} />
                                        {fmtTime(s.startTime)} - {fmtTime(s.endTime)}
                                    </span>
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
                        <div className="w-8 h-8 rounded-full border border-card-border/40 text-muted-foreground/40 group-hover:text-primary group-hover:border-primary/30 flex items-center justify-center shrink-0 transition-all duration-300 transform group-hover:translate-x-0.5">
                            <FiArrowRight size={14} />
                        </div>

                    </div>
                </Link>
            ))}
        </div>
    );
}