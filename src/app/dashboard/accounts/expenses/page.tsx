"use client";
import { useState, useRef, useEffect } from "react";
import { Wallet, Plus, Receipt, Utensils, Zap, Home } from "lucide-react";
import Link from "next/link";
import { saveExpenseAction } from "./actions";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [todayTotal, setTodayTotal] = useState(0);

  // Refs for "Enter to move" navigation
  const formRef = useRef<HTMLFormElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Initial load par expenses mangwana
  useEffect(() => {
    async function loadExpenses() {
      // Note: Yahan API call assume ki gayi hai, warna SSR behtar rehta.
      // Agar SSR use karna h to ye page "server component" hona chahiye.
      // Kyunke aap ko Enter navigation chahiye thi, is liye Client component banaya h.
      const res = await fetch("/api/expenses");
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);

        // Aaj ka total nikalna
        const todayDate = new Date().toISOString().split("T")[0];
        const total = data
          .filter((e: any) => new Date(e.expense_date).toISOString().split("T")[0] === todayDate)
          .reduce((sum: number, e: any) => sum + Number(e.amount), 0);
        setTodayTotal(total);
      }
    }
    loadExpenses();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  const handleSaveExpense = async (formData: FormData) => {
    setLoading(true);
    try {
      const result = await saveExpenseAction(formData);
      if (result.success) {
        alert("Expense Saved!");
        window.location.reload(); // Reload to fetch fresh data
      } else {
        alert("Error saving expense");
      }
    } catch (error) {
      alert("System failed to save expense.");
    } finally {
      setLoading(false);
    }
  };

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
            <form ref={formRef} action={handleSaveExpense} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Description</label>
                <input 
                  ref={descRef}
                  name="description" 
                  required 
                  className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold" 
                  placeholder="e.g. Electricity Bill" 
                  onKeyDown={(e) => handleKeyDown(e, categoryRef)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Category</label>
                <select 
                  ref={categoryRef}
                  name="category" 
                  className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  onKeyDown={(e) => handleKeyDown(e, amountRef)}
                >
                  <option value="Utility">Utility (Bill)</option>
                  <option value="Food">Tea and Food</option>
                  <option value="Rent">Shop Rent</option>
                  <option value="Salary">Staff Salary</option>
                  <option value="General">General/Misc</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Amount</label>
                <input 
                  ref={amountRef}
                  name="amount" 
                  type="number" 
                  required 
                  className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold" 
                  placeholder="0.00" 
                  onKeyDown={(e) => handleKeyDown(e, submitRef)}
                />
              </div>
              <button 
                ref={submitRef}
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg active:scale-95"
              >
                {loading ? "Saving..." : "Save Expense"}
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
                      {new Date(e.expense_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 text-sm uppercase">{e.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                        {e.category === "Utility" && <Zap size={12} className="text-yellow-500" />}
                        {e.category === "Food" && <Utensils size={12} className="text-orange-500" />}
                        {e.category === "Rent" && <Home size={12} className="text-blue-500" />}
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