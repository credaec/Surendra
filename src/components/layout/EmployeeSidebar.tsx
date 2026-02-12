import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Timer,
    CalendarCheck,
    FolderOpen,
    BarChart3,
    LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import RoleSwitcher from './RoleSwitcher';
import { settingsService, type AppSettings } from '../../services/settingsService';

const EmployeeSidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
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
        { name: t('My Dashboard', 'My Dashboard'), path: '/employee/dashboard', icon: LayoutDashboard },
        { name: t('Live Timer', 'Live Timer'), path: '/employee/timer', icon: Timer },
        { name: t('Timesheet', 'Timesheet'), path: '/employee/timesheet', icon: CalendarCheck },
        { name: t('My Projects', 'My Projects'), path: '/employee/projects', icon: FolderOpen },
        { name: t('My Reports', 'My Reports'), path: '/employee/reports', icon: BarChart3 },
    ];

    return (
        <aside className="w-72 flex flex-col h-screen fixed top-0 left-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-50">
            {/* Brand Header */}
            <div className="h-24 flex items-center px-8 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center space-x-3.5 group cursor-pointer">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
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
                        <div className="flex items-center mt-0.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Employee</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Profile Snippet */}
            <div className="px-6 py-8">
                <div className="p-1.5 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                    <div className="bg-white dark:bg-slate-900 rounded-[1.7rem] p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 p-1 mb-4 shadow-xl shadow-emerald-500/20">
                            <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-2xl font-black text-slate-900 dark:text-white border-4 border-transparent">
                                {user?.avatarInitials}
                            </div>
                        </div>

                        <div className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">{user?.name}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{user?.designation}</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-5 space-y-1.5 overflow-y-auto no-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 translate-x-1"
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
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <RoleSwitcher currentMode="EMPLOYEE" />
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

export default EmployeeSidebar;
