import { NextRequest, NextResponse } from "next/server";
import { saveImage } from "@/lib/image";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "File must be an image" },
                { status: 400 }
            );
        }

        const url = await saveImage(file);

        return NextResponse.json({ url }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Upload failed", message: String(error) },
            { status: 500 }
        );
    }
}
