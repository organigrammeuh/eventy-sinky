import ExpandableText from "@/components/ExpandableText";
import { Event } from "@/lib/types";
import Link from "next/link";

const fetchAllEvents = async (): Promise<Event[]> => {
    const res = await fetch("http://localhost:3000/api/events");

    const rawEvents = await res.json();

    return rawEvents;
};

const refractorDate = (e : Event) => {

    const months : string[] = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July','August', 'September', 'October', 'November', 'December'
    ];

    const start = new Date(e.startDate).getDate() 
                    + ' ' 
                    + months[new Date(e.startDate).getMonth()] 
                    + ' ' 
                    + new Date(e.startDate).getFullYear();

    const end = new Date(e.startDate).getDate() 
        + ' ' 
        + months[new Date(e.startDate).getMonth()] 
        + ' ' 
        + new Date(e.startDate).getFullYear();

    return start + ' - ' + end;
}

export default async function EventPage() {

    const events : Event[] = await fetchAllEvents();

    return (
        <div 
            className="w-screen h-screen flex flex-col p-3 items-center py-10 gap-5"
        >
            <p className="text-3xl">Event sync</p>
            <p className="text-2xl" >You want ... events? yeah I guess</p>
            <div
            className="flex gap-5 w-3/5 justify-center border p-5 h-screen"
            >

                {events.map((e) => (
                    <div key={e.id} className="
                    flex flex-col gap-3 rounded-2xl border p-5 w-1/3 h-1/2
                    ">
                            <p className="font-bold text-2xl" >{e.title}</p>
                            <ExpandableText text={e.description} />
                            <hr />
                            <p>
                                {
                                    refractorDate(e)
                                }
                            </p>
                            <p>{e.location}</p>
                            <Link key={e.id} href={`/events/${e.id}`}>
                            <button
                                className="bg-green-300 p-2 rounded-2xl cursor-pointer"
                            >View planning</button>
                            </Link>
                        </div>
                ))}
            </div>
        </div>
    );
}