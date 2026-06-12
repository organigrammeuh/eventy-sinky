"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Event = { id: string; title: string };

export function EventFilter({ events, currentEventId }: { events: Event[]; currentEventId: string }) {
    const router = useRouter();
    const params = useSearchParams();

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const next = new URLSearchParams(params.toString());
        next.set("event", e.target.value);
        router.push(`/sessions?${next.toString()}`);
    };

    return (
        <select
            defaultValue={currentEventId}
            onChange={onChange}
            className="px-4 py-2 rounded-xl border border-border bg-card text-foreground text-sm cursor-pointer outline-none min-w-[200px]"
        >
            <option value="all">Tous les événements</option>
            {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
            ))}
        </select>
    );
}