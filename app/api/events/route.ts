import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { Event, EventCreation } from "@/types/events";
import { Session } from "@/types/sessions";
import { Speaker } from "@/types/speakers";
import { createEvent } from "@/db/events";

export async function POST (
    req : NextRequest
) {   
    
    const toSave : EventCreation  = await req.json();

    if(!toSave.startDate || !toSave.title || !toSave.endDate || !toSave.description){
        return NextResponse.json(
            {message : 'Please provide all the required infos about the event'},
            {status : 400}
        )
    }

    try{
        
        const event = await createEvent(toSave);

        return NextResponse.json(
            event, 
            { status : 201}
        );

    } catch (err :any) {

        return NextResponse.json(
            {
                message : 'Error when creating the event',
                error : err.message
            },
            {status : 500}
        );

    }
}

export async function GET(){
    
    let events : Event[] = [];

    const findEventQuery = `
        SELECT 
            id, title, description, start_date, end_date, place
        FROM event;
        `;
    
    const findSessionQuery = `
        SELECT
            s.id, s.title, s.description,
            s.start_date, s.end_date, s.capacity,
            r.name
        FROM session s
        JOIN room r on s.id_room = r.id
        WHERE
            id_event = $1

    `;

    const findSpeakerQuery = `
        SELECT
            id, full_name, profile_picture_url, biography
        FROM speaker s
        JOIN session_speaker ss
            ON ss.id_speaker = s.id
        WHERE ss.id_session = $1
    `;

    const findSpeakerLinksQuery = `
        SELECT 
            url
        FROM link
        WHERE id_speaker = $1
    `;

    try{
    
        const findEventResult = await pool.query(findEventQuery);
    
    
        for(const row of findEventResult.rows){

            let event : Event = {
                id: row.id,
                description: row.description,
                endDate: row.end_date,
                startDate: row.start_date,
                location: row.place,
                title: row.title
            };
            
            let eventSessions : Session[] = [];

            const findSessionResult = await pool.query(
                findSessionQuery, [event.id]
            );

            for(const session of findSessionResult.rows){
                let fetchedSession : Session = {
                     id: session.id,
                     capacity: session.capacity,
                     description: session.description,
                     endTime: session.end_date,
                     room: session.name,
                     startTime: session.start_date,
                     title: session.title
                };

                const findSpeakerResult = await pool.query(
                    findSpeakerQuery , [session.id]
                );
                
                const speakers : Speaker[] = [];

                for(const speaker of findSpeakerResult.rows){
                    
                    let thisSpeaker : Speaker = {
                        id: speaker.id,
                        bio: speaker.biography,
                        fullName: speaker.full_name,
                        profilePicture: speaker.profile_picture_url
                    };

                    let links : string[] = [];

                    const getSpeakerLinkResult = await pool.query(
                        findSpeakerLinksQuery , [speaker.id]
                    );

                    for(const linkRow of getSpeakerLinkResult.rows){
                        links.push(linkRow.url);
                    }

                    thisSpeaker.socialLinks = links;
                    
                    speakers.push(thisSpeaker);

                }
                fetchedSession.speakers = speakers;

                eventSessions.push(fetchedSession)
            }

            event.sessions = eventSessions;

            events.push(event);

        }

    } catch (err : any){
        return NextResponse.json(
            {
                error : err.message,
                message: 'Error when fecthing all the evnts'
            },{
                status: 500
            }
        )
    }


    return NextResponse.json(
        events,
        {status : 200}
    );

}