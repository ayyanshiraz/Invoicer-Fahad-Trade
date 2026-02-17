import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    // manual_id ko query mein shamil kiya gaya hai
    const suppliers = await sql`SELECT id, name, manual_id, total_balance FROM suppliers ORDER BY name ASC`;
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}