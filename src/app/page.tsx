import sql from '@/lib/db';

export default async function Home() {
  // Direct database fetch using your Neon connection
  const invoices = await sql`SELECT * FROM invoices ORDER BY created_at DESC`;

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">FahadTrade Invoices</h1>
      
      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="p-4 border rounded-lg shadow-sm bg-white text-black">
            <h2 className="font-semibold">{invoice.client_name}</h2>
            <p className="text-gray-600">${invoice.amount}</p>
            <span className={`text-sm px-2 py-1 rounded ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {invoice.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}