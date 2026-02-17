"use server";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * [SEO Friendly]
 * Record daily business expenditures to maintain accurate financial records for Fahad Traders UAE
 */

export async function saveExpenseAction(formData: FormData) {
  const description = formData.get("description");
  const amount = formData.get("amount");
  const category = formData.get("category");
  
  // Aaj ki date nikalna takay database mein sahi din ka kharcha likha jaye
  const expenseDate = new Date().toISOString().split("T")[0];

  try {
    await sql`
      INSERT INTO expenses (description, amount, category, expense_date)
      VALUES (${description as string}, ${Number(amount)}, ${category as string}, ${expenseDate})
    `;
    
    // Naya kharcha save hote hi dono pages ko taza (refresh) karna
    revalidatePath("/dashboard/accounts/expenses");
    revalidatePath("/dashboard/accounts/daily-ledger");
    
    // Client side par success message bhejna
    return { success: true };
    
  } catch (error: any) {
    console.error("Expense saving failed:", error);
    return { success: false, error: error.message || "Failed to record business expense" };
  }
}