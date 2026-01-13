import React from 'react';
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
    CalendarDays,
    ShieldAlert,
    LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';

const Sidebar: React.FC = () => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Time Tracker', path: '/live-tracking', icon: Clock },
        { name: 'Projects', path: '/projects', icon: Briefcase },
        { name: 'Tasks / Categories', path: '/tasks', icon: CheckSquare },
        { name: 'Clients', path: '/clients', icon: Users },
        { name: 'Team / Employees', path: '/team', icon: UserCheck },
        { name: 'Approvals', path: '/approvals', icon: FileCheck },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
        { name: 'Invoices / Billing', path: '/invoices', icon: Receipt },
        { name: 'Payroll / Costing', path: '/payroll', icon: DollarSign },
        { name: 'Leaves / Holidays', path: '/leaves', icon: CalendarDays },
        { name: 'Settings', path: '/settings', icon: Settings },
        { name: 'Audit Logs', path: '/audit-logs', icon: ShieldAlert },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
                <span className="text-xl font-bold text-white tracking-wider">CREDENCE</span>
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

            <div className="p-4 border-t border-slate-800 bg-slate-950">
                <button
                    onClick={() => window.location.href = '/login'}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
