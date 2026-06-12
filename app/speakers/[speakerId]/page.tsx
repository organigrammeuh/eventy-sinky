import { Speaker } from "@/lib/types";
import Link from "next/link";

type SpeakerProps = {
    params: Promise<{ speakerId: string }>;
};

const getLinkLabel = (link: string) => {
    try {
        return new URL(link).hostname;
    } catch {
        return link;
    }
};

const getInitials = (fullName: string) => {
    if (!fullName) return "?";
    return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return (
        d.getDate() +
        "/" +
        (d.getMonth() + 1) +
        " - " +
        d.toISOString().substring(11, 16)
    );
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default async function SpeakerPage({ params }: SpeakerProps) {
    const { speakerId } = await params;

    const speakerRes = await fetch(`${BASE_URL}/api/speakers/${speakerId}`, {
        cache: "no-store",
    });
    const speaker: Speaker = await speakerRes.json();

    return (
        <div className="w-screen min-h-screen">
            {/* Header */}
            <div className="p-3 border-b flex gap-5 items-center">
                {speaker.profilePicture ? (
                    <img
                        src={speaker.profilePicture}
                        alt={speaker.fullName}
                        className="w-16 h-16 rounded-full object-cover border"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full border flex items-center justify-center bg-gray-100 text-lg font-bold text-gray-500">
                        {getInitials(speaker.fullName)}
                    </div>
                )}

                <div>
                    <p className="text-2xl mb-1">{speaker.fullName}</p>

                    {speaker.socialLinks && speaker.socialLinks.length > 0 && (
                        <div className="flex gap-3 flex-wrap">
                            {speaker.socialLinks.map((link, i) => (
                                <a
                                    key={i}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-sm underline"
                                >
                                    {getLinkLabel(link)}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {speaker.bio && (
                <div className="p-5 border-b">
                    <p className="font-semibold mb-2">Bio</p>
                    <p className="font-extralight">{speaker.bio}</p>
                </div>
            )}

            <div className="p-5">
                <p className="font-semibold mb-4">
                    Sessions ({speaker.sessions?.length ?? 0})
                </p>

                {speaker.sessions && speaker.sessions.length > 0 ? (
                    <div className="flex flex-col gap-3 w-full max-w-lg">
                        {speaker.sessions.map((session: any) => (
                            <Link key={session.id} href={`/sessions/${session.id}`}>
                                <div className="p-3 border rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex gap-4">
                                        <p className="text-blue-400 whitespace-nowrap text-sm">
                                            {formatTime(session.startTime)}
                                        </p>
                                        <div>
                                            <p className="font-medium">{session.title}</p>
                                            <p className="text-gray-500 text-sm">
                                                {session.room?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">No sessions assigned yet.</p>
                )}
            </div>
        </div>
    );
}