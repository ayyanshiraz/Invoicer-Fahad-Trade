"use client";
import { Save, UserPlus, ArrowLeft, Building2, Smartphone, Map } from "lucide-react";
import Link from "next/link";
import { createSupplierAction } from "./actions";

export default function NewSupplierPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/suppliers" className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest mb-4">
        <ArrowLeft size={16} /> Back to Directory
      </Link>

      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-gray-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-pink-50 text-pink-600 rounded-2xl">
            <UserPlus size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Register Supplier</h2>
            <p className="text-gray-400 font-bold text-sm">Create a new wholesaler profile for inventory procurement</p>
          </div>
        </div>

        <form action={createSupplierAction} className="space-y-8">
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                <Building2 size={12} /> Company or Person Name
              </label>
              <input 
                name="name" 
                type="text" 
                required 
                placeholder="Enter wholesaler name" 
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-pink-500 focus:bg-white transition-all font-bold text-slate-800"
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  <Smartphone size={12} /> WhatsApp Number
                </label>
                <input 
                  name="whatsapp" 
                  type="text" 
                  required 
                  placeholder="03XXXXXXXXX" 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-pink-500 focus:bg-white transition-all font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  <Map size={12} /> Office Location
                </label>
                <input 
                  name="address" 
                  type="text" 
                  placeholder="City or Warehouse Area" 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-pink-500 focus:bg-white transition-all font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-pink-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3"
          >
            <Save size={20} /> Save Record
          </button>
        </form>
      </div>
    </div>
  );
}