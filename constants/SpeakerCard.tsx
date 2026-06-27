import Link from "next/link";

export type SpeakerCardData = {
    id: string;
    fullName: string;
    profilePicture?: string;
    bio?: string;
    sessions?: unknown[];
};

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

type Props = {
    speaker: SpeakerCardData;
    variant?: "default" | "compact";
};

export function SpeakerCard({ speaker, variant = "default" }: Props) {
    if (variant === "compact") {
        return (
            <Link href={`/speakers/${speaker.id}`} className="no-underline group block">
                <div className="card-hover glass flex items-center gap-4 px-4 py-3.5 rounded-xl hover:border-primary/40">
                    {speaker.profilePicture ? (
                        <img
                            src={speaker.profilePicture}
                            alt={speaker.fullName}
                            className="w-11 h-11 rounded-full object-cover border-2 border-primary-muted shrink-0 shadow-sm"
                        />
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-primary-muted text-primary flex items-center justify-center font-bold text-sm shrink-0 tracking-wide">
                            {getInitials(speaker.fullName)}
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                            {speaker.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-accent/60"></span>
                            {speaker.sessions?.length ?? 0} session
                            {(speaker.sessions?.length ?? 0) !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/speakers/${speaker.id}`} className="no-underline group block h-full">
            <article
                className="
                    card-hover
                    glass
                    flex
                    flex-col
                    items-center
                    text-center
                    rounded-2xl
                    p-6
                    w-full
                    h-[280px]
                    relative
                    overflow-hidden
                    hover:border-primary/40
                "
            >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {speaker.profilePicture ? (
                    <div className="relative p-1 rounded-full border border-card-border/60 group-hover:border-primary/40 transition-colors duration-300 shrink-0">
                        <img
                            src={speaker.profilePicture}
                            alt={speaker.fullName}
                            className="
                                w-18
                                h-18
                                rounded-full
                                object-cover
                                border-2
                                border-transparent
                                group-hover:scale-105
                                transition-transform
                                duration-300
                                shrink-0
                            "
                        />
                    </div>
                ) : (
                    <div
                        className="
                            w-18
                            h-18
                            rounded-full
                            bg-primary-muted
                            text-primary
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-xl
                            border-2
                            border-primary/10
                            group-hover:border-primary/40
                            group-hover:scale-105
                            transition-all
                            duration-300
                            shrink-0
                        "
                    >
                        {getInitials(speaker.fullName)}
                    </div>
                )}

                <div className="flex flex-col flex-1 mt-4 w-full relative z-10">
                    <p className="font-bold text-base text-foreground line-clamp-1 tracking-tight group-hover:text-primary transition-colors">
                        {speaker.fullName}
                    </p>

                    <p
                        className="
                            text-xs
                            text-muted-foreground/90
                            mt-2
                            leading-relaxed
                            line-clamp-3
                            text-pretty
                        "
                    >
                        {speaker.bio || "Aucune biographie disponible pour le moment."}
                    </p>
                </div>

                <span className="badge badge-primary mt-auto px-4 py-1.5 backdrop-blur-sm border border-primary/10 relative z-10 shadow-sm">
                    {speaker.sessions?.length ?? 0} session
                    {(speaker.sessions?.length ?? 0) !== 1 ? "s" : ""}
                </span>
            </article>
        </Link>
    );
}

export function SpeakerCardSkeleton({ variant = "default" }: { variant?: "default" | "compact" }) {
    if (variant === "compact") {
        return (
            <div className="glass flex items-center gap-4 px-4 py-3.5 rounded-xl">
                <div className="skeleton w-11 h-11 rounded-full shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                    <div className="skeleton h-3.5 w-24 rounded" />
                    <div className="skeleton h-2.5 w-16 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="glass flex flex-col items-center rounded-2xl p-6 h-[280px]">
            <div className="skeleton w-18 h-18 rounded-full" />
            <div className="flex flex-col items-center flex-1 mt-4 w-full">
                <div className="skeleton h-4 w-32 rounded" />
                <div className="mt-3 flex flex-col gap-1.5 items-center w-full">
                    <div className="skeleton h-3 w-4/5 rounded" />
                    <div className="skeleton h-3 w-2/3 rounded" />
                </div>
            </div>
            <div className="skeleton h-6 w-20 rounded-full mt-auto" />
        </div>
    );
}