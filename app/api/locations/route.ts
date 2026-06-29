import { NextRequest, NextResponse } from "next/server";
import { createLocation, findAllLocations } from "@/db/location";
import { LocationCreation, LocationFiltering } from "@/types/location";
import { toSnakeCase } from "@/lib/params";

export async function POST(req: NextRequest) {
    try {
        const body: LocationCreation = await req.json();

        if (!body.country || !body.city) {
            return NextResponse.json(
                { message: "Please provide country and city" },
                { status: 400 }
            );
        }

        const location = await createLocation(body);

        return NextResponse.json(location, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { message: err.message },
            { status: err.status || 500 }
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

        let filters: LocationFiltering = {};
        try {
            const filtersParams = req.nextUrl.searchParams.get("filter");
            if (filtersParams) filters = JSON.parse(filtersParams);
        } catch {
            filters = {};
        }

        const sorting = sort.length == 0 ? [] : [toSnakeCase(sort[0]), sort[1]];
        const rangeParsed: number[] = range ? JSON.parse(range) : [];
        const result = await findAllLocations(rangeParsed, filters, sorting);

        const res = NextResponse.json(result.locations, { status: 200 });
        res.headers.set(
            "Content-Range",
            `locations ${rangeParsed[0]}-${rangeParsed[1]}/${result.total}`
        );
        return res;
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message, message: "Error when fetching locations" },
            { status: 500 }
        );
    }
}
