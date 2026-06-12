"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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

function fmt(d: string) {
    return new Date(d).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
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

function SpeakerChip({ speaker }: { speaker: Speaker }) {
    return (
        <Link href={`/speakers/${speaker.id}`} className="no-underline">
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                {speaker.profilePicture ? (
                    <img
                        src={speaker.profilePicture}
                        alt={speaker.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {getInitials(speaker.fullName)}
                    </div>
                )}
                <span className="text-sm font-medium">{speaker.fullName}</span>
            </div>
        </Link>
    );
}

function QuestionItem({
                          question,
                          onUpvote,
                      }: {
    question: Question;
    onUpvote: (id: string) => void;
}) {
    return (
        <div className="flex items-start gap-3 p-3 border rounded-lg">
            <div className="flex-1">
                <p className="text-sm">{question.content}</p>
                {question.name && (
                    <p className="text-xs text-gray-400 mt-1">— {question.name}</p>
                )}
            </div>
            <button
                onClick={() => onUpvote(question.id)}
                className="flex flex-col items-center gap-0.5 min-w-[40px] cursor-pointer border rounded px-2 py-1 hover:bg-gray-50 transition-colors"
            >
                <span className="text-xs">▲</span>
                <span className="text-xs font-bold">{question.upvotes}</span>
            </button>
        </div>
    );
}

function QuestionForm({
                          onSubmit,
                      }: {
    onSubmit: (content: string, name: string) => Promise<void>;
}) {
    const [content, setContent] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setLoading(true);
        await onSubmit(content.trim(), name.trim());
        setContent("");
        setName("");
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-2 p-3 border rounded-lg bg-gray-50">
      <textarea
          placeholder="Votre question *"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border rounded p-2 text-sm resize-none"
          rows={2}
      />
            <input
                placeholder="Votre nom (optionnel)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded p-2 text-sm"
            />
            <button
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className="bg-primary text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
                {loading ? "Envoi..." : "Poser la question"}
            </button>
        </div>
    );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function SessionDetailPage() {
    const params = useParams();
    const sessionId = params?.sessionId as string;

    const [session, setSession] = useState<Session | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

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
        } catch {}
    };

    const handleSubmitQuestion = async (content: string, name: string) => {
        if (!sessionId) return;
        try {
            const res = await fetch(`/api/sessions/${sessionId}/questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, name: name || undefined }),
            });
            if (!res.ok) return;
            const newQ = await res.json();
            setQuestions((prev) =>
                [newQ, ...prev].sort((a, b) => b.upvotes - a.upvotes)
            );
        } catch {}
    };

    const handleToggleFavorite = () => {
        if (!session) return;
        const newState = toggleFavorite(session.id);
        setIsFavorite(newState);
    };

    if (loading) {
        return (
            <div className="pt-20 p-6 max-w-2xl mx-auto">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-2/3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="pt-20 p-6 max-w-2xl mx-auto text-center text-gray-500">
                Session introuvable.{" "}
                <Link href="/sessions" className="text-primary underline">
                    Retour aux sessions
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen">
            <div className="max-w-2xl mx-auto p-6">
                {/* Back link */}
                <Link
                    href="/sessions"
                    className="text-sm text-muted-foreground no-underline mb-4 inline-block"
                >
                    ← Sessions
                </Link>

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            {session.isLive && (
                                <span className="badge badge-primary text-xs">
                  <span className="live-dot" />
                  Live
                </span>
                            )}
                            <h1 className="text-2xl font-bold">{session.title}</h1>
                        </div>

                        <div className="flex gap-3 text-sm text-muted-foreground flex-wrap">
              <span>
                {fmt(session.startTime)} – {fmt(session.endTime)}
              </span>
                            {session.room && <span>📍 {session.room.name}</span>}
                            {session.capacity && (
                                <span>{session.capacity} places (informatif)</span>
                            )}
                        </div>
                    </div>

                    {/* Favorite button */}
                    <button
                        onClick={handleToggleFavorite}
                        title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                        className="text-2xl cursor-pointer border-none bg-transparent"
                    >
                        {isFavorite ? "★" : "☆"}
                    </button>
                </div>

                {/* Description */}
                {session.description && (
                    <p className="text-sm text-muted-foreground mb-6">
                        {session.description}
                    </p>
                )}

                {/* Speakers */}
                {session.speakers && session.speakers.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-base font-semibold mb-2">Intervenants</h2>
                        <div className="flex flex-wrap gap-2">
                            {session.speakers.map((sp) => (
                                <SpeakerChip key={sp.id} speaker={sp} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Q&A — visible only when live */}
                {session.isLive ? (
                    <div className="mt-6">
                        <h2 className="text-base font-semibold mb-3">
                            Questions ({questions.length})
                        </h2>

                        <QuestionForm onSubmit={handleSubmitQuestion} />

                        <div className="flex flex-col gap-2 mt-4">
                            {questions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Aucune question pour l'instant.
                                </p>
                            ) : (
                                questions.map((q) => (
                                    <QuestionItem key={q.id} question={q} onUpvote={handleUpvote} />
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50 text-sm text-muted-foreground">
                        Les questions seront disponibles pendant la session.
                    </div>
                )}
            </div>
        </div>
    );
}