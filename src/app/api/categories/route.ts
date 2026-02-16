import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  const data = await sql`SELECT id, name FROM categories ORDER BY name ASC`;
  return NextResponse.json(data);
}