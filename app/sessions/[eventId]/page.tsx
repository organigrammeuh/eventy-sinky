"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Speaker = {
    id: string;
    fullName: string;
    profilePicture?: string;
};

type Session = {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    room?: string;
    room_name?: string;
    capacity?: number;
    speakers?: Speaker[];
};

type Event = {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location?: string;
    sessions?: Session[];
};

function isLive(s: Session) {
    const now = new Date();
    return new Date(s.startTime) <= now && new Date(s.endTime) >= now;
}

function fmt(d: string) {
    return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function groupByDate(sessions: Session[]) {
    const map = new Map<string, Session[]>();
    for (const s of sessions) {
        const key = new Date(s.startTime).toDateString();
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(s);
    }
    return map;
}

function groupByRoom(sessions: Session[]) {
    const map = new Map<string, Session[]>();
    for (const s of sessions) {
        const room = s.room ?? s.room_name ?? "Sans salle";
        if (!map.has(room)) map.set(room, []);
        map.get(room)!.push(s);
    }
    return map;
}

function getTimeRange(sessions: Session[]) {
    if (!sessions.length) return { min: 8, max: 20 };
    const hours = sessions.flatMap((s) => [new Date(s.startTime).getHours(), new Date(s.endTime).getHours()]);
    return { min: Math.max(0, Math.min(...hours) - 1), max: Math.min(24, Math.max(...hours) + 1) };
}

export default function EventSessionsPage() {
    const params = useParams();
    const eventId = params?.eventId as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [view, setView] = useState<"agenda" | "list">("agenda");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!eventId) return;
        Promise.all([
            fetch(`/api/events/${eventId}`).then((r) => r.json()),
            fetch(`/api/events/${eventId}/sessions`).then((r) => r.json()),
        ])
            .then(([ev, sess]) => {
                setEvent(ev);
                setSessions(Array.isArray(sess) ? sess : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [eventId]);

    const sorted = [...sessions].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const byDate = groupByDate(sorted);

    const rooms = Array.from(new Set(sorted.map((s) => s.room ?? s.room_name ?? "Sans salle")));

    return (
        <main style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--background)" }}>
            <div style={{ borderBottom: "1px solid var(--border)", background: "var(--card)", padding: "28px 24px 24px" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <Link href="/sessions" style={{ fontSize: "13px", color: "var(--muted-foreground)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
                        ← Toutes les sessions
                    </Link>
                    {loading || !event ? (
                        <div className="skeleton" style={{ height: "32px", width: "300px", borderRadius: "var(--radius-md)" }} />
                    ) : (
                        <>
                            <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "6px" }}>
                                {event.title}
                            </h1>
                            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
                  {fmtDate(event.startDate)}
                </span>
                                {event.location && (
                                    <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
                    📍 {event.location}
                  </span>
                                )}
                                <span className="badge badge-primary">
                  {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                </span>
                                {rooms.length > 1 && (
                                    <span className="badge badge-accent">
                    {rooms.length} salles
                  </span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
                    {(["agenda", "list"] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            style={{
                                padding: "8px 18px",
                                borderRadius: "var(--radius-lg)",
                                border: "1px solid var(--border)",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: 500,
                                background: view === v ? "var(--primary)" : "var(--card)",
                                color: view === v ? "var(--primary-foreground)" : "var(--muted-foreground)",
                                transition: "all 0.2s",
                            }}
                        >
                            {v === "agenda" ? "Agenda" : "Liste"}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ display: "grid", gap: "12px" }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton" style={{ height: "72px", borderRadius: "var(--radius-lg)" }} />
                        ))}
                    </div>
                ) : sessions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted-foreground)" }}>
                        Aucune session pour cet événement.
                    </div>
                ) : view === "list" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
                        {Array.from(byDate.entries()).map(([, dateSessions]) => (
                            <div key={dateSessions[0].startTime}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  <span style={{ fontFamily: "var(--font-syne)", fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>
                    {fmtDate(dateSessions[0].startTime)}
                  </span>
                                    <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {dateSessions.map((s) => {
                                        const live = isLive(s);
                                        const room = s.room ?? s.room_name;
                                        return (
                                            <div
                                                key={s.id}
                                                style={{
                                                    display: "flex",
                                                    gap: "20px",
                                                    padding: "16px 20px",
                                                    background: "var(--card)",
                                                    border: live ? "1px solid var(--primary)" : "1px solid var(--card-border)",
                                                    borderLeft: `3px solid ${live ? "var(--primary)" : "var(--accent)"}`,
                                                    borderRadius: "var(--radius-lg)",
                                                }}
                                            >
                                                <div style={{ textAlign: "right", minWidth: "60px", flexShrink: 0, paddingTop: "2px" }}>
                                                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)" }}>{fmt(s.startTime)}</div>
                                                    <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{fmt(s.endTime)}</div>
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                                                        {live && <span className="badge badge-primary"><span className="live-dot" />Live</span>}
                                                        <span style={{ fontWeight: 600, fontSize: "15px", color: "var(--foreground)" }}>{s.title}</span>
                                                    </div>
                                                    {s.description && (
                                                        <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                            {s.description}
                                                        </p>
                                                    )}
                                                    <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                                                        {room && (
                                                            <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 500 }}>
                                📍 {room}
                              </span>
                                                        )}
                                                        {s.capacity && (
                                                            <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                                {s.capacity} places
                              </span>
                                                        )}
                                                        {s.speakers && s.speakers.length > 0 && (
                                                            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                                                {s.speakers.map((sp) => (
                                                                    <Link key={sp.id} href={`/speakers/${sp.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                                                                        {sp.profilePicture ? (
                                                                            <img src={sp.profilePicture} alt={sp.fullName} style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover" }} />
                                                                        ) : (
                                                                            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "var(--primary-muted)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 700 }}>
                                                                                {getInitials(sp.fullName)}
                                                                            </div>
                                                                        )}
                                                                        <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{sp.fullName}</span>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
                        {Array.from(byDate.entries()).map(([, dateSessions]) => {
                            const dateRooms = groupByRoom(dateSessions);
                            const dateRoomList = Array.from(dateRooms.keys());
                            const { min: minH, max: maxH } = getTimeRange(dateSessions);
                            const totalMinutes = (maxH - minH) * 60;
                            const PX_PER_MIN = 1.4;
                            const totalHeight = totalMinutes * PX_PER_MIN;

                            return (
                                <div key={dateSessions[0].startTime}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <span style={{ fontFamily: "var(--font-syne)", fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>
                      {fmtDate(dateSessions[0].startTime)}
                    </span>
                                        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                                    </div>

                                    <div style={{ overflowX: "auto" }}>
                                        <div style={{ display: "flex", minWidth: `${dateRoomList.length * 220 + 60}px` }}>
                                            <div style={{ width: "56px", flexShrink: 0 }}>
                                                <div style={{ height: "40px" }} />
                                                <div style={{ position: "relative", height: `${totalHeight}px` }}>
                                                    {Array.from({ length: maxH - minH + 1 }, (_, i) => minH + i).map((h) => (
                                                        <div
                                                            key={h}
                                                            style={{
                                                                position: "absolute",
                                                                top: `${(h - minH) * 60 * PX_PER_MIN}px`,
                                                                right: "8px",
                                                                fontSize: "11px",
                                                                color: "var(--muted-foreground)",
                                                                transform: "translateY(-6px)",
                                                            }}
                                                        >
                                                            {String(h).padStart(2, "0")}:00
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {dateRoomList.map((room) => (
                                                <div key={room} style={{ flex: 1, minWidth: "200px", marginRight: "8px" }}>
                                                    <div style={{
                                                        height: "40px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        paddingLeft: "8px",
                                                        marginBottom: "0",
                                                    }}>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>
                              {room}
                            </span>
                                                    </div>

                                                    <div style={{ position: "relative", height: `${totalHeight}px`, background: "var(--card)", border: "1px solid var(--card-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                                                        {Array.from({ length: maxH - minH + 1 }, (_, i) => minH + i).map((h) => (
                                                            <div
                                                                key={h}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: `${(h - minH) * 60 * PX_PER_MIN}px`,
                                                                    left: 0,
                                                                    right: 0,
                                                                    height: "1px",
                                                                    background: "var(--border)",
                                                                    opacity: 0.5,
                                                                }}
                                                            />
                                                        ))}

                                                        {dateRooms.get(room)!.map((s) => {
                                                            const startMin =
                                                                (new Date(s.startTime).getHours() - minH) * 60 +
                                                                new Date(s.startTime).getMinutes();
                                                            const endMin =
                                                                (new Date(s.endTime).getHours() - minH) * 60 +
                                                                new Date(s.endTime).getMinutes();
                                                            const top = startMin * PX_PER_MIN;
                                                            const height = Math.max((endMin - startMin) * PX_PER_MIN, 28);
                                                            const live = isLive(s);

                                                            return (
                                                                <div
                                                                    key={s.id}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: `${top}px`,
                                                                        left: "4px",
                                                                        right: "4px",
                                                                        height: `${height}px`,
                                                                        background: live ? "var(--primary)" : "var(--primary-muted)",
                                                                        border: `1px solid ${live ? "var(--primary)" : "var(--border)"}`,
                                                                        borderLeft: `3px solid var(--primary)`,
                                                                        borderRadius: "6px",
                                                                        padding: "5px 8px",
                                                                        overflow: "hidden",
                                                                        cursor: "default",
                                                                    }}
                                                                >
                                                                    <div style={{ fontSize: "11px", fontWeight: 700, color: live ? "var(--primary-foreground)" : "var(--primary)", lineHeight: 1.3, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                                                        {s.title}
                                                                    </div>
                                                                    {height > 40 && (
                                                                        <div style={{ fontSize: "10px", color: live ? "rgba(255,255,255,0.75)" : "var(--muted-foreground)", marginTop: "2px" }}>
                                                                            {fmt(s.startTime)} – {fmt(s.endTime)}
                                                                        </div>
                                                                    )}
                                                                    {height > 60 && s.speakers && s.speakers.length > 0 && (
                                                                        <div style={{ fontSize: "10px", color: live ? "rgba(255,255,255,0.7)" : "var(--muted-foreground)", marginTop: "2px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                                                            {s.speakers.map((sp) => sp.fullName).join(", ")}
                                                                        </div>
                                                                    )}
                                                                    {live && (
                                                                        <div style={{ position: "absolute", top: "5px", right: "5px" }}>
                                                                            <span className="live-dot" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}