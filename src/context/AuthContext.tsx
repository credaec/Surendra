import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockBackend } from '../services/mockBackend';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYEE';
    avatarInitials: string;
    designation?: string;
    department?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, role: 'ADMIN' | 'EMPLOYEE') => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    // Persist login (Mock)
    useEffect(() => {
        const storedUser = localStorage.getItem('credence_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, role: 'ADMIN' | 'EMPLOYEE') => {
        // Find user in mock backend
        const users = mockBackend.getUsers();
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);

        if (foundUser) {
            const authUser: AuthUser = {
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
                avatarInitials: foundUser.avatarInitials,
                designation: foundUser.designation,
                department: foundUser.department // Added department to AuthUser if needed, add to interface too
            };
            setUser(authUser);
            localStorage.setItem('credence_user', JSON.stringify(authUser));
        } else {
            throw new Error('Invalid credentials or role');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('credence_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
