"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, UserPlus, CreditCard, Smartphone } from "lucide-react";
import Link from "next/link";
import { createCustomerAction } from "./actions";

export default function NewCustomerPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(``);
  
  // State for Formatted Inputs
  const [idCard, setIdCard] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // 1. Categories load krna
  useEffect(() => {
    async function loadCategories() {
      const res = await fetch(`/api/categories`);
      const data = await res.json();
      setCategories(data);
    }
    loadCategories();
  }, []);

  // 2. ID Card Auto-Formatter (00000-0000000-0)
  const handleIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // Sirf numbers rkhna
    if (val.length > 13) val = val.slice(0, 13); // Max 13 digits for CNIC
    
    let formatted = val;
    if (val.length > 5 && val.length <= 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5)}`;
    } else if (val.length > 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5, 12)}-${val.slice(12)}`;
    }
    setIdCard(formatted);
  };

  // 3. WhatsApp 11-digit Limit
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 11) {
      setWhatsapp(val);
    }
  };

  const handleCategoryChange = async (catId: string) => {
    setSelectedCategory(catId);
    if (catId) {
      const res = await fetch(`/api/products?categoryId=${catId}`);
      const data = await res.json();
      setProducts(data);
    } else {
      setProducts([]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/customers" className="flex items-center gap-2 text-blue-600 font-bold mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <UserPlus className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Register New Customer</h2>
        </div>
        
        <form action={createCustomerAction} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Full Name</label>
            <input name="name" type="text" required placeholder="Enter customer name" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ID Card with Auto-Format */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> ID Card Number
              </label>
              <input 
                name="id_card" 
                type="text" 
                placeholder="00000-0000000-0" 
                value={idCard}
                onChange={handleIDChange}
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" 
              />
            </div>

            {/* WhatsApp with 11 Digit Limit */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                <Smartphone className="w-3 h-3" /> WhatsApp Number
              </label>
              <input 
                name="whatsapp" 
                type="text" 
                required 
                placeholder="e.g. 03001234567" 
                value={whatsapp}
                onChange={handleWhatsappChange}
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" 
              />
              <p className="text-[10px] text-gray-400 mt-1">{whatsapp.length}/11 digits added</p>
            </div>
          </div>

          {/* Visit Day Selection */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Assign Visit Day</label>
            <select name="visit_day" required className="w-full p-3 border rounded-xl bg-white outline-none font-medium">
              <option value="">Select a day</option>
              {[`Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          {/* Dynamic Inventory Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
            <div>
              <label className="block text-[10px] font-black text-blue-800 mb-1 uppercase tracking-widest">Business Category</label>
              <select 
                name="inventory_category_id" 
                required 
                className="w-full p-3 border border-blue-200 rounded-lg outline-none bg-white font-bold"
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Choose Rice or Daal</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-blue-800 mb-1 uppercase tracking-widest">Preferred Product</label>
              <select 
                name="preferred_product_id" 
                required 
                disabled={!selectedCategory}
                className="w-full p-3 border border-blue-200 rounded-lg outline-none bg-white disabled:bg-gray-100 font-bold"
              >
                <option value="">{selectedCategory ? `Select Item` : `Select Category First`}</option>
                {products.map(prod => <option key={prod.id} value={prod.id}>{prod.name}</option>)}
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Business Address</label>
            <textarea name="address" rows={2} placeholder="Complete shop address" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"></textarea>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
            <Save className="w-5 h-5" /> Save Customer Record
          </button>
        </form>
      </div>
    </div>
  );
}