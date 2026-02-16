"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Edit3 } from "lucide-react";
import Link from "next/link";
import { use } from "react"; // For params handling
import { updateCustomerAction } from "../../actions";

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const customerId = Number(resolvedParams.id);

  const [idCard, setIdCard] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [customer, setCustomer] = useState<any>(null);

  // Load existing data
  useEffect(() => {
    async function loadCustomer() {
      const res = await fetch(`/api/customers/${customerId}`);
      const data = await res.json();
      setCustomer(data);
      setIdCard(data.id_card || "");
      setWhatsapp(data.whatsapp_number || "");
    }
    loadCustomer();
  }, [customerId]);

  // ID Format Logic
  const handleIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 13) val = val.slice(0, 13);
    let formatted = val;
    if (val.length > 5 && val.length <= 12) formatted = `${val.slice(0, 5)}-${val.slice(5)}`;
    else if (val.length > 12) formatted = `${val.slice(0, 5)}-${val.slice(5, 12)}-${val.slice(12)}`;
    setIdCard(formatted);
  };

  if (!customer) return <p className="p-10 text-center">Loading record details...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/customers" className="flex items-center gap-2 text-blue-600 font-bold mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <Edit3 className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Update Customer Profile</h2>
        </div>

        <form action={(fd) => updateCustomerAction(customerId, fd)} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Full Name</label>
            <input name="name" defaultValue={customer.name} required className="w-full p-4 border rounded-xl outline-none bg-gray-50 focus:bg-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">ID Card</label>
              <input name="id_card" value={idCard} onChange={handleIDChange} className="w-full p-4 border rounded-xl outline-none bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">WhatsApp</label>
              <input name="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.slice(0, 11))} className="w-full p-4 border rounded-xl outline-none bg-gray-50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Visit Day</label>
            <select name="visit_day" defaultValue={customer.visit_day} className="w-full p-4 border rounded-xl bg-white outline-none">
              {[`Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Address</label>
            <textarea name="address" defaultValue={customer.address} rows={3} className="w-full p-4 border rounded-xl outline-none bg-gray-50" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
            Update Record Successfully
          </button>
        </form>
      </div>
    </div>
  );
}