import Link from "next/link";
import { FiArrowLeft, FiClock, FiCalendar, FiUser, FiLayers, FiRadio } from "react-icons/fi";

type Speaker = { id: string; fullName: string };
type Room = { id: string; name: string };
type Session = {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    room: Room;
    speakers?: Speaker[];
};

type RoomDetailProps = {
    params: Promise<{ roomId: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function fmt(d: string) {
    return new Date(d).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}

function isLive(s: Session) {
    const now = new Date();
    return new Date(s.startTime) <= now && new Date(s.endTime) >= now;
}

export default async function RoomDetailPage({ params }: RoomDetailProps) {
    const { roomId } = await params;

    let sessions: Session[] = [];
    let roomName = "";

    try {
        const res = await fetch(`${BASE_URL}/api/rooms/${roomId}/sessions`, {
            cache: "no-store",
        });
        if (res.ok) {
            sessions = await res.json();
            if (sessions.length > 0) roomName = sessions[0].room?.name ?? "";
        }
    } catch {}

    if (!roomName) {
        try {
            const res = await fetch(`${BASE_URL}/api/rooms`, { cache: "no-store" });
            if (res.ok) {
                const rooms: Room[] = await res.json();
                roomName = rooms.find((r) => r.id === roomId)?.name ?? "Hall";
            }
        } catch {}
    }

    const sorted = [...sessions].sort((a, b) => {
        const aLive = isLive(a);
        const bLive = isLive(b);
        if (aLive && !bLive) return -1;
        if (!aLive && bLive) return 1;
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    return (
        <main className="w-screen min-h-screen mt-8 relative backdrop-blur-[2px] text-foreground px-4 py-12 md:px-12 lg:px-20 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[400px] bg-accent/4 rounded-full blur-[130px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10 text-left flex flex-col gap-8">

                <Link href="/rooms" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-white/50 hover:text-primary uppercase transition-colors no-underline group self-start">
                    <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Rooms</span>
                </Link>

                <div className=" rounded-[32px] p-6 md:p-8 border border-card-border/40 bg-card/80 shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center shadow-sm shrink-0">
                            <FiLayers size={22} />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] font-black tracking-widest uppercase text-accent bg-accent-muted border border-accent/50 px-2.5 py-0.5 rounded-md mb-1.5 inline-block">
                                Venue Hub
                            </span>
                            <h1 className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-extrabold tracking-tight gradient-brand-text leading-tight truncate">
                                {roomName}
                            </h1>
                        </div>
                    </div>

                    <div className="bg-background/40 border border-card-border/40 rounded-xl px-4 py-2 text-[11px] font-bold tracking-wide uppercase text-muted-foreground/60 shrink-0 self-start sm:self-center">
                        Scheduled Lines: <span className="text-foreground font-black ml-1">{sorted.length}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex items-center gap-2 px-1">
                        <FiRadio size={15} className="text-primary" />
                        <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold text-white/70 tracking-tight">
                            Time Allocations & Lineups
                        </h2>
                    </div>

                    {sorted.length === 0 ? (
                        <div className="glass rounded-2xl p-10 text-center border border-card-border/30 text-muted-foreground/90 text font-medium bg-muted/10">
                            No presentation tracks scheduled in this room today.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3.5">
                            {sorted.map((s) => {
                                const live = isLive(s);
                                return (
                                    <Link key={s.id} href={`/sessions/${s.id}`} className="no-underline group">
                                        <div
                                            className={`rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 relative overflow-hidden ${
                                                live
                                                    ? "border-live/40 bg-gradient-to-br from-live/70 to-card/50 shadow-sm"
                                                    : "glass border-card-border/40 hover:border-primary/30"
                                            }`}
                                        >
                                            {live && (
                                                <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-live" />
                                            )}

                                            <div className="min-w-0 flex-1 flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {live && (
                                                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-white bg-live border border-live px-2 py-0.5 rounded-md shadow-sm mr-1">
                                                            Live
                                                        </span>
                                                    )}
                                                    <h3 className={`font-[family-name:var(--font-syne)] text-sm md:text-base font-extrabold tracking-tight text-foreground/80 transition-colors leading-snug 
                                                        ${live ? "group-hover:text-white":"group-hover:text-primary"} `}>
                                                        {s.title}
                                                    </h3>
                                                </div>

                                                {s.speakers && s.speakers.length > 0 && (
                                                    <div className={`text-[11px] tracking-tight flex items-center gap-1 ${live ? "text-card-foreground/70": "text-muted-foreground/80"}`}>
                                                        <FiUser size={12} className="text-primary" />
                                                        <span>Hosted by {s.speakers.map((sp) => sp.fullName).join(", ")}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-row md:flex-col gap-2 md:items-end justify-start md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-card-border/20 shrink-0">
                                                <div className="bg-background/40 border border-card-border/40 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                                                    <FiCalendar size={11} className="text-primary" />
                                                    <span className="text-[11px] font-black tracking-tight text-foreground/80">{fmtDate(s.startTime)}</span>
                                                </div>
                                                <div className="bg-background/40 border border-card-border/40 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                                                    <FiClock size={11} className="text-accent" />
                                                    <span className="text-[10px] font-black tracking-tight text-foreground/80">{fmt(s.startTime)} – {fmt(s.endTime)}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}