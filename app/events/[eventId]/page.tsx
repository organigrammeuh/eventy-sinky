import { Event, Session } from "@/lib/types";
import { refractorDate } from "../page";
import EventSessionList from "@/components/EventSessionsList";

type EventProps = {
    params : {
        eventId : string
    }
}

export default async function EventPage({params} : EventProps){

    const {eventId} = await params;

    const eventRes = await fetch('http://localhost:3000/api/events/' + eventId);
    const event : Event = await eventRes.json();

    const sessionRes = await fetch('http://localhost:3000/api/events/'+eventId+'/sessions');
    const sessions : Session[] = await sessionRes.json();
    return (
        <div 
            className="w-screen h-screen"
        >
            <div className="p-3 border-b">
                <p
                    className="text-2xl mb-2"
                >
                    {
                        event.title
                    }
                </p>
                <p  
                    className="font-extralight"
                >
                    {
                        refractorDate(event) + ' / ' + event.location
                    }
                    
                </p>
            </div>

            <EventSessionList sessions={sessions} />
        </div>
    )
}   