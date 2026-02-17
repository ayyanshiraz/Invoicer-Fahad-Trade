"use server";
import sql from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileAction(formData: FormData) {
  const id = formData.get("id");
  const full_name = formData.get("full_name");
  const id_card = formData.get("id_card");
  const whatsapp_number = formData.get("whatsapp_number");
  const username = formData.get("username") as string;
  const password = formData.get("password");

  try {
    // Database me data update krna
    await sql`
      UPDATE admins 
      SET full_name = ${full_name as string}, 
          id_card = ${id_card as string}, 
          whatsapp_number = ${whatsapp_number as string}, 
          username = ${username}, 
          password = ${password as string}
      WHERE id = ${Number(id)}
    `;

    // Naya session set krna
    const cookieStore = await cookies();
    cookieStore.set("admin_session", username, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    });

    revalidatePath("/dashboard/profile");
  } catch (error) {
    console.error("Update failed:", error);
  }

  // Wapis profile page pr bhejna
  redirect("/dashboard/profile");
}