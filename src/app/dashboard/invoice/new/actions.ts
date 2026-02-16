"use server";
import sql from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * [SEO Friendly]
 * seo title: Process Sale Invoice - Fahad Traders
 * slug: dashboard/invoice/new/save
 * meta description: Securely save invoices, update inventory stock, and maintain customer ledgers for Fahad Traders UAE
 * focus key phrase: Process Sale Invoice
 * seo key phrase: Inventory and Ledger Management
 * img alt text: Backend logic for processing business invoices and stock updates
 * seo keywords: invoice, sale, stock, ledger, customer balance, fahad traders uae
 */

export async function saveInvoiceAction(
  customerId: string, 
  items: any[], 
  grandTotal: number, 
  paymentAmount: number = 0
) {
  let newInvoiceId: number | null = null;
  let isError = false;

  try {
    const cid = Number(customerId);
    const billTotal = Number(grandTotal);
    const paid = Number(paymentAmount);

    // 1. Customer ka purana balance (Previous Balance) uthana [cite: 2026-02-15]
    const customerData = await sql`
      SELECT total_balance FROM customers WHERE id = ${cid}
    `;
    
    const previousBalance = Number(customerData[0]?.total_balance || 0);

    // 2. Naya Current Balance calculate krna
    // Logic: Opening + Invoiced - Paid = Closing
    const currentBalance = previousBalance + billTotal - paid;

    // 3. Main Invoice save krna
    const invoiceResult = await sql`
      INSERT INTO invoices (
        customer_id, 
        total_amount, 
        previous_balance, 
        payment_amount, 
        current_balance, 
        status
      )
      VALUES (
        ${cid}, 
        ${billTotal}, 
        ${previousBalance}, 
        ${paid}, 
        ${currentBalance}, 
        ${`Paid`}
      )
      RETURNING id
    `;
    
    newInvoiceId = invoiceResult[0].id;

    // 4. Loop k zariye items save krna aur stock kam krna [cite: 2026-02-15]
    for (const item of items) {
      const pid = Number(item.productId);
      const qty = Number(item.qty);
      const price = Number(item.price);

      // Invoice items entry
      await sql`
        INSERT INTO invoice_items (
          invoice_id, 
          product_id, 
          quantity, 
          unit_price, 
          total_price
        )
        VALUES (
          ${newInvoiceId}, 
          ${pid}, 
          ${qty}, 
          ${price}, 
          ${qty * price}
        )
      `;

      // Inventory update: Maal bechne pr stock kam hoga (-) [cite: 2026-02-15]
      await sql`
        UPDATE products 
        SET stock_quantity = stock_quantity - ${qty}
        WHERE id = ${pid}
      `;
    }

    // 5. Customer ka total_balance update krna table me [cite: 2026-02-15]
    await sql`
      UPDATE customers 
      SET total_balance = ${currentBalance}
      WHERE id = ${cid}
    `;

    // 6. Cache clear krna taake saara data refresh ho jaye [cite: 2025-11-05]
    revalidatePath(`/dashboard/inventory/product`);
    revalidatePath(`/dashboard/invoice`);
    revalidatePath(`/dashboard/customers`);
    revalidatePath(`/dashboard/accounts/receivable`);
    revalidatePath(`/dashboard/accounts/daily-ledger`);

  } catch (error) {
    console.error(`Database Operation Error:`, error);
    isError = true;
  }
  
  // 7. Important: Redirect hamesha try-catch k bahar hona chahiye [cite: 2026-02-15]
  if (isError) {
    return { error: `Database failed to process the transaction correctly` };
  }

  if (newInvoiceId) {
    redirect(`/dashboard/invoice/${newInvoiceId}`);
  }
}