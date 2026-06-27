import { NextRequest, NextResponse } from "next/server";
import { findRoomById, updateRoom, deleteRoom } from "@/db/room";

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

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        const body = await req.json();
        const room = await updateRoom(roomId, body.name);
        return NextResponse.json(room, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { message: err.message },
            { status: err.status || 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        await deleteRoom(roomId);
        return NextResponse.json({}, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { message: err.message },
            { status: err.status || 500 }
        );
    }
}
