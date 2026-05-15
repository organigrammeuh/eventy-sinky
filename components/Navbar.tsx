"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import {FaMoon, FaSun} from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = scrolled
    ? dark ? "rgba(255,255,255,0.85)" : "#2a2a3d"
    : dark ? "rgba(255,255,255,0.85)" : "#2a2a3d";

  const hoverColor = scrolled
    ? dark ? "#ffffff" : "#534AB7"
    : dark ? "#ffffff" : "#534AB7";

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: scrolled ? "12px 48px" : "20px 48px",
        background: scrolled
          ? dark ? "rgba(0,0,0,0.7)" : "rgba(237,234,240,0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? dark ? "0.5px solid rgba(255,255,255,0.08)" : "0.5px solid rgba(0,0,0,0.08)"
          : "none",
        transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 800, fontSize: "18px",
          color: dark ? "white" : "#1a1a2e",
          transition: "color 0.3s",
        }}>
          Event-Sync
        </span>
      </Link>

      {/* Nav links */}
      <nav style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        {["Home", "Events", "Sessions", "Rooms", "Speakers"].map((item) => (
          <Link
            key={item}
            href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
            style={{
              fontSize: "15px", fontWeight: 400,
              color: textColor,
              textDecoration: "none",
              transition: "color 0.25s",
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = hoverColor; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = textColor; }}
          >
            {item}
          </Link>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <a href="#" style={{ color: dark ? "rgba(255,255,255,0.7)" : "#555", transition: "color 0.2s" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
        <a href="#" style={{ color: dark ? "rgba(255,255,255,0.7)" : "#555", transition: "color 0.2s" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.32 4.37A19.8 19.8 0 0 0 15.33 3c-.21.38-.46.88-.63 1.28a18.4 18.4 0 0 0-5.4 0C9.13 3.88 8.87 3.38 8.66 3a19.73 19.73 0 0 0-4.99 1.38C1.28 8.38.55 12.27 1.08 16.1a19.89 19.89 0 0 0 5.99 2.98c.48-.65.91-1.34 1.28-2.07-.7-.26-1.37-.58-2-1 .17-.12.33-.24.49-.37 3.86 1.76 8.04 1.76 11.85 0 .16.13.33.25.49.37-.63.42-1.3.74-2 1 .37.73.8 1.42 1.28 2.07a19.8 19.8 0 0 0 6-2.98c.63-4.41-.99-8.26-3.14-11.73zM8.52 13.9c-1.17 0-2.13-1.06-2.13-2.37s.94-2.38 2.13-2.38c1.18 0 2.15 1.07 2.13 2.38 0 1.31-.94 2.37-2.13 2.37zm6.96 0c-1.17 0-2.13-1.06-2.13-2.37s.94-2.38 2.13-2.38c1.18 0 2.15 1.07 2.13 2.38 0 1.31-.93 2.37-2.13 2.37z"/>
          </svg>
        </a>
        <a href="#" style={{ color: dark ? "rgba(255,255,255,0.7)" : "#555", transition: "color 0.2s" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <button
          onClick={toggle}
          style={{
            width: "38px", height: "22px",
            borderRadius: "50px",
            border: "none",
            background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
            cursor: "pointer",
            position: "relative",
            transition: "background 0.3s",
            flexShrink: 0,
          }}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span style={{
            position: "absolute",
            top: "3px",
            left: dark ? "18px" : "3px",
            width: "16px", height: "16px",
            borderRadius: "50%",
            background: dark ? "#8e2e9c" : "#481e55",
            transition: "left 0.3s cubic-bezier(.4,0,.2,1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px",
          }}>
            {dark ? <FaSun className="font-black" /> : <FaMoon/>}
          </span>
        </button>
      </div>
    </header>
  );
}
