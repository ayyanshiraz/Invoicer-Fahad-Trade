import sql from "@/lib/db";
import { redirect } from "next/navigation";
import { ArrowLeft, Save, PackagePlus, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
  const categories = await sql`SELECT * FROM categories ORDER BY name ASC`;

  async function createProduct(formData: FormData) {
    "use server";
    const name = formData.get("name");
    const category_id = formData.get("category_id");
    const purchase_price = formData.get("purchase_price");
    const sale_price = formData.get("sale_price");

    await sql`
      INSERT INTO products (name, category_id, purchase_price, price, stock_quantity)
      VALUES (
        ${name as string}, 
        ${Number(category_id)}, 
        ${Number(purchase_price)}, 
        ${Number(sale_price)}, 
        0
      )
    `;
    redirect("/dashboard/inventory/product");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/inventory/product" className="flex items-center gap-2 text-blue-600 font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg">
            <PackagePlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Register New Item</h2>
            <p className="text-sm text-gray-500 font-medium">Define purchase cost and selling rates per KG</p>
          </div>
        </div>

        <form action={createProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">Product Name</label>
              <input name="name" type="text" required placeholder="e.g. Basmati Rice" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">Category</label>
              <select name="category_id" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                <option value="">Select Category</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-emerald-600 uppercase mb-2 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Purchase Cost (Per KG)
              </label>
              <input name="purchase_price" type="number" step="0.01" required placeholder="0.00" className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-700" />
            </div>

            <div>
              <label className="block text-xs font-black text-blue-600 uppercase mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Selling Price (Per KG)
              </label>
              <input name="sale_price" type="number" step="0.01" required placeholder="0.00" className="w-full p-4 bg-blue-50/50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-700" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
            Save Product to Inventory
          </button>
        </form>
      </div>
    </div>
  );
}