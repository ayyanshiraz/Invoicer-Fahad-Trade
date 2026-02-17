"use client";
import { useState, useRef } from "react";
import { ArrowLeft, Save, UserPlus, Hash, Smartphone, MapPin, UserCheck } from "lucide-react";
import Link from "next/link";
import { createSupplierAction } from "./actions";

export default function NewSupplierPage() {
  const nameRef = useRef<HTMLInputElement>(null);
  const manualIdRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/suppliers" className="flex items-center gap-2 text-blue-600 font-bold mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Suppliers
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg">
            <UserPlus className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Register New Supplier</h2>
            <p className="text-sm text-gray-500 font-medium">Set a manual ID for easy procurement search</p>
          </div>
        </div>
        
        <form action={createSupplierAction} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Supplier / Firm Name</label>
            <input 
              ref={nameRef}
              name="name" 
              type="text" 
              required 
              onKeyDown={(e) => handleKeyDown(e, manualIdRef)}
              placeholder="e.g. Al-Fatah Wholesalers" 
              className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-blue-600 uppercase mb-1 flex items-center gap-1">
              <Hash className="w-3 h-3" /> Manual Supplier ID (Used for Search)
            </label>
            <input 
              ref={manualIdRef}
              name="manual_id" 
              type="text" 
              required 
              onKeyDown={(e) => handleKeyDown(e, contactRef)}
              placeholder="e.g. SUP-101" 
              className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/50 font-black text-blue-700 uppercase" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Contact Person
              </label>
              <input 
                ref={contactRef}
                name="contact_person" 
                type="text" 
                placeholder="Manager Name" 
                onKeyDown={(e) => handleKeyDown(e, whatsappRef)}
                className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                <Smartphone className="w-3 h-3" /> WhatsApp Number
              </label>
              <input 
                ref={whatsappRef}
                name="whatsapp" 
                type="text" 
                required 
                placeholder="03XXXXXXXXX" 
                onKeyDown={(e) => handleKeyDown(e, addressRef)}
                className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Address
            </label>
            <textarea 
              ref={addressRef}
              name="address" 
              rows={2} 
              onKeyDown={(e) => { if(e.key === "Enter") { e.preventDefault(); submitRef.current?.focus(); } }}
              placeholder="Supplier warehouse or office address" 
              className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold"
            ></textarea>
          </div>

          <button 
            ref={submitRef}
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95 transition-all"
          >
            <Save className="w-5 h-5" /> Save Supplier Record
          </button>
        </form>
      </div>
    </div>
  );
}