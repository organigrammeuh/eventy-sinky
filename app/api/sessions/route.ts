import { findAllSessions } from "@/db/session";
import { SessionFiltering, SessionPagination } from "@/types/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try{
        const range = req.nextUrl.searchParams.get("range");
        const rangeParsed: number[] = range ? JSON.parse(range) : [];

        let filters: SessionFiltering = {};
        try {
            const filterParam = req.nextUrl.searchParams.get("filter");
            if (filterParam) filters = JSON.parse(filterParam);
        } catch {
            filters = {};
        }

        const result: SessionPagination = await findAllSessions(rangeParsed, filters);

        const res = NextResponse.json(result.sessions);

        res.headers.set(
            "Content-Range",
            `sessions ${rangeParsed[0]}-${rangeParsed[1]}/${result.total}`
        );

        return res;
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}