"use server";
import sql from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function saveInvoiceAction(
  customerId: any, 
  items: any[], 
  grandTotal: number, 
  paymentAmount: number,
  invoiceDate: string 
) {
  let newInvoiceId: number | null = null;
  let isError = false;

  try {
    const cid = Number(customerId);
    const billTotal = Number(grandTotal);
    const paid = Number(paymentAmount);

    // 1. Customer ka purana balance uthana takay record me save ho sakay
    const customerData = await sql`
      SELECT total_balance FROM customers WHERE id = ${cid}
    `;
    
    const previousBalance = Number(customerData[0]?.total_balance || 0);

    // 2. Naya Closing Balance calculate krna (Logic: Purana + (Aaj ka Bill - Aaj ki Payment))
    const currentBalance = previousBalance + (billTotal - paid);

    // 3. Main Invoice save krna
    const invoiceResult = await sql`
      INSERT INTO invoices (
        customer_id, 
        total_amount, 
        previous_balance, 
        payment_amount, 
        current_balance, 
        status,
        created_at
      )
      VALUES (
        ${cid}, 
        ${billTotal}, 
        ${previousBalance}, 
        ${paid}, 
        ${currentBalance}, 
        ${`Paid`},
        ${invoiceDate}
      )
      RETURNING id
    `;
    
    newInvoiceId = invoiceResult[0].id;

    // 4. Items save krna aur inventory stock kam krna
    for (const item of items) {
      if (!item.productId) continue;

      const pid = Number(item.productId);
      const qty = Number(item.qty);
      const price = Number(item.price);

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

      // Stock Quantity update krna
      await sql`
        UPDATE products 
        SET stock_quantity = stock_quantity - ${qty}
        WHERE id = ${pid}
      `;
    }

    // 5. Customer table me kul balance update krna
    await sql`
      UPDATE customers 
      SET total_balance = ${currentBalance}
      WHERE id = ${cid}
    `;

    // 6. Paths refresh krna
    revalidatePath(`/dashboard/inventory/product`);
    revalidatePath(`/dashboard/invoice`);
    revalidatePath(`/dashboard/customers`);
    revalidatePath(`/dashboard/accounts/daily-ledger`);

  } catch (error) {
    console.error(`Database Save Error:`, error);
    isError = true;
  }
  
  if (isError) {
    throw new Error(`Database failed to process the transaction correctly`);
  }

  // 7. Redirect direct details page pr
  if (newInvoiceId) {
    redirect(`/dashboard/invoice/` + newInvoiceId);
  }
}