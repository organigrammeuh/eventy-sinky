"use client";

import Link from "next/link";
import {Session} from "@/mock/session";

const ROOM_COLORS: Record<string, { bg: string; text: string }> = {
    "Room A": { bg: "#EEEDFE", text: "#3C3489" },
    "Room B": { bg: "#E1F5EE", text: "#430850" },
    "Room C": { bg: "#FEF3E1", text: "#7a0045" },
};

const DEFAULT_COLOR = { bg: "#F3F4F6", text: "#374151" };

function fmt(iso: string) {
    return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function SessionCard({ session }: { session: Session }) {
    const color = ROOM_COLORS[session.room] ?? DEFAULT_COLOR;
    const live = !!session.isLive;

    return (
        <Link
            href={`/sessions/${session.id}`}
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "300px",
                flexShrink: 0,
                borderRadius: "20px",
                overflow: "hidden",
                textDecoration: "none",
                background: live ? "linear-gradient(135deg, #534AB7 0%, #3C3489 100%)" : "white",
                border: live ? "none" : "0.5px solid rgba(83,74,183,0.12)",
                boxShadow: live
                    ? "0 8px 32px rgba(83,74,183,0.3)"
                    : "0 2px 12px rgba(83,74,183,0.07)",
                transition: "transform 0.25s, box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-4px)";
                el.style.boxShadow = live
                    ? "0 16px 40px rgba(83,74,183,0.4)"
                    : "0 8px 28px rgba(83,74,183,0.14)";
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = live
                    ? "0 8px 32px rgba(83,74,183,0.3)"
                    : "0 2px 12px rgba(83,74,183,0.07)";
            }}
        >
            <div style={{
                height: "6px",
                background: live
                    ? "linear-gradient(, rgba(255,255,200), rgba(29,158,117))"
                    : `linear-gradient(, ${color.bg}, transparent)`,
            }} />

            <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>

                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                    {/* Room badge */}
                    <span style={{
                        fontSize: "11px", fontWeight: 600,
                        padding: "4px 10px", borderRadius: "50px",
                        background: live ? "rgba(255,255,255,0.15)" : color.bg,
                        color: live ? "rgba(255,255,255,0.9)" : color.text,
                        letterSpacing: "0.04em",
                        whiteSpace: "nowrap",
                    }}>
            {session.room}
          </span>

                    {/* Live badge or time */}
                    {live ? (
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: "5px",
                            fontSize: "10px", fontWeight: 700,
                            color: "white",
                            background: "rgba(255,255,255,0.15)",
                            padding: "4px 10px", borderRadius: "50px",
                            letterSpacing: "0.06em",
                            flexShrink: 0,
                        }}>
              <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "#4ade80", display: "inline-block",
              }} />
              LIVE
            </span>
                    ) : (
                        <span style={{
                            fontSize: "12px", fontWeight: 500,
                            color: "#6b6b8a",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                        }}>
              {fmt(session.startTime)}
            </span>
                    )}
                </div>

                {/* Title */}
                <h3 style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: "16px", fontWeight: 700,
                    color: live ? "white" : "#1a1a2e",
                    lineHeight: 1.35,
                    margin: 0,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                }}>
                    {session.title}
                </h3>

                {/* Description */}
                {session.description && (
                    <p style={{
                        fontSize: "13px", lineHeight: 1.6,
                        color: live ? "rgba(255,255,255,0.65)" : "#6b6b8a",
                        margin: 0,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                    }}>
                        {session.description}
                    </p>
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: "14px 20px",
                borderTop: live ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(83,74,183,0.07)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                {/* Speakers */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ display: "flex" }}>
                        {session.speakers.slice(0, 3).map((sp, i) => (
                            <div key={sp.id} style={{
                                width: "26px", height: "26px", borderRadius: "50%",
                                background: live ? "rgba(255,255,255,0.2)" : "#EEEDFE",
                                border: `2px solid ${live ? "rgba(255,255,255,0.3)" : "white"}`,
                                marginLeft: i === 0 ? 0 : "-8px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "10px", fontWeight: 700,
                                color: live ? "white" : "#534AB7",
                                flexShrink: 0, zIndex: 3 - i,
                                overflow: "hidden",
                            }}>
                                {sp.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                        ))}
                    </div>
                    <span style={{
                        fontSize: "12px",
                        color: live ? "rgba(255,255,255,0.7)" : "#6b6b8a",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        maxWidth: "120px",
                    }}>
            {session.speakers[0]?.fullName}
                        {session.speakers.length > 1 && ` +${session.speakers.length - 1}`}
          </span>
                </div>

                {/* Duration */}
                <span style={{
                    fontSize: "12px",
                    color: live ? "rgba(255,255,255,0.5)" : "#9ca3af",
                }}>
          {Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60_000)} min
        </span>
            </div>
        </Link>
    );
}
