export interface CommonHttpResponse<T> {
  status: string; // e.g., 'success', 'error'
  message: string; // e.g., 'Data fetched successfully', 'Error occurred'
  data: T; // The actual data returned by the API
  error?: string; // Optional error message if status is 'error'
}