import sql from "@/lib/db";
import { UserPlus, Trash2, Edit, Users, Smartphone, Receipt, Hash, CreditCard } from "lucide-react";
import Link from "next/link";
import { deleteCustomer } from "./actions";

export const metadata = {
  title: `Customer Directory - Fahad Traders`,
  description: `Manage business clients, track outstanding balances, and view transaction ledgers for Fahad Traders UAE`,
};

// Force dynamic taake naya customer foran nazar aaye
export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  // Query to get customers - ab category join ki zaroorat nahi h
  const customers = await sql`
    SELECT * FROM customers 
    ORDER BY created_at DESC
  `;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Customer Directory</h1>
            <p className="text-sm text-gray-500 font-medium">Manage all registered clients and their unique IDs</p>
          </div>
        </div>
        <Link 
          href="/dashboard/customers/new" 
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" /> Add New Customer
        </Link>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-5">Manual ID</th>
                <th className="px-6 py-5">Client Name</th>
                <th className="px-6 py-5">ID Card (CNIC)</th>
                <th className="px-6 py-5">WhatsApp</th>
                <th className="px-6 py-5">Schedule</th>
                <th className="px-6 py-5 text-right">Balance Due</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group">
                  {/* Manual ID Column */}
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
                      <Hash className="w-3 h-3" /> {c.manual_id || "NO-ID"}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 font-bold text-gray-800 uppercase text-sm tracking-tight">
                    {c.name}
                  </td>

                  {/* CNIC */}
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-300" />
                      {c.id_card || `Not Added`}
                    </div>
                  </td>

                  {/* WhatsApp */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                      <Smartphone className="w-3.5 h-3.5" /> {c.whatsapp_number}
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded">
                      {c.visit_day}
                    </span>
                  </td>

                  {/* Balance */}
                  <td className="px-6 py-4 text-right">
                    <p className={`text-sm font-black font-mono ${Number(c.total_balance) > 0 ? "text-red-600" : "text-slate-900"}`}>
                      PKR {Number(c.total_balance || 0).toLocaleString()}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/dashboard/customers/${c.id}/ledger`} 
                        className="flex items-center gap-1.5 p-2 bg-slate-900 text-white hover:bg-blue-600 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest"
                      >
                        <Receipt className="w-4 h-4" /> Ledger
                      </Link>

                      <Link 
                        href={`/dashboard/customers/${c.id}/edit`} 
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      
                      <form action={deleteCustomer}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {customers.length === 0 && (
          <div className="p-24 text-center">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No business customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}