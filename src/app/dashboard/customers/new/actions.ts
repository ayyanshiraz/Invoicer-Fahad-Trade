"use server";
import sql from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createCustomerAction(formData: FormData) {
  const name = formData.get("name");
  const manual_id = formData.get("manual_id"); // Naya manual id field yahan receive hoga
  const id_card = formData.get("id_card");
  const whatsapp = formData.get("whatsapp");
  const visit_day = formData.get("visit_day");
  const address = formData.get("address");

  try {
    // Ham ne inventory_category_id aur preferred_product_id hata diye hain
    await sql`
      INSERT INTO customers (name, manual_id, id_card, whatsapp_number, address, visit_day)
      VALUES (
        ${name as string}, 
        ${manual_id as string}, 
        ${id_card as string}, 
        ${whatsapp as string}, 
        ${address as string}, 
        ${visit_day as string}
      )
    `;

    revalidatePath("/dashboard/customers");
  } catch (error) {
    console.error("Database Error:", error);
    // Agar id pehle se mojood hoi to ye error throw kare ga
    throw new Error("Failed to create customer. Please ensure the Manual ID is unique.");
  }

  redirect("/dashboard/customers");
}