import React from 'react';
import {
    Building2, Users, Briefcase, Clock, FileText,
    DollarSign, Tags, Bell, Mail, Shield, Database,
    Zap, Cloud, ChevronRight
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export type SettingsSection =
    | 'COMPANY' | 'USERS' | 'PROJECTS' | 'TIMESHEETS'
    | 'BILLING' | 'PAYROLL' | 'CATEGORIES' | 'NOTIFICATIONS'
    | 'EMAIL' | 'SECURITY' | 'BACKUP' | 'DATA' | 'INTEGRATIONS';

interface SettingsSidebarProps {
    activeSection: SettingsSection;
    onSelectSection: (section: SettingsSection) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection, onSelectSection }) => {
    const menuItems = [
        { id: 'COMPANY', label: 'Company Profile', icon: Building2 },
        { id: 'USERS', label: 'User Management', icon: Users },
        { id: 'PROJECTS', label: 'Projects & Clients', icon: Briefcase },
        { id: 'TIMESHEETS', label: 'Timesheet Rules', icon: Clock },
        { id: 'BILLING', label: 'Billing & Invoices', icon: FileText },
        { id: 'PAYROLL', label: 'Payroll & Costing', icon: DollarSign },
        { id: 'CATEGORIES', label: 'Categories & Tasks', icon: Tags },
        { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
        { id: 'EMAIL', label: 'Email Configuration', icon: Mail },
        { id: 'SECURITY', label: 'Security & Access', icon: Shield },
        { id: 'BACKUP', label: 'Backup & Restore', icon: Cloud },
        { id: 'DATA', label: 'Audit Logs', icon: Database },
        { id: 'INTEGRATIONS', label: 'Integrations', icon: Zap },
    ];

    return (
        <nav className="flex flex-col space-y-1.5 p-2">
            <div className="px-4 py-3 mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Settings Center</p>
            </div>
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                    <button
                        key={item.id}
                        onClick={() => onSelectSection(item.id as SettingsSection)}
                        className={cn(
                            "flex items-center w-full px-5 py-4 text-sm font-bold rounded-xl transition-all group relative overflow-hidden",
                            isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        <Icon className={cn("w-5 h-5 mr-4 flex-shrink-0 transition-colors duration-300",
                            isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-500"
                        )} />
                        <span className="flex-1 text-left tracking-tight">{item.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-2 opacity-100 translate-x-0 transition-transform" />}
                        {!isActive && (
                            <ChevronRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all" />
                        )}
                    </button>
                );
            })}
        </nav>
    );
};

export default SettingsSidebar;
