import { pool } from "@/lib/db";
import { Room, RoomCreation } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req : NextRequest
){
    
    const body : RoomCreation = await req.json();

    const createRoomReq = `
        INSERT INTO room
            (name)
        VALUES ($1)
        RETURNING id;
    ` 

    const createRoomResult = await pool.query(createRoomReq , [body.name]);

    const createdRoom : Room = {
        id: createRoomResult.rows[0].id,
        name : body.name
    };

    return NextResponse.json(
        createdRoom, {
            status: 201
        }
    )
}


export async function GET(){
    
    const findRoomReq = `
        SELECT id, name
        FROM room
    `;

    let rooms : Room[]= [];

    const findRoomRes = await pool.query(findRoomReq);

    for(const room of findRoomRes.rows){
        rooms.push({
            id: room.id,
            name: room.name
        })
    };

    return NextResponse.json(
        rooms, {
            status: 200
        }
    )
}