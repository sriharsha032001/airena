export default function PricingPolicy() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4 sm:px-8 text-gray-900" style={{ fontFamily: 'Inter, Open Sans, ui-sans-serif, sans-serif' }}>
      <h1 className="text-3xl font-bold mb-6">Pricing Policy</h1>
      <p className="mb-4">At AIrena, we believe in complete transparency. All pricing information is clearly displayed on our <a href="/pricing" className="text-blue-600 underline">Pricing</a> page.</p>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Users are billed according to their selected plan or credit purchase.</li>
        <li>There are <strong>no hidden charges</strong>—what you see is what you pay.</li>
        <li>If prices change, we will notify customers in advance via email or in-app notification.</li>
      </ul>
      <p>For detailed pricing, please visit our <a href="/pricing" className="text-blue-600 underline">Pricing</a> page.</p>
    </main>
  );
} 