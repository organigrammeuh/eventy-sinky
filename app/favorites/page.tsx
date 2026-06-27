"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiClock, FiMapPin, FiCalendar, FiTrash2, FiUser, FiHeart, FiArrowRight } from "react-icons/fi";

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

function getFavoriteIds(): string[] {
    try {
        return JSON.parse(localStorage.getItem("eventsync_favorites") ?? "[]");
    } catch {
        return [];
    }
}

function removeFavorite(sessionId: string) {
    const favs = getFavoriteIds().filter((id) => id !== sessionId);
    localStorage.setItem("eventsync_favorites", JSON.stringify(favs));
}

export default function FavoritesPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ids = getFavoriteIds();
        if (ids.length === 0) {
            setLoading(false);
            return;
        }

        Promise.all(
            ids.map((id) =>
                fetch(`/api/sessions/${id}`)
                    .then((r) => (r.ok ? r.json() : null))
                    .catch(() => null)
            )
        ).then((results) => {
            setSessions(
                results
                    .filter(Boolean)
                    .sort(
                        (a: Session, b: Session) =>
                            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                    )
            );
            setLoading(false);
        });
    }, []);

    const handleRemove = (sessionId: string) => {
        removeFavorite(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    };

    return (
        <main className="w-screen min-h-screen relative backdrop-blur-[2px] mt-8 text-foreground px-4 py-16 md:px-12 lg:px-20 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-accent/4 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10 text-left">

                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-card-border/40 pb-6">
                    <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center gap-1.5 self-start text-[10px] font-black uppercase tracking-widest text-primary bg-primary/20 border border-primary/20 px-3 py-0.5 rounded-full shadow-sm">
                            <FiHeart size={11} className="fill-current" />
                            My Itinerary
                        </span>
                        <h1 className="font-[family-name:var(--font-syne)] mt-4 text-3xl md:text-4xl font-extrabold tracking-tight gradient-brand-text mt-1">
                            Saved Sessions
                        </h1>
                        <p className="text-sm text-muted-foreground/90 max-w-md">
                            Your personalized sequence of events saved locally to your current workspace browser.
                        </p>
                    </div>
                    <div className="text-[12px] font-bold text-muted-foreground/80 uppercase tracking-wider bg-muted/10 px-3 py-1.5 rounded-xl border border-card-border/30 shrink-0 self-start md:self-end">
                        Total: {sessions.length} Slots
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass rounded-2xl p-6 border border-card-border/30 flex items-center justify-between animate-pulse">
                                <div className="space-y-2.5 w-2/3">
                                    <div className="h-4 bg-muted/60 rounded-md w-3/4" />
                                    <div className="h-3 bg-muted/40 rounded-md w-1/2" />
                                </div>
                                <div className="w-8 h-8 rounded-xl bg-muted/50" />
                            </div>
                        ))}
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="glass rounded-[32px] p-12 text-center border border-card-border/30 max-w-md mx-auto mt-8 flex flex-col items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-card-border/60 text-muted-foreground/60 flex items-center justify-center">
                            <FiHeart size={20} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-[family-name:var(--font-syne)] text- font-bold tracking-tight">Your agenda is empty</h3>
                            <p className="text-xs text-muted-foreground/70 max-w-[240px] mx-auto leading-relaxed">
                                You haven't favorited any event lineups yet.
                            </p>
                        </div>
                        <Link href="/sessions" className="no-underline w-full mt-2">
                            <button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground/80 text-sm font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 group">
                                <span>Browse Live Schedule</span>
                                <FiArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3.5">
                        {sessions.map((s) => {
                            const live = isLive(s);
                            return (
                                <div
                                    key={s.id}
                                    className={`glass rounded-2xl border transition-all duration-300 flex items-center justify-between gap-6 p-4 md:p-5 relative overflow-hidden group ${
                                        live
                                            ? "border-live/60 bg-gradient-to-r from-live/5 via-transparent to-transparent shadow-sm"
                                            : "border-card-border/40 hover:border-primary/30"
                                    }`}
                                >
                                    {live && (
                                        <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-live" />
                                    )}

                                    <Link href={`/sessions/${s.id}`} className="no-underline flex-1 min-w-0">
                                        <div className="flex flex-col gap-1.5 text-left">

                                            <div className="flex items-center gap-2 flex-wrap">
                                                {live && (
                                                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-white bg-live/80 border border-live px-2 py-0.5 rounded-md shadow-sm mr-1">
                                                        <span className="live-dot shrink-0" />
                                                        Live Now
                                                    </span>
                                                )}
                                                <h3 className="font-[family-name:var(--font-syne)] text-sm md:text-base font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                                                    {s.title}
                                                </h3>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wide">
                                                <div className="flex items-center gap-1">
                                                    <FiCalendar size={11} className="text-primary" />
                                                    <span>{fmtDate(s.startTime)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FiClock size={11} className="text-accent" />
                                                    <span>{fmt(s.startTime)} – {fmt(s.endTime)}</span>
                                                </div>
                                                {s.room && (
                                                    <div className="flex items-center gap-1">
                                                        <FiMapPin size={11} className="text-primary" />
                                                        <span>{s.room.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {s.speakers && s.speakers.length > 0 && (
                                                <p className="text-[11px] font-bold text-card-foreground/50 tracking-tight flex items-center gap-1 mt-1 truncate">
                                                    <FiUser size={12} />
                                                    <span>With {s.speakers.map((sp) => sp.fullName).join(", ")}</span>
                                                </p>
                                            )}
                                        </div>
                                    </Link>

                                    <button
                                        onClick={() => handleRemove(s.id)}
                                        title="Remove from itinerary"
                                        className="w-9 h-9 rounded-xl bg-muted hover:bg-destructive/10 border border-card-border/60 hover:border-destructive/40 text-muted-foreground/80 hover:text-destructive flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-sm"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}