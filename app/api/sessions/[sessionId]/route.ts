import { deleteSession, findSessionById } from "@/db/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params;
        const session = await findSessionById(sessionId);
        return NextResponse.json(session);
    } catch (err: any) {
        return NextResponse.json(
            { message: err.message },
            { status: err.status || 500 }
        );
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params;
        await deleteSession(sessionId);
        return NextResponse.json({
            message : 'Session deleted',
            status : 200
        });
    } catch (err: any) {
        return NextResponse.json(
            { message: err.message },
            { status: err.status || 500 }
        );
    }
}