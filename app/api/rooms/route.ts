import { createRoom, findAllRooms } from "@/db/room";
import { RoomCreation, RoomFiltering } from "@/types/room";
import { toSnakeCase } from "@/lib/params";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        let body: RoomCreation = { name: "", idLocation: "" };

        try {
            body = await req.json();
            if (
                Object.keys(body).length == 0 ||
                !Object.keys(body).includes("name") ||
                !Object.keys(body).includes("idLocation")
            ) {
                throw new Error("Missing body");
            }
        } catch {
            return NextResponse.json(
                {
                    message: "Please provide name and idLocation in the request body",
                },
                {
                    status: 400,
                },
            );
        }

        const createdRoom = await createRoom(body.name, body.idLocation);

        return NextResponse.json(createdRoom, {
            status: 201,
        });
    } catch (err: any) {
        return NextResponse.json(
            {
                message: err.message,
            },
            {
                status: err.status || 500,
            },
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const range = req.nextUrl.searchParams.get("range");
        let sort: any = [];
        try {
            const sortParam = req.nextUrl.searchParams.get("sort");
            if (sortParam) sort = JSON.parse(sortParam);
        } catch {
            sort = [];
        }

        let filters: RoomFiltering = {};
        try {
            const filtersParams = req.nextUrl.searchParams.get("filter");
            if (filtersParams) filters = JSON.parse(filtersParams);
        } catch {
            filters = {};
        }

        const sorting = sort.length == 0 ? [] : [toSnakeCase(sort[0]), sort[1]];
        const rangeParsed: number[] = range ? JSON.parse(range) : [];
        const result = await findAllRooms(rangeParsed, filters, sorting);

        const res = NextResponse.json(result.rooms, { status: 200 });
        res.headers.set(
            "Content-Range",
            `rooms ${rangeParsed[0]}-${rangeParsed[1]}/${result.total}`
        );
        return res;
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message, message: "Error when fetching rooms" },
            { status: 500 }

        );
    }
}
