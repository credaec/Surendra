import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { backendService } from '../../services/backendService';
import { cn } from '../../lib/utils';

interface RoleSwitcherProps {
    currentMode: 'ADMIN' | 'EMPLOYEE';
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentMode }) => {
    const { user } = useAuth();

    if (!user) return null;

    const isAdminView = currentMode === 'ADMIN';

    const realUser = backendService.getUsers().find(u => u.id === user.id);

    if (!realUser || realUser.role !== 'ADMIN') {
        return null;
    }

    const handleSwitch = () => {
        const targetRole = isAdminView ? 'EMPLOYEE' : 'ADMIN';
        const targetUrl = isAdminView ? '/employee/dashboard' : '/admin/dashboard';
        const updatedUser = { ...user, role: targetRole };
        localStorage.setItem('pulse_user', JSON.stringify(updatedUser));
        window.location.href = targetUrl;
    };

    return (
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 mb-2">
            <div className="flex items-center space-x-2 pl-1">
                <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isAdminView ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                )} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {isAdminView ? 'Admin Hub' : 'User Portal'}
                </span>
            </div>

            <button
                onClick={handleSwitch}
                className={cn(
                    "relative w-10 h-5 rounded-full transition-all duration-500 group overflow-hidden",
                    isAdminView ? "bg-blue-600/20 border border-blue-500/20" : "bg-emerald-600/20 border border-emerald-500/20"
                )}
            >
                {/* Track Background on Hover */}
                <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    isAdminView ? "bg-blue-600" : "bg-emerald-600"
                )} />

                {/* Knob */}
                <div className={cn(
                    "absolute top-1 w-2.5 h-2.5 rounded-full transition-all duration-500 z-10 shadow-sm",
                    isAdminView
                        ? "left-1 bg-blue-500 group-hover:bg-white"
                        : "left-6 bg-emerald-500 group-hover:bg-white"
                )} />
            </button>
        </div>
    );
};

export default RoleSwitcher;

