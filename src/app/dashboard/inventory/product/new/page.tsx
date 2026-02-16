import sql from "@/lib/db";
import { redirect } from "next/navigation";
import { ArrowLeft, Save, PackagePlus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Add Product - Fahad Traders",
  description: "Register new inventory items and link them to categories",
  seoTitle: "New Product Registration - Fahad Traders",
  slug: "dashboard/inventory/product/new",
  metaDescription: "Add new products to your stock with price and category details",
  focusKeyPhrase: "Add New Product UAE",
};

export default async function NewProductPage() {
  // Database se categories lana dropdown k liye
  const categories = await sql`SELECT * FROM categories ORDER BY name ASC`;

  async function createProduct(formData: FormData) {
    "use server";
    const name = formData.get("name");
    const category_id = formData.get("category_id");
    const price = formData.get("price");
    const stock = formData.get("stock");

    await sql`
      INSERT INTO products (name, category_id, price, stock_quantity)
      VALUES (${name as string}, ${Number(category_id)}, ${Number(price)}, ${Number(stock)})
    `;
    redirect("/dashboard/inventory/product");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/inventory/product" className="flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <PackagePlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
        </div>

        <form action={createProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input name="name" type="text" required placeholder="Enter product name" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
            <select name="category_id" required className="w-full p-3 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Choose a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
              <input name="price" type="number" step="0.01" required placeholder="0.00" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Stock</label>
              <input name="stock" type="number" required placeholder="0" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md">
            Save Product to Stock
          </button>
        </form>
      </div>
    </div>
  );
}