import { NextRequest, NextResponse } from "next/server";
import { createEvent, findAllEvent } from "@/db/events";
import { EventCreation, EventFiltering, EventPagination } from "@/types/events";
import { toSnakeCase } from "@/lib/params";
import { toLowerCase } from "zod";

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
        let sort : any = [];
        try {
            const sortParam = req.nextUrl.searchParams.get("sort");
            if (sortParam) sort = JSON.parse(sortParam);
            //TODO: migration => change in the db place -> location
            if(sort[0] == 'location') sort[0] = 'place'
        } catch {
            sort = [];
        }
        
        console.log(req.nextUrl.searchParams.get("filter"))

        let filters : EventFiltering = {};
        try {
            const filtersParams = req.nextUrl.searchParams.get("filter");
            if (filtersParams) filters = JSON.parse(filtersParams);
        } catch {
            filters = {};
        }

        for (const key of ['start_date', 'end_date'] as const) {
            const val = filters[key];
            if (val && !/[Z+-]\d/.test(val)) filters[key] = val + 'Z';
        }


        const sorting = sort.length == 0 ? [] : [toSnakeCase(sort[0]), sort[1]];

        const rangeParsed : number[] = range ? JSON.parse(range) : [];
        const events : EventPagination = await findAllEvent(rangeParsed, sorting, filters);

        const res =  NextResponse.json(
            events.events , {status: 200}
        ) ;

        res.headers.set(
            "Content-Range",
            `events ${rangeParsed[0]}-${rangeParsed[1]}/${events.total}`
        );

        return res;
        
    } catch (err : any){
        console.log(err.message)

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