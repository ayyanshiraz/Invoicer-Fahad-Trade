"use client";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Undo2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { savePurchaseReturnAction } from "./actions";

export default function PurchaseReturnPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState(``);
  const [reason, setReason] = useState(``);
  const [items, setItems] = useState([{ productId: ``, qty: 0, price: 0 }]);

  useEffect(() => {
    async function fetchData() {
      const supRes = await fetch(`/api/suppliers`);
      const prodRes = await fetch(`/api/products`);
      setSuppliers(await supRes.json());
      setProducts(await prodRes.json());
    }
    fetchData();
  }, []);

  const addItem = () => setItems([...items, { productId: ``, qty: 0, price: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const grandTotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <Link href="/dashboard/purchase" className="flex items-center gap-2 text-blue-600 font-bold">
        <ArrowLeft size={16} /> Back to Purchases
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl"><Undo2 className="w-8 h-8" /></div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Purchase Return Form</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Select Supplier</label>
            <select 
              className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-red-500 font-bold"
              onChange={(e) => setSelectedSupplier(e.target.value)}
              required
            >
              <option value="">Choose Supplier</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Reason for Return</label>
            <input 
              className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-red-500"
              placeholder="e.g. Damaged Goods or Quality Issue"
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center bg-red-50/50 p-4 rounded-2xl border border-red-100">
              <div className="col-span-5">
                <select 
                  className="w-full p-2 bg-transparent outline-none font-bold"
                  onChange={(e) => updateItem(index, `productId`, e.target.value)}
                >
                  <option value="">Select Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="col-span-3">
                <input 
                  type="number" 
                  placeholder="Qty"
                  className="w-full p-2 bg-white rounded-lg text-center font-bold"
                  onChange={(e) => updateItem(index, `qty`, e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <input 
                  type="number" 
                  placeholder="Cost"
                  className="w-full p-2 bg-white rounded-lg text-right font-bold"
                  onChange={(e) => updateItem(index, `price`, e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          <button onClick={addItem} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">+ Add Item</button>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Return Value</p>
            <h2 className="text-3xl font-black text-red-600">PKR {grandTotal.toLocaleString()}</h2>
          </div>
          <button 
            onClick={() => savePurchaseReturnAction(selectedSupplier, items, grandTotal, reason)}
            className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-100 transition-all active:scale-95 flex items-center gap-3"
          >
            <Save size={20} /> Submit Return
          </button>
        </div>
      </div>
    </div>
  );
}