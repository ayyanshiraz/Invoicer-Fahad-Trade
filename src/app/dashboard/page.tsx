import sql from "@/lib/db";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Percent, 
  ArrowRightLeft 
} from "lucide-react";

// [SEO Friendly] Metadata Section
export const metadata = {
  title: `Business Dashboard - Fahad Traders`,
  description: `Monitor sales, revenue and customer metrics for Fahad Traders in UAE`,
  keywords: `dashboard, fahad traders, uae business, sales tracking, inventory metrics`,
  seoTitle: `Dashboard Overview - Fahad Traders`,
  slug: `dashboard`,
  metaDescription: `Real time business analytics and sales overview for Fahad Traders operations in UAE`,
  focusKeyPhrase: `Fahad Traders Dashboard`,
  seoKeyPhrase: `Business Performance Tracking UAE`,
  imgAltText: `Dashboard analytics showing revenue and customer count`,
};

export default async function DashboardPage() {
  // 1. Variables ko bahar define krna zaroori hai
  let totalRevenue = 0;
  let totalCustomers = 0;
  let totalSalesCount = 0;
  let overallProfit = 0;
  let outstandingBalance = 0;
  let profitMargin = 0;

  try {
    // 2. Database queries (Total Revenue, Profit, aur Outstanding Balances)
    // Hum farz karte hain ke profit margin 5 percent hai total revenue ka.
    // Outstanding balance ke liye hum farz kar rahay hain ke aik "paid_amount" column hai "invoices" table mein.
    // Agar "paid_amount" nahi hai, to usay add karna hoga real-time balances ke liye. Abhi hum usay total_amount - paid_amount assume kar rahay hain.
    
    // Yahan hum total_amount sum kar rahay hain.
    const revenueResult = await sql`SELECT SUM(total_amount) as total FROM invoices`;
    
    // Agar paid_amount column hai to outstanding balance calculate karein
    // Agar nahi hai to simply outstanding balance 0 set ho jaye ga aur aap baad mein add kar sakte hain.
    const financialResult = await sql`SELECT SUM(total_amount - COALESCE(paid_amount, 0)) as outstanding FROM invoices`;

    const customerResult = await sql`SELECT COUNT(*) as count FROM customers`;
    const salesResult = await sql`SELECT COUNT(*) as count FROM invoices`;

    // 3. Values assign krna aur numbers mein convert karna
    totalRevenue = Number(revenueResult[0]?.total) || 0;
    
    // Profit Calculation (Yahan main 5% fix margin assumed le raha hoon jaisa apke code me tha, 
    // agar actual profit calculation hai cost price minus karke to wo logic yahan aaye gi)
    overallProfit = totalRevenue * 0.05; 
    
    outstandingBalance = Number(financialResult[0]?.outstanding) || 0;
    
    totalCustomers = Number(customerResult[0]?.count) || 0;
    totalSalesCount = Number(salesResult[0]?.count) || 0;
    profitMargin = 5; // Fixed for now based on your design

  } catch (error) {
    console.error(`Database connection issue:`, error);
    // Error ki surat me values 0 hi rahen gi
  }

  const stats = [
    {
      title: `Total Revenue`,
      value: totalRevenue.toLocaleString(), // Number formatting add ki hai
      icon: DollarSign,
      color: `bg-blue-500`,
      textColor: `text-blue-600`,
    },
    {
      title: `Profit Margin`,
      value: `${profitMargin} %`,
      icon: Percent,
      color: `bg-emerald-500`,
      textColor: `text-emerald-600`,
    },
    {
      title: `Overall Profit`,
      value: overallProfit.toLocaleString(), // Updated to real variable
      icon: TrendingUp,
      color: `bg-cyan-500`,
      textColor: `text-cyan-600`,
    },
    {
      title: `Total Sales`,
      value: totalSalesCount.toString(), // Name updated to avoid confusion with totalRevenue
      icon: ShoppingCart,
      color: `bg-sky-400`,
      textColor: `text-sky-500`,
    },
    {
      title: `Active Customers`,
      value: totalCustomers.toString(),
      icon: Users,
      color: `bg-purple-500`,
      textColor: `text-purple-600`,
    },
    {
      title: `Outstanding Balances`,
      value: outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), // Updated to real variable aur format kiya hai
      icon: ArrowRightLeft,
      color: `bg-fuchsia-500`,
      textColor: `text-fuchsia-600`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-bold text-gray-800 text-lg">Main Dashboard</span>
        <span>|</span>
        <span>Business Overview</span>
      </div>

      {/* Stats Cards Grid (Colors updated as per previous instruction #121212 etc.) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-[#2A2A2A] p-6 rounded-2xl shadow-sm border border-[#0055FF] flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className={`p-4 rounded-xl ${stat.color} text-white shadow-inner`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-[#FFFFFF] tracking-tight">{stat.value}</p>
              <p className={`text-sm font-bold uppercase tracking-wider ${stat.textColor}`}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Chart Placeholder */}
      <div className="bg-[#2A2A2A] p-8 rounded-2xl shadow-sm border border-[#0055FF]">
        <h3 className="text-lg font-bold text-[#FFFFFF] mb-6 uppercase tracking-wide">Hourly Sales Analytics</h3>
        <div className="h-64 w-full bg-[#121212] rounded-2xl flex items-end justify-around p-6 border-b border-l border-[#0055FF]">
           <div className="w-12 bg-[#CCFF00] h-32 rounded-t-lg transition-all hover:opacity-80"></div>
           <div className="w-12 bg-[#CCFF00] h-48 rounded-t-lg transition-all hover:opacity-80"></div>
           <div className="w-12 bg-[#CCFF00] h-56 rounded-t-lg transition-all hover:opacity-80"></div>
           <div className="w-12 bg-[#CCFF00] h-40 rounded-t-lg transition-all hover:opacity-80"></div>
           <div className="w-12 bg-[#CCFF00] h-24 rounded-t-lg transition-all hover:opacity-80"></div>
        </div>
        <p className="text-center text-xs text-[#FFFFFF] mt-4 uppercase font-medium">Sales data visualization for UAE operations</p>
      </div>
    </div>
  );
}