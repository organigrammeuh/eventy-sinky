import {NextRequest, NextResponse} from "next/server";
import { pool } from "@/lib/db";
import {Session, SessionCreation} from "@/types/sessions";
import { createEventSession, findEventSession } from "@/db/session";
import { findEventById } from "@/db/events";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;

        await findEventById(eventId);
    
        const sessions = await findEventSession(eventId);
    
        return NextResponse.json(sessions);

    } catch(err : any){

        return NextResponse.json({
            message: err.message
        },{
            status : err.status || 500
        });

    }

}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {

    
    try {
        
        const { eventId } = await params;
        const toSave: SessionCreation = await req.json();
    
        await findEventById(eventId);
    
        if (!toSave.title || !toSave.startTime || !toSave.endTime) {
            return NextResponse.json(
                { message: "Please provide all the required infos about the session" },
                { status: 400 }
            );
        }
        
        const createdSession = await createEventSession(eventId , toSave);

        return NextResponse.json(createdSession, { status: 201 });

    } catch (err: any) {

        return NextResponse.json(
            { message: err.message},
            { status: err.status || 500 }
        );

    }
}