"use client";

import SessionCarousel from "@/constants/SessionCarousel";
import {MOCK_SESSIONS} from "@/mock/session";

export function SessionsPage() {
    return (
        <main className="bg-[rgba(255,255,255,0.88)]">
            <section style={{maxWidth: "1200px", margin: "0 auto", padding: "56px 24px"}}>
                <div style={{
                    marginBottom: "28px",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between"
                }}>
                    <div>
                        <p style={{
                            fontSize: "12px", fontWeight: 600,
                            color: "#534AB7", letterSpacing: "0.08em",
                            textTransform: "uppercase", marginBottom: "6px",
                        }}>
                            New Conference · June 09 2026
                        </p>
                        <h2 style={{
                            fontFamily: "var(--font-syne)",
                            fontSize: "26px", fontWeight: 700,
                            color: "rgba(61,15,69,0.55)", margin: 0,
                        }}>
                            Sessions
                        </h2>
                    </div>
                    <a href="/events/mock/sessions" style={{
                        fontSize: "15px", fontWeight: 500,
                        color: "#534AB7", textDecoration: "none",
                        padding: "8px 16px", borderRadius: "50px",
                        border: "0.5px solid rgba(83,74,183,0.3)",
                        transition: "background 0.2s",
                    }}>
                        View whole planning →
                    </a>
                </div>

                <SessionCarousel sessions={MOCK_SESSIONS}/>
            </section>
        </main>
    );
}
