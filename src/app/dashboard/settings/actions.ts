"use server";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * [SEO Friendly]
 * Update business profile and contact information for Fahad Traders UAE portal
 */

export async function updateSettingsAction(formData: FormData) {
  const shop_name = formData.get(`shop_name`);
  const whatsapp = formData.get(`whatsapp`);
  const address = formData.get(`address`);

  try {
    await sql`
      UPDATE shop_settings 
      SET 
        shop_name = ${shop_name as string}, 
        whatsapp = ${whatsapp as string}, 
        address = ${address as string},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `;
    
    // Sab pages ko refresh krna taake naya address nazar aaye [cite: 2025-11-05]
    revalidatePath(`/dashboard`);
    revalidatePath(`/dashboard/accounts/daily-ledger`);
  } catch (error) {
    console.error(`Settings update failed:`, error);
    throw new Error(`Failed to update business settings`);
  }
}