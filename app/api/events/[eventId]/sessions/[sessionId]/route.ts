import { NextRequest, NextResponse } from "next/server";
import { SessionCreation} from "@/types/sessions";
import { findSessionById, updateSession } from "@/db/session";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string; sessionId: string }> }
) {
    const { eventId, sessionId } = await params;
    const toUpdate: Partial<SessionCreation> = await req.json();

    try {
    
        await findSessionById(sessionId, eventId);

        const session = await updateSession(
            sessionId,
            eventId,
            toUpdate
        );

        return NextResponse.json(session, { status: 200 });

    } catch (err: any) {
        return NextResponse.json(
            { message: err.message},
            { status: err.status || 500 }
        );
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string; sessionId: string }> }
) {
    try {

        const {eventId, sessionId} = await params;
        const event = await findSessionById(sessionId, eventId);

        return NextResponse.json(
            event, {status: 200}
        )
         
    } catch (err: any) {
        
        return NextResponse.json({
            message : err.message
        },{
            status : err.status || 500
        })
    }
}