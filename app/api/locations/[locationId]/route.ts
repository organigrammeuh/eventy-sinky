import { NextRequest, NextResponse } from "next/server";
import { findLocationById, updateLocation, deleteLocation } from "@/db/location";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ locationId: string }> }
) {
    try {
        const { locationId } = await params;
        const location = await findLocationById(locationId);
        return NextResponse.json(location, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { message: err.message },
            { status: err.status || 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ locationId: string }> }
) {
    try {
        const { locationId } = await params;
        const body = await req.json();
        const location = await updateLocation(locationId, body);
        return NextResponse.json(location, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { message: err.message },
            { status: err.status || 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ locationId: string }> }
) {
    try {
        const { locationId } = await params;
        await deleteLocation(locationId);
        return NextResponse.json({}, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { message: err.message },
            { status: err.status || 500 }
        );
    }
}
