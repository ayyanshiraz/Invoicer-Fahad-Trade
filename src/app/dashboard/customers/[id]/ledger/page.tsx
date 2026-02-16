import sql from "@/lib/db";
import { ArrowLeft, Wallet, Receipt, ArrowDownCircle, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * [SEO Friendly]
 * seo title: Customer Ledger Statement - Fahad Traders
 * slug: dashboard/customers/[id]/ledger
 * meta description: Detailed financial statement for business clients including sales and payments history
 * focus key phrase: Customer Ledger UAE
 */

export default async function CustomerLedgerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const customerId = Number(resolvedParams.id);

  // 1. Customer details fetch krna
  const customerData = await sql`SELECT * FROM customers WHERE id = ${customerId}`;
  if (customerData.length === 0) return notFound();
  const customer = customerData[0];

  // 2. Invoices aur Payments ko combine kr k history banana
  const history = await sql`
    SELECT id, total_amount as amount, 'Sale' as type, created_at FROM invoices WHERE customer_id = ${customerId}
    UNION ALL
    SELECT id, amount, 'Payment' as type, created_at FROM customer_payments WHERE customer_id = ${customerId}
    ORDER BY created_at ASC
  `;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <Link href="/dashboard/customers" className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase mb-4">
        <ArrowLeft size={16} /> Back to Directory
      </Link>

      {/* Profile Summary Card */}
      <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-b-4 border-blue-600">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white">
              {customer.name.charAt(0).toUpperCase()}
           </div>
           <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase">{customer.name}</h1>
              <p className="text-slate-400 font-bold">{customer.whatsapp_number}</p>
           </div>
        </div>
        <div className="text-center md:text-right">
           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Current Outstanding</p>
           <p className="text-4xl font-black text-white">PKR {Number(customer.total_balance || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-5">Date</th>
              <th className="px-6 py-5">Transaction Type</th>
              <th className="px-6 py-5 text-right">Debit (Sale)</th>
              <th className="px-6 py-5 text-right">Credit (Payment)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {history.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-gray-500">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {row.type === `Sale` ? (
                      <Receipt className="w-4 h-4 text-blue-500" />
                    ) : (
                      <ArrowDownCircle className="w-4 h-4 text-emerald-500" />
                    )}
                    <span className="font-black text-slate-800 uppercase text-xs">
                      {row.type === `Sale` ? `Invoice Generated` : `Cash Payment Received`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-black text-slate-900">
                  {row.type === `Sale` ? `+ ${Number(row.amount).toLocaleString()}` : `-`}
                </td>
                <td className="px-6 py-4 text-right font-black text-emerald-600">
                  {row.type === `Payment` ? `- ${Number(row.amount).toLocaleString()}` : `-`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {history.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic font-bold">
            No transaction records found for this customer
          </div>
        )}
      </div>
    </div>
  );
}