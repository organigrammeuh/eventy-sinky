import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/errors/AppError";
import { associateSpeakerToSession } from "@/db/speakers";

export async function PATCH(
    _req: NextRequest,
    { params }: { params: Promise<{ eventId: string; sessionId: string; speakerId: string }> }
) {
    const { eventId, sessionId, speakerId } = await params;

    try {
        await associateSpeakerToSession(sessionId, speakerId, eventId);

        return NextResponse.json(
            { message: "Speaker associated successfully" },
            { status: 200 }
        );

    } catch (err: any) {
            return NextResponse.json(
                { message: err.message },
                { status: err.status || 500 }
            );
    }
}