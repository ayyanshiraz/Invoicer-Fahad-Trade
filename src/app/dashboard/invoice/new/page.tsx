"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, FileText, Search, DollarSign } from "lucide-react";
import { saveInvoiceAction } from "./actions";

export default function NewInvoicePage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(``);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split(`T`)[0]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  
  const [items, setItems] = useState<any[]>([
    { categoryId: ``, productId: ``, description: ``, qty: 1, price: 0, availableProducts: [] }
  ]);

  // Static Refs
  const searchRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const paidRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Dynamic Refs for Table Items
  const itemRefs = useRef<any[]>([]);

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
        console.error(`Failed to load data`, error);
      }
    }
    loadData();
  }, []);

  const filteredCustomers = searchTerm.length > 0 
    ? customers.filter(c => {
        const s = searchTerm.toLowerCase();
        const nameMatch = c.name?.toLowerCase().includes(s);
        const idMatch = c.manual_id?.toLowerCase().includes(s);
        return nameMatch || idMatch;
      })
    : [];

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === `Enter`) {
      e.preventDefault();
      const match = customers.find(c => 
        c.manual_id?.toLowerCase() === searchTerm.toLowerCase()
      ) || (filteredCustomers.length > 0 ? filteredCustomers[0] : null);

      if (match) {
        setSelectedCustomer(match);
        setSearchTerm(`${match.name} (${match.manual_id || `No ID`})`);
        setTimeout(() => dateRef.current?.focus(), 10);
      }
    }
  };

  const handleCategoryChange = async (index: number, catId: string) => {
    const newItems = [...items];
    newItems[index].categoryId = catId;
    newItems[index].productId = ``;
    if (catId) {
      const res = await fetch(`/api/products?categoryId=${catId}`);
      newItems[index].availableProducts = await res.json();
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { categoryId: ``, productId: ``, description: ``, qty: 1, price: 0, availableProducts: [] }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Logic Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const remainingFromCurrentBill = subtotal - paymentAmount; // Aaj ka bill baki
  const previousArrears = Number(selectedCustomer?.total_balance || 0); // Purana Udhaar
  const netTotalAfterThisBill = remainingFromCurrentBill + previousArrears; // Kul Milakr Total

  const handleSave = async () => {
    if (!selectedCustomer) return alert(`Select customer first`);
    if (items.some(i => !i.productId)) return alert(`Select products for all rows`);
    
    try {
      // 5 values pass krni hein server action ko
      await saveInvoiceAction(
        selectedCustomer.id, 
        items, 
        subtotal, 
        paymentAmount, 
        invoiceDate
      );
      alert(`Invoice saved successfully!`);
      // Redirect handled by server action, but fallback just in case
    } catch (error) {
      console.error(error);
      alert(`Error saving invoice to database`);
    }
  };

  return (
    <div className={`max-w-6xl mx-auto space-y-6 pb-10`}>
      <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center`}>
        <div className={`flex items-center gap-4`}>
          <div className={`p-3 bg-blue-600 text-white rounded-xl shadow-lg`}><FileText /></div>
          <div>
            <h1 className={`text-xl font-black text-slate-800 uppercase`}>New Sales Invoice</h1>
            <p className={`text-xs text-slate-400 font-bold tracking-widest`}>Fahad Traders Management Portal UAE</p>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6`}>
        <div className={`lg:col-span-2 space-y-6`}>
          <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
              <div className={`relative`}>
                <label className={`text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest`}>Search Customer (ID + Enter)</label>
                <div className={`relative`}>
                  <Search className={`absolute left-3 top-3 w-4 h-4 text-slate-400`} />
                  <input 
                    ref={searchRef}
                    type={`text`}
                    className={`w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold`}
                    placeholder={`Enter Manual ID...`}
                    value={searchTerm}
                    onKeyDown={handleSearchKeyDown}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (selectedCustomer) setSelectedCustomer(null);
                    }}
                  />
                </div>
                {searchTerm && !selectedCustomer && filteredCustomers.length > 0 && (
                  <div className={`absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden`}>
                    {filteredCustomers.map(c => (
                      <div key={c.id} className={`p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 flex justify-between`} onClick={() => {
                          setSelectedCustomer(c);
                          setSearchTerm(`${c.name} (${c.manual_id})`);
                          dateRef.current?.focus();
                        }}>
                        <span className={`font-bold text-slate-700`}>{c.name}</span>
                        <span className={`text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-black tracking-widest`}>ID: {c.manual_id}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className={`text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest`}>Billing Date</label>
                <input ref={dateRef} type={`date`} className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold`} value={invoiceDate} onKeyDown={(e) => { if (e.key === `Enter`) { e.preventDefault(); itemRefs.current[0]?.category?.focus(); } }} onChange={(e) => setInvoiceDate(e.target.value)} />
              </div>
            </div>
          </div>

          <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100`}>
            <div className={`flex justify-between items-center mb-6`}>
              <h3 className={`font-black text-slate-800 uppercase text-xs tracking-widest`}>Invoice Items</h3>
              <button onClick={addItem} className={`p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-1`}><Plus size={14} /> Add Row</button>
            </div>
            <div className={`space-y-3`}>
              {items.map((item, index) => (
                <div key={index} className={`grid grid-cols-12 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 items-center`}>
                  <div className={`col-span-3`}>
                    <select ref={(el) => (itemRefs.current[index] = { ...itemRefs.current[index], category: el })} className={`w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none`} value={item.categoryId} onKeyDown={(e) => { if (e.key === `Enter`) { e.preventDefault(); itemRefs.current[index]?.product?.focus(); } }} onChange={(e) => handleCategoryChange(index, e.target.value)}>
                      <option value="">Category</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className={`col-span-4`}>
                    <select ref={(el) => (itemRefs.current[index] = { ...itemRefs.current[index], product: el })} className={`w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none`} value={item.productId} onKeyDown={(e) => { if (e.key === `Enter`) { e.preventDefault(); itemRefs.current[index]?.qty?.focus(); } }} onChange={(e) => {
                      const prod = item.availableProducts.find((p: any) => p.id === Number(e.target.value));
                      const newItems = [...items];
                      newItems[index].productId = e.target.value;
                      newItems[index].price = prod?.price || 0;
                      setItems(newItems);
                    }}>
                      <option value="">Product</option>
                      {item.availableProducts.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className={`col-span-2`}>
                    <input ref={(el) => (itemRefs.current[index] = { ...itemRefs.current[index], qty: el })} type={`number`} className={`w-full p-2 border border-slate-200 rounded-lg text-xs text-center font-bold outline-none`} value={item.qty} onKeyDown={(e) => { if (e.key === `Enter`) { e.preventDefault(); paidRef.current?.focus(); } }} onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].qty = Number(e.target.value);
                      setItems(newItems);
                    }} />
                  </div>
                  <div className={`col-span-2 text-right font-black text-blue-600 text-sm`}>{(item.qty * item.price).toLocaleString()}</div>
                  <div className={`col-span-1 text-right`}><button onClick={() => removeItem(index)} className={`text-red-400 hover:text-red-600`}><Trash2 size={16}/></button></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl h-fit sticky top-24`}>
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8`}>Payment Summary</h3>
          <div className={`space-y-6`}>
            <div className={`flex justify-between items-center`}>
              <span className={`text-slate-400 text-xs font-bold uppercase`}>Total Bill</span>
              <span className={`text-2xl font-black text-blue-400`}>PKR {subtotal.toLocaleString()}</span>
            </div>
            
            <div className={`pt-6 border-t border-slate-800`}>
              <label className={`text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest`}>Cash Paid On-Spot</label>
              <div className={`relative text-slate-900`}>
                <DollarSign className={`absolute left-4 top-4 w-4 h-4 text-slate-400`} />
                <input 
                  ref={paidRef}
                  type={`number`}
                  className={`w-full pl-12 p-4 bg-white rounded-2xl outline-none font-black text-xl text-blue-600 focus:ring-4 focus:ring-blue-500/20`}
                  placeholder={`0.00`}
                  value={paymentAmount}
                  onKeyDown={(e) => { if (e.key === `Enter`) { e.preventDefault(); submitRef.current?.focus(); } }}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className={`pt-6 space-y-3 border-t border-slate-800`}>
              <div className={`flex justify-between items-center`}>
                <span className={`text-slate-400 text-[9px] font-black uppercase`}>Current Bill Remaining</span>
                <span className={`font-black text-sm text-white`}>PKR {remainingFromCurrentBill.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between items-center`}>
                <span className={`text-slate-400 text-[9px] font-black uppercase`}>Previous Ledger Balance</span>
                <span className={`font-black text-sm text-red-400`}>PKR {previousArrears.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between items-center bg-slate-800 p-3 rounded-xl`}>
                <span className={`text-white text-[10px] font-black uppercase`}>Net Total Balance</span>
                <span className={`font-black text-lg text-emerald-400`}>PKR {netTotalAfterThisBill.toLocaleString()}</span>
              </div>
            </div>

            <button 
              ref={submitRef}
              onClick={handleSave} 
              className={`w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-blue-900/40 active:scale-95 transition-all`}
            >
              Complete Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}