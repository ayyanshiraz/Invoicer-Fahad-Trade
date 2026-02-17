import sql from "@/lib/db";
import { Plus, Package, Tag, ArrowUpRight, BadgeDollarSign } from "lucide-react";
import Link from "next/link";

export default async function ProductListPage() {
  const products = await sql`
    SELECT p.*, c.name as category_name 
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-lg"><Package /></div>
          <div>
            <h1 className="text-xl font-black text-gray-800 uppercase">Product Inventory</h1>
            <p className="text-xs text-gray-500 font-bold">Monitor purchase costs and profit margins per KG</p>
          </div>
        </div>
        <Link href="/dashboard/inventory/product/new" className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black uppercase text-xs hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => {
          const profit = Number(prod.price) - Number(prod.purchase_price);
          return (
            <div key={prod.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:border-blue-200 transition-all">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {prod.category_name}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase">
                    <ArrowUpRight className="w-3 h-3" /> Profit: PKR {profit.toLocaleString()}
                  </div>
                </div>

                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">{prod.name}</h3>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Cost / KG</p>
                    <p className="font-bold text-gray-700">PKR {Number(prod.purchase_price).toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <p className="text-[9px] font-black text-blue-400 uppercase mb-1">Sale / KG</p>
                    <p className="font-black text-blue-700">PKR {Number(prod.price).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">System Active</span>
                </div>
                <BadgeDollarSign className="w-4 h-4 text-slate-700" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}