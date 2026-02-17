import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    // manual_id ko query me shamil kiya h
    const customers = await sql`SELECT id, name, manual_id FROM customers ORDER BY name ASC`;
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}