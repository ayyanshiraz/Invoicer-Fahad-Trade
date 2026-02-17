"use server";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * [SEO Friendly]
 * Save business invoice and update customer outstanding balance for Fahad Traders UAE
 */

export async function saveInvoiceAction(formData: FormData) {
  const customerId = formData.get(`customerId`);
  const totalAmount = Number(formData.get(`totalAmount`));
  const paidAmount = Number(formData.get(`paidAmount`));
  
  // Logic: Jo raqam pay nahi hui, wo customer ke udhaar (balance) mein add hogi
  const remainingToBill = totalAmount - paidAmount;

  try {
    // 1. Invoice table mein data save krna
    await sql`
      INSERT INTO invoices (customer_id, total_amount, paid_amount)
      VALUES (${Number(customerId)}, ${totalAmount}, ${paidAmount})
    `;

    // 2. Customer table mein total_balance ko update krna
    await sql`
      UPDATE customers 
      SET total_balance = total_balance + ${remainingToBill}
      WHERE id = ${Number(customerId)}
    `;

    revalidatePath(`/dashboard/invoice`);
    revalidatePath(`/dashboard/customers`);
    revalidatePath(`/dashboard/accounts/daily-ledger`);
    
    return { success: true };
  } catch (error) {
    console.error(`Invoice processing failed:`, error);
    return { success: false, error: `System failed to update balance` };
  }
}