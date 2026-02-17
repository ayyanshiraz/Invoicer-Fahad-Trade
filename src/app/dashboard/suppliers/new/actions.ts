"use server";
import sql from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createSupplierAction(formData: FormData) {
  const name = formData.get("name");
  const manual_id = formData.get("manual_id");
  const contact_person = formData.get("contact_person");
  const whatsapp = formData.get("whatsapp");
  const address = formData.get("address");

  try {
    // 1. Database mein supplier save karna
    await sql`
      INSERT INTO suppliers (name, manual_id, contact_person, whatsapp_number, address, total_balance)
      VALUES (
        ${name as string}, 
        ${manual_id as string}, 
        ${contact_person as string}, 
        ${whatsapp as string}, 
        ${address as string}, 
        0
      )
    `;

    // 2. Data refresh karna taake search mein foran nazar aaye
    revalidatePath("/dashboard/suppliers");
    revalidatePath("/dashboard/purchase/new");

  } catch (error: any) {
    console.error("Database Error:", error);
    
    // Check if column is missing or ID is duplicate
    if (error.code === '42703') {
      throw new Error("Missing Column: Please run the ALTER TABLE SQL command in Neon Console.");
    } else if (error.code === '23505') {
      throw new Error("Duplicate ID: This Manual ID is already taken by another supplier.");
    }
    
    throw new Error("Failed to save: Database synchronization error.");
  }

  // 3. Form save hone ke baad list page par wapis jana
  redirect("/dashboard/suppliers");
}