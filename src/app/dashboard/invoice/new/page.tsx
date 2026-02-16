"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Save, FileText, User, ShoppingBag } from "lucide-react";
import { saveInvoiceAction } from "./actions";

/**
 * [SEO Friendly] Details:
 * seo title: Create New Sale Invoice - Fahad Traders
 * slug: dashboard/invoice/new
 * meta description: Generate professional sale invoices with automated product filtering by category for UAE business
 * focus key phrase: New Sale Invoice UAE
 * seo key phrase: Category Based Invoicing System
 * img alt text: Sale Invoice Interface with Dynamic Category and Product Selection
 * seo keywords: invoice, sale, rice category, maslay category, inventory billing
 */

export default function NewInvoicePage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  // Items me ab categoryId aur availableProducts (filtered list) b shamil h
  const [items, setItems] = useState<any[]>([
    { categoryId: "", productId: "", description: "", qty: 1, price: 0, availableProducts: [] }
  ]);

  // 1. Customers aur Categories dono load krna
  useEffect(() => {
    async function loadData() {
      try {
        const [custRes, catRes] = await Promise.all([
          fetch(`/api/customers`),
          fetch(`/api/categories`)
        ]);
        const custData = await custRes.json();
        const catData = await catRes.json();
        setCustomers(custData);
        setCategories(catData);
      } catch (error) {
        console.error("Failed to load initial data", error);
      }
    }
    loadData();
  }, []);

  // 2. Jab Category select ho to us row k products fetch krna
  const handleCategoryChange = async (index: number, catId: string) => {
    const newItems = [...items];
    newItems[index].categoryId = catId;
    newItems[index].productId = ""; // Product reset krna
    newItems[index].price = 0;
    newItems[index].description = "";

    if (catId) {
      try {
        const res = await fetch(`/api/products?categoryId=${catId}`);
        const products = await res.json();
        newItems[index].availableProducts = products;
      } catch (error) {
        console.error("Error fetching products", error);
      }
    } else {
      newItems[index].availableProducts = [];
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { categoryId: "", productId: "", description: "", qty: 1, price: 0, availableProducts: [] }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  };

  const handleSave = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer before saving");
      return;
    }
    const validItems = items.filter(item => item.productId !== "" && item.qty > 0);
    if (validItems.length === 0) {
      alert("Please add at least one product with quantity");
      return;
    }
    const total = calculateSubtotal();
    try {
      await saveInvoiceAction(selectedCustomer, items, total);
      alert("Invoice has been generated and saved successfully");
    } catch (error) {
      alert("Failed to save invoice. Check console.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Invoice</h1>
            <p className="text-sm text-gray-500">Filter products by category for faster billing</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Select Customer
            </h3>
            <select 
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 outline-none"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">Choose a registered customer from list</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Items List with Filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Invoice Items</h3>
              <button onClick={addItem} className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 font-semibold">
                <Plus className="w-4 h-4" /> Add New Row
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  
                  {/* Category Filter */}
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Category</label>
                    <select 
                      className="w-full p-2 border border-gray-200 rounded-md bg-white outline-none text-sm"
                      value={item.categoryId}
                      onChange={(e) => handleCategoryChange(index, e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>

                  {/* Product Dropdown (Filtered) */}
                  <div className="md:col-span-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Product</label>
                    <select 
                      className="w-full p-2 border border-gray-200 rounded-md bg-white outline-none text-sm"
                      value={item.productId}
                      disabled={!item.categoryId}
                      onChange={(e) => {
                        const prod = item.availableProducts.find((p: any) => p.id === Number(e.target.value));
                        const newItems = [...items];
                        newItems[index].productId = e.target.value;
                        newItems[index].description = prod?.name || "";
                        newItems[index].price = prod?.price || 0;
                        setItems(newItems);
                      }}
                    >
                      <option value="">{item.categoryId ? "Choose Product" : "Select Category First"}</option>
                      {item.availableProducts.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Qty */}
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Qty</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border border-gray-200 rounded-md outline-none text-sm"
                      value={item.qty}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].qty = parseInt(e.target.value) || 0;
                        setItems(newItems);
                      }}
                    />
                  </div>

                  {/* Row Total Display */}
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Total</label>
                    <div className="p-2 font-bold text-blue-600 text-sm">
                      { (item.qty * item.price).toLocaleString() }
                    </div>
                  </div>

                  {/* Remove Row */}
                  <div className="md:col-span-1 flex items-end justify-center pb-1">
                    <button onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Invoice Summary</h3>
            <div className="space-y-3 border-b pb-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal Amount</span>
                <span className="font-bold text-slate-800">PKR {calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm italic">
                <span>Tax Percentage</span>
                <span>0 %</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Grand Total</span>
              <span className="text-blue-600">PKR {calculateSubtotal().toLocaleString()}</span>
            </div>
            
            <button 
              onClick={handleSave}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              <Save className="w-5 h-5" />
              Generate Final Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}