import Link from "next/link";

export function HeroSection() {
    return (
        <section className="hero-section relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-24 overflow-hidden select-none">
            <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] animate-float pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-accent/15 rounded-full blur-[140px] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center animate-enter">
                <h1 className="mt-10 font-[family-name:var(--font-syne)] font-extrabold leading-[1.1] mb-6 max-w-3xl text-5xl md:text-7xl text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                    Welcome to <br className="sm:hidden" />
                    <span className="gradient-brand-text filter drop-shadow-[0_2px_20px_rgba(217,70,239,0.2)]">
                        EventSync
                    </span>
                </h1>

                <p className="text-white/75 max-w-2xl mb-12 font-light leading-relaxed tracking-wide drop-shadow-sm px-4">
                    EventSync revolutionizes the management and engagement of your events in real time. Forget paper programs and static PDFs: navigate seamlessly to the heart of sessions and interact instantly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto px-6">
                    <Link
                        href="/events"
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-card/80 border border-primary text-primary font-bold text-sm tracking-wide no-underline shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center"
                    >
                        View all events
                    </Link>

                    <Link
                        href="/sessions"
                        className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-wide no-underline text-white bg-white/10 border border-white/25 backdrop-blur-[8px] hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center shadow-lg"
                    >
                        Explore sessions
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest pointer-events-none animate-float">
                <span>Scroll down</span>
                <div className="w-[1px] h-6 bg-white/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-white animate-bounce" />
                </div>
            </div>
        </section>
    );
}