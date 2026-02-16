import sql from "@/lib/db";
import { Settings, Save, Building2, Smartphone, MapPin, CheckCircle } from "lucide-react";
import { updateSettingsAction } from "./actions";

// [SEO Friendly] Metadata Section [cite: 2025-11-05]
export const metadata = {
  title: `Business Settings - Fahad Traders`,
  description: `Manage your shop profile, contact numbers, and warehouse address for Fahad Traders management system`,
  seoTitle: `Shop Profile Settings - Fahad Traders`,
  slug: `dashboard/settings`,
  metaDescription: `Configure business identity and contact details for printed reports and ledgers`,
  focusKeyPhrase: `Business Settings Management`,
  seoKeyPhrase: `Shop Profile Configuration`,
  imgAltText: `Settings interface for updating business details`,
  seoKeywords: `settings, business profile, fahad traders, uae shop, contact update`,
};

export default async function SettingsPage() {
  // Database se current settings uthana
  const settingsData = await sql`SELECT * FROM shop_settings WHERE id = 1`;
  const settings = settingsData[0] || { shop_name: `Fahad Traders`, whatsapp: `03XXXXXXXXX`, address: `UAE Warehouse` };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div className="p-4 bg-slate-900 text-blue-400 rounded-2xl shadow-xl shadow-slate-200">
          <Settings size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-800">Business Settings</h1>
          <p className="text-gray-400 font-bold text-sm">Update your shop identity and contact info</p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-gray-100">
        <form action={updateSettingsAction} className="space-y-8">
          <div className="space-y-6">
            {/* Shop Name */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                <Building2 size={12} /> Official Business Name
              </label>
              <input 
                name="shop_name" 
                defaultValue={settings.shop_name}
                required 
                className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-slate-800"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                <Smartphone size={12} /> Business WhatsApp Number
              </label>
              <input 
                name="whatsapp" 
                defaultValue={settings.whatsapp}
                required 
                className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-black text-slate-800 font-mono"
              />
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                <MapPin size={12} /> Warehouse / Shop Address
              </label>
              <textarea 
                name="address" 
                defaultValue={settings.address}
                rows={3}
                required 
                className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3"
            >
              <Save size={20} /> Update System Settings
            </button>
          </div>
        </form>

        <div className="mt-10 p-4 bg-blue-50 rounded-2xl flex items-start gap-3">
          <CheckCircle className="text-blue-600 mt-1 shrink-0" size={18} />
          <p className="text-[11px] font-bold text-blue-800 leading-relaxed">
            Note: Changes made here will be reflected on your Daily Ledger, Purchase Invoices, and Customer Receipts immediately.
          </p>
        </div>
      </div>
    </div>
  );
}