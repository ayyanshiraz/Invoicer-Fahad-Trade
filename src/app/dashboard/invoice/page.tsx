import sql from "@/lib/db";
import { FileText, Eye, Calendar, User, ReceiptText, Wallet } from "lucide-react";
import Link from "next/link";

// [SEO Friendly] Metadata Section
export const metadata = {
  title: `Sales History - Fahad Traders`,
  description: `View all past invoices and sales records for Fahad Traders UAE`,
  seoTitle: `Invoice Directory - Fahad Traders Management`,
  slug: `dashboard/invoice`,
  metaDescription: `Access and track all generated business invoices and customer billing history`,
  focusKeyPhrase: `Sales History Dashboard`,
  seoKeyPhrase: `Business Invoicing Records`,
  imgAltText: `List of generated invoices with customer names and totals`,
};

export default async function InvoiceListPage() {
  // Query update ki hai taake naye balance columns b mil sakein
  const invoices = await sql`
    SELECT i.*, c.name as customer_name 
    FROM invoices i 
    JOIN customers c ON i.customer_id = c.id 
    ORDER BY i.created_at DESC
  `;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-lg">
            <ReceiptText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sales Invoices</h1>
            <p className="text-sm text-gray-500">History of all generated bills and customer ledgers</p>
          </div>
        </div>
        <Link 
          href="/dashboard/invoice/new" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          Create New Bill
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Net Bill</th>
                <th className="px-6 py-4">Current Balance</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-blue-600">
                    #{inv.id.toString().padStart(5, `0`)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-gray-800">{inv.customer_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">
                    PKR {Number(inv.total_amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <Wallet className="w-3.5 h-3.5" />
                      PKR {Number(inv.current_balance).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm font-medium">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link 
                      href={`/dashboard/invoice/${inv.id}`}
                      className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoices.length === 0 && (
          <div className="p-24 text-center">
            <div className="inline-flex p-4 rounded-full bg-gray-50 mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 italic font-medium">
              No sales records found in database
            </p>
          </div>
        )}
      </div>
    </div>
  );
}