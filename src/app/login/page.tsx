"use client";
import { useState } from "react";
import { Lock, User, ShieldCheck } from "lucide-react";
import { loginUserAction } from "./actions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginUserAction(formData);

    if (result.success) {
      window.location.href = "/dashboard";
    } else {
      setError(result.error || "Login Failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-widest">Fahad Traders</h1>
          <p className="text-blue-400 font-bold text-sm tracking-widest uppercase mt-2">Secure Admin Panel</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold text-center border border-red-100 uppercase tracking-widest">
                {error}
              </div>
            )}
            
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                <input 
                  name="username" 
                  required 
                  className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                  placeholder="Enter Admin Username" 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                <input 
                  name="password" 
                  type="password"
                  required 
                  className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                  placeholder="Enter Password" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl active:scale-95 text-sm"
            >
              {loading ? "Verifying..." : "Secure Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}