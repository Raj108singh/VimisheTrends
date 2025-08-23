// API utility functions for Next.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.replit.app' 
  : 'http://localhost:5000';

export async function apiRequest(method: string, endpoint: string, data?: any) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    const error = new Error(errorData.message || `HTTP error! status: ${response.status}`) as any;
    error.status = response.status;
    error.statusCode = response.status;
    throw error;
  }

  return response;
}

// Create a query client instance
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = Array.isArray(queryKey) ? queryKey.join('/') : queryKey as string;
        const response = await fetch(`${API_BASE_URL}${url}`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
          const error = new Error(errorData.message || `HTTP error! status: ${response.status}`) as any;
          error.status = response.status;
          error.statusCode = response.status;
          throw error;
        }
        
        return response.json();
      },
    },
  },
});