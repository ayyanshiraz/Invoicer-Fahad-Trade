import sql from "@/lib/db";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";

/**
 * [SEO Friendly] Details:
 * seo title: Monthly Profit and Loss Report - Fahad Traders
 * slug: dashboard/reports/profit-loss
 * meta description: Comprehensive monthly financial performance report including sales revenue, purchase costs, and business expenses
 * focus key phrase: Monthly Profit and Loss UAE
 */

// Ye line is page ko 100% Real-Time bana de gi
export const dynamic = "force-dynamic";

export default async function ProfitLossPage() {
  // 1. Current Month ki Dates nikalna
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  // 2. Sales (Revenue) Calculate krna (COALESCE laga diya taake 0 handle ho)
  const salesData = await sql`
    SELECT COALESCE(SUM(total_amount), 0) as total FROM invoices 
    WHERE created_at >= ${firstDay}
  `;
  const totalSales = Number(salesData[0]?.total || 0);

  // 3. Purchases (Cost) Calculate krna
  const purchaseData = await sql`
    SELECT COALESCE(SUM(total_amount), 0) as total FROM purchases 
    WHERE created_at >= ${firstDay}
  `;
  const totalPurchases = Number(purchaseData[0]?.total || 0);

  // 4. Operating Expenses Calculate krna (Yahan expense_date lagaya hai)
  const expenseData = await sql`
    SELECT COALESCE(SUM(amount), 0) as total FROM expenses 
    WHERE expense_date >= ${firstDay}::date
  `;
  const totalExpenses = Number(expenseData[0]?.total || 0);

  // 5. Final Calculations
  const grossProfit = totalSales - totalPurchases;
  const netProfit = totalSales - totalPurchases - totalExpenses;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <PieChart className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Monthly Performance</h1>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
              Financial Summary for {new Date().toLocaleString(`en-US`, { month: `long`, year: `numeric` })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Sales Card */}
        <div className="bg-white p-8 rounded-[32px] border-b-4 border-emerald-500 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp size={24} /></div>
              <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded">Revenue</span>
           </div>
           <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Monthly Sales</p>
           <h3 className="text-3xl font-black text-slate-900 font-mono">PKR {totalSales.toLocaleString()}</h3>
        </div>

        {/* Total Purchases Card */}
        <div className="bg-white p-8 rounded-[32px] border-b-4 border-amber-500 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><DollarSign size={24} /></div>
              <span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-1 rounded">Inventory Cost</span>
           </div>
           <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Purchases</p>
           <h3 className="text-3xl font-black text-slate-900 font-mono">PKR {totalPurchases.toLocaleString()}</h3>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white p-8 rounded-[32px] border-b-4 border-red-500 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><TrendingDown size={24} /></div>
              <span className="text-[10px] font-black text-red-600 uppercase bg-red-50 px-2 py-1 rounded">Operating</span>
           </div>
           <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Dukan Expenses</p>
           <h3 className="text-3xl font-black text-slate-900 font-mono">PKR {totalExpenses.toLocaleString()}</h3>
        </div>
      </div>

      {/* Net Profit Banner */}
      <div className={`p-10 rounded-[40px] shadow-2xl flex flex-col md:flex-row justify-between items-center text-white ${netProfit >= 0 ? `bg-slate-900` : `bg-red-900`}`}>
        <div className="space-y-2">
           <h2 className="text-5xl font-black tracking-tighter uppercase">Net Monthly Profit</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">After all costs and expenditures are deducted</p>
        </div>
        <div className="text-center md:text-right mt-6 md:mt-0">
           <p className="text-blue-400 font-black text-sm uppercase tracking-widest mb-2">Final Balance</p>
           <h2 className={`text-6xl font-black font-mono ${netProfit >= 0 ? `text-emerald-400` : `text-white animate-pulse`}`}>
             PKR {netProfit.toLocaleString()}
           </h2>
        </div>
      </div>

      {/* Comparison Detail List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
           <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Performance Breakdown</h4>
        </div>
        <div className="divide-y divide-gray-50 font-bold">
           <div className="p-6 flex justify-between items-center hover:bg-gray-50 transition-all">
              <span className="text-slate-500 uppercase text-sm">Total Revenue from Sales</span>
              <span className="text-slate-900 font-mono">PKR {totalSales.toLocaleString()}</span>
           </div>
           <div className="p-6 flex justify-between items-center hover:bg-gray-50 transition-all">
              <span className="text-slate-500 uppercase text-sm">Cost of Goods Purchased</span>
              <span className="text-red-500 font-mono">- PKR {totalPurchases.toLocaleString()}</span>
           </div>
           <div className="p-6 flex justify-between items-center hover:bg-gray-50 transition-all">
              <span className="text-slate-500 uppercase text-sm">Business Operational Expenses</span>
              <span className="text-red-500 font-mono">- PKR {totalExpenses.toLocaleString()}</span>
           </div>
           <div className="p-6 flex justify-between items-center bg-blue-50/30">
              <span className="font-black text-blue-600 uppercase text-sm">Gross Margin (Sales - Cost)</span>
              <span className="font-black text-blue-900 font-mono">PKR {grossProfit.toLocaleString()}</span>
           </div>
        </div>
      </div>
    </div>
  );
}