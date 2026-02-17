"use server";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function deleteCustomer(formData: FormData) {
  const id = formData.get(`id`);
  if (!id) return;

  await sql`DELETE FROM customers WHERE id = ${Number(id)}`;
  revalidatePath(`/dashboard/customers`);
}

// 2. Customer Profile Update krne ka function
export async function updateCustomerAction(id: number, formData: FormData) {
  const name = formData.get(`name`);
  const id_card = formData.get(`id_card`);
  const whatsapp = formData.get(`whatsapp`);
  const address = formData.get(`address`);
  const visit_day = formData.get(`visit_day`);

  await sql`
    UPDATE customers 
    SET 
      name = ${name as string}, 
      id_card = ${id_card as string}, 
      whatsapp_number = ${whatsapp as string}, 
      address = ${address as string}, 
      visit_day = ${visit_day as string}
    WHERE id = ${id}
  `;

  revalidatePath(`/dashboard/customers`);
  redirect(`/dashboard/customers`);
}

export async function recordCustomerPayment(formData: FormData) {
  const customerId = formData.get(`customer_id`);
  const amount = formData.get(`amount`);
  const note = formData.get(`note`);

  try {
    // Payment record table me save krna
    await sql`
      INSERT INTO customer_payments (customer_id, amount, note)
      VALUES (${Number(customerId)}, ${Number(amount)}, ${note as string})
    `;

    // Customer ka total udhar (balance) kam krna
    await sql`
      UPDATE customers 
      SET total_balance = total_balance - ${Number(amount)}
      WHERE id = ${Number(customerId)}
    `;

    // Pages ko refresh krna taake naya balance nazar aaye
    revalidatePath(`/dashboard/customers`);
    revalidatePath(`/dashboard/customers/${customerId}/ledger`);
  } catch (error) {
    console.error(`Payment logic error:`, error);
    throw new Error(`Failed to process customer payment`);
  }
}