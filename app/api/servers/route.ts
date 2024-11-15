import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new Response("You must be logged in to create a profile", { status: 401 });
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "discussions", profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN } // Specify role correctly
                    ]
                }
            },
        });

        return NextResponse.json(server); // Return the created server as a response
    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}