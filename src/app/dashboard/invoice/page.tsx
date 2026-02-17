"use client";
import { useState, useEffect, useRef } from "react";
import { Search, RotateCcw, User, FileText, ArrowRight, Hash, ReceiptText } from "lucide-react";
import Link from "next/link";

export default function SalesReturnsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerInvoices, setCustomerInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  // 1. Customers load karna
  useEffect(() => {
    async function loadCustomers() {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data);
    }
    loadCustomers();
  }, []);

  // 2. Customer select hone par uski invoices fetch karna
  const fetchInvoices = async (customerId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices?customerId=${customerId}`);
      const data = await res.json();
      setCustomerInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  // 3. Search logic (Case-insensitive)
  const filteredCustomers = searchTerm.length > 0 
    ? customers.filter(c => {
        const s = searchTerm.toLowerCase();
        return c.name?.toLowerCase().includes(s) || (c.manual_id && c.manual_id.toLowerCase().includes(s));
      })
    : [];

  // 4. Enter press karne par auto-fetch
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const match = customers.find(c => c.manual_id?.toLowerCase() === searchTerm.toLowerCase()) 
                    || (filteredCustomers.length > 0 ? filteredCustomers[0] : null);

      if (match) {
        setSelectedCustomer(match);
        setSearchTerm(`${match.name} (${match.manual_id})`);
        fetchInvoices(match.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg">
          <RotateCcw className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase">Sales rrrrReturns</h1>
          <p className="text-xs text-slate-400 font-bold">Search customer to initiate product return</p>
        </div>
      </div>

      {/* Customer Search Bar */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="max-w-xl mx-auto relative">
          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest text-center">Enter Customer Manual ID</label>
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <input 
              ref={searchRef}
              type="text"
              className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 font-bold text-lg"
              placeholder="e.g. CUST-001"
              value={searchTerm}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (selectedCustomer) {
                  setSelectedCustomer(null);
                  setCustomerInvoices([]);
                }
              }}
            />
          </div>
          
          {/* Dropdown Results */}
          {searchTerm && !selectedCustomer && filteredCustomers.length > 0 && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
              {filteredCustomers.map(c => (
                <div 
                  key={c.id} 
                  className="p-4 hover:bg-red-50 cursor-pointer flex justify-between items-center border-b border-slate-50"
                  onClick={() => {
                    setSelectedCustomer(c);
                    setSearchTerm(`${c.name} (${c.manual_id})`);
                    fetchInvoices(c.id);
                  }}
                >
                  <span className="font-bold text-slate-700">{c.name}</span>
                  <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-black text-slate-500 uppercase">ID: {c.manual_id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoice List for Selected Customer */}
      {selectedCustomer && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ReceiptText className="text-red-600 w-5 h-5" />
              <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Invoices for {selectedCustomer.name}</h3>
            </div>
            <span className="text-[10px] font-black bg-red-100 text-red-600 px-3 py-1 rounded-lg uppercase">Select Invoice to Return</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                <tr>
                  <th className="px-8 py-5">Invoice ID</th>
                  <th className="px-8 py-5">Bill Amount</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-slate-400 font-bold">Loading invoices...</td></tr>
                ) : customerInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-red-50/30 transition-colors group">
                    <td className="px-8 py-5 font-black text-slate-700">#{inv.id.toString().padStart(5, "0")}</td>
                    <td className="px-8 py-5 font-black text-red-600">PKR {Number(inv.total_amount).toLocaleString()}</td>
                    <td className="px-8 py-5 text-sm text-slate-500 font-medium">{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td className="px-8 py-5 text-center">
                      <Link 
                        href={`/dashboard/invoice/returns/${inv.id}`}
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-md"
                      >
                        Process Return <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && customerInvoices.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-bold italic">
              No invoices found for this customer
            </div>
          )}
        </div>
      )}
    </div>
  );
}