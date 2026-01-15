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
    Calendar
} from 'lucide-react';
import { cn } from '../../lib/utils';
import RoleSwitcher from './RoleSwitcher';

const Sidebar: React.FC = () => {
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



            <RoleSwitcher currentMode="ADMIN" />
        </aside>
    );
};

export default Sidebar;
