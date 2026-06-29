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
        const formData = await req.formData();
        
        const fullName = formData.get("fullName") as string | null;
        const biography = formData.get("biography") as string | null;
        const profilePicture = formData.get("profilePicture") as File | null;
        const linksJson = formData.get("links") as string | null;

        if (!fullName || !fullName.trim()) {
            return NextResponse.json(
                { message: "Invalid body or missing full name" },
                { status: 400 }
            );
        }

        let parsedLinks = [];
        if (linksJson) {
            try {
                parsedLinks = JSON.parse(linksJson);
            } catch {
                return NextResponse.json(
                    { message: "Invalid links format" },
                    { status: 400 }
                );
            }
        }

        const speakerData = {
            fullName: fullName.trim(),
            biography: biography?.trim() || null,
            profilePicture: profilePicture || null, 
            links: parsedLinks,
        };

        const speakerRequest = await createSpeakerRequest(speakerData);
        
        return NextResponse.json(speakerRequest, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal server error" }, 
            { status: error.status || 500 }
        );
    }
}