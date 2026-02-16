"use server";
import sql from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * [SEO Friendly]
 * seo title: Process Purchase Return - Fahad Traders
 * slug: dashboard/purchase/return
 * meta description: Record goods returned to suppliers and automatically decrease inventory stock levels
 */

export async function savePurchaseReturnAction(supplierId: string, items: any[], grandTotal: number, reason: string) {
  let returnId: number | null = null;

  try {
    // 1. Return record save krna
    const result = await sql`
      INSERT INTO purchase_returns (supplier_id, total_return_amount, reason)
      VALUES (${Number(supplierId)}, ${grandTotal}, ${reason})
      RETURNING id
    `;
    returnId = result[0].id;

    // 2. Items update aur STOCK MINUS (-) krna
    for (const item of items) {
      await sql`
        INSERT INTO purchase_return_items (return_id, product_id, quantity, unit_price, total_price)
        VALUES (
          ${returnId}, 
          ${Number(item.productId)}, 
          ${Number(item.qty)}, 
          ${Number(item.price)}, 
          ${Number(item.qty) * Number(item.price)}
        )
      `;

      // Maal wapas krne pr stock kam hoga (-)
      await sql`
        UPDATE products 
        SET stock_quantity = stock_quantity - ${Number(item.qty)}
        WHERE id = ${Number(item.productId)}
      `;
    }

    // 3. Supplier ka balance kam krna (Udhar khatam krna)
    await sql`
      UPDATE suppliers 
      SET total_balance = total_balance - ${grandTotal}
      WHERE id = ${Number(supplierId)}
    `;

    revalidatePath(`/dashboard/inventory/product`);
    revalidatePath(`/dashboard/purchase`);
    revalidatePath(`/dashboard/suppliers`);

  } catch (error) {
    console.error(`Return Logic Error:`, error);
    throw new Error(`Failed to process purchase return`);
  }

  if (returnId) {
    redirect(`/dashboard/purchase`);
  }
}