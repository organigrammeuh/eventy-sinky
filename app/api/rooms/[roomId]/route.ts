import { NextRequest, NextResponse } from "next/server";
import { findRoomById } from "@/db/room";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        const room = await findRoomById(roomId);
        return NextResponse.json(room, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { message: err.message },
            { status: err.status || 500 }
        );
    }
}
