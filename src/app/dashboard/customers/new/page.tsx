"use client";
import { useState, useRef } from "react";
import { ArrowLeft, Save, UserPlus, CreditCard, Smartphone, Hash, MapPin } from "lucide-react";
import Link from "next/link";
import { createCustomerAction } from "./actions";

export default function NewCustomerPage() {
  // Input Refs for Enter Key Navigation
  const nameRef = useRef<HTMLInputElement>(null);
  const manualIdRef = useRef<HTMLInputElement>(null);
  const idCardRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const visitDayRef = useRef<HTMLSelectElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // State for Formatted Inputs
  const [idCard, setIdCard] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Enter Key Navigation Handler
  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<any>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Form submit hone se rokna
      nextRef.current?.focus();
    }
  };

  // ID Card Auto-Formatter (00000-0000000-0)
  const handleIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); 
    if (val.length > 13) val = val.slice(0, 13);
    
    let formatted = val;
    if (val.length > 5 && val.length <= 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5)}`;
    } else if (val.length > 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5, 12)}-${val.slice(12)}`;
    }
    setIdCard(formatted);
  };

  // WhatsApp 11-digit Limit
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 11) {
      setWhatsapp(val);
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
          {/* 1. Full Name */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Full Name</label>
            <input 
              ref={nameRef}
              name="name" 
              type="text" 
              required 
              onKeyDown={(e) => handleKeyDown(e, manualIdRef)}
              placeholder="Enter customer name" 
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" 
            />
          </div>

          {/* 2. Manual Unique ID */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
              <Hash className="w-3 h-3" /> Manual Customer ID (Unique)
            </label>
            <input 
              ref={manualIdRef}
              name="manual_id" 
              type="text" 
              required 
              onKeyDown={(e) => handleKeyDown(e, idCardRef)}
              placeholder="e.g. CUST-001" 
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold text-blue-700" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 3. ID Card */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> ID Card Number
              </label>
              <input 
                ref={idCardRef}
                name="id_card" 
                type="text" 
                placeholder="00000-0000000-0" 
                value={idCard}
                onChange={handleIDChange}
                onKeyDown={(e) => handleKeyDown(e, whatsappRef)}
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" 
              />
            </div>

            {/* 4. WhatsApp */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                <Smartphone className="w-3 h-3" /> WhatsApp Number
              </label>
              <input 
                ref={whatsappRef}
                name="whatsapp" 
                type="text" 
                required 
                placeholder="e.g. 03001234567" 
                value={whatsapp}
                onChange={handleWhatsappChange}
                onKeyDown={(e) => handleKeyDown(e, visitDayRef)}
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" 
              />
            </div>
          </div>

          {/* 5. Visit Day Selection */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Assign Visit Day</label>
            <select 
              ref={visitDayRef}
              name="visit_day" 
              required 
              onKeyDown={(e) => handleKeyDown(e, addressRef)}
              className="w-full p-3 border rounded-xl bg-white outline-none font-medium"
            >
              <option value="">Select a day</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          {/* 6. Address */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Business Address
            </label>
            <textarea 
              ref={addressRef}
              name="address" 
              rows={2} 
              onKeyDown={(e) => handleKeyDown(e, submitRef)}
              placeholder="Complete shop address" 
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            ></textarea>
          </div>

          <button 
            ref={submitRef}
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
          >
            <Save className="w-5 h-5" /> Save Customer Record
          </button>
        </form>
      </div>
    </div>
  );
}