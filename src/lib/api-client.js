import { API_ENDPOINTS } from './api-config';

// API client with error handling and response processing
class ApiClient {
    constructor() {
        this.baseConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

    // Generic request method
    async request(url, options = {}) {
        const config = {
            ...this.baseConfig,
            ...options,
            headers: {
                ...this.baseConfig.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            
            // Handle non-2xx responses
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            // Handle empty responses
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // GET request
    async get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }

    // POST request
    async post(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // PATCH request
    async patch(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // DELETE request
    async delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }

    // Product API methods
    async getProducts(params = {}) {
        const url = new URL(API_ENDPOINTS.products.list());
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });
        return this.get(url.toString());
    }

    async getProduct(id) {
        return this.get(API_ENDPOINTS.products.get(id));
    }

    async updateProductStatus(id, isActive) {
        return this.patch(API_ENDPOINTS.products.update(id), { is_active: isActive });
    }

    async deleteProduct(id) {
        return this.delete(API_ENDPOINTS.products.delete(id));
    }

    // Category API methods
    async getCategories() {
        return this.get(API_ENDPOINTS.categories.list());
    }

    async getCategory(id) {
        return this.get(API_ENDPOINTS.categories.get(id));
    }

    async getSubcategories(parentId) {
        return this.get(API_ENDPOINTS.categories.subcategories(parentId));
    }

    // Auth API methods
    async login(email, password) {
        return this.post(API_ENDPOINTS.auth.login(), { email, password });
    }

    async logout() {
        return this.post(API_ENDPOINTS.auth.logout());
    }

    async getCurrentUser() {
        return this.get(API_ENDPOINTS.auth.me());
    }

    async validateToken(token) {
        return this.post(API_ENDPOINTS.auth.validate(), { token });
    }

    // Helper method to set auth header
    setAuthToken(token) {
        this.baseConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Helper method to clear auth header
    clearAuthToken() {
        delete this.baseConfig.headers.Authorization;
    }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient; 