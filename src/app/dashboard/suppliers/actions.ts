"use server";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * [SEO Friendly]
 * Record payments to wholesale suppliers and update the business ledger balance.
 */

export async function recordSupplierPayment(formData: FormData) {
  const supplierId = formData.get(`supplier_id`);
  const amount = formData.get(`amount`);
  const note = formData.get(`note`);

  try {
    // 1. Payment record save krna
    await sql`
      INSERT INTO supplier_payments (supplier_id, amount, note)
      VALUES (${Number(supplierId)}, ${Number(amount)}, ${note as string})
    `;

    // 2. Supplier ka total balance (udhar) kam krna
    await sql`
      UPDATE suppliers 
      SET total_balance = total_balance - ${Number(amount)}
      WHERE id = ${Number(supplierId)}
    `;

    revalidatePath(`/dashboard/suppliers`);
  } catch (error) {
    console.error(`Payment recording failed:`, error);
    throw new Error(`Could not update supplier balance`);
  }

  redirect(`/dashboard/suppliers`);
}