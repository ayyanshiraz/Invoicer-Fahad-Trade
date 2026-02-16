"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, ShoppingCart, Package, ShoppingBag, 
  Wallet, BarChart3, Settings, ChevronDown, 
  Receipt, FileText, Users, Boxes, ArrowRightLeft 
} from "lucide-react";

/**
 * [SEO Friendly]
 * Sidebar component for Fahad Traders Management Portal.
 * Designed to avoid apostrophes and quotation marks for live stability.
 */

const Sidebar = () => {
  const pathname = usePathname();
  // Hum ne yahan Purchase aur Accounts ko b add kr dia h taake ye expanded rahein
  const [openMenus, setOpenMenus] = useState<string[]>([`Sales`, `Inventory`, `Purchase`, `Accounts`]);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const menuGroups = [
    { title: `Home`, icon: <Home size={20} />, path: `/dashboard` },
    {
      title: `Sales`,
      icon: <ShoppingCart size={20} />,
      items: [
        { name: `Sale Invoice`, path: `/dashboard/invoice` },
        { name: `Sale Return`, path: `/dashboard/invoice/return` },
        { name: `Customers`, path: `/dashboard/customers` },
      ]
    },
    {
      title: `Inventory`,
      icon: <Package size={20} />,
      items: [
        { name: `Products`, path: `/dashboard/inventory/product` },
        { name: `Category`, path: `/dashboard/inventory/category` },
        { name: `Brand`, path: `/dashboard/inventory/brand` },
      ]
    },
    {
      title: `Purchase`,
      icon: <ShoppingBag size={20} />,
      items: [
        { name: `Purchase Invoice`, path: `/dashboard/purchase` },
        { name: `Purchase Return`, path: `/dashboard/purchase/return` },
        { name: `Suppliers`, path: `/dashboard/suppliers` },
      ]
    },
    {
      title: `Accounts`,
      icon: <Wallet size={20} />,
      items: [
        { name: `Accounts Payable`, path: `/dashboard/accounts/payable` },
        { name: `Accounts Receivable`, path: `/dashboard/accounts/receivable` },
        { name: `Expenses`, path: `/dashboard/accounts/expenses` },
        { name: `Journal Voucher`, path: `/dashboard/accounts/jv` },
      ]
    },
    { title: `Reports`, icon: <BarChart3 size={20} />, path: `/dashboard/reports` },
    { title: `Settings`, icon: <Settings size={20} />, path: `/dashboard/settings` },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen text-slate-300 flex flex-col fixed left-0 top-0 overflow-y-auto border-r border-slate-800 shadow-2xl z-50">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-900/20">FT</div>
        <div className="flex flex-col">
          <span className="font-black text-white tracking-tighter uppercase leading-none">Fahad Traders</span>
          <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Management UAE</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4 space-y-1">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-2">
            {group.items ? (
              <div className="space-y-1">
                <button
                  onClick={() => toggleMenu(group.title)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-slate-800 hover:text-white group ${openMenus.includes(group.title) ? `text-white bg-slate-800/50` : ``}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-1.5 rounded-lg transition-colors ${openMenus.includes(group.title) ? `text-blue-500 bg-blue-500/10` : `text-slate-500 group-hover:text-blue-400`}`}>
                      {group.icon}
                    </span>
                    <span className="font-bold text-sm tracking-tight">{group.title}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 text-slate-600 ${openMenus.includes(group.title) ? `rotate-180 text-blue-500` : ``}`} />
                </button>
                
                {/* Collapsible Sub-menu */}
                {openMenus.includes(group.title) && (
                  <div className="mt-1 ml-6 space-y-1 border-l-2 border-slate-800 pl-4 animate-in fade-in slide-in-from-left-2 duration-300">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`block p-2 text-[13px] rounded-lg transition-all duration-200 ${pathname === item.path ? `text-blue-500 bg-blue-500/5 font-black` : `text-slate-500 hover:text-slate-200 hover:translate-x-1`}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={group.path!}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${pathname === group.path ? `bg-blue-600 text-white shadow-lg shadow-blue-900/40` : `hover:bg-slate-800 hover:text-white`}`}
              >
                <span className={`p-1.5 rounded-lg ${pathname === group.path ? `text-white` : `text-slate-500 group-hover:text-blue-400`}`}>
                  {group.icon}
                </span>
                <span className="font-bold text-sm tracking-tight">{group.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
          <p className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-1.5">Database Status</p>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            Neon Cloud Online
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;