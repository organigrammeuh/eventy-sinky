import Link from "next/link";
import { FiArrowLeft, FiClock, FiMapPin, FiCalendar, FiVideo, FiArrowUpRight } from "react-icons/fi";
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe } from "react-icons/fa6";
import { Speaker } from "@/types/speakers";


type SpeakerProps = {
    params: Promise<{ speakerId: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

const getInitials = (fullName: string) => {
    if (!fullName) return "?";
    return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const formatSessionDateTime = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    const day = d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
    const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    return { day, time };
};

const getSocialIcon = (link: string) => {
    const url = link.toLowerCase();
    if (url.includes("linkedin.com")) return <FaLinkedin size={18} className="text-[#0077B5]" />;
    if (url.includes("twitter.com") || url.includes("x.com")) return <FaTwitter size={18} />;
    if (url.includes("github.com")) return <FaGithub size={18} />;
    return <FaGlobe size={18} className="text-accent" />;
};

export default async function SpeakerProfilePage({ params }: SpeakerProps) {
    const { speakerId } = await params;

    const speakerRes = await fetch(`${BASE_URL}/api/speakers/${speakerId}`, {
        cache: "no-store",
    });

    if (!speakerRes.ok) {
        return (
            <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
                <p className="text-muted-foreground text-sm mb-4">Speaker profile could not be found.</p>
                <Link href="/speakers" className="text-xs font-bold text-primary flex items-center gap-2 no-underline">
                    <FiArrowLeft /> Back to directory
                </Link>
            </div>
        );
    }

    const speaker: Speaker = await speakerRes.json();

    return (
        <div className="w-screen min-h-screen relative mt-8 backdrop-blur-[2px] text-foreground px-4 py-12 md:px-12 lg:px-20 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[700px] h-[500px] bg-primary/3 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-accent/3 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-5">

                <Link href="/speakers" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground/80 hover:text-primary uppercase transition-colors no-underline group self-start">
                    <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Directory</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                    <div className="lg:col-span-4 glass rounded-[32px] p-8 border border-card-border/40 bg-gradient-to-b from-card/80 to-card/20 flex flex-col items-center text-center justify-between relative overflow-hidden min-h-[400px]">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex flex-col items-center w-full mt-4">
                            {speaker.profilePicture ? (
                                <div className="relative p-2 rounded-[28px] border border-card-border/60 bg-background/50 mb-6 group">
                                    <img
                                        src={speaker.profilePicture}
                                        alt={speaker.fullName}
                                        className="w-32 h-32 rounded-[20px] object-cover bg-muted shadow-inner relative z-10"
                                    />
                                    <div className="absolute inset-2 bg-primary/20 rounded-[20px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-[24px] bg-gradient-to-tr from-primary to-accent text-primary-foreground font-extrabold flex items-center justify-center text-4xl font-[family-name:var(--font-syne)] shadow-md mb-6">
                                    {getInitials(speaker.fullName)}
                                </div>
                            )}

                            <h1 className="font-[family-name:var(--font-syne)] text-2xl font-extrabold tracking-tight text-foreground leading-tight px-2">
                                {speaker.fullName}
                            </h1>
                        </div>

                        {speaker.socialLinks && speaker.socialLinks.length > 0 && (
                            <div className="flex items-center justify-center gap-2.5 bg-background/40 border border-card/30 rounded-2xl px-5 py-3 w-full backdrop-blur-md">
                                {speaker.socialLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-xl bg-primary-muted/50 border border-primary/50 hover:border-primary/40 text-muted-foreground hover:text-primary flex items-center justify-center transition-all duration-200 hover:scale-105"
                                    >
                                        {getSocialIcon(link)}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-8 glass rounded-[32px] p-6 md:p-10 border border-card-border/40 bg-card/40 flex flex-col justify-center text-left relative overflow-hidden">
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                        <span className="text-[10px] font-black tracking-widest uppercase text-primary mb-3 block">
                            Biography
                        </span>

                        {speaker.bio ? (
                            <p className="font-[family-name:var(--font-syne)] text-base md:text-sm font-medium text-foreground/70 leading-relaxed tracking-tight">
                                "{speaker.bio}"
                            </p>
                        ) : (
                            <p className="text-xs text-muted-foreground/50 italic">
                                No personal bio details updated yet for this speaker profile.
                            </p>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                    <div className="border-b border-card-border/30 pb-4 mb-2">
                        <h2 className="font-[family-name:var(--font-syne)] text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2">
                            <FiVideo size={14} className="text-primary" />
                            <span>Event Schedule ({speaker.sessions?.length ?? 0})</span>
                        </h2>
                    </div>

                    {speaker.sessions && speaker.sessions.length > 0 ? (
                        <div className="relative border-l border-card-border/40 py-5 pl-6 ml-3 space-y-8 py-2 bg-card/70 rounded-tr-2xl rounded-b-2xl">
                            {speaker.sessions.map((session: any) => {
                                const { day, time } = formatSessionDateTime(session.startTime);
                                return (
                                    <div key={session.id} className="relative group">
                                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-background border-2 border-primary group-hover:bg-primary transition-colors duration-300 ring-4 ring-background" />

                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-black tracking-tight text-muted-foreground/70 uppercase">
                                                <span className="text-primary font-bold">{day}</span>
                                                <span className="text-muted-foreground/50">•</span>
                                                <span>{time}</span>
                                            </div>

                                            <Link href={`/sessions/${session.id}`} className="no-underline block max-w-xl">
                                                <h3 className="font-[family-name:var(--font-syne)] text-base/50 font-bold tracking-tight text-foreground group-hover:text-primary transition-colors inline-flex items-center gap-1.5 leading-snug">
                                                    <span>{session.title}</span>
                                                    <FiArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                                                </h3>
                                            </Link>

                                            {session.room?.name && (
                                                <span className="inline-flex items-center gap-1 text-[12px] mt-2 font-bold text-accent bg-accent-muted border border-accent/10 px-2 py-0.5 rounded-md self-start">
                                                    <FiMapPin size={9} /> {session.room.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="glass rounded-2xl p-8 text-center border border-card-border/30 text-muted-foreground/50 text-xs font-medium">
                            No scheduled presentations found for this speaker.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}