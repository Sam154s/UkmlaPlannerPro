// API service for connecting to the backend

// Use the current host for API requests - works with both local and deployed environments
const API_BASE = '';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization if user is logged in
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    if (userData.token) {
      requestHeaders.Authorization = `Bearer ${userData.token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  // Ensure endpoint starts with a slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  try {
    const response = await fetch(`${API_BASE}${normalizedEndpoint}`, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } else {
      // Handle non-JSON responses (like text or other formats)
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `API request failed with status: ${response.status}`);
      }
      
      return await response.text() as unknown as T;
    }
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// API endpoint utilities
export const api = {
  // User authentication
  auth: {
    login: (credentials: { username: string; password: string }) => 
      apiRequest('/api/login', { method: 'POST', body: credentials }),
    register: (userData: { username: string; password: string }) => 
      apiRequest('/api/register', { method: 'POST', body: userData }),
    logout: () => apiRequest('/api/logout', { method: 'POST' }),
    getUser: () => apiRequest('/api/user'),
  },
  
  // Timetable endpoints
  timetable: {
    save: (timetableData: any) => 
      apiRequest('/api/timetable', { method: 'POST', body: timetableData }),
    get: () => apiRequest('/api/timetable'),
  },
  
  // Subject ratings endpoints
  subjects: {
    save: (subjectRatings: any) => 
      apiRequest('/api/subjects/ratings', { method: 'POST', body: subjectRatings }),
    get: () => apiRequest('/api/subjects/ratings'),
  },
  
  // Exam settings endpoints
  exams: {
    save: (examSettings: any) => 
      apiRequest('/api/exams', { method: 'POST', body: examSettings }),
    get: () => apiRequest('/api/exams'),
  },
  
  // User performance data endpoints
  performance: {
    save: (performanceData: any) => 
      apiRequest('/api/performance', { method: 'POST', body: performanceData }),
    get: () => apiRequest('/api/performance'),
  },
};