import { deleteEvent, findEventById, updateEvent } from "@/db/events";
import { pool } from "@/lib/db";
import {Event, EventUpdate} from '@/types/events'

import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req : NextRequest,
    { params }: { params: { eventId: string } }
){
    const { eventId } = await params;

    try{
        const event : Event = await findEventById(eventId);

        return NextResponse.json(
            event,
            {status : 200}
        );    

    } catch (err : any){

        return NextResponse.json({
                message : err.message
            },{
                status: err.status || 500
            }
        );
    }
    
    

}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { eventId: string } }
){
    try {
        const { eventId } = await params;
        const udpatedData : EventUpdate = await req.json();

        if(!udpatedData){
            return NextResponse.json({
                message : 'Please provide at least one field to update'
            }, {
                status: 400
            })
        }

        //Throws an exception if no event found
        //So we don't need to handle this ourselves
        await findEventById(eventId);
        
        const updatedEvent = await updateEvent(eventId, udpatedData);

        return NextResponse.json(
            updatedEvent , {
                status: 200
            }
        );


    } catch(err : any) {
        return NextResponse.json(
            err.message,
            {status : err.status || 500}
        )
    }
    

}

export async function DELETE(
    req: NextRequest,
    {params}: {params : {eventId : string}}
){
    const {eventId} = await params;

    //Also throws an exception if not found
    await findEventById(eventId);
    
    await deleteEvent(eventId);

    return NextResponse.json({
        message: 'DELETED'
    }, {
        status: 200
    })
}