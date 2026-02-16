"use server";
import sql from "@/lib/db";
import { redirect } from "next/navigation";

export async function createCustomerAction(formData: FormData) {
  const name = formData.get(`name`);
  const id_card = formData.get(`id_card`);
  const whatsapp = formData.get(`whatsapp`);
  const address = formData.get(`address`);
  const visit_day = formData.get(`visit_day`);
  const inv_cat_id = formData.get(`inventory_category_id`);
  const prod_id = formData.get(`preferred_product_id`);

  await sql`
    INSERT INTO customers (name, id_card, whatsapp_number, address, visit_day, inventory_category_id, preferred_product_id)
    VALUES (
      ${name as string}, 
      ${id_card as string},
      ${whatsapp as string}, 
      ${address as string}, 
      ${visit_day as string}, 
      ${Number(inv_cat_id)}, 
      ${Number(prod_id)}
    )
  `;

  redirect(`/dashboard/customers`);
}