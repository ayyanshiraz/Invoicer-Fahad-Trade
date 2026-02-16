import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  try {
    let products;
    if (categoryId) {
      // Agar category select hai to sirf uske products
      products = await sql`SELECT id, name, price FROM products WHERE category_id = ${Number(categoryId)} ORDER BY name ASC`;
    } else {
      // Warna sare products
      products = await sql`SELECT id, name, price FROM products ORDER BY name ASC`;
    }
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}