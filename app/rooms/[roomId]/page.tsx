import Link from "next/link";

type Room = { id: string; name: string };

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

async function fetchRooms(): Promise<Room[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/rooms`, { cache: "no-store" });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

export default async function RoomsPage() {
    const rooms = await fetchRooms();

    return (
        <main className="pt-20 min-h-screen">
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Salles</h1>

                {rooms.length === 0 ? (
                    <p className="text-muted-foreground">Aucune salle disponible.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {rooms.map((room) => (
                            <Link key={room.id} href={`/rooms/${room.id}`} className="no-underline">
                                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <p className="font-medium">{room.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}