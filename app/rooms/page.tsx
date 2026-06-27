import Link from "next/link";
import { FiGrid, FiMapPin, FiChevronRight, FiLayers } from "react-icons/fi";

type Room = { id: string; name: string };

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

async function fetchRooms(): Promise<Room[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/rooms`, { cache: "no-store" });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

export default async function RoomsPage() {
    const rooms = await fetchRooms();

    return (
        <main className="w-screen min-h-screen relative backdrop-blur-[2px] mt-6 text-foreground px-4 py-16 md:px-12 lg:px-20 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[400px] bg-accent/4 rounded-full blur-[130px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10 text-left">

                <div className="mb-12 flex flex-col items-start gap-2 max-w-xl">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-primary bg-primary/20 border border-primary/20 px-3 py-0.5 rounded-full shadow-sm">
                        <FiGrid size={10} />
                        Venues & Hubs
                    </span>
                    <h1 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-extrabold tracking-tight gradient-brand-text mt-1">
                        Campus Rooms
                    </h1>
                    <p className="text-sm text-muted-foreground/90 leading-relaxed">
                        Explore specific presentation halls, physical laboratories, and specialized conference spaces hosting upcoming keynotes.
                    </p>
                </div>

                {rooms.length === 0 ? (
                    <div className="glass rounded-[32px] p-12 text-center border border-card-border/30 max-w-md mx-auto flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-card-border/60 text-muted-foreground/60 flex items-center justify-center">
                            <FiMapPin size={20} />
                        </div>
                        <p className="text-xs text-muted-foreground/70 font-medium">No presentation rooms have been cataloged yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {rooms.map((room) => (
                            <Link key={room.id} href={`/rooms/${room.id}`} className="no-underline group">
                                <div className="glass h-full rounded-2xl p-5 border border-card-border/40 bg-gradient-to-br from-card/60 to-muted/5 hover:border-primary/40 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/3 rounded-full blur-xl pointer-events-none group-hover:bg-primary/6 transition-colors" />

                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-11 h-11 rounded-xl bg-muted/40 group-hover:bg-primary-muted border border-card-border/40 group-hover:border-primary/20 text-muted-foreground group-hover:text-primary flex items-center justify-center transition-colors shrink-0 shadow-sm">
                                            <FiLayers size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-[family-name:var(--font-syne)] text-sm font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                                                {room.name}
                                            </h3>
                                            <span className="text-[10px] font-bold text-muted-foreground/70 tracking-wider uppercase mt-0.5 block">
                                                View Schedule
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-7 h-7 rounded-lg bg-muted/20 group-hover:bg-card border border-card-border/20 text-muted-foreground/40 group-hover:text-primary flex items-center justify-center transition-all group-hover:translate-x-0.5 shrink-0 shadow-2xl">
                                        <FiChevronRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}