import Link from "next/link";

async function fetchEvents() {
    try {
        const res = await fetch("http://localhost:3000/api/events", { cache: "no-store" });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

async function fetchSpeakers() {
    try {
        const res = await fetch("http://localhost:3000/api/speakers", { cache: "no-store" });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function getInitials(name: string) {
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function HomePage() {
    const events = await fetchEvents();
    const speakers = await fetchSpeakers();
    const totalSessions = events.reduce((acc: number, e: any) => acc + (e.sessions?.length ?? 0), 0);

    return (
        <main>
                <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" />

                <h1 className="font-[family-name:var(--font-syne)] font-extrabold text-white leading-tight mb-5 max-w-3xl text-6xl">
                    Welcome to Eventy-Sinky
                </h1>

                <p className="text-white/70 text-lg max-w-xl leading-relaxed mb-10">

                </p>

                <div className="flex gap-3 flex-wrap justify-center">
                    <Link href="/events" className="px-7 py-3 rounded-full bg-white text-[#3C3489] font-semibold text-sm no-underline transition-opacity hover:opacity-90">
                        View all events
                    </Link>
                    <Link href="/sessions" className="px-7 py-3 rounded-full font-semibold text-sm no-underline text-white transition-opacity hover:opacity-90" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}>
                        Explore sessions
                    </Link>
                </div>

            </section>

            <section className="py-20 px-6 max-w-[1100px] mx-auto">
                <div className="flex items-baseline justify-between mb-8">
                    <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground">Events</h2>
                    <Link href="/events" className="text-sm text-primary font-medium no-underline">View all →</Link>
                </div>

                {events.length === 0 ? (
                    <p className="text-muted-foreground">No event yet.</p>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
                        {events.slice(0, 3).map((event: any) => (
                            <Link key={event.id} href={`/events/${event.id}`} className="no-underline">
                                <div className="card-hover bg-card border border-card-border rounded-xl p-6 h-full flex flex-col gap-3">
                                    <h3 className="font-[family-name:var(--font-syne)] text-base font-bold text-foreground">{event.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{event.description}</p>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-xs text-muted-foreground">{formatDate(event.startDate)}</span>
                                        <span className="badge badge-primary">{event.sessions?.length ?? 0} sessions</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className="py-20 px-6 bg-muted">
                <div className="max-w-[1100px] mx-auto">
                    <div className="flex items-baseline justify-between mb-8">
                        <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground">Recent sessions</h2>
                        <Link href="/sessions" className="text-sm text-primary font-medium no-underline">View all →</Link>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
                        {events.flatMap((e: any) =>
                            (e.sessions ?? []).slice(0, 2).map((s: any) => {
                                const now = new Date();
                                const live = new Date(s.startTime) <= now && new Date(s.endTime) >= now;
                                return (
                                    <Link key={s.id} href={`/sessions/${e.id}`} className="no-underline">
                                        <div className={`bg-card rounded-xl p-5 border ${live ? "border-primary" : "border-card-border"}`}>
                                            {live && <span className="badge badge-primary mb-2"><span className="live-dot" />Live</span>}
                                            <p className="font-semibold text-sm text-foreground mb-1">{s.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {s.room} · {new Date(s.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })
                        ).slice(0, 6)}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 max-w-[1100px] mx-auto">
                <div className="flex items-baseline justify-between mb-8">
                    <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground">Speakers</h2>
                    <Link href="/speakers" className="text-sm text-primary font-medium no-underline">View all →</Link>
                </div>

                <div className="flex gap-5 flex">
                    {speakers.slice(0, 4).map((speaker: any) => (
                        <Link key={speaker.id} href={`/speakers/${speaker.id}`} className="no-underline">
                            <div className="card-hover bg-card border border-card-border rounded-xl px-6 py-5 flex items-center gap-3 min-w-[200px]">
                                {speaker.profilePicture ? (
                                    <img src={speaker.profilePicture} alt={speaker.fullName} className="w-20 h-20 rounded-full object-cover border-2 border-primary-muted flex-shrink-0" />
                                ) : (
                                    <div className="w-15 h-15 rounded-full bg-primary-muted text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {getInitials(speaker.fullName)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-sm text-foreground">{speaker.fullName}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{speaker.sessions?.length ?? 0} session(s)</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}