"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Speaker = { id: string; fullName: string };
type Room = { id: string; name: string };
type Session = {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    room: Room;
    speakers?: Speaker[];
    isLive?: boolean;
};

function fmt(d: string) {
    return new Date(d).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
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
        <main className="pt-20 min-h-screen backdrop-blur-[2px]">
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-2">Mes favoris</h1>
                <p className="text-sm text-muted-foreground mb-6">
                    Votre itinéraire personnel (stocké localement)
                </p>

                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-16 bg-gray-200 rounded-lg animate-pulse"
                            />
                        ))}
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <p className="mb-3">Aucun favori pour l'instant.</p>
                        <Link href="/sessions" className="text-primary underline text-sm">
                            Explorer les sessions →
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {sessions.map((s) => {
                            const live = isLive(s);
                            return (
                                <div
                                    key={s.id}
                                    className={`border rounded-lg p-4 flex items-start gap-3 ${
                                        live ? "border-primary" : ""
                                    }`}
                                >
                                    <Link
                                        href={`/sessions/${s.id}`}
                                        className="no-underline flex-1"
                                    >
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            {live && (
                                                <span className="badge badge-primary text-xs">
                          <span className="live-dot" />
                          Live
                        </span>
                                            )}
                                            <p className="font-medium text-sm">{s.title}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {fmtDate(s.startTime)} · {fmt(s.startTime)} –{" "}
                                            {fmt(s.endTime)}
                                            {s.room && ` · ${s.room.name}`}
                                        </p>
                                        {s.speakers && s.speakers.length > 0 && (
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {s.speakers.map((sp) => sp.fullName).join(", ")}
                                            </p>
                                        )}
                                    </Link>

                                    <button
                                        onClick={() => handleRemove(s.id)}
                                        title="Retirer des favoris"
                                        className="text-xl cursor-pointer border-none bg-transparent text-yellow-500 shrink-0"
                                    >
                                        ★
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