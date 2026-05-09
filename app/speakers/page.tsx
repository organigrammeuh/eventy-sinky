import { Speaker } from "@/lib/types";
import Link from "next/link";

const fetchAllSpeakers = async (): Promise<Speaker[]> => {
    const res = await fetch("http://localhost:3000/api/speakers");
    const rawSpeakers = await res.json();
    return rawSpeakers;
};

const getLinkLabel = (link: string) => {
    try {
        return new URL(link).hostname;
    } catch {
        return link;
    }
};

const getInitials = (fullName: string) => {
    if (!fullName) return "?";
    return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export default async function SpeakersPage() {
    const speakers: Speaker[] = await fetchAllSpeakers();

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
                    Meet the{" "}
                    <span style={{ color: "#afafef" }}>Speakers</span>
                </h1>

                <p style={{
                    fontSize: "16px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.65)",
                    maxWidth: "420px",
                    lineHeight: 1.75,
                    position: "relative",
                }}>
                    The people behind the sessions — from les quatre coins du monde.
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
                            EventSync · {speakers.length} speaker{speakers.length !== 1 ? "s" : ""}
                        </p>
                        <h2 style={{
                            fontFamily: "var(--font-syne)",
                            fontSize: "26px", fontWeight: 700,
                            color: "rgba(61,15,69,0.55)", margin: 0,
                        }}>
                            Line-up
                        </h2>
                    </div>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "24px",
                }}>
                    {speakers.map((speaker) => (
                        <div key={speaker.id} style={{
                            background: "white",
                            borderRadius: "16px",
                            padding: "24px",
                            border: "0.5px solid rgba(83,74,183,0.12)",
                            boxShadow: "0 2px 16px rgba(83,74,183,0.06)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            alignItems: "center",
                            textAlign: "center",
                        }}>
                            {speaker.profilePicture ? (
                                <img
                                    src={speaker.profilePicture}
                                    alt={speaker.fullName}
                                    style={{
                                        width: "72px", height: "72px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "2px solid rgba(83,74,183,0.2)",
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: "72px", height: "72px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #534AB7, #861d9e)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "22px", fontWeight: 700, color: "white",
                                    fontFamily: "var(--font-syne)",
                                }}>
                                    {getInitials(speaker.fullName)}
                                </div>
                            )}

                            <p style={{
                                fontFamily: "var(--font-syne)",
                                fontSize: "17px", fontWeight: 700,
                                color: "#26215C", margin: 0,
                            }}>
                                {speaker.fullName}
                            </p>

                            {speaker.bio && (
                                <p style={{
                                    fontSize: "13px",
                                    color: "rgba(61,15,69,0.55)",
                                    lineHeight: 1.65,
                                    margin: 0,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}>
                                    {speaker.bio}
                                </p>
                            )}

                            <hr style={{ border: "none", borderTop: "0.5px solid rgba(83,74,183,0.12)", margin: "4px 0", width: "100%" }} />

                            <p style={{ fontSize: "12px", color: "#534AB7", fontWeight: 600, margin: 0 }}>
                                {speaker.sessions?.length ?? 0} session{(speaker.sessions?.length ?? 0) !== 1 ? "s" : ""}
                            </p>

                            {speaker.socialLinks && speaker.socialLinks.length > 0 && (
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                                    {speaker.socialLinks.map((link, i) => (
                                        <a key={i} href={link} target="_blank" rel="noopener noreferrer" style={{
                                            fontSize: "11px", color: "#534AB7",
                                            textDecoration: "none",
                                            padding: "3px 10px",
                                            borderRadius: "50px",
                                            border: "0.5px solid rgba(83,74,183,0.3)",
                                        }}>
                                            {getLinkLabel(link)}
                                        </a>
                                    ))}
                                </div>
                            )}

                            <Link href={`/speakers/${speaker.id}`} style={{ width: "100%", marginTop: "auto" }}>
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
                                }}>
                                    View profile →
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}