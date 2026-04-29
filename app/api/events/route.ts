import { EventCreation, Event } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

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
        const query = `
            INSERT INTO event
            (title, description, start_date, end_date, place)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;
    
        const queryResult = await pool.query(
            query, [
                toSave.title,
                toSave.description,
                toSave.startDate,
                toSave.endDate,
                toSave.location
            ]
        );
    
        const createdEventId : string = queryResult.rows[0].id;

        const event : Event = {
            description: toSave.description,
            endDate: toSave.endDate,
            startDate: toSave.startDate,
            id: createdEventId,
            location: toSave.location,
            title: toSave.title
        };

        return NextResponse.json(
            event, 
            { status : 201}
        );

    } catch (err :any) {
        console.error(err);
        return NextResponse.json(
            {
                message : 'Error when creating the event',
                error : err.message
            },
            {status : 500}
        );
    }
}