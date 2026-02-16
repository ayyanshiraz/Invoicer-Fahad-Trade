import { NextResponse } from "next/server";
import sql from "@/lib/db";

// Next.js 15+ me params Promise hota h
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Invoice ki main details lena
    const invoiceResult = await sql`
      SELECT i.*, c.name as customer_name 
      FROM invoices i 
      JOIN customers c ON i.customer_id = c.id 
      WHERE i.id = ${Number(id)}
    `;

    if (invoiceResult.length === 0) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // 2. Us invoice k sare items lena
    const itemsResult = await sql`
      SELECT * FROM invoice_items WHERE invoice_id = ${Number(id)}
    `;

    return NextResponse.json({
      invoice: invoiceResult[0],
      items: itemsResult
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Server error during search" }, { status: 500 });
  }
}