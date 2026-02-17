"use client";
import { useState, Suspense } from "react";
import { 
  Menu, X, Home, Users, ShoppingCart, ChevronDown, 
  ChevronRight, Package, ShoppingBag, Wallet, 
  BarChart3, Settings, User, LogOut, Calendar, Filter 
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

// 1. Header Logic Component (Isay Suspense mein wrap karenge build error fix karne ke liye)
function HeaderBar({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [profileOpen, setProfileOpen] = useState(false);

  // Filter States
  const [fromDate, setFromDate] = useState(searchParams.get(`from`) || ``);
  const [toDate, setToDate] = useState(searchParams.get(`to`) || ``);

  const applyDateFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (fromDate) params.set(`from`, fromDate);
    if (toDate) params.set(`to`, toDate);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className={`flex items-center justify-between h-20 px-8 bg-white shadow-sm border-b sticky top-0 z-30`}>
      {/* Left: Mobile Menu Button */}
      <button onClick={onMobileMenuOpen} className={`p-2 hover:bg-gray-100 rounded-md lg:hidden`}>
        <Menu className={`w-6 h-6 text-slate-800`} />
      </button>

      {/* Center: Real-Time Date Range Filter */}
      <div className={`flex items-center gap-2 md:gap-4`}>
        <div className={`flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-inner`}>
          <span className={`text-[10px] font-black text-slate-400 uppercase hidden sm:block`}>From</span>
          <input 
            type={`date`} 
            value={fromDate} 
            onChange={(e) => setFromDate(e.target.value)}
            className={`bg-transparent text-xs font-bold outline-none text-slate-900`} 
          />
        </div>
        <div className={`flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-inner`}>
          <span className={`text-[10px] font-black text-slate-400 uppercase hidden sm:block`}>To</span>
          <input 
            type={`date`} 
            value={toDate} 
            onChange={(e) => setToDate(e.target.value)}
            className={`bg-transparent text-xs font-bold outline-none text-slate-900`} 
          />
        </div>
        <button 
          onClick={applyDateFilter}
          className={`p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg active:scale-95 transition-all`}
        >
          <Filter size={18} />
        </button>
      </div>

      {/* Right: Profile Dropdown */}
      <div 
        className={`relative flex items-center h-full`}
        onMouseEnter={() => setProfileOpen(true)}
        onMouseLeave={() => setProfileOpen(false)}
      >
        <button className={`flex items-center gap-3 p-2 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100`}>
           <div className={`w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black shadow-lg text-xs`}>
             FT
           </div>
           <div className={`hidden sm:block text-left`}>
             <p className={`text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1`}>Active</p>
             <p className={`text-sm font-black text-slate-800 uppercase leading-none`}>Admin</p>
           </div>
           <ChevronDown size={14} className={`text-slate-400`} />
        </button>

        {profileOpen && (
          <div className={`absolute right-0 top-[70%] w-60 pt-4 animate-in fade-in slide-in-from-top-1 duration-200 z-50`}>
            <div className={`bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden`}>
              <div className={`px-4 py-3 border-b border-slate-50 bg-slate-50/50`}>
                 <p className={`text-[10px] font-black text-slate-400 uppercase tracking-widest`}>Fahad Traders UAE</p>
              </div>
              
              <Link 
                href={`/dashboard/profile`} 
                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all`}
              >
                <User size={18} /> My Profile Detail
              </Link>

              <form action={logoutAction}>
                <button 
                  type={`submit`}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-all border-t border-slate-50`}
                >
                  <LogOut size={18} /> Logout System
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// 2. Main Layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <div className={`flex min-h-screen bg-gray-100 font-sans`}>
      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className={`fixed inset-0 z-40 bg-black/50 lg:hidden`} 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? `translate-x-0` : `-translate-x-full`} overflow-y-auto`}>
        <div className={`flex items-center justify-between p-6 border-b border-slate-800`}>
           <div className={`flex items-center gap-3`}>
            <img src={`/logo.png`} alt={`Fahad Traders Logo`} className={`w-8 h-8 object-contain`} />
             <span className={`text-xl font-black tracking-tighter text-white uppercase`}>Fahad Traders</span>
           </div>
          <button className={`lg:hidden`} onClick={() => setIsOpen(false)}>
            <X className={`w-6 h-6`} />
          </button>
        </div>

        <nav className={`mt-6 px-3 pb-10 space-y-2`}>
          <Link 
            href={`/dashboard`} 
            className={`flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all`}
            onClick={() => setIsOpen(false)}
          >
            <Home className={`w-5 h-5 text-blue-400`} /> 
            <span className={`font-medium`}>Home Dashboard</span>
          </Link>

          <Link 
            href={`/dashboard/customers`} 
            className={`flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all`}
            onClick={() => setIsOpen(false)}
          >
            <Users className={`w-5 h-5 text-purple-400`} /> 
            <span className={`font-medium`}>Customers Directory</span>
          </Link>

          {/* Dropdowns remain same as your code */}
          <div>
            <button onClick={() => setSalesOpen(!salesOpen)} className={`w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all`}>
              <div className={`flex items-center gap-4`}><ShoppingCart className={`w-5 h-5 text-emerald-400`} /><span className={`font-medium`}>Sales Management</span></div>
              {salesOpen ? <ChevronDown className={`w-4 h-4 text-slate-500`} /> : <ChevronRight className={`w-4 h-4 text-slate-500`} />}
            </button>
            {salesOpen && (
              <div className={`ml-12 mt-1 space-y-1`}>
                <Link href={`/dashboard/invoice`} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg`}>Sale Invoices</Link>
                <Link href={`/dashboard/invoice/return`} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg`}>Process Sale Return</Link>
              </div>
            )}
          </div>

          <div>
            <button onClick={() => setInventoryOpen(!inventoryOpen)} className={`w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all`}>
              <div className={`flex items-center gap-4`}><Package className={`w-5 h-5 text-amber-400`} /><span className={`font-medium`}>Stock Inventory</span></div>
              {inventoryOpen ? <ChevronDown className={`w-4 h-4 text-slate-500`} /> : <ChevronRight className={`w-4 h-4 text-slate-500`} />}
            </button>
            {inventoryOpen && (
              <div className={`ml-12 mt-1 space-y-1`}>
                <Link href={`/dashboard/inventory/product`} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg`}>Product Items</Link>
                <Link href={`/dashboard/inventory/category`} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg`}>Categories List</Link>
              </div>
            )}
          </div>

          <div>
            <button onClick={() => setPurchaseOpen(!purchaseOpen)} className={`w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all`}>
              <div className={`flex items-center gap-4`}><ShoppingBag className={`w-5 h-5 text-pink-400`} /><span className={`font-medium`}>Purchase Management</span></div>
              {purchaseOpen ? <ChevronDown className={`w-4 h-4 text-slate-500`} /> : <ChevronRight className={`w-4 h-4 text-slate-500`} />}
            </button>
            {purchaseOpen && (
              <div className={`ml-12 mt-1 space-y-1`}>
                <Link href={`/dashboard/purchase`} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg`}>Purchase Invoices</Link>
                <Link href={`/dashboard/suppliers`} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg`}>Suppliers List</Link>
              </div>
            )}
          </div>

          <div>
            <button onClick={() => setAccountsOpen(!accountsOpen)} className={`w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all`}>
              <div className={`flex items-center gap-4`}><Wallet className={`w-5 h-5 text-cyan-400`} /><span className={`font-medium`}>Accounts Ledger</span></div>
              {accountsOpen ? <ChevronDown className={`w-4 h-4 text-slate-500`} /> : <ChevronRight className={`w-4 h-4 text-slate-500`} />}
            </button>
            {accountsOpen && (
              <div className={`ml-12 mt-1 space-y-1`}>
                <Link href={`/dashboard/accounts/payable`} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg`}>Accounts Payable</Link>
                <Link href={`/dashboard/accounts/receivable`} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg`}>Accounts Receivable</Link>
                <Link href={`/dashboard/accounts/expenses`} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg`}>Daily Expenses</Link>
                <Link href={`/dashboard/accounts/daily-ledger`} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg`}>Daily Ledger Report</Link>
              </div>
            )}
          </div>

          <div>
            <button onClick={() => setReportsOpen(!reportsOpen)} className={`w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all`}>
              <div className={`flex items-center gap-4`}><BarChart3 className={`w-5 h-5 text-red-400`} /> <span className={`font-medium`}>Business Reports</span></div>
              {reportsOpen ? <ChevronDown className={`w-4 h-4 text-slate-500`} /> : <ChevronRight className={`w-4 h-4 text-slate-500`} />}
            </button>
            {reportsOpen && (
              <div className={`ml-12 mt-1 space-y-1`}>
                <Link href={`/dashboard/reports/profit-loss`} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-bold`}>Monthly Profit and Loss</Link>
              </div>
            )}
          </div>

          <Link href={`/dashboard/settings`} className={`flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all`} onClick={() => setIsOpen(false)}>
            <Settings className={`w-5 h-5 text-gray-400`} /> <span className={`font-medium`}>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Page Area */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden`}>
        {/* Header Section wrapped in Suspense to fix Vercel Build Error */}
        <Suspense fallback={<div className={`h-20 bg-white border-b flex items-center px-8 animate-pulse text-xs font-bold text-slate-400 uppercase tracking-widest`}>Initializing Dashboard...</div>}>
           <HeaderBar onMobileMenuOpen={() => setIsOpen(true)} />
        </Suspense>

        <main className={`flex-1 overflow-y-auto p-4 md:p-8`}>
          {children}
        </main>
      </div>
    </div>
  );
}