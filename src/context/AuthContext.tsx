import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYEE';
    avatarInitials: string;
    designation?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (role: 'ADMIN' | 'EMPLOYEE', method?: 'CREDENTIALS' | 'MICROSOFT') => void;
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

    const login = (role: 'ADMIN' | 'EMPLOYEE', method: 'CREDENTIALS' | 'MICROSOFT' = 'CREDENTIALS') => {
        let mockUser: AuthUser;

        if (role === 'ADMIN') {
            mockUser = {
                id: 'admin_1',
                name: 'Dhiraj Vasu',
                email: 'admin@credence.com',
                role: 'ADMIN',
                avatarInitials: 'DV',
                designation: 'Co-Founder & CEO'
            };
        } else {
            // Employee Profile
            mockUser = {
                id: 'emp_1',
                name: method === 'MICROSOFT' ? 'Sarah Jenkins (MS)' : 'Sarah Jenkins',
                email: 'sarah.j@credence.com',
                role: 'EMPLOYEE',
                avatarInitials: 'SJ',
                designation: 'Senior Structural Engineer'
            };
        }

        setUser(mockUser);
        localStorage.setItem('credence_user', JSON.stringify(mockUser));
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
