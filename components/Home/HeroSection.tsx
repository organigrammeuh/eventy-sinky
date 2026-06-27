import Link from "next/link";

export function HeroSection() {
    return (
        <section className="hero-section relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden">
            <h1 className="font-[family-name:var(--font-syne)] font-extrabold leading-tight mb-4 max-w-3xl text-5xl md:text-6xl text-white drop-shadow-lg">
                Welcome to{" "}
                <span className="gradient-brand-text">EventSync</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-xl mb-8 drop-shadow">
                Meet us through events — sessions, speakers, Q&A live.
                <br/>
                Lorem Ipsum
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
                <Link
                    href="/events"
                    className="px-7 py-3 rounded-full bg-white text-[#3C3489] font-semibold text-sm no-underline transition-opacity hover:opacity-90 shadow-lg"
                >
                    View all events
                </Link>
                <Link
                    href="/sessions"
                    className="px-7 py-3 rounded-full font-semibold text-sm no-underline text-white transition-opacity hover:opacity-90"
                    style={{
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    Explore sessions
                </Link>
            </div>
        </section>
    );
}