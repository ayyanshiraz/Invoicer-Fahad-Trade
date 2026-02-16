import sql from "@/lib/db";
import { Wallet, Plus, Receipt, Utensils, Zap, Home } from "lucide-react";
import Link from "next/link";
import { saveExpenseAction } from "./actions";

// [SEO Friendly] Metadata
export const metadata = {
  title: `Daily Expenses - Fahad Traders`,
  description: `Track and manage daily business operational costs and utility expenses for Fahad Traders UAE`,
  seoTitle: `Business Expenditure Tracker - Fahad Traders`,
  slug: `dashboard/accounts/expenses`,
  metaDescription: `Review and record all daily business costs including utilities, rent, and staff expenses`,
  focusKeyPhrase: `Business Expense Management`,
  seoKeyPhrase: `Daily Expenditure Record`,
  imgAltText: `List of business expenses with categories and total amounts`,
  seoKeywords: `expenses, daily cost, business utility, fahad traders, uae shop management`,
};

export default async function ExpensesPage() {
  // Aaj ke aur purane saare kharche nikalna
  const expenses = await sql`SELECT * FROM expenses ORDER BY created_at DESC`;
  
  // Aaj ka total kharcha calculate krna
  const todayDate = new Date().toISOString().split(`T`)[0];
  const todayTotal = expenses
    .filter(e => new Date(e.created_at).toISOString().split(`T`)[0] === todayDate)
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Header with Summary */}
      <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl flex flex-col md:flex-row justify-between items-center border-b-4 border-amber-500">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-amber-500 rounded-2xl">
            <Wallet size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Daily Expenses</h1>
            <p className="text-slate-400 font-bold text-sm">Monitor shop and operational expenditures</p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">Total Expenses Today</span>
          <h2 className="text-4xl font-black font-mono text-white">PKR {todayTotal.toLocaleString()}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Add Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-6">
            <h3 className="text-lg font-black text-slate-800 uppercase mb-6 flex items-center gap-2">
               <Plus className="text-amber-500" /> New Entry
            </h3>
            <form action={saveExpenseAction} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Description</label>
                <input name="description" required className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold" placeholder="e.g. Electricity Bill" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Category</label>
                <select name="category" className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold">
                  <option value="General">General</option>
                  <option value="Utility">Utility (Bill)</option>
                  <option value="Food">Tea and Food</option>
                  <option value="Rent">Shop Rent</option>
                  <option value="Salary">Staff Salary</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Amount</label>
                <input name="amount" type="number" required className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold" placeholder="0.00" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg active:scale-95">
                Save Expense
              </button>
            </form>
          </div>
        </div>

        {/* Expenses History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Details</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-gray-400">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 text-sm uppercase">{e.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                        {e.category === `Utility` && <Zap size={12} className="text-yellow-500" />}
                        {e.category === `Food` && <Utensils size={12} className="text-orange-500" />}
                        {e.category === `Rent` && <Home size={12} className="text-blue-500" />}
                        <span>{e.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900">
                      PKR {Number(e.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {expenses.length === 0 && (
              <div className="p-20 text-center text-gray-300 font-bold italic">No expenses recorded yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}