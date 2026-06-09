import { createSpeaker, findAllSpeaker } from "@/db/speakers";
import { Speaker , SpeakerCreation } from "@/types/speakers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const speakers: Speaker[] = await findAllSpeaker();
        return NextResponse.json(speakers, { status: 200 })
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