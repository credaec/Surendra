import React from 'react';
import {
    Building2,
    Users,
    Briefcase,
    Clock,
    Receipt,
    DollarSign,
    ListChecks,
    Bell,
    Shield,
    Database,
    Waypoints
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export type SettingsSection =
    | 'COMPANY'
    | 'USERS'
    | 'PROJECTS'
    | 'TIMESHEETS'
    | 'BILLING'
    | 'PAYROLL'
    | 'CATEGORIES'
    | 'NOTIFICATIONS'
    | 'SECURITY'
    | 'DATA'
    | 'INTEGRATIONS';

interface SettingsSidebarProps {
    activeSection: SettingsSection;
    onSelectSection: (section: SettingsSection) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection, onSelectSection }) => {

    const menuItems: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
        { id: 'COMPANY', label: 'Company Setup', icon: Building2 },
        { id: 'USERS', label: 'Users & Roles', icon: Users },
        { id: 'PROJECTS', label: 'Projects & Clients', icon: Briefcase },
        { id: 'TIMESHEETS', label: 'Timesheet Rules', icon: Clock },
        { id: 'BILLING', label: 'Billing & Invoices', icon: Receipt },
        { id: 'PAYROLL', label: 'Payroll & Costing', icon: DollarSign },
        { id: 'CATEGORIES', label: 'Categories & Tasks', icon: ListChecks },
        { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
        { id: 'SECURITY', label: 'Security & Access', icon: Shield },
        { id: 'DATA', label: 'Data & Audit Logs', icon: Database },
        { id: 'INTEGRATIONS', label: 'Integrations', icon: Waypoints },
    ];

    return (
        <div className="w-64 flex-shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-fit">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
                <h3 className="font-semibold text-slate-700">Settings Menu</h3>
            </div>
            <nav className="p-2 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelectSection(item.id)}
                        className={cn(
                            "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                            activeSection === item.id
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <item.icon className={cn("h-4 w-4 mr-3", activeSection === item.id ? "text-blue-600" : "text-slate-400")} />
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default SettingsSidebar;
