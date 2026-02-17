import sql from "@/lib/db";
import { ShoppingBag, Eye, User, Plus, Hash, Wallet } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PurchaseListPage() {
  const purchases = await sql`
    SELECT p.*, s.name as supplier_name, s.manual_id as supplier_manual_id 
    FROM purchases p 
    LEFT JOIN suppliers s ON p.supplier_id = s.id 
    ORDER BY p.created_at DESC
  `;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase">Purchase History</h1>
            <p className="text-sm text-slate-500 font-medium">Tracking stock procurement and supplier bills</p>
          </div>
        </div>
        <Link 
          href="/dashboard/purchase/new" 
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-blue-700 shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 inline mr-2" /> Create New Bill
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
              <tr>
                <th className="px-8 py-5">Invoice ID</th>
                <th className="px-8 py-5">Supplier ID</th>
                <th className="px-8 py-5">Supplier Name</th>
                <th className="px-8 py-5 text-right">Total Bill</th>
                <th className="px-8 py-5 text-right">Paid Amount</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {purchases.map((pur) => (
                <tr key={pur.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5 font-black text-blue-600">
                    #{pur.id.toString().padStart(5, "0")}
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black text-slate-500 uppercase flex items-center gap-1 w-fit">
                      <Hash className="w-2.5 h-2.5" /> {pur.supplier_manual_id || "N/A"}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-700 uppercase text-sm">
                    {pur.supplier_name || "Direct Purchase"}
                  </td>
                  <td className="px-8 py-5 text-right font-black text-slate-900">
                    PKR {Number(pur.total_amount).toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-green-600">
                    PKR {Number(pur.payment_amount || 0).toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <Link 
                      href={`/dashboard/purchase/${pur.id}`} 
                      className="p-2 text-slate-400 hover:text-blue-600 inline-block transition-all"
                    >
                      <Eye size={20}/>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}