"use client";

import Link from "next/link";
import { FiUser, FiExternalLink, FiVideo } from "react-icons/fi";

export type SpeakerCardData = {
    id: string;
    fullName: string;
    profilePicture?: string;
    bio?: string;
    sessions?: unknown[];
    socialLinks?: string[];
};

type Props = {
    speaker: SpeakerCardData;
};

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function getLinkLabel(link: string) {
    try {
        return new URL(link).hostname.replace("www.", "");
    } catch {
        return "Link";
    }
}

export function
SpeakerCard({ speaker }: Props) {
    const sessionCount = speaker.sessions?.length ?? 0;

    return (
        <div className="glass group rounded-3xl p-6 border border-card-border/40 bg-gradient-to-b from-card/70 to-muted/10 shadow-sm transition-all duration-300 hover:translate-y-[-4px] hover:border-primary/30 hover:shadow-md flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none transition-all duration-300 group-hover:bg-primary/10" />

            <div>
                <div className="flex items-center gap-4 mb-5">
                    {speaker.profilePicture ? (
                        <img
                            src={speaker.profilePicture}
                            alt={speaker.fullName}
                            className="w-16 h-16 rounded-2xl object-cover border border-card-border/60 bg-muted shrink-0 shadow-sm"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-extrabold flex items-center justify-center text-xl shrink-0 font-[family-name:var(--font-syne)] shadow-sm">
                            {getInitials(speaker.fullName)}
                        </div>
                    )}

                    <div className="min-w-0">
                        <h3 className="font-[family-name:var(--font-syne)] text-base font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                            {speaker.fullName}
                        </h3>
                        <p className="text-[10px] font-bold text-accent tracking-wide uppercase flex items-center gap-1 mt-0.5">
                            <FiVideo size={11} /> {sessionCount} {sessionCount > 1 ? "Sessions" : "Session"}
                        </p>
                    </div>
                </div>

                {speaker.bio && (
                    <p className="text-xs text-muted-foreground/90 leading-relaxed line-clamp-3 mb-5 text-left">
                        {speaker.bio}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-4 mt-auto">
                {speaker.socialLinks && speaker.socialLinks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-card-border/20">
                        {speaker.socialLinks.map((link, i) => (
                            <a
                                key={i}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-muted-foreground hover:text-primary bg-muted/30 border border-card-border/30 rounded-lg px-2 py-1 transition-all uppercase no-underline"
                            >
                                <FiExternalLink size={10} />
                                <span className="truncate max-w-[100px]">{getLinkLabel(link)}</span>
                            </a>
                        ))}
                    </div>
                )}

                <Link href={`/speakers/${speaker.id}`} className="no-underline w-full">
                    <button className="w-full bg-card-border border border-primary/70 hover:bg-primary/95 text-primary hover:text-primary-foreground text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 group/btn">
                        <span>View profile</span>
                        <FiUser size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </Link>
            </div>
        </div>
    );
}