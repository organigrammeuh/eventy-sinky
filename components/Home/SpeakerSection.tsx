import Link from "next/link";
import { SpeakerCard, SpeakerCardSkeleton, SpeakerCardData } from "@/constants/SpeakerCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

async function fetchSpeakers(): Promise<SpeakerCardData[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/speakers`, { cache: "no-store" });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

export async function SpeakerSection() {
    const speakers = await fetchSpeakers();

    return (
        <section className="homepage-section relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="homepage-section-inner relative z-10">
                <div className="section-header items-end mb-8 border-b border-card-border/40 pb-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
                            Meet our experts
                        </span>
                        <h2 className="section-title text-2xl md:text-3xl font-extrabold tracking-tight">
                            Speakers
                        </h2>
                    </div>
                    <Link href="/speakers" className="section-link group flex items-center gap-1 font-semibold transition-colors hover:text-accent">
                        View all
                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>

                {speakers.length === 0 ? (
                    <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible scrollbar-none">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="min-w-[260px] md:min-w-0 flex-1">
                                <SpeakerCardSkeleton />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible snap-x snap-mandatory scrollbar-none">
                        {speakers.slice(0, 4).map((speaker) => (
                            <div key={speaker.id} className="min-w-[260px] md:min-w-0 flex-1 snap-start">
                                <SpeakerCard speaker={speaker} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}