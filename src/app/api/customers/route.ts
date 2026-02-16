import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    // Neon DB se customers ki list lena taake dropdown me show ho skein
    const customers = await sql`SELECT id, name FROM customers ORDER BY name ASC`;
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers from database" }, { status: 500 });
  }
}