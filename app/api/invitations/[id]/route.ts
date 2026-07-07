import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/invitations/[id]
export async function PUT(
req: NextRequest,
{ params }: { params: Promise<{ id: string }> }
) {
const session = await auth();
if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const { id } = await params;

// Ownership check
const inv = await prisma.invitation.findUnique({ where: { id } });
if (!inv || inv.ownerId !== session.user.id) {
// Allow superadmin
if (session.user.role !== "SUPERADMIN") {
return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
}

const body = await req.json();

const updated = await prisma.invitation.update({
where: { id },
data: {
groomName: body.groomName,
groomFullName: body.groomFullName !== undefined ? body.groomFullName : undefined,
groomImage: body.groomImage !== undefined ? body.groomImage : undefined,
brideName: body.brideName,
brideFullName: body.brideFullName !== undefined ? body.brideFullName : undefined,
brideImage: body.brideImage !== undefined ? body.brideImage : undefined,
weddingDate: body.weddingDate ? new Date(body.weddingDate) : undefined,
akadTime: body.akadTime !== undefined ? body.akadTime : undefined,
resepsiTime: body.resepsiTime !== undefined ? body.resepsiTime : undefined,
venueName: body.venueName,
venueAddress: body.venueAddress,
mapsEmbedUrl: body.mapsEmbedUrl !== undefined ? body.mapsEmbedUrl : undefined,
theme: body.theme,
heroImage: body.heroImage !== undefined ? body.heroImage : undefined,
gallery: body.gallery !== undefined ? body.gallery : undefined,
loveStory: body.loveStory !== undefined ? body.loveStory : undefined,
bankAccounts: body.bankAccounts !== undefined ? body.bankAccounts : undefined,
musicUrl: body.musicUrl !== undefined ? body.musicUrl : undefined,
quoteText: body.quoteText !== undefined ? body.quoteText : undefined,
quoteSource: body.quoteSource !== undefined ? body.quoteSource : undefined,
isPublished: body.isPublished,
},
});

return NextResponse.json(updated);
}
