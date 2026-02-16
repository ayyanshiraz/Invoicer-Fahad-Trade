import sql from "@/lib/db";
import { redirect } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Add Category - Fahad Traders",
  description: "Create new product categories like Rice, Daal or Maslay",
  seoTitle: "New Inventory Category - Fahad Traders",
  slug: "dashboard/inventory/category/new",
  metaDescription: "Register new product groups to organize your inventory effectively",
  focusKeyPhrase: "Add Product Category",
};

export default function NewCategoryPage() {
  async function createCategory(formData: FormData) {
    "use server";
    const name = formData.get("name");
    const description = formData.get("description");

    await sql`
      INSERT INTO categories (name, description)
      VALUES (${name as string}, ${description as string})
    `;
    redirect("/dashboard/inventory/category");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/inventory/category" className="flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Categories
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Category</h2>
        <form action={createCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input name="name" type="text" required placeholder="e.g. Rice or Maslay" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows={3} placeholder="Optional details about this group" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" /> Save Category
          </button>
        </form>
      </div>
    </div>
  );
}