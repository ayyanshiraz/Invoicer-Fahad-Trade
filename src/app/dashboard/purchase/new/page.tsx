"use client";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, ShoppingBag, ArrowLeft, DollarSign } from "lucide-react";
import Link from "next/link";
import { savePurchaseAction } from "./actions";

export default function NewPurchasePage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [items, setItems] = useState([{ productId: "", description: "", qty: 0, price: 0 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const supRes = await fetch("/api/suppliers");
        const prodRes = await fetch("/api/products");
        setSuppliers(await supRes.json());
        setProducts(await prodRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const addItem = () => setItems([...items, { productId: "", description: "", qty: 0, price: 0 }]);
  
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
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

  const grandTotal = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price)), 0);

  const handleSave = async () => {
    if (!selectedSupplier) return alert("Please select a supplier from the list");
    if (items.some(item => !item.productId || item.qty <= 0)) return alert("Please select a product and enter quantity");
    
    setLoading(true);
    try {
      // Yahan hum 4 arguments bhej rahe hain: supplier, items, total, aur paid amount
      await savePurchaseAction(selectedSupplier, items, grandTotal, paidAmount);
      alert("Purchase saved successfully and stock updated");
      window.location.href = "/dashboard/purchase";
    } catch (err) {
      console.error(err);
      alert("Failed to save purchase. Check if database columns match.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/dashboard/purchase" className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-all">
          <ArrowLeft size={18} /> Back to Purchases List
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">New Purchase Entry</h1>
                <p className="text-sm text-slate-500 font-medium">Manage incoming stock from suppliers</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Input Row: Supplier and Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Supplier Name</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  value={selectedSupplier}
                >
                  <option value="">Choose Supplier From List</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cash Paid (Optional)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-4.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="number"
                    placeholder="Enter amount paid (e.g. 5000)"
                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Invoice Items</h3>
              
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-black text-slate-400 uppercase">
                <div className="col-span-5">Product Name</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Unit Cost</div>
                <div className="col-span-2 text-right">Subtotal</div>
                <div className="col-span-1"></div>
              </div>

              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-300 transition-all group">
                  <div className="col-span-5">
                    <select 
                      className="w-full p-2 font-bold text-slate-800 outline-none"
                      value={item.productId}
                      onChange={(e) => updateItem(index, "productId", e.target.value)}
                    >
                      <option value="">Select Product To Add</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number" 
                      placeholder="Qty"
                      className="w-full p-2 bg-slate-50 rounded-xl text-center font-bold border border-transparent focus:border-blue-500 outline-none"
                      onChange={(e) => updateItem(index, "qty", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <input 
                      type="number" 
                      placeholder="Price"
                      className="w-full p-2 bg-slate-50 rounded-xl text-right font-bold border border-transparent focus:border-blue-500 outline-none"
                      onChange={(e) => updateItem(index, "price", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 text-right font-black text-slate-900">
                    {(Number(item.qty) * Number(item.price)).toLocaleString()}
                  </div>
                  <div className="col-span-1 text-right">
                    <button onClick={() => removeItem(index)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}

              <button 
                onClick={addItem}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all"
              >
                <Plus size={16} /> Add New Row For Product
              </button>
            </div>

            {/* Bottom Summary Section */}
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-6">
              <div className="p-6 bg-slate-900 rounded-3xl text-white w-full md:w-auto shadow-xl shadow-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Billing Amount</p>
                <h2 className="text-4xl font-black">PKR {grandTotal.toLocaleString()}</h2>
              </div>
              <button 
                onClick={handleSave}
                disabled={loading}
                className={`w-full md:w-auto px-12 py-5 bg-blue-600 text-white font-black rounded-3xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 ${loading ? "opacity-50" : ""} uppercase tracking-widest text-sm`}
              >
                <Save size={20} /> {loading ? "Saving Data" : "Complete Purchase"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}