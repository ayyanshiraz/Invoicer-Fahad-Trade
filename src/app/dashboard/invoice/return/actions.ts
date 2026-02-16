"use server";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * [SEO Friendly] Details for Sale Return:
 * seo title: Sale Return Process - Fahad Traders
 * slug: dashboard/invoice/return
 * meta description: Process product returns and adjust billing amounts for Fahad Traders UAE
 * focus key phrase: Sale Return Process
 * seo key phrase: Handle Returns Fahad Traders
 * img alt text: Return Process Interface
 */

export async function processReturnAction(
  invoiceId: number, 
  itemId: number, 
  returnQty: number, 
  unitPrice: number
) {
  try {
    const returnAmount = Number(returnQty) * Number(unitPrice);

    // 1. Invoice ka total amount kam krna
    await sql`
      UPDATE invoices 
      SET total_amount = total_amount - ${returnAmount} 
      WHERE id = ${invoiceId}
    `;

    // 2. Invoice items table me quantity ko adjust krna
    await sql`
      UPDATE invoice_items 
      SET quantity = quantity - ${Number(returnQty)},
          total_price = total_price - ${returnAmount}
      WHERE id = ${itemId}
    `;

    // Page refresh krna taake naya data dikhe
    revalidatePath(`/dashboard/invoice/return`);
    
    return { success: true };
  } catch (error) {
    console.error(`Database Error during return:`, error);
    throw new Error(`Failed to process return record`);
  }
}