import { Speaker } from "@/lib/types";
import Link from "next/link";
import ExpandableText from "@/components/ExpandableText";

const fetchAllSpeakers = async (): Promise<Speaker[]> => {
    const res = await fetch("http://localhost:3000/api/speakers");
    const rawSpeakers = await res.json();
    return rawSpeakers;
};

const getLinkLabel = (link: string) => {
    try {
        return new URL(link).hostname;
    } catch {
        return link;
    }
};

const getInitials = (fullName: string) => {
    return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export default async function SpeakersPage() {
    const speakers: Speaker[] = await fetchAllSpeakers();

    return (
        <div className="w-screen min-h-screen flex flex-col p-3 items-center py-10 gap-5">
            <p className="text-3xl">Speakers</p>
            <p className="text-2xl">Meet the people behind the sessions</p>

            <div className="flex flex-wrap gap-5 w-4/5 justify-center border p-5">
                {speakers.map((speaker) => (
                    <div
                        key={speaker.id}
                        className="flex flex-col gap-3 rounded-2xl border p-5 w-64"
                    >
                        {/* Avatar */}
                        <div className="flex justify-center">
                            {speaker.profilePicture ? (
                                <img
                                    src={speaker.profilePicture}
                                    alt={speaker.fullName}
                                    className="w-20 h-20 rounded-full object-cover border"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full border flex items-center justify-center bg-gray-100 text-xl font-bold text-gray-500">
                                    {getInitials(speaker.fullName)}
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        <p className="font-bold text-xl text-center">{speaker.fullName}</p>

                        {/* Bio */}
                        {speaker.bio && (
                            <ExpandableText text={speaker.bio} />
                        )}

                        <hr />

                        {/* Sessions count */}
                        <p className="text-sm text-gray-500">
                            {speaker.sessions?.length ?? 0} session(s)
                        </p>

                        {/* Social links */}
                        {speaker.socialLinks && speaker.socialLinks.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {speaker.socialLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 text-xs underline truncate max-w-full"
                                    >
                                        {getLinkLabel(link)}
                                    </a>
                                ))}
                            </div>
                        )}

                        <Link href={`/speakers/${speaker.id}`}>
                            <button className="bg-green-300 p-2 rounded-2xl cursor-pointer w-full">
                                View profile
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
