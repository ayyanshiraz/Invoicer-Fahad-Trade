import sql from "@/lib/db";
import { Plus, Package, Tag } from "lucide-react";
import Link from "next/link";

export default async function ProductListPage() {
  // Join query taake category ka naam bhi nazar aaye
  const products = await sql`
    SELECT p.*, c.name as category_name 
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Product Inventory</h1>
        <Link href="/dashboard/inventory/product/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-700">
          <Plus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div key={prod.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase">
                <Tag className="w-3 h-3" /> {prod.category_name}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">{prod.name}</h3>
            <div className="mt-4 flex justify-between items-center border-t pt-4">
              <div>
                <p className="text-xs text-gray-400">Price</p>
                <p className="font-bold text-blue-600">PKR {prod.price}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Stock</p>
                <p className={`font-bold ${prod.stock_quantity < 10 ? "text-red-500" : "text-emerald-600"}`}>
                  {prod.stock_quantity} Units
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}