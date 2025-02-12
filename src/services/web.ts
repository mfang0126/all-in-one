import axios, { AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_PTE_API_KEY;
  if (!token) {
    console.error('API Key not found in environment variables');
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
  const response = await apiClient.get<TResponse>(url, config);
  return response.data;
}

export async function post<TResponse, TData>(url: string, data: TData, config?: AxiosRequestConfig): Promise<TResponse> {
  const response = await apiClient.post<TResponse>(url, data, config);
  return response.data;
}

export async function put<TResponse, TData>(url: string, data: TData, config?: AxiosRequestConfig): Promise<TResponse> {
  const response = await apiClient.put<TResponse>(url, data, config);
  return response.data;
}

export async function del<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
  const response = await apiClient.delete<TResponse>(url, config);
  return response.data;
}

// Special method for handling FormData
export async function postFormData<TResponse>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<TResponse> {
  const response = await apiClient.post<TResponse>(url, formData, {
    ...config,
    headers: {
      ...config?.headers,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}
