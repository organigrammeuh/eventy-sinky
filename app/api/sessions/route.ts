import { NextResponse } from "next/server";
import { findAllSessions } from "@/db/session";

export async function GET() {
    try {
        const sessions = await findAllSessions();
        return NextResponse.json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}