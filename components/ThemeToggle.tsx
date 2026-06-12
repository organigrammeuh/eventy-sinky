"use client";

import { useEffect, useState } from "react";
import {FaMoon, FaSun } from "react-icons/fa";

export function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = stored === "dark" || (!stored && prefersDark);
        setDark(isDark);
        document.documentElement.classList.toggle("dark", isDark);
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    return (
        <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="fixed bottom-6 right-6 z-[100] w-11 h-11 rounded-full border border-border bg-card text-foreground flex items-center justify-center text-lg cursor-pointer shadow-md transition-all duration-200 hover:scale-110"
        >
            {dark ? <FaSun/> : <FaMoon/>}
        </button>
    );
}