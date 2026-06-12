import { createSpeaker, findAllSpeaker } from "@/db/speakers";
import { Speaker, SpeakerCreation, SpeakerFiltering, SpeakerPagination } from "@/types/speakers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const range = req.nextUrl.searchParams.get("range");
        const rangeParsed: number[] = range ? JSON.parse(range) : [];

        let sort: any = [];
        try {
            const sortParam = req.nextUrl.searchParams.get("sort");
            if (sortParam) sort = JSON.parse(sortParam);
            console.log(sort);
        } catch {
            sort = [];
        }

        let filters: SpeakerFiltering = {};
        try {
            const filterParam = req.nextUrl.searchParams.get("filter");
            if (filterParam) filters = JSON.parse(filterParam);
        } catch {
            filters = {};
        }

        const result: SpeakerPagination = await findAllSpeaker(rangeParsed, filters, sort);

        const res = NextResponse.json(result.speakers, { status: 200 });

        res.headers.set(
            "Content-Range",
            `speakers ${rangeParsed[0]}-${rangeParsed[1]}/${result.total}`
        );

        return res;
    } catch (error : any) {
        return NextResponse.json(
            { message : error.message},
            { status: error.status || 500 }
        );
    }
}

export async function POST(
    req : NextRequest
) {
    
    try {
        
        let toSave : SpeakerCreation | null = null ;
        try {

            toSave = await req.json();

            if(!Object.keys(toSave!).includes('fullName')){
                throw new Error('Wrong body')
            }
        } catch {

            return NextResponse.json(
                { message : 'Not a valid body or missing fullName field'},
                { status: 400 }
            );

        }
    
        const speaker = await createSpeaker(toSave!);

        return NextResponse.json(speaker, { status: 201 });

    } catch (error) {
        console.error("ERREUR POST /speakers", error);
        return NextResponse.json(
            { error: "Erreur serveur", message: String(error) },
            { status: 500 }
        );
    }
}