"use client";

import { useRef } from "react";
import SessionCard from "@/constants/SessionCard";
import {Session} from "@/mock/session";


export default function SessionCarousel({ sessions }: { sessions: Session[] }) {
    const ref = useRef<HTMLDivElement>(null);

    const scroll = (dir: "left" | "right") => {
        if (!ref.current) return;
        ref.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
    };

    return (
        <div style={{ position: "relative" }}>
            {(["left", "right"] as const).map((dir) => (
                <button
                    key={dir}
                    onClick={() => scroll(dir)}
                    style={{
                        position: "absolute",
                        top: "50%",
                        [dir === "left" ? "left" : "right"]: "-20px",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        width: "40px", height: "40px",
                        borderRadius: "50%",
                        border: "solid rgba(83,74,183,0.2)",
                        background: "white",
                        boxShadow: "0 2px 12px rgba(83,74,183,0.12)",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "16px", color: "#534AB7",
                        transition: "background 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#EEEDFE";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "white";
                    }}
                >
                    {dir === "left" ? "←" : "→"}
                </button>
            ))}

            <div
                ref={ref}
                style={{
                    display: "flex",
                    gap: "30px",
                    overflowX: "auto",
                    paddingBlock: "50px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {sessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                ))}
            </div>

            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
}
