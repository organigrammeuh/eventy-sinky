"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Event = { id: string; title: string };

export function EventFilter({ events, selectedEventId }: { events: Event[]; selectedEventId?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const next = new URLSearchParams(searchParams.toString());
        const value = e.target.value;

        if (value === "all" || !value) {
            next.delete("eventId"); // Remove param if "All Events" is selected
        } else {
            next.set("eventId", value); // Key changed from "event" to "eventId" to match page.tsx
        }

        router.push(`/sessions?${next.toString()}`);
    };

    return (
        <select
            value={selectedEventId || "all"}
            onChange={onChange}
            className="px-4 py-2 rounded-xl border border-card-border bg-card text-foreground text-sm cursor-pointer outline-none min-w-[200px] hover:border-primary/40 transition-colors"
        >
            <option value="all">All Events</option>
            {events.map((e) => (
                <option key={e.id} value={e.id}>
                    {e.title}
                </option>
            ))}
        </select>
    );
}