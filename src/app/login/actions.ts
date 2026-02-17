"use server";
import sql from "@/lib/db";
import { cookies } from "next/headers";

export async function loginUserAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const users = await sql`
      SELECT * FROM admins 
      WHERE username = ${username} AND password = ${password}
    `;

    if (users.length > 0) {
      // NextJS naye version ke liye cookies ko await karna lazmi hai
      const cookieStore = await cookies();
      
      cookieStore.set("admin_session", users[0].username, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        maxAge: 60 * 60 * 24 * 7, 
        path: "/",
      });
      
      return { success: true };
    } else {
      return { success: false, error: "Incorrect Username or Password" };
    }
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, error: "System Error: Please try again" };
  }
}