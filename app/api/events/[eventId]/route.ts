import { pool } from "@/lib/db";
import { Event, EventCreation, EventUpdate, Session, Speaker } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req : NextRequest,
    { params }: { params: { eventId: string } }
){
    const { eventId } = await params;
    
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
        
            const findEventResult = await pool.query(findEventQuery, [eventId]);


            if(findEventResult.rowCount == 0){
                return NextResponse.json({
                    message: `Event with id={${eventId}} not found`
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

                    thisSpeaker.socialLinks = links;
                    
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

export async function PATCH(
    req: NextRequest,
    { params }: { params: { eventId: string } }
){
    const { eventId } = await params;
    const udpatedData : EventUpdate = await req.json();

    if(!udpatedData){
        return NextResponse.json({
            message : 'Please provide at least one field to update'
        }, {
            status: 400
        })
    }

    const findEventQuery = `
        SELECT title FROM event WHERE id = $1
    `;

    const findEventResult = await pool.query(findEventQuery, [eventId]);

    if(findEventResult.rowCount == 0){
        return NextResponse.json({
            message: `Event with id={${eventId}} not found`
        });
    }

    let updateQuery = `
        UPDATE event
        SET
    `;

    let updateParams : any[] = [];

    if(udpatedData.description){
        updateQuery += ' description = $1';
        updateParams.push(udpatedData.description);
    }

    if(udpatedData.endDate){
        if(updateParams.length != 0){
            updateQuery += ','
        }
        updateParams.push(udpatedData.endDate);
        updateQuery += ` end_date = $${updateParams.length}`;
    }

    if(udpatedData.startDate){
        if(updateParams.length != 0){
            updateQuery += ','
        }
        updateParams.push(udpatedData.startDate);
        updateQuery += ` start_date = $${updateParams.length}`;
    }

    if(udpatedData.location){
        if(updateParams.length != 0){
            updateQuery += ','
        }
        updateParams.push(udpatedData.location);
        updateQuery += ` place = $${updateParams.length}`;
    }

    if(udpatedData.title){
        if(updateParams.length != 0){
            updateQuery += ','
        }
        updateParams.push(udpatedData.title);
        updateQuery += ` title = $${updateParams.length}`;
    };

    updateParams.push(eventId);
    updateQuery += ` WHERE id = $${updateParams.length}`;

    console.log(updateQuery);
    console

    await pool.query(
        updateQuery, updateParams
    );

    const fetchUpdatedEventQuery = `
        SELECT
            id, title, description, start_date, end_date, place
        FROM event
        WHERE id = $1
    `;

    const fetchUpdatedEventResult = await pool.query(fetchUpdatedEventQuery , [eventId]);

    const row = fetchUpdatedEventResult.rows[0];

    const updatedEvent : Event = {
        id: row.id,
        description: row.description,
        endDate: row.end_date,
        location: row.place,
        startDate: row.start_date,
        title: row.title
    };

    return NextResponse.json(
        updatedEvent , {
            status: 200
        }
    )

}

export async function DELETE(
    req: NextRequest,
    {params}: {params : {eventId : string}}
){
    const {eventId} = await params;

    const checkQuery = 'SELECT title FROM event WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [eventId]);

    if(checkResult.rowCount == 0){
        return NextResponse.json({
            message: `Event with id={${eventId}} not found.`
        },{
            status: 404
        });
    }

    const deleteQuery = 'DELETE FROM event WHERE id = $1';
    await pool.query(deleteQuery, [eventId]);

    return NextResponse.json({
        message: 'DELETED'
    }, {
        status: 200
    })
}