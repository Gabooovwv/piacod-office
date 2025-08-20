// API Configuration for switching between Next.js API routes and Express backend
const API_CONFIG = {
    // Set to 'backend' to use Express backend, 'nextjs' to use Next.js API routes
    mode: process.env.NEXT_PUBLIC_API_MODE || 'nextjs',
    
    // Express backend URL
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002',
    
    // Next.js API routes base URL (relative)
    nextjsUrl: '/api'
};

// Helper function to get the base URL for API calls
export const getApiBaseUrl = () => {
    return API_CONFIG.mode === 'backend' ? API_CONFIG.backendUrl : API_CONFIG.nextjsUrl;
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
    const baseUrl = getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
};

// API endpoints mapping
export const API_ENDPOINTS = {
    products: {
        list: () => buildApiUrl('/products'),
        get: (id) => buildApiUrl(`/products/${id}`),
        update: (id) => buildApiUrl(`/products/${id}`),
        delete: (id) => buildApiUrl(`/products/${id}`),
    },
    categories: {
        list: () => buildApiUrl('/categories'),
        get: (id) => buildApiUrl(`/categories/${id}`),
        subcategories: (id) => buildApiUrl(`/categories/${id}/subcategories`),
    },
    auth: {
        login: () => buildApiUrl('/auth/login'),
        logout: () => buildApiUrl('/auth/logout'),
        me: () => buildApiUrl('/auth/me'),
        validate: () => buildApiUrl('/auth/validate'),
    }
};

export default API_CONFIG; 