import sql from "@/lib/db";
import { Wallet, ArrowDownCircle, Users, ExternalLink } from "lucide-react";
import Link from "next/link";

// [SEO Friendly] Metadata Section
export const metadata = {
  title: `Accounts Receivable - Fahad Traders`,
  description: `Monitor business collection status and manage outstanding balances from business clients for Fahad Traders UAE`,
  seoTitle: `Customer Debt Tracker - Fahad Traders`,
  slug: `dashboard/accounts/receivable`,
  metaDescription: `Review all pending customer payments and track receivables to maintain healthy business cash flow`,
  focusKeyPhrase: `Accounts Receivable Management`,
};

export default async function ReceivablePage() {
  // Sirf un customers ko dikhana jin ka balance 0 se zyada h
  const receivables = await sql`
    SELECT * FROM customers 
    WHERE total_balance > 0 
    ORDER BY total_balance DESC
  `;

  const totalReceivable = receivables.reduce((acc, curr) => acc + Number(curr.total_balance), 0);

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl flex flex-col md:flex-row justify-between items-center border-b-4 border-emerald-500">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-900/20">
            <ArrowDownCircle size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Accounts Receivable</h1>
            <p className="text-slate-400 font-bold text-sm">Total money to be collected from clients</p>
          </div>
        </div>
        <div className="text-center md:text-right mt-4 md:mt-0">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Grand Total Receivable</span>
          <h2 className="text-4xl font-black">PKR {totalReceivable.toLocaleString()}</h2>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden font-sans">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-5">Customer Name</th>
              <th className="px-6 py-5">WhatsApp</th>
              <th className="px-6 py-5 text-right">Balance to Collect</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {receivables.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 font-black text-slate-800 uppercase text-sm">{c.name}</td>
                <td className="px-6 py-5 text-sm font-bold text-emerald-600">{c.whatsapp_number}</td>
                <td className="px-6 py-5 text-right">
                   <span className="font-black text-slate-900 font-mono">PKR {Number(c.total_balance).toLocaleString()}</span>
                </td>
                <td className="px-6 py-5 text-center">
                   <Link href={`/dashboard/customers/${c.id}/ledger`} className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                      <ExternalLink size={12} /> View History
                   </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {receivables.length === 0 && (
          <div className="p-24 text-center text-gray-400 font-bold italic">No pending receivables. All payments are collected!</div>
        )}
      </div>
    </div>
  );
}