import React, { createContext, useContext, useState, useEffect } from 'react';
import { backendService } from '../services/backendService';

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
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    // Persist login
    useEffect(() => {
        const storedUser = localStorage.getItem('pulse_user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            backendService.initialize();
        }
    }, []);

    useEffect(() => {
        if (user) {
            backendService.initialize();
        }
    }, [user]);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Login failed');
            }

            const { token, user: authUser } = await res.json();

            setUser(authUser);
            localStorage.setItem('pulse_user', JSON.stringify(authUser));
            localStorage.setItem('pulse_token', token);
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pulse_user');
        localStorage.removeItem('pulse_token');
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
