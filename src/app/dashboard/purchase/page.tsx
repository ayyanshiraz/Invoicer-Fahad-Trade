import sql from "@/lib/db";
import { ShoppingBag, Eye, User, Plus, DollarSign } from "lucide-react";
import Link from "next/link";

// Ye line sab se zaroori h, ye her baar naya data fetch kare gi
export const dynamic = "force-dynamic";

export default async function PurchaseListPage() {
  // Query to get purchases with supplier names and cash details
  const purchases = await sql`
    SELECT p.*, s.name as supplier_name 
    FROM purchases p 
    LEFT JOIN suppliers s ON p.supplier_id = s.id 
    ORDER BY p.created_at DESC
  `;

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Purchase History</h1>
            <p className="text-sm text-slate-500 font-medium">Monitoring stock procurement and procurement costs</p>
          </div>
        </div>
        <Link 
          href="/dashboard/purchase/new" 
          className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> 
          Create New Bill
        </Link>
      </div>

      {/* Purchase Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Invoice ID</th>
                <th className="px-8 py-5">Supplier Details</th>
                <th className="px-8 py-5 text-right">Total Bill</th>
                <th className="px-8 py-5 text-right">Paid Amount</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5">Entry Date</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {purchases.map((pur) => (
                <tr key={pur.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-8 py-5 font-black text-blue-600">
                    #{pur.id.toString().padStart(5, "0")}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                        <User className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-700">{pur.supplier_name || "Direct Purchase"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-slate-900">
                    PKR {Number(pur.total_amount).toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-green-600">
                    PKR {Number(pur.payment_amount || 0).toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">
                      {pur.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-slate-500 text-sm font-semibold">
                    {new Date(pur.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <Link 
                      href={`/dashboard/purchase/${pur.id}`}
                      className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {purchases.length === 0 && (
          <div className="p-24 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Database is currently empty
            </p>
          </div>
        )}
      </div>
    </div>
  );
}