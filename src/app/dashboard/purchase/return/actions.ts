"use server";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function savePurchaseReturnAction(
  supplierId: any, 
  items: any[], 
  grandTotal: number, 
  reason: string
) {
  try {
    const sid = Number(supplierId);
    const total = Number(grandTotal);

    // 1. Record Return
    const result = await sql`
      INSERT INTO purchase_returns (supplier_id, total_return_amount, reason)
      VALUES (${sid}, ${total}, ${reason})
      RETURNING id
    `;
    const returnId = result[0].id;

    // 2. Update stock (-) and log items
    for (const item of items) {
      await sql`
        INSERT INTO purchase_return_items (return_id, product_id, quantity, unit_price, total_price)
        VALUES (${returnId}, ${Number(item.productId)}, ${Number(item.qty)}, ${Number(item.price)}, ${Number(item.qty) * Number(item.price)})
      `;

      await sql`
        UPDATE products SET stock_quantity = stock_quantity - ${Number(item.qty)}
        WHERE id = ${Number(item.productId)}
      `;
    }

    // 3. Deduct from Supplier Udhaar (Balance)
    await sql`
      UPDATE suppliers SET total_balance = total_balance - ${total}
      WHERE id = ${sid}
    `;

    revalidatePath("/dashboard/inventory/product");
    revalidatePath("/dashboard/purchase");
    revalidatePath("/dashboard/suppliers");

    return { success: true };

  } catch (error) {
    console.error("Return Logic Error:", error);
    return { success: false, error: "Return operation failed" };
  }
}