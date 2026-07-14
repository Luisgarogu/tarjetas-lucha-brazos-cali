import { NextResponse } from "next/server"; import cards from "@/data/cards.json"; import { hasValidAdminSession } from "@/lib/auth/admin-session";
 export async function GET(){if(!hasValidAdminSession())return NextResponse.json({error:"No autorizado."},{status:401});
 return NextResponse.json(cards)}
