import sql from "@/lib/db";
import { UserPlus, Trash2, Edit, Users, Smartphone, MapPin, Receipt } from "lucide-react";
import Link from "next/link";
import { deleteCustomer } from "./actions";

// [SEO Friendly] Metadata Section
export const metadata = {
  title: `Customer Directory - Fahad Traders`,
  description: `Manage business clients, track outstanding balances, and view transaction ledgers for Fahad Traders UAE`,
  seoTitle: `Client Management Dashboard - Fahad Traders`,
  slug: `dashboard/customers`,
  metaDescription: `Access and manage all registered business customers including contact details and billing history`,
  focusKeyPhrase: `Customer Management System`,
  seoKeyPhrase: `Business Client Directory`,
  imgAltText: `Table showing customer list with contact info and balances`,
};

export default async function CustomersPage() {
  // Query to get customers with their category name
  const customers = await sql`
    SELECT c.*, cat.name as category_name 
    FROM customers c 
    LEFT JOIN categories cat ON c.inventory_category_id = cat.id 
    ORDER BY c.created_at DESC
  `;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Customer Directory</h1>
            <p className="text-sm text-gray-500 font-medium">View and manage all registered clients and their ledgers</p>
          </div>
        </div>
        <Link 
          href="/dashboard/customers/new" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" /> Add New Customer
        </Link>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-gray-50 text-gray-600 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="px-6 py-5">Client Name</th>
              <th className="px-6 py-5">ID Card</th>
              <th className="px-6 py-5">WhatsApp</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5">Schedule</th>
              <th className="px-6 py-5 text-right">Balance Due</th>
              <th className="px-6 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-bold text-gray-800 uppercase text-sm tracking-tight">{c.name}</td>
                <td className="px-6 py-4 text-xs font-medium text-gray-500 italic">{c.id_card || `Not Added`}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                    <Smartphone className="w-3.5 h-3.5" /> {c.whatsapp_number}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-black uppercase tracking-widest">
                    {c.category_name || `General`}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{c.visit_day}</td>
                <td className="px-6 py-4 text-right">
                   <p className="text-sm font-black text-slate-900 font-mono">
                     PKR {Number(c.total_balance || 0).toLocaleString()}
                   </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Ledger Link - Naya Button */}
                    <Link 
                      href={`/dashboard/customers/${c.id}/ledger`} 
                      className="flex items-center gap-1.5 p-2 bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white rounded-lg transition-all font-black text-[10px] uppercase tracking-widest border border-slate-100"
                    >
                      <Receipt className="w-4 h-4" /> Ledger
                    </Link>

                    {/* Edit Button */}
                    <Link 
                      href={`/dashboard/customers/${c.id}/edit`} 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    
                    {/* Delete Form */}
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
        
        {customers.length === 0 && (
          <div className="p-24 text-center">
            <div className="inline-flex p-4 rounded-full bg-gray-50 mb-4">
              <Users className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 font-bold italic">No business customers found in your directory</p>
          </div>
        )}
      </div>
    </div>
  );
}