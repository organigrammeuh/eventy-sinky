import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import SessionDetailClient from "@/components/Session/SessionDetails";

type SessionPageProps = {
    params: Promise<{ sessionId: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default async function SessionDetailPage({ params }: SessionPageProps) {
    const { sessionId } = await params;

    const res = await fetch(`${BASE_URL}/api/sessions/${sessionId}`, { cache: "no-store" });

    if (!res.ok) {
        return (
            <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
                <p className="text-muted-foreground text-sm mb-4">Session could not be located.</p>
                <Link href="/sessions" className="text-xs font-bold text-primary flex items-center gap-2 no-underline">
                    <FiArrowLeft /> Back to directory
                </Link>
            </div>
        );
    }

    const session = await res.json();

    return <SessionDetailClient initialSession={session} />;
}