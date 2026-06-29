"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiClock, FiMapPin, FiUsers, FiArrowLeft, FiHeart, FiMessageSquare, FiTrendingUp, FiUser, FiZap, FiActivity, FiCalendar } from "react-icons/fi";

type Speaker = {
    id: string;
    fullName: string;
    profilePicture?: string;
    bio?: string;
};

type Question = {
    id: string;
    content: string;
    name?: string;
    upvotes: number;
    createdAt: string;
    sessionId: string;
};

type Room = { id: string; name: string };

type Session = {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    room: Room;
    capacity?: number;
    speakers?: Speaker[];
    questions?: Question[];
    isLive?: boolean;
};

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtTime(d: string) {
    return new Date(d).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function getFavorites(): string[] {
    try {
        return JSON.parse(localStorage.getItem("eventsync_favorites") ?? "[]");
    } catch {
        return [];
    }
}

function toggleFavorite(sessionId: string): boolean {
    const favs = getFavorites();
    const idx = favs.indexOf(sessionId);
    if (idx === -1) {
        favs.push(sessionId);
        localStorage.setItem("eventsync_favorites", JSON.stringify(favs));
        return true;
    } else {
        favs.splice(idx, 1);
        localStorage.setItem("eventsync_favorites", JSON.stringify(favs));
        return false;
    }
}

function getUpvotedIds(): string[] {
    try { return JSON.parse(localStorage.getItem("eventsync_upvotes") ?? "[]"); }
    catch { return []; }
}

function markUpvoted(questionId: string) {
    const ids = getUpvotedIds();
    if (!ids.includes(questionId)) {
        ids.push(questionId);
        localStorage.setItem("eventsync_upvotes", JSON.stringify(ids));
    }
}

type SessionDetailClientProps = {
    initialSession: Session;
};

export default function SessionDetailClient({ initialSession }: SessionDetailClientProps) {
    const [session, setSession] = useState<Session>(initialSession);
    const [questions, setQuestions] = useState<Question[]>(
        [...(initialSession.questions ?? [])].sort((a, b) => b.upvotes - a.upvotes)
    );
    const [isFavorite, setIsFavorite] = useState(false);
    const [upvotedIds, setUpvotedIds] = useState<string[]>([]);

    const [newQuestionContent, setNewQuestionContent] = useState("");
    const [newQuestionName, setNewQuestionName] = useState("");
    const [submittingQuestion, setSubmittingQuestion] = useState(false);

    useEffect(() => {
        setIsFavorite(getFavorites().includes(initialSession.id));
        setUpvotedIds(getUpvotedIds());
    }, [initialSession.id]);

    const fetchSession = useCallback(async () => {
        try {
            const res = await fetch(`/api/sessions/${initialSession.id}`);
            if (!res.ok) return;
            const data: Session = await res.json();
            setSession(data);
            setQuestions([...(data.questions ?? [])].sort((a, b) => b.upvotes - a.upvotes));
        } catch {}
    }, [initialSession.id]);

    useEffect(() => {
        const interval = setInterval(fetchSession, 60_000);
        return () => clearInterval(interval);
    }, [fetchSession]);

    const handleUpvote = async (questionId: string) => {
        if (upvotedIds.includes(questionId)) return;
        try {
            const res = await fetch(`/api/questions/${questionId}/upvote`, {
                method: "POST",
            });
            if (!res.ok) return;
            const updated = await res.json();
            markUpvoted(questionId);
            setUpvotedIds((prev) => [...prev, questionId]);
            setQuestions((prev) =>
                [...prev.map((q) => (q.id === questionId ? updated : q))].sort(
                    (a, b) => b.upvotes - a.upvotes
                )
            );
        } catch { }
    };

    const handleSubmitQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQuestionContent.trim()) return;
        setSubmittingQuestion(true);
        try {
            const res = await fetch(`/api/sessions/${initialSession.id}/questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: newQuestionContent.trim(),
                    name: newQuestionName.trim() || undefined
                }),
            });
            if (res.ok) {
                const newQ = await res.json();
                setQuestions((prev) => [newQ, ...prev].sort((a, b) => b.upvotes - a.upvotes));
                setNewQuestionContent("");
                setNewQuestionName("");
            }
        } catch {} finally {
            setSubmittingQuestion(false);
        }
    };

    return (
        <div className="w-screen min-h-screen relative mt-8 backdrop-blur-[2px] text-foreground px-4 py-12 md:px-12 lg:px-20 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-primary/3 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[400px] bg-accent/3 rounded-full blur-[130px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10 text-left flex flex-col gap-6">

                <div className="flex items-center justify-between w-full">
                    <Link href="/sessions" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-white/50 hover:text-primary uppercase transition-colors no-underline group">
                        <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>All Lineups</span>
                    </Link>

                    <button
                        onClick={() => {
                            const nextState = toggleFavorite(session.id);
                            setIsFavorite(nextState);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                            isFavorite
                                ? "bg-primary border-primary text-primary-foreground shadow-sm"
                                : "glass border-card-border/60 text-muted-foreground hover:text-primary hover:border-primary/40"
                        }`}
                    >
                        <FiHeart className={isFavorite ? "fill-current" : ""} size={13} />
                        <span>{isFavorite ? "Saved to Itinerary" : "Add to Itinerary"}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">

                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <div className={`rounded-[32px] p-6 md:p-8 border relative overflow-hidden ${
                            session.isLive ? "border-live/70 bg-card/80" : "border-card-border/40 bg-card/60"
                        }`}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex items-center gap-2 mb-4">
                                {session.isLive && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-white bg-live border border-live px-2 py-0.5 rounded-md shadow-sm mr-1">
                                        <FiActivity size={10} /> Live Now
                                    </span>
                                )}
                                <span className="text-[10px] font-black tracking-widest text-primary uppercase bg-primary-muted/40 border border-primary/20 px-2.5 py-0.5 rounded-md">
                                    Presentation Track
                                </span>
                            </div>

                            <h1 className="font-[family-name:var(--font-syne)] text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
                                {session.title}
                            </h1>

                            <div className="text-sm text-card-foreground/80 leading-relaxed mb-8 space-y-4">
                                {session.description ? (
                                    <p className="whitespace-pre-line">{session.description}</p>
                                ) : (
                                    <p className="italic text-muted-foreground/60">No supplementary summaries cataloged for this agenda track.</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-card-border/30 pt-6">
                                <div className="bg-muted/40 border border-card-border/30 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                                    <FiCalendar size={14} className="text-primary shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider leading-none mb-0.5">Date</p>
                                        <p className="text-xs font-black tracking-tight truncate">{fmtDate(session.startTime)}</p>
                                    </div>
                                </div>

                                <div className="bg-muted/40 border border-card-border/30 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                                    <FiClock size={14} className="text-accent shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider leading-none mb-0.5">Timeline</p>
                                        <p className="text-xs font-black tracking-tight truncate">{fmtTime(session.startTime)} – {fmtTime(session.endTime)}</p>
                                    </div>
                                </div>

                                <div className="bg-muted/40 border border-card-border/30 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                                    <FiMapPin size={14} className="text-accent shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider leading-none mb-0.5">Room</p>
                                        <p className="text-xs font-black tracking-tight truncate">{session.room?.name || "Main Stage"}</p>
                                    </div>
                                </div>

                                {session.capacity && (
                                    <div className="bg-muted/40 border border-card-border/30 rounded-xl px-3 py-2.5 flex items-center gap-2.5 col-span-2 sm:col-span-1">
                                        <FiUsers size={14} className="text-accent shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider leading-none mb-0.5">Capacity</p>
                                            <p className="text-xs font-black tracking-tight truncate">{session.capacity} Slots</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-6 w-full">

                        <div className="glass rounded-[32px] p-5 border border-card-border/40 bg-card/40 flex flex-col gap-4">
                            <div className="flex items-center gap-2 px-1 border-b border-card-border/20 pb-3">
                                <FiUser size={14} className="text-primary" />
                                <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold text-white/80 tracking-tight">
                                    Track Speakers ({session.speakers?.length ?? 0})
                                </h2>
                            </div>

                            {session.speakers && session.speakers.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {session.speakers.map((sp) => (
                                        <Link href={`/speakers/${sp.id}`} key={sp.id} className="no-underline block group">
                                            <div className="flex items-center gap-3.5 bg-background/30 border border-card-border/40 rounded-2xl p-3 transition-colors hover:border-primary/30">
                                                {sp.profilePicture ? (
                                                    <img src={sp.profilePicture} alt={sp.fullName} className="w-10 h-10 rounded-xl object-cover shrink-0 bg-muted" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent text-white font-black text-xs flex items-center justify-center shrink-0">
                                                        {getInitials(sp.fullName)}
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1 text-left">
                                                    <h3 className="text-sm font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors leading-tight mb-0.5 truncate">
                                                        {sp.fullName}
                                                    </h3>
                                                    <p className="text-[11px] text-muted-foreground/70 line-clamp-1 leading-none">View Host Profile</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground/50 italic px-1">No panels are assigned to this block structure.</p>
                            )}
                        </div>

                        <div className="glass rounded-[32px] p-5 border border-card-border/40 bg-card/40 flex flex-col gap-4">
                            <div className="flex items-center justify-between px-1 border-b border-card-border/20 pb-3 flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <FiMessageSquare size={14} className="text-primary" />
                                    <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold text-white/80 tracking-tight">
                                        Audience Q&A Forum
                                    </h2>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/50 bg-background/40 border border-card-border/30 px-2 py-0.5 rounded-md">
                                    {questions.length} Questions
                                </div>
                            </div>

                            <form onSubmit={handleSubmitQuestion} className="bg-background/40 border border-card-border/40 rounded-2xl p-3.5 flex flex-col gap-2.5">
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                        <FiZap size={11} />
                                    </div>
                                    <textarea
                                        required
                                        value={newQuestionContent}
                                        onChange={(e) => setNewQuestionContent(e.target.value)}
                                        placeholder="Ask an anonymous or named public question..."
                                        disabled={!session.isLive}
                                        rows={2}
                                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none border-0 p-0 leading-snug disabled:opacity-50 disabled:cursor-not-allowed"
                                        maxLength={300}
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-card-border/20 flex-wrap sm:flex-nowrap">
                                    <input
                                        type="text"
                                        value={newQuestionName}
                                        onChange={(e) => setNewQuestionName(e.target.value)}
                                        placeholder="Your name (Optional)"
                                        disabled={!session.isLive}
                                        className="bg-background/50 border border-card-border/30 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary/40 placeholder:text-muted-foreground/40 w-full sm:max-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
                                        maxLength={40}
                                    />

                                    <button
                                        type="submit"
                                        disabled={submittingQuestion || !newQuestionContent.trim() || !session.isLive}
                                        className="bg-primary hover:bg-primary/80 disabled:bg-muted/30 disabled:text-muted-foreground/40 text-primary-foreground text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed shrink-0 w-full sm:w-auto"
                                    >
                                        {submittingQuestion ? "Sending..." : "Submit"}
                                    </button>
                                </div>
                            </form>

                            {questions.length > 0 ? (
                                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                                    {questions.map((q) => (
                                        <div key={q.id} className="bg-background/20 border border-card-border/30 rounded-xl p-3 flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1 text-left">
                                                <p className="text-xs text-foreground/90 leading-snug break-words pr-1">
                                                    {q.content}
                                                </p>
                                                <p className="text-[9px] font-bold text-muted-foreground/50 tracking-tight mt-1">
                                                    By {q.name || "Anonymous"} • {new Date(q.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleUpvote(q.id)}
                                                disabled={!session.isLive || upvotedIds.includes(q.id)}
                                                title={upvotedIds.includes(q.id) ? "Already upvoted" : session.isLive ? "Upvote this query" : "Voting is closed"}
                                                className={`h-7 px-2 rounded-lg border transition-all flex items-center gap-1.5 shrink-0 ${
                                                    upvotedIds.includes(q.id)
                                                        ? "bg-primary/15 border-primary/40 text-primary cursor-default shadow-sm"
                                                        : session.isLive
                                                            ? "bg-muted/40 border-card-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 cursor-pointer shadow-sm group"
                                                            : "bg-muted/10 border-transparent text-muted-foreground/40 cursor-not-allowed"
                                                }`}
                                            >
                                                <FiTrendingUp size={11} className={session.isLive && !upvotedIds.includes(q.id) ? "text-primary group-hover:-translate-y-0.5 transition-transform" : ""} />
                                                <span className="text-[10px] font-black">{q.upvotes}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground/40 italic px-1 text-center py-4">No submissions have been filed inside this forum box segment.</p>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}