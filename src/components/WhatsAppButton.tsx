"use client";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({ 
  phone, 
  name, 
  total, 
  paid, 
  remaining 
}: { 
  phone: string, 
  name: string, 
  total: number, 
  paid: number, 
  remaining: number 
}) {
  
  const handleWhatsApp = () => {
    const message = `Salaam ${name}! Your invoice from Fahad Traders has been generated. Total Amount: PKR ${total}. Amount Paid: PKR ${paid}. Remaining Balance: PKR ${remaining}. Please check and confirm. JazakAllah!`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp API URL
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

    // Choti window mein kholna takay dashboard band na ho
    window.open(url, `WhatsAppPopup`, `width=600,height=700,scrollbars=no,resizable=no`);
  };

  return (
    <button 
      onClick={handleWhatsApp}
      type={`button`}
      className={`bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs flex items-center gap-2 hover:bg-emerald-700 shadow-xl transition-all active:scale-95`}
    >
      <MessageCircle size={18} /> Send WhatsApp Invoice
    </button>
  );
}