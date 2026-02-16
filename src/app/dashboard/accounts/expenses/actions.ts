"use server";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * [SEO Friendly]
 * Record daily business expenditures to maintain accurate financial records for Fahad Traders UAE
 */

export async function saveExpenseAction(formData: FormData) {
  const description = formData.get(`description`);
  const amount = formData.get(`amount`);
  const category = formData.get(`category`);

  try {
    await sql`
      INSERT INTO expenses (description, amount, category)
      VALUES (${description as string}, ${Number(amount)}, ${category as string})
    `;
    
    revalidatePath(`/dashboard/accounts/expenses`);
  } catch (error) {
    console.error(`Expense saving failed:`, error);
    throw new Error(`Failed to record business expense`);
  }

  redirect(`/dashboard/accounts/expenses`);
}