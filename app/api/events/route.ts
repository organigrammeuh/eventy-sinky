import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { Event, EventCreation } from "@/types/events";
import { Session } from "@/types/sessions";
import { Speaker } from "@/types/speakers";
import { createEvent, findAllEvent } from "@/db/events";
import { findSessionSpeaker } from "@/db/speakers";

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
    
    try{
        const events : Event[] = await findAllEvent();

        return NextResponse.json(
            events , {status: 200}
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