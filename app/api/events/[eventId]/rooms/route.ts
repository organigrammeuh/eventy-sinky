import { NextRequest, NextResponse } from "next/server";
import { RoomSessions } from "@/types/room";
import { findSessionByRoom } from "@/db/room";

export async function GET(
    req: NextRequest ,
    {params} : {params : {eventId : string}}
) {
    try{
        const { eventId } = await params;

        const sessionPerRoom : RoomSessions[] = await findSessionByRoom(eventId);

        return NextResponse.json(
            sessionPerRoom, {
                status: 200
            }
        )

    } catch (err : any){
        return NextResponse.json(
            {
                message : err.message,
            },{
                status: err.status || 500
            }
        )
    }

    
}