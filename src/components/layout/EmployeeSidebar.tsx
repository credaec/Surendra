import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Timer,
    CalendarCheck,
    FolderOpen,
    BarChart3
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import RoleSwitcher from './RoleSwitcher';

const EmployeeSidebar: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    const navItems = [
        { name: t('My Dashboard', 'My Dashboard'), path: '/employee/dashboard', icon: LayoutDashboard },
        { name: t('Live Timer', 'Live Timer'), path: '/employee/timer', icon: Timer },
        { name: t('Timesheet', 'Timesheet'), path: '/employee/timesheet', icon: CalendarCheck },
        { name: t('My Projects', 'My Projects'), path: '/employee/projects', icon: FolderOpen },
        { name: t('My Reports', 'My Reports'), path: '/employee/reports', icon: BarChart3 },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
                <span className="text-xl font-bold text-white tracking-wider">CREDENCE</span>
                <span className="ml-2 text-xs font-medium text-emerald-400 border border-emerald-400/30 px-1.5 py-0.5 rounded">EMP</span>
            </div>

            {/* User Profile Snippet */}
            <div className="p-4 bg-slate-900/50 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {user?.avatarInitials}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white">{user?.name}</div>
                        <div className="text-xs text-slate-500">{user?.designation}</div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "hover:bg-slate-800 hover:text-white"
                            )
                        }
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <RoleSwitcher currentMode="EMPLOYEE" />
        </aside>
    );
};

export default EmployeeSidebar;
