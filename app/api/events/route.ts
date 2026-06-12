import { NextRequest, NextResponse } from "next/server";
import { createEvent, findAllEvent } from "@/db/events";
import { EventCreation, EventPagination } from "@/types/events";

export async function POST (
    req : NextRequest
) {   

    const toSave : EventCreation  = await req.json();

    if(!toSave.startDate || !toSave.title || !toSave.endDate || !toSave.description){
        return NextResponse.json(
            {message : 'Please provide all the required infos about the event'},
            {status : 400}
        )
    }

    try{
        
        const event = await createEvent(toSave);

        return NextResponse.json(
            event, 
            { status : 201}
        );

    } catch (err :any) {

        return NextResponse.json(
            {
                message : 'Error when creating the event',
                error : err.message
            },
            {status : 500}
        );

    }
}

export async function GET(
    req: NextRequest
){
    
    try{

        const range = req.nextUrl.searchParams.get("range");
        const filter = req.nextUrl.searchParams.get("filter");
        const sort : string[] = req.nextUrl.searchParams.get("sort")?.split(",") ?? [];

        const rangeParsed : number[] = range ? JSON.parse(range) : [0, 99];
        const events : EventPagination = await findAllEvent(rangeParsed);

        const res =  NextResponse.json(
            events.events , {status: 200}
        ) ;

        res.headers.set(
            "Content-Range",
            `events ${rangeParsed[0]}-${rangeParsed[1]}/${events.total}`
        );

        return res;
        
    } catch (err : any){
        return NextResponse.json(
            {
                error : err.message,
                message: 'Error when fecthing all the evnts'
            },{
                status: 500
            }
        )
    }

}