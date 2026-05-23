"use client";

import { useState } from "react";
import { Question } from "@/types/question";

type Speaker = {
  id: string;
  full_name: string;
  profile_picture_url?: string;
  biography?: string;
};

type SessionData = {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  room_name: string;
  capacity?: number;
  isLive?: boolean;
  speakers: Speaker[];
};

type Props = {
  session: SessionData;
  initialQuestions: Question[];
};

export default function SessionClientPage({ session, initialQuestions }: Props) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSubmitQuestion = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${session.id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          name: name || undefined,
          sessionId: session.id,
          createdAt: new Date().toISOString(),
        }),
      });
      const newQuestion: Question = await res.json();
      setQuestions([newQuestion, ...questions]);
      setContent("");
      setName("");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (questionId: string) => {
    await fetch(`/api/questions/${questionId}/upvote`, { method: "POST" });
    setQuestions(questions.map((q) =>
      q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
    ));
  };

  return (
    <div>
      <div className="bg-yellow-500">
        <h1 className="text-2xl text-red-200">{session.title}</h1>
        <p>
          {formatTime(session.start_date)} → {formatTime(session.end_date)} · {session.room_name}
          {session.capacity && ` · Capacity: ${session.capacity}`}
        </p>
        {session.description && <p>{session.description}</p>}
      </div>

      {session.speakers.length > 0 && (
        <div className="bg-green-300">
          <h2>Speakers</h2>
          {session.speakers.map((speaker) => (
            <div key={speaker.id}>
              {speaker.profile_picture_url && (
                <img src={speaker.profile_picture_url} alt={speaker.full_name} width={40} height={40} />
              )}
              <p>{speaker.full_name}</p>
              {speaker.biography && <p>{speaker.biography}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white">
        <h2 className="text-black">Ask a question</h2>
        <input
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Your question..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleSubmitQuestion} disabled={loading || !content.trim()}>
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>

      <div className="bg-blue-500">
        <h2>Questions ({questions.length})</h2>
        {questions.map((q) => (
          <div key={q.id}>
            <p>{q.content}</p>
            <p>{q.name ?? "Anonymous"} · {new Date(q.createdAt).toLocaleString()}</p>
            <button onClick={() => handleUpvote(q.id)}>{q.upvotes}</button>
          </div>
        ))}
      </div>
    </div>
  );
}