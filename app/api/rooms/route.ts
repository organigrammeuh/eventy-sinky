import { createRoom, findAllRooms } from "@/db/room";
import {  RoomCreation } from "@/types/room";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req : NextRequest
){
    try {

        let body : RoomCreation = {name : ''};

        try {
            body = await req.json();
            if(Object.keys(body).length == 0 || !Object.keys(body).includes('name')){
                throw new Error('Missing body')
            }
        } catch {
            return NextResponse.json({
                message : 'Please provide a name in the request body'
            }, {
                status: 400
            })
        }        
    
        const createdRoom = await createRoom(body.name);
    
        return NextResponse.json(
            createdRoom, {
                status: 201
            }
        )

    } catch (err : any) {
        return NextResponse.json({
            message : err.message
        },{
            status : err.status || 500
        })
    }   
}


export async function GET(){
    try {
        
        const rooms = await findAllRooms();

        return NextResponse.json(
            rooms, {
                status: 200
            }
        )
    } catch (err : any) {
        return NextResponse.json({
            message : err.message
        },{
            status : err.status || 500
        })
    }

}