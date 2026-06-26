import { deleteSpeaker, findSpeakerById, updateSpeaker } from "@/db/speakers";
import { SpeakerUpdate } from "@/types/speakers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ speakerId: string }> },
) {
    try {
        const { speakerId } = await params;
        const speaker = await findSpeakerById(speakerId);

        if (!speaker) {
            return NextResponse.json({ error: "Speaker not found" }, { status: 404 });
        }

        return NextResponse.json(speaker, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { message: err.message },
            { status: err.status || 500 },
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ speakerId: string }> },
) {
    try {
        const { speakerId } = await params;
        const toUpdate: SpeakerUpdate = await req.json();
        const speaker = await updateSpeaker(speakerId, toUpdate);

        return NextResponse.json(speaker, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: error.status || 500 },
        );
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ speakerId: string }> },
) {
    try {
        const { speakerId } = await params;

        await findSpeakerById(speakerId);
        await deleteSpeaker(speakerId);
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: error.status || 500 },
        );
    }
}
