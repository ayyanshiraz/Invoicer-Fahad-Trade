"use client";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 print:hidden"
    >
      <Printer className="w-4 h-4" /> Print Bill
    </button>
  );
}