import { approveSpeakerRequest, findSpeakerRequestById, updateSpeakerRequestStatus } from "@/db/speakerRequests";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const speakerRequest = await findSpeakerRequestById(id);
        return NextResponse.json(speakerRequest, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal server error" }, 
            { status: error.status || 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const body = await req.json();
        const { status } = body;

        if (!["approved", "rejected"].includes(status)) {
            return NextResponse.json(
                { message: "Status must be either 'approved' or 'rejected'" },
                { status: 400 }
            );
        }

        if (status === "approved") {
            const { speakerId } = await approveSpeakerRequest(id);
            return NextResponse.json({ speakerId, status: "approved" }, { status: 200 });
        }

        const updated = await updateSpeakerRequestStatus(id, "rejected");
        return NextResponse.json(updated, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal server error" }, 
            { status: error.status || 500 }
        );
    }
}