import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customerId");

  try {
    if (customerId) {
      // Sirf aik customer ki invoices nikalna
      const invoices = await sql`
        SELECT * FROM invoices 
        WHERE customer_id = ${Number(customerId)} 
        ORDER BY created_at DESC
      `;
      return NextResponse.json(invoices);
    }
    
    const allInvoices = await sql`SELECT * FROM invoices ORDER BY created_at DESC`;
    return NextResponse.json(allInvoices);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}