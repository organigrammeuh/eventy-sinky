"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiClock, FiMapPin, FiUsers, FiArrowLeft, FiHeart, FiMessageSquare, FiTrendingUp, FiUser, FiZap } from "react-icons/fi";

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

export default function SessionDetailPage() {
    const params = useParams();
    const sessionId = params?.sessionId as string;

    const [session, setSession] = useState<Session | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    const [newQuestionContent, setNewQuestionContent] = useState("");
    const [newQuestionName, setNewQuestionName] = useState("");
    const [submittingQuestion, setSubmittingQuestion] = useState(false);

    useEffect(() => {
        if (sessionId) {
            setIsFavorite(getFavorites().includes(sessionId));
        }
    }, [sessionId]);

    const fetchSession = useCallback(async () => {
        if (!sessionId) return;
        try {
            const res = await fetch(`/api/sessions/${sessionId}`);
            if (!res.ok) throw new Error("Not found");
            const data: Session = await res.json();
            setSession(data);
            setQuestions(
                [...(data.questions ?? [])].sort((a, b) => b.upvotes - a.upvotes)
            );
        } catch {
            setSession(null);
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    const handleUpvote = async (questionId: string) => {
        try {
            const res = await fetch(`/api/questions/${questionId}/upvote`, {
                method: "POST",
            });
            if (!res.ok) return;
            const updated = await res.json();
            setQuestions((prev) =>
                [...prev.map((q) => (q.id === questionId ? updated : q))].sort(
                    (a, b) => b.upvotes - a.upvotes
                )
            );
        } catch { }
    };

    const handleSubmitQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionId || !newQuestionContent.trim()) return;
        setSubmittingQuestion(true);
        try {
            const res = await fetch(`/api/sessions/${sessionId}/questions`, {
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

    if (loading) {
        return (
            <div className="w-screen min-h-screen text-foreground flex items-center justify-center p-6">
                <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <div className="h-[30vh] bg-muted/40 rounded-3xl" />
                        <div className="h-[30vh] bg-muted/30 rounded-3xl" />
                    </div>
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <div className="h-10 bg-muted/60 rounded-xl w-3/4" />
                        <div className="h-48 bg-muted/40 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
                <p className="text-muted-foreground text-sm mb-4">Session could not be located.</p>
                <Link href="/sessions" className="text-xs font-bold text-primary flex items-center gap-2 no-underline">
                    <FiArrowLeft /> Back to directory
                </Link>
            </div>
        );
    }

    return (
        <div className="w-screen min-h-screen relative backdrop-blur-[2px] mt-10 text-foreground px-4 py-12 md:px-12 lg:px-20">
            <div className="absolute top-0 right-1/3 w-[700px] h-[500px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-accent/4 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 items-start">

                <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-12">

                    <Link href="/sessions" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-white/80 hover:text-primary uppercase transition-colors no-underline group self-start">
                        <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Schedule</span>
                    </Link>

                    <div className="glass rounded-3xl p-6 border border-card-border/50 bg-gradient-to-b from-card/80 to-muted/20 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                        <p className="text-[10px] font-black tracking-widest uppercase text-primary/80 mb-6 text-left">
                            Speakers
                        </p>

                        {session.speakers && session.speakers.length > 0 ? (
                            <div className="flex flex-col gap-5">
                                {session.speakers.map((sp) => (
                                    <Link key={sp.id} href={`/speakers/${sp.id}`} className="no-underline group">
                                        <div className="flex items-center gap-4 p-3 rounded-2xl border border-card-border/30 bg-card/40 hover:bg-card hover:border-primary/30 transition-all duration-300">
                                            {sp.profilePicture ? (
                                                <img
                                                    src={sp.profilePicture}
                                                    alt={sp.fullName}
                                                    className="w-14 h-14 rounded-xl object-cover border border-card-border/60 bg-muted shrink-0"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground font-extrabold flex items-center justify-center text-lg shrink-0 font-[family-name:var(--font-syne)] shadow-sm">
                                                    {getInitials(sp.fullName)}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1 text-left">
                                                <h2 className="font-[family-name:var(--font-syne)] text-lg font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                                                    {sp.fullName}
                                                </h2>
                                                <p className="text-[10px] font-bold text-accent/80 tracking-wide uppercase flex items-center gap-1 mt-0.5">
                                                    <FiUser size={9} /> View Profile →
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground/60">
                                <FiUser size={20} className="mx-auto mb-2 opacity-40" />
                                <p className="text-xs">No speakers assigned.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4 px-2">
                            <h2 className="font-[family-name:var(--font-syne)] text-white/70 font-extrabold tracking-tight flex items-center gap-2">
                                <FiMessageSquare size={14} className="text-primary" />
                                <span>Audience Q&A ({questions.length})</span>
                            </h2>
                        </div>

                            <div className="flex flex-col gap-4">
                                <form onSubmit={handleSubmitQuestion} className="glass rounded-2xl p-4 border border-card-border/50 bg-muted/30 flex flex-col gap-3">
                                    <textarea
                                        required
                                        rows={2}
                                        placeholder="Ask a question..."
                                        value={newQuestionContent}
                                        onChange={(e) => setNewQuestionContent(e.target.value)}
                                        disabled={!session.isLive}
                                        className="w-full bg-background/50 border border-card-border/60 rounded-xl p-3 text-xs outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/60 resize-none transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <div className="flex flex-col gap-3">
                                        <input
                                            type="text"
                                            placeholder="Your Name (Optional)"
                                            value={newQuestionName}
                                            onChange={(e) => setNewQuestionName(e.target.value)}
                                            disabled={!session.isLive}
                                            className="bg-background/50 border border-card-border/60 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/60 transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            type="submit"
                                            disabled={submittingQuestion || !newQuestionContent.trim() || !session.isLive}
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5 w-full shadow-sm"
                                        >
                                            {submittingQuestion ? "Sending..." : "Send"}
                                            <FiZap size={12} />
                                        </button>
                                    </div>
                                </form>

                                <div className="flex flex-col gap-2.5 max-h-[40vh] overflow-y-auto pr-1">
                                    {questions.length === 0 ? (
                                        <div className="glass rounded-2xl p-6 text-center border border-card-border/30 text-muted-foreground/70 text-xs font-medium">
                                            No questions asked yet.
                                        </div>
                                    ) : (
                                        questions.map((q) => (
                                            <div key={q.id} className="glass rounded-2xl p-4 border border-card-border/40 flex items-start justify-between gap-4 shadow-sm text-left">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                                                        {q.content}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground/60 font-bold mt-1.5 tracking-wide uppercase">
                                                        — {q.name || "Anonymous"}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => handleUpvote(q.id)}
                                                    disabled={!session.isLive}
                                                    className={`inline-flex items-center gap-1.5 bg-muted/60 border rounded-xl px-2.5 py-1.5 transition-all text-muted-foreground ${
                                                        session.isLive
                                                            ? "hover:bg-primary/10 border-card-border/40 hover:border-primary/30 hover:text-primary cursor-pointer group"
                                                            : "opacity-40 cursor-not-allowed border-card-border/20"
                                                    }`}
                                                >
                                                    <FiTrendingUp size={12} className="transition-transform" />
                                                    <span className="text-[10px] font-black">{q.upvotes}</span>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                    </div>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6 text-left">

                    <div className="glass rounded-3xl p-6 md:p-8 border border-card-border/40 shadow-sm relative overflow-hidden">

                        {session.isLive && (
                            <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-live" />
                        )}

                        <div className="flex items-start justify-between gap-6 mb-4">
                            <div className="flex flex-col gap-2">
                                {session.isLive && (
                                    <span className="inline-flex items-center gap-1.5 self-start text-[10px] font-black uppercase tracking-wider text-white bg-live/80 border border-live px-2.5 py-0.5 rounded-md shadow-sm">
                                        <span className="live-dot shrink-0" />
                                        Live Now
                                    </span>
                                )}
                                <h1 className="font-[family-name:var(--font-syne)] text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                                    {session.title}
                                </h1>
                            </div>

                            <button
                                onClick={() => {
                                    const nextState = toggleFavorite(session.id);
                                    setIsFavorite(nextState);
                                }}
                                className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer ${
                                    isFavorite
                                        ? "bg-destructive/10 border-destructive text-destructive"
                                        : "bg-muted/40 border-card-border hover:border-destructive/40 text-muted-foreground hover:text-destructive"
                                }`}
                            >
                                <FiHeart size={16} fill={isFavorite ? "currentColor" : "none"} />
                            </button>
                        </div>

                        <p className="text-sm text-foreground/70 leading-relaxed mb-6 border-b border-card-border/20 pb-5">
                            {session.description || "No description provided for this session."}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-muted/40 border border-card-border/30 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                                <FiClock size={14} className="text-primary shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider leading-none mb-0.5">Time</p>
                                    <p className="text-xs font-black tracking-tight truncate">{fmtDate(session.startTime)} · {fmtTime(session.startTime)} - {fmtTime(session.endTime)}</p>
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
            </div>
        </div>
    );
}
