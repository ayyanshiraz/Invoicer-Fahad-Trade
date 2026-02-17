import sql from "@/lib/db";
import { cookies } from "next/headers";
import { User, CreditCard, Phone, Lock, Save, ShieldCheck } from "lucide-react";
import { updateProfileAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // Login shuda admin ka naam nikalna
  const cookieStore = await cookies();
  const currentUsername = cookieStore.get("admin_session")?.value;

  // Database se us admin ka mukammal data mangwana
  const adminData = await sql`SELECT * FROM admins WHERE username = ${currentUsername}`;
  const admin = adminData[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Profile Header */}
      <div className="bg-slate-900 p-8 rounded-[32px] text-white flex items-center gap-5 shadow-2xl">
        <div className="p-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30">
          <ShieldCheck size={36} />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest">Admin Profile</h1>
          <p className="text-blue-400 font-bold text-sm tracking-widest uppercase mt-1">Manage your security and personal details</p>
        </div>
      </div>

      {/* Profile Update Form */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <form action={updateProfileAction} className="space-y-6">
          <input type="hidden" name="id" value={admin.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                <input name="full_name" defaultValue={admin.full_name || ""} className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Ali Raza" />
              </div>
            </div>
            
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">ID Card (CNIC)</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                <input name="id_card" defaultValue={admin.id_card || ""} className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="35202-XXXXXXX-X" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">WhatsApp Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                <input name="whatsapp_number" defaultValue={admin.whatsapp_number || ""} className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="03XXXXXXXXX" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 mt-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Login Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                  <input name="username" defaultValue={admin.username} required className="w-full pl-12 p-4 bg-blue-50 border border-blue-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-blue-700" />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                  <input name="password" defaultValue={admin.password} required className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 mt-4">
            <Save size={20} /> Update Profile Settings
          </button>
        </form>
      </div>
    </div>
  );
}