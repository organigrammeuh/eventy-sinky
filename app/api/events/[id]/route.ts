import { pool } from "@/lib/db";
import { Event, Session, Speaker } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req : NextRequest,
    { params }: { params: { id: string } }
){
    const { id } = await params;
    
        const findEventQuery = `
            SELECT 
                id, title, description, start_date, end_date, place
            FROM event
            WHERE id = $1
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
        
            const findEventResult = await pool.query(findEventQuery, [id]);


            if(findEventResult.rowCount == 0){
                return NextResponse.json({
                    message: `Event with id={${id}} not found`
                }, {
                    status : 404
                })
            }
        
        
            const row = findEventResult.rows[0];
    
            let event : Event= {
                id: row.id,
                description: row.description,
                endDate: row.end_date,
                startDate: row.start_date,
                location: row.location,
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
                
                const speakers : Speaker [] = [];

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

                    thisSpeaker.links = links;
                    
                    speakers.push(thisSpeaker);

                }
                fetchedSession.speakers = speakers;

                eventSessions.push(fetchedSession)
            }

            event.sessions = eventSessions;
            return NextResponse.json(
                event,
                {status : 200}
            );
    
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
    
    

}