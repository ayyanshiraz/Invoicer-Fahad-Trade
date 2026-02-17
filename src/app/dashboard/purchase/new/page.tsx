"use client";
import { useState, useEffect, useRef } from "react";
import { Save, Plus, Trash2, ShoppingBag, ArrowLeft, DollarSign, Search, Calendar } from "lucide-react";
import Link from "next/link";
import { savePurchaseAction } from "./actions";

export default function NewPurchasePage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState([{ productId: "", description: "", qty: 0, price: 0 }]);
  const [loading, setLoading] = useState(false);

  // Refs for navigation
  const searchRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const paidRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [supRes, prodRes] = await Promise.all([
          fetch("/api/suppliers"),
          fetch("/api/products")
        ]);
        setSuppliers(await supRes.json());
        setProducts(await prodRes.json());
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    }
    fetchData();
  }, []);

  const filteredSuppliers = searchTerm.length > 0 
    ? suppliers.filter(s => 
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.manual_id && s.manual_id.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const match = suppliers.find(s => s.manual_id?.toLowerCase() === searchTerm.toLowerCase()) 
                    || (filteredSuppliers.length > 0 ? filteredSuppliers[0] : null);
      if (match) {
        setSelectedSupplier(match);
        setSearchTerm(`${match.name} (${match.manual_id})`);
        // Search ke baad Date par move karein
        setTimeout(() => dateRef.current?.focus(), 10);
      }
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    if (field === "productId") {
        const p = products.find(prod => prod.id.toString() === value);
        newItems[index].description = p?.name || "";
    }
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { productId: "", description: "", qty: 0, price: 0 }]);
  const removeItem = (index: number) => items.length > 1 && setItems(items.filter((_, i) => i !== index));
  const grandTotal = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price)), 0);

  const handleSave = async () => {
    if (!selectedSupplier) return alert("Please select a supplier");
    if (items.some(item => !item.productId || item.qty <= 0)) return alert("Check items and quantity");
    
    setLoading(true);
    try {
      // Yahan 5 arguments bhej rahe hain (supplierId, items, total, paid, date)
      const result = await savePurchaseAction(selectedSupplier.id, items, grandTotal, paidAmount, purchaseDate);
      if (result.success) {
        alert("Purchase saved and stock updated");
        window.location.href = "/dashboard/purchase";
      } else {
        alert("Error: " + result.error);
        setLoading(false);
      }
    } catch (err) {
      alert("System Error. Check terminal.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/dashboard/purchase" className="flex items-center gap-2 text-blue-600 font-bold">
        <ArrowLeft size={18} /> Back to History
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-white flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl"><ShoppingBag className="text-blue-600" /></div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">New Purchase Bill</h1>
            <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Incoming Stock Management</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Supplier Search */}
            <div className="relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Supplier (ID/Name)</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input 
                  ref={searchRef} 
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                  placeholder="ID + ENTER" 
                  value={searchTerm} 
                  onKeyDown={handleSearchKeyDown} 
                  onChange={(e) => {setSearchTerm(e.target.value); if(selectedSupplier) setSelectedSupplier(null);}} 
                />
              </div>
              {searchTerm && !selectedSupplier && filteredSuppliers.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
                  {filteredSuppliers.map(s => (
                    <div key={s.id} className="p-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-slate-50" onClick={() => {setSelectedSupplier(s); setSearchTerm(`${s.name} (${s.manual_id})`); dateRef.current?.focus();}}>
                      <span className="font-bold text-slate-700">{s.name}</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-black text-slate-500 uppercase">ID: {s.manual_id}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Purchase Date */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block text-center">Billing Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input 
                  ref={dateRef}
                  type="date"
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") paidRef.current?.focus(); }}
                />
              </div>
            </div>

            {/* 3. Payment Paid */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block text-right">Cash Paid Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input 
                  ref={paidRef} 
                  type="number" 
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-blue-600" 
                  placeholder="0.00"
                  onChange={(e) => setPaidAmount(Number(e.target.value))} 
                  onKeyDown={(e) => { if (e.key === "Enter") itemRefs.current[0]?.product?.focus(); }} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill Items</h3>
             {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                   <div className="col-span-5">
                      <select 
                        ref={(el) => (itemRefs.current[index] = { ...itemRefs.current[index], product: el })} 
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold uppercase outline-none" 
                        value={item.productId} 
                        onChange={(e) => updateItem(index, "productId", e.target.value)} 
                        onKeyDown={(e) => { if (e.key === "Enter") itemRefs.current[index]?.qty?.focus(); }}
                      >
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                   </div>
                   <div className="col-span-3">
                      <input 
                        ref={(el) => (itemRefs.current[index] = { ...itemRefs.current[index], qty: el })} 
                        type="number" 
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs text-center font-bold outline-none" 
                        placeholder="Qty" 
                        onChange={(e) => updateItem(index, "qty", e.target.value)} 
                        onKeyDown={(e) => { if (e.key === "Enter") itemRefs.current[index]?.price?.focus(); }} 
                      />
                   </div>
                   <div className="col-span-3">
                      <input 
                        ref={(el) => (itemRefs.current[index] = { ...itemRefs.current[index], price: el })} 
                        type="number" 
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs text-right font-bold outline-none" 
                        placeholder="Cost" 
                        onChange={(e) => updateItem(index, "price", e.target.value)} 
                        onKeyDown={(e) => { if (e.key === "Enter") paidRef.current?.focus(); }} 
                      />
                   </div>
                   <div className="col-span-1 text-right">
                      <button onClick={() => removeItem(index)} className="text-red-300 hover:text-red-500 transition-all">
                        <Trash2 size={18}/>
                      </button>
                   </div>
                </div>
             ))}
             <button 
                onClick={addItem} 
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all"
             >
                + Add Another Product Line
             </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100 gap-6">
             <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl w-full md:w-auto">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Grand Total Bill</p>
                <h2 className="text-3xl font-black font-sans">PKR {grandTotal.toLocaleString()}</h2>
             </div>
             <button 
                onClick={handleSave} 
                disabled={loading} 
                className="w-full md:w-auto px-12 py-5 bg-blue-600 text-white font-black rounded-3xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-widest text-xs"
             >
                {loading ? "Processing..." : "Complete Purchase"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}