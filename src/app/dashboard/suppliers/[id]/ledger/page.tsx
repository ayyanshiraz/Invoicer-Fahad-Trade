import sql from "@/lib/db";
import { ArrowLeft, Wallet, Receipt, Undo2, ArrowUpCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * [SEO Friendly]
 * seo title: Supplier Ledger Statement - Fahad Traders
 * slug: dashboard/suppliers/[id]/ledger
 * meta description: Track all purchases, payments, and returns for business suppliers in UAE
 * focus key phrase: Supplier Ledger Management
 */

export default async function SupplierLedgerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supplierId = Number(resolvedParams.id);

  // 1. Supplier details fetch krna
  const supplierData = await sql`SELECT * FROM suppliers WHERE id = ${supplierId}`;
  if (supplierData.length === 0) return notFound();
  const supplier = supplierData[0];

  // 2. Purchases, Returns aur Payments ko join kr k aik history banana
  // Hum UNION use kr rhe hain taake saara data aik list me aye
  const history = await sql`
    SELECT id, total_amount as amount, 'Purchase' as type, created_at FROM purchases WHERE supplier_id = ${supplierId}
    UNION ALL
    SELECT id, total_return_amount as amount, 'Return' as type, created_at FROM purchase_returns WHERE supplier_id = ${supplierId}
    UNION ALL
    SELECT id, amount, 'Payment' as type, created_at FROM supplier_payments WHERE supplier_id = ${supplierId}
    ORDER BY created_at ASC
  `;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <Link href="/dashboard/suppliers" className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase mb-4">
        <ArrowLeft size={16} /> Back to Directory
      </Link>

      {/* Supplier Profile Summary */}
      <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl">
              {supplier.name.charAt(0)}
           </div>
           <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase">{supplier.name}</h1>
              <p className="text-slate-400 font-bold">{supplier.whatsapp_number}</p>
           </div>
        </div>
        <div className="text-center md:text-right">
           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Outstanding</p>
           <p className="text-4xl font-black text-white">PKR {Number(supplier.total_balance).toLocaleString()}</p>
        </div>
      </div>

      {/* Ledger History Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-5">Date</th>
              <th className="px-6 py-5">Description</th>
              <th className="px-6 py-5 text-right">Debit (+)</th>
              <th className="px-6 py-4 text-right">Credit (-)</th>
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
                    {row.type === `Purchase` && <Receipt className="w-4 h-4 text-blue-500" />}
                    {row.type === `Return` && <Undo2 className="w-4 h-4 text-red-500" />}
                    {row.type === `Payment` && <ArrowUpCircle className="w-4 h-4 text-emerald-500" />}
                    <span className="font-black text-slate-800 uppercase text-xs">{row.type} Bill</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-black text-slate-900">
                  {row.type === `Purchase` ? `+ ${Number(row.amount).toLocaleString()}` : `-`}
                </td>
                <td className="px-6 py-4 text-right font-black text-emerald-600">
                  {row.type !== `Purchase` ? `- ${Number(row.amount).toLocaleString()}` : `-`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {history.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic font-bold">
            No transaction history found for this supplier
          </div>
        )}
      </div>
    </div>
  );
}