import Link from "next/link";
import { Session } from "@/types/sessions";

function formatTime(date: string | Date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";
    return `${d.getDate()}/${d.getMonth() + 1} - ${d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    })}`;
}

export default function EventSessionList({ sessions }: { sessions: Session[] }) {
    return (
        <>
            {sessions.map((session) => (
                <Link key={session.id} href={`/sessions/${session.id}`}>
                    <div className="p-3 border w-1/2 m-auto">
                        <div className="flex gap-4">
                            <p className="text-blue-400">{formatTime(session.startTime)}</p>
                            <div>
                                <p>{session.title}</p>
                                <p>{session.room?.name}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </>
    );
}