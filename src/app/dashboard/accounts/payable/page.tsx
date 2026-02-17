import sql from "@/lib/db";
import { ArrowUpCircle, ExternalLink, Hash } from "lucide-react";
import Link from "next/link";

// [SEO Friendly] Metadata Section
export const metadata = {
  title: `Accounts Payable - Fahad Traders`,
  description: `Monitor and manage outstanding payments to business suppliers and wholesalers for Fahad Traders UAE`,
  seoTitle: `Supplier Liability Tracker - Fahad Traders`,
  slug: `dashboard/accounts/payable`,
  metaDescription: `Track all pending balances owed to suppliers for inventory procurement and business operations`,
  focusKeyPhrase: `Accounts Payable Management`,
};

export const dynamic = "force-dynamic";

export default async function PayablePage() {
  // Sirf un suppliers ko dikhana jin ka balance 0 se zyada h
  const payables = await sql`
    SELECT * FROM suppliers 
    WHERE total_balance > 0 
    ORDER BY total_balance DESC
  `;

  const totalPayable = payables.reduce((acc, curr) => acc + Number(curr.total_balance), 0);

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl flex flex-col md:flex-row justify-between items-center border-b-4 border-pink-600">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-pink-600 rounded-2xl shadow-lg shadow-pink-900/20">
            <ArrowUpCircle size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Accounts Payable</h1>
            <p className="text-slate-400 font-bold text-sm">Total amount you owe to suppliers</p>
          </div>
        </div>
        <div className="text-center md:text-right mt-4 md:mt-0">
          <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest block mb-1">Grand Total Payable</span>
          <h2 className="text-4xl font-black font-sans">PKR {totalPayable.toLocaleString()}</h2>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
            <tr>
              <th className="px-6 py-5">Supplier Details</th>
              <th className="px-6 py-5">Contact Info</th>
              <th className="px-6 py-5 text-right">Outstanding Balance</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payables.map((s) => (
              <tr key={s.id} className="hover:bg-pink-50/30 transition-colors group">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 uppercase group-hover:bg-pink-100 group-hover:text-pink-600 transition-all">
                         {s.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-black text-slate-800 uppercase text-sm block mb-0.5">{s.name}</span>
                        {/* Supplier Manual ID */}
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                          <Hash size={10} /> ID: {s.manual_id || "N/A"}
                        </span>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-gray-500">{s.whatsapp_number}</td>
                <td className="px-6 py-5 text-right">
                   <span className="font-black text-pink-600 text-lg">PKR {Number(s.total_balance).toLocaleString()}</span>
                </td>
                <td className="px-6 py-5 text-center">
                   <Link href={`/dashboard/suppliers/${s.id}/ledger`} className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-sm">
                      <ExternalLink size={12} /> Full Ledger
                   </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payables.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-bold italic">No outstanding payments found. Your accounts are clear!</div>
        )}
      </div>
    </div>
  );
}