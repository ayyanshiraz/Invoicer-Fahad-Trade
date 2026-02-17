"use server";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function processReturnAction(
  invoiceId: number, 
  itemId: number, 
  productId: number,
  returnQty: number, 
  unitPrice: number,
  customerId: number
) {
  try {
    const returnAmount = Number(returnQty) * Number(unitPrice);

    // 1. Inventory Update (Maal wapis dukan mein dakhil karein)
    await sql`
      UPDATE products 
      SET stock_quantity = stock_quantity + ${Number(returnQty)} 
      WHERE id = ${productId}
    `;

    // 2. Customer Ledger Update (Udhaar kam karein)
    await sql`
      UPDATE customers 
      SET total_balance = total_balance - ${returnAmount} 
      WHERE id = ${customerId}
    `;

    // 3. Invoice Total adjust karein
    await sql`
      UPDATE invoices 
      SET total_amount = total_amount - ${returnAmount} 
      WHERE id = ${invoiceId}
    `;

    // 4. Invoice Item record adjust ya delete karein (Maine adjust kiya h)
    await sql`
      UPDATE invoice_items 
      SET quantity = quantity - ${Number(returnQty)},
          total_price = total_price - ${returnAmount}
      WHERE id = ${itemId}
    `;

    revalidatePath("/dashboard/invoice/return");
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/inventory/product");
    
    return { success: true };
  } catch (error) {
    console.error("Database Error during return:", error);
    throw new Error("Failed to process return record");
  }
}