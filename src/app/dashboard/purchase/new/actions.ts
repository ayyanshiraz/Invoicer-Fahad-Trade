"use server";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function savePurchaseAction(
  supplierId: string, 
  items: any[], 
  grandTotal: number, 
  paidAmount: number
) {
  try {
    // 1. Purchases table mein entry
    const result = await sql`
      INSERT INTO purchases (supplier_id, total_amount, payment_amount, status)
      VALUES (
        ${Number(supplierId)}, 
        ${Number(grandTotal)}, 
        ${Number(paidAmount)}, 
        ${"Received"}
      )
      RETURNING id
    `;
    const purchaseId = result[0].id;

    // 2. Items aur Stock update karna
    for (const item of items) {
      // Yahan hum "invoice_id" use kar rahe hain kyunke aap ne DB mein rename kiya h
      await sql`
        INSERT INTO purchase_items (invoice_id, product_id, description, quantity, unit_price, total_price)
        VALUES (
          ${purchaseId}, 
          ${Number(item.productId)}, 
          ${item.description || ""}, 
          ${Number(item.qty)}, 
          ${Number(item.price)}, 
          ${Number(item.qty) * Number(item.price)}
        )
      `;

      // Maal kharidne par stock (+) barhayein
      await sql`
        UPDATE products 
        SET stock_quantity = stock_quantity + ${Number(item.qty)}
        WHERE id = ${Number(item.productId)}
      `;
    }

    // 3. Supplier Balance (Remaining udhaar) update karna
    const remaining = Number(grandTotal) - Number(paidAmount);
    await sql`
      UPDATE suppliers 
      SET total_balance = total_balance + ${Number(remaining)}
      WHERE id = ${Number(supplierId)}
    `;
    revalidatePath("/dashboard/purchase");
    revalidatePath("/dashboard/inventory/product");
    
    
    return { success: true }; // Redirect ki jagah success bhej rahe hain

  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return { success: false, error: "Database save failed" };
  }
}