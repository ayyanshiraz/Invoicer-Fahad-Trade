"use server";
import sql from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * [SEO Friendly]
 * Register business suppliers for Fahad Traders UAE inventory procurement
 */

export async function createSupplierAction(formData: FormData) {
  const name = formData.get(`name`);
  const whatsapp = formData.get(`whatsapp`);
  const address = formData.get(`address`);

  try {
    await sql`
      INSERT INTO suppliers (name, whatsapp_number, address) 
      VALUES (${name as string}, ${whatsapp as string}, ${address as string})
    `;
    
    revalidatePath(`/dashboard/suppliers`);
    revalidatePath(`/dashboard/purchase/new`);
  } catch (error) {
    console.error(`Database Error:`, error);
    throw new Error(`Failed to save supplier record`);
  }

  redirect(`/dashboard/suppliers`);
}