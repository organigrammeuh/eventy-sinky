import { Event } from "@/lib/types";
import Link from "next/link";

const fetchAllEvents = async (): Promise<Event[]> => {
    const res = await fetch("http://localhost:3000/api/events");
    const rawEvents = await res.json();
    return rawEvents;
};

export const refractorDate = (e: Event) => {
    const months: string[] = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    const start =
        new Date(e.startDate).getDate() +
        " " +
        months[new Date(e.startDate).getMonth()] +
        " " +
        new Date(e.startDate).getFullYear();
    const end =
        new Date(e.endDate).getDate() +
        " " +
        months[new Date(e.endDate).getMonth()] +
        " " +
        new Date(e.endDate).getFullYear();
    return start + " – " + end;
};

export default async function EventsPage() {
    const events: Event[] = await fetchAllEvents();

    return (
        <div style={{ minHeight: "100svh", background: "#f7f7fb" }}>

            <section style={{
                minHeight: "52svh",
                background: "linear-gradient(135deg, #26215C 0%, #861d9e 55%, #534AB7 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "120px 24px 80px",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse 60% 50% at 70% 40%, rgba(29,158,117,0.18) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                <h1 style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: "clamp(32px, 5vw, 56px)",
                    fontWeight: 800,
                    color: "white",
                    lineHeight: 1.1,
                    maxWidth: "640px",
                    marginBottom: "16px",
                    position: "relative",
                }}>
                    All{" "}
                    <span style={{ color: "#afafef" }}>Events</span>
                </h1>

                <p style={{
                    fontSize: "16px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.65)",
                    maxWidth: "420px",
                    lineHeight: 1.75,
                    marginBottom: "0",
                    position: "relative",
                }}>
                    Browse conferences, meetups and workshops. Pick one and explore its sessions.
                </p>
            </section>

            <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 24px" }}>

                <div style={{
                    marginBottom: "32px",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                }}>
                    <div>
                        <p style={{
                            fontSize: "12px", fontWeight: 600,
                            color: "#534AB7", letterSpacing: "0.08em",
                            textTransform: "uppercase", marginBottom: "6px",
                        }}>
                            EventSync · {events.length} event{events.length !== 1 ? "s" : ""}
                        </p>
                        <h2 style={{
                            fontFamily: "var(--font-syne)",
                            fontSize: "26px", fontWeight: 700,
                            color: "rgba(61,15,69,0.55)", margin: 0,
                        }}>
                            Upcoming
                        </h2>
                    </div>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "24px",
                }}>
                    {events.map((e) => (
                        <div key={e.id} style={{
                            background: "white",
                            borderRadius: "16px",
                            padding: "24px",
                            border: "0.5px solid rgba(83,74,183,0.12)",
                            boxShadow: "0 2px 16px rgba(83,74,183,0.06)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}>
                            <p style={{
                                fontFamily: "var(--font-syne)",
                                fontSize: "18px",
                                fontWeight: 700,
                                color: "#26215C",
                                margin: 0,
                            }}>
                                {e.title}
                            </p>

                            <p style={{
                                fontSize: "14px",
                                color: "rgba(61,15,69,0.55)",
                                lineHeight: 1.65,
                                margin: 0,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}>
                                {e.description}
                            </p>

                            <hr style={{ border: "none", borderTop: "0.5px solid rgba(83,74,183,0.12)", margin: "4px 0" }} />

                            <p style={{ fontSize: "13px", color: "#534AB7", fontWeight: 500, margin: 0 }}>
                                {refractorDate(e)}
                            </p>
                            <p style={{ fontSize: "13px", color: "rgba(61,15,69,0.45)", margin: 0 }}>
                                📍 {e.location}
                            </p>

                            <Link href={`/events/${e.id}`} style={{ marginTop: "auto" }}>
                                <button style={{
                                    width: "100%",
                                    padding: "10px 0",
                                    background: "#534AB7",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50px",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    transition: "background 0.2s",
                                }}>
                                    View planning →
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}