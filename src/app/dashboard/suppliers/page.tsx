import sql from "@/lib/db";
import { UserPlus, ShoppingBag, Phone, MapPin, Receipt, Edit, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * [SEO Friendly] Details:
 * seo title: Supplier Management Directory - Fahad Traders
 * slug: dashboard/suppliers
 * meta description: View and manage all business suppliers, track outstanding balances, and access full ledgers
 */

export default async function SuppliersPage() {
  const suppliers = await sql`
    SELECT * FROM suppliers 
    ORDER BY created_at DESC
  `;

  return (
    <div className="space-y-6">
      {/* Header Section with Dominant Add Button */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 text-white rounded-lg">
            <ShoppingBag className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Suppliers Directory</h1>
            <p className="text-sm text-gray-500 font-medium">Manage wholesale partners and procurement contacts</p>
          </div>
        </div>
        <Link 
          href="/dashboard/suppliers/new" 
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-xl active:scale-95 flex items-center gap-2 border-2 border-slate-800"
        >
          <UserPlus className="w-5 h-5 text-pink-400" /> 
          Add New Supplier
        </Link>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors font-black text-xl">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-md uppercase tracking-widest">
                  Active Partner
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 uppercase mb-4 leading-tight">{s.name}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Phone size={14} /></div>
                  <span>{s.whatsapp_number}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={14} /></div>
                  <span className="truncate">{s.address || `UAE Warehouse Location`}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Outstanding Balance</p>
                <p className="text-2xl font-black text-slate-900">
                  PKR {Number(s.total_balance || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Interactive Action Buttons */}
            <div className="grid grid-cols-2 border-t border-gray-100">
              <Link 
                href={`/dashboard/suppliers/${s.id}/ledger`}
                className="flex items-center justify-center gap-2 py-4 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border-r border-gray-100"
              >
                <Receipt size={14} /> View Ledger
              </Link>
              <Link 
                href={`/dashboard/suppliers/${s.id}/edit`}
                className="flex items-center justify-center gap-2 py-4 bg-white hover:bg-pink-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <Edit size={14} /> Edit Profile
              </Link>
            </div>
          </div>
        ))}

        {suppliers.length === 0 && (
          <div className="col-span-full p-20 text-center bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-100">
             <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
             <p className="text-gray-400 font-black italic">No suppliers found in your directory</p>
          </div>
        )}
      </div>
    </div>
  );
}