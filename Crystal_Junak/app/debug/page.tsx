import { createClient } from '@/utils/supabase/server';

export default async function DebugPage() {
    const supabase = await createClient();
    const { data: products, error } = await supabase.from('products').select('*').limit(1);

    if (error) {
        return <div className="p-10 text-red-500">Error: {JSON.stringify(error)}</div>;
    }

    const firstProduct = products?.[0] || {};
    const keys = Object.keys(firstProduct);

    return (
        <div className="p-10 font-mono text-sm max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Database Schema Debugger</h1>

            <div className="bg-gray-100 p-6 rounded-xl mb-8">
                <h3 className="font-bold mb-2">Supabase Connection (Client-Side)</h3>
                <div className="flex flex-wrap gap-2">
                    {keys.length > 0 ? keys.map(k => (
                        <span key={k} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                            {k}
                        </span>
                    )) : (
                        <span className="text-gray-500">No products found to inspect schema.</span>
                    )}
                </div>
            </div>

            <h2 className="font-bold mb-4">Sample Data (First Product)</h2>
            <pre className="bg-slate-900 text-green-400 p-6 rounded-xl overflow-auto">
                {JSON.stringify(firstProduct, null, 2)}
            </pre>
        </div>
    );
}
