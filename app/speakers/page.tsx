import { SpeakerCard, SpeakerCardData } from "@/components/Speaker/SpeakerCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

const fetchAllSpeakers = async (): Promise<SpeakerCardData[]> => {
    try {
        const res = await fetch(`${BASE_URL}/api/speakers`, { cache: "no-store" });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
};

export default async function SpeakersPage() {
    const speakers = await fetchAllSpeakers();

    return (
        <div className="w-screen min-h-screen relative top-3 backdrop-blur-[2px] text-foreground px-4 py-16 md:px-12 lg:px-20 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-accent/4 rounded-full blur-[130px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 text-center">
                <div className="mb-12 flex flex-col items-center gap-2 border-b border-card-border/40 pb-6">

                    <h1 className="font-[family-name:var(--font-syne)] text-5xl md:text-5xl font-extrabold tracking-tight gradient-brand-text mt-2">
                        Meet all our speakers
                    </h1>
                    <p className="text-sm text-white/60 max-w-md leading-relaxed mt-1">
                        Here are the incredible people behind our sessions
                    </p>
                </div>

                {speakers.length === 0 ? (
                    <div className="glass rounded-3xl p-12 text-center border border-card-border/30 max-w-md mx-auto">
                        <p className="text-sm text-white">No speaker found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
                        {speakers.map((speaker) => (
                            <SpeakerCard key={speaker.id} speaker={speaker} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}