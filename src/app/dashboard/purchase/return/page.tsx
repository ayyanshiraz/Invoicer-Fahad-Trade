"use client";
import { useState, useEffect, useRef } from "react";
import { Save, Plus, Trash2, Undo2, ArrowLeft, Search, Hash } from "lucide-react";
import Link from "next/link";
import { savePurchaseReturnAction } from "./actions";

export default function PurchaseReturnPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [reason, setReason] = useState("");
  const [items, setItems] = useState([{ productId: "", qty: 0, price: 0 }]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchData() {
      const [supRes, prodRes] = await Promise.all([
        fetch("/api/suppliers"),
        fetch("/api/products")
      ]);
      setSuppliers(await supRes.json());
      setProducts(await prodRes.json());
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
      }
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { productId: "", qty: 0, price: 0 }]);
  const removeItem = (index: number) => items.length > 1 && setItems(items.filter((_, i) => i !== index));
  const grandTotal = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price)), 0);

  const handleSubmit = async () => {
     if (!selectedSupplier) return alert("Select supplier first");
     setLoading(true);
     try {
       const res = await savePurchaseReturnAction(selectedSupplier.id, items, grandTotal, reason);
       if(res.success) {
         alert("Purchase return processed. Inventory and ledger updated.");
         window.location.href = "/dashboard/purchase";
       }
     } catch (err) {
       alert("Error processing return");
       setLoading(false);
     }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/dashboard/purchase" className="flex items-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-widest">
        <ArrowLeft size={14} /> Back to History
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl shadow-lg shadow-red-50">
            <Undo2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Stock Return to Supplier</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Update warehouse and supplier debt</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block text-center">Search Supplier ID</label>
            <div className="relative">
                <Search className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <input 
                  ref={searchRef} 
                  className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 font-bold text-lg" 
                  placeholder="e.g. SUP-001" 
                  value={searchTerm} 
                  onKeyDown={handleSearchKeyDown} 
                  onChange={(e) => {setSearchTerm(e.target.value); if(selectedSupplier) setSelectedSupplier(null);}} 
                />
            </div>
            {searchTerm && !selectedSupplier && filteredSuppliers.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
                  {filteredSuppliers.map(s => (
                    <div key={s.id} className="p-4 hover:bg-red-50 cursor-pointer flex justify-between border-b border-slate-50" onClick={() => {setSelectedSupplier(s); setSearchTerm(`${s.name} (${s.manual_id})`);}}>
                      <span className="font-bold text-slate-700">{s.name}</span>
                      <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-lg font-black text-slate-500 uppercase flex items-center gap-1">
                        <Hash size={10}/> {s.manual_id}
                      </span>
                    </div>
                  ))}
                </div>
            )}
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Reason for Stock Return</label>
            <input 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold placeholder:font-medium" 
              placeholder="Damaged products, expired stock etc..." 
              onChange={(e) => setReason(e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Return Item List</h3>
           {items.map((item, index) => (
             <div key={index} className="grid grid-cols-12 gap-4 items-center bg-red-50/20 p-4 rounded-2xl border border-red-50">
               <div className="col-span-5">
                 <select 
                   className="w-full p-2 bg-transparent outline-none font-bold text-sm uppercase" 
                   onChange={(e) => updateItem(index, "productId", e.target.value)}
                 >
                   <option value="">Select Product</option>
                   {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                 </select>
               </div>
               <div className="col-span-3">
                 <input 
                   type="number" 
                   className="w-full p-2 bg-white border border-red-100 rounded-lg text-center font-bold text-red-600 outline-none" 
                   placeholder="Qty" 
                   onChange={(e) => updateItem(index, "qty", e.target.value)} 
                 />
               </div>
               <div className="col-span-3">
                 <input 
                   type="number" 
                   className="w-full p-2 bg-white border border-red-100 rounded-lg text-right font-bold text-red-600 outline-none" 
                   placeholder="Cost" 
                   onChange={(e) => updateItem(index, "price", e.target.value)} 
                 />
               </div>
               <div className="col-span-1 text-right">
                 <button onClick={() => removeItem(index)} className="text-red-300 hover:text-red-600 transition-colors">
                   <Trash2 size={20}/>
                 </button>
               </div>
             </div>
           ))}
           <button onClick={addItem} className="text-[10px] font-black text-blue-600 uppercase tracking-widest p-2 hover:underline">
             + Add Another Return Item
           </button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="p-6 bg-red-600 rounded-[2rem] text-white shadow-xl shadow-red-100 w-full md:w-auto">
              <p className="text-[9px] font-black text-white/70 uppercase tracking-widest mb-1">Return Credit Total</p>
              <h2 className="text-4xl font-black">PKR {grandTotal.toLocaleString()}</h2>
           </div>
           <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white font-black rounded-3xl uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
           >
              <Save size={18} /> {loading ? "Updating DB" : "Process Return Record"}
           </button>
        </div>
      </div>
    </div>
  );
}