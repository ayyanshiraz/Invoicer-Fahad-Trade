import sql from "@/lib/db";
import { redirect } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

// [SEO Friendly] Metadata Section
export const metadata = {
  title: `Edit Customer - Fahad Traders`,
  description: `Update existing customer details and visit schedules`,
  seoTitle: `Modify Customer Record - Fahad Traders`,
  slug: `dashboard/customers/edit`,
  metaDescription: `Change WhatsApp numbers, addresses or visit days for registered customers`,
  focusKeyPhrase: `Edit Customer Data`,
  seoKeyPhrase: `Update Business Contacts UAE`,
};

// Next.js 15+ me params aik Promise hota hai
export default async function EditCustomerPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Params ko await krna zaroori hai
  const { id } = await params;

  // 2. Database se customer fetch krna
  // Humne ID ko Number me convert kiya h taake DB match sahi ho
  const customerResult = await sql`SELECT * FROM customers WHERE id = ${Number(id)}`;
  const customer = customerResult[0];

  if (!customer) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-xl font-semibold text-gray-600">Customer not found in database.</p>
        <Link href="/dashboard/customers" className="text-blue-600 underline">
          Go back to list
        </Link>
      </div>
    );
  }

  // 3. Update Function
  async function updateCustomer(formData: FormData) {
    "use server";
    
    const name = formData.get(`name`);
    const id_card = formData.get(`id_card`);
    const whatsapp = formData.get(`whatsapp`);
    const address = formData.get(`address`);
    const visit_day = formData.get(`visit_day`);

    await sql`
      UPDATE customers 
      SET name = ${name as string}, 
          id_card = ${id_card as string}, 
          whatsapp_number = ${whatsapp as string}, 
          address = ${address as string}, 
          visit_day = ${visit_day as string}
      WHERE id = ${Number(id)}
    `;

    redirect(`/dashboard/customers`);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/customers" className="flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to List
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Customer Details</h2>
        
        <form action={updateCustomer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              defaultValue={customer.name}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Card Number</label>
              <input
                name="id_card"
                type="text"
                defaultValue={customer.id_card}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input
                name="whatsapp"
                type="text"
                defaultValue={customer.whatsapp_number}
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              rows={3}
              defaultValue={customer.address}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visit Day</label>
            <select
              name="visit_day"
              defaultValue={customer.visit_day}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            Update Customer Record
          </button>
        </form>
      </div>
    </div>
  );
}