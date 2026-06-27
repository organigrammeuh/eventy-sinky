"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:5173';

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Sessions", href: "/sessions" },
    { label: "Speakers", href: "/speakers" },
    { label: "Rooms", href: "/rooms" },
    { label: "Favorites", href: "/favorites" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [dark, setDark] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const sync = () =>
            setDark(document.documentElement.classList.contains("dark"));
        sync();
        const obs = new MutationObserver(sync);
        obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => obs.disconnect();
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 flex flex-col justify-center pointer-events-none transition-all duration-[0.4s] ease-in-out ${
                scrolled ? "p-5 md:px-6" : "p-0"
            }`}
        >
            <nav
                className={`pointer-events-auto w-full flex items-center justify-between relative backdrop-blur-[16px] transition-all duration-[0.45s] cubic-bezier(.4,0,.2,1) ${
                    scrolled
                        ? "py-2.5 px-5 rounded-[45px]"
                        : "py-2.5 px-6 rounded-none"
                } ${
                    dark
                        ? "bg-card/92 border-card-border"
                        : "bg-white/88 border-[#534ab7]/15"
                } ${
                    scrolled
                        ? "border"
                        : "border-b"
                } ${
                    scrolled
                        ? dark
                            ? "shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                            : "shadow-[0_4px_24px_rgba(83,74,183,0.08)]"
                        : "shadow-none"
                }`}
            >
                <Link href="/" className="no-underline flex items-center gap-2.5 z-50">
                    <img
                        src="/icon.png"
                        alt="EventSync"
                        className="w-5 h-5 object-contain"
                    />
                    <span className="font-[family-name:var(--font-syne)] font-extrabold text-xl gradient-brand-text transition-colors duration-300">
                        EventSync
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`text-sm no-underline relative py-1 transition-colors duration-300 ${
                                    isActive
                                        ? "text-accent font-semibold"
                                        : "text-muted-foreground font-normal"
                                }`}
                            >
                                <span>{item.label}</span>
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-accent/50" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="hidden md:flex items-center">
                    <Link
                        href={ADMIN_URL!}
                        className="text-sm font-semibold px-5 py-2 rounded-full no-underline transition-all duration-300 bg-primary/30 text-accent border border-accent hover:opacity-90"
                    >
                        Admin
                    </Link>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex md:hidden items-center justify-center w-9 h-9 rounded-full cursor-pointer z-50 border-none transition-colors bg-muted-foreground/10 text-foreground"
                >
                    {isOpen ? <FiX size={16} /> : <FiMenu size={16} />}
                </button>

                <div
                    className={`absolute left-0 right-0 z-40 rounded-2xl border p-5 flex flex-col gap-4 shadow-2xl transition-all duration-300 ease-out ${
                        scrolled ? "top-[calc(100%+12px)]" : "top-[calc(100%+16px)]"
                    } ${
                        dark
                            ? "bg-card border-card-border"
                            : "bg-white/98 border-[#534ab7]/15"
                    } ${
                        isOpen
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
                >
                    <div className="flex flex-col gap-1 w-full">
                        {NAV_LINKS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-sm no-underline p-3 rounded-xl transition-colors font-semibold text-left flex items-center justify-between w-full ${
                                        isActive
                                            ? "text-accent bg-accent/10"
                                            : "text-muted-foreground bg-transparent"
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                                </Link>
                            );
                        })}
                    </div>

                    <div
                        className={`border-t pt-4 ${
                            dark ? "border-card-border/40" : "border-[#534ab7]/10"
                        }`}
                    >
                        <Link
                            href={ADMIN_URL!}
                            onClick={() => setIsOpen(false)}
                            className="w-full text-center text-sm font-bold py-3 rounded-xl no-underline transition-all block bg-primary/30 text-accent border border-accent hover:opacity-90"
                        >
                            Admin Console
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}