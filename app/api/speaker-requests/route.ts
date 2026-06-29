import { createSpeakerRequest, findAllSpeakerRequests } from "@/db/speakerRequests";
import { SpeakerRequestCreation, SpeakerRequestFiltering } from "@/types/speakerRequests";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const range = req.nextUrl.searchParams.get("range");
        const rangeParsed: number[] = range ? JSON.parse(range) : [0, 19];

        let sort: string[] = [];
        try {
            const sortParam = req.nextUrl.searchParams.get("sort");
            if (sortParam) sort = JSON.parse(sortParam);
        } catch {
            sort = [];
        }

        let filters: SpeakerRequestFiltering = {};
        try {
            const filterParam = req.nextUrl.searchParams.get("filter");
            if (filterParam) filters = JSON.parse(filterParam);
        } catch {
            filters = {};
        }

        const result = await findAllSpeakerRequests(rangeParsed, filters, sort);

        const res = NextResponse.json(result.speakerRequests, { status: 200 });
        res.headers.set(
            "Content-Range",
            `speaker_requests ${rangeParsed[0]}-${rangeParsed[1]}/${result.total}`
        );
        return res;
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: error.status || 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        let body: SpeakerRequestCreation | null = null;
        try {
            body = await req.json();
            if (!body?.fullName?.trim()) throw new Error("Missing fullName");
        } catch {
            return NextResponse.json(
                { message: "Body invalide ou champ fullName manquant" },
                { status: 400 }
            );
        }

        const speakerRequest = await createSpeakerRequest(body);
        return NextResponse.json(speakerRequest, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: error.status || 500 });
    }
}