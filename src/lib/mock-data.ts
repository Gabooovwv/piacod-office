export interface User {
    id: string;
    email: string;
    password: string; // In real app, this would be hashed
    name: string;
    role: 'admin' | 'user';
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    subcategory?: string;
    stock: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    is_active?: boolean;
    is_enabled?: boolean;
    parent_id?: number;
}

// Mock users
export const users: User[] = [
    {
        id: '1',
        email: 'admin@example.com',
        password: 'admin123', // In real app, this would be hashed
        name: 'Admin User',
        role: 'admin'
    }
];

// Mock products
export const products: Product[] = [
    {
        id: '1',
        name: 'Laptop Dell XPS 13',
        description: 'High-performance laptop with Intel i7 processor',
        price: 1299.99,
        category: 'Electronics',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '2',
        name: 'Wireless Headphones',
        description: 'Noise-cancelling wireless headphones with premium sound',
        price: 299.99,
        category: 'Audio',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        createdAt: '2024-01-10T14:30:00Z',
        updatedAt: '2024-01-12T09:15:00Z'
    },
    {
        id: '3',
        name: 'Smartphone Samsung Galaxy S24',
        description: 'Latest smartphone with advanced camera system',
        price: 899.99,
        category: 'Electronics',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        createdAt: '2024-01-08T16:45:00Z',
        updatedAt: '2024-01-14T11:20:00Z'
    },
    {
        id: '4',
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe',
        price: 89.99,
        category: 'Home & Kitchen',
        stock: 32,
        imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
        createdAt: '2024-01-05T12:00:00Z',
        updatedAt: '2024-01-05T12:00:00Z'
    },
    {
        id: '5',
        name: 'Fitness Tracker',
        description: 'Water-resistant fitness tracker with heart rate monitor',
        price: 149.99,
        category: 'Health & Fitness',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
        createdAt: '2024-01-12T08:30:00Z',
        updatedAt: '2024-01-13T15:45:00Z'
    }
];

// Categories for the dropdown
export const categories = [
    'Electronics',
    'Audio',
    'Home & Kitchen',
    'Health & Fitness',
    'Clothing',
    'Books',
    'Sports',
    'Toys & Games'
]; 