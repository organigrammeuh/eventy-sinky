import Link from "next/link";

type Speaker = { id: string; fullName: string };
type Room = { id: string; name: string };
type Session = {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    room: Room;
    speakers?: Speaker[];
    isLive?: boolean;
};

type RoomDetailProps = {
    params: Promise<{ roomId: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function fmt(d: string) {
    return new Date(d).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
}

function isLive(s: Session) {
    const now = new Date();
    return new Date(s.startTime) <= now && new Date(s.endTime) >= now;
}

export default async function RoomDetailPage({ params }: RoomDetailProps) {
    const { roomId } = await params;

    let sessions: Session[] = [];
    let roomName = "";

    try {
        const res = await fetch(`${BASE_URL}/api/rooms/${roomId}/sessions`, {
            cache: "no-store",
        });
        if (res.ok) {
            sessions = await res.json();
            if (sessions.length > 0) roomName = sessions[0].room?.name ?? "";
        }
    } catch {}

    if (!roomName) {
        try {
            const res = await fetch(`${BASE_URL}/api/rooms`, { cache: "no-store" });
            if (res.ok) {
                const rooms: Room[] = await res.json();
                roomName = rooms.find((r) => r.id === roomId)?.name ?? "Salle";
            }
        } catch {}
    }

    const sorted = [...sessions].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return (
        <main className="pt-20 min-h-screen backdrop-blur-[2px]">
            <div className="max-w-2xl mx-auto p-6">
                <Link href="/rooms" className="text-sm text-muted-foreground no-underline mb-4 inline-block">
                    ← Rooms
                </Link>

                <h1 className="text-2xl font-bold mb-6">{roomName}</h1>

                {sorted.length === 0 ? (
                    <p className="text-muted-foreground">No sessions in this room.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {sorted.map((s) => {
                            const live = isLive(s);
                            return (
                                <Link key={s.id} href={`/sessions/${s.id}`} className="no-underline">
                                    <div
                                        className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                                            live ? "border-primary" : ""
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            {live && (
                                                <span className="badge badge-primary text-xs">
                          <span className="live-dot" />
                          Live
                        </span>
                                            )}
                                            <p className="font-medium">{s.title}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {fmtDate(s.startTime)} · {fmt(s.startTime)} – {fmt(s.endTime)}
                                        </p>
                                        {s.speakers && s.speakers.length > 0 && (
                                            <p className="text-xs text-muted-foreground">
                                                {s.speakers.map((sp) => sp.fullName).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
