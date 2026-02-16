"use client";
import { useState } from "react";
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  ShoppingCart, 
  ChevronDown, 
  ChevronRight, 
  Package, 
  ShoppingBag, 
  Wallet, 
  BarChart3, 
  Settings 
} from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false); // Naya state add kia h

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? `translate-x-0` : `-translate-x-full`} overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          {/* Logo for Sidebar */}
           <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Fahad Traders Logo" className="w-8 h-8 object-contain" />
           <span className="text-xl font-black tracking-tighter text-white uppercase">Fahad Traders</span>
         </div>
          <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3 pb-10 space-y-2">
          {/* Home Link */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            onClick={() => setIsOpen(false)}
          >
            <Home className="w-5 h-5 text-blue-400" /> 
            <span className="font-medium">Home Dashboard</span>
          </Link>

          {/* Customers Link */}
          <Link 
            href="/dashboard/customers" 
            className="flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            onClick={() => setIsOpen(false)}
          >
            <Users className="w-5 h-5 text-purple-400" /> 
            <span className="font-medium">Customers Directory</span>
          </Link>


          {/* Sales Dropdown */}
          <div>
            <button 
              onClick={() => setSalesOpen(!salesOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">Sales Management</span>
              </div>
              {salesOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
            </button>

            {salesOpen && (
              <div className="ml-12 mt-1 space-y-1">
                <Link href="/dashboard/invoice" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  Sale Invoices
                </Link>
                <Link href="/dashboard/invoice/return" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  Process Sale Return
                </Link>
              </div>
            )}
          </div>

          {/* Inventory Dropdown */}
          <div>
            <button 
              onClick={() => setInventoryOpen(!inventoryOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <Package className="w-5 h-5 text-amber-400" />
                <span className="font-medium">Stock Inventory</span>
              </div>
              {inventoryOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
            </button>

            {inventoryOpen && (
              <div className="ml-12 mt-1 space-y-1">
                <Link href="/dashboard/inventory/product" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  Product Items
                </Link>
                <Link href="/dashboard/inventory/category" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  Categories List
                </Link>
              </div>
            )}
          </div>

          {/* Purchase Dropdown */}
          <div>
            <button 
              onClick={() => setPurchaseOpen(!purchaseOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <ShoppingBag className="w-5 h-5 text-pink-400" />
                <span className="font-medium">Purchase Management</span>
              </div>
              {purchaseOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
            </button>

            {purchaseOpen && (
              <div className="ml-12 mt-1 space-y-1">
                <Link href="/dashboard/purchase" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  Purchase Invoices
                </Link>
                <Link href="/dashboard/purchase/return" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  Purchase Return
                </Link>
                <Link href="/dashboard/suppliers" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  Suppliers List
                </Link>
              </div>
            )}
          </div>

          {/* Accounts Dropdown */}
          <div>
            <button 
              onClick={() => setAccountsOpen(!accountsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <Wallet className="w-5 h-5 text-cyan-400" />
                <span className="font-medium">Accounts Ledger</span>
              </div>
              {accountsOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
            </button>

            {accountsOpen && (
              <div className="ml-12 mt-1 space-y-1">
                <Link href="/dashboard/accounts/payable" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  Accounts Payable
                </Link>
                <Link href="/dashboard/accounts/receivable" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  Accounts Receivable
                </Link>
                <Link href="/dashboard/accounts/expenses" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  Daily Expenses
                </Link>
                <Link href="/dashboard/accounts/daily-ledger" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  Daily Ledger Report
                </Link>
              </div>
            )}
          </div>

          
          {/* Reports Dropdown (Naya Section) */}
          <div>
            <button 
              onClick={() => setReportsOpen(!reportsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <BarChart3 className="w-5 h-5 text-red-400" />
                <span className="font-medium">Business Reports</span>
              </div>
              {reportsOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
            </button>

            {reportsOpen && (
              <div className="ml-12 mt-1 space-y-1">
                <Link href="/dashboard/reports/profit-loss" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-bold">
                  Monthly Profit and Loss
                </Link>
              </div>
            )}
          </div>

          {/* Settings Link */}
          <Link 
            href="/dashboard/settings" 
            className="flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-5 h-5 text-gray-400" /> 
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow-sm border-b">
          <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-gray-100 rounded-md lg:hidden">
            <Menu className="w-6 h-6 text-slate-800" />
          </button>
          <div className="flex items-center gap-4">
             <span className="hidden md:block text-sm text-gray-500 font-medium italic">Fahad Traders Management Portal UAE</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}