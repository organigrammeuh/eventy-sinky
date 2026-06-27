import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { Session } from "@/types/sessions";
import { findSessionsByRoomId } from "@/db/room";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try{
        
        const { roomId } = await params;
    
        const sessions : Session[] = await findSessionsByRoomId(roomId);
    
        return NextResponse.json(sessions);
        
    } catch (err : any) {
        return NextResponse.json({
            message : err.message
        }, {
            status : err.status || 500
        });
    }
}