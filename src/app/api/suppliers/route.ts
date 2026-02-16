import sql from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await sql`SELECT id, name FROM suppliers ORDER BY name ASC`;
  return NextResponse.json(data);
}