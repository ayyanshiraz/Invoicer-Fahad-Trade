import sql from "@/lib/db";
import { ArrowLeft, Smartphone, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import WhatsAppInvoiceButton from "@/components/WhatsAppInvoiceButton";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Invoice #${resolvedParams.id.toString().padStart(5, `0`)} - Fahad Traders`,
  };
}

export default async function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 1. Invoice aur Customer ka data fetch krna
  const invoiceData = await sql`
    SELECT i.*, c.name as customer_name, c.whatsapp_number as customer_whatsapp, c.address as customer_address
    FROM invoices i 
    JOIN customers c ON i.customer_id = c.id 
    WHERE i.id = ${Number(id)}
  `;

  if (invoiceData.length === 0) return notFound();
  const invoice = invoiceData[0];

  // 2. Invoice items fetch krna
  const items = await sql`
    SELECT ii.*, p.name as product_name
    FROM invoice_items ii
    LEFT JOIN products p ON ii.product_id = p.id
    WHERE ii.invoice_id = ${Number(id)}
  `;

  // 3. Shop settings fetch krna
  const settingsData = await sql`SELECT * FROM shop_settings WHERE id = 1`;
  const settings = settingsData[0] || { 
    shop_name: `Fahad Traders`, 
    whatsapp: `0321-4030049`, 
    address: `Lahore, Pakistan` 
  };

  // --- CALCULATION LOGIC ---
  const currentBill = Number(invoice.total_amount);
  // Hum yahan dono column names check kr rhe hein takay data missing na ho
  const cashPaid = Number(invoice.paid_amount || invoice.payment_amount || 0); 
  const billRemaining = currentBill - cashPaid; 
  const prevBalance = Number(invoice.previous_balance || 0); 
  const totalNetBalance = billRemaining + prevBalance;

  return (
    <div className={`max-w-4xl mx-auto space-y-6 py-6 px-4 pb-20`}>
      {/* Navigation & WhatsApp Actions */}
      <div className={`flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 print:hidden`}>
        <Link href={`/dashboard/invoice`} className={`flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline`}>
          <ArrowLeft className={`w-4 h-4`} /> Back to History
        </Link>
        <div className={`flex items-center gap-3`}>
          <WhatsAppInvoiceButton 
            phone={invoice.customer_whatsapp}
            name={invoice.customer_name}
            id={invoice.id.toString()}
            total={currentBill}
            paid={cashPaid}
            remaining={billRemaining}
            prev={prevBalance}
            net={totalNetBalance}
          />
          <PrintButton /> 
        </div>
      </div>

      {/* Main Bill Container */}
      <div className={`bg-white p-10 border-2 border-slate-200 shadow-2xl print:shadow-none print:border-none print:p-0 min-h-[1050px] flex flex-col rounded-[40px] print:rounded-none relative overflow-hidden`}>
        
        <div className={`absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 print:hidden`} />

        {/* Header Section */}
        <div className={`flex justify-between items-start border-b-4 border-black pb-6 mb-8`}>
          <div className={`flex items-center gap-5`}>
            <img src={`/logo.png`} alt={`Logo`} className={`w-20 h-20 object-contain`} />
            <div>
              <h1 className={`text-4xl font-black tracking-tighter text-black uppercase leading-none`}>{settings.shop_name}</h1>
              <div className={`mt-2 space-y-0.5`}>
                <p className={`text-[10px] font-black text-black uppercase flex items-center gap-1`}><Smartphone size={10} /> {settings.whatsapp}</p>
                <p className={`text-[10px] font-black text-black uppercase flex items-center gap-1`}><MapPin size={10} /> {settings.address}</p>
              </div>
            </div>
          </div>
          <div className={`text-right`}>
            <h2 className={`text-2xl font-black text-black mb-2`} dir={`rtl`}>کاروبار حلال - سود حرام</h2>
            <div className={`bg-black text-white px-3 py-1 inline-block rounded-md mb-2`}><p className={`text-[10px] font-black uppercase tracking-[0.2em]`}>Sale Invoice</p></div>
            <div className={`text-sm font-bold text-black`}>
              <p>Invoice# {invoice.id.toString().padStart(6, `0`)}</p>
              <p>Date: {new Date(invoice.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Customer Section */}
        <div className={`grid grid-cols-2 gap-10 mb-10`}>
          <div className={`border-l-4 border-black pl-4`}>
             <p className={`text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1`}>Customer Details</p>
             <h3 className={`text-2xl font-black text-black uppercase`}>{invoice.customer_name}</h3>
             <p className={`text-sm font-bold text-slate-600`}>{invoice.customer_whatsapp}</p>
             <p className={`text-[10px] font-bold text-slate-400 mt-1 uppercase`}>{invoice.customer_address || `No address provided`}</p>
          </div>
          <div className={`bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center`}>
             <p className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center`}>Payment Status</p>
             <p className={`text-center font-black ${cashPaid >= currentBill ? `text-emerald-600` : `text-red-600`} uppercase text-lg tracking-tighter`}>
                {cashPaid >= currentBill ? `Fully Paid` : `Credit Transaction`}
             </p>
          </div>
        </div>

        {/* Product Table */}
        <div className={`flex-grow`}>
          <table className={`w-full border-collapse border-2 border-black`}>
            <thead className={`bg-slate-900 text-white`}>
              <tr>
                <th className={`border-2 border-black px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest`}>Sr.</th>
                <th className={`border-2 border-black px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest`}>Product Description</th>
                <th className={`border-2 border-black px-4 py-3 text-center w-24 text-[10px] font-black uppercase tracking-widest`}>Qty</th>
                <th className={`border-2 border-black px-4 py-3 text-right w-32 text-[10px] font-black uppercase tracking-widest`}>Price</th>
                <th className={`border-2 border-black px-4 py-3 text-right w-32 text-[10px] font-black uppercase tracking-widest`}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, index: number) => (
                <tr key={item.id} className={`text-black font-bold border-b border-black`}>
                  <td className={`border-2 border-black px-4 py-3 text-center`}>{index + 1}</td>
                  <td className={`border-2 border-black px-4 py-3 uppercase text-xs`}>{item.product_name || `General Item`}</td>
                  <td className={`border-2 border-black px-4 py-3 text-center font-black`}>{Number(item.quantity).toLocaleString()}</td>
                  <td className={`border-2 border-black px-4 py-3 text-right`}>{Number(item.unit_price).toLocaleString()}</td>
                  <td className={`border-2 border-black px-4 py-3 text-right font-black`}>
                    {(Number(item.quantity) * Number(item.unit_price)).toLocaleString()}
                  </td>
                </tr>
              ))}
              {[...Array(Math.max(0, 8 - items.length))].map((_, i) => (
                <tr key={`empty-${i}`} className={`h-10`}>
                   <td className={`border-2 border-black px-4 py-3`} colSpan={5}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Updated Summary Section with 5 Lines Logic */}
        <div className={`mt-8 flex justify-between items-end`}>
          <div className={`text-left space-y-4`}>
             <div className={`p-4 bg-slate-50 border border-slate-100 rounded-2xl inline-block`}>
                <p className={`text-[9px] font-black text-slate-400 uppercase mb-1`}>Terms and Conditions</p>
                <ul className={`text-[9px] font-bold text-slate-500 list-disc list-inside space-y-0.5`}>
                   <li>Goods once sold are not returnable without valid reason</li>
                   <li>Please check items before leaving warehouse</li>
                   <li>Report any discrepancies within 24 hours</li>
                </ul>
             </div>
          </div>

          <div className={`w-80 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white`}>
             <div className={`flex justify-between px-4 py-1.5 border-b-2 border-black font-bold text-sm bg-gray-50`}>
                <span className={`uppercase text-[9px] font-black tracking-widest text-slate-500`}>Current Bill</span>
                <span>PKR {currentBill.toLocaleString()}</span>
             </div>
             <div className={`flex justify-between px-4 py-1.5 border-b-2 border-black font-bold text-sm text-emerald-600`}>
                <span className={`uppercase text-[9px] font-black tracking-widest`}>Cash Paid</span>
                <span>- PKR {cashPaid.toLocaleString()}</span>
             </div>
             <div className={`flex justify-between px-4 py-1.5 border-b-2 border-black font-bold text-sm`}>
                <span className={`uppercase text-[9px] font-black tracking-widest text-slate-500`}>Remaining Bill</span>
                <span>PKR {billRemaining.toLocaleString()}</span>
             </div>
             <div className={`flex justify-between px-4 py-1.5 border-b-2 border-black font-bold text-sm text-red-600`}>
                <span className={`uppercase text-[9px] font-black tracking-widest`}>Previous Balance</span>
                <span>PKR {prevBalance.toLocaleString()}</span>
             </div>
             <div className={`flex justify-between px-4 py-3 bg-black text-white font-black text-xl`}>
                <span className={`uppercase tracking-tighter`}>Total Balance</span>
                <span className={`font-mono`}>PKR {totalNetBalance.toLocaleString()}</span>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-16 flex justify-between items-end px-4 border-t-2 border-slate-100 pt-8`}>
           <div className={`text-center`}>
              <div className={`w-40 border-t-2 border-black mb-1`}></div>
              <p className={`text-[9px] font-black uppercase text-slate-400`}>Customer Signature</p>
           </div>
           
           <div className={`text-center space-y-2`}>
              <p className={`text-lg font-black text-black`} dir={`rtl`}>سیلز مین سے لین دین کے لئے رابطہ کریں</p>
              <div className={`flex items-center justify-center gap-1 text-sm font-black text-black tracking-widest`}>
                 <Smartphone size={14} /> {settings.whatsapp}
              </div>
           </div>

           <div className={`text-center`}>
              <div className={`w-40 border-t-2 border-black mb-1`}></div>
              <p className={`text-[9px] font-black uppercase text-slate-400`}>Authorized Signature</p>
           </div>
        </div>

        <div className={`mt-auto pt-6 text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.5em]`}>
           Fahad Traders Management Portal UAE - Digital Record
        </div>
      </div>
    </div>
  );
}