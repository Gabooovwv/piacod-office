import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { users, User } from './mock-data';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

export const generateToken = (user: User): string => {
    const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
    const user = users.find(u => u.email === email);

    if (!user) {
        return null;
    }

    // In a real app, you would compare hashed passwords
    // For this demo, we're doing plain text comparison
    if (user.password === password) {
        return user;
    }

    return null;
};

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
}; 