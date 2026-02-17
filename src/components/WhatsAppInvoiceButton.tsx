"use client";
import { MessageSquare } from "lucide-react";

export default function WhatsAppInvoiceButton({ 
  phone, name, id, total, paid, remaining, prev, net 
}: { 
  phone: string, name: string, id: string, total: number, paid: number, remaining: number, prev: number, net: number 
}) {
  const handleWhatsApp = () => {
    const msg = `Salaam ${name}! Invoice #${id} from Fahad Traders.
- Current Bill: PKR ${total}
- Cash Paid: PKR ${paid}
- Bill Remaining: PKR ${remaining}
- Previous Balance: PKR ${prev}
- Net Total Balance: PKR ${net}
Please check and confirm. JazakAllah!`;
    
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
    window.open(url, `WhatsAppPopup`, `width=600,height=700,scrollbars=no`);
  };

  return (
    <button 
      onClick={handleWhatsApp}
      className={`bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-black uppercase text-xs hover:bg-emerald-700 transition-all shadow-lg print:hidden`}
    >
      <MessageSquare size={16} /> Send WhatsApp
    </button>
  );
}