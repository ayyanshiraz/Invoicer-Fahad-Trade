import sql from "@/lib/db";
import { Calendar } from "lucide-react";
import PrintButton from "@/components/PrintButton";

// [SEO Friendly] Metadata
export const metadata = {
  title: `Daily Ledger Summary - Fahad Traders`,
  description: `Real-time daily customer ledger summary for market recovery and collection tracking`,
  seoTitle: `Daily Collection Report - Fahad Traders`,
  slug: `dashboard/accounts/daily-ledger`,
  metaDescription: `Generate accurate daily ledger reports including opening balance, today's sales, and payments received`,
};

export const dynamic = "force-dynamic";

export default async function DailyLedgerPage() {
  // 1. Aaj ki sales aur payments ko aggregated query se uthana 
  const reportData = await sql`
    SELECT 
      c.id, 
      c.name as customer_name, 
      c.total_balance as current_balance,
      COALESCE(i.today_sales, 0) as invoiced_amount,
      COALESCE(p.today_payments, 0) as paid_amount
    FROM customers c
    LEFT JOIN (
      SELECT customer_id, SUM(total_amount) as today_sales
      FROM invoices
      WHERE created_at::date = CURRENT_DATE
      GROUP BY customer_id
    ) i ON c.id = i.customer_id
    LEFT JOIN (
      SELECT customer_id, SUM(amount) as today_payments
      FROM customer_payments
      WHERE created_at::date = CURRENT_DATE
      GROUP BY customer_id
    ) p ON c.id = p.customer_id
    WHERE (c.total_balance != 0 OR i.today_sales > 0 OR p.today_payments > 0)
    ORDER BY c.name ASC
  `;

  // 2. Aaj ke Total Cash Flow Metrics nikalna (Naya Code)
  const cashMetrics = await sql`
    SELECT 
      (SELECT COALESCE(SUM(amount), 0) FROM customer_payments WHERE created_at::date = CURRENT_DATE) as total_recovery,
      (SELECT COALESCE(SUM(payment_amount), 0) FROM invoices WHERE created_at::date = CURRENT_DATE) as cash_sales,
      (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE expense_date = CURRENT_DATE) as today_expenses,
      (SELECT COALESCE(SUM(payment_amount), 0) FROM purchases WHERE created_at::date = CURRENT_DATE) as supplier_payments
  `;

  const metrics = cashMetrics[0];
  const cashIn = Number(metrics.total_recovery) + Number(metrics.cash_sales);
  const cashOut = Number(metrics.today_expenses) + Number(metrics.supplier_payments);
  const cashInHand = cashIn - cashOut;

  const today = new Date().toLocaleDateString(`en-GB`, {
    weekday: `long`,
    year: `numeric`,
    month: `long`,
    day: `numeric`,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Action Header - Print me hide hoga */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 print:hidden">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" /> Market Recovery Report
        </h2>
        <PrintButton />
      </div>

      {/* Report Container - Paper Style Design */}
      <div className="bg-white p-8 border border-gray-200 shadow-xl print:shadow-none print:border-none print:p-0">
        <div className="text-center mb-8 border-b-2 border-slate-900 pb-4">
          {/* Logo for Printed Report */}
          <div className="flex flex-col items-center mb-4">
            <img src="/logo.png" alt="Fahad Traders" className="w-24 h-24 object-contain mb-2" />
            <h1 className="text-2xl font-black text-black tracking-tighter uppercase">Fahad Traders</h1>
          </div>
          <p className="text-sm font-bold text-slate-600 mt-1 uppercase tracking-widest">Customer Ledger Summary</p>
          <div className="mt-2 text-xs font-black text-black flex justify-center gap-8">
             <span>Date: {new Date().toLocaleDateString()}</span>
             <span>Day: {new Date().toLocaleDateString(`en-US`, { weekday: `long` })}</span>
          </div>
        </div>

        {/* --- NAYA SECTION: CASH FLOW SUMMARY (Print Style) --- */}
        <div className="grid grid-cols-3 gap-4 border-2 border-black p-4 mb-8 bg-gray-50">
           <div className="text-center border-r-2 border-black">
              <p className="text-[10px] font-black uppercase text-gray-700 tracking-widest mb-1">Total Cash IN</p>
              <h3 className="text-xl font-black text-black font-mono">{cashIn.toLocaleString()}</h3>
           </div>
           <div className="text-center border-r-2 border-black">
              <p className="text-[10px] font-black uppercase text-gray-700 tracking-widest mb-1">Total Cash OUT</p>
              <h3 className="text-xl font-black text-black font-mono">{cashOut.toLocaleString()}</h3>
           </div>
           <div className="text-center bg-black text-white py-2">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-gray-300">Net Cash In Drawer</p>
              <h3 className="text-xl font-black font-mono">{cashInHand.toLocaleString()}</h3>
           </div>
        </div>

        {/* --- CUSTOMER LEDGER TABLE (Aap ka Original Format) --- */}
        <table className="w-full border-collapse border-2 border-black text-[11px]">
          <thead className="bg-gray-100 font-black">
            <tr>
              <th className="border-2 border-black px-2 py-2 text-center w-12">Sr.</th>
              <th className="border-2 border-black px-3 py-2 text-left">Customer</th>
              <th className="border-2 border-black px-3 py-2 text-right">Opening Balance</th>
              <th className="border-2 border-black px-3 py-2 text-right">Invoiced Amount</th>
              <th className="border-2 border-black px-3 py-2 text-right">Paid Amount</th>
              <th className="border-2 border-black px-3 py-2 text-right">Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => {
              const closing = Number(row.current_balance);
              const invoiced = Number(row.invoiced_amount);
              const paid = Number(row.paid_amount);
              // Logic: Closing = Opening + Invoiced - Paid -> so Opening = Closing - Invoiced + Paid 
              const opening = closing - invoiced + paid;

              return (
                <tr key={row.id} className="font-bold text-black border-b border-gray-300">
                  <td className="border-2 border-black px-2 py-1.5 text-center">{index + 1}</td>
                  <td className="border-2 border-black px-3 py-1.5 uppercase truncate max-w-[200px]">{row.customer_name}</td>
                  <td className="border-2 border-black px-3 py-1.5 text-right font-mono">{opening.toLocaleString()}</td>
                  <td className="border-2 border-black px-3 py-1.5 text-right font-mono">{invoiced > 0 ? invoiced.toLocaleString() : `0`}</td>
                  <td className="border-2 border-black px-3 py-1.5 text-right font-mono">{paid > 0 ? paid.toLocaleString() : `0`}</td>
                  <td className="border-2 border-black px-3 py-1.5 text-right font-black bg-gray-50 font-mono">{closing.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {reportData.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic">
            No customer transactions found for today.
          </div>
        )}

        {/* Footer for Signature */}
        <div className="mt-16 flex justify-between items-end px-4">
           <div className="text-center">
              <div className="w-40 border-t-2 border-black mb-1"></div>
              <p className="text-[10px] font-black uppercase">Prepared By</p>
           </div>
           <div className="text-center">
              <div className="w-40 border-t-2 border-black mb-1"></div>
              <p className="text-[10px] font-black uppercase">Authorized Signature</p>
           </div>
        </div>
      </div>
    </div>
  );
}