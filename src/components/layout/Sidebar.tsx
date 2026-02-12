import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Clock,
    Briefcase,
    CheckSquare,
    Users,
    UserCheck,
    FileCheck,
    BarChart3,
    Receipt,
    Settings,
    DollarSign,
    Calendar,
    LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import RoleSwitcher from './RoleSwitcher';
import { useAuth } from '../../context/AuthContext';
import { settingsService, type AppSettings } from '../../services/settingsService';

const Sidebar: React.FC = () => {
    const { logout } = useAuth();
    const [settings, setSettings] = useState<AppSettings | null>(null);

    useEffect(() => {
        const load = async () => {
            const s = await settingsService.getSettings();
            setSettings(s);
        };
        load();
    }, []);

    const companyName = settings?.company.name || 'Pulse';
    const companyLogo = settings?.company.logoUrl;

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Time Tracker', path: '/admin/timesheets', icon: Clock },
        { name: 'Projects', path: '/admin/projects', icon: Briefcase },
        { name: 'Tasks / Categories', path: '/admin/tasks', icon: CheckSquare },
        { name: 'Clients', path: '/admin/clients', icon: Users },
        { name: 'Team / Employees', path: '/admin/team', icon: UserCheck },
        { name: 'Approvals', path: '/admin/approvals', icon: FileCheck },
        { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
        { name: 'Invoices / Billing', path: '/admin/billing/invoices', icon: Receipt },
        { name: 'Payroll / Costing', path: '/admin/payroll', icon: DollarSign },
        { name: 'Team Availability', path: '/admin/availability', icon: Calendar },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <aside className="w-72 flex flex-col h-screen fixed top-0 left-0 border-r border-slate-200 dark:border-border bg-white dark:bg-elevated transition-all duration-300 z-50">
            {/* Logo Section */}
            <div className="h-24 flex items-center px-8 border-b border-slate-100 dark:border-border bg-slate-50/50 dark:bg-background/20">
                <div className="flex items-center space-x-3.5 group cursor-pointer">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                        {companyLogo ? (
                            <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white font-black text-xl italic tracking-tighter">
                                {companyName.substring(0, 1).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none truncate max-w-[140px]">
                            {companyName.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mt-0.5">Admin Portal</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-5 space-y-1.5 overflow-y-auto no-scrollbar">
                <div className="px-4 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Main Menu</p>
                </div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-1"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn(
                                    "h-5 w-5 mr-3.5 transition-all duration-300",
                                    isActive ? "text-white scale-110" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:scale-110"
                                )} />
                                <span className="relative z-10">{item.name}</span>
                                {isActive && (
                                    <div className="absolute right-4 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Role Switcher & Bottom Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-border mt-auto">
                <RoleSwitcher currentMode="ADMIN" />

                <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-4 mt-4 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition-all duration-300 group"
                >
                    <LogOut className="h-5 w-5 mr-3.5 transition-transform group-hover:-translate-x-1" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
