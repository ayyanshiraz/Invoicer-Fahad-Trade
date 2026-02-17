"use server";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function savePurchaseAction(
  supplierId: any, 
  items: any[], 
  grandTotal: number, 
  paidAmount: number,
  purchaseDate: string
) {
  try {
    const sid = Number(supplierId);
    const bill = Number(grandTotal);
    const paid = Number(paidAmount);

    // 1. Insert Purchase Record
    const result = await sql`
      INSERT INTO purchases (supplier_id, total_amount, payment_amount, status, created_at)
      VALUES (${sid}, ${bill}, ${paid}, ${"Received"}, ${purchaseDate})
      RETURNING id
    `;
    const purchaseId = result[0].id;

    // 2. Loop for Items and Stock Update
    for (const item of items) {
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

      // Maal kharidne par stock barhayein (+)
      await sql`
        UPDATE products 
        SET stock_quantity = stock_quantity + ${Number(item.qty)}
        WHERE id = ${Number(item.productId)}
      `;
    }

    // 3. Update Supplier Ledger Balance
    const remaining = bill - paid;
    await sql`
      UPDATE suppliers 
      SET total_balance = COALESCE(total_balance, 0) + ${remaining}
      WHERE id = ${sid}
    `;

    // 4. Khata (Ledger) History Save Karna (New Feature)
    // Pehle Total Bill ki entry
    await sql`
      INSERT INTO supplier_transactions (supplier_id, purchase_id, amount, transaction_type, transaction_date)
      VALUES (${sid}, ${purchaseId}, ${bill}, 'Bill', ${purchaseDate})
    `;
    
    // Agar kuch paise diye hain, to Payment ki entry
    if (paid > 0) {
      await sql`
        INSERT INTO supplier_transactions (supplier_id, purchase_id, amount, transaction_type, transaction_date)
        VALUES (${sid}, ${purchaseId}, ${paid}, 'Payment', ${purchaseDate})
      `;
    }

    // 5. Pages Refresh Karein
    revalidatePath("/dashboard/purchase");
    revalidatePath("/dashboard/inventory/product");
    revalidatePath("/dashboard/suppliers");
    revalidatePath("/dashboard/accounts/payable"); 
    
    return { success: true, purchaseId: purchaseId };

  } catch (error: any) {
    console.error("FULL DATABASE ERROR:", error);
    return { success: false, error: error.message || "Database synchronization failed" };
  }
}