"use client";
import { useState } from "react";
import { RotateCcw, Search, Package, Save } from "lucide-react";
import { processReturnAction } from "./actions";

/**
 * [SEO Friendly]
 * seo title: Sale Return Management - Fahad Traders
 * slug: dashboard/invoice/return
 * meta description: Process sales returns and adjust inventory for Fahad Traders in UAE
 * focus key phrase: Sale Return
 * seo key phrase: Sales Returns System UAE
 * img alt text: Sale Return Search and Items Table View
 * seo keywords: return, invoice, inventory, fahad traders
 */

export default function SaleReturnPage() {
  const [invoiceId, setInvoiceId] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Search function to find invoice from API
  const handleSearch = async () => {
    if (!invoiceId) {
      alert("Please enter an Invoice ID first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`);
      if (!res.ok) throw new Error("Invoice not found");
      const result = await res.json();
      setData(result);
    } catch (error) {
      alert("Could not find invoice. Please check the ID.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Return Handler to trigger Server Action
  const handleReturn = async (itemId: number, qty: number, price: number) => {
    const confirmReturn = confirm(`Proceed with returning this product?`);
    if (!confirmReturn) return;

    try {
      await processReturnAction(Number(invoiceId), itemId, qty, price);
      alert(`Product return processed successfully`);
      // UI refresh krne k liye dobara search trigger krein
      handleSearch(); 
    } catch (error) {
      console.error(error);
      alert(`Error processing the return request`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="p-3 bg-red-600 text-white rounded-lg">
          <RotateCcw className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Process Sale Return</h1>
          <p className="text-sm text-gray-500">Search invoice to return products to stock</p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-3">
          <input 
            type="text"
            placeholder="Search Invoice ID for example 1"
            className="flex-1 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
            {loading ? "Searching..." : "Find Invoice"}
          </button>
        </div>
      </div>

      {data ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Invoice Info Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 font-bold uppercase">Customer Name</p>
              <p className="text-lg font-bold text-slate-800">{data.invoice.customer_name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600 font-bold uppercase">Current Total</p>
              <p className="text-lg font-bold text-slate-800">PKR {data.invoice.total_amount}</p>
            </div>
          </div>

          {/* Items List Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Product Description</th>
                  <th className="px-6 py-4">Sold Qty</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-800 font-medium">{item.product_description}</td>
                    <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                    <td className="px-6 py-4 text-gray-600">{item.unit_price}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleReturn(item.id, item.quantity, item.unit_price)}
                        className="flex items-center gap-1 mx-auto bg-red-50 text-red-600 px-3 py-1 rounded-md font-bold hover:bg-red-100 transition-colors text-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Return All
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-dashed border-gray-200 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No data loaded. Enter a valid ID to start return process.</p>
        </div>
      )}
    </div>
  );
}