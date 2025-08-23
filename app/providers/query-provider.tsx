'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const defaultFetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Request failed' }));
    const error = new Error(errorData.message || `HTTP error! status: ${res.status}`) as any;
    error.status = res.status;
    error.statusCode = res.status;
    throw error;
  }
  
  return res.json();
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          queryFn: ({ queryKey }) => {
            const url = Array.isArray(queryKey) ? queryKey.join('/') : queryKey as string;
            return defaultFetcher(url);
          },
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}