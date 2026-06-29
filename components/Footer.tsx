import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa6";

export default function Footer() {

    return (
        <footer className="w-full bg-primary-muted/20 backdrop-blur-xl border-t border-card-border/30 mt-auto relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-10 border-b border-card-border/20">

                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/icon.png"
                                alt="EventSync"
                                className="w-5 h-5 object-contain"
                            />
                            <span className="font-[family-name:var(--font-syne)] text-2xl font-black tracking-tight bg-gradient-to-r from-[#e879f9] to-[#22d3ee] bg-clip-text text-transparent">
                                EventSync
                            </span>
                        </div>
                        <p className="text-sm text-white/80 max-w-sm font-medium leading-relaxed">
                            Synchronize your calendars, track trade shows in real time and optimize your conference itinerary with one click.
                        </p>
                    </div>

                    <div className="lg:col-span-4 grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Navigation</span>
                            <nav className="flex flex-col gap-2.5 text-sm font-bold">
                                <Link href="/events" className="text-white/70 hover:text-white inline-flex items-center gap-1 group">
                                    <span>All Events</span>
                                    <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white" size={12} />
                                </Link>
                                <Link href="/rooms" className="text-white/70 hover:text-white inline-flex items-center gap-1 group">
                                    <span>Conference Rooms</span>
                                    <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white" size={12} />
                                </Link>
                            </nav>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Personal</span>
                            <nav className="flex flex-col gap-2.5 text-sm font-bold text-foreground/80">
                                <Link href="/favorites" className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-1 group">
                                    <span>My Itinerary</span>
                                    <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white" size={12} />
                                </Link>
                            </nav>
                        </div>
                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-3 sm:items-start lg:items-end">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Community</span>
                        <div className="flex items-center gap-2">
                            <a href="https://github.com/event-sync" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-background/70 hover:bg-primary-muted border border-card-border/60 hover:border-primary/30 text-foreground/80 hover:text-primary flex items-center justify-center transition-all shadow-sm">
                                <FaGithub size={16} />
                            </a>
                            <a href="https://twitter.com/event-sync" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-background/70 hover:bg-primary-muted border border-card-border/60 hover:border-primary/30 text-foreground/80 hover:text-primary flex items-center justify-center transition-all shadow-sm">
                                <FaTwitter size={16} />
                            </a>
                            <a href="https://linkedin.com/event-sync" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-background/70 hover:bg-primary-muted border border-card-border/60 hover:border-primary/30 text-foreground/80 hover:text-primary flex items-center justify-center transition-all shadow-sm">
                                <FaLinkedin size={16} />
                            </a>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-white/60 font-medium">
                    <div>
                        © 2026 EventSync.
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}