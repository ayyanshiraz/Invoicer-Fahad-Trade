import sql from "@/lib/db";
import { Plus, Tags, FolderOpen } from "lucide-react";
import Link from "next/link";

// [SEO Friendly]
export const metadata = {
  title: "Product Categories - Fahad Traders",
  description: "Manage inventory categories for Rice, Daal and Maslay in UAE",
  seoTitle: "Inventory Categories List - Fahad Traders",
  slug: "dashboard/inventory/category",
  metaDescription: "View and organize your product categories for better inventory tracking",
  focusKeyPhrase: "Inventory Categories UAE",
  seoKeyPhrase: "Category Management System",
};

export default async function CategoryPage() {
  // Database se categories fetch krna
  const categories = await sql`SELECT * FROM categories ORDER BY name ASC`;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-lg">
            <Tags className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Categories List</h1>
            <p className="text-sm text-gray-500">Manage your product groups here</p>
          </div>
        </div>
        <Link 
          href="/dashboard/inventory/category/new" 
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Category
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FolderOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID: {cat.id}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {cat.description || "No extra details added for this group"}
            </p>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full p-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 text-lg">No categories found in database</p>
            <p className="text-sm text-gray-300">Click Add New Category button to start</p>
          </div>
        )}
      </div>
    </div>
  );
}