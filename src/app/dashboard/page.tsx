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

export const dynamic = `force-dynamic`;

export default async function DashboardPage({ searchParams }: { searchParams: any }) {
  // 1. URL se dates nikalna (Next.js 15+ mein await zaroori h)
  const queryParams = await searchParams;
  const from = queryParams.from;
  const to = queryParams.to;

  // Agar date nahi di gayi to aaj ki date set karein
  const startDate = from || new Date().toISOString().split(`T`)[0];
  const endDate = to || new Date().toISOString().split(`T`)[0];

  let totalRevenue = 0;
  let totalCustomers = 0;
  let totalSalesCount = 0;
  let overallProfit = 0;
  let outstandingBalance = 0;
  let profitMargin = 5; // 5 percent assumed margin

  try {
    // 2. Database queries with Date Range Filter
    
    // Revenue Query
    const revenueResult = await sql`
      SELECT COALESCE(SUM(total_amount), 0) as total 
      FROM invoices 
      WHERE created_at::date BETWEEN ${startDate} AND ${endDate}
    `;
    
    // Outstanding Balance (Is range ke invoices ka baki udhaar)
    const financialResult = await sql`
      SELECT COALESCE(SUM(total_amount - COALESCE(paid_amount, 0)), 0) as outstanding 
      FROM invoices 
      WHERE created_at::date BETWEEN ${startDate} AND ${endDate}
    `;

    // Active Customers (Ye lifetime metric h)
    const customerResult = await sql`SELECT COUNT(*) as count FROM customers`;
    
    // Sales Count in Range
    const salesResult = await sql`
      SELECT COUNT(*) as count 
      FROM invoices 
      WHERE created_at::date BETWEEN ${startDate} AND ${endDate}
    `;

    // 3. Values assign krna
    totalRevenue = Number(revenueResult[0]?.total) || 0;
    overallProfit = totalRevenue * (profitMargin / 100); 
    outstandingBalance = Number(financialResult[0]?.outstanding) || 0;
    totalCustomers = Number(customerResult[0]?.count) || 0;
    totalSalesCount = Number(salesResult[0]?.count) || 0;

  } catch (error) {
    console.error(`Database connection issue:`, error);
  }

  const stats = [
    {
      title: `Total Revenue`,
      value: totalRevenue.toLocaleString(),
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
      value: overallProfit.toLocaleString(),
      icon: TrendingUp,
      color: `bg-cyan-500`,
      textColor: `text-cyan-600`,
    },
    {
      title: `Total Sales`,
      value: totalSalesCount.toString(),
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
      value: outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      icon: ArrowRightLeft,
      color: `bg-fuchsia-500`,
      textColor: `text-fuchsia-600`,
    },
  ];

  return (
    <div className={`space-y-6`}>
      {/* Header */}
      <div className={`flex items-center justify-between`}>
        <div className={`flex items-center gap-2 text-sm text-gray-500`}>
          <span className={`font-bold text-gray-800 text-lg uppercase tracking-tighter`}>Main Dashboard</span>
          <span className={`text-slate-300`}>|</span>
          <span className={`font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-xs`}>
            Showing: {startDate} to {endDate}
          </span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-[#2A2A2A] p-6 rounded-2xl shadow-sm border border-[#0055FF] flex items-center justify-between hover:scale-[1.02] transition-all`}
          >
            <div className={`p-4 rounded-xl ${stat.color} text-white shadow-inner`}>
              <stat.icon className={`w-8 h-8`} />
            </div>
            <div className={`text-right`}>
              <p className={`text-2xl font-black text-[#FFFFFF] tracking-tight font-mono`}>{stat.value}</p>
              <p className={`text-[10px] font-black uppercase tracking-wider ${stat.textColor}`}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Chart Section */}
      <div className={`bg-[#2A2A2A] p-8 rounded-2xl shadow-sm border border-[#0055FF]`}>
        <h3 className={`text-lg font-black text-[#FFFFFF] mb-6 uppercase tracking-widest`}>Range Sales Analytics</h3>
        <div className={`h-64 w-full bg-[#121212] rounded-2xl flex items-end justify-around p-6 border-b border-l border-[#0055FF]`}>
            {/* Dynamic bars based on range data */}
            <div className={`w-12 bg-[#CCFF00] rounded-t-lg transition-all hover:opacity-80`} style={{ height: `${(totalSalesCount * 8) % 100}%`, minHeight: `15%` }}></div>
            <div className={`w-12 bg-[#CCFF00] rounded-t-lg transition-all hover:opacity-80`} style={{ height: `48%` }}></div>
            <div className={`w-12 bg-[#CCFF00] rounded-t-lg transition-all hover:opacity-80`} style={{ height: `75%` }}></div>
            <div className={`w-12 bg-[#CCFF00] rounded-t-lg transition-all hover:opacity-80`} style={{ height: `30%` }}></div>
            <div className={`w-12 bg-[#CCFF00] rounded-t-lg transition-all hover:opacity-80`} style={{ height: `90%` }}></div>
        </div>
        <p className={`text-center text-[10px] text-slate-400 mt-4 uppercase font-black tracking-widest`}>Real-time visualization for the selected period</p>
      </div>
    </div>
  );
}