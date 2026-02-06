'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
                <p className="text-gray-700 mb-6 max-w-md">
                    {error.message || 'A critical error occurred preventing the application from loading.'}
                </p>
                <p className="text-sm text-gray-500 mb-8 font-mono bg-gray-200 p-2 rounded">
                    Digest: {error.digest}
                </p>
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Try again
                </button>
            </body>
        </html>
    );
}
