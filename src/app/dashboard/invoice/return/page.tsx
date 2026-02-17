"use client";
import { useState, useEffect, useRef } from "react";
import { RotateCcw, Search, Package, ReceiptText, User, Hash, ArrowRight } from "lucide-react";
import { processReturnAction } from "./actions";

export default function SaleReturnPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
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

  // 2. Search Logic (Case-Insensitive)
  const filteredCustomers = searchTerm.length > 0 
    ? customers.filter(c => {
        const s = searchTerm.toLowerCase();
        return c.name?.toLowerCase().includes(s) || (c.manual_id && c.manual_id.toLowerCase().includes(s));
      })
    : [];

  // 3. Customer Select hone par us ki invoices mangwana
  const fetchCustomerInvoices = async (customer: any) => {
    setLoading(true);
    setSelectedCustomer(customer);
    setSelectedInvoice(null); // Reset current view
    try {
      const res = await fetch(`/api/invoices?customerId=${customer.id}`);
      const data = await res.json();
      setInvoices(data);
    } catch (error) {
      alert("Failed to load invoices for this customer");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const match = customers.find(c => c.manual_id?.toLowerCase() === searchTerm.toLowerCase()) 
                    || (filteredCustomers.length > 0 ? filteredCustomers[0] : null);
      if (match) {
        setSearchTerm(`${match.name} (${match.manual_id})`);
        fetchCustomerInvoices(match);
      }
    }
  };

  // 4. Invoice ke items load karna jab list se click ho
  const handleInvoiceSelect = async (invoice: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`);
      const data = await res.json();
      setSelectedInvoice(data);
    } catch (error) {
      alert("Error loading invoice items");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (itemId: number, productId: number, qty: number, price: number) => {
    const confirmReturn = confirm("Proceed with returning this product?");
    if (!confirmReturn) return;

    try {
      await processReturnAction(selectedInvoice.invoice.id, itemId, productId, qty, price, selectedCustomer.id);
      alert("Return processed. Stock and Ledger updated.");
      handleInvoiceSelect(selectedInvoice.invoice); // UI Refresh
    } catch (error) {
      alert("Error processing the return");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg shadow-red-100">
          <RotateCcw className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Return Management</h1>
          <p className="text-xs text-slate-400 font-bold">Search Customer ID to view their bill history</p>
        </div>
      </div>

      {/* Customer Search Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative max-w-xl mx-auto">
          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest text-center">Enter Customer ID</label>
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <input 
              ref={searchRef}
              className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 font-bold"
              placeholder="e.g. CUST-001"
              value={searchTerm}
              onKeyDown={handleSearchKeyDown}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (selectedCustomer) setSelectedCustomer(null);
              }}
            />
          </div>
          {searchTerm && !selectedCustomer && filteredCustomers.length > 0 && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
              {filteredCustomers.map(c => (
                <div key={c.id} className="p-4 hover:bg-red-50 cursor-pointer flex justify-between border-b border-slate-50" onClick={() => fetchCustomerInvoices(c)}>
                  <span className="font-bold text-slate-700">{c.name}</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg font-black text-slate-400 uppercase">ID: {c.manual_id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices List */}
        {selectedCustomer && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-fit">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-black uppercase text-slate-600 tracking-widest">Billing History</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {loading && !selectedInvoice ? <div className="p-10 text-center text-slate-400 font-bold uppercase text-[10px]">Loading Bills...</div> : invoices.map(inv => (
                <div key={inv.id} className={`p-5 flex justify-between items-center cursor-pointer transition-all ${selectedInvoice?.invoice.id === inv.id ? "bg-red-50" : "hover:bg-slate-50"}`} onClick={() => handleInvoiceSelect(inv)}>
                  <div>
                    <p className="font-black text-slate-800 text-sm">Invoice #{inv.id.toString().padStart(5, "0")}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{new Date(inv.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="font-black text-slate-900 text-sm">PKR {Number(inv.total_amount).toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              ))}
              {invoices.length === 0 && !loading && <div className="p-10 text-center text-slate-300 font-bold italic">No records found</div>}
            </div>
          </div>
        )}

        {/* Selected Invoice Items */}
        {selectedInvoice ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-right">
            <div className="p-5 bg-red-600 text-white flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest">Return Items - #{selectedInvoice.invoice.id}</h3>
              <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded">Stock Adjust</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedInvoice.items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="text-xs font-black text-slate-800">{item.product_description || "Product Item"}</p>
                        <p className="text-[9px] text-slate-400 font-bold">Price: PKR {item.unit_price}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-sm text-slate-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleReturn(item.id, item.product_id, item.quantity, item.unit_price)} className="bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedCustomer && !loading && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center">
            <Package className="w-12 h-12 text-slate-200 mb-4" />
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Select an invoice to start return</p>
          </div>
        )}
      </div>
    </div>
  );
}